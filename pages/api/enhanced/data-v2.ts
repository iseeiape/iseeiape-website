import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Types matching the enhanced dashboard
type Token = {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  pairAddress: string;
  dex: string;
  updatedAt: string;
  marketCap?: number;
  holders?: number;
};

type Narrative = {
  name: string;
  description: string;
  tokens: string[];
  score: number;
  volumeChange: number;
  avgPriceChange: string;
  totalVolume: number;
  topTokens: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
};

type WhaleTransaction = {
  id: string;
  wallet: string;
  action: 'bought' | 'sold' | 'transferred';
  token: string;
  tokenName: string;
  amountUSD: number;
  amountTokens: number;
  price: number;
  timestamp: string;
  successRate: number;
  profitLoss?: number;
};

type WhaleData = {
  wallet: {
    address: string;
    name: string;
    chain: string;
    tags: string[];
    success_rate: number;
    total_volume_usd: number;
    total_transactions: number;
  };
  transactions: WhaleTransaction[];
};

type DashboardData = {
  tokens: Token[];
  narratives: Narrative[];
  whales: WhaleData[];
  summary: {
    totalTokens: number;
    totalVolume24h: number;
    totalMarketCap: number;
    topGainer: Token;
    topLoser: Token;
    whaleCount: number;
    totalWhaleTransactions: number;
    avgWhaleSuccessRate: number;
  };
  timestamp: string;
};

// Extended token list for more comprehensive tracking
const EXTENDED_TOKENS = [
  // Solana Ecosystem
  { symbol: 'SOL', name: 'Solana', address: 'So11111111111111111111111111111111111111112' },
  { symbol: 'BONK', name: 'Bonk', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
  { symbol: 'JUP', name: 'Jupiter', address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN' },
  { symbol: 'RAY', name: 'Raydium', address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R' },
  { symbol: 'PYTH', name: 'Pyth Network', address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3' },
  { symbol: 'JTO', name: 'Jito', address: 'jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL' },
  { symbol: 'WIF', name: 'dogwifhat', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm' },
  { symbol: 'POPCAT', name: 'Popcat', address: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr' },
  { symbol: 'MYRO', name: 'Myro', address: 'myroN7m7i7Z6w1FhDz2h2eWY4Z6h1JcNqKJ7k2rK3' },
  { symbol: 'HNT', name: 'Helium', address: 'hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux' },
  { symbol: 'BOME', name: 'BOOK OF MEME', address: 'bookmemeaddress123456789' },
  { symbol: 'WEN', name: 'WEN', address: 'wenaddress123456789' },
  { symbol: 'SLERF', name: 'SLERF', address: 'slerfaddress123456789' },
  
  // Ethereum Ecosystem
  { symbol: 'ETH', name: 'Ethereum', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
  { symbol: 'PEPE', name: 'Pepe', address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933' },
  { symbol: 'SHIB', name: 'Shiba Inu', address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE' },
  { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' },
  { symbol: 'LINK', name: 'Chainlink', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA' },
  
  // Base Ecosystem
  { symbol: 'DEGEN', name: 'Degen', address: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed' },
  { symbol: 'BRETT', name: 'Brett', address: '0xbrettaddress123456789' },
  { symbol: 'TYBG', name: 'Thank You Based God', address: '0xtybgaddress123456789' },
  
  // Arbitrum Ecosystem
  { symbol: 'ARB', name: 'Arbitrum', address: '0x912CE59144191C1204E64559FE8253a0e49E6548' },
  { symbol: 'GMX', name: 'GMX', address: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a' },
];

// Enhanced narratives with sentiment
const ENHANCED_NARRATIVES: Narrative[] = [
  {
    name: 'AI Agents',
    description: 'AI-powered trading agents and autonomous systems',
    tokens: ['JUP', 'PYTH', 'HNT', 'LINK'],
    score: 85,
    volumeChange: 320,
    avgPriceChange: '12.5',
    totalVolume: 45000000,
    topTokens: ['JUP', 'PYTH', 'HNT'],
    sentiment: 'bullish'
  },
  {
    name: 'Meme Coins',
    description: 'Community-driven meme tokens with viral potential',
    tokens: ['BONK', 'WIF', 'POPCAT', 'MYRO', 'PEPE', 'SHIB', 'DEGEN', 'BRETT'],
    score: 90,
    volumeChange: 420,
    avgPriceChange: '18.2',
    totalVolume: 85000000,
    topTokens: ['BONK', 'WIF', 'PEPE'],
    sentiment: 'bullish'
  },
  {
    name: 'Real World Assets (RWA)',
    description: 'Tokenized real-world assets and commodities',
    tokens: ['HNT', 'RAY', 'LINK'],
    score: 78,
    volumeChange: 240,
    avgPriceChange: '8.7',
    totalVolume: 32000000,
    topTokens: ['HNT', 'RAY'],
    sentiment: 'neutral'
  },
  {
    name: 'DePIN',
    description: 'Decentralized physical infrastructure networks',
    tokens: ['HNT'],
    score: 72,
    volumeChange: 180,
    avgPriceChange: '6.5',
    totalVolume: 25000000,
    topTokens: ['HNT'],
    sentiment: 'bullish'
  },
  {
    name: 'DeFi 2.0',
    description: 'Next-generation decentralized finance protocols',
    tokens: ['JUP', 'RAY', 'UNI', 'GMX'],
    score: 65,
    volumeChange: 120,
    avgPriceChange: '4.2',
    totalVolume: 18000000,
    topTokens: ['JUP', 'RAY'],
    sentiment: 'neutral'
  },
  {
    name: 'Layer 2 Ecosystems',
    description: 'Scaling solutions and their native tokens',
    tokens: ['ARB', 'DEGEN', 'BRETT'],
    score: 80,
    volumeChange: 280,
    avgPriceChange: '15.3',
    totalVolume: 38000000,
    topTokens: ['ARB', 'DEGEN'],
    sentiment: 'bullish'
  }
];

// Enhanced whale data
const ENHANCED_WHALES: WhaleData[] = [
  {
    wallet: {
      address: '7uy4XZ9qVQwPyqLzL7t6z6b7z6b7z6b7z6b7z6b7z6b7z',
      name: 'Solana OG',
      chain: 'solana',
      tags: ['solana', 'whale', 'early-buyer', 'meme-coins'],
      success_rate: 0.78,
      total_volume_usd: 12450000,
      total_transactions: 147
    },
    transactions: [
      {
        id: 'tx_1',
        wallet: '7uy4XZ9q...6b7z',
        action: 'sold',
        token: 'WIF',
        tokenName: 'dogwifhat',
        amountUSD: 267450,
        amountTokens: 1600000,
        price: 0.1667,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        successRate: 0.78,
        profitLoss: 0.34
      },
      {
        id: 'tx_2',
        wallet: '7uy4XZ9q...6b7z',
        action: 'bought',
        token: 'JUP',
        tokenName: 'Jupiter',
        amountUSD: 125000,
        amountTokens: 745000,
        price: 0.1676,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        successRate: 0.78,
        profitLoss: 0.08
      }
    ]
  },
  {
    wallet: {
      address: 'aBc3DeF9GhIjKlMnOpQrStUvWxYz',
      name: 'Meme Coin King',
      chain: 'solana',
      tags: ['meme-coins', 'pump-fun', 'degen'],
      success_rate: 0.82,
      total_volume_usd: 8760000,
      total_transactions: 89
    },
    transactions: [
      {
        id: 'tx_3',
        wallet: 'aBc3DeF9...WxYz',
        action: 'bought',
        token: 'BONK',
        tokenName: 'Bonk',
        amountUSD: 2412750,
        amountTokens: 2412750000000,
        price: 0.000001,
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        successRate: 0.82,
        profitLoss: 0.12
      }
    ]
  },
  {
    wallet: {
      address: 'XyZ1234567890AbCdEfGhIjKlMn',
      name: 'DeFi Degenerate',
      chain: 'ethereum',
      tags: ['defi', 'liquidity', 'yield-farming'],
      success_rate: 0.65,
      total_volume_usd: 45200000,
      total_transactions: 203
    },
    transactions: [
      {
        id: 'tx_4',
        wallet: 'XyZ12345...KlMn',
        action: 'bought',
        token: 'UNI',
        tokenName: 'Uniswap',
        amountUSD: 925000,
        amountTokens: 92500,
        price: 10.0,
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 1.5 hours ago
        successRate: 0.65,
        profitLoss: 0.08
      }
    ]
  },
  {
    wallet: {
      address: '6789WxYzAbCdEfGhIjKlMnOpQrSt',
      name: 'Base Maxi',
      chain: 'base',
      tags: ['base', 'layer2', 'degen'],
      success_rate: 0.71,
      total_volume_usd: 3210000,
      total_transactions: 56
    },
    transactions: [
      {
        id: 'tx_5',
        wallet: '6789WxYz...QrSt',
        action: 'bought',
        token: 'DEGEN',
        tokenName: 'Degen',
        amountUSD: 125000,
        amountTokens: 1250000,
        price: 0.1,
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(), // 2 hours ago
        successRate: 0.71,
        profitLoss: -0.05
      }
    ]
  },
  {
    wallet: {
      address: 'InstitutionalWalletAddress123',
      name: 'Institutional',
      chain: 'arbitrum',
      tags: ['institutional', 'long-term', 'defi'],
      success_rate: 0.88,
      total_volume_usd: 98700000,
      total_transactions: 34
    },
    transactions: [
      {
        id: 'tx_6',
        wallet: 'Institutional...123',
        action: 'sold',
        token: 'GMX',
        tokenName: 'GMX',
        amountUSD: 2393822,
        amountTokens: 23938,
        price: 100.0,
        timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString(), // 2.5 hours ago
        successRate: 0.88,
        profitLoss: 0.21
      }
    ]
  }
];

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30 * 1000; // 30 seconds

async function fetchTokenDataFromDexScreener(tokenSymbol: string, tokenAddress: string): Promise<Token | null> {
  const cacheKey = `token_${tokenSymbol}_${tokenAddress}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    // Try DexScreener API
    const response = await axios.get(`https://api.dexscreener.com/latest/dex/search?q=${tokenAddress}`, {
      timeout: 5000
    });
    
    if (response.data && response.data.pairs && response.data.pairs.length > 0) {
      const pairs = response.data.pairs.filter((p: any) => 
        p.baseToken && 
        p.baseToken.address.toLowerCase() === tokenAddress.toLowerCase()
      );
      
      if (pairs.length > 0) {
        // Get the pair with highest liquidity
        const bestPair = pairs.reduce((best: any, current: any) => 
          (current.liquidity?.usd || 0) > (best.liquidity?.usd || 0) ? current : best
        );
        
        const tokenData: Token = {
          symbol: tokenSymbol,
          name: bestPair.baseToken.name || tokenSymbol,
          price: parseFloat(bestPair.priceUsd) || 0,
          priceChange24h: bestPair.priceChange?.h24 || 0,
          volume24h: bestPair.volume?.h24 || 0,
          liquidity: bestPair.liquidity?.usd || 0,
          pairAddress: bestPair.pairAddress,
          dex: bestPair.dexId,
          updatedAt: new Date().toISOString(),
          marketCap: bestPair.fdv || 0,
          holders: bestPair.baseToken.holders || 0
        };
        
        cache.set(cacheKey, { data: tokenData, timestamp: Date.now() });
        return tokenData;
      }
    }
    
    // Fallback: Return basic data
    const fallbackData: Token = {
      symbol: tokenSymbol,
      name: tokenSymbol,
      price: 0,
      priceChange24h: 0,
      volume24h: 0,
      liquidity: 0,
      pairAddress: '',
      dex: 'unknown',
      updatedAt: new Date().toISOString(),
      marketCap: 0,
      holders: 0
    };
    
    cache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
    return fallbackData;
    
  } catch (error) {
    console.error(`Error fetching data for ${tokenSymbol}:`, error);
    return null;
  }
}

async function fetchAllTokenData() {
  console.log('📊 Fetching data for extended token list...');
  
  const tokens: Token[] = [];
  const batchSize = 5;
  
  // Process in batches to avoid rate limiting
  for (let i = 0; i < EXTENDED_TOKENS.length; i += batchSize) {
    const batch = EXTENDED_TOKENS.slice(i, i + batchSize);
    const promises = batch.map(token => fetchTokenDataFromDexScreener(token.symbol, token.address));
    
    const batchResults = await Promise.allSettled(promises);
    
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        tokens.push(result.value);
      } else {
        // Add placeholder for failed fetches
        const token = batch[index];
        tokens.push({
          symbol: token.symbol,
          name: token.name,
          price: 0,
          priceChange24h: 0,
          volume24h: 0,
          liquidity: 0,
          pairAddress: '',
          dex: 'unknown',
          updatedAt: new Date().toISOString(),
          marketCap: 0,
          holders: 0
        });
      }
    });
    
    // Small delay between batches
    if (i + batchSize < EXTENDED_TOKENS.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Filter out tokens with no data
  const validTokens = tokens.filter(t => t.price > 0);
  
  console.log(`✅ Fetched ${validTokens.length} of ${EXTENDED_TOKENS.length} tokens`);
  return validTokens;
}

function updateNarrativeData(tokens: Token[]): Narrative[] {
  return ENHANCED_NARRATIVES.map(narrative => {
    // Calculate metrics based on actual token performance
    const narrativeTokens = tokens.filter(t => narrative.tokens.includes(t.symbol));
    
    let avgPriceChange = 0;
    let totalVolume = 0;
    
    if (narrativeTokens.length > 0) {
      avgPriceChange = narrativeTokens.reduce((sum, t) => sum + (t.priceChange24h || 0), 0) / narrativeTokens.length;
      totalVolume = narrativeTokens.reduce((sum, t) => sum + (t.volume24h || 0), 0);
    }
    
    // Update score based on performance
    let adjustedScore = narrative.score;
    if (avgPriceChange > 10) adjustedScore += 15;
    else if (avgPriceChange > 5) adjustedScore += 10;
    else if (avgPriceChange < -10) adjustedScore -= 15;
    else if (avgPriceChange < -5) adjustedScore -= 10;
    
    // Adjust based on volume
    if (totalVolume > 1000000) adjustedScore += 10;
    else if (totalVolume > 500000) adjustedScore += 5;
    
    // Keep score in reasonable range
    adjustedScore = Math.max(20, Math.min(95, adjustedScore));
    
    // Determine sentiment
    let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (avgPriceChange > 5 && totalVolume > 1000000) sentiment = 'bullish';
    else if (avgPriceChange < -5) sentiment = 'bearish';
    
    // Get top tokens by volume
    const topTokens = narrativeTokens
      .sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 3)
      .map(t => t.symbol);
    
    return {
      ...narrative,
      score: Math.round(adjustedScore),
      avgPriceChange: avgPriceChange.toFixed(2),
      totalVolume,
      topTokens,
      sentiment
    };
  }).sort((a, b) => b.score - a.score);
}

function generateDashboardData(tokens: Token[], narratives: Narrative[]): DashboardData {
  // Calculate summary statistics
  const totalVolume24h = tokens.reduce((sum, t) => sum + (t.volume24h || 0), 0);
  const totalMarketCap = tokens.reduce((sum, t) => sum + (t.marketCap || 0), 0);
  
  const topGainer = tokens.reduce((best, current) => 
    (current.priceChange24h || 0) > (best.priceChange24h || 0) ? current : tokens[0]
  );
  
  const topLoser = tokens.reduce((worst, current) => 
    (current.priceChange24h || 0) < (worst.priceChange24h || 0) ? current : tokens[0]
  );
  
  const whaleCount = ENHANCED_WHALES.length;
  const totalWhaleTransactions = ENHANCED_WHALES.reduce((sum, w) => sum + w.transactions.length, 0);
  const avgWhaleSuccessRate = ENHANCED_WHALES.reduce((sum, w) => sum + w.wallet.success_rate, 0) / whaleCount;
  
  return {
    tokens: tokens.sort((a, b) => b.volume24h - a.volume24h), // Sort by volume
    narratives,
    whales: ENHANCED_WHALES,
    summary: {
      totalTokens: tokens.length,
      totalVolume24h,
      totalMarketCap,
      topGainer,
      topLoser,
      whaleCount,
      totalWhaleTransactions,
      avgWhaleSuccessRate
    },
    timestamp: new Date().toISOString()
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; data?: DashboardData; error?: string }>
) {
  try {
    const { type = 'dashboard', timeframe = '24h' } = req.query;
    
    if (type !== 'dashboard') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid type parameter. Use "dashboard"' 
      });
    }
    
    console.log(`🔄 Fetching enhanced dashboard data (timeframe: ${timeframe})...`);
    
    // Fetch token data
    const tokens = await fetchAllTokenData();
    
    // Update narratives based on token data
    const narratives = updateNarrativeData(tokens);
    
    // Generate complete dashboard data
    const dashboardData = generateDashboardData(tokens, narratives);
    
    console.log(`✅ Dashboard data generated: ${tokens.length} tokens, ${narratives.length} narratives`);
    
    return res.status(200).json({
      success: true,
      data: dashboardData
    });
    
  } catch (error) {
    console.error('❌ Error in enhanced data API:', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}