// Performance test for market data API
const fs = require('fs');
const path = require('path');

async function testPerformance() {
  console.log('🚀 Performance Test - Market Data API');
  console.log('='.repeat(50));
  
  // Test 1: File reading performance
  console.log('\n📊 Test 1: File Reading Performance');
  const liveDataFile = path.join(__dirname, '../data/wolf-live.json');
  const startRead = performance.now();
  
  if (fs.existsSync(liveDataFile)) {
    const rawData = fs.readFileSync(liveDataFile, 'utf8');
    const readTime = performance.now() - startRead;
    const dataSize = Buffer.byteLength(rawData, 'utf8');
    console.log(`✅ File read: ${(readTime).toFixed(2)}ms`);
    console.log(`📁 File size: ${(dataSize / 1024).toFixed(2)}KB`);
    
    // Test 2: JSON parsing performance
    console.log('\n📊 Test 2: JSON Parsing Performance');
    const startParse = performance.now();
    const data = JSON.parse(rawData);
    const parseTime = performance.now() - startParse;
    console.log(`✅ JSON parse: ${(parseTime).toFixed(2)}ms`);
    console.log(`📈 Alerts count: ${data.alerts?.length || 0}`);
    
    // Test 3: Data processing performance
    console.log('\n📊 Test 3: Data Processing Performance');
    const startProcess = performance.now();
    
    // Simulate processing similar to API
    const processedAlerts = data.alerts?.map(alert => {
      const score = alert.score || calculateScore(alert);
      const confidence = calculateConfidence(alert);
      const riskLevel = calculateRiskLevel(alert);
      
      return {
        ...alert,
        score,
        confidence,
        riskLevel,
        signals: alert.signals || generateSignals(alert),
        priceChange1h: alert.price_change_1h || alert.priceChange1h || 0,
        priceChange24h: alert.price_change_24h || alert.priceChange24h || 0,
        volume24h: alert.volume_24h || alert.volume24h || 0,
        liquidity: alert.liquidity || 0,
        marketCap: alert.market_cap || alert.marketCap || 0
      };
    }) || [];
    
    const processTime = performance.now() - startProcess;
    console.log(`✅ Processing: ${(processTime).toFixed(2)}ms`);
    console.log(`⚡ Processing per alert: ${(processTime / processedAlerts.length).toFixed(3)}ms`);
    
    // Test 4: Sorting performance
    console.log('\n📊 Test 4: Sorting Performance');
    const startSort = performance.now();
    const sortedAlerts = [...processedAlerts].sort((a, b) => b.score - a.score);
    const sortTime = performance.now() - startSort;
    console.log(`✅ Sorting: ${(sortTime).toFixed(2)}ms`);
    
    // Test 5: Full pipeline
    console.log('\n📊 Test 5: Full Pipeline Performance');
    const startFull = performance.now();
    
    // Read
    const rawData2 = fs.readFileSync(liveDataFile, 'utf8');
    // Parse
    const data2 = JSON.parse(rawData2);
    // Process
    const processedAlerts2 = data2.alerts?.map(alert => ({
      ...alert,
      score: alert.score || calculateScore(alert),
      confidence: calculateConfidence(alert),
      riskLevel: calculateRiskLevel(alert)
    })) || [];
    // Sort
    const sortedAlerts2 = [...processedAlerts2].sort((a, b) => b.score - a.score);
    
    const fullTime = performance.now() - startFull;
    console.log(`✅ Full pipeline: ${(fullTime).toFixed(2)}ms`);
    console.log(`📊 Total alerts processed: ${sortedAlerts2.length}`);
    
    // Summary
    console.log('\n🎯 Performance Summary');
    console.log('='.repeat(50));
    console.log(`Total time: ${(readTime + parseTime + processTime + sortTime).toFixed(2)}ms`);
    console.log(`Throughput: ${(sortedAlerts2.length / (fullTime / 1000)).toFixed(2)} alerts/second`);
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    if (fullTime > 100) {
      console.log('⚠️  API response time > 100ms - Consider implementing caching');
    }
    if (dataSize > 100 * 1024) {
      console.log('⚠️  Data file > 100KB - Consider data compression or pagination');
    }
    if (sortedAlerts2.length > 50) {
      console.log('💡 More than 50 alerts - Implement client-side pagination');
    }
    
  } else {
    console.log('❌ Data file not found:', liveDataFile);
  }
}

// Helper functions from the API
function calculateScore(alert) {
  let score = 50;
  if (alert.price_change_24h > 100) score += 30;
  else if (alert.price_change_24h > 50) score += 20;
  else if (alert.price_change_24h > 20) score += 10;
  
  if (alert.volume_24h > 1000000) score += 20;
  else if (alert.volume_24h > 100000) score += 10;
  
  if (alert.liquidity > 50000) score += 10;
  else if (alert.liquidity > 10000) score += 5;
  
  return Math.min(100, score);
}

function calculateConfidence(alert) {
  const factors = [];
  if (alert.volume_24h > 100000) factors.push('high-volume');
  if (alert.liquidity > 20000) factors.push('good-liquidity');
  if (alert.price_change_24h > 50) factors.push('strong-momentum');
  
  if (factors.length >= 3) return 'high';
  if (factors.length >= 2) return 'medium';
  return 'low';
}

function calculateRiskLevel(alert) {
  if (alert.liquidity < 10000) return 'high';
  if (alert.volume_24h < 50000) return 'medium';
  return 'low';
}

function generateSignals(alert) {
  const signals = [];
  if (alert.price_change_24h > 100) signals.push('🚀 Mega pump: +' + alert.price_change_24h.toFixed(0) + '% (24h)');
  else if (alert.price_change_24h > 50) signals.push('📈 Strong pump: +' + alert.price_change_24h.toFixed(0) + '% (24h)');
  else if (alert.price_change_24h > 20) signals.push('📊 Good momentum: +' + alert.price_change_24h.toFixed(0) + '% (24h)');
  
  if (alert.volume_24h > 1000000) signals.push('💰 High volume: $' + (alert.volume_24h / 1000000).toFixed(1) + 'M');
  else if (alert.volume_24h > 100000) signals.push('💸 Good volume: $' + (alert.volume_24h / 1000).toFixed(0) + 'K');
  
  if (alert.liquidity > 50000) signals.push('💪 Strong liquidity: $' + (alert.liquidity / 1000).toFixed(0) + 'K');
  else if (alert.liquidity > 10000) signals.push('🛡️  Decent liquidity: $' + (alert.liquidity / 1000).toFixed(0) + 'K');
  
  return signals;
}

// Run the test
testPerformance().catch(console.error);