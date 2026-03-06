#!/usr/bin/env node

/**
 * Test script for Night Shift 2026-03-07 updates
 * Tests the new automation improvements
 */

const fs = require('fs').promises;
const path = require('path');

console.log('🧪 Testing Night Shift 2026-03-07 Updates\n');

async function testCostOptimizer() {
  console.log('1. Testing Cost Optimizer...');
  
  try {
    const CostOptimizer = require('./cost-optimizer');
    const optimizer = new CostOptimizer();
    
    // Create test logs
    const testLogs = [
      { type: 'whale-alert', model: 'claude-3-haiku', timestamp: new Date().toISOString() },
      { type: 'trend-alert', model: 'deepseek-chat', timestamp: new Date().toISOString() },
      { type: 'sentiment-report', model: 'gpt-4', timestamp: new Date().toISOString() },
      { type: 'market-update', model: 'claude-3-sonnet', timestamp: new Date().toISOString() },
    ];
    
    // Test cost estimation
    const estimates = optimizer.estimateCosts(testLogs);
    console.log(`   ✓ Cost estimation works: $${estimates.total.toFixed(4)} total`);
    
    // Test recommendations
    const recommendations = optimizer.generateRecommendations(testLogs, { qualityScores: [85, 90, 88] });
    console.log(`   ✓ Generated ${recommendations.length} recommendations`);
    
    return true;
  } catch (error) {
    console.error(`   ✗ Cost Optimizer test failed: ${error.message}`);
    return false;
  }
}

async function testErrorHandler() {
  console.log('2. Testing Robust Error Handler...');
  
  try {
    const RobustErrorHandler = require('./robust-error-handler');
    const errorHandler = new RobustErrorHandler();
    
    // Test error classification
    const testError = new Error('Rate limit exceeded');
    testError.response = { status: 429 };
    
    const errorType = errorHandler.classifyError(testError);
    console.log(`   ✓ Error classification works: ${errorType}`);
    
    // Test error handling
    const result = await errorHandler.handleError(testError, {
      operation: 'test_operation',
      retryFunction: async () => 'success'
    });
    
    console.log(`   ✓ Error handling works: ${result.errorId}`);
    
    // Test error report
    const report = await errorHandler.getErrorReport();
    console.log(`   ✓ Error report generation works`);
    
    return true;
  } catch (error) {
    console.error(`   ✗ Error Handler test failed: ${error.message}`);
    return false;
  }
}

async function testDashboardPage() {
  console.log('3. Testing Dashboard Page...');
  
  try {
    const dashboardPath = path.join(__dirname, '../../pages/dashboard/automation-performance.tsx');
    const content = await fs.readFile(dashboardPath, 'utf8');
    
    // Check for key components
    const checks = [
      { name: 'React component', regex: /export default function AutomationPerformance/ },
      { name: 'Metrics state', regex: /useState<AutomationMetric\[\]>/ },
      { name: 'Content performance table', regex: /Content Performance by Type/ },
      { name: 'Recent activity', regex: /Recent Activity/ },
      { name: 'Cost summary', regex: /Cost Summary/ }
    ];
    
    let passed = 0;
    checks.forEach(check => {
      if (check.regex.test(content)) {
        console.log(`   ✓ ${check.name} found`);
        passed++;
      } else {
        console.log(`   ✗ ${check.name} not found`);
      }
    });
    
    return passed === checks.length;
  } catch (error) {
    console.error(`   ✗ Dashboard test failed: ${error.message}`);
    return false;
  }
}

async function testMultiPlatformPoster() {
  console.log('4. Testing Multi-Platform Poster...');
  
  try {
    const MultiPlatformPoster = require('./multi-platform-poster');
    const poster = new MultiPlatformPoster({
      platforms: {
        x: { enabled: false }, // Disable for testing
        telegram: { enabled: false },
        discord: { enabled: false }
      }
    });
    
    // Test content formatting
    const testContent = {
      type: 'whale-alert',
      text: 'Test whale alert content',
      title: 'Test Whale Alert',
      hashtags: ['Crypto', 'WhaleAlert'],
      metrics: {
        price: 100,
        change24h: 5.5,
        volume24h: 1000000
      }
    };
    
    const formatted = poster.formatForPlatforms(testContent);
    console.log(`   ✓ Content formatting works`);
    
    // Test default titles
    const title = poster.getDefaultTitle('whale-alert');
    console.log(`   ✓ Default title: ${title}`);
    
    return true;
  } catch (error) {
    console.error(`   ✗ Multi-Platform Poster test failed: ${error.message}`);
    return false;
  }
}

async function testAll() {
  console.log('🚀 Running all tests for Night Shift updates\n');
  
  const tests = [
    testCostOptimizer,
    testErrorHandler,
    testDashboardPage,
    testMultiPlatformPoster
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const success = await test();
    if (success) {
      passed++;
    } else {
      failed++;
    }
    console.log('');
  }
  
  console.log('=' .repeat(50));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Night Shift updates are ready.');
    return true;
  } else {
    console.log('⚠️ Some tests failed. Check the errors above.');
    return false;
  }
}

// Run tests
testAll().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});