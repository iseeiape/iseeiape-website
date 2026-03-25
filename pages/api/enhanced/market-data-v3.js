// pages/api/enhanced/market-data-v3.js - Cached enhanced market data API
import fs from 'fs';
import path from 'path';
import cache from '../../../lib/cache';

// Cache configuration
const CACHE_KEY = 'market-data-v3';
const CACHE_TTL = 15; // 15 seconds for real-time data

export default async function handler(req, res) {
  try {
    // Check cache first
    const cachedData = cache.get(CACHE_KEY);
    if (cachedData) {
      console.log('📦 Serving from cache');
      return res.status(200).json({
        ...cachedData,
        cached: true,
        cacheHit: true
      });
    }

    console.log('🔄 Cache miss, processing fresh data');
    
    // Read from live data file
    const liveDataFile = path.join(process.cwd(), 'data/wolf-live.json');
    const latestDataFile = path.join(process.cwd(), 'data/wolf-alerts-latest.json');
    
    let wolfAlerts = [];
    let dataSource = 'none';
    
    // Try to read live data first
    if (fs.existsSync(liveDataFile)) {
      const rawData = fs.readFileSync(liveDataFile, 'utf8');
      const liveData = JSON.parse(rawData);
      wolfAlerts = liveData.alerts || [];
      dataSource = 'live';
    } 
    // Fall back to latest data
    else if (fs.existsSync(latestDataFile)) {
      const rawData = fs.readFileSync(latestDataFile, 'utf8');
      wolfAlerts = JSON.parse(rawData);
      dataSource = 'latest';
    }
    
    if (!wolfAlerts || wolfAlerts.length === 0) {
      console.log('No Wolf alerts data found, using sample data');
      const sampleData = getEnhancedSampleData();
      cache.set(CACHE_KEY, sampleData, CACHE_TTL);
      return res.status(200).json({
        ...sampleData,
        cached: false,
        cacheHit: false,
        dataSource: 'sample'
      });
    }

    // Process and enhance the data
    const startTime = Date.now();
    const processedAlerts = wolfAlerts.map(alert => {
      // Calculate additional metrics
      const score = alert.score || calculateScore(alert);
      const confidence = calculateConfidence(alert);
      const riskLevel = calculateRiskLevel(alert);
      const volatility = calculateVolatility(alert);
      const trendStrength = calculateTrendStrength(alert);
      
      return {
        ...alert,
        score,
        confidence,
        riskLevel,
        volatility,
        trendStrength,
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
    const topTokens = sortedAlerts.slice(0, 15).map(alert => ({
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
      volatility: alert.volatility,
      trendStrength: alert.trendStrength,
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
    
    // Calculate advanced metrics
    const advancedMetrics = calculateAdvancedMetrics(sortedAlerts);
    
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
      advancedMetrics,
      stats: {
        totalTokens: sortedAlerts.length,
        totalNarratives: narratives.length,
        totalWhales: whaleActivity.length,
        averageScore: Math.round(sortedAlerts.reduce((sum, a) => sum + a.score, 0) / sortedAlerts.length),
        highConfidenceTokens: sortedAlerts.filter(a => a.score >= 80).length,
        highRiskTokens: sortedAlerts.filter(a => a.riskLevel === 'high').length,
        processingTime: Date.now() - startTime,
        dataSource
      },
      cache: cache.getStats()
    };

    // Cache the result
    cache.set(CACHE_KEY, enhancedData, CACHE_TTL);

    res.status(200).json({
      ...enhancedData,
      cached: false,
      cacheHit: false
    });

  } catch (error) {
    console.error('Error in market-data-v3 API:', error);
    
    // Try to serve cached data even if there's an error
    const cachedData = cache.get(CACHE_KEY);
    if (cachedData) {
      console.log('⚠️  Error occurred, serving stale cache');
      return res.status(200).json({
        ...cachedData,
        cached: true,
        cacheHit: true,
        error: error.message,
        stale: true
      });
    }
    
    res.status(500).json({
      error: 'Failed to fetch market data',
      message: error.message,
      lastUpdated: new Date().toISOString()
    });
  }
}

// Enhanced calculation functions
function calculateVolatility(alert) {
  const priceChange1h = Math.abs(alert.price_change_1h || alert.priceChange1h || 0);
  const priceChange24h = Math.abs(alert.price_change_24h || alert.priceChange24h || 0);
  
  if (priceChange1h > 50 || priceChange24h > 200) return 'very-high';
  if (priceChange1h > 20 || priceChange24h > 100) return 'high';
  if (priceChange1h > 10 || priceChange24h > 50) return 'medium';
  return 'low';
}

function calculateTrendStrength(alert) {
  const change24h = alert.price_change_24h || alert.priceChange24h || 0;
  const volume = alert.volume_24h || alert.volume24h || 0;
  
  let strength = 0;
  
  // Price momentum
  if (change24h > 100) strength += 40;
  else if (change24h > 50) strength += 30;
  else if (change24h > 20) strength += 20;
  else if (change24h > 10) strength += 10;
  
  // Volume confirmation
  if (volume > 1000000) strength += 30;
  else if (volume > 100000) strength += 20;
  else if (volume > 50000) strength += 10;
  
  // Liquidity support
  if (alert.liquidity > 50000) strength += 20;
  else if (alert.liquidity > 10000) strength += 10;
  
  if (strength >= 80) return 'very-strong';
  if (strength >= 60) return 'strong';
  if (strength >= 40) return 'moderate';
  return 'weak';
}

function calculateAdvancedMetrics(alerts) {
  const totalAlerts = alerts.length;
  if (totalAlerts === 0) return {};
  
  const totalVolume = alerts.reduce((sum, a) => sum + (a.volume24h || 0), 0);
  const totalLiquidity = alerts.reduce((sum, a) => sum + (a.liquidity || 0), 0);
  const avgScore = alerts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAlerts;
  
  // Market breadth
  const bullishCount = alerts.filter(a => (a.priceChange24h || 0) > 0).length;
  const bearishCount = alerts.filter(a => (a.priceChange24h || 0) < 0).length;
  const marketBreadth = (bullishCount / totalAlerts) * 100;
  
  // Volume concentration
  const sortedByVolume = [...alerts].sort((a, b) => b.volume24h - a.volume24h);
  const top5Volume = sortedByVolume.slice(0, 5).reduce((sum, a) => sum + (a.volume24h || 0), 0);
  const volumeConcentration = (top5Volume / totalVolume) * 100;
  
  // Risk distribution
  const highRiskCount = alerts.filter(a => a.riskLevel === 'high').length;
  const mediumRiskCount = alerts.filter(a => a.riskLevel === 'medium').length;
  const lowRiskCount = alerts.filter(a => a.riskLevel === 'low').length;
  
  return {
    totalAlerts,
    totalVolume,
    totalLiquidity,
    averageScore: Math.round(avgScore),
    marketBreadth: Math.round(marketBreadth),
    volumeConcentration: Math.round(volumeConcentration),
    riskDistribution: {
      high: Math.round((highRiskCount / totalAlerts) * 100),
      medium: Math.round((mediumRiskCount / totalAlerts) * 100),
      low: Math.round((lowRiskCount / totalAlerts) * 100)
    },
    topPerformer: alerts.length > 0 ? alerts[0]?.symbol : 'N/A',
    worstPerformer: alerts.length > 0 ? alerts[alerts.length - 1]?.symbol : 'N/A'
  };
}

// Existing helper functions (from v2)
function calculateScore(alert) {
  let score = 50;
  if (alert.price_change_24h > 100) score += 30;
  else if (alert.price_change_24h > 50) score += 20;
  else if (alert.price_change_24h > 20) score += 10;
  
  if (alert.volume_24h > 1000000) score += 20;
  else if (alert.volume_24h > 100000) score += 10;
  
  if (alert.liquidity > 50000) score += 10;
  else if (alert.liquidity > 10000) score += 5;
  
  return Math.min(100, score);
}

function calculateConfidence(alert) {
  const factors = [];
  if (alert.volume_24h > 100000) factors.push('high-volume');
  if (alert.liquidity > 20000) factors.push('good-liquidity');
  if (alert.price_change_24h > 50) factors.push('strong-momentum');
  
  if (factors.length >= 3) return 'high';
  if (factors.length >= 2) return 'medium';
  return 'low';
}

function calculateRiskLevel(alert) {
  if (alert.liquidity < 10000) return 'high';
  if (alert.volume_24h < 50000) return 'medium';
  return 'low';
}

function generateSignals(alert) {
  const signals = [];
  if (alert.price_change_24h > 100) signals.push('🚀 Mega pump: +' + alert.price_change_24h.toFixed(0) + '% (24h)');
  else if (alert.price_change_24h > 50) signals.push('📈 Strong pump: +' + alert.price_change_24h.toFixed(0) + '% (24h)');
  else if (alert.price_change_24h > 20) signals.push('📊 Good momentum: +' + alert.price_change_24h.toFixed(0) + '% (24h)');
  
  if (alert.volume_24h > 1000000) signals.push('💰 High volume: $' + (alert.volume_24h / 1000000).toFixed(1) + 'M');
  else if (alert.volume_24h > 100000) signals.push('💸 Good volume: $' + (alert.volume_24h / 1000).toFixed(0) + 'K');
  
  if (alert.liquidity > 50000) signals.push('💪 Strong liquidity: $' + (alert.liquidity / 1000).toFixed(0) + 'K');
  else if (alert.liquidity > 10000) signals.push('🛡️  Decent liquidity: $' + (alert.liquidity / 1000).toFixed(0) + 'K');
  
  return signals;
}

function generateNarratives(alerts) {
  const narratives = [];
  
  // Find top performers
  const topPerformers = alerts
    .filter(a => a.priceChange24h > 50)
    .slice(0, 3);
  
  if (topPerformers.length > 0) {
    narratives.push({
      title: '🔥 Hot Tokens Alert',
      content: `${topPerformers.map(t => t.symbol).join(', ')} showing strong momentum with gains over 50% in 24h.`,
      sentiment: 'bullish',
      priority: 'high'
    });
  }
  
  // Check for new pairs
  const newPairs = alerts.filter(a => a.alert_type === '🆕 NEW_PAIR');
  if (newPairs.length > 0) {
    narratives.push({
      title: '🆕 Fresh Launches',
      content: `${newPairs.length} new token pairs detected. Early movers advantage potential.`,
      sentiment: 'neutral',
      priority: 'medium'
    });
  }
  
  // Volume leaders
  const volumeLeaders = alerts
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, 3);
  
  if (volumeLeaders.length > 0 && volumeLeaders[0].volume24h > 100000) {
    narratives.push({
      title: '💰 Volume Surge',
      content: `${volumeLeaders[0].symbol} leading volume with $${(volumeLeaders[0].volume24h / 1000).toFixed(0)}K traded.`,
      sentiment: 'bullish',
      priority: 'medium'
    });
  }
  
  return narratives;
}

function generateWhaleActivity(alerts) {
  // Simulate whale activity based on volume and liquidity
  return alerts
    .filter(a => a.volume24h > 50000 || a.liquidity > 20000)
    .slice(0, 5)
    .map(alert => ({
      token: alert.symbol,
      action: 'buying',
      size: `$${Math.round(alert.volume24h * 0.1)}`,
      confidence: 'high',
      timestamp: new Date().toISOString()
    }));
}

function calculateMarketSentiment(alerts) {
  const bullishCount = alerts.filter(a => (a.priceChange24h || 0) > 0).length;
  const totalCount = alerts.length;
  
  if (totalCount === 0) return 'neutral';
  
  const bullishPercentage = (bullishCount / totalCount) * 100;
  
  if (bullishPercentage >= 70) return 'bullish';
  if (bullishPercentage >= 40) return 'neutral';
  return 'bearish';
}

function getEnhancedSampleData() {
  return {
    lastUpdated: new Date().toISOString(),
    marketSentiment: 'bullish',
    topTokens: [
      {
        symbol: 'DOG',
        name: 'Dogcoin',
        price: 0.0001234,
        priceChange1h: 25.6,
        priceChange24h: 141.2,
        volume24h: 372000,
        liquidity: 85000,
        marketCap: 1234000,
        score: 92,
        confidence: 'high',
        riskLevel: 'low',
        volatility: 'high',
        trendStrength: 'very-strong',
        address: '8pF36k7NaqTHTjdbJ5uvBS4HsZ5SmoXifgVUw4hkpump',
        signals: ['🚀 Mega pump: +141% (24h)', '💰 High volume: $372K', '💪 Strong liquidity: $85K'],
        chain: 'solana',
        pairUrl: 'https://dexscreener.com/solana/8pF36k7NaqTHTjdbJ5uvBS4HsZ5SmoXifgVUw4hkpump'
      }
    ],
    narratives: [
      {
        title: '🔥 Dog Season Incoming',
        content: 'DOG token leading the pack with 141% gains in 24h. Meme coin momentum building.',
        sentiment: 'bullish',
        priority: 'high'
      }
    ],
    whaleActivity: [
      {
        token: 'DOG',
        action: 'accumulating',
        size: '$37,200',
        confidence: 'high',
        timestamp: new Date().toISOString()
      }
    ],
    advancedMetrics: {
      totalAlerts: 1,
      totalVolume: 372000,
      totalLiquidity: 85000,
      averageScore: 92,
      marketBreadth: 100,
      volumeConcentration: 100,
      riskDistribution: {
        high: 0,
        medium: 0,
        low: 100
      },
      topPerformer: 'DOG',
      worstPerformer: 'N/A'
    },
    stats: {
      totalTokens: 1,
      totalNarratives: 1,
      totalWhales: 1,
      averageScore: 92,
      highConfidenceTokens: 1,
      highRiskTokens: 0,
      processingTime: 10,
      dataSource: 'sample'
    },
    cache: {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      totalKeys: 0,
      hitRate: '0%',
      memoryUsage: 0
    }
  };
}