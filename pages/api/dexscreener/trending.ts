import type { NextApiRequest, NextApiResponse } from 'next';

type TokenData = {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd?: string;
  txns: {
    m5: {
      buys: number;
      sells: number;
    };
    h1: {
      buys: number;
      sells: number;
    };
    h6: {
      buys: number;
      sells: number;
    };
    h24: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity: {
    usd?: number;
    base: number;
    quote: number;
  };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
};

type DexScreenerResponse = {
  schemaVersion: string;
  pairs: TokenData[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Fetch trending tokens from DexScreener
    const response = await fetch('https://api.dexscreener.com/latest/dex/pairs?q=solana&limit=20');
    
    if (!response.ok) {
      throw new Error(`DexScreener API responded with status: ${response.status}`);
    }
    
    const data: DexScreenerResponse = await response.json();
    
    // Filter and format the data
    const trendingTokens = data.pairs
      .filter(pair => pair.chainId === 'solana' || pair.chainId === 'base')
      .map(pair => ({
        name: pair.baseToken.name,
        symbol: pair.baseToken.symbol,
        chain: pair.chainId,
        price: parseFloat(pair.priceUsd || pair.priceNative),
        priceChange24h: pair.priceChange.h24,
        volume24h: pair.volume.h24,
        liquidity: pair.liquidity.usd || 0,
        url: pair.url,
        buys24h: pair.txns.h24.buys,
        sells24h: pair.txns.h24.sells,
        buySellRatio: pair.txns.h24.buys / (pair.txns.h24.sells || 1),
        createdAt: pair.pairCreatedAt ? new Date(pair.pairCreatedAt).toISOString() : null,
      }))
      .sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 10); // Top 10 by volume
    
    // Cache for 2 minutes
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=240');
    res.status(200).json({
      success: true,
      data: trendingTokens,
      timestamp: new Date().toISOString(),
      source: 'DexScreener API'
    });
    
  } catch (error) {
    console.error('Error fetching DexScreener data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending tokens',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}