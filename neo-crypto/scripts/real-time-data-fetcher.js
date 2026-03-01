#!/usr/bin/env node

/**
 * Real-Time Data Fetcher for iseeiape Website
 * Fetches live market data from multiple APIs and updates enhanced-live-data.json
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// Configuration
const CONFIG = {
  updateInterval: 300000, // 5 minutes
  dataFile: path.join(__dirname, '../data/enhanced-live-data.json'),
  backupDir: path.join(__dirname, '../data/backups'),
  
  // API endpoints (free tiers)
  apis: {
    dexscreener: {
      baseUrl: 'https://api.dexscreener.com/latest/dex',
      endpoints: {
        search: '/search',
        tokens: '/tokens'
      }
    },
    birdeye: {
      baseUrl: 'https://public-api.birdeye.so/public',
      endpoints: {
        price: '/price',
        token_info: '/token_info'
      },
      // Note: Birdeye requires API key for most endpoints
    },
    coinGecko: {
      baseUrl: 'https://api.coingecko.com/api/v3',
      endpoints: {
        simplePrice: '/simple/price'
      }
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

class RealTimeDataFetcher {
  constructor() {
    this.axios = axios.create({
      timeout: 10000,
      headers: {
        'User-Agent': 'iseeiape-RealTimeFetcher/1.0',
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
      source: 'Real-Time API Fetch'
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
      console.warn('⚠️ Could not backup current data:', error.message);
    }
  }

  async fetchDexScreenerData() {
    try {
      console.log('📡 Fetching DexScreener data...');
      
      // Fetch data for tracked tokens
      const tokenPromises = CONFIG.trackedTokens.map(async (token) => {
        try {
          const url = `${CONFIG.apis.dexscreener.baseUrl}${CONFIG.apis.dexscreener.endpoints.search}?q=${token}`;
          const response = await this.axios.get(url);
          
          if (response.data && response.data.pairs && response.data.pairs.length > 0) {
            const pair = response.data.pairs[0]; // Get first/main pair
            
            return {
              symbol: token,
              price: parseFloat(pair.priceUsd) || 0,
              change24h: parseFloat(pair.priceChange.h24) || 0,
              volume24h: parseFloat(pair.volume.h24) || 0,
              liquidity: parseFloat(pair.liquidity.usd) || 0,
              dex: pair.dexId,
              pairAddress: pair.pairAddress
            };
          }
        } catch (error) {
          console.warn(`⚠️ Error fetching ${token}:`, error.message);
        }
        return null;
      });

      const tokenData = (await Promise.all(tokenPromises)).filter(t => t !== null);
      
      // Calculate total volume
      const totalVolume = tokenData.reduce((sum, token) => sum + token.volume24h, 0);
      
      return {
        tokens: tokenData,
        totalVolume
      };
    } catch (error) {
      console.error('❌ DexScreener fetch error:', error.message);
      return null;
    }
  }

  async fetchCoinGeckoData() {
    try {
      console.log('📡 Fetching CoinGecko data...');
      
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
      
      const response = await this.axios.get(url);
      
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
        
        return { tokens };
      }
    } catch (error) {
      console.error('❌ CoinGecko fetch error:', error.message);
    }
    return null;
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
          value: Math.round(amount * price * 100) / 100
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
          relevantTokens.reduce((max, t) => t.change24h > max.change24h ? t : max).symbol : 'None'
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
      sentiment = 'extremely bullish';
    } else if (totalChange > 2 && positiveRatio > 0.6) {
      sentiment = 'bullish';
    } else if (totalChange < -5 && positiveRatio < 0.3) {
      sentiment = 'extremely bearish';
    } else if (totalChange < -2 && positiveRatio < 0.4) {
      sentiment = 'bearish';
    } else {
      sentiment = 'neutral';
    }
    
    // Calculate support/resistance (simplified)
    const prices = tokens.map(t => t.price).filter(p => p > 0);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    
    return {
      sentiment,
      volatility: parseFloat(volatility.toFixed(2)),
      supportLevel: (avgPrice * 0.95).toFixed(2),
      resistanceLevel: (avgPrice * 1.05).toFixed(2),
      totalVolume: tokens.reduce((sum, t) => sum + t.volume24h, 0)
    };
  }

  async mergeDataSources(dexData, cgData, whaleData) {
    console.log('🔄 Merging data sources...');
    
    // Start with DexScreener data (has volume)
    let tokens = dexData?.tokens || [];
    
    // Enhance with CoinGecko data if available
    if (cgData?.tokens) {
      cgData.tokens.forEach(cgToken => {
        const existingToken = tokens.find(t => t.symbol === cgToken.symbol);
        if (existingToken) {
          // Update price and change if CoinGecko has better data
          if (cgToken.price > 0) {
            existingToken.price = cgToken.price;
            existingToken.change24h = cgToken.change24h;
          }
        } else {
          // Add new token
          tokens.push(cgToken);
        }
      });
    }
    
    // Ensure we have at least some data
    if (tokens.length === 0) {
      console.warn('⚠️ No token data available, using fallback');
      tokens = CONFIG.trackedTokens.map(symbol => ({
        symbol,
        price: symbol === 'SOL' ? 145.67 : 
               symbol === 'BONK' ? 0.00025 :
               symbol === 'JUP' ? 1.45 :
               symbol === 'RAY' ? 2.34 :
               symbol === 'PYTH' ? 0.85 : 1.00,
        change24h: Math.random() * 20 - 5,
        volume24h: Math.random() * 100000000,
        source: 'fallback'
      }));
    }
    
    // Calculate narratives
    const narratives = this.calculateNarrativeScores(tokens);
    
    // Calculate market data
    const market = this.calculateMarketSentiment(tokens, narratives);
    
    // Use whale data or simulate
    const whales = whaleData || await this.fetchWhaleActivity();
    
    return {
      tokens,
      narratives,
      whales,
      market,
      timestamp: new Date().toISOString(),
      source: 'Real-Time Multi-API Fetch'
    };
  }

  async fetchAllData() {
    console.log('🚀 Starting real-time data fetch...');
    console.log('='.repeat(50));
    
    // Fetch from multiple sources in parallel
    const [dexData, cgData, whaleData] = await Promise.all([
      this.fetchDexScreenerData(),
      this.fetchCoinGeckoData(),
      this.fetchWhaleActivity()
    ]);
    
    // Merge and process data
    this.marketData = await this.mergeDataSources(dexData, cgData, whaleData);
    
    console.log('\n✅ Data fetch completed!');
    console.log(`📊 Tokens: ${this.marketData.tokens.length}`);
    console.log(`🧠 Narratives: ${this.marketData.narratives.length}`);
    console.log(`🐋 Whale wallets: ${this.marketData.whales.wallets}`);
    console.log(`📈 Market sentiment: ${this.marketData.market.sentiment}`);
    
    return this.marketData;
  }

  async saveData() {
    try {
      console.log('\n💾 Saving data to file...');
      
      // Create backup first
      await this.backupCurrentData();
      
      // Save new data
      const dataToSave = {
        ...this.marketData,
        _metadata: {
          generatedAt: new Date().toISOString(),
          dataSources: ['DexScreener', 'CoinGecko', 'Simulated Whale Data'],
          version: '2.0'
        }
      };
      
      await fs.writeFile(
        CONFIG.dataFile,
        JSON.stringify(dataToSave, null, 2)
      );
      
      console.log(`✅ Data saved to: ${CONFIG.dataFile}`);
      console.log(`📅 Last updated: ${new Date().toLocaleString()}`);
      
      return true;
    } catch (error) {
      console.error('❌ Error saving data:', error);
      return false;
    }
  }

  async runOnce() {
    try {
      await this.ensureBackupDir();
      await this.fetchAllData();
      await this.saveData();
      
      // Print summary
      console.log('\n' + '='.repeat(50));
      console.log('📋 DATA SUMMARY:');
      console.log('='.repeat(50));
      
      console.log('\n📈 TOP TOKERS:');
      this.marketData.tokens
        .sort((a, b) => b.change24h - a.change24h)
        .slice(0, 5)
        .forEach((token, i) => {
          console.log(`${i + 1}. $${token.symbol}: ${token.change24h > 0 ? '+' : ''}${token.change24h.toFixed(2)}% ($${token.price.toFixed(token.price < 0.01 ? 6 : 2)})`);
        });
      
      console.log('\n🧠 TOP NARRATIVES:');
      this.marketData.narratives.slice(0, 3).forEach((narrative, i) => {
        console.log(`${i + 1}. ${narrative.name}: ${narrative.score}/100 (${narrative.tokenCount} tokens)`);
      });
      
      console.log('\n🐋 RECENT WHALE ACTIVITY:');
      this.marketData.whales.recentActivity.slice(0, 2).forEach((activity, i) => {
        console.log(`${i + 1}. ${activity.wallet} ${activity.action} ${activity.amount} $${activity.token} ($${activity.value})`);
      });
      
      console.log('\n' + '='.repeat(50));
      console.log('✅ Real-time data fetch completed successfully!');
      
    } catch (error) {
      console.error('❌ Error in runOnce:', error);
      throw error;
    }
  }

  async runContinuous() {
    console.log('🔄 Starting continuous data updates...');
    console.log(`⏰ Update interval: ${CONFIG.updateInterval / 1000} seconds`);
    
    while (true) {
      try {
        await this.runOnce();
        console.log(`\n⏳ Next update in ${CONFIG.updateInterval / 1000} seconds...\n`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.updateInterval));
      } catch (error) {
        console.error('❌ Error in continuous run:', error);
        console.log('🔄 Retrying in 30 seconds...');
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }
  }
}

// Run if called directly
if (require.main === module) {
  const fetcher = new RealTimeDataFetcher();
  
  const args = process.argv.slice(2);
  const mode = args[0] || 'once';
  
  if (mode === 'continuous') {
    fetcher.runContinuous().catch(console.error);
  } else {
    fetcher.runOnce().catch(console.error);
  }
}

module.exports = RealTimeDataFetcher;