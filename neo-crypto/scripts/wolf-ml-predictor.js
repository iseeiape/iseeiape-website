#!/usr/bin/env node

/**
 * Wolf Pack ML Predictor - Machine Learning for Alert Prediction
 * 
 * This module analyzes historical Wolf Pack performance data
 * to predict future alert success and generate trading signals.
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Configuration
const CONFIG = {
  performanceDb: '/home/matrix/.openclaw/workspace/wolf_performance.db',
  outputDir: path.join(__dirname, '../data/wolf-ml'),
  modelFile: path.join(__dirname, '../data/wolf-ml/model.json'),
  
  // ML parameters
  minSamples: 50,
  predictionHorizon: 60, // minutes
  confidenceThreshold: 0.7
};

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`📁 Created directory: ${CONFIG.outputDir}`);
  }
}

// Load performance data from SQLite
function loadPerformanceData() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(CONFIG.performanceDb, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        reject(err);
        return;
      }
      
      const query = `
        SELECT 
          id,
          timestamp,
          token,
          symbol,
          category,
          score,
          price_at_alert,
          volume_at_alert,
          change_5m,
          change_1h,
          price_1h_later,
          price_4h_later,
          price_24h_later,
          max_gain_24h,
          max_drawdown_24h,
          success_1h,
          success_4h,
          success_24h
        FROM alerts
        WHERE price_at_alert IS NOT NULL
        AND price_1h_later IS NOT NULL
        ORDER BY timestamp DESC
        LIMIT 1000
      `;
      
      db.all(query, [], (err, rows) => {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });
}

// Feature engineering
function extractFeatures(alerts) {
  console.log(`📊 Extracting features from ${alerts.length} alerts...`);
  
  const features = [];
  
  for (const alert of alerts) {
    // Basic features
    const feature = {
      timestamp: alert.timestamp,
      token: alert.symbol,
      category: alert.category,
      
      // Numerical features
      score: alert.score || 0,
      price: alert.price_at_alert || 0,
      volume: alert.volume_at_alert || 0,
      change5m: alert.change_5m || 0,
      change1h: alert.change_1h || 0,
      
      // Derived features
      volumeToPriceRatio: alert.volume_at_alert && alert.price_at_alert 
        ? alert.volume_at_alert / alert.price_at_alert 
        : 0,
      scoreWeightedChange: alert.score && alert.change_5m
        ? alert.score * (alert.change_5m / 100)
        : 0,
      
      // Labels (target variables)
      priceChange1h: alert.price_1h_later && alert.price_at_alert
        ? ((alert.price_1h_later - alert.price_at_alert) / alert.price_at_alert) * 100
        : null,
      priceChange4h: alert.price_4h_later && alert.price_at_alert
        ? ((alert.price_4h_later - alert.price_at_alert) / alert.price_at_alert) * 100
        : null,
      priceChange24h: alert.price_24h_later && alert.price_at_alert
        ? ((alert.price_24h_later - alert.price_at_alert) / alert.price_at_alert) * 100
        : null,
      
      success1h: alert.success_1h || 0,
      success4h: alert.success_4h || 0,
      success24h: alert.success_24h || 0,
      maxGain24h: alert.max_gain_24h || 0,
      maxDrawdown24h: alert.max_drawdown_24h || 0
    };
    
    features.push(feature);
  }
  
  console.log(`✅ Extracted ${features.length} feature vectors`);
  return features;
}

// Train simple ML model (linear regression for prediction)
function trainModel(features) {
  console.log('\n🧠 Training ML model...');
  
  if (features.length < CONFIG.minSamples) {
    console.log(`⚠️  Insufficient data: ${features.length} samples (need ${CONFIG.minSamples})`);
    return null;
  }
  
  // Filter features with valid labels
  const validFeatures = features.filter(f => 
    f.priceChange1h !== null && 
    f.priceChange4h !== null &&
    !isNaN(f.priceChange1h) && 
    !isNaN(f.priceChange4h)
  );
  
  if (validFeatures.length < CONFIG.minSamples) {
    console.log(`⚠️  Insufficient valid data: ${validFeatures.length} samples`);
    return null;
  }
  
  // Simple linear regression coefficients (for demonstration)
  // In production, you'd use a proper ML library like TensorFlow.js or brain.js
  
  // Calculate average performance by category
  const categoryStats = {};
  const scoreBrackets = {};
  
  for (const feature of validFeatures) {
    // Category statistics
    if (!categoryStats[feature.category]) {
      categoryStats[feature.category] = {
        count: 0,
        totalChange1h: 0,
        totalChange4h: 0,
        successCount1h: 0,
        successCount4h: 0
      };
    }
    
    const stats = categoryStats[feature.category];
    stats.count++;
    stats.totalChange1h += feature.priceChange1h;
    stats.totalChange4h += feature.priceChange4h;
    if (feature.success1h) stats.successCount1h++;
    if (feature.success4h) stats.successCount4h++;
    
    // Score bracket statistics
    const bracket = Math.floor(feature.score / 10) * 10;
    if (!scoreBrackets[bracket]) {
      scoreBrackets[bracket] = {
        count: 0,
        totalChange1h: 0,
        totalChange4h: 0
      };
    }
    
    const bracketStats = scoreBrackets[bracket];
    bracketStats.count++;
    bracketStats.totalChange1h += feature.priceChange1h;
    bracketStats.totalChange4h += feature.priceChange4h;
  }
  
  // Calculate averages
  const model = {
    metadata: {
      trainedAt: new Date().toISOString(),
      sampleCount: validFeatures.length,
      categories: Object.keys(categoryStats)
    },
    categoryPerformance: {},
    scorePerformance: {},
    featureWeights: {
      score: 0.4,
      change5m: 0.3,
      change1h: 0.2,
      volumeToPriceRatio: 0.1
    },
    thresholds: {
      highConfidence: 80,
      mediumConfidence: 60,
      minVolume: 100000
    }
  };
  
  // Populate category performance
  for (const [category, stats] of Object.entries(categoryStats)) {
    model.categoryPerformance[category] = {
      avgChange1h: stats.totalChange1h / stats.count,
      avgChange4h: stats.totalChange4h / stats.count,
      successRate1h: stats.successCount1h / stats.count,
      successRate4h: stats.successCount4h / stats.count,
      sampleCount: stats.count
    };
  }
  
  // Populate score performance
  for (const [bracket, stats] of Object.entries(scoreBrackets)) {
    model.scorePerformance[bracket] = {
      avgChange1h: stats.totalChange1h / stats.count,
      avgChange4h: stats.totalChange4h / stats.count,
      sampleCount: stats.count
    };
  }
  
  // Calculate overall statistics
  const totalChange1h = validFeatures.reduce((sum, f) => sum + f.priceChange1h, 0);
  const totalChange4h = validFeatures.reduce((sum, f) => sum + f.priceChange4h, 0);
  const successCount1h = validFeatures.filter(f => f.success1h).length;
  const successCount4h = validFeatures.filter(f => f.success4h).length;
  
  model.overall = {
    avgChange1h: totalChange1h / validFeatures.length,
    avgChange4h: totalChange4h / validFeatures.length,
    successRate1h: successCount1h / validFeatures.length,
    successRate4h: successCount4h / validFeatures.length,
    totalSamples: validFeatures.length
  };
  
  console.log(`✅ Model trained with ${validFeatures.length} samples`);
  console.log(`📈 Overall 1h success rate: ${(model.overall.successRate1h * 100).toFixed(1)}%`);
  console.log(`📈 Overall 4h success rate: ${(model.overall.successRate4h * 100).toFixed(1)}%`);
  
  return model;
}

// Predict performance for a new alert
function predictAlert(model, alert) {
  if (!model) {
    return {
      confidence: 0,
      predictedChange1h: 0,
      predictedChange4h: 0,
      riskLevel: 'unknown',
      recommendation: 'insufficient data'
    };
  }
  
  // Extract alert features
  const score = alert.score || 0;
  const change5m = alert.metrics?.change5m || 0;
  const change1h = alert.metrics?.change1h || 0;
  const volume = alert.metrics?.volume || 0;
  const price = alert.metrics?.price || 1;
  const category = alert.category || 'unknown';
  
  // Calculate volume to price ratio
  const volumeToPriceRatio = volume && price ? volume / price : 0;
  
  // Get category baseline
  const categoryPerf = model.categoryPerformance[category] || model.categoryPerformance.alpha || {
    avgChange1h: model.overall.avgChange1h,
    avgChange4h: model.overall.avgChange4h,
    successRate1h: model.overall.successRate1h,
    successRate4h: model.overall.successRate4h
  };
  
  // Get score bracket baseline
  const scoreBracket = Math.floor(score / 10) * 10;
  const scorePerf = model.scorePerformance[scoreBracket] || {
    avgChange1h: model.overall.avgChange1h,
    avgChange4h: model.overall.avgChange4h
  };
  
  // Calculate weighted prediction
  const predictedChange1h = 
    (categoryPerf.avgChange1h * 0.4) +
    (scorePerf.avgChange1h * 0.3) +
    (change5m * 0.2) +
    (change1h * 0.1);
  
  const predictedChange4h = 
    (categoryPerf.avgChange4h * 0.4) +
    (scorePerf.avgChange4h * 0.3) +
    (change5m * 0.15) +
    (change1h * 0.15);
  
  // Calculate confidence score (0-100)
  let confidence = score; // Start with Wolf Pack score
  
  // Adjust confidence based on volume
  if (volume < model.thresholds.minVolume) {
    confidence *= 0.7; // Reduce confidence for low volume
  }
  
  // Adjust confidence based on category success rate
  const categorySuccessRate = categoryPerf.successRate1h || 0.5;
  confidence *= (0.5 + categorySuccessRate);
  
  // Cap confidence
  confidence = Math.min(Math.max(confidence, 0), 100);
  
  // Determine risk level
  let riskLevel = 'high';
  let recommendation = 'avoid';
  
  if (confidence >= model.thresholds.highConfidence) {
    riskLevel = 'low';
    recommendation = predictedChange1h > 5 ? 'strong buy' : 'buy';
  } else if (confidence >= model.thresholds.mediumConfidence) {
    riskLevel = 'medium';
    recommendation = predictedChange1h > 3 ? 'buy' : 'hold';
  } else if (confidence > 40) {
    riskLevel = 'medium-high';
    recommendation = 'watch';
  }
  
  // Adjust recommendation based on predicted change
  if (predictedChange1h < -5) {
    recommendation = 'sell/short';
  } else if (predictedChange1h < 0) {
    recommendation = 'avoid';
  }
  
  return {
    confidence: Math.round(confidence),
    predictedChange1h: predictedChange1h.toFixed(2),
    predictedChange4h: predictedChange4h.toFixed(2),
    riskLevel,
    recommendation,
    factors: {
      categorySuccessRate: (categoryPerf.successRate1h * 100).toFixed(1) + '%',
      scoreBracket: scoreBracket,
      volumeAdequate: volume >= model.thresholds.minVolume,
      momentumPositive: change5m > 0 && change1h > 0
    }
  };
}

// Generate trading signals from predictions
function generateTradingSignals(alerts, predictions) {
  console.log('\n📈 Generating trading signals...');
  
  const signals = [];
  
  for (let i = 0; i < alerts.length; i++) {
    const alert = alerts[i];
    const prediction = predictions[i];
    
    if (prediction.confidence >= CONFIG.confidenceThreshold * 100) {
      const signal = {
        id: `signal_${Date.now()}_${i}`,
        timestamp: new Date().toISOString(),
        token: alert.symbol,
        symbol: alert.symbol,
        category: alert.category,
        originalScore: alert.score,
        mlScore: prediction.confidence,
        predictedChange1h: prediction.predictedChange1h,
        predictedChange4h: prediction.predictedChange4h,
        riskLevel: prediction.riskLevel,
        recommendation: prediction.recommendation,
        entryPrice: alert.metrics?.price || 'unknown',
        stopLoss: calculateStopLoss(alert.metrics?.price, prediction.riskLevel),
        takeProfit: calculateTakeProfit(alert.metrics?.price, prediction.predictedChange1h),
        factors: prediction.factors,
        alertId: alert.id
      };
      
      signals.push(signal);
    }
  }
  
  console.log(`✅ Generated ${signals.length} trading signals`);
  return signals;
}

// Calculate stop loss price
function calculateStopLoss(currentPrice, riskLevel) {
  if (!currentPrice || currentPrice === 'unknown') return 'unknown';
  
  const price = parseFloat(currentPrice);
  const riskMultipliers = {
    low: 0.95,    // 5% stop loss
    medium: 0.90, // 10% stop loss
    'medium-high': 0.85, // 15% stop loss
    high: 0.80    // 20% stop loss
  };
  
  const multiplier = riskMultipliers[riskLevel] || 0.90;
  return (price * multiplier).toFixed(6);
}

// Calculate take profit price
function calculateTakeProfit(currentPrice, predictedChange) {
  if (!currentPrice || currentPrice === 'unknown' || !predictedChange) return 'unknown';
  
  const price = parseFloat(currentPrice);
  const change = parseFloat(predictedChange);
  
  // Take profit at 80% of predicted gain
  const targetChange = change * 0.8;
  return (price * (1 + targetChange / 100)).toFixed(6);
}

// Save model and predictions
function saveResults(model, predictions, signals) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // Save model
  if (model) {
    fs.writeFileSync(CONFIG.modelFile, JSON.stringify(model, null, 2), 'utf8');
    console.log(`💾 Model saved: ${CONFIG.modelFile}`);
  }
  
  // Save predictions
  const predictionsFile = path.join(CONFIG.outputDir, `predictions-${timestamp}.json`);
  fs.writeFileSync(predictionsFile, JSON.stringify({
    metadata: { generatedAt: new Date().toISOString(), count: predictions.length },
    predictions: predictions
  }, null, 2), 'utf8');
  console.log(`💾 Predictions saved: ${predictionsFile}`);
  
  // Save signals
  const signalsFile = path.join(CONFIG.outputDir, `signals-${timestamp}.json`);
  fs.writeFileSync(signalsFile, JSON.stringify({
    metadata: { generatedAt: new Date().toISOString(), count: signals.length },
    signals: signals
  }, null, 2), 'utf8');
  console.log(`💾 Signals saved: ${signalsFile}`);
  
  // Generate summary for dashboard
  const summary = {
    metadata: {
      generatedAt: new Date().toISOString(),
      modelVersion: '1.0.0',
      dataPoints: model?.overall?.totalSamples || 0
    },
    statistics: {
      totalPredictions: predictions.length,
      highConfidenceSignals: signals.length,
      avgConfidence: predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length,
      signalBreakdown: {}
    },
    topSignals: signals.slice(0, 5).map(s => ({
      token: s.token,
      mlScore: s.mlScore,
      recommendation: s.recommendation,
      predictedChange1h: s.predictedChange1h,
      riskLevel: s.riskLevel
    })),
    modelPerformance: model?.overall || {}
  };
  
  // Count signals by recommendation
  signals.forEach(signal => {
    if (!summary.statistics.signalBreakdown[signal.recommendation]) {
      summary.statistics.signalBreakdown[signal.recommendation] = 0;
    }
    summary.statistics.signalBreakdown[signal.recommendation]++;
  });
  
  const summaryFile = path.join(CONFIG.outputDir, 'ml-summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`💾 Summary saved: ${summaryFile}`);
  
  return summary;
}

// Main execution
async function main() {
  console.log('🧠 Wolf Pack ML Predictor');
  console.log('='.repeat(50));
  
  ensureDirectories();
  
  try {
    // Load historical performance data
    console.log('📊 Loading performance data...');
    const performanceData = await loadPerformanceData();
    console.log(`✅ Loaded ${performanceData.length} historical alerts`);
    
    // Extract features
    const features = extractFeatures(performanceData);
    
    // Train model
    const model = trainModel(features);
    
    // Load current alerts (from cache or recent run)
    const cacheFile = path.join(__dirname, '../data/wolf-pack-cache.json');
    let currentAlerts = [];
    
    if (fs.existsSync(cacheFile)) {
      const cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      currentAlerts = cache.alerts || [];
      console.log(`📊 Loaded ${currentAlerts.length} current alerts from cache`);
    }
    
    // Make predictions for current alerts
    const predictions = [];
    for (const alert of currentAlerts.slice(0, 20)) { // Limit to recent alerts
      const prediction = predictAlert(model, alert);
      predictions.push({
        alert: {
          id: alert.id,
          token: alert.symbol,
          category: alert.category,
          score: alert.score
        },
        prediction: prediction
      });
    }
    
    // Generate trading signals
    const recentAlerts = currentAlerts.slice(0, 10);
    const recentPredictions = predictions.slice(0, 10).map(p => p.prediction);
    const signals = generateTradingSignals(recentAlerts, recentPredictions);
    
    // Save results
    const summary = saveResults(model, predictions, signals);
    
    console.log('\n✅ ML Predictor completed successfully!');
    console.log(`📊 Results: ${predictions.length} predictions made`);
    console.log(`📈 Signals: ${signals.length} trading signals generated`);
    console.log(`🧠 Model trained on: ${model?.overall?.totalSamples || 0} samples`);
    
    return { 
      success: true, 
      modelTrained: !!model,
      predictions: predictions.length,
      signals: signals.length,
      summary: summary 
    };
    
  } catch (error) {
    console.error('❌ ML Predictor failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  loadPerformanceData,
  extractFeatures,
  trainModel,
  predictAlert,
  generateTradingSignals,
  main
};
