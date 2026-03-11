#!/usr/bin/env node

/**
 * Enhanced Real-Time Data Fetcher for iseeiape Website
 * Improved version with rate limiting, caching, and better error handling
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// Configuration
const CONFIG = {
  updateInterval: 300000, // 5 minutes
  dataFile: path.join(__dirname, '../data/enhanced-live-data.json'),
  backupDir: path.join(__dirname, '../data/backups'),
  cacheDir: path.join(__dirname, '../data/cache'),
  
  // API Configuration with rate limits
  apis: {
    dexscreener: {
      baseUrl: 'https://api.dexscreener.com/latest/dex',
      endpoints: {
        search: '/search',
        tokens: '/tokens'
      },
      rateLimit: {
        requestsPerMinute: 60,
        retryAttempts: 3,
        retryDelay: 1000 // ms
      }
    },
    coinGecko: {
      baseUrl: 'https://api.coingecko.com/api/v3',
      endpoints: {
        simplePrice: '/simple/price'
      },
      rateLimit: {
        requestsPerMinute: 10, // Free tier limit
        retryAttempts: 2,
        retryDelay: 2000,
        cacheDuration: 3600000 // 1 hour cache
      }
    },
    alternativeApis: {
      coinMarketCap: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      cryptoCompare: 'https://min-api.cryptocompare.com/data/pricemulti'
    }
  },
  
  // Tracked tokens (Solana ecosystem focus)
  trackedTokens: [
    'SOL', 'BONK', 'JUP', 'RAY', 'PYTH', 'NEAR', 'FET', 'AGIX',
    'WIF', 'POPCAT', 'MYRO', 'WEN', 'COQ', 'SAMO'
  ],
  
  // Narratives to track
  narratives: [
    { name: 'AI Agents', keywords: ['AI', 'agent', 'autonomous', 'agi'] },
    { name: 'RWA', keywords: ['RWA', 'real world', 'tokenized', 'asset'] },
    { name: 'Meme Coins', keywords: ['meme', 'dog', 'cat', 'frog', 'animal'] },
    { name: 'DeFi', keywords: ['defi', 'lending', 'borrowing', 'yield', 'staking'] },
    { name: 'Gaming', keywords: ['game', 'gaming', 'play', 'nft', 'metaverse'] }
  ]
};

class EnhancedRealTimeDataFetcher {
  constructor() {
    this.axios = axios.create({
      timeout: 15000,
      headers: {
        'User-Agent': 'iseeiape-EnhancedFetcher/2.0',
        'Accept': 'application/json'
      }
    });
    
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
      source: 'Enhanced Real-Time API Fetch',
      apiStatus: {}
    };
    
    // Rate limiting state
    this.apiCallTimestamps = {
      coinGecko: [],
      dexscreener: []
    };
    
    // Cache state
    this.cache = {};
  }

  async ensureDirectories() {
    try {
      await fs.mkdir(CONFIG.backupDir, { recursive: true });
      await fs.mkdir(CONFIG.cacheDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directories:', error);
    }
  }

  async backupCurrentData() {
    try {
      const currentData = await fs.readFile(CONFIG.dataFile, 'utf8');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(CONFIG.backupDir, `enhanced-live-data-${timestamp}.json`);
      
      await fs.writeFile(backupFile, currentData);
      console.log(`✅ Data backed up to: ${backupFile}`);
    } catch (error) {
      console.error('❌ Backup error:', error.message);
    }
  }

  async getCachedData(apiName, cacheKey) {
    try {
      const cacheFile = path.join(CONFIG.cacheDir, `${apiName}-${cacheKey}.json`);
      
      if (await this.fileExists(cacheFile)) {
        const stats = await fs.stat(cacheFile);
        const cacheAge = Date.now() - stats.mtimeMs;
        const cacheDuration = CONFIG.apis[apiName]?.rateLimit?.cacheDuration || 300000;
        
        if (cacheAge < cacheDuration) {
          const cachedData = await fs.readFile(cacheFile, 'utf8');
          console.log(`📦 Using cached data for ${apiName} (${Math.round(cacheAge/1000)}s old)`);
          return JSON.parse(cachedData);
        }
      }
    } catch (error) {
      console.error(`Cache read error for ${apiName}:`, error.message);
    }
    return null;
  }

  async setCachedData(apiName, cacheKey, data) {
    try {
      const cacheFile = path.join(CONFIG.cacheDir, `${apiName}-${cacheKey}.json`);
      await fs.writeFile(cacheFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Cache write error for ${apiName}:`, error.message);
    }
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async rateLimitedApiCall(apiName, url, options = {}) {
    const apiConfig = CONFIG.apis[apiName];
    if (!apiConfig || !apiConfig.rateLimit) {
      return this.axios.get(url, options);
    }

    const { requestsPerMinute, retryAttempts, retryDelay } = apiConfig.rateLimit;
    
    // Clean old timestamps (older than 1 minute)
    const oneMinuteAgo = Date.now() - 60000;
    this.apiCallTimestamps[apiName] = this.apiCallTimestamps[apiName]?.filter(
      timestamp => timestamp > oneMinuteAgo
    ) || [];

    // Check if we're rate limited
    if (this.apiCallTimestamps[apiName].length >= requestsPerMinute) {
      const oldestCall = this.apiCallTimestamps[apiName][0];
      const waitTime = 60000 - (Date.now() - oldestCall);
      console.log(`⏳ Rate limited for ${apiName}, waiting ${Math.ceil(waitTime/1000)}s`);
      await new Promise(resolve => setTimeout(resolve, waitTime + 100));
    }

    // Make the API call with retry logic
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        console.log(`📡 ${apiName} API call attempt ${attempt}/${retryAttempts}`);
        
        const response = await this.axios.get(url, {
          ...options,
          timeout: 10000
        });

        // Record successful call timestamp
        this.apiCallTimestamps[apiName].push(Date.now());
        
        return response;
        
      } catch (error) {
        console.error(`❌ ${apiName} API attempt ${attempt} failed:`, error.message);
        
        if (attempt < retryAttempts) {
          // Exponential backoff
          const delay = retryDelay * Math.pow(2, attempt - 1);
          console.log(`⏳ Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
  }

  async fetchCoinGeckoData() {
    try {
      console.log('📡 Fetching CoinGecko data...');
      
      // Check cache first
      const cacheKey = 'prices-' + CONFIG.trackedTokens.join('-');
      const cachedData = await this.getCachedData('coinGecko', cacheKey);
      if (cachedData) {
        return cachedData;
      }
      
      const tokenIds = {
        'SOL': 'solana',
        'BONK': 'bonk',
        'JUP': 'jupiter-exchange-solana',
        'RAY': 'raydium',
        'PYTH': 'pyth-network',
        'NEAR': 'near',
        'FET': 'fetch-ai',
        'AGIX': 'singularitynet'
      };
      
      const ids = Object.values(tokenIds).join(',');
      const url = `${CONFIG.apis.coinGecko.baseUrl}${CONFIG.apis.coinGecko.endpoints.simplePrice}?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
      
      const response = await this.rateLimitedApiCall('coinGecko', url);
      
      if (response.data) {
        const tokens = [];
        Object.entries(tokenIds).forEach(([symbol, id]) => {
          if (response.data[id]) {
            tokens.push({
              symbol,
              price: response.data[id].usd || 0,
              change24h: response.data[id].usd_24h_change || 0,
              volume24h: 0, // CoinGecko free tier doesn't include volume
              source: 'CoinGecko'
            });
          }
        });
        
        const result = { tokens };
        
        // Cache the result
        await this.setCachedData('coinGecko', cacheKey, result);
        
        return result;
      }
    } catch (error) {
      console.error('❌ CoinGecko fetch error:', error.message);
      
      // Try alternative data source
      return await this.fetchAlternativePriceData();
    }
    return null;
  }

  async fetchAlternativePriceData() {
    try {
      console.log('🔄 Trying alternative price data source...');
      
      // Simple fallback: use DexScreener for basic price data
      const tokens = [];
      
      for (const symbol of CONFIG.trackedTokens.slice(0, 5)) { // Limit to 5 tokens
        try {
          const url = `${CONFIG.apis.dexscreener.baseUrl}${CONFIG.apis.dexscreener.endpoints.search}?q=${symbol}`;
          const response = await this.rateLimitedApiCall('dexscreener', url);
          
          if (response.data && response.data.pairs && response.data.pairs.length > 0) {
            const pair = response.data.pairs[0];
            tokens.push({
              symbol,
              price: pair.priceUsd || 0,
              change24h: pair.priceChange?.h24 || 0,
              volume24h: pair.volume?.h24 || 0,
              liquidity: pair.liquidity?.usd || 0,
              source: 'DexScreener (fallback)'
            });
          }
        } catch (error) {
          console.error(`Failed to fetch ${symbol} from DexScreener:`, error.message);
        }
      }
      
      if (tokens.length > 0) {
        return { tokens };
      }
    } catch (error) {
      console.error('Alternative price data fetch failed:', error.message);
    }
    
    return null;
  }

  async fetchDexScreenerData() {
    try {
      console.log('📊 Fetching DexScreener data...');
      
      const allTokens = [];
      
      // Fetch data for tracked tokens
      for (const symbol of CONFIG.trackedTokens) {
        try {
          const url = `${CONFIG.apis.dexscreener.baseUrl}${CONFIG.apis.dexscreener.endpoints.search}?q=${symbol}`;
          const response = await this.rateLimitedApiCall('dexscreener', url);
          
          if (response.data && response.data.pairs && response.data.pairs.length > 0) {
            const pair = response.data.pairs[0];
            
            allTokens.push({
              symbol,
              price: pair.priceUsd || 0,
              change24h: pair.priceChange?.h24 || 0,
              volume24h: pair.volume?.h24 || 0,
              liquidity: pair.liquidity?.usd || 0,
              dex: pair.dexId || 'unknown',
              pairAddress: pair.pairAddress || '',
              source: 'DexScreener'
            });
          }
        } catch (error) {
          console.error(`Failed to fetch ${symbol} from DexScreener:`, error.message);
        }
        
        // Small delay between requests to be polite
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      return { tokens: allTokens };
    } catch (error) {
      console.error('❌ DexScreener fetch error:', error.message);
      return null;
    }
  }

  async fetchWhaleActivity() {
    try {
      console.log('🐋 Simulating whale activity detection...');
      
      // In a real implementation, this would connect to:
      // 1. Whale Alert API
      // 2. Solscan API for large transactions
      // 3. Custom whale tracking database
      
      // For now, simulate based on market conditions
      const simulatedWhales = {
        wallets: Math.floor(Math.random() * 10) + 3,
        transactions: Math.floor(Math.random() * 20) + 5,
        recentActivity: []
      };
      
      // Generate some simulated whale activity
      const actions = ['bought', 'sold', 'transferred'];
      const tokens = ['SOL', 'BONK', 'JUP', 'RAY'];
      
      for (let i = 0; i < 3; i++) {
        const token = tokens[Math.floor(Math.random() * tokens.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const amount = Math.floor(Math.random() * 10000) + 1000;
        const price = token === 'SOL' ? 145 + Math.random() * 10 : 
                     token === 'BONK' ? 0.0002 + Math.random() * 0.0001 :
                     token === 'JUP' ? 1.4 + Math.random() * 0.2 :
                     2.3 + Math.random() * 0.3;
        
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
      
      // Calculate based on token performance
      const relevantTokens = tokens.filter(token => {
        const tokenName = token.symbol.toLowerCase();
        return narrative.keywords.some(keyword => 
          tokenName.includes(keyword.toLowerCase())
        );
      });
      
      if (relevantTokens.length > 0) {
        // Score based on average performance of relevant tokens
        const avgChange = relevantTokens.reduce((sum, t) => sum + t.change24h, 0) / relevantTokens.length;
        const avgVolume = relevantTokens.reduce((sum, t) => sum + t.volume24h, 0) / relevantTokens.length;
        
        // Adjust score based on performance
        score += avgChange * 0.5; // 1% change = +0.5 points
        score += Math.log10(avgVolume) * 2; // Volume impact
        
        // Cap score
        score = Math.min(100, Math.max(0, score));
      }
      
      return {
        name: narrative.name,
        score: Math.round(score),
        tokenCount: relevantTokens.length,
        topPerformer: relevantTokens.length > 0 ? 
          relevantTokens.reduce((max, t) => t.change24h > max.change24h ? t : max).symbol : 'None',
        totalVolume: relevantTokens.reduce((sum, t) => sum + t.volume24h, 0)
      };
    });
    
    // Sort by score descending
    return narratives.sort((a, b) => b.score - a.score);
  }

  calculateMarketSentiment(tokens, narratives) {
    console.log('📊 Calculating market sentiment...');
    
    const totalChange = tokens.reduce((sum, t) => sum + t.change24h, 0) / tokens.length;
    const positiveTokens = tokens.filter(t => t.change24h > 0).length;
    const positiveRatio = positiveTokens / tokens.length;
    
    let sentiment = 'neutral';
    let volatility = 0;
    
    // Calculate volatility (simplified)
    const changes = tokens.map(t => Math.abs(t.change24h));
    volatility = changes.reduce((sum, c) => sum + c, 0) / changes.length;
    
    // Determine sentiment
    if (totalChange > 5 && positiveRatio > 0.7) {
      sentiment = 'bullish';
    } else if (totalChange < -5 && positiveRatio < 0.3) {
      sentiment = 'bearish';
    } else {
      sentiment = 'neutral';
    }
    
    // Calculate support/resistance levels (simplified)
    const prices = tokens.map(t => t.price).filter(p => p > 0);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    
    const supportLevel = avgPrice * 0.95;
    const resistanceLevel = avgPrice * 1.05;
    
    return {
      sentiment,
      volatility: Math.round(volatility * 100) / 100,
      supportLevel: `$${supportLevel.toFixed(2)}`,
      resistanceLevel: `$${resistanceLevel.toFixed(2)}`,
      totalVolume: tokens.reduce((sum, t) => sum + t.volume24h, 0),
      positiveRatio: Math.round(positiveRatio * 100),
      avgChange: Math.round(totalChange * 100) / 100
    };
  }

  async mergeDataSources(dexData, coinGeckoData, whaleData) {
    console.log('🔄 Merging data sources...');
    
    let mergedTokens = [];
    
    // Start with DexScreener data
    if (dexData && dexData.tokens) {
      mergedTokens = dexData.tokens;
    }
    
    // Enhance with CoinGecko data if available
    if (coinGeckoData && coinGeckoData.tokens) {
      coinGeckoData.tokens.forEach(cgToken => {
        const existingToken = mergedTokens.find(t => t.symbol === cgToken.symbol);
        if (existingToken) {
          // Update price and change if CoinGecko has better data
          if (cgToken.price > 0) {
            existingToken.price = cgToken.price;
            existingToken.change24h = cgToken.change24h;
            existingToken.source = `${existingToken.source} + CoinGecko`;
          }
        } else {
          // Add new token from CoinGecko
          mergedTokens.push({
            ...cgToken,
            volume24h: 0,
            liquidity: 0,
            dex: 'unknown',
            pairAddress: ''
          });
        }
      });
    }
    
    return {
      tokens: mergedTokens,
      whales: whaleData || { wallets: 0, transactions: 0, recentActivity: [] }
    };
  }

  async updateMarketData() {
    console.log('\n🔄 Starting enhanced market data update...');
    console.log('='.repeat(50));
    
    try {
      await this.ensureDirectories();
      
      // Backup current data
      if (await this.fileExists(CONFIG.dataFile)) {
        await this.backupCurrentData();
      }
      
      // Fetch data from all sources in parallel with error handling
      const [dexData, coinGeckoData, whaleData] = await Promise.allSettled([
        this.fetchDexScreenerData(),
        this.fetchCoinGeckoData(),
        this.fetchWhaleActivity()
      ]);
      
      // Track API status
      this.marketData.apiStatus = {
        dexscreener: dexData.status === 'fulfilled' ? 'success' : 'failed',
        coinGecko: coinGeckoData.status === 'fulfilled' ? 'success' : 'failed',
        whaleData: whaleData.status === 'fulfilled' ? 'success' : 'failed'
      };
      
      console.log('📊 API Status:', this.marketData.apiStatus);
      
      // Merge successful data sources
      const mergedData = await this.mergeDataSources(
        dexData.status === 'fulfilled' ? dexData.value : null,
        coinGeckoData.status === 'fulfilled' ? coinGeckoData.value : null,
        whaleData.status === 'fulfilled' ? whaleData.value : null
      );
      
      // Calculate narratives and market sentiment
      this.marketData.tokens = mergedData.tokens;
      this.marketData.narratives = this.calculateNarrativeScores(mergedData.tokens);
      this.marketData.whales = mergedData.whales;
      this.marketData.market = this.calculateMarketSentiment(mergedData.tokens, this.marketData.narratives);
      
      // Add metadata
      this.marketData.timestamp = new Date().toISOString();
      this.marketData.source = 'Enhanced Real-Time API Fetch v2.0';
      this.marketData.dataSources = [
        dexData.status === 'fulfilled' ? 'DexScreener' : null,
        coinGeckoData.status === 'fulfilled' ? 'CoinGecko' : null,
        'Simulated Whale Data'
      ].filter(Boolean);
      
      // Save to file
      await fs.writeFile(
        CONFIG.dataFile, 
        JSON.stringify(this.marketData, null, 2)
      );
      
      console.log('✅ Enhanced market data updated successfully!');
      console.log(`📈 Tokens: ${this.marketData.tokens.length}`);
      console.log(`🧠 Narratives: ${this.marketData.narratives.length}`);
      console.log(`🐋 Whale wallets: ${this.marketData.whales.wallets}`);
      console.log(`📊 Market sentiment: ${this.marketData.market.sentiment}`);
      console.log(`⏰ Last updated: ${this.marketData.timestamp}`);
      console.log('='.repeat(50));
      
      return this.marketData;
      
    } catch (error) {
      console.error('❌ Critical error updating market data:', error);
      
      // Try to load backup data
      try {
        const backupFiles = await fs.readdir(CONFIG.backupDir);
        if (backupFiles.length > 0) {
          backupFiles.sort().reverse();
          const latestBackup = backupFiles[0];
          const backupPath = path.join(CONFIG.backupDir, latestBackup);
          
          console.log(`🔄 Loading backup data from: ${latestBackup}`);
          const backupData = await fs.readFile(backupPath, 'utf8');
          this.marketData = JSON.parse(backupData);
          this.marketData.source = `${this.marketData.source} (Backup - ${latestBackup})`;
          
          await fs.writeFile(CONFIG.dataFile, JSON.stringify(this.marketData, null, 2));
          console.log('✅ Restored from backup');
        }
      } catch (backupError) {
        console.error('❌ Backup restoration failed:', backupError);
      }
      
      return this.marketData;
    }
  }

  async runContinuous() {
    console.log('🚀 Starting enhanced real-time data fetcher...');
    console.log(`📅 Update interval: ${CONFIG.updateInterval / 1000} seconds`);
    console.log('='.repeat(50));
    
    // Initial update
    await this.updateMarketData();
    
    // Schedule periodic updates
    setInterval(async () => {
      await this.updateMarketData();
    }, CONFIG.updateInterval);
    
    // Keep process alive
    process.on('SIGINT', () => {
      console.log('\n👋 Shutting down enhanced data fetcher...');
      process.exit(0);
    });
  }

  async runOnce() {
    console.log('🚀 Running enhanced real-time data fetcher (single run)...');
    return await this.updateMarketData();
  }
}

// Main execution
if (require.main === module) {
  const fetcher = new EnhancedRealTimeDataFetcher();
  
  const mode = process.argv[2] || 'once';
  
  if (mode === 'continuous') {
    fetcher.runContinuous();
  } else {
    fetcher.runOnce()
      .then(() => {
        console.log('✅ Enhanced data fetch completed successfully');
        process.exit(0);
      })
      .catch(error => {
        console.error('❌ Enhanced data fetch failed:', error);
        process.exit(1);
      });
  }
}

module.exports = EnhancedRealTimeDataFetcher;
