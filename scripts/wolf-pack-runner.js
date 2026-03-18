#!/usr/bin/env node

/**
 * Wolf Pack Runner - Executes Wolf Pack and integrates with Neo Crypto Engine
 * 
 * This script runs the Wolf Pack Python script and processes its output
 * for integration with the iseeiape dashboard.
 */

const { exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const execPromise = util.promisify(exec);

// Configuration
const CONFIG = {
  wolfPackScript: '/home/matrix/.openclaw/workspace/wolf_pack_v8_complete.py',
  outputDir: path.join(__dirname, '../neo-crypto/data/wolf-pack'),
  summaryFile: path.join(__dirname, '../neo-crypto/data/wolf-pack-summary.json'),
  liveDataFile: path.join(__dirname, '../data/wolf-live.json'),
  
  // Alert categories mapping
  categories: {
    '🆕 NEW_PAIR': { name: 'New Pairs', emoji: '🆕', priority: 'high' },
    '📈 TRENDING': { name: 'Trending', emoji: '📈', priority: 'medium' },
    '🚀 BREAKOUT': { name: 'Breakout', emoji: '🚀', priority: 'high' },
    '📊 VOLUME_SPIKE': { name: 'Volume Spike', emoji: '📊', priority: 'medium' },
    '💧 LIQUIDITY': { name: 'Liquidity', emoji: '💧', priority: 'low' },
    '🐺 ALPHA': { name: 'Alpha', emoji: '🐺', priority: 'critical' }
  }
};

// Ensure directories exist
function ensureDirectories() {
  const dirs = [CONFIG.outputDir, path.dirname(CONFIG.summaryFile), path.dirname(CONFIG.liveDataFile)];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
}

// Run Wolf Pack script
async function runWolfPack() {
  console.log('🐺 Running Wolf Pack v8...');
  
  try {
    // Run with --quick flag for faster execution
    const { stdout, stderr } = await execPromise(`python3 "${CONFIG.wolfPackScript}" --quick`, {
      cwd: path.dirname(CONFIG.wolfPackScript),
      timeout: 30000 // 30 second timeout
    });
    
    console.log('✅ Wolf Pack execution completed');
    
    // Parse the output
    const alerts = parseWolfPackOutput(stdout);
    
    if (alerts.length > 0) {
      console.log(`📊 Found ${alerts.length} alerts`);
      return alerts;
    } else {
      console.log('⚠️  No alerts found in output');
      // Try to load from live data file
      return loadLiveData();
    }
    
  } catch (error) {
    console.error('❌ Error running Wolf Pack:', error.message);
    
    if (error.code === 'ETIMEDOUT') {
      console.log('⏱️  Wolf Pack timed out, using cached data');
    }
    
    // Fall back to existing data
    return loadLiveData();
  }
}

// Parse Wolf Pack console output
function parseWolfPackOutput(output) {
  console.log('🔍 Parsing Wolf Pack output...');
  
  const alerts = [];
  const lines = output.split('\n');
  
  // Look for alert lines
  for (const line of lines) {
    // Match alert patterns like:
    // ✅ Alert sent via 🆕 WOLF NEWPAIRS: MEME (score=78, type=🆕 NEW_PAIR)
    // ✅ Alert sent via 📈 WOLF MOMENTUM: MEME (score=78, type=🆕 NEW_PAIR)
    const alertMatch = line.match(/✅ Alert sent via (.+?): (.+?) \(score=(\d+), type=(.+?)\)/);
    
    if (alertMatch) {
      const [, botName, token, scoreStr, type] = alertMatch;
      const score = parseInt(scoreStr);
      
      // Extract symbol from token (usually format: SYMBOL or TOKEN (SYMBOL))
      let symbol = token;
      const symbolMatch = token.match(/\((.+?)\)/);
      if (symbolMatch) {
        symbol = symbolMatch[1];
      } else if (token.includes(' ')) {
        symbol = token.split(' ')[0];
      }
      
      // Determine category from type
      let category = 'unknown';
      let emoji = '📊';
      
      if (type.includes('🆕')) {
        category = 'newpairs';
        emoji = '🆕';
      } else if (type.includes('📈')) {
        category = 'momentum';
        emoji = '📈';
      } else if (type.includes('🚀')) {
        category = 'breakout';
        emoji = '🚀';
      } else if (type.includes('📊')) {
        category = 'volume';
        emoji = '📊';
      } else if (type.includes('💧')) {
        category = 'liquidity';
        emoji = '💧';
      } else if (type.includes('🐺')) {
        category = 'alpha';
        emoji = '🐺';
      }
      
      const alert = {
        id: `wolf_${Date.now()}_${alerts.length}`,
        timestamp: new Date().toISOString(),
        category,
        emoji,
        token: token.trim(),
        symbol: symbol.trim(),
        score,
        confidence: Math.min(score, 100),
        type: type.trim(),
        bot: botName.trim(),
        raw: line.trim()
      };
      
      alerts.push(alert);
    }
  }
  
  // Also look for top pairs in output
  const topPairsSection = output.match(/🏆 Top \d+:(.+?)🚨 Sending alerts…/s);
  if (topPairsSection) {
    const topPairsText = topPairsSection[1];
    const pairLines = topPairsText.split('\n').filter(line => line.trim() && line.includes('Score:'));
    
    pairLines.forEach(line => {
      const pairMatch = line.match(/\s*\d+\.\s+(.+?)\s+Score:\s+(\d+)\s+(.+?)\s+age=([\d.]+)h/);
      if (pairMatch) {
        const [, symbol, scoreStr, details, age] = pairMatch;
        const score = parseInt(scoreStr);
        
        // Check if we already have this alert
        const existingAlert = alerts.find(a => a.symbol === symbol.trim());
        if (!existingAlert && score >= 50) {
          // Determine category from details
          let category = 'momentum';
          let emoji = '📈';
          
          if (details.includes('🆕')) {
            category = 'newpairs';
            emoji = '🆕';
          }
          
          alerts.push({
            id: `wolf_top_${Date.now()}_${alerts.length}`,
            timestamp: new Date().toISOString(),
            category,
            emoji,
            token: symbol.trim(),
            symbol: symbol.trim(),
            score,
            confidence: Math.min(score, 100),
            type: 'top_pair',
            bot: 'top_pairs',
            details: `Age: ${age}h, ${details.trim()}`,
            raw: line.trim()
          });
        }
      }
    });
  }
  
  console.log(`✅ Parsed ${alerts.length} alerts from output`);
  return alerts;
}

// Load data from wolf-live.json
function loadLiveData() {
  try {
    if (fs.existsSync(CONFIG.liveDataFile)) {
      const data = JSON.parse(fs.readFileSync(CONFIG.liveDataFile, 'utf8'));
      console.log(`📂 Loaded ${data.length || 0} alerts from ${CONFIG.liveDataFile}`);
      
      // Convert to our alert format
      if (Array.isArray(data)) {
        return data.map((alert, index) => ({
          id: alert.id || `wolf_live_${Date.now()}_${index}`,
          timestamp: alert.timestamp || new Date().toISOString(),
          category: alert.category || 'unknown',
          emoji: alert.emoji || '📊',
          token: alert.token || alert.symbol || 'Unknown',
          symbol: alert.symbol || 'UNKNOWN',
          score: alert.score || 50,
          confidence: alert.confidence || 50,
          type: alert.type || 'live_data',
          bot: alert.bot || 'live_feed',
          raw: JSON.stringify(alert)
        }));
      }
    }
  } catch (error) {
    console.error('❌ Error loading live data:', error.message);
  }
  
  return [];
}

// Analyze alerts
function analyzeAlerts(alerts) {
  console.log('📈 Analyzing alert patterns...');
  
  const analysis = {
    summary: {
      totalAlerts: alerts.length,
      byCategory: {},
      byScore: { high: 0, medium: 0, low: 0 },
      byHour: {}
    },
    topTokens: {},
    trends: []
  };
  
  // Process each alert
  alerts.forEach(alert => {
    // Count by category
    if (!analysis.summary.byCategory[alert.category]) {
      analysis.summary.byCategory[alert.category] = 0;
    }
    analysis.summary.byCategory[alert.category]++;
    
    // Count by score
    if (alert.score >= 80) {
      analysis.summary.byScore.high++;
    } else if (alert.score >= 60) {
      analysis.summary.byScore.medium++;
    } else {
      analysis.summary.byScore.low++;
    }
    
    // Count by hour
    const hour = new Date(alert.timestamp).getHours();
    if (!analysis.summary.byHour[hour]) {
      analysis.summary.byHour[hour] = 0;
    }
    analysis.summary.byHour[hour]++;
    
    // Track top tokens
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
  });
  
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
  
  // Identify trends (tokens with multiple alerts)
  const trendThreshold = 2;
  for (const [symbol, data] of Object.entries(analysis.topTokens)) {
    if (data.count >= trendThreshold) {
      analysis.trends.push({
        symbol,
        alertCount: data.count,
        avgScore: data.avgScore,
        categories: data.categories,
        strength: Math.min(data.count * 20, 100)
      });
    }
  }
  
  // Sort trends by strength
  analysis.trends.sort((a, b) => b.strength - a.strength);
  
  console.log(`📊 Analysis complete:`);
  console.log(`  • Total alerts: ${analysis.summary.totalAlerts}`);
  console.log(`  • Categories: ${Object.entries(analysis.summary.byCategory).map(([cat, count]) => `${cat}: ${count}`).join(', ')}`);
  console.log(`  • Scores: High: ${analysis.summary.byScore.high}, Medium: ${analysis.summary.byScore.medium}, Low: ${analysis.summary.byScore.low}`);
  console.log(`  • Top tokens: ${analysis.topTokensSorted.slice(0, 3).map(t => `${t.symbol}(${t.count})`).join(', ')}`);
  console.log(`  • Trends identified: ${analysis.trends.length}`);
  
  return analysis;
}

// Generate dashboard summary
function generateDashboardSummary(alerts, analysis) {
  const summary = {
    metadata: {
      generatedAt: new Date().toISOString(),
      source: 'wolf-pack-runner',
      version: '1.0.0',
      alertCount: alerts.length
    },
    recentAlerts: alerts.slice(0, 10).map(alert => ({
      id: alert.id,
      timestamp: alert.timestamp,
      category: alert.category,
      emoji: alert.emoji,
      symbol: alert.symbol,
      token: alert.token,
      score: alert.score,
      confidence: alert.confidence,
      type: alert.type
    })),
    analysis: {
      summary: analysis.summary,
      topTokens: analysis.topTokensSorted.slice(0, 5),
      trends: analysis.trends.slice(0, 5),
      hourlyActivity: Object.entries(analysis.summary.byHour)
        .sort(([hourA], [hourB]) => parseInt(hourA) - parseInt(hourB))
        .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    },
    recommendations: generateRecommendations(analysis)
  };
  
  return summary;
}

// Generate recommendations
function generateRecommendations(analysis) {
  const recommendations = [];
  
  // High score alerts
  const highScoreTokens = analysis.topTokensSorted.filter(t => t.avgScore >= 80);
  if (highScoreTokens.length > 0) {
    recommendations.push({
      type: 'high_confidence',
      priority: 'high',
      message: `High confidence signals for ${highScoreTokens.map(t => t.symbol).join(', ')}`,
      action: 'Consider immediate research on these tokens',
      tokens: highScoreTokens.map(t => t.symbol)
    });
  }
  
  // New pairs with multiple alerts
  const newPairs = analysis.trends.filter(t => 
    t.categories.includes('newpairs') && t.alertCount >= 2
  );
  if (newPairs.length > 0) {
    recommendations.push({
      type: 'new_pair_trend',
      priority: 'medium',
      message: `Multiple alerts for new pairs: ${newPairs.map(t => t.symbol).join(', ')}`,
      action: 'Monitor for early liquidity and volume growth',
      tokens: newPairs.map(t => t.symbol)
    });
  }
  
  // Peak activity hours
  const peakHour = Object.entries(analysis.summary.byHour)
    .reduce((peak, [hour, count]) => count > (peak.count || 0) ? { hour, count } : peak, {});
  
  if (peakHour.hour && peakHour.count > 1) {
    recommendations.push({
      type: 'timing_insight',
      priority: 'low',
      message: `Peak alert activity at ${peakHour.hour}:00 UTC (${peakHour.count} alerts)`,
      action: 'Schedule monitoring during active hours'
    });
  }
  
  return recommendations;
}

// Save summary to file
function saveSummary(summary) {
  try {
    fs.writeFileSync(CONFIG.summaryFile, JSON.stringify(summary, null, 2), 'utf8');
    console.log(`💾 Summary saved: ${CONFIG.summaryFile}`);
    
    // Also save detailed data
    const detailedFile = path.join(CONFIG.outputDir, `wolf-detailed-${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(detailedFile, JSON.stringify(summary, null, 2), 'utf8');
    console.log(`💾 Detailed data saved: ${detailedFile}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error saving summary:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Wolf Pack Runner - Neo Crypto Engine Integration\n');
  
  ensureDirectories();
  
  // Run Wolf Pack and get alerts
  const alerts = await runWolfPack();
  
  if (alerts.length === 0) {
    console.log('⚠️  No alerts available, exiting');
    return;
  }
  
  // Analyze alerts
  const analysis = analyzeAlerts(alerts);
  
  // Generate dashboard summary
  const summary = generateDashboardSummary(alerts, analysis);
  
  // Save summary
  const saved = saveSummary(summary);
  
  if (saved) {
    console.log('\n✅ Wolf Pack integration complete!');
    console.log(`📊 ${alerts.length} alerts processed`);
    console.log(`📈 ${analysis.trends.length} trends identified`);
    console.log(`💡 ${summary.recommendations.length} recommendations generated`);
    
    // Show sample of recent alerts
    console.log('\n📋 Recent alerts:');
    summary.recentAlerts.slice(0, 3).forEach(alert => {
      console.log(`  ${alert.emoji} ${alert.symbol}: ${alert.score} score (${alert.category})`);
    });
    
    if (summary.recommendations.length > 0) {
      console.log('\n💡 Top recommendation:');
      const topRec = summary.recommendations[0];
      console.log(`  ${topRec.message}`);
      console.log(`  Action: ${topRec.action}`);
    }
    
    // Run sync script to update dashboard data
    console.log('\n🔄 Syncing data for dashboard...');
    try {
      const syncScript = path.join(__dirname, 'sync-wolf-data.js');
      if (fs.existsSync(syncScript)) {
        const { execSync } = require('child_process');
        const syncResult = execSync(`node "${syncScript}"`, {
          encoding: 'utf8',
          cwd: path.join(__dirname, '..')
        });
        console.log('✅ Dashboard data synced successfully');
      } else {
        console.log('⚠️  Sync script not found:', syncScript);
      }
    } catch (syncError) {
      console.error('❌ Error syncing dashboard data:', syncError.message);
    }
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
  runWolfPack,
  analyzeAlerts,
  generateDashboardSummary
};