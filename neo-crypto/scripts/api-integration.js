#!/usr/bin/env node

/**
 * 🦎 NEO CRYPTO API INTEGRATION
 * 
 * Integrates with real crypto APIs to fetch live data
 * and replace sample data with real on-chain information.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const CONFIG_PATH = path.join(__dirname, '../config/neo-config.json');
const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load configuration
let config = {};
if (fs.existsSync(CONFIG_PATH)) {
  config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
} else {
  console.warn('⚠️  No config file found. Using environment variables.');
}

// API Configuration
const API_CONFIG = {
  // Cielo API (wallet tracking)
  cielo: {
    baseUrl: config.apis?.cielo?.base_url || 'https://feed-api.cielo.finance/api/v1',
    apiKey: process.env.CIELO_API_KEY || config.apis?.cielo?.api_key,
    endpoints: {
      wallet: '/wallet',
      transactions: '/transactions',
      alerts: '/alerts'
    }
  },
  
  // Birdeye API (token analytics)
  birdeye: {
    baseUrl: config.apis?.birdeye?.base_url || 'https://public-api.birdeye.so/public',
    apiKey: process.env.BIRDEYE_API_KEY || config.apis?.birdeye?.api_key,
    endpoints: {
      token: '/token',
      price: '/price',
      holders: '/holders'
    }
  },
  
  // DexScreener API (price charts)
  dexscreener: {
    baseUrl: 'https://api.dexscreener.com/latest/dex',
    endpoints: {
      search: '/search',
      pairs: '/pairs'
    }
  }
};

// Helper functions
async function makeApiRequest(service, endpoint, params = {}) {
  const apiConfig = API_CONFIG[service];
  if (!apiConfig) {
    throw new Error(`Unknown API service: ${service}`);
  }
  
  const url = `${apiConfig.baseUrl}${endpoint}`;
  const headers = {
    'User-Agent': 'NeoCrypto/1.0'
  };
  
  // Add API key if available
  if (apiConfig.apiKey) {
    headers['X-API-Key'] = apiConfig.apiKey;
  }
  
  try {
    const response = await axios.get(url, {
      headers,
      params,
      timeout: 10000 // 10 second timeout
    });
    
    return response.data;
  } catch (error) {
    console.error(`❌ API Error (${service}):`, error.message);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, error.response.data);
    }
    return null;
  }
}

// Data fetching functions
async function fetchTopSolanaTokens(limit = 10) {
  console.log('📊 Fetching top Solana tokens...');
  
  // Use DexScreener to get trending Solana tokens
  const data = await makeApiRequest('dexscreener', '/search', {
    q: 'solana',
    limit
  });
  
  if (!data || !data.pairs) {
    console.warn('⚠️  Using fallback token data');
    return getFallbackTokens();
  }
  
  const tokens = data.pairs
    .filter(pair => pair.chainId === 'solana')
    .slice(0, limit)
    .map(pair => ({
      symbol: pair.baseToken?.symbol || 'UNKNOWN',
      name: pair.baseToken?.name || 'Unknown Token',
      price: parseFloat(pair.priceUsd) || 0,
      volume24h: pair.volume?.h24 || 0,
      liquidity: pair.liquidity?.usd || 0,
      pairAddress: pair.pairAddress
    }));
  
  console.log(`✅ Fetched ${tokens.length} tokens`);
  return tokens;
}

async function fetchWhaleTransactions(walletAddress, limit = 5) {
  console.log(`🦈 Fetching transactions for wallet: ${walletAddress.slice(0, 8)}...`);
  
  if (!API_CONFIG.cielo.apiKey) {
    console.warn('⚠️  Cielo API key not configured. Using sample data.');
    return getSampleWhaleTransactions();
  }
  
  // Note: This is a placeholder - actual Cielo API endpoint may differ
  const data = await makeApiRequest('cielo', API_CONFIG.cielo.endpoints.transactions, {
    wallet: walletAddress,
    limit,
    min_value: 10000 // $10k minimum
  });
  
  if (!data) {
    return getSampleWhaleTransactions();
  }
  
  return data.transactions || [];
}

async function fetchTrendingNarratives() {
  console.log('🌊 Fetching trending narratives...');
  
  // This would typically come from social sentiment analysis
  // For now, we'll use a combination of DexScreener and manual trends
  
  const narratives = [
    { name: "AI Agents", score: 85, volumeChange: 320 },
    { name: "Real World Assets (RWA)", score: 78, volumeChange: 240 },
    { name: "DePIN", score: 72, volumeChange: 180 },
    { name: "Gaming", score: 65, volumeChange: 150 },
    { name: "Meme Coins", score: 60, volumeChange: 420 },
    { name: "DeFi 2.0", score: 55, volumeChange: 120 },
    { name: "Layer 2 Solutions", score: 50, volumeChange: 90 },
    { name: "Privacy", score: 45, volumeChange: 80 }
  ];
  
  // Sort by score (descending)
  return narratives.sort((a, b) => b.score - a.score);
}

// Fallback data functions
function getFallbackTokens() {
  return [
    { symbol: "SOL", name: "Solana", price: 112.45, volume24h: 2500000000, liquidity: 1500000000 },
    { symbol: "BONK", name: "Bonk", price: 0.000023, volume24h: 120000000, liquidity: 45000000 },
    { symbol: "JUP", name: "Jupiter", price: 0.85, volume24h: 85000000, liquidity: 32000000 },
    { symbol: "RAY", name: "Raydium", price: 1.45, volume24h: 42000000, liquidity: 28000000 },
    { symbol: "PYTH", name: "Pyth Network", price: 0.62, volume24h: 38000000, liquidity: 22000000 },
    { symbol: "JTO", name: "Jito", price: 3.21, volume24h: 32000000, liquidity: 18000000 }
  ];
}

function getSampleWhaleTransactions() {
  const actions = ['bought', 'sold', 'transferred'];
  const tokens = getFallbackTokens();
  
  return Array.from({ length: 5 }, (_, i) => ({
    id: `tx_${Date.now()}_${i}`,
    wallet: `7uy4...Xz9q`,
    action: actions[i % actions.length],
    token: tokens[i % tokens.length].symbol,
    amount: Math.floor(Math.random() * 2000000) + 50000,
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    successRate: 0.65 + Math.random() * 0.25
  }));
}

// Data caching system
class DataCache {
  constructor(cacheDir = DATA_DIR) {
    this.cacheDir = cacheDir;
    this.cacheFile = path.join(cacheDir, 'api-cache.json');
    this.cache = this.loadCache();
  }
  
  loadCache() {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const data = JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'));
        // Remove expired cache entries (older than 5 minutes)
        const now = Date.now();
        Object.keys(data).forEach(key => {
          if (now - data[key].timestamp > 5 * 60 * 1000) {
            delete data[key];
          }
        });
        return data;
      }
    } catch (error) {
      console.warn('⚠️  Failed to load cache:', error.message);
    }
    return {};
  }
  
  saveCache() {
    try {
      fs.writeFileSync(this.cacheFile, JSON.stringify(this.cache, null, 2));
    } catch (error) {
      console.warn('⚠️  Failed to save cache:', error.message);
    }
  }
  
  get(key) {
    const entry = this.cache[key];
    if (entry && Date.now() - entry.timestamp < 5 * 60 * 1000) {
      return entry.data;
    }
    return null;
  }
  
  set(key, data) {
    this.cache[key] = {
      data,
      timestamp: Date.now()
    };
    this.saveCache();
  }
  
  clear() {
    this.cache = {};
    this.saveCache();
  }
}

// Main integration function
async function updateLiveData() {
  console.log('🦎 NEO CRYPTO API INTEGRATION');
  console.log('='.repeat(50));
  
  const cache = new DataCache();
  const results = {};
  
  try {
    // 1. Fetch top tokens
    const cacheKey = 'top_tokens';
    let tokens = cache.get(cacheKey);
    
    if (!tokens) {
      tokens = await fetchTopSolanaTokens(10);
      cache.set(cacheKey, tokens);
    }
    results.tokens = tokens;
    
    // 2. Fetch trending narratives
    const narrativesKey = 'trending_narratives';
    let narratives = cache.get(narrativesKey);
    
    if (!narratives) {
      narratives = await fetchTrendingNarratives();
      cache.set(narrativesKey, narratives);
    }
    results.narratives = narratives;
    
    // 3. Fetch whale data (if we have wallet addresses)
    const whaleWalletsFile = path.join(DATA_DIR, 'tracked-wallets.json');
    if (fs.existsSync(whaleWalletsFile)) {
      const wallets = JSON.parse(fs.readFileSync(whaleWalletsFile, 'utf8'));
      if (wallets.length > 0) {
        const whaleData = [];
        for (const wallet of wallets.slice(0, 3)) { // Limit to 3 wallets for demo
          const transactions = await fetchWhaleTransactions(wallet.address, 3);
          whaleData.push({
            wallet: wallet,
            transactions: transactions
          });
        }
        results.whaleData = whaleData;
      }
    }
    
    // Save results
    const outputFile = path.join(DATA_DIR, 'live-data.json');
    fs.writeFileSync(outputFile, JSON.stringify({
      updated_at: new Date().toISOString(),
      data: results
    }, null, 2));
    
    console.log('\n✅ LIVE DATA UPDATED');
    console.log('='.repeat(50));
    console.log(`📊 Tokens: ${results.tokens.length}`);
    console.log(`🌊 Narratives: ${results.narratives.length}`);
    console.log(`🦈 Whale data: ${results.whaleData ? results.whaleData.length : 0} wallets`);
    console.log(`💾 Saved to: ${outputFile}`);
    console.log(`💾 Cache: ${Object.keys(cache.cache).length} entries`);
    
    return results;
    
  } catch (error) {
    console.error('❌ Integration failed:', error.message);
    throw error;
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🦎 NEO CRYPTO API INTEGRATION - Usage

Commands:
  update              Fetch and update all live data
  clear-cache         Clear the API cache
  test-apis           Test API connectivity
  --help, -h         Show this help

Environment Variables:
  CIELO_API_KEY      Your Cielo Finance API key
  BIRDEYE_API_KEY    Your Birdeye API key

Examples:
  node api-integration.js update
  node api-integration.js clear-cache
  CIELO_API_KEY=your_key node api-integration.js test-apis
`);
    return;
  }
  
  const command = args[0] || 'update';
  
  switch (command) {
    case 'update':
      await updateLiveData();
      break;
      
    case 'clear-cache':
      const cache = new DataCache();
      cache.clear();
      console.log('✅ Cache cleared');
      break;
      
    case 'test-apis':
      console.log('🧪 Testing API connectivity...');
      
      // Test DexScreener (no API key needed)
      const dexData = await makeApiRequest('dexscreener', '/search', { q: 'solana', limit: 1 });
      console.log(`✓ DexScreener: ${dexData ? 'Connected' : 'Failed'}`);
      
      // Test Cielo (if API key available)
      if (API_CONFIG.cielo.apiKey) {
        console.log('✓ Cielo API: Key configured');
      } else {
        console.log('⚠️  Cielo API: No API key configured');
      }
      
      // Test Birdeye (if API key available)
      if (API_CONFIG.birdeye.apiKey) {
        console.log('✓ Birdeye API: Key configured');
      } else {
        console.log('⚠️  Birdeye API: No API key configured');
      }
      
      break;
      
    default:
      console.error(`❌ Unknown command: ${command}`);
      console.error('   Use --help for usage information');
      process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  updateLiveData,
  DataCache,
  fetchTopSolanaTokens,
  fetchWhaleTransactions,
  fetchTrendingNarratives
};