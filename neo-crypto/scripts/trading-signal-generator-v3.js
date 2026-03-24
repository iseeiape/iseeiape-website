#!/usr/bin/env node

/**
 * Trading Signal Generator v3 - Enhanced with Neo Dashboard integration
 * 
 * This version integrates with the new Neo Dashboard v3 API for better data
 * and generates more sophisticated trading signals with risk management.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const CONFIG = {
  outputDir: path.join(__dirname, '../data/trading-signals'),
  dashboardApiUrl: 'http://localhost:3000/api/enhanced/market-data-v2',
  cacheFile: path.join(__dirname, '../data/wolf-pack-cache.json'),
  
  // Trading parameters
  maxPositions: 5,
  positionSize: 0.2, // 20% of portfolio per position
  maxRiskPerTrade: 0.02, // 2% max loss per trade
  minConfidence: 70,
  minLiquidity: 10000, // $10K minimum liquidity
  maxMarketCap: 5000000, // $5M maximum market cap for microcaps
  
  // Signal types with weights
  signalTypes: {
    ALPHA_HIGH_CONFIDENCE: { id: 'alpha_high_confidence', weight: 1.0 },
    MOMENTUM_BREAKOUT: { id: 'momentum_breakout', weight: 0.8 },
    NEW_PAIR_OPPORTUNITY: { id: 'new_pair_opportunity', weight: 0.7 },
    WHALE_ACCUMULATION: { id: 'whale_accumulation', weight: 0.9 },
    NARRATIVE_PLAY: { id: 'narrative_play', weight: 0.6 }
  },
  
  // Risk levels
  riskLevels: {
    LOW: { maxPositionSize: 0.25, stopLoss: 0.15 },
    MEDIUM: { maxPositionSize: 0.15, stopLoss: 0.25 },
    HIGH: { maxPositionSize: 0.10, stopLoss: 0.35 }
  }
};

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`📁 Created directory: ${CONFIG.outputDir}`);
  }
}

// Fetch data from Neo Dashboard API
async function fetchDashboardData() {
  try {
    console.log(`🔍 Fetching data from Neo Dashboard API...`);
    
    // Try local API first
    let response;
    try {
      response = await axios.get(CONFIG.dashboardApiUrl, { timeout: 10000 });
    } catch (localError) {
      console.log('⚠️  Local API failed, trying fallback...');
      // Fallback to sample data
      return generateSampleData();
    }
    
    if (response.status !== 200) {
      throw new Error(`API returned status ${response.status}`);
    }
    
    const data = response.data;
    console.log(`✅ Loaded ${data.topTokens?.length || 0} tokens from Neo Dashboard`);
    console.log(`📊 Market sentiment: ${data.marketSentiment}`);
    console.log(`🎯 Data quality: ${data.metadata?.dataQuality || 'unknown'}`);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching dashboard data:', error.message);
    console.log('🔄 Falling back to sample data...');
    return generateSampleData();
  }
}

// Generate sample data for testing/fallback
function generateSampleData() {
  console.log('📋 Generating sample data for testing...');
  
  return {
    lastUpdated: new Date().toISOString(),
    marketSentiment: 'bullish',
    topTokens: [
      {
        symbol: 'WIF',
        name: 'Dogwifhat',
        price: 0.2345,
        priceChange1h: 5.2,
        priceChange24h: 23.8,
        volume24h: 45000000,
        liquidity: 12000000,
        marketCap: 234500000,
        score: 95,
        confidence: 'very-high',
        riskLevel: 'low',
        address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
        signals: ['🚀 Daily moon: +23.8%', '💰 High volume: $45.0M', '💧 Strong liquidity: $12.0M'],
        chain: 'solana'
      },
      {
        symbol: 'BONK',
        name: 'Bonk',
        price: 0.000012,
        priceChange1h: 12.5,
        priceChange24h: 45.2,
        volume24h: 32000000,
        liquidity: 8500000,
        marketCap: 12000000,
        score: 92,
        confidence: 'high',
        riskLevel: 'low',
        address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        signals: ['📈 1h surge: +12.5%', '🚀 Daily moon: +45.2%', '💰 High volume: $32.0M'],
        chain: 'solana'
      },
      {
        symbol: 'POPCAT',
        name: 'Popcat',
        price: 0.0456,
        priceChange1h: -2.3,
        priceChange24h: 15.7,
        volume24h: 28000000,
        liquidity: 15000000,
        marketCap: 45600000,
        score: 88,
        confidence: 'high',
        riskLevel: 'low',
        address: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr',
        signals: ['🚀 Daily moon: +15.7%', '💧 Strong liquidity: $15.0M'],
        chain: 'solana'
      }
    ],
    narratives: [
      { name: '🔥 High Confidence Alpha', score: 95, tokens: ['WIF', 'BONK'], description: 'Tokens with Wolf score ≥ 90' },
      { name: '🚀 Momentum Plays', score: 85, tokens: ['BONK', 'POPCAT'], description: '24h gains > 50%' }
    ],
    metadata: {
      source: 'Neo Dashboard v3 (Sample)',
      version: '1.0.0',
      dataQuality: 'high'
    }
  };
}

// Calculate signal score for a token
function calculateSignalScore(token, marketData) {
  let score = token.score || 50;
  
  // Adjust based on confidence
  const confidenceMultiplier = {
    'very-high': 1.2,
    'high': 1.1,
    'medium': 1.0,
    'low': 0.8,
    'very-low': 0.6
  }[token.confidence] || 1.0;
  
  // Adjust based on risk level
  const riskMultiplier = {
    'low': 1.1,
    'medium': 1.0,
    'high': 0.7
  }[token.riskLevel] || 1.0;
  
  // Momentum bonus
  if (token.priceChange24h > 50) score += 15;
  else if (token.priceChange24h > 20) score += 10;
  else if (token.priceChange24h > 5) score += 5;
  
  // Volume bonus
  if (token.volume24h > 10000000) score += 10;
  else if (token.volume24h > 1000000) score += 5;
  
  // Liquidity bonus
  if (token.liquidity > 1000000) score += 10;
  else if (token.liquidity > 100000) score += 5;
  
  // Market cap bonus (smaller is better for microcaps)
  if (token.marketCap < 100000) score += 20;
  else if (token.marketCap < 500000) score += 15;
  else if (token.marketCap < 1000000) score += 10;
  
  // Apply multipliers
  score = score * confidenceMultiplier * riskMultiplier;
  
  // Cap at 100
  return Math.min(Math.max(score, 0), 100);
}

// Determine signal type for a token
function determineSignalType(token, marketData) {
  const score = token.score || 0;
  const confidence = token.confidence;
  const priceChange24h = token.priceChange24h || 0;
  
  // Check if token is in any narrative
  const inNarrative = marketData.narratives?.some(narrative => 
    narrative.tokens.includes(token.symbol)
  );
  
  if (score >= 90 && confidence === 'very-high') {
    return CONFIG.signalTypes.ALPHA_HIGH_CONFIDENCE;
  } else if (priceChange24h > 30 && score >= 75) {
    return CONFIG.signalTypes.MOMENTUM_BREAKOUT;
  } else if (inNarrative && score >= 70) {
    return CONFIG.signalTypes.NARRATIVE_PLAY;
  } else if (token.signals?.some(s => s.includes('whale') || s.includes('Whale'))) {
    return CONFIG.signalTypes.WHALE_ACCUMULATION;
  } else if (score >= 65) {
    return CONFIG.signalTypes.NEW_PAIR_OPPORTUNITY;
  }
  
  return null;
}

// Calculate position size based on risk
function calculatePositionSize(token, signalType, portfolioSize = 10000) {
  const baseSize = CONFIG.positionSize;
  const typeWeight = signalType?.weight || 0.5;
  const riskParams = CONFIG.riskLevels[token.riskLevel] || CONFIG.riskLevels.MEDIUM;
  
  // Adjust position size based on signal type weight and risk level
  let positionSize = baseSize * typeWeight * (riskParams.maxPositionSize / 0.15);
  
  // Adjust for confidence
  const confidenceMultiplier = {
    'very-high': 1.2,
    'high': 1.1,
    'medium': 1.0,
    'low': 0.7,
    'very-low': 0.5
  }[token.confidence] || 1.0;
  
  positionSize *= confidenceMultiplier;
  
  // Cap at max position size for risk level
  positionSize = Math.min(positionSize, riskParams.maxPositionSize);
  
  // Calculate dollar amount
  const dollarAmount = portfolioSize * positionSize;
  
  return {
    percentage: Math.round(positionSize * 100),
    dollarAmount: Math.round(dollarAmount),
    stopLoss: riskParams.stopLoss
  };
}

// Generate entry/exit points
function generateEntryExitPoints(token) {
  const currentPrice = token.price || 0.0001;
  const volatility = Math.min(Math.abs(token.priceChange24h || 0) / 100, 0.5);
  
  // Entry points (scaled based on volatility)
  const entryBelow = currentPrice * (1 - volatility * 0.3);
  const entryAbove = currentPrice * (1 + volatility * 0.1);
  
  // Take profit targets
  const tp1 = currentPrice * (1 + volatility * 0.5);
  const tp2 = currentPrice * (1 + volatility * 1.0);
  const tp3 = currentPrice * (1 + volatility * 2.0);
  
  // Stop loss (based on risk level)
  const stopLossMultiplier = {
    'low': 0.85,
    'medium': 0.75,
    'high': 0.65
  }[token.riskLevel] || 0.75;
  
  const stopLoss = currentPrice * stopLossMultiplier;
  
  return {
    entry: {
      primary: currentPrice.toFixed(8),
      limitBuy: entryBelow.toFixed(8),
      breakoutBuy: entryAbove.toFixed(8)
    },
    takeProfit: {
      tp1: tp1.toFixed(8),
      tp2: tp2.toFixed(8),
      tp3: tp3.toFixed(8)
    },
    stopLoss: stopLoss.toFixed(8),
    riskRewardRatio: (tp1 / currentPrice) / (1 - stopLossMultiplier)
  };
}

// Generate trading signals from market data
function generateTradingSignals(marketData) {
  const tokens = marketData.topTokens || [];
  const signals = [];
  
  console.log(`🎯 Generating signals for ${tokens.length} tokens...`);
  
  for (const token of tokens) {
    // Filter out low quality tokens
    if (token.score < CONFIG.minConfidence) continue;
    if (token.liquidity < CONFIG.minLiquidity) continue;
    if (token.marketCap > CONFIG.maxMarketCap) continue;
    
    const signalType = determineSignalType(token, marketData);
    if (!signalType) continue;
    
    const signalScore = calculateSignalScore(token, marketData);
    const position = calculatePositionSize(token, signalType);
    const points = generateEntryExitPoints(token);
    
    signals.push({
      token: token.symbol,
      name: token.name,
      signalType: signalType.id,
      signalScore: Math.round(signalScore),
      confidence: token.confidence,
      riskLevel: token.riskLevel,
      currentPrice: token.price,
      priceChange24h: token.priceChange24h,
      volume24h: token.volume24h,
      liquidity: token.liquidity,
      marketCap: token.marketCap,
      positionSize: position,
      points: points,
      signals: token.signals || [],
      address: token.address,
      chain: token.chain,
      generatedAt: new Date().toISOString()
    });
  }
  
  // Sort by signal score
  signals.sort((a, b) => b.signalScore - a.signalScore);
  
  console.log(`✅ Generated ${signals.length} trading signals`);
  return signals;
}

// Generate portfolio allocation
function generatePortfolioAllocation(signals, maxPositions = CONFIG.maxPositions) {
  const topSignals = signals.slice(0, maxPositions);
  
  if (topSignals.length === 0) {
    return {
      allocation: [],
      totalAllocated: 0,
      cashPosition: 100,
      recommendation: 'HOLD_CASH'
    };
  }
  
  const allocation = topSignals.map(signal => ({
    token: signal.token,
    allocation: signal.positionSize.percentage,
    amount: signal.positionSize.dollarAmount,
    signalType: signal.signalType,
    confidence: signal.confidence
  }));
  
  const totalAllocated = allocation.reduce((sum, item) => sum + item.allocation, 0);
  
  return {
    allocation,
    totalAllocated: Math.round(totalAllocated),
    cashPosition: Math.round(100 - totalAllocated),
    recommendation: totalAllocated > 50 ? 'AGGRESSIVE' : 
                   totalAllocated > 25 ? 'MODERATE' : 
                   'CONSERVATIVE'
  };
}

// Generate trading plan
function generateTradingPlan(signals, portfolioAllocation, marketData) {
  const topSignals = signals.slice(0, CONFIG.maxPositions);
  
  const plan = {
    metadata: {
      generatedAt: new Date().toISOString(),
      marketSentiment: marketData.marketSentiment,
      dataSource: marketData.metadata?.source || 'unknown',
      dataQuality: marketData.metadata?.dataQuality || 'unknown'
    },
    marketOverview: {
      sentiment: marketData.marketSentiment,
      totalOpportunities: signals.length,
      highConfidenceOpportunities: signals.filter(s => s.confidence === 'very-high' || s.confidence === 'high').length,
      averageSignalScore: Math.round(signals.reduce((sum, s) => sum + s.signalScore, 0) / Math.max(signals.length, 1))
    },
    portfolioAllocation,
    signals: topSignals.map(signal => ({
      token: signal.token,
      action: 'BUY',
      reason: `${signal.signalType.replace(/_/g, ' ').toUpperCase()} - ${signal.confidence.toUpperCase()} confidence`,
      entry: signal.points.entry.primary,
      takeProfit: [
        { level: 'TP1', price: signal.points.takeProfit.tp1, gain: `${Math.round((signal.points.takeProfit.tp1 / signal.currentPrice - 1) * 100)}%` },
        { level: 'TP2', price: signal.points.takeProfit.tp2, gain: `${Math.round((signal.points.takeProfit.tp2 / signal.currentPrice - 1) * 100)}%` },
        { level: 'TP3', price: signal.points.takeProfit.tp3, gain: `${Math.round((signal.points.takeProfit.tp3 / signal.currentPrice - 1) * 100)}%` }
      ],
      stopLoss: signal.points.stopLoss,
      positionSize: `${signal.positionSize.percentage}% ($${signal.positionSize.dollarAmount})`,
      riskReward: signal.points.riskRewardRatio.toFixed(2),
      confidence: signal.confidence,
      riskLevel: signal.riskLevel
    })),
    riskManagement: {
      maxDrawdown: '2% per trade',
      portfolioRisk: `${portfolioAllocation.totalAllocated}% allocated`,
      stopLossStrategy: 'Trailing stops after TP1 hit',
      positionSizing: 'Risk-adjusted based on confidence and volatility'
    },
    executionNotes: [
      'Enter on limit orders at suggested entry points',
      'Scale out at each take profit level',
      'Move stop loss to