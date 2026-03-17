#!/usr/bin/env node

/**
 * Test script for Enhanced Dashboard API v2
 * 
 * This script tests the new enhanced API endpoint with more tokens,
 * better narratives, and improved whale data.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3000/api/enhanced/data-v2?type=dashboard&timeframe=24h';

async function testEnhancedAPI() {
  console.log('🧪 Testing Enhanced Dashboard API v2...');
  console.log('='.repeat(60));
  
  try {
    console.log('📡 Making API request...');
    const response = await axios.get(API_URL, { timeout: 30000 });
    
    if (response.data.success) {
      const data = response.data.data;
      
      console.log('✅ API Response Successful!');
      console.log('='.repeat(60));
      
      // Display summary
      console.log('📊 DASHBOARD SUMMARY:');
      console.log(`• Tokens Tracked: ${data.summary.totalTokens}`);
      console.log(`• Total 24h Volume: $${(data.summary.totalVolume24h / 1000000).toFixed(2)}M`);
      console.log(`• Total Market Cap: $${(data.summary.totalMarketCap / 1000000).toFixed(2)}M`);
      console.log(`• Top Gainer: $${data.summary.topGainer.symbol} +${data.summary.topGainer.priceChange24h?.toFixed(2) || '0.00'}%`);
      console.log(`• Top Loser: $${data.summary.topLoser.symbol} ${data.summary.topLoser.priceChange24h?.toFixed(2) || '0.00'}%`);
      console.log(`• Whale Count: ${data.summary.whaleCount}`);
      console.log(`• Whale Transactions: ${data.summary.totalWhaleTransactions}`);
      console.log(`• Avg Whale Success: ${Math.round(data.summary.avgWhaleSuccessRate * 100)}%`);
      
      console.log('\n📈 TOP 5 TOKENS BY VOLUME:');
      data.tokens.slice(0, 5).forEach((token, i) => {
        console.log(`  ${i + 1}. $${token.symbol} - $${token.price.toFixed(4)} (${token.priceChange24h >= 0 ? '+' : ''}${token.priceChange24h?.toFixed(2) || '0.00'}%)`);
        console.log(`     Volume: $${(token.volume24h / 1000).toFixed(1)}K • Liquidity: $${(token.liquidity / 1000).toFixed(1)}K`);
      });
      
      console.log('\n🌊 TOP NARRATIVES:');
      data.narratives.slice(0, 3).forEach((narrative, i) => {
        console.log(`  ${i + 1}. ${narrative.name} - Score: ${narrative.score}/100 (${narrative.sentiment})`);
        console.log(`     ${narrative.description}`);
        console.log(`     Top Tokens: ${narrative.topTokens.map(t => `$${t}`).join(', ')}`);
        console.log(`     Volume: $${(narrative.totalVolume / 1000000).toFixed(2)}M • Change: +${narrative.volumeChange}%`);
      });
      
      console.log('\n🐋 WHALE ACTIVITY:');
      data.whales.slice(0, 2).forEach((whale, i) => {
        console.log(`  ${i + 1}. ${whale.wallet.name} (${whale.wallet.chain})`);
        console.log(`     Success Rate: ${Math.round(whale.wallet.success_rate * 100)}% • Volume: $${(whale.wallet.total_volume_usd / 1000000).toFixed(2)}M`);
        console.log(`     Recent Transactions: ${whale.transactions.length}`);
        whale.transactions.forEach((tx, j) => {
          console.log(`       ${tx.action === 'bought' ? '🟢' : '🔴'} ${tx.action} $${tx.token} - $${(tx.amountUSD / 1000).toFixed(1)}K @ $${tx.price.toFixed(4)}`);
        });
      });
      
      console.log('\n📝 DATA QUALITY:');
      console.log(`• Valid Tokens: ${data.tokens.filter(t => t.price > 0).length}/${data.tokens.length}`);
      console.log(`• Data Freshness: ${new Date(data.timestamp).toLocaleTimeString()}`);
      
      // Save sample data for reference
      const sampleData = {
        summary: data.summary,
        topTokens: data.tokens.slice(0, 10).map(t => ({
          symbol: t.symbol,
          price: t.price,
          change: t.priceChange24h,
          volume: t.volume24h
        })),
        topNarratives: data.narratives.slice(0, 3).map(n => ({
          name: n.name,
          score: n.score,
          sentiment: n.sentiment,
          topTokens: n.topTokens
        })),
        whaleActivity: data.whales.slice(0, 2).map(w => ({
          name: w.wallet.name,
          successRate: w.wallet.success_rate,
          recentTransactions: w.transactions.length
        }))
      };
      
      const outputPath = path.join(__dirname, 'neo-crypto', 'outputs', 'enhanced-api-test.json');
      fs.writeFileSync(outputPath, JSON.stringify(sampleData, null, 2));
      console.log(`\n💾 Sample data saved to: ${outputPath}`);
      
      console.log('\n' + '='.repeat(60));
      console.log('🎯 ENHANCED DASHBOARD API V2 TEST COMPLETE');
      console.log('✅ Ready for integration with dashboard-enhanced-v2.tsx');
      
    } else {
      console.error('❌ API returned error:', response.data.error);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 TROUBLESHOOTING:');
      console.log('1. Make sure the Next.js dev server is running:');
      console.log('   npm run dev');
      console.log('2. Check that the API endpoint is accessible:');
      console.log('   curl http://localhost:3000/api/enhanced/data-v2?type=dashboard');
      console.log('3. Verify the API route exists:');
      console.log('   ls pages/api/enhanced/data-v2.ts');
    }
    
    process.exit(1);
  }
}

// Run the test
testEnhancedAPI();