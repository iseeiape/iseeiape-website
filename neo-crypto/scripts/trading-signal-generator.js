#!/usr/bin/env node

/**
 * Trading Signal Generator - Converts Wolf Pack alerts into actionable trading signals
 * 
 * This system generates trading signals with entry/exit points, risk management,
 * and portfolio allocation recommendations.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  outputDir: path.join(__dirname, '../data/trading-signals'),
  mlPredictorPath: path.join(__dirname, 'wolf-ml-predictor.js'),
  cacheFile: path.join(__dirname, '../data/wolf-pack-cache.json'),
  
  // Trading parameters
  maxPositions: 5,
  positionSize: 0.2, // 20% of portfolio per position
  maxRiskPerTrade: 0.02, // 2% max loss per trade
  minConfidence: 75,
  
  // Signal types
  signalTypes: {
    ALPHA_HIGH_CONFIDENCE: 'alpha_high_confidence',
    MOMENTUM_BREAKOUT: 'momentum_breakout',
    NEW_PAIR_OPPORTUNITY: 'new_pair_opportunity',
    WHALE_ACCUMULATION: 'whale_accumulation'
  }
};

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`📁 Created directory: ${CONFIG.outputDir}`);
  }
}

// Load ML predictions
function loadMLPredictions() {
  try {
    const mlDir = path.join(__dirname, '../data/wolf-ml');
    const files = fs.readdirSync(mlDir)
      .filter(f => f.startsWith('predictions-') && f.endsWith('.json'))
      .sort()
      .reverse();
    
    if (files.length === 0) {
      console.log('⚠️  No ML predictions found');
      return null;
    }
    
    const latestFile = path.join(mlDir, files[0]);
    const data = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
    console.log(`📊 Loaded ${data.predictions.length} ML predictions from ${files[0]}`);
    return data;
  } catch (error) {
    console.error('❌ Error loading ML predictions:', error.message);
    return null;
  }
}

// Load Wolf Pack alerts
function loadWolfPackAlerts() {
  try {
    if (!fs.existsSync(CONFIG.cacheFile)) {
      console.log('⚠️  No Wolf Pack cache found');
      return [];
    }
    
    const cache = JSON.parse(fs.readFileSync(CONFIG.cacheFile, 'utf8'));
    const alerts = cache.alerts || [];
    console.log(`📊 Loaded ${alerts.length} Wolf Pack alerts from cache`);
    return alerts;
  } catch (error) {
    console.error('❌ Error loading Wolf Pack alerts:', error.message);
    return [];
  }
}

// Determine signal type based on alert characteristics
function determineSignalType(alert, mlPrediction) {
  const category = alert.category || 'unknown';
  const score = alert.score || 0;
  const confidence = mlPrediction?.confidence || 0;
  
  if (category === 'alpha' && score >= 85 && confidence >= 85) {
    return CONFIG.signalTypes.ALPHA_HIGH_CONFIDENCE;
  } else if (category === 'momentum' && score >= 75) {
    return CONFIG.signalTypes.MOMENTUM_BREAKOUT;
  } else if (category === 'new_pair' && score >= 70) {
    return CONFIG.signalTypes.NEW_PAIR_OPPORTUNITY;
  } else if (category === 'whale' && score >= 65) {
    return CONFIG.signalTypes.WHALE_ACCUMULATION;
  }
  
  return 'general_alert';
}

// Calculate position sizing
function calculatePositionSize(signalType, confidence, portfolioSize = 10000) {
  const baseSize = CONFIG.positionSize * portfolioSize;
  
  // Adjust based on signal type and confidence
  let multiplier = 1.0;
  
  switch (signalType) {
    case CONFIG.signalTypes.ALPHA_HIGH_CONFIDENCE:
      multiplier = 1.2; // 20% larger position for high confidence alpha
      break;
    case CONFIG.signalTypes.MOMENTUM_BREAKOUT:
      multiplier = 1.0;
      break;
    case CONFIG.signalTypes.NEW_PAIR_OPPORTUNITY:
      multiplier = 0.8; // Smaller position for new pairs (higher risk)
      break;
    case CONFIG.signalTypes.WHALE_ACCUMULATION:
      multiplier = 0.9;
      break;
    default:
      multiplier = 0.7;
  }
  
  // Adjust based on confidence
  const confidenceMultiplier = confidence / 100;
  const position = baseSize * multiplier * confidenceMultiplier;
  
  // Ensure minimum and maximum limits
  const minPosition = portfolioSize * 0.05; // 5% minimum
  const maxPosition = portfolioSize * 0.3; // 30% maximum
  
  return Math.max(minPosition, Math.min(position, maxPosition));
}

// Generate trading signal
function generateTradingSignal(alert, mlPrediction, portfolioSize) {
  const signalType = determineSignalType(alert, mlPrediction);
  const confidence = mlPrediction?.confidence || alert.score || 50;
  
  if (confidence < CONFIG.minConfidence) {
    return null; // Skip low confidence signals
  }
  
  const currentPrice = alert.metrics?.price || 0;
  const predictedChange = parseFloat(mlPrediction?.predictedChange1h || 0);
  
  // Calculate entry/exit points
  const entryPrice = currentPrice;
  const stopLoss = calculateStopLoss(currentPrice, mlPrediction?.riskLevel || 'medium');
  const takeProfit = calculateTakeProfit(currentPrice, predictedChange);
  
  // Calculate position size
  const positionSize = calculatePositionSize(signalType, confidence, portfolioSize);
  
  // Calculate risk/reward ratio
  const risk = currentPrice - stopLoss;
  const reward = takeProfit - currentPrice;
  const riskRewardRatio = risk > 0 ? reward / risk : 0;
  
  // Generate signal
  const signal = {
    id: `trade_${Date.now()}_${alert.symbol}`,
    timestamp: new Date().toISOString(),
    token: alert.token || alert.symbol,
    symbol: alert.symbol,
    signalType: signalType,
    category: alert.category,
    
    // Scores
    wolfScore: alert.score,
    mlScore: confidence,
    combinedScore: Math.round((alert.score * 0.4) + (confidence * 0.6)),
    
    // Trading parameters
    entryPrice: entryPrice.toFixed(6),
    stopLoss: stopLoss.toFixed(6),
    takeProfit: takeProfit.toFixed(6),
    positionSize: positionSize.toFixed(2),
    positionSizeUSD: positionSize,
    
    // Risk management
    riskPerTrade: ((currentPrice - stopLoss) / currentPrice * 100).toFixed(2) + '%',
    rewardPotential: ((takeProfit - currentPrice) / currentPrice * 100).toFixed(2) + '%',
    riskRewardRatio: riskRewardRatio.toFixed(2),
    maxLossUSD: (positionSize * (currentPrice - stopLoss) / currentPrice).toFixed(2),
    
    // Timeframes
    expectedHoldTime: getExpectedHoldTime(signalType),
    urgency: getUrgencyLevel(alert, mlPrediction),
    
    // Metadata
    alertId: alert.id,
    source: 'wolf_pack_ml',
    confidence: confidence,
    recommendation: mlPrediction?.recommendation || 'hold',
    
    // Additional context
    metrics: alert.metrics || {},
    mlFactors: mlPrediction?.factors || {}
  };
  
  return signal;
}

// Calculate stop loss
function calculateStopLoss(currentPrice, riskLevel) {
  if (!currentPrice || currentPrice === 0) return currentPrice * 0.9;
  
  const riskLevels = {
    low: 0.95,    // 5% stop loss
    medium: 0.90, // 10% stop loss
    'medium-high': 0.85, // 15% stop loss
    high: 0.80    // 20% stop loss
  };
  
  const multiplier = riskLevels[riskLevel] || 0.90;
  return currentPrice * multiplier;
}

// Calculate take profit
function calculateTakeProfit(currentPrice, predictedChange) {
  if (!currentPrice || currentPrice === 0 || !predictedChange) {
    return currentPrice * 1.15; // Default 15% target
  }
  
  // Take profit at 80% of predicted gain, minimum 10%
  const targetChange = Math.max(predictedChange * 0.8, 10);
  return currentPrice * (1 + targetChange / 100);
}

// Get expected hold time based on signal type
function getExpectedHoldTime(signalType) {
  const holdTimes = {
    [CONFIG.signalTypes.ALPHA_HIGH_CONFIDENCE]: '4-24 hours',
    [CONFIG.signalTypes.MOMENTUM_BREAKOUT]: '1-4 hours',
    [CONFIG.signalTypes.NEW_PAIR_OPPORTUNITY]: '2-8 hours',
    [CONFIG.signalTypes.WHALE_ACCUMULATION]: '8-48 hours',
    general_alert: '1-12 hours'
  };
  
  return holdTimes[signalType] || '1-12 hours';
}

// Get urgency level
function getUrgencyLevel(alert, mlPrediction) {
  const change5m = alert.metrics?.change5m || 0;
  const change1h = alert.metrics?.change1h || 0;
  const confidence = mlPrediction?.confidence || 0;
  
  if (change5m > 50 || change1h > 100) {
    return 'HIGH'; // Rapidly moving
  } else if (confidence >= 85 && change5m > 20) {
    return 'MEDIUM_HIGH';
  } else if (confidence >= 75) {
    return 'MEDIUM';
  } else {
    return 'LOW';
  }
}

// Generate portfolio allocation recommendations
function generatePortfolioAllocation(signals, portfolioSize = 10000) {
  console.log('\n💰 Generating portfolio allocation...');
  
  if (signals.length === 0) {
    return {
      allocation: [],
      totalAllocated: 0,
      cashRemaining: portfolioSize,
      recommendation: 'No signals meet criteria - hold cash'
    };
  }
  
  // Sort signals by combined score (descending)
  const sortedSignals = [...signals].sort((a, b) => b.combinedScore - a.combinedScore);
  
  // Take top N signals based on max positions
  const topSignals = sortedSignals.slice(0, CONFIG.maxPositions);
  
  // Calculate allocation
  const allocation = [];
  let totalAllocated = 0;
  
  for (const signal of topSignals) {
    const positionSize = parseFloat(signal.positionSizeUSD);
    
    allocation.push({
      token: signal.symbol,
      signalType: signal.signalType,
      allocationUSD: positionSize,
      allocationPercent: ((positionSize / portfolioSize) * 100).toFixed(1) + '%',
      entryPrice: signal.entryPrice,
      stopLoss: signal.stopLoss,
      takeProfit: signal.takeProfit,
      riskReward: signal.riskRewardRatio,
      urgency: signal.urgency
    });
    
    totalAllocated += positionSize;
  }
  
  const cashRemaining = portfolioSize - totalAllocated;
  
  // Generate allocation recommendation
  let recommendation = '';
  if (totalAllocated > portfolioSize * 0.7) {
    recommendation = 'Aggressive allocation - high conviction signals';
  } else if (totalAllocated > portfolioSize * 0.5) {
    recommendation = 'Moderate allocation - balanced risk';
  } else if (totalAllocated > portfolioSize * 0.3) {
    recommendation = 'Conservative allocation - selective positions';
  } else {
    recommendation = 'Minimal allocation - wait for better opportunities';
  }
  
  return {
    allocation,
    totalAllocated: totalAllocated.toFixed(2),
    cashRemaining: cashRemaining.toFixed(2),
    allocationPercent: ((totalAllocated / portfolioSize) * 100).toFixed(1) + '%',
    signalCount: topSignals.length,
    recommendation,
    generatedAt: new Date().toISOString()
  };
}

// Generate trading plan
function generateTradingPlan(signals, portfolioAllocation) {
  console.log('\n📋 Generating trading plan...');
  
  const plan = {
    metadata: {
      generatedAt: new Date().toISOString(),
      signalCount: signals.length,
      portfolioSize: 10000, // Default
      riskPerTrade: CONFIG.maxRiskPerTrade
    },
    
    executiveSummary: {
      marketOutlook: getMarketOutlook(signals),
      recommendedAction: portfolioAllocation.recommendation,
      topOpportunity: signals[0] ? {
        token: signals[0].symbol,
        signalType: signals[0].signalType,
        confidence: signals[0].combinedScore,
        urgency: signals[0].urgency
      } : null,
      riskLevel: assessOverallRisk(signals)
    },
    
    signals: signals.map(s => ({
      token: s.symbol,
      signalType: s.signalType,
      action: s.recommendation === 'avoid' ? 'AVOID' : 'ENTER',
      entry: s.entryPrice,
      stopLoss: s.stopLoss,
      takeProfit: s.takeProfit,
      size: s.positionSizeUSD,
      confidence: s.combinedScore,
      urgency: s.urgency,
      holdTime: s.expectedHoldTime
    })),
    
    portfolioAllocation: portfolioAllocation,
    
    riskManagement: {
      maxPortfolioRisk: (CONFIG.maxRiskPerTrade * signals.length * 100).toFixed(1) + '%',
      positionSizing: 'Dynamic based on confidence and signal type',
      stopLossStrategy: 'Technical levels adjusted for volatility',
      profitTaking: 'Scale out at 50%, 100%, 150% of target'
    },
    
    monitoring: {
      checkFrequency: '15 minutes for high urgency, 1 hour for medium, 4 hours for low',
      adjustmentTriggers: [
        'Price hits stop loss',
        'Price reaches take profit',
        'New higher confidence signal emerges',
        'Market conditions change significantly'
      ],
      exitCriteria: [
        'Stop loss triggered',
        'Take profit reached',
        'Signal invalidated (24+ hours without progress)',
        'Better opportunity identified'
      ]
    }
  };
  
  return plan;
}

// Get market outlook based on signals
function getMarketOutlook(signals) {
  if (signals.length === 0) return 'Neutral - waiting for opportunities';
  
  const alphaSignals = signals.filter(s => s.signalType === CONFIG.signalTypes.ALPHA_HIGH_CONFIDENCE);
  const momentumSignals = signals.filter(s => s.signalType === CONFIG.signalTypes.MOMENTUM_BREAKOUT);
  
  if (alphaSignals.length >= 3) {
    return 'Bullish - strong alpha signals detected';
  } else if (momentumSignals.length >= 4) {
    return 'Momentum-driven - multiple breakout opportunities';
  } else if (signals.length >= 5) {
    return 'Active - multiple trading opportunities';
  } else if (signals.length >= 2) {
    return 'Selective - few high-quality opportunities';
  } else {
    return 'Cautious - limited opportunities';
  }
}

// Assess overall risk level
function assessOverallRisk(signals) {
  if (signals.length === 0) return 'LOW';
  
  const avgConfidence = signals.reduce((sum, s) => sum + s.combinedScore, 0) / signals.length;
  const highRiskSignals = signals.filter(s => s.riskPerTrade.includes('15') || s.riskPerTrade.includes('20'));
  
  if (avgConfidence >= 80 && highRiskSignals.length === 0) {
    return 'LOW';
  } else if (avgConfidence >= 70 && highRiskSignals.length <= 1) {
    return 'MEDIUM';
  } else if (avgConfidence >= 60) {
    return 'MEDIUM_HIGH';
  } else {
    return 'HIGH';
  }
}

// Save trading signals and plan
function saveTradingData(signals, portfolioAllocation, tradingPlan) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // Save signals
  const signalsFile = path.join(CONFIG.outputDir, `trading-signals-${timestamp}.json`);
  fs.writeFileSync(signalsFile, JSON.stringify({
    metadata: { generatedAt: new Date().toISOString(), count: signals.length },
    signals: signals
  }, null, 2), 'utf8');
  console.log(`💾 Trading signals saved: ${signalsFile}`);
  
  // Save portfolio allocation
  const allocationFile = path.join(CONFIG.outputDir, `portfolio-allocation-${timestamp}.json`);
  fs.writeFileSync(allocationFile, JSON.stringify(portfolioAllocation, null, 2), 'utf8');
  console.log(`💾 Portfolio allocation saved: ${allocationFile}`);
  
  // Save trading plan
  const planFile = path.join(CONFIG.outputDir, `trading-plan-${timestamp}.json`);
  fs.writeFileSync(planFile, JSON.stringify(tradingPlan, null, 2), 'utf8');
  console.log(`💾 Trading plan saved: ${planFile}`);
  
  // Generate summary for dashboard
  const summary = {
    metadata: {
      generatedAt: new Date().toISOString(),
      signalCount: signals.length,
      planGenerated: true
    },
    snapshot: {
      activeSignals: signals.length,
      topSignal: signals[0] ? {
        token: signals[0].symbol,
        confidence: signals[0].combinedScore,
        recommendation: signals[0].recommendation
      } : null,
      portfolioAllocated: portfolioAllocation.allocationPercent,
      marketOutlook: tradingPlan.executiveSummary.marketOutlook,
      riskLevel: tradingPlan.executiveSummary.riskLevel
    },
    quickActions: signals.slice(0, 3).map(s => ({
      token: s.symbol,
      action: s.recommendation === 'avoid' ? 'AVOID' : 'BUY',
      entry: s.entryPrice,
      confidence: s.combinedScore
    }))
  };
  
  const summaryFile = path.join(CONFIG.outputDir, 'trading-summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`💾 Trading summary saved: ${summaryFile}`);
  
  return summary;
}

// Main execution
async function main() {
  console.log('📈 Trading Signal Generator');
  console.log('='.repeat(50));
  
  ensureDirectories();
  
  try {
    // Load ML predictions
    console.log('🧠 Loading ML predictions...');
    const mlData = loadMLPredictions();
    
    // Load Wolf Pack alerts
    console.log('🐺 Loading Wolf Pack alerts...');
    const alerts = loadWolfPackAlerts();
    
    if (alerts.length === 0) {
      console.log('⚠️  No alerts to process');
      return { success: false, error: 'No alerts available' };
    }
    
    // Map alerts to ML predictions
    const alertPredictions = new Map();
    if (mlData && mlData.predictions) {
      for (const prediction of mlData.predictions) {
        if (prediction.alert && prediction.alert.id) {
          alertPredictions.set(prediction.alert.id, prediction.prediction);
        }
      }
    }
    
    // Generate trading signals
    console.log('\n📊 Generating trading signals...');
    const signals = [];
    const portfolioSize = 10000; // Default portfolio size
    
    for (const alert of alerts.slice(0, 20)) { // Process recent alerts
      const mlPrediction = alertPredictions.get(alert.id);
      const signal = generateTradingSignal(alert, mlPrediction, portfolioSize);
      
      if (signal) {
        signals.push(signal);
      }
    }
    
    console.log(`✅ Generated ${signals.length} trading signals`);
    
    // Generate portfolio allocation
    const portfolioAllocation = generatePortfolioAllocation(signals, portfolioSize);
    
    // Generate trading plan
    const tradingPlan = generateTradingPlan(signals, portfolioAllocation);
    
    // Save all data
    const summary = saveTradingData(signals, portfolioAllocation, tradingPlan);
    
    console.log('\n✅ Trading Signal Generator completed successfully!');
    console.log(`📈 Results: ${signals.length} trading signals generated`);
    console.log(`💰 Portfolio: ${portfolioAllocation.allocationPercent} allocated`);
    console.log(`📋 Plan: Complete trading plan generated`);
    
    return { 
      success: true, 
      signals: signals.length,
      portfolioAllocation: portfolioAllocation.allocationPercent,
      marketOutlook: tradingPlan.executiveSummary.marketOutlook,
      summary: summary 
    };
    
  } catch (error) {
    console.error('❌ Trading Signal Generator failed:', error.message);
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
  loadMLPredictions,
  loadWolfPackAlerts,
  generateTradingSignal,
  generatePortfolioAllocation,
  generateTradingPlan,
  main
};