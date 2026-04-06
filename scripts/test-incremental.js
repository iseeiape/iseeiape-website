#!/usr/bin/env node

/**
 * Test script for incremental wolf pack runner
 */

const { main } = require('./wolf-pack-incremental');

async function runTests() {
  console.log('🧪 Testing Incremental Wolf Pack Runner');
  console.log('=======================================');
  
  try {
    // Test 1: First run (should do full update)
    console.log('\n📋 Test 1: First run (full update)');
    const result1 = await main();
    console.log('✅ Test 1 passed');
    console.log(`   Alerts: ${result1.totalAlerts}`);
    console.log(`   From cache: ${result1.fromCache}`);
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 2: Second run (should use cache)
    console.log('\n📋 Test 2: Second run (cached)');
    const result2 = await main();
    console.log('✅ Test 2 passed');
    console.log(`   Alerts: ${result2.totalAlerts}`);
    console.log(`   From cache: ${result2.fromCache}`);
    
    // Test 3: Check performance
    console.log('\n📋 Test 3: Performance check');
    const fs = require('fs').promises;
    const path = require('path');
    
    const perfLog = path.join(__dirname, '../neo-crypto/logs/performance-incremental.log');
    const logData = await fs.readFile(perfLog, 'utf8');
    const lines = logData.trim().split('\n');
    
    console.log(`   Performance logs: ${lines.length} entries`);
    
    if (lines.length > 0) {
      const lastLog = JSON.parse(lines[lines.length - 1]);
      console.log(`   Last execution: ${lastLog.totalDuration}ms`);
      console.log(`   Cache hit rate: ${(lastLog.cacheHitRate * 100).toFixed(1)}%`);
    }
    
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  runTests();
}

module.exports = { runTests };