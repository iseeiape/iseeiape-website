import fs from 'fs/promises';
import path from 'path';

interface MarketData {
  timestamp: string;
  topTokens: Array<{
    symbol: string;
    name: string;
    price: number;
    priceChange24h: number;
    volume24h: number;
    marketCap: number;
    score: number;
  }>;
  narratives: Array<{
    name: string;
    score: number;
    tokens: string[];
    description: string;
  }>;
  totalMarketCap: number;
  fearGreedIndex: number;
}

interface WhaleAlert {
  id: string;
  timestamp: string;
  wallet: string;
  token: string;
  amount: number;
  value: number;
  type: 'buy' | 'sell' | 'transfer';
  exchange?: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
}

interface HistoricalData {
  date: string;
  price: number;
  volume: number;
  transactions: number;
  whaleActivity: number;
  socialSentiment: number;
}

const DATA_DIR = path.join(process.cwd(), 'neo-crypto', 'data');
const ARCHIVE_DIR = path.join(process.cwd(), 'content', 'automation', 'archive');

export async function getMarketData(limit: number = 100, offset: number = 0): Promise<MarketData> {
  try {
    const dataPath = path.join(DATA_DIR, 'enhanced-live-data.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const marketData: MarketData = JSON.parse(data);
    
    // Apply limit and offset
    return {
      ...marketData,
      topTokens: marketData.topTokens.slice(offset, offset + limit),
      narratives: marketData.narratives.slice(offset, offset + limit)
    };
  } catch (error) {
    console.error('Error reading market data:', error);
    
    // Return fallback data
    return getFallbackMarketData();
  }
}

export async function getWhaleAlerts(limit: number = 100, offset: number = 0): Promise<WhaleAlert[]> {
  try {
    // Read from archive files
    const files = await fs.readdir(ARCHIVE_DIR);
    const jsonFiles = files.filter(file => file.startsWith('content_') && file.endsWith('.json'));
    
    const allAlerts: WhaleAlert[] = [];
    
    // Read last 10 files (most recent)
    for (const file of jsonFiles.slice(-10)) {
      try {
        const content = await fs.readFile(path.join(ARCHIVE_DIR, file), 'utf-8');
        const data = JSON.parse(content);
        
        if (data.whaleAlerts && Array.isArray(data.whaleAlerts)) {
          allAlerts.push(...data.whaleAlerts);
        }
      } catch (error) {
        console.error(`Error reading file ${file}:`, error);
      }
    }
    
    // Sort by timestamp (newest first) and apply limit/offset
    return allAlerts
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(offset, offset + limit);
    
  } catch (error) {
    console.error('Error reading whale alerts:', error);
    return getFallbackWhaleAlerts(limit);
  }
}

export async function getHistoricalData(
  startDate: string,
  endDate: string,
  limit: number = 100
): Promise<HistoricalData[]> {
  try {
    // In production, this would query a database
    // For now, generate mock historical data
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const historicalData: HistoricalData[] = [];
    
    for (let i = 0; i < Math.min(days, limit); i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      
      historicalData.push({
        date: date.toISOString().split('T')[0],
        price: 100 + Math.random() * 50,
        volume: 1000000 + Math.random() * 5000000,
        transactions: 1000 + Math.random() * 5000,
        whaleActivity: Math.random() * 100,
        socialSentiment: 50 + Math.random() * 50
      });
    }
    
    return historicalData;
    
  } catch (error) {
    console.error('Error generating historical data:', error);
    return [];
  }
}

export async function getPredictiveAnalytics(token: string) {
  // This would connect to ML model in production
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

// Fallback data functions
function getFallbackMarketData(): MarketData {
  return {
    timestamp: new Date().toISOString(),
    topTokens: [
      { symbol: 'SOL', name: 'Solana', price: 150.25, priceChange24h: 5.2, volume24h: 2500000000, marketCap: 65000000000, score: 85 },
      { symbol: 'BONK', name: 'Bonk', price: 0.000025, priceChange24h: 12.5, volume24h: 150000000, marketCap: 1600000000, score: 78 },
      { symbol: 'WIF', name: 'dogwifhat', price: 2.85, priceChange24h: 8.3, volume24h: 300000000, marketCap: 2850000000, score: 72 }
    ],
    narratives: [
      { name: 'AI Agents', score: 88, tokens: ['RNDR', 'TAO', 'FET'], description: 'AI-powered trading and automation' },
      { name: 'Meme Coins', score: 76, tokens: ['BONK', 'WIF', 'POPCAT'], description: 'Community-driven meme tokens' },
      { name: 'DeFi 2.0', score: 65, tokens: ['JUP', 'RAY', 'ORCA'], description: 'Next-generation DeFi protocols' }
    ],
    totalMarketCap: 2500000000000,
    fearGreedIndex: 72
  };
}

function getFallbackWhaleAlerts(limit: number): WhaleAlert[] {
  const alerts: WhaleAlert[] = [];
  const tokens = ['SOL', 'BONK', 'WIF', 'JUP', 'RAY'];
  const types: Array<'buy' | 'sell' | 'transfer'> = ['buy', 'sell', 'transfer'];
  const impacts: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
  
  for (let i = 0; i < limit; i++) {
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
    const token = tokens[Math.floor(Math.random() * tokens.length)];
    
    alerts.push({
      id: `alert_${Date.now()}_${i}`,
      timestamp,
      wallet: `4${Math.random().toString(36).substr(2, 42)}`,
      token,
      amount: Math.random() * 10000,
      value: Math.random() * 1000000,
      type: types[Math.floor(Math.random() * types.length)],
      exchange: Math.random() > 0.5 ? 'Raydium' : 'Orca',
      confidence: 70 + Math.random() * 30,
      impact: impacts[Math.floor(Math.random() * impacts.length)]
    });
  }
  
  return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Utility function to check data freshness
export async function checkDataFreshness(): Promise<{
  isFresh: boolean;
  lastUpdated: string;
  ageMinutes: number;
}> {
  try {
    const dataPath = path.join(DATA_DIR, 'enhanced-live-data.json');
    const stats = await fs.stat(dataPath);
    const lastUpdated = stats.mtime;
    const ageMinutes = (Date.now() - lastUpdated.getTime()) / (1000 * 60);
    
    return {
      isFresh: ageMinutes < 5, // Data is fresh if less than 5 minutes old
      lastUpdated: lastUpdated.toISOString(),
      ageMinutes: Math.round(ageMinutes)
    };
  } catch (error) {
    return {
      isFresh: false,
      lastUpdated: new Date().toISOString(),
      ageMinutes: 999
    };
  }
}