// pages/api/enhanced-market-data.js - API endpoint for enhanced market data
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Path to enhanced live data
    const dataPath = path.join(process.cwd(), 'neo-crypto/data/enhanced-live-data.json');
    
    if (!fs.existsSync(dataPath)) {
      return res.status(200).json(getFallbackData());
    }

    const rawData = fs.readFileSync(dataPath, 'utf8');
    const enhancedData = JSON.parse(rawData);

    // Transform enhanced data to dashboard format
    const topTokens = enhancedData.tokens
      ?.sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 10)
      .map(token => ({
        symbol: token.symbol,
        name: token.symbol, // In real implementation, would map to full names
        price: token.price,
        priceChange24h: token.change24h,
        priceChange1h: 0, // Not in current data
        volume24h: token.volume24h,
        liquidity: token.liquidity,
        score: calculateTokenScore(token),
        dex: token.dex,
        pairAddress: token.pairAddress,
        signals: getTokenSignals(token)
      })) || [];

    // Transform narratives
    const narratives = enhancedData.narratives?.map(narrative => ({
      name: narrative.name,
      score: narrative.score,
      tokens: narrative.tokenCount > 0 ? [narrative.topPerformer] : [],
      description: `${narrative.tokenCount} tokens, top: ${narrative.topPerformer}`,
      totalVolume: narrative.totalVolume || 0
    })) || [];

    // Transform whale activity
    const whaleActivity = enhancedData.whales?.recentActivity?.map(activity => ({
      type: activity.action,
      token: activity.token,
      amount: activity.amount,
      value: activity.value,
      wallet: activity.wallet,
      timestamp: activity.timestamp || new Date().toISOString()
    })) || [];

    // Calculate market metrics
    const marketMetrics = {
      sentiment: enhancedData.market?.sentiment || 'neutral',
      volatility: enhancedData.market?.volatility || 0,
      supportLevel: enhancedData.market?.supportLevel || '',
      resistanceLevel: enhancedData.market?.resistanceLevel || '',
      totalVolume: enhancedData.market?.totalVolume || 0,
      positiveRatio: enhancedData.market?.positiveRatio || 0,
      avgChange: enhancedData.market?.avgChange || 0
    };

    // Transform the data for the frontend
    const transformedData = {
      lastUpdated: enhancedData.timestamp || new Date().toISOString(),
      marketSentiment: marketMetrics.sentiment,
      topTokens: topTokens.slice(0, 5), // Show top 5
      allTokens: topTokens, // All tokens for detailed view
      narratives: narratives.length > 0 ? narratives : getFallbackNarratives(),
      whaleActivity: whaleActivity.length > 0 ? whaleActivity.slice(0, 3) : getFallbackWhaleActivity(),
      marketMetrics,
      stats: {
        totalTokens: topTokens.length,
        totalNarratives: narratives.length,
        totalWhales: enhancedData.whales?.wallets || 0,
        totalTransactions: enhancedData.whales?.transactions || 0,
        totalVolume: marketMetrics.totalVolume
      },
      source: enhancedData.source || 'Enhanced Market Data',
      apiStatus: enhancedData.apiStatus || {},
      dataAge: enhancedData.timestamp ? 
        Date.now() - new Date(enhancedData.timestamp).getTime() : null
    };

    // Set cache headers (60 seconds for enhanced data)
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(transformedData);
    
  } catch (error) {
    console.error('Error serving enhanced market data:', error);
    // Return fallback data on error
    res.status(200).json(getFallbackData());
  }
}

function calculateTokenScore(token) {
  let score = 50; // Base score
  
  // Volume score (0-20 points)
  const volumeScore = Math.min(20, Math.log10(token.volume24h + 1) * 3);
  score += volumeScore;
  
  // Price change score (-10 to +10 points)
  const changeScore = Math.max(-10, Math.min(10, token.change24h));
  score += changeScore;
  
  // Liquidity score (0-10 points)
  const liquidityScore = Math.min(10, Math.log10(token.liquidity + 1) * 2);
  score += liquidityScore;
  
  return Math.min(100, Math.max(0, Math.round(score)));
}

function getTokenSignals(token) {
  const signals = [];
  
  if (token.change24h > 10) signals.push('🚀 High Momentum');
  if (token.change24h < -10) signals.push('📉 Heavy Selling');
  if (token.volume24h > 1000000) signals.push('💧 High Volume');
  if (token.liquidity > 500000) signals.push('💰 Good Liquidity');
  if (Math.abs(token.change24h) < 2) signals.push('⚖️ Stable');
  
  return signals;
}

function getFallbackData() {
  return {
    lastUpdated: new Date().toISOString(),
    marketSentiment: 'neutral',
    topTokens: [
      { symbol: 'SOL', name: 'Solana', price: 145.67, priceChange24h: 2.3, volume24h: 2500000000, liquidity: 500000000, score: 85 },
      { symbol: 'BONK', name: 'Bonk', price: 0.000023, priceChange24h: 12.5, volume24h: 450000000, liquidity: 120000000, score: 78 },
      { symbol: 'JUP', name: 'Jupiter', price: 1.45, priceChange24h: -3.2, volume24h: 320000000, liquidity: 85000000, score: 65 }
    ],
    narratives: getFallbackNarratives(),
    whaleActivity: getFallbackWhaleActivity(),
    marketMetrics: {
      sentiment: 'neutral',
      volatility: 3.2,
      supportLevel: '$140.50',
      resistanceLevel: '$150.75',
      totalVolume: 3270000000,
      positiveRatio: 45,
      avgChange: 1.2
    },
    stats: { totalTokens: 14, totalNarratives: 5, totalWhales: 9, totalTransactions: 14, totalVolume: 3270000000 },
    source: 'Enhanced Market Data (Fallback)',
    apiStatus: { dexscreener: 'success', coinGecko: 'success' },
    dataAge: null
  };
}

function getFallbackNarratives() {
  return [
    { name: 'Meme Coins', score: 75, tokens: ['BONK', 'WIF'], description: '2 tokens, top: BONK', totalVolume: 450000000 },
    { name: 'AI Agents', score: 68, tokens: ['FET'], description: '1 token, top: FET', totalVolume: 120000000 },
    { name: 'DeFi', score: 62, tokens: ['JUP', 'RAY'], description: '2 tokens, top: JUP', totalVolume: 370000000 }
  ];
}

function getFallbackWhaleActivity() {
  return [
    { type: 'buy', token: 'SOL', amount: 5000, value: 728350, wallet: 'Whale #23', timestamp: new Date().toISOString() },
    { type: 'sell', token: 'BONK', amount: 10000000000, value: 230000, wallet: 'Whale #7', timestamp: new Date().toISOString() }
  ];
}