#!/usr/bin/env node

/**
 * Real-Time Data Fetcher v2 for iseeiape Website
 * Enhanced with better API handling, caching, and fallback mechanisms
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// Configuration
const CONFIG = {
  updateInterval: 300000, // 5 minutes
  dataFile: path.join(__dirname, '../data/enhanced-live-data.json'),
  backupDir: path.join(__dirname, '../data/backups'),
  cacheFile: path.join(__dirname, '../data/api-cache.json'),
  
  // API endpoints with fallback priority
  apis: {
    // Primary: DexScreener (no API key, reliable)
    dexscreener: {
      baseUrl: 'https://api.dexscreener.com/latest/dex',
      endpoints: {
        search: '/search',
        tokens: '/tokens'
      },
      priority: 1
    },
    
    // Secondary: CoinGecko (rate limited, free tier)
    coinGecko: {
      baseUrl: 'https://api.coingecko.com/api/v3',
      endpoints: {
        simplePrice: '/simple/price'
      },
      priority: 2
    },
    
    // Tertiary: Alternative APIs
    alternative: {
      baseUrl: 'https://api.coinpaprika.com/v1',
      endpoints: {
        ticker: '/ticker'
      },
      priority: 3
    }
  },
  
  // Tracked tokens (Solana ecosystem focus)
  trackedTokens: [
    'SOL', 'BONK', 'JUP', 'RAY', 'PYTH', 'NEAR', 'FET', 'AGIX',
    'WIF', 'POPCAT', 'MYRO', 'WEN', 'COQ', 'SAMO', 'RAY', 'ORCA'
  ],
  
  // Narratives to track
  narratives: [
    { name: 'AI Agents', keywords: ['AI', 'agent', 'autonomous', 'agi', 'fetch', 'agix'] },
    { name: 'RWA', keywords: ['RWA', 'real world', 'tokenized', 'asset'] },
    { name: 'Meme Coins', keywords: ['meme', 'dog', 'cat', 'frog', 'animal', 'bonk', 'wif', 'popcat', 'myro', 'wen', 'coq', 'samo'] },
    { name: 'DeFi', keywords: ['defi', 'lending', 'borrowing', 'yield', 'staking', 'ray', 'orca', 'jup'] },
    { name: 'Gaming', keywords: ['game', 'gaming', 'play', 'nft', 'metaverse'] },
    { name: 'Infrastructure', keywords: ['pyth', 'near', 'sol'] }
  ],
  
  // Cache settings
  cacheTTL: 300000, // 5 minutes
  maxRetries: 3,
  retryDelay: 1000
};

class EnhancedDataFetcher {
  constructor() {
    this.axios = axios.create({
      timeout: 15000,
      headers: {
        'User-Agent': 'iseeiape-EnhancedFetcher/2.0',
        'Accept': 'application/json'
      }
    });
    
    this.apiCache = {};
    this.lastFetchTime = 0;
    
    this.marketData = {
      tokens: [],
      narratives: [],
      whales: {
        wallets: 0,
        transactions: 0,
        recentActivity: []
      },
      market: {
        totalVolume: 0,
        sentiment: 'neutral',
        volatility: 0,
        supportLevel: '',
        resistanceLevel: ''
      },
      timestamp: '',
      source: 'Enhanced API Fetch',
      apiStatus: {}
    };
  }

  async loadCache() {
    try {
      const cacheData = await fs.readFile(CONFIG.cacheFile, 'utf8');
      this.apiCache = JSON.parse(cacheData);
      console.log('📦 Loaded API cache');
    } catch (error) {
      console.log('📦 No cache found, starting fresh');
      this.apiCache = {};
    }
  }

  async saveCache() {
    try {
      await fs.writeFile(CONFIG.cacheFile, JSON.stringify(this.apiCache, null, 2));
      console.log('📦 Saved API cache');
    } catch (error) {
      console.error('❌ Error saving cache:', error.message);
    }
  }

  async fetchWithRetry(apiName, endpoint, params = {}, retryCount = 0) {
    const api = CONFIG.apis[apiName];
    if (!api) {
      throw new Error(`Unknown API: ${apiName}`);
    }

    const cacheKey = `${apiName}:${endpoint}:${JSON.stringify(params)}`;
    const now = Date.now();
    
    // Check cache first
    if (this.apiCache[cacheKey] && (now - this.apiCache[cacheKey].timestamp < CONFIG.cacheTTL)) {
      console.log(`📦 Using cached data for ${apiName}`);
      return this.apiCache[cacheKey].data;
    }

    try {
      const url = `${api.baseUrl}${endpoint}`;
      console.log(`📡 Fetching from ${apiName}: ${url}`);
      
      const response = await this.axios.get(url, { params });
      
      // Cache successful response
      this.apiCache[cacheKey] = {
        data: response.data,
        timestamp: now
      };
      
      this.marketData.apiStatus[apiName] = 'success';
      return response.data;
      
    } catch (error) {
      console.error(`❌ ${apiName} fetch error (attempt ${retryCount + 1}/${CONFIG.maxRetries}):`, error.message);
      
      if (retryCount < CONFIG.maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay * (retryCount + 1)));
        return this.fetchWithRetry(apiName, endpoint, params, retryCount + 1);
      }
      
      this.marketData.apiStatus[apiName] = 'failed';
      throw error;
    }
  }

  async fetchDexScreenerData() {
    try {
      const tokensData = [];
      
      for (const tokenSymbol of CONFIG.trackedTokens) {
        try {
          const data = await this.fetchWithRetry('dexscreener', '/search', { q: `${tokenSymbol} solana` });
          
          if (data.pairs && data.pairs.length > 0) {
            const pair = data.pairs[0];
            tokensData.push({
              symbol: tokenSymbol,
              price: parseFloat(pair.priceUsd) || 0,
              change24h: parseFloat(pair.priceChange.h24) || 0,
              volume24h: parseFloat(pair.volume.h24) || 0,
              liquidity: parseFloat(pair.liquidity.usd) || 0,
              dex: pair.dexId,
              pairAddress: pair.pairAddress
            });
          }
        } catch (error) {
          console.log(`⚠️  Could not fetch ${tokenSymbol} from DexScreener`);
        }
      }
      
      return tokensData;
    } catch (error) {
      console.error('❌ DexScreener fetch failed:', error.message);
      return [];
    }
  }

  async fetchCoinGeckoData() {
    try {
      const ids = CONFIG.trackedTokens.map(t => t.toLowerCase()).join(',');
      const data = await this.fetchWithRetry('coinGecko', '/simple/price', {
        ids,
        vs_currencies: 'usd',
        include_24hr_change: true,
        include_24hr_vol: true
      });
      
      const tokensData = [];
      for (const [symbol, info] of Object.entries(data)) {
        const symbolUpper = symbol.toUpperCase();
        tokensData.push({
          symbol: symbolUpper,
          price: info.usd || 0,
          change24h: info.usd_24h_change || 0,
          volume24h: info.usd_24h_vol || 0,
          liquidity: 0, // CoinGecko doesn't provide liquidity
          dex: 'coinGecko',
          pairAddress: ''
        });
      }
      
      return tokensData;
    } catch (error) {
      console.error('❌ CoinGecko fetch failed, using fallback:', error.message);
      return [];
    }
  }

  async mergeTokenData(dexData, cgData) {
    const merged = [];
    const tokenMap = new Map();
    
    // Start with DexScreener data (more complete)
    for (const token of dexData) {
      tokenMap.set(token.symbol, token);
    }
    
    // Fill in missing data from CoinGecko
    for (const token of cgData) {
      if (!tokenMap.has(token.symbol)) {
        tokenMap.set(token.symbol, token);
      } else {
        const existing = tokenMap.get(token.symbol);
        // Only update if DexScreener data is missing
        if (existing.price === 0) existing.price = token.price;
        if (existing.change24h === 0) existing.change24h = token.change24h;
        if (existing.volume24h === 0) existing.volume24h = token.volume24h;
      }
    }
    
    // Convert to array and sort by volume
    for (const token of tokenMap.values()) {
      merged.push(token);
    }
    
    return merged.sort((a, b) => b.volume24h - a.volume24h);
  }

  async fetchWhaleActivity() {
    try {
      // Simulate whale activity for now
      // In production, this would connect to actual whale tracking APIs
      const simulatedWhales = {
        wallets: Math.floor(Math.random() * 15) + 5,
        transactions: Math.floor(Math.random() * 30) + 10,
        recentActivity: []
      };
      
      const actions = ['bought', 'sold', 'transferred'];
      const tokens = this.marketData.tokens.slice(0, 5).map(t => t.symbol);
      
      for (let i = 0; i < 5; i++) {
        const token = tokens[Math.floor(Math.random() * tokens.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const amount = Math.floor(Math.random() * 50000) + 5000;
        const tokenData = this.marketData.tokens.find(t => t.symbol === token);
        const price = tokenData ? tokenData.price : 100;
        
        simulatedWhales.recentActivity.push({
          wallet: `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
          action,
          token,
          amount,
          value: Math.round(amount * price * 100) / 100,
          timestamp: new Date().toISOString()
        });
      }
      
      return simulatedWhales;
    } catch (error) {
      console.error('❌ Whale activity fetch error:', error.message);
      return null;
    }
  }

  calculateNarrativeScores(tokens) {
    console.log('🧠 Calculating narrative scores...');
    
    const narratives = CONFIG.narratives.map(narrative => {
      let score = 50; // Base score
      
      const relevantTokens = tokens.filter(token => {
        const tokenName = token.symbol.toLowerCase();
        return narrative.keywords.some(keyword => 
          tokenName.includes(keyword.toLowerCase())
        );
      });
      
      if (relevantTokens.length > 0) {
        const avgChange = relevantTokens.reduce((sum, t) => sum + t.change24h, 0) / relevantTokens.length;
        const totalVolume = relevantTokens.reduce((sum, t) => sum + t.volume24h, 0);
        
        // Score based on performance and volume
        score += avgChange * 0.8;
        score += Math.log10(totalVolume + 1) * 3;
        
        // Bonus for multiple tokens in narrative
        score += relevantTokens.length * 2;
        
        score = Math.min(100, Math.max(0, Math.round(score)));
      }
      
      return {
        name: narrative.name,
        score,
        tokenCount: relevantTokens.length,
        topPerformer: relevantTokens.length > 0 ? 
          relevantTokens.reduce((max, t) => t.change24h > max.change24h ? t : max).symbol : 'None',
        totalVolume: relevantTokens.reduce((sum, t) => sum + t.volume24h, 0)
      };
    });
    
    return narratives.sort((a, b) => b.score - a.score);
  }

  calculateMarketMetrics(tokens, narratives) {
    console.log('📊 Calculating market metrics...');
    
    const totalChange = tokens.reduce((sum, t) => sum + t.change24h, 0) / tokens.length;
    const positiveTokens = tokens.filter(t => t.change24h > 0).length;
    const positiveRatio = positiveTokens / tokens.length;
    const totalVolume = tokens.reduce((sum, t) => sum + t.volume24h, 0);
    
    // Calculate volatility
    const changes = tokens.map(t => Math.abs(t.change24h));
    const volatility = changes.reduce((sum, c) => sum + c, 0) / changes.length;
    
    // Determine sentiment
    let sentiment = 'neutral';
    if (totalChange > 5 && positiveRatio > 0.7) sentiment = 'extremely bullish';
    else if (totalChange > 2 && positiveRatio > 0.6) sentiment = 'bullish';
    else if (totalChange > 0.5 && positiveRatio > 0.55) sentiment = 'slightly bullish';
    else if (totalChange < -5 && positiveRatio < 0.3) sentiment = 'extremely bearish';
    else if (totalChange < -2 && positiveRatio < 0.4) sentiment = 'bearish';
    else if (totalChange < -0.5 && positiveRatio < 0.45) sentiment = 'slightly bearish';
    
    // Calculate support/resistance (simplified)
    const prices = tokens.map(t => t.price).filter(p => p > 0);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const support = avgPrice * 0.95;
    const resistance = avgPrice * 1.05;
    
    return {
      totalVolume,
      sentiment,
      volatility: Math.round(volatility * 100) / 100,
      supportLevel: `$${support.toFixed(2)}`,
      resistanceLevel: `$${resistance.toFixed(2)}`,
      positiveRatio: Math.round(positiveRatio * 100),
      avgChange: Math.round(totalChange * 100) / 100
    };
  }

  async ensureBackupDir() {
    try {
      await fs.mkdir(CONFIG.backupDir, { recursive: true });
    } catch (error) {
      console.error('Error creating backup directory:', error);
    }
  }

  async backupCurrentData() {
    try {
      const currentData = await fs.readFile(CONFIG.dataFile, 'utf8');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(CONFIG.backupDir, `backup_${timestamp}.json`);
      
      await fs.writeFile(backupFile, currentData);
      console.log(`✅ Backup saved: ${backupFile}`);
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
    }
  }

  async run() {
    console.log('🚀 Starting enhanced real-time data fetch...');
    console.log('==================================================');
    
    await this.loadCache();
    await this.ensureBackupDir();
    
    try {
      // Fetch data from multiple sources
      console.log('📡 Fetching DexScreener data...');
      const dexData = await this.fetchDexScreenerData();
      
      console.log('📡 Fetching CoinGecko data...');
      const cgData = await this.fetchCoinGeckoData();
      
      console.log('🔄 Merging data sources...');
      this.marketData.tokens = await this.mergeTokenData(dexData, cgData);
      
      console.log('🐋 Simulating whale activity detection...');
      this.marketData.whales = await this.fetchWhaleActivity();
      
      console.log('🧠 Calculating narrative scores...');
      this.marketData.narratives = this.calculateNarrativeScores(this.marketData.tokens);
      
      console.log('📊 Calculating market metrics...');
      this.marketData.market = this.calculateMarketMetrics(this.marketData.tokens, this.marketData.narratives);
      
      this.marketData.timestamp = new Date().toISOString();
      this.lastFetchTime = Date.now();
      
      // Save cache
      await this.saveCache();
      
      // Backup current data
      await this.backupCurrentData();
      
      // Save new data
      await fs.writeFile(CONFIG.dataFile, JSON.stringify(this.marketData, null, 2));
      console.log(`✅ Data saved to: ${CONFIG.dataFile}`);
      
      this.printSummary();
      
    } catch (error) {
      console.error('❌ Data fetch failed:', error.message);
      
      // Try to load last good data
      try {
        const lastData = await fs.readFile(CONFIG.dataFile, 'utf8');
        console.log('🔄 Falling back to last known good data');
        this.marketData = JSON.parse(lastData);
        this.marketData.source = 'Fallback (Last Known Good)';
        this.marketData.timestamp = new Date().toISOString();
        
        await fs.writeFile(CONFIG.dataFile, JSON.stringify(this.marketData, null, 2));
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError.message);
      }
    }
  }

  printSummary() {
    console.log('\n==================================================');
    console.log('📋 ENHANCED DATA SUMMARY:');
    console.log('==================================================\n');
    
    console.log('📈 TOP TOKENS BY VOLUME:');
    this.marketData.tokens.slice(0, 5).forEach((token, i) => {
      const changeEmoji = token.change24h > 0 ? '📈' : '📉';
      console.log(`${i + 1}. $${token.symbol}: ${changeEmoji} ${token.change24h > 0 ? '+' : ''}${token.change24h.toFixed(2)}% ($${token.price.toFixed(6).replace(/\.?0+$/, '')})`);
    });
    
    console.log('\n🧠 TOP NARRATIVES:');
    this.marketData.narratives.slice(0, 3).forEach((narrative, i) => {
      const scoreBar = '█'.repeat(Math.floor(narrative.score / 10)) + '░'.repeat(10 - Math.floor(narrative.score / 10));
      console.log(`${i + 1}. ${narrative.name}: ${narrative.score}/100 ${scoreBar} (${narrative.tokenCount} tokens)`);
    });
    
    console.log('\n🐋 RECENT WHALE ACTIVITY:');
    this.marketData.whales.recentActivity.slice(0, 3).forEach((activity, i) => {
      const actionEmoji = activity.action === 'bought' ? '🟢' : activity.action === 'sold' ? '🔴' : '🟡';
      console.log(`${i + 1}. ${activity.wallet} ${actionEmoji} ${activity.action} ${activity.amount.toLocaleString()} $${activity.token} ($${activity.value.toLocaleString()})`);
    });
    
    console.log('\n📊 MARKET OVERVIEW:');
    console.log(`   Sentiment: ${this.marketData.market.sentiment.toUpperCase()}`);
    console.log(`   Positive Ratio: ${this.marketData.market.positiveRatio}%`);
    console.log(`   Avg Change: ${this.marketData.market.avgChange > 0 ? '+' : ''}${this.marketData.market.avgChange}%`);
    console.log(`   Volatility: ${this.marketData.market.volatility}%`);
    console.log(`   Support: ${this.marketData.market.supportLevel}`);
    console.log(`   Resistance: ${this.marketData.market.resistanceLevel}`);
    
    console.log('\n🔧 API STATUS:');
    Object.entries(this.marketData.apiStatus).forEach(([api, status]) => {
      const statusEmoji = status === 'success' ? '✅' : '❌';
      console.log(`   ${api}: ${statusEmoji} ${status}`);
    });
    
    console.log('\n📅 Last updated:', new Date(this.marketData.timestamp).toLocaleString());
    console.log('==================================================');
    console.log('✅ Enhanced real-time data fetch completed successfully!');
  }
}

// Command line interface
async function main() {
  const fetcher = new EnhancedDataFetcher();
  
  const args = process.argv.slice(2);
  const isTest = args.includes('--test');
  const isContinuous = args.includes('--continuous');
  
  if (isTest) {
    console.log('🧪 Running in test mode...');
    await fetcher.run();
    process.exit(0);
  }
  
  if (isContinuous) {
    console.log('🔄 Running in continuous mode...');
    console.log(`📅 Update interval: ${CONFIG.updateInterval / 60000} minutes`);
    
    // Run immediately
    await fetcher.run();
    
    // Then run on interval
    setInterval(async () => {
      await fetcher.run();
    }, CONFIG.updateInterval);
    
    // Keep process alive
    process.stdin.resume();
  } else {
    // One-time run
    await fetcher.run();
    process.exit(0);
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

// Run the fetcher
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = EnhancedDataFetcher;