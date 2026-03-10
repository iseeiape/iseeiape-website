// pages/api/unified-market-data.js - Unified API endpoint combining Wolf Alerts + Enhanced Market Data
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Load Wolf Alerts data
    const wolfDataPath = path.join(process.cwd(), 'data/wolf-alerts-latest.json');
    let wolfAlerts = [];
    if (fs.existsSync(wolfDataPath)) {
      const rawWolfData = fs.readFileSync(wolfDataPath, 'utf8');
      wolfAlerts = JSON.parse(rawWolfData);
    }

    // Load Enhanced Market Data
    const enhancedDataPath = path.join(process.cwd(), 'neo-crypto/data/enhanced-live-data.json');
    let enhancedData = { tokens: [], narratives: [], whales: { recentActivity: [] } };
    if (fs.existsSync(enhancedDataPath)) {
      const rawEnhancedData = fs.readFileSync(enhancedDataPath, 'utf8');
      enhancedData = JSON.parse(rawEnhancedData);
    }

    // Transform Wolf Alerts
    const wolfTokens = wolfAlerts
      ?.sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(alert => ({
        symbol: alert.symbol,
        name: alert.name || alert.symbol,
        price: alert.price,
        priceChange24h: alert.price_change_24h || 0,
        priceChange1h: alert.price_change_1h || 0,
        volume24h: alert.volume_24h || 0,
        liquidity: alert.liquidity || 0,
        score: alert.score,
        address: alert.address,
        dex: alert.dex || 'unknown',
        pairUrl: alert.pair_url,
        signals: alert.signals || [],
        source: 'wolf-alerts',
        type: 'micro-cap'
      })) || [];

    // Transform Enhanced Data tokens
    const enhancedTokens = enhancedData.tokens
      ?.sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 10)
      .map(token => ({
        symbol: token.symbol,
        name: token.symbol,
        price: token.price,
        priceChange24h: token.change24h || 0,
        priceChange1h: 0, // Not in current data
        volume24h: token.volume24h || 0,
        liquidity: token.liquidity || 0,
        score: calculateEnhancedTokenScore(token),
        address: token.pairAddress,
        dex: token.dex || 'unknown',
        pairUrl: `https://dexscreener.com/${token.dex || 'solana'}/${token.pairAddress}`,
        signals: getEnhancedTokenSignals(token),
        source: 'enhanced-data',
        type: 'established'
      })) || [];

    // Combine and deduplicate tokens (prefer Wolf Alerts for micro-caps)
    const combinedTokens = [...wolfTokens];
    const wolfSymbols = new Set(wolfTokens.map(t => t.symbol));
    
    enhancedTokens.forEach(token => {
      if (!wolfSymbols.has(token.symbol)) {
        combinedTokens.push(token);
      }
    });

    // Sort combined tokens by score (Wolf) or volume (Enhanced)
    combinedTokens.sort((a, b) => {
      if (a.source === 'wolf-alerts' && b.source === 'wolf-alerts') {
        return b.score - a.score;
      }
      if (a.source === 'wolf-alerts') return -1;
      if (b.source === 'wolf-alerts') return 1;
      return b.volume24h - a.volume24h;
    });

    // Create narratives from both sources
    const narratives = [
      // Wolf Alert narratives
      { 
        name: '🔥 Wolf High Confidence', 
        score: 95, 
        tokens: wolfTokens.filter(t => t.score >= 90).map(t => t.symbol),
        description: 'Wolf Alerts 90+ score - High conviction micro-caps',
        source: 'wolf-alerts',
        type: 'micro-cap'
      },
      { 
        name: '🚀 Wolf Momentum', 
        score: 80, 
        tokens: wolfTokens.filter(t => t.priceChange24h > 50).map(t => t.symbol),
        description: 'High 24h gains in micro-caps',
        source: 'wolf-alerts',
        type: 'momentum'
      },
      
      // Enhanced Data narratives
      ...(enhancedData.narratives?.map(narrative => ({
        name: narrative.name,
        score: narrative.score,
        tokens: narrative.tokenCount > 0 ? [narrative.topPerformer] : [],
        description: `${narrative.tokenCount} tokens, top: ${narrative.topPerformer}`,
        source: 'enhanced-data',
        type: 'market-trend'
      })) || [])
    ];

    // Whale activity
    const whaleActivity = [
      // From Wolf Alerts (if available)
      ...(wolfAlerts
        ?.filter(alert => alert.whaleActivity)
        .map(alert => ({
          type: 'buy',
          token: alert.symbol,
          amount: 'Large',
          value: alert.volume_24h ? `$${(alert.volume_24h * 0.1).toFixed(0)}K` : 'Unknown',
          wallet: 'Multiple',
          timestamp: new Date().toISOString(),
          source: 'wolf-alerts'
        })) || []),
      
      // From Enhanced Data
      ...(enhancedData.whales?.recentActivity?.map(activity => ({
        type: activity.action,
        token: activity.token,
        amount: activity.amount,
        value: activity.value,
        wallet: activity.wallet,
        timestamp: activity.timestamp,
        source: 'enhanced-data'
      })) || [])
    ];

    // Market overview
    const marketOverview = {
      totalTokensTracked: combinedTokens.length,
      totalVolume24h: combinedTokens.reduce((sum, token) => sum + (token.volume24h || 0), 0),
      averageScore: combinedTokens.length > 0 
        ? combinedTokens.reduce((sum, token) => sum + (token.score || 0), 0) / combinedTokens.length 
        : 0,
      bullishTokens: combinedTokens.filter(t => t.priceChange24h > 0).length,
      bearishTokens: combinedTokens.filter(t => t.priceChange24h < 0).length,
      topPerformer: combinedTokens.length > 0 ? combinedTokens[0] : null,
      lastUpdated: new Date().toISOString(),
      dataSources: ['wolf-alerts', 'enhanced-market-data']
    };

    // Return unified response
    return res.status(200).json({
      success: true,
      data: {
        tokens: combinedTokens.slice(0, 15), // Top 15 tokens
        narratives: narratives.slice(0, 5), // Top 5 narratives
        whaleActivity: whaleActivity.slice(0, 10), // Recent 10 whale moves
        marketOverview,
        metadata: {
          wolfAlertsCount: wolfTokens.length,
          enhancedTokensCount: enhancedTokens.length,
          combinedCount: combinedTokens.length,
          lastWolfUpdate: getFileModifiedTime(wolfDataPath),
          lastEnhancedUpdate: getFileModifiedTime(enhancedDataPath)
        }
      }
    });

  } catch (error) {
    console.error('Error in unified-market-data API:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch market data',
      details: error.message
    });
  }
}

// Helper functions
function calculateEnhancedTokenScore(token) {
  let score = 50; // Base score
  
  // Volume-based scoring
  if (token.volume24h > 1000000) score += 20;
  else if (token.volume24h > 100000) score += 10;
  else if (token.volume24h > 10000) score += 5;
  
  // Price change scoring
  if (token.change24h > 20) score += 20;
  else if (token.change24h > 10) score += 10;
  else if (token.change24h > 5) score += 5;
  else if (token.change24h < -10) score -= 10;
  
  // Liquidity scoring
  if (token.liquidity > 100000) score += 10;
  else if (token.liquidity > 10000) score += 5;
  
  return Math.min(Math.max(score, 0), 100);
}

function getEnhancedTokenSignals(token) {
  const signals = [];
  
  if (token.volume24h > 1000000) signals.push('💰 High volume');
  if (token.change24h > 20) signals.push('🚀 Strong momentum');
  if (token.liquidity > 100000) signals.push('💧 Good liquidity');
  if (token.change24h < -10) signals.push('⚠️ Downward pressure');
  
  if (signals.length === 0) {
    signals.push('📊 Moderate activity');
  }
  
  return signals;
}

function getFileModifiedTime(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return stats.mtime.toISOString();
    }
  } catch (error) {
    // Ignore errors
  }
  return null;
}