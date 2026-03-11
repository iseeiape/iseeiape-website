#!/usr/bin/env node

/**
 * Enhanced Real-Time Data Fetcher Wrapper
 * 
 * This wrapper provides backward compatibility with the existing cron system
 * while using the enhanced data fetcher with rate limiting and caching.
 * 
 * Usage: Same as the original real-time-data-fetcher-v2.js
 */

const EnhancedRealTimeDataFetcher = require('./real-time-data-fetcher-enhanced.js');

async function main() {
  console.log('🚀 Starting enhanced real-time data fetcher (wrapper)...');
  
  const fetcher = new EnhancedRealTimeDataFetcher();
  
  try {
    const result = await fetcher.runOnce();
    
    // Log success with key metrics
    console.log('\n📊 Enhanced Data Fetch Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Successfully updated market data`);
    console.log(`📈 Tokens processed: ${result.tokens.length}`);
    console.log(`🧠 Narratives calculated: ${result.narratives.length}`);
    console.log(`🐋 Whale wallets detected: ${result.whales.wallets}`);
    console.log(`📊 Market sentiment: ${result.market.sentiment}`);
    console.log(`⏰ Last updated: ${result.timestamp}`);
    console.log(`🔧 API Status: ${JSON.stringify(result.apiStatus)}`);
    console.log('='.repeat(50));
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Enhanced data fetch failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = main;