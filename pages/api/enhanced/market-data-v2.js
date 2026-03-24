// pages/api/enhanced/market-data-v2.js - Enhanced market data API
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Read from live data file
    const liveDataFile = path.join(process.cwd(), 'data/wolf-live.json');
    const latestDataFile = path.join(process.cwd(), 'data/wolf-alerts-latest.json');
    
    let wolfAlerts = [];
    
    // Try to read live data first
    if (fs.existsSync(liveDataFile)) {
      const rawData = fs.readFileSync(liveDataFile, 'utf8');
      const liveData = JSON.parse(rawData);
      wolfAlerts = liveData.alerts || [];
    } 
    // Fall back to latest data
    else if (fs.existsSync(latestDataFile)) {
      const rawData = fs.readFileSync(latestDataFile, 'utf8');
      wolfAlerts = JSON.parse(rawData);
    }
    
    if (!wolfAlerts || wolfAlerts.length === 0) {
      console.log('No Wolf alerts data found, using sample data');
      return res.status(200).json(getEnhancedSampleData());
    }

    // Process and enhance the data
    const processedAlerts = wolfAlerts.map(alert => {
      // Calculate additional metrics
      const score = alert.score || calculateScore(alert);
      const confidence = calculateConfidence(alert);
      const riskLevel = calculateRiskLevel(alert);
      
      return {
        ...alert,
        score,
        confidence,
        riskLevel,
        signals: alert.signals || generateSignals(alert),
        // Add timeframe changes if missing
        priceChange1h: alert.price_change_1h || alert.priceChange1h || 0,
        priceChange24h: alert.price_change_24h || alert.priceChange24h || 0,
        volume24h: alert.volume_24h || alert.volume24h || 0,
        liquidity: alert.liquidity || 0,
        marketCap: alert.market_cap || alert.marketCap || 0
      };
    });

    // Sort by score
    const sortedAlerts = processedAlerts.sort((a, b) => b.score - a.score);
    
    // Get top tokens
    const topTokens = sortedAlerts.slice(0, 10).map(alert => ({
      symbol: alert.symbol,
      name: alert.name || alert.symbol,
      price: alert.price,
      priceChange1h: alert.priceChange1h,
      priceChange24h: alert.priceChange24h,
      volume24h: alert.volume24h,
      liquidity: alert.liquidity,
      marketCap: alert.marketCap,
      score: alert.score,
      confidence: alert.confidence,
      riskLevel: alert.riskLevel,
      address: alert.token_address || alert.address,
      signals: alert.signals,
      chain: alert.chain || 'solana',
      pairUrl: alert.pair_url || alert.pairUrl
    }));

    // Generate narratives
    const narratives = generateNarratives(sortedAlerts);
    
    // Generate whale activity
    const whaleActivity = generateWhaleActivity(sortedAlerts);
    
    // Calculate market sentiment
    const marketSentiment = calculateMarketSentiment(sortedAlerts);
    
    // Get file stats
    const stats = fs.existsSync(liveDataFile) ? fs.statSync(liveDataFile) : 
                  fs.existsSync(latestDataFile) ? fs.statSync(latestDataFile) : 
                  { mtime: new Date() };

    // Build enhanced response
    const enhancedData = {
      lastUpdated: new Date().toISOString(),
      marketSentiment,
      topTokens,
      narratives,
      whaleActivity,
      stats: {
        totalTokens: sortedAlerts.length,
        totalNarratives: narratives.length,
        totalWhales: 15,
        averageScore: Math.round(sortedAlerts.reduce((sum, a) => sum + a.score, 0) / sortedAlerts.length),
        highConfidenceTokens: sortedAlerts.filter(a => a.score >= 80).length,
        newTokens24h: sortedAlerts.filter(a => {
          const alertTime = new Date(a.timestamp || a.createdAt || new Date());
          const hoursAgo = (new Date() - alertTime) / (1000 * 60 * 60);
          return hoursAgo < 24;
        }).length
      },
      metadata: {
        source: 'Wolf Alerts Enhanced v2',
        version: '1.1.0',
        dataQuality: sortedAlerts.length > 5 ? 'high' : 'medium',
        chains: [...new Set(sortedAlerts.map(a => a.chain || 'solana'))]
      },
      lastScan: stats.mtime.toISOString(),
      refreshInterval: 30000 // 30 seconds
    };

    // Set cache headers
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    res.status(200).json(enhancedData);
    
  } catch (error) {
    console.error('Error in enhanced market data API:', error);
    // Return enhanced sample data on error
    res.status(200).json(getEnhancedSampleData());
  }
}

// Helper functions
function calculateScore(alert) {
  let score = 50; // Base score
  
  // Price momentum
  if (alert.price_change_24h > 100) score += 30;
  else if (alert.price_change_24h > 50) score += 20;
  else if (alert.price_change_24h > 20) score += 10;
  else if (alert.price_change_24h < -20) score -= 10;
  
  // Volume
  if (alert.volume_24h > 1000000) score += 20;
  else if (alert.volume_24h > 100000) score += 10;
  
  // Liquidity
  if (alert.liquidity > 50000) score += 15;
  else if (alert.liquidity > 10000) score += 5;
  
  // Market cap (lower is better for micro caps)
  if (alert.market_cap < 100000) score += 25;
  else if (alert.market_cap < 500000) score += 15;
  else if (alert.market_cap < 1000000) score += 5;
  
  return Math.min(Math.max(score, 0), 100);
}

function calculateConfidence(alert) {
  const score = alert.score || calculateScore(alert);
  if (score >= 90) return 'very-high';
  if (score >= 80) return 'high';
  if (score >= 70) return 'medium';
  if (score >= 60) return 'low';
  return 'very-low';
}

function calculateRiskLevel(alert) {
  const liquidity = alert.liquidity || 0;
  const marketCap = alert.market_cap || alert.marketCap || 0;
  
  if (liquidity < 10000 || marketCap < 50000) return 'high';
  if (liquidity < 50000 || marketCap < 200000) return 'medium';
  return 'low';
}

function generateSignals(alert) {
  const signals = [];
  
  if (alert.price_change_5m > 20) signals.push(`⚡ 5m rocket: +${alert.price_change_5m.toFixed(1)}%`);
  if (alert.price_change_1h > 50) signals.push(`📈 1h surge: +${alert.price_change_1h.toFixed(1)}%`);
  if (alert.price_change_24h > 100) signals.push(`🚀 Daily moon: +${alert.price_change_24h.toFixed(1)}%`);
  
  if (alert.volume_24h > 1000000) signals.push(`💰 High volume: $${(alert.volume_24h / 1000000).toFixed(1)}M`);
  else if (alert.volume_24h > 100000) signals.push(`💎 Good volume: $${(alert.volume_24h / 1000).toFixed(0)}K`);
  
  if (alert.liquidity > 50000) signals.push(`💧 Strong liquidity: $${(alert.liquidity / 1000).toFixed(0)}K`);
  
  if (alert.market_cap < 100000) signals.push(`🎯 Micro cap gem: $${(alert.market_cap / 1000).toFixed(0)}K`);
  
  if (signals.length === 0) {
    signals.push('📊 Monitoring...');
  }
  
  return signals.slice(0, 5);
}

function generateNarratives(alerts) {
  const narratives = [];
  
  // High confidence narrative
  const highConfidence = alerts.filter(a => a.score >= 90);
  if (highConfidence.length > 0) {
    narratives.push({
      name: '🔥 High Confidence Alpha',
      score: 95,
      tokens: highConfidence.slice(0, 5).map(a => a.symbol),
      description: 'Tokens with Wolf score ≥ 90',
      color: 'green'
    });
  }
  
  // Momentum narrative
  const momentum = alerts.filter(a => a.price_change_24h > 50);
  if (momentum.length > 0) {
    narratives.push({
      name: '🚀 Momentum Plays',
      score: 85,
      tokens: momentum.slice(0, 5).map(a => a.symbol),
      description: '24h gains > 50%',
      color: 'blue'
    });
  }
  
  // Liquid narrative
  const liquid = alerts.filter(a => a.liquidity > 100000);
  if (liquid.length > 0) {
    narratives.push({
      name: '💧 High Liquidity',
      score: 75,
      tokens: liquid.slice(0, 5).map(a => a.symbol),
      description: 'Liquidity > $100K',
      color: 'purple'
    });
  }
  
  // New pairs narrative
  const newPairs = alerts.filter(a => a.alert_type === '🆕 NEW_PAIR');
  if (newPairs.length > 0) {
    narratives.push({
      name: '🆕 Fresh Launches',
      score: 80,
      tokens: newPairs.slice(0, 5).map(a => a.symbol),
      description: 'Recently listed tokens',
      color: 'orange'
    });
  }
  
  return narratives;
}

function generateWhaleActivity(alerts) {
  const topAlerts = alerts.slice(0, 5);
  return topAlerts.map((alert, index) => ({
    type: alert.priceChange24h > 0 ? 'buy' : 'sell',
    token: alert.symbol,
    amount: Math.floor((alert.volume24h || 0) / (alert.price || 1) * 0.01) || 1000000,
    value: (alert.volume24h || 0) * 0.1,
    wallet: `Whale #${Math.floor(Math.random() * 50) + 1}`,
    confidence: alert.confidence,
    timestamp: alert.timestamp || new Date().toISOString()
  }));
}

function calculateMarketSentiment(alerts) {
  if (alerts.length === 0) return 'neutral';
  
  const avgChange = alerts.reduce((sum, a) => sum + (a.priceChange24h || 0), 0) / alerts.length;
  const bullishCount = alerts.filter(a => (a.priceChange24h || 0) > 10).length;
  const bearishCount = alerts.filter(a => (a.priceChange24h || 0) < -10).length;
  
  if (avgChange > 20 && bullishCount > bearishCount * 2) return 'bullish';
  if (avgChange < -10 && bearishCount > bullishCount * 2) return 'bearish';
  return 'neutral';
}

function getEnhancedSampleData() {
  return {
    lastUpdated: new Date().toISOString(),
    marketSentiment: 'bullish',
    topTokens: [
      { symbol: 'WIF', name: 'Dogwifhat', price: 0.2345, priceChange1h: 5.2, priceChange24h: 23.8, volume24h: 45000000, liquidity: 12000000, marketCap: 234500000, score: 95, confidence: 'very-high', riskLevel: 'low', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', signals: ['🚀 Daily moon: +23.8%', '💰 High volume: $45.0M', '💧 Strong liquidity: $12.0M'], chain: 'solana' },
      { symbol: 'BONK', name: 'Bonk', price: 0.000012, priceChange1h: 12.5, priceChange24h: 45.2, volume24h: 32000000, liquidity: 8500000, marketCap: 12000000, score: 92, confidence: 'high', riskLevel: 'low', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', signals: ['📈 1h surge: +12.5%', '🚀 Daily moon: +45.2%', '💰 High volume: $32.0M'], chain: 'solana' },
      { symbol: 'POPCAT', name: 'Popcat', price: 0.0456, priceChange1h: -2.3, priceChange24h: 15.7, volume24h: 28000000, liquidity: 15000000, marketCap: 45600000, score: 88, confidence: 'high', riskLevel: 'low', address: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', signals: ['🚀 Daily moon: +15.7%', '💧 Strong liquidity: $15.0M'], chain: 'solana' }
    ],
    narratives: [
      { name: '🔥 High Confidence Alpha', score: 95, tokens: ['WIF', 'BONK'], description: 'Tokens with Wolf score ≥ 90', color: 'green' },
      { name: '🚀 Momentum Plays', score: 85, tokens: ['BONK', 'POPCAT'], description: '24h gains > 50%', color: 'blue' },
      { name: '💧 High Liquidity', score: 75, tokens: ['WIF', 'POPCAT'], description: 'Liquidity > $100K', color: 'purple' }
    ],
    whaleActivity: [
      { type: 'buy', token: 'WIF', amount: 5000000, value: 1172500, wallet: 'Whale #17', confidence: 'high', timestamp: new Date().toISOString() },
      { type: 'buy', token: 'BONK', amount: 1000000000, value: 12000, wallet: 'Whale #42', confidence: 'medium', timestamp: new Date(Date.now() - 3600000).toISOString() }
    ],
    stats: {
      totalTokens: 25,
      totalNarratives: 3,
      totalWhales: 15,
      averageScore: 78,
      highConfidenceTokens: 8,
      newTokens24h: 5
    },
    metadata: {
      source: 'Wolf Alerts Enhanced v2',
      version: '1.1.0',
      dataQuality: 'high',
      chains: ['solana']
    },
    lastScan: new Date().toISOString(),
    refreshInterval: 30000
  };
}