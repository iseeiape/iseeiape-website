import type { NextApiRequest, NextApiResponse } from 'next';

// Mock data for Cielo API (since we don't have actual API keys)
const MOCK_WALLETS = [
  {
    address: '0x9a3...7c1e',
    label: 'Whale #29 (Cross-Chain Specialist)',
    chain: 'base',
    totalProfit: 67200,
    totalROI: 3692,
    recentTrades: [
      { token: 'DAVE', profit: 67200, roi: 3692, timeframe: '38h' },
      { token: 'MOLTEN', profit: 45200, roi: 2169, timeframe: '24h' },
    ],
    lastActive: '2025-02-04T14:30:00Z'
  },
  {
    address: '0x8b2...9d3f',
    label: 'Whale #17 (Solana OG)',
    chain: 'solana',
    totalProfit: 894000,
    totalROI: 10075,
    recentTrades: [
      { token: 'BIGTROUT', profit: 894000, roi: 10075, timeframe: '72h' },
      { token: 'BONK', profit: 125000, roi: 850, timeframe: '48h' },
    ],
    lastActive: '2025-02-03T09:15:00Z'
  },
  {
    address: '0x7c4...2a8b',
    label: 'Whale #42 (AI Agent Trader)',
    chain: 'solana',
    totalProfit: 231500,
    totalROI: 4520,
    recentTrades: [
      { token: 'AGIX', profit: 231500, roi: 4520, timeframe: '96h' },
      { token: 'FET', profit: 89200, roi: 3210, timeframe: '120h' },
    ],
    lastActive: '2025-02-02T16:45:00Z'
  },
  {
    address: '0x6d9...5c7e',
    label: 'Whale #13 (DeFi Yield Farmer)',
    chain: 'base',
    totalProfit: 56700,
    totalROI: 2890,
    recentTrades: [
      { token: 'AAVE', profit: 56700, roi: 2890, timeframe: '168h' },
      { token: 'COMP', profit: 34200, roi: 1870, timeframe: '144h' },
    ],
    lastActive: '2025-02-01T11:20:00Z'
  },
  {
    address: '0x5e8...3b9d',
    label: 'Whale #55 (Meme Coin Hunter)',
    chain: 'solana',
    totalProfit: 123400,
    totalROI: 5670,
    recentTrades: [
      { token: 'WIF', profit: 123400, roi: 5670, timeframe: '48h' },
      { token: 'POPCAT', profit: 87600, roi: 4320, timeframe: '72h' },
    ],
    lastActive: '2025-01-31T19:30:00Z'
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { chain, limit = 10 } = req.query;
    
    // Filter by chain if specified
    let filteredWallets = MOCK_WALLETS;
    if (chain && typeof chain === 'string') {
      filteredWallets = MOCK_WALLETS.filter(wallet => 
        wallet.chain.toLowerCase() === chain.toLowerCase()
      );
    }
    
    // Sort by total profit (descending)
    const sortedWallets = filteredWallets
      .sort((a, b) => b.totalProfit - a.totalProfit)
      .slice(0, parseInt(limit as string));
    
    // Calculate statistics
    const stats = {
      totalWallets: sortedWallets.length,
      totalProfit: sortedWallets.reduce((sum, wallet) => sum + wallet.totalProfit, 0),
      averageROI: sortedWallets.reduce((sum, wallet) => sum + wallet.totalROI, 0) / sortedWallets.length,
      byChain: {
        solana: sortedWallets.filter(w => w.chain === 'solana').length,
        base: sortedWallets.filter(w => w.chain === 'base').length
      }
    };
    
    // Cache for 5 minutes (wallet data doesn't change too frequently)
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.status(200).json({
      success: true,
      data: {
        wallets: sortedWallets,
        statistics: stats,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch wallet data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}