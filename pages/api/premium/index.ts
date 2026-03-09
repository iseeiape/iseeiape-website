import { NextApiRequest, NextApiResponse } from 'next';
import { verifyApiKey, checkRateLimit, getUserTier } from '../../../lib/auth';
import { getMarketData, getWhaleAlerts, getHistoricalData } from '../../../lib/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check API key
  const apiKey = req.headers['x-api-key'] as string;
  const user = await verifyApiKey(apiKey);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  // Check rate limit based on user tier
  const rateLimit = await checkRateLimit(user.id, user.tier);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: rateLimit.retryAfter,
      limit: rateLimit.limit,
      remaining: rateLimit.remaining
    });
  }

  try {
    const { endpoint, limit = 100, offset = 0 } = req.query;
    
    switch (endpoint) {
      case 'market-data':
        const marketData = await getMarketData(Number(limit), Number(offset));
        return res.status(200).json(marketData);
        
      case 'whale-alerts':
        const whaleAlerts = await getWhaleAlerts(Number(limit), Number(offset));
        return res.status(200).json(whaleAlerts);
        
      case 'historical':
        if (user.tier === 'free') {
          return res.status(403).json({ error: 'Historical data requires Premium or Pro tier' });
        }
        const { startDate, endDate } = req.query;
        const historicalData = await getHistoricalData(
          startDate as string,
          endDate as string,
          Number(limit)
        );
        return res.status(200).json(historicalData);
        
      case 'predictions':
        if (user.tier !== 'pro') {
          return res.status(403).json({ error: 'Predictive analytics requires Pro tier' });
        }
        const { token } = req.query;
        const predictions = await getPredictions(token as string);
        return res.status(200).json(predictions);
        
      default:
        return res.status(400).json({ error: 'Invalid endpoint' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper functions
async function getPredictions(token: string) {
  // This would connect to your ML model or prediction service
  return {
    token,
    predictions: [
      { timeframe: '1h', direction: 'up', confidence: 0.75 },
      { timeframe: '4h', direction: 'up', confidence: 0.68 },
      { timeframe: '24h', direction: 'up', confidence: 0.82 }
    ],
    factors: [
      { name: 'Whale accumulation', score: 0.85 },
      { name: 'Social sentiment', score: 0.72 },
      { name: 'Technical indicators', score: 0.78 }
    ],
    updatedAt: new Date().toISOString()
  };
}