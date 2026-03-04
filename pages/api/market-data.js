// pages/api/market-data.js - API endpoint for real-time market data
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // Read the real-time data file
    const dataPath = path.join(process.cwd(), 'neo-crypto/data/enhanced-live-data.json');
    
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: 'Market data not found' });
    }

    const rawData = fs.readFileSync(dataPath, 'utf8');
    const marketData = JSON.parse(rawData);

    // Extract top tokens by volume
    const topTokens = marketData.tokens
      ?.sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 5)
      .map(token => ({
        symbol: token.symbol,
        name: token.symbol, // In real implementation, you'd have a name mapping
        price: token.price,
        priceChange24h: token.change24h,
        volume24h: token.volume24h,
        liquidity: token.liquidity
      })) || [];

    // Extract narratives from the data
    const narratives = marketData.narratives?.map(narrative => ({
      name: narrative.name,
      score: narrative.score,
      tokens: narrative.tokens || [],
      description: getNarrativeDescription(narrative.name)
    })) || [];

    // Extract whale activity
    const whaleActivity = marketData.whaleActivity?.map(activity => ({
      type: activity.type,
      token: activity.token,
      amount: activity.amount,
      value: activity.value,
      wallet: activity.wallet,
      timestamp: new Date().toISOString() // In real implementation, use actual timestamp
    })) || [];

    // Transform the data for the frontend
    const transformedData = {
      lastUpdated: marketData.lastUpdated || new Date().toISOString(),
      marketSentiment: marketData.marketSentiment || 'neutral',
      topTokens,
      narratives: narratives.slice(0, 3),
      whaleActivity: whaleActivity.slice(0, 3),
      stats: {
        totalTokens: marketData.tokens?.length || 0,
        totalNarratives: marketData.narratives?.length || 0,
        totalWhales: marketData.whaleWallets?.length || 0,
      }
    };

    // Set cache headers (5 seconds for real-time data)
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate');
    res.status(200).json(transformedData);
    
  } catch (error) {
    console.error('Error serving market data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch market data',
      details: error.message 
    });
  }
}

// Helper function to get narrative descriptions
function getNarrativeDescription(name) {
  const descriptions = {
    'Meme Coins': 'Community-driven tokens with viral potential',
    'AI Agents': 'AI-powered protocols and infrastructure',
    'RWA': 'Real World Assets tokenized on-chain',
    'DeFi': 'Decentralized finance protocols',
    'Gaming': 'Blockchain gaming and metaverse'
  };
  return descriptions[name] || 'Emerging market trend';
}