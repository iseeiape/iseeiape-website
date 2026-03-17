#!/usr/bin/env node

/**
 * Wolf Pack Integration for Neo Crypto Engine
 * 
 * Integrates Wolf Pack v8 alerts into the iseeiape dashboard and data pipeline.
 * 
 * Usage: node scripts/wolf-pack-integration.js [--fetch] [--analyze] [--test]
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const CONFIG = {
  wolfPackScript: '/home/matrix/.openclaw/workspace/wolf_pack_v8_complete.py',
  outputDir: path.join(__dirname, '../data/wolf-pack'),
  cacheFile: path.join(__dirname, '../data/wolf-pack-cache.json'),
  
  // Alert categories from Wolf Pack
  categories: {
    alpha: { minScore: 90, types: ['ALL'], name: '🐺 Alpha Alerts' },
    newpairs: { minScore: 0, types: ['🆕 NEW_PAIR'], name: '🆕 New Pairs' },
    momentum: { minScore: 70, types: ['📈 TRENDING', '🚀 BREAKOUT', '📊 VOLUME_SPIKE'], name: '📈 Momentum' },
    whale: { minScore: 0, types: ['💧 LIQUIDITY'], minVolume: 500000, name: '🐋 Whale Activity' }
  },
  
  // Data retention
  retentionDays: 7,
  
  // API endpoints (if we create them)
  endpoints: {
    alerts: '/api/wolf/alerts',
    performance: '/api/wolf/performance',
    trends: '/api/wolf/trends'
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const fetchAlerts = args.includes('--fetch');
const analyze = args.includes('--analyze');
const test = args.includes('--test');

console.log('🐺 Wolf Pack Integration');
console.log('='.repeat(50));

// Helper functions
function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

function loadCache() {
  try {
    if (fs.existsSync(CONFIG.cacheFile)) {
      return JSON.parse(fs.readFileSync(CONFIG.cacheFile, 'utf8'));
    }
  } catch (error) {
    console.error('❌ Error loading cache:', error.message);
  }
  return { alerts: [], lastFetch: null, performance: {} };
}

function saveCache(data) {
  try {
    fs.writeFileSync(CONFIG.cacheFile, JSON.stringify(data, null, 2), 'utf8');
    console.log('💾 Cache saved');
    return true;
  } catch (error) {
    console.error('❌ Error saving cache:', error.message);
    return false;
  }
}

function parseWolfPackOutput(output) {
  console.log('📊 Parsing Wolf Pack output...');
  
  const alerts = [];
  const lines = output.split('\n');
  
  let currentAlert = null;
  let inAlertBlock = false;
  
  for (const line of lines) {
    // Look for alert patterns
    if (line.includes('🐺 ALERT:') || line.includes('🆕 ALERT:') || line.includes('📈 ALERT:') || line.includes('🐋 ALERT:')) {
      if (currentAlert) {
        alerts.push(currentAlert);
      }
      
      // Extract basic info from alert line
      const match = line.match(/(🐺|🆕|📈|🐋) ALERT: (.+?) \((.+?)\) - Score: (\d+)\/(\d+)/);
      if (match) {
        const [, emoji, token, symbol, score, maxScore] = match;
        currentAlert = {
          id: `wolf_${Date.now()}_${alerts.length}`,
          timestamp: new Date().toISOString(),
          category: emoji === '🐺' ? 'alpha' : 
                   emoji === '🆕' ? 'newpairs' : 
                   emoji === '📈' ? 'momentum' : 'whale',
          emoji: emoji,
          token: token.trim(),
          symbol: symbol.trim(),
          score: parseInt(score),
          maxScore: parseInt(maxScore),
          confidence: Math.round((parseInt(score) / parseInt(maxScore)) * 100),
          raw: line.trim(),
          details: []
        };
        inAlertBlock = true;
      }
    } else if (inAlertBlock && currentAlert && line.trim() && !line.includes('===')) {
      // Add details to current alert
      currentAlert.details.push(line.trim());
    } else if (line.includes('===')) {
      // End of alert block
      inAlertBlock = false;
    }
  }
  
  // Add the last alert
  if (currentAlert) {
    alerts.push(currentAlert);
  }
  
  console.log(`✅ Parsed ${alerts.length} alerts`);
  return alerts;
}

function analyzeAlerts(alerts) {
  console.log('\n📈 Analyzing alert patterns...');
  
  const analysis = {
    summary: {
      totalAlerts: alerts.length,
      byCategory: {},
      byConfidence: { high: 0, medium: 0, low: 0 },
      timeDistribution: {}
    },
    topTokens: {},
    trends: []
  };
  
  // Categorize alerts
  for (const alert of alerts) {
    // By category
    if (!analysis.summary.byCategory[alert.category]) {
      analysis.summary.byCategory[alert.category] = 0;
    }
    analysis.summary.byCategory[alert.category]++;
    
    // By confidence
    if (alert.confidence >= 80) {
      analysis.summary.byConfidence.high++;
    } else if (alert.confidence >= 60) {
      analysis.summary.byConfidence.medium++;
    } else {
      analysis.summary.byConfidence.low++;
    }
    
    // Top tokens
    if (!analysis.topTokens[alert.symbol]) {
      analysis.topTokens[alert.symbol] = {
        count: 0,
        totalScore: 0,
        categories: new Set(),
        latestAlert: alert.timestamp
      };
    }
    analysis.topTokens[alert.symbol].count++;
    analysis.topTokens[alert.symbol].totalScore += alert.score;
    analysis.topTokens[alert.symbol].categories.add(alert.category);
    
    // Time distribution (by hour)
    const hour = new Date(alert.timestamp).getHours();
    if (!analysis.summary.timeDistribution[hour]) {
      analysis.summary.timeDistribution[hour] = 0;
    }
    analysis.summary.timeDistribution[hour]++;
  }
  
  // Calculate averages and sort
  for (const [symbol, data] of Object.entries(analysis.topTokens)) {
    data.avgScore = Math.round(data.totalScore / data.count);
    data.categories = Array.from(data.categories);
  }
  
  // Convert to sorted array
  analysis.topTokensSorted = Object.entries(analysis.topTokens)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([symbol, data]) => ({ symbol, ...data }));
  
  // Identify trends
  const trendThreshold = 3; // Minimum alerts to be considered a trend
  for (const [symbol, data] of Object.entries(analysis.topTokens)) {
    if (data.count >= trendThreshold) {
      analysis.trends.push({
        symbol,
        alertCount: data.count,
        avgScore: data.avgScore,
        categories: data.categories,
        strength: Math.min(data.count * 10, 100) // Simple strength calculation
      });
    }
  }
  
  // Sort trends by strength
  analysis.trends.sort((a, b) => b.strength - a.strength);
  
  console.log(`📊 Analysis complete:`);
  console.log(`  • Total alerts: ${analysis.summary.totalAlerts}`);
  console.log(`  • Categories: ${Object.entries(analysis.summary.byCategory).map(([cat, count]) => `${cat}: ${count}`).join(', ')}`);
  console.log(`  • Confidence: High: ${analysis.summary.byConfidence.high}, Medium: ${analysis.summary.byConfidence.medium}, Low: ${analysis.summary.byConfidence.low}`);
  console.log(`  • Top tokens: ${analysis.topTokensSorted.slice(0, 3).map(t => t.symbol).join(', ')}`);
  console.log(`  • Trends identified: ${analysis.trends.length}`);
  
  return analysis;
}

function generateDashboardData(alerts, analysis) {
  console.log('\n📊 Generating dashboard data...');
  
  const dashboardData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      source: 'wolf-pack-integration',
      version: '1.0.0'
    },
    recentAlerts: alerts.slice(0, 20).map(alert => ({
      id: alert.id,
      timestamp: alert.timestamp,
      category: alert.category,
      emoji: alert.emoji,
      symbol: alert.symbol,
      token: alert.token,
      score: alert.score,
      confidence: alert.confidence,
      summary: alert.details[0] || 'No details'
    })),
    analysis: {
      summary: analysis.summary,
      topTokens: analysis.topTokensSorted,
      trends: analysis.trends.slice(0, 5),
      hourlyDistribution: Object.entries(analysis.summary.timeDistribution)
        .sort(([hourA], [hourB]) => parseInt(hourA) - parseInt(hourB))
        .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    },
    recommendations: generateRecommendations(analysis)
  };
  
  return dashboardData;
}

function generateRecommendations(analysis) {
  const recommendations = [];
  
  // High confidence alpha alerts
  const highAlpha = analysis.trends.filter(t => 
    t.categories.includes('alpha') && t.avgScore >= 85
  );
  
  if (highAlpha.length > 0) {
    recommendations.push({
      type: 'alpha_opportunity',
      priority: 'high',
      message: `Strong alpha signals detected for ${highAlpha.map(t => t.symbol).join(', ')}`,
      action: 'Consider deeper research on these tokens'
    });
  }
  
  // New pairs with volume
  const newPairs = analysis.topTokensSorted.filter(t => 
    t.categories.includes('newpairs') && t.count >= 2
  );
  
  if (newPairs.length > 0) {
    recommendations.push({
      type: 'new_pair_alert',
      priority: 'medium',
      message: `New trading pairs detected: ${newPairs.map(t => t.symbol).join(', ')}`,
      action: 'Monitor for early liquidity opportunities'
    });
  }
  
  // Momentum trends
  const momentum = analysis.trends.filter(t => 
    t.categories.includes('momentum') && t.strength >= 50
  );
  
  if (momentum.length > 0) {
    recommendations.push({
      type: 'momentum_trend',
      priority: 'medium',
      message: `Momentum building for ${momentum.map(t => t.symbol).join(', ')}`,
      action: 'Watch for breakout confirmation'
    });
  }
  
  // Time-based insights
  const peakHour = Object.entries(analysis.summary.timeDistribution)
    .reduce((peak, [hour, count]) => count > (peak.count || 0) ? { hour, count } : peak, {});
  
  if (peakHour.hour) {
    recommendations.push({
      type: 'timing_insight',
      priority: 'low',
      message: `Peak alert activity around ${peakHour.hour}:00 UTC`,
      action: 'Schedule monitoring during active hours'
    });
  }
  
  return recommendations;
}

// Main functions
async function fetchWolfPackAlerts() {
  console.log('🔍 Fetching Wolf Pack alerts...');
  
  if (!fs.existsSync(CONFIG.wolfPackScript)) {
    console.error(`❌ Wolf Pack script not found: ${CONFIG.wolfPackScript}`);
    return [];
  }
  
  try {
    // In a real implementation, we would run the Python script
    // For now, we'll simulate with cached data or create a mock
    console.log('⚠️  Wolf Pack execution would run here');
    console.log('📋 For now, using simulated data');
    
    // Simulate some alerts
    const simulatedAlerts = [
      {
        id: `wolf_${Date.now()}_1`,
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        category: 'alpha',
        emoji: '🐺',
        token: 'dogwifhat',
        symbol: 'WIF',
        score: 95,
        maxScore: 100,
        confidence: 95,
        raw: '🐺 ALERT: dogwifhat (WIF) - Score: 95/100',
        details: ['Solana meme coin showing strong momentum', 'Volume up 250% in last hour', 'Whale accumulation detected']
      },
      {
        id: `wolf_${Date.now()}_2`,
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        category: 'newpairs',
        emoji: '🆕',
        token: 'Popcat',
        symbol: 'POPCAT',
        score: 65,
        maxScore: 100,
        confidence: 65,
        raw: '🆕 ALERT: Popcat (POPCAT) - Score: 65/100',
        details: ['New trading pair on Raydium', 'Initial liquidity: $250k', 'Early momentum building']
      },
      {
        id: `wolf_${Date.now()}_3`,
        timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        category: 'momentum',
        emoji: '📈',
        token: 'Jupiter',
        symbol: 'JUP',
        score: 82,
        maxScore: 100,
        confidence: 82,
        raw: '📈 ALERT: Jupiter (JUP) - Score: 82/100',
        details: ['Breaking out of consolidation', 'Volume spike: 3x average', 'Key resistance broken at $1.25']
      }
    ];
    
    console.log(`✅ Simulated ${simulatedAlerts.length} alerts`);
    return simulatedAlerts;
    
  } catch (error) {
    console.error('❌ Error fetching Wolf Pack alerts:', error.message);
    return [];
  }
}

async function updateDashboardIntegration(alerts, analysis) {
  console.log('\n🔄 Updating dashboard integration...');
  
  const dashboardData = generateDashboardData(alerts, analysis);
  
  // Save to file for dashboard consumption
  const outputFile = path.join(CONFIG.outputDir, `wolf-alerts-${new Date().toISOString().split('T')[0]}.json`);
  ensureDirectory(CONFIG.outputDir);
  
  fs.writeFileSync(outputFile, JSON.stringify(dashboardData, null, 2), 'utf8');
  console.log(`💾 Dashboard data saved: ${outputFile}`);
  
  // Update cache
  const cache = loadCache();
  cache.alerts = [...cache.alerts, ...alerts].slice(-100); // Keep last 100 alerts
  cache.lastFetch = new Date().toISOString();
  cache.analysis = analysis;
  saveCache(cache);
  
  // Create summary for main dashboard
  const summaryFile = path.join(__dirname, '../data/wolf-pack-summary.json');
  const summary = {
    lastUpdated: new Date().toISOString(),
    alertCount: alerts.length,
    recentAlerts: dashboardData.recentAlerts.slice(0, 5),
    topTrends: dashboardData.analysis.trends.slice(0, 3),
    recommendations: dashboardData.recommendations.filter(r => r.priority === 'high' || r.priority === 'medium')
  };
  
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`💾 Summary saved: ${summaryFile}`);
  
  return dashboardData;
}

// Main execution
async function main() {
  console.log('🚀 Starting Wolf Pack integration...\n');
  
  ensureDirectory(CONFIG.outputDir);
  
  let alerts = [];
  let analysis = null;
  
  // Fetch alerts if requested
  if (fetchAlerts || test) {
    alerts = await fetchWolfPackAlerts();
    
    if (alerts.length > 0) {
      // Analyze alerts
      analysis = analyzeAlerts(alerts);
      
      // Update dashboard integration
      const dashboardData = await updateDashboardIntegration(alerts, analysis);
      
      console.log('\n✅ Integration complete!');
      console.log(`📊 Data ready for dashboard consumption`);
      console.log(`📁 Output: ${CONFIG.outputDir}`);
      
      if (test) {
        console.log('\n🧪 TEST MODE - Sample output:');
        console.log(JSON.stringify(dashboardData.recentAlerts.slice(0, 2), null, 2));
      }
    } else {
      console.log('⚠️  No alerts fetched');
    }
  }
  
  // Analyze existing data if requested
  if (analyze) {
    const cache = loadCache();
    if (cache.alerts.length > 0) {
      console.log(`📊 Analyzing ${cache.alerts.length} cached alerts...`);
      analysis = analyzeAlerts(cache.alerts);
      
      console.log('\n📈 Historical Analysis:');
      console.log(`  • Total alerts in cache: ${cache.alerts.length}`);
      console.log(`  • Last fetch: ${cache.lastFetch || 'Never'}`);
      
      if (analysis.trends.length > 0) {
        console.log(`  • Top historical trends:`);
        analysis.trends.slice(0, 3