// API route with DexScreener + Cielo Feed (real-time smart money)
import { NextResponse } from 'next/server';
import { cachedFetch } from '@/lib/cache';

const CIELO_API_KEY = process.env.CIELO_API_KEY || '93771acc-c2fc-455d-b8e7-263ccd61da4a';

interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  ca: string;
  rank?: number;
}

interface FeedItem {
  id: string;
  wallet: string;
  wallet_label?: string;
  tx_type: 'buy' | 'sell' | 'swap';
  token_in_symbol?: string;
  token_out_symbol?: string;
  token_in_address?: string;
  amount_usd: number;
  timestamp: number;
  chain: string;
}

// Fetch trending from DexScreener - using multiple queries for better results
async function fetchDexScreenerTrending(): Promise<Token[]> {
  try {
    // Try multiple search queries to get more Solana tokens
    const queries = ['sol', 'pump', 'ai', 'meme', 'pepe'];
    let allPairs: any[] = [];
    
    for (const query of queries) {
      try {
        // Use cached fetch with 2 minute TTL
        const data = await cachedFetch(
          `https://api.dexscreener.com/latest/dex/search?q=${query}`,
          undefined,
          120000 // 2 minutes
        );
        
        if (data.pairs && Array.isArray(data.pairs)) {
          const solanaPairs = data.pairs.filter((p: any) => p.chainId === 'solana');
          allPairs = [...allPairs, ...solanaPairs];
        }
      } catch (e) {
        console.log(`Query ${query} failed`);
      }
    }
    
    // Remove duplicates by token address (not pair address)
    const seenTokens = new Set();
    const uniquePairs = allPairs.filter((pair) => {
      const tokenAddress = pair.baseToken?.address;
      if (!tokenAddress || seenTokens.has(tokenAddress)) return false;
      seenTokens.add(tokenAddress);
      return true;
    });
    
    // Sort by volume and take top 20
    const sortedPairs = uniquePairs
      .sort((a: any, b: any) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))
      .slice(0, 20);
    
    if (sortedPairs.length === 0) {
      console.log('No pairs from DexScreener, using demo');
      return getDemoTokens();
    }
    
    console.log(`DexScreener: ${sortedPairs.length} unique tokens`);
    
    return sortedPairs.map((pair: any, index: number) => ({
      id: pair.pairAddress || `token-${index}`,
      name: pair.baseToken?.name || 'Unknown',
      symbol: pair.baseToken?.symbol || '$???',
      price: parseFloat(pair.priceUsd) || 0,
      change24h: pair.priceChange?.h24 || 0,
      volume24h: pair.volume?.h24 || 0,
      marketCap: pair.marketCap || pair.fdv || 0,
      ca: pair.baseToken?.address || '',
      rank: index + 1
    })).filter((t: Token) => t.ca && t.ca.length > 20);
  } catch (error) {
    console.error('DexScreener error:', error);
    return getDemoTokens();
  }
}

// Fetch REAL smart money feed from Cielo
// Pass list_id to get feed from a specific curated list
async function fetchCieloFeed(listId?: number): Promise<FeedItem[]> {
  try {
    const url = listId 
      ? `https://feed-api.cielo.finance/api/v1/feed?list_id=${listId}&limit=50`
      : `https://feed-api.cielo.finance/api/v1/feed?chains=solana&limit=50`;
    
    const options = {
      headers: {
        'X-API-KEY': CIELO_API_KEY,
        'Accept': 'application/json'
      }
    };
    
    // Use cached fetch with 1 minute TTL for live data
    const data = await cachedFetch(url, options, 60000);
    
    if (!data || data.error) {
      console.error('Cielo feed error:', data?.error);
      return getDemoFeed();
    }
    
    // Extract transactions from feed
    // Cielo API returns { status: 'ok', data: { items: [...] } }
    const transactions = data.data?.items || data.data?.transactions || data.transactions || data.items || [];
    
    if (!Array.isArray(transactions) || transactions.length === 0) {
      console.log('No transactions in Cielo feed');
      return getDemoFeed();
    }
    
    console.log(`Cielo feed: ${transactions.length} transactions`);
    
    return transactions.map((tx: any, index: number) => ({
      id: tx.id || tx.tx_hash || `tx-${index}`,
      wallet: tx.wallet || tx.wallet_address || '',
      wallet_label: tx.wallet_label || tx.wallet_alias || 'Unknown',
      tx_type: tx.tx_type || 'swap',
      token_in_symbol: tx.token_in_symbol || tx.tokenInSymbol || tx.token0_symbol || 'TOKEN',
      token_out_symbol: tx.token_out_symbol || tx.tokenOutSymbol || tx.token1_symbol || 'SOL',
      token_in_address: tx.token_in_address || tx.tokenInAddress,
      amount_usd: tx.amount_usd || tx.amountUsd || tx.volume_usd || 0,
      timestamp: tx.timestamp || Math.floor(Date.now() / 1000) - index * 60,
      chain: tx.chain || 'solana'
    }));
  } catch (error) {
    console.error('Cielo feed error:', error);
    return getDemoFeed();
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get('tab') || 'dexscreener';
  
  try {
    switch (tab) {
      case 'dexscreener':
        const tokens = await fetchDexScreenerTrending();
        return NextResponse.json({
          success: true,
          type: 'tokens',
          data: tokens,
          source: 'dexscreener',
          lastUpdated: new Date().toISOString()
        });
        
      case 'smart-feed':
        const feed = await fetchCieloFeed();
        return NextResponse.json({
          success: true,
          type: 'feed',
          data: feed,
          source: 'cielo-feed',
          lastUpdated: new Date().toISOString()
        });
        
      // Curated lists from Cielo
      case 'soylana-traders':
        const soylanaFeed = await fetchCieloFeed(8137);
        return NextResponse.json({
          success: true,
          type: 'feed',
          data: soylanaFeed,
          source: 'cielo-list',
          list: 'SOYLANA Traders',
          lastUpdated: new Date().toISOString()
        });
        
      case 'dev-do-something':
        const devFeed = await fetchCieloFeed(105022);
        return NextResponse.json({
          success: true,
          type: 'feed',
          data: devFeed,
          source: 'cielo-list',
          list: 'Dev Do Something',
          lastUpdated: new Date().toISOString()
        });
        
      case 'insidoors':
        const insidersFeed = await fetchCieloFeed(48945);
        return NextResponse.json({
          success: true,
          type: 'feed',
          data: insidersFeed,
          source: 'cielo-list',
          list: 'Insidoors',
          lastUpdated: new Date().toISOString()
        });
        
      case 'fomo-traders':
        const fomoFeed = await fetchCieloFeed(105204);
        return NextResponse.json({
          success: true,
          type: 'feed',
          data: fomoFeed,
          source: 'cielo-list',
          list: 'FOMO Traders',
          lastUpdated: new Date().toISOString()
        });
        
      default:
        return NextResponse.json({ success: false, error: 'Unknown tab' }, { status: 400 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      success: true,
      type: 'tokens',
      data: getDemoTokens(),
      source: 'error-fallback',
      lastUpdated: new Date().toISOString()
    });
  }
}

function getDemoTokens(): Token[] {
  return [
    { id: '1', name: 'MOLT', symbol: '$MOLT', price: 0.001247, change24h: 456.32, volume24h: 2850000, marketCap: 98500000, ca: 'D83magNboiLuDafj9X8mrHe6eCpDJACuXBRYVuMypump', rank: 1 },
    { id: '2', name: 'OnlyClaws', symbol: '$OnlyClaws', price: 0.000823, change24h: 127.45, volume24h: 945000, marketCap: 16200000, ca: 'BX2KjYBUXn12ihAEczYnsNprq6ekxwuZpZvf1Gy5pump', rank: 2 },
    { id: '3', name: 'Clawd', symbol: '$CLAWD', price: 0.002541, change24h: 89.23, volume24h: 1350000, marketCap: 48200000, ca: '8JxBAAHj86wbQgUTjGuj6GTTL5Ps3cqxKRTvpaJApump', rank: 3 },
    { id: '4', name: 'AI16Z', symbol: '$AI16Z', price: 0.1852, change24h: 34.56, volume24h: 5200000, marketCap: 185200000, ca: 'HeLp6NuQkmYB4ZNQD22TTK9stPdjfs4Qs4iFzjbApump', rank: 4 },
    { id: '5', name: 'Zerebro', symbol: '$ZEREBRO', price: 0.0456, change24h: 28.91, volume24h: 2800000, marketCap: 45600000, ca: '8ZerebroPj2QnM3e4r5t6y7u8i9o0p1a2s3d4f5g6h7', rank: 5 },
  ];
}

function getDemoFeed(): FeedItem[] {
  return [
    { id: '1', wallet: '7xKX...gAsU', wallet_label: '🐋 Whale #1', tx_type: 'buy', token_in_symbol: '$MOLT', token_out_symbol: 'SOL', amount_usd: 25000, timestamp: Math.floor(Date.now() / 1000) - 120, chain: 'solana' },
    { id: '2', wallet: 'C6y7...kqBB', wallet_label: '🦈 Smart Money', tx_type: 'buy', token_in_symbol: '$AI16Z', token_out_symbol: 'SOL', amount_usd: 15000, timestamp: Math.floor(Date.now() / 1000) - 300, chain: 'solana' },
    { id: '3', wallet: '8JxB...pump', wallet_label: '🦞 Early Bird', tx_type: 'sell', token_in_symbol: 'SOL', token_out_symbol: '$GOAT', amount_usd: 12000, timestamp: Math.floor(Date.now() / 1000) - 600, chain: 'solana' },
  ];
}
