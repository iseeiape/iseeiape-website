#!/usr/bin/env node

/**
 * Sync Wolf Data - Transform Wolf Pack data for dashboard consumption
 * 
 * This script:
 * 1. Reads wolf-live.json (from Wolf Pack Python)
 * 2. Transforms it to wolf-alerts-latest.json format (for dashboard)
 * 3. Updates the dashboard data file
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Input: Wolf Pack Python output
  wolfLiveFile: path.join(__dirname, '../data/wolf-live.json'),
  
  // Output: Dashboard API expected format
  dashboardFile: path.join(__dirname, '../data/wolf-alerts-latest.json'),
  
  // Wolf Pack summary (for additional context)
  summaryFile: path.join(__dirname, '../neo-crypto/data/wolf-pack-summary.json'),
  
  // Backup directory
  backupDir: path.join(__dirname, '../data/backups')
};

// Ensure backup directory exists
if (!fs.existsSync(CONFIG.backupDir)) {
  fs.mkdirSync(CONFIG.backupDir, { recursive: true });
}

// Backup existing file
function backupFile(filePath) {
  if (fs.existsSync(filePath)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(CONFIG.backupDir, `${path.basename(filePath)}.${timestamp}.bak`);
    fs.copyFileSync(filePath, backupFile);
    console.log(`📁 Backed up to: ${backupFile}`);
  }
}

// Transform Wolf Pack data to dashboard format
function transformToDashboardFormat(wolfData) {
  if (!Array.isArray(wolfData) || wolfData.length === 0) {
    console.log('⚠️  No wolf data to transform');
    return [];
  }
  
  console.log(`🔄 Transforming ${wolfData.length} wolf alerts...`);
  
  return wolfData.map(alert => {
    // Calculate some derived metrics
    const price = alert.price || 0;
    const volume24h = alert.volume_24h || alert.volume24h || 0;
    const liquidity = alert.liquidity || 0;
    const marketCap = alert.market_cap || alert.marketCap || 0;
    
    // Generate signals based on data
    const signals = [];
    
    if (volume24h > 1000000) signals.push('💰 High volume');
    if (volume24h > 100000) signals.push('📊 Good volume');
    
    if (liquidity > 500000) signals.push('💧 Strong liquidity');
    if (liquidity > 100000) signals.push('💧 Adequate liquidity');
    
    if (marketCap < 1000000) signals.push('💎 Micro cap gem');
    if (marketCap < 10000000) signals.push('💎 Small cap');
    
    if (alert.price_change_1h > 20) signals.push('🚀 Strong hourly gain');
    if (alert.price_change_1h > 10) signals.push('📈 Good hourly gain');
    
    if (alert.buys_1h > alert.sells_1h * 1.5) signals.push('📈 Buy pressure');
    if (alert.buys_24h > alert.sells_24h * 1.5) signals.push('📈 Sustained buying');
    
    // Add score-based signals
    if (alert.score >= 90) signals.push('🔥 Elite score');
    if (alert.score >= 80) signals.push('🔥 High confidence');
    if (alert.score >= 70) signals.push('✅ Good score');
    
    return {
      symbol: alert.symbol || 'UNKNOWN',
      name: alert.name || alert.symbol || 'Unknown Token',
      price: price,
      market_cap: marketCap,
      fdv: alert.fdv || marketCap,
      volume_24h: volume24h,
      liquidity: liquidity,
      price_change_5m: alert.price_change_5m || 0,
      price_change_1h: alert.price_change_1h || 0,
      price_change_24h: alert.price_change_24h || 0,
      buys_5m: alert.buys_5m || 0,
      sells_5m: alert.sells_5m || 0,
      buys_1h: alert.buys_1h || 0,
      sells_1h: alert.sells_1h || 0,
      buys_24h: alert.buys_24h || 0,
      sells_24h: alert.sells_24h || 0,
      address: alert.address || '',
      dex: alert.dex || 'unknown',
      pair_url: alert.pair_url || '',
      score: alert.score || 50,
      signals: signals.length > 0 ? signals : ['📊 Basic alert']
    };
  });
}

// Load Wolf Pack summary for additional context
function loadWolfPackSummary() {
  try {
    if (fs.existsSync(CONFIG.summaryFile)) {
      const summary = JSON.parse(fs.readFileSync(CONFIG.summaryFile, 'utf8'));
      console.log(`📊 Loaded Wolf Pack summary with ${summary.metadata?.alertCount || 0} alerts`);
      return summary;
    }
  } catch (error) {
    console.error('❌ Error loading Wolf Pack summary:', error.message);
  }
  return null;
}

// Enhance data with summary insights
function enhanceWithSummary(dashboardData, summary) {
  if (!summary || !dashboardData.length) return dashboardData;
  
  // Create a map of symbols to summary data
  const summaryMap = {};
  if (summary.recentAlerts) {
    summary.recentAlerts.forEach(alert => {
      if (!summaryMap[alert.symbol]) {
        summaryMap[alert.symbol] = {
          categories: new Set(),
          totalScore: 0,
          count: 0
        };
      }
      summaryMap[alert.symbol].categories.add(alert.category);
      summaryMap[alert.symbol].totalScore += alert.score;
      summaryMap[alert.symbol].count++;
    });
  }
  
  // Enhance dashboard data with summary info
  return dashboardData.map(token => {
    const enhancedToken = { ...token };
    const summaryInfo = summaryMap[token.symbol];
    
    if (summaryInfo) {
      // Calculate average score from summary
      const avgScore = Math.round(summaryInfo.totalScore / summaryInfo.count);
      
      // Use the higher score
      if (avgScore > enhancedToken.score) {
        enhancedToken.score = avgScore;
      }
      
      // Add category info to signals
      const categories = Array.from(summaryInfo.categories);
      if (categories.length > 0) {
        const categoryEmojis = {
          newpairs: '🆕',
          momentum: '📈',
          breakout: '🚀',
          volume: '📊',
          liquidity: '💧',
          alpha: '🐺'
        };
        
        categories.forEach(cat => {
          if (categoryEmojis[cat]) {
            enhancedToken.signals.push(`${categoryEmojis[cat]} ${cat.toUpperCase()}`);
          }
        });
      }
      
      // Add alert frequency
      if (summaryInfo.count > 1) {
        enhancedToken.signals.push(`🔔 ${summaryInfo.count}x alerts`);
      }
    }
    
    return enhancedToken;
  });
}

// Sort by score (highest first)
function sortByScore(data) {
  return data.sort((a, b) => (b.score || 0) - (a.score || 0));
}

// Main function
async function main() {
  console.log('🔄 Syncing Wolf Pack data for dashboard...\n');
  
  try {
    // Backup existing dashboard file
    console.log('📁 Creating backup...');
    backupFile(CONFIG.dashboardFile);
    
    // Check if wolf-live.json exists
    if (!fs.existsSync(CONFIG.wolfLiveFile)) {
      console.log(`❌ Wolf live file not found: ${CONFIG.wolfLiveFile}`);
      console.log('⚠️  Make sure Wolf Pack Python script is running');
      return;
    }
    
    // Load wolf-live.json
    console.log(`📂 Loading Wolf Pack data from: ${CONFIG.wolfLiveFile}`);
    const wolfDataRaw = fs.readFileSync(CONFIG.wolfLiveFile, 'utf8');
    const wolfDataParsed = JSON.parse(wolfDataRaw);
    
    // Handle different formats: could be array directly or object with alerts array
    let wolfData = [];
    if (Array.isArray(wolfDataParsed)) {
      wolfData = wolfDataParsed;
    } else if (wolfDataParsed.alerts && Array.isArray(wolfDataParsed.alerts)) {
      wolfData = wolfDataParsed.alerts;
    } else if (wolfDataParsed.data && Array.isArray(wolfDataParsed.data)) {
      wolfData = wolfDataParsed.data;
    } else {
      console.log('⚠️  Wolf data format not recognized');
      console.log('Structure:', Object.keys(wolfDataParsed));
      return;
    }
    
    if (wolfData.length === 0) {
      console.log('⚠️  Wolf data is empty');
      return;
    }
    
    console.log(`✅ Loaded ${wolfData.length} wolf alerts`);
    
    // Load Wolf Pack summary for additional context
    const summary = loadWolfPackSummary();
    
    // Transform to dashboard format
    let dashboardData = transformToDashboardFormat(wolfData);
    
    // Enhance with summary insights
    if (summary) {
      dashboardData = enhanceWithSummary(dashboardData, summary);
    }
    
    // Sort by score
    dashboardData = sortByScore(dashboardData);
    
    // Limit to top 100 tokens
    const maxTokens = 100;
    if (dashboardData.length > maxTokens) {
      console.log(`📊 Limiting to top ${maxTokens} tokens (from ${dashboardData.length})`);
      dashboardData = dashboardData.slice(0, maxTokens);
    }
    
    // Save to dashboard file
    console.log(`💾 Saving ${dashboardData.length} tokens to: ${CONFIG.dashboardFile}`);
    fs.writeFileSync(CONFIG.dashboardFile, JSON.stringify(dashboardData, null, 2), 'utf8');
    
    // Also create a simplified version for quick access
    const simplifiedData = dashboardData.slice(0, 20).map(token => ({
      symbol: token.symbol,
      name: token.name,
      price: token.price,
      price_change_24h: token.price_change_24h,
      score: token.score,
      signals: token.signals.slice(0, 3)
    }));
    
    const simplifiedFile = path.join(__dirname, '../data/wolf-alerts-simplified.json');
    fs.writeFileSync(simplifiedFile, JSON.stringify(simplifiedData, null, 2), 'utf8');
    
    console.log('\n✅ Sync completed successfully!');
    console.log(`📊 Total tokens: ${dashboardData.length}`);
    console.log(`🏆 Top token: ${dashboardData[0]?.symbol || 'None'} (score: ${dashboardData[0]?.score || 0})`);
    console.log(`💾 Files saved:`);
    console.log(`   • ${CONFIG.dashboardFile} (${dashboardData.length} tokens)`);
    console.log(`   • ${simplifiedFile} (${simplifiedData.length} tokens)`);
    
    // Show sample of top tokens
    console.log('\n🏆 Top 5 tokens:');
    dashboardData.slice(0, 5).forEach((token, i) => {
      console.log(`   ${i + 1}. ${token.symbol}: ${token.score} score, $${token.price?.toFixed(6) || 0}, ${token.price_change_24h?.toFixed(1) || 0}% 24h`);
    });
    
  } catch (error) {
    console.error('❌ Error syncing Wolf data:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
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
  transformToDashboardFormat,
  enhanceWithSummary,
  sortByScore
};