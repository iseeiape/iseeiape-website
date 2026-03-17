import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type EnhancedToken = {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  pairAddress: string;
  dex: string;
  updatedAt: string;
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
};

type WhaleTransaction = {
  id: string;
  wallet: string;
  action: string;
  token: string;
  tokenName: string;
  amountUSD: number;
  amountTokens: number;
  price: number;
  timestamp: string;
  successRate: number;
};

type WhaleData = {
  wallet: {
    address: string;
    name: string;
    chain: string;
    tags: string[];
    success_rate: number;
  };
  transactions: WhaleTransaction[];
};

type EnhancedData = {
  updated_at: string;
  data: {
    tokens: EnhancedToken[];
    narratives: Narrative[];
    whaleData: WhaleData[];
    summary: {
      totalTokens: number;
      totalVolume24h: number;
      topGainer: EnhancedToken;
      topLoser: EnhancedToken;
      whaleCount: number;
      totalWhaleTransactions: number;
    };
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Path to the enhanced data file
    const dataPath = path.join(process.cwd(), 'neo-crypto', 'data', 'enhanced-live-data.json');
    
    // Check if file exists
    if (!fs.existsSync(dataPath)) {
      // If file doesn't exist, run the enhanced API generator
      const { execSync } = require('child_process');
      try {
        console.log('Enhanced data not found, generating...');
        execSync('node neo-crypto/scripts/enhanced-api.js', { 
          cwd: process.cwd(),
          stdio: 'pipe'
        });
      } catch (error) {
        console.error('Failed to generate enhanced data:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to generate enhanced data',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // Read the enhanced data file
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    const enhancedData: EnhancedData = JSON.parse(fileContent);
    
    // Check if data is stale (older than 30 minutes)
    const dataAge = Date.now() - new Date(enhancedData.updated_at).getTime();
    const MAX_AGE = 30 * 60 * 1000; // 30 minutes
    
    if (dataAge > MAX_AGE) {
      console.log('Enhanced data is stale, regenerating...');
      try {
        const { execSync } = require('child_process');
        execSync('node neo-crypto/scripts/enhanced-api.js', { 
          cwd: process.cwd(),
          stdio: 'pipe'
        });
        
        // Re-read the file
        const newContent = fs.readFileSync(dataPath, 'utf8');
        const freshData: EnhancedData = JSON.parse(newContent);
        
        enhancedData.data = freshData.data;
        enhancedData.updated_at = freshData.updated_at;
      } catch (error) {
        console.error('Failed to regenerate data:', error);
        // Continue with stale data rather than failing
      }
    }
    
    // Parse query parameters
    const { 
      type = 'all',
      limit = '10',
      chain = 'solana'
    } = req.query;
    
    let responseData: any = {};
    
    switch (type) {
      case 'tokens':
        responseData = {
          tokens: enhancedData.data.tokens
            .filter(token => token.volume24h > 0) // Only tokens with volume
            .sort((a, b) => b.volume24h - a.volume24h)
            .slice(0, parseInt(limit as string)),
          summary: {
            total: enhancedData.data.tokens.length,
            totalVolume: enhancedData.data.summary.totalVolume24h,
            topGainer: enhancedData.data.summary.topGainer,
            topLoser: enhancedData.data.summary.topLoser
          }
        };
        break;
        
      case 'narratives':
        responseData = {
          narratives: enhancedData.data.narratives
            .sort((a, b) => b.score - a.score)
            .slice(0, parseInt(limit as string)),
          summary: {
            total: enhancedData.data.narratives.length,
            topNarrative: enhancedData.data.narratives[0]
          }
        };
        break;
        
      case 'whales':
        const filteredWhales = enhancedData.data.whaleData
          .filter(whale => whale.wallet.chain === chain)
          .slice(0, parseInt(limit as string));
        
        responseData = {
          whales: filteredWhales,
          summary: {
            total: filteredWhales.length,
            totalTransactions: filteredWhales.reduce((sum, whale) => sum + whale.transactions.length, 0),
            totalVolume: filteredWhales.reduce((sum, whale) => 
              sum + whale.transactions.reduce((txSum, tx) => txSum + tx.amountUSD, 0), 0
            )
          }
        };
        break;
        
      case 'dashboard':
        responseData = {
          tokens: enhancedData.data.tokens
            .filter(token => token.volume24h > 0)
            .sort((a, b) => b.volume24h - a.volume24h)
            .slice(0, 5),
          narratives: enhancedData.data.narratives
            .sort((a, b) => b.score - a.score)
            .slice(0, 3),
          whales: enhancedData.data.whaleData
            .slice(0, 3)
            .map(whale => ({
              ...whale,
              transactions: whale.transactions.slice(0, 2) // Only show 2 most recent transactions
            })),
          summary: enhancedData.data.summary
        };
        break;
        
      default: // 'all'
        responseData = enhancedData.data;
        break;
    }
    
    // Cache headers based on data freshness
    const cacheAge = Math.min(MAX_AGE - dataAge, 5 * 60 * 1000); // Up to 5 minutes
    const cacheSeconds = Math.floor(cacheAge / 1000);
    
    res.setHeader('Cache-Control', `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 2}`);
    res.status(200).json({
      success: true,
      data: responseData,
      metadata: {
        updated_at: enhancedData.updated_at,
        data_age: dataAge,
        cache_seconds: cacheSeconds,
        source: 'enhanced-api.js'
      }
    });
    
  } catch (error) {
    console.error('Error fetching enhanced data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch enhanced data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}