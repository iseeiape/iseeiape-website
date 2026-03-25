// Test script for market-data-v3 API
const http = require('http');

async function testAPI() {
  console.log('🧪 Testing Market Data API v3');
  console.log('='.repeat(50));
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/enhanced/market-data-v3',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`✅ API Response Status: ${res.statusCode}`);
          console.log(`📊 Response time: ${result.stats?.processingTime || 'N/A'}ms`);
          console.log(`📈 Total tokens: ${result.stats?.totalTokens || 0}`);
          console.log(`🔄 Cache hit: ${result.cacheHit ? '✅ Yes' : '❌ No'}`);
          console.log(`📦 Cached: ${result.cached ? '✅ Yes' : '❌ No'}`);
          console.log(`🎯 Data source: ${result.stats?.dataSource || 'unknown'}`);
          
          if (result.cache) {
            console.log('\n📊 Cache Statistics:');
            console.log(`  Hits: ${result.cache.hits}`);
            console.log(`  Misses: ${result.cache.misses}`);
            console.log(`  Hit rate: ${result.cache.hitRate}`);
            console.log(`  Total keys: ${result.cache.totalKeys}`);
          }
          
          if (result.advancedMetrics) {
            console.log('\n📈 Advanced Metrics:');
            console.log(`  Market breadth: ${result.advancedMetrics.marketBreadth}%`);
            console.log(`  Volume concentration: ${result.advancedMetrics.volumeConcentration}%`);
            console.log(`  Risk distribution: High ${result.advancedMetrics.riskDistribution.high}%, Medium ${result.advancedMetrics.riskDistribution.medium}%, Low ${result.advancedMetrics.riskDistribution.low}%`);
          }
          
          if (result.topTokens && result.topTokens.length > 0) {
            console.log('\n🏆 Top Tokens:');
            result.topTokens.slice(0, 3).forEach((token, i) => {
              console.log(`  ${i + 1}. ${token.symbol}: ${token.priceChange24h}% (Score: ${token.score})`);
            });
          }
          
          resolve(result);
        } catch (error) {
          console.error('❌ Failed to parse response:', error);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ API request failed:', error.message);
      reject(error);
    });
    
    req.end();
  });
}

// Run multiple tests to check caching
async function runTests() {
  console.log('🧪 Test 1: First request (should be cache miss)');
  await testAPI();
  
  console.log('\n'.repeat(2) + '🧪 Test 2: Second request (should be cache hit)');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await testAPI();
  
  console.log('\n'.repeat(2) + '🧪 Test 3: Third request after delay (should still be cache hit)');
  await new Promise(resolve => setTimeout(resolve, 5000));
  await testAPI();
  
  console.log('\n'.repeat(2) + '🧪 Test 4: Request after cache expiry (wait 20 seconds)');
  console.log('⏳ Waiting 20 seconds for cache to expire...');
  await new Promise(resolve => setTimeout(resolve, 20000));
  await testAPI();
  
  console.log('\n🎯 All tests completed!');
}

// Check if server is running
const checkServer = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
};

// Main execution
async function main() {
  console.log('🔍 Checking if Next.js server is running...');
  const isServerRunning = await checkServer();
  
  if (!isServerRunning) {
    console.log('⚠️  Next.js server not detected on port 3000');
    console.log('💡 To test the API, first run:');
    console.log('   cd /home/matrix/.openclaw/workspace/iseeiape-website');
    console.log('   npm run dev');
    console.log('\n📋 Running local file test instead...');
    await runLocalTest();
  } else {
    console.log('✅ Server detected, running API tests...');
    await runTests();
  }
}

// Local file test as fallback
async function runLocalTest() {
  console.log('\n📁 Testing API logic locally...');
  
  // Simulate the API logic
  const fs = require('fs');
  const path = require('path');
  
  const liveDataFile = path.join(__dirname, '../data/wolf-live.json');
  
  if (fs.existsSync(liveDataFile)) {
    const rawData = fs.readFileSync(liveDataFile, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log(`✅ Data file loaded: ${liveDataFile}`);
    console.log(`📈 Alerts count: ${data.alerts?.length || 0}`);
    console.log(`📊 File size: ${(Buffer.byteLength(rawData, 'utf8') / 1024).toFixed(2)}KB`);
    
    // Test processing
    const startTime = Date.now();
    const processed = data.alerts?.map(alert => ({
      symbol: alert.symbol,
      score: alert.score || 50,
      priceChange24h: alert.price_change_24h || 0
    })) || [];
    
    const processingTime = Date.now() - startTime;
    console.log(`⚡ Processing time: ${processingTime}ms`);
    console.log(`📊 Throughput: ${(processed.length / (processingTime / 1000)).toFixed(2)} alerts/second`);
    
    if (processed.length > 0) {
      console.log('\n🏆 Sample processed alerts:');
      processed.slice(0, 3).forEach((alert, i) => {
        console.log(`  ${i + 1}. ${alert.symbol}: ${alert.priceChange24h}% (Score: ${alert.score})`);
      });
    }
  } else {
    console.log('❌ Data file not found');
  }
}

main().catch(console.error);