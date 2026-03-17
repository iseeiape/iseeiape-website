#!/usr/bin/env node

/**
 * 🦎 NEO CRYPTO TEST SUITE
 * 
 * Comprehensive testing for the Neo Crypto content generation system.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Test configuration
const TEST_DIR = __dirname;
const ROOT_DIR = path.join(TEST_DIR, '..');
const SCRIPTS_DIR = path.join(ROOT_DIR, 'scripts');
const OUTPUT_DIR = path.join(ROOT_DIR, 'outputs/test-results');
const DATA_DIR = path.join(ROOT_DIR, 'data');

// Ensure test directories exist
[OUTPUT_DIR, DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Helper functions
function logTest(name, passed, message = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${name}: PASSED ${message}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${name}: FAILED ${message}`);
  }
  
  testResults.details.push({
    name,
    passed,
    message,
    timestamp: new Date().toISOString()
  });
}

function saveTestResults() {
  const resultsFile = path.join(OUTPUT_DIR, `test-results-${Date.now()}.json`);
  fs.writeFileSync(resultsFile, JSON.stringify(testResults, null, 2));
  console.log(`\n📊 Test results saved to: ${resultsFile}`);
  return resultsFile;
}

// Test cases
async function testAlphaGenerator() {
  console.log('\n🧪 TEST 1: Alpha Generator');
  console.log('='.repeat(40));
  
  try {
    // Test 1.1: Basic generation
    const alphaGen = require(path.join(SCRIPTS_DIR, 'alpha-generator.js'));
    
    // Test each content type
    const whaleAlert = alphaGen.generateWhaleAlert();
    logTest('generateWhaleAlert', 
      typeof whaleAlert === 'string' && whaleAlert.length > 100,
      `(${whaleAlert.length} chars)`);
    
    const trendAlert = alphaGen.generateTrendAlert();
    logTest('generateTrendAlert',
      typeof trendAlert === 'string' && trendAlert.length > 100,
      `(${trendAlert.length} chars)`);
    
    const dailyAlpha = alphaGen.generateDailyAlpha();
    logTest('generateDailyAlpha',
      typeof dailyAlpha === 'string' && dailyAlpha.length > 100,
      `(${dailyAlpha.length} chars)`);
    
    const thread = alphaGen.generateThread();
    logTest('generateThread',
      typeof thread === 'string' && thread.length > 500,
      `(${thread.length} chars)`);
    
    // Test 1.2: CLI execution
    try {
      execSync(`node "${SCRIPTS_DIR}/alpha-generator.js" --type whale_alert --count 1 --dry-run`, {
        cwd: ROOT_DIR,
        stdio: 'pipe'
      });
      logTest('CLI execution', true, '(dry run successful)');
    } catch (error) {
      logTest('CLI execution', false, error.message);
    }
    
  } catch (error) {
    logTest('Alpha Generator imports', false, error.message);
  }
}

async function testCronScheduler() {
  console.log('\n🧪 TEST 2: Cron Scheduler');
  console.log('='.repeat(40));
  
  try {
    const cronModule = require(path.join(SCRIPTS_DIR, 'cron-scheduler.js'));
    
    // Test 2.1: Generate cron jobs
    const jobs = cronModule.generateCronJobs();
    logTest('generateCronJobs',
      Array.isArray(jobs) && jobs.length === 5,
      `(${jobs.length} jobs generated)`);
    
    // Test 2.2: Generate install script
    const installScript = cronModule.generateInstallScript(jobs);
    logTest('generateInstallScript',
      typeof installScript === 'string' && installScript.includes('#!/bin/bash'),
      `(${installScript.length} chars)`);
    
    // Test 2.3: Verify job structure
    const validJobs = jobs.every(job => 
      job.id && job.time && job.type && job.cron
    );
    logTest('job structure validation', validJobs);
    
  } catch (error) {
    logTest('Cron Scheduler imports', false, error.message);
  }
}

async function testApiIntegration() {
  console.log('\n🧪 TEST 3: API Integration');
  console.log('='.repeat(40));
  
  try {
    const apiModule = require(path.join(SCRIPTS_DIR, 'api-integration.js'));
    
    // Test 3.1: DataCache class
    const cache = new apiModule.DataCache(DATA_DIR);
    logTest('DataCache instantiation', cache !== null);
    
    // Test 3.2: Cache operations
    cache.set('test_key', { data: 'test_value' });
    const cachedValue = cache.get('test_key');
    logTest('Cache set/get operations',
      cachedValue && cachedValue.data === 'test_value');
    
    cache.clear();
    const clearedValue = cache.get('test_key');
    logTest('Cache clear operation', clearedValue === null);
    
    // Test 3.3: Fallback token data
    const fallbackTokens = require(path.join(SCRIPTS_DIR, 'alpha-generator.js')).SAMPLE_TOKENS;
    logTest('Fallback token data',
      Array.isArray(fallbackTokens) && fallbackTokens.length > 0,
      `(${fallbackTokens.length} tokens)`);
    
  } catch (error) {
    logTest('API Integration imports', false, error.message);
  }
}

async function testFileStructure() {
  console.log('\n🧪 TEST 4: File Structure');
  console.log('='.repeat(40));
  
  const requiredFiles = [
    'SKILL.md',
    'scripts/alpha-generator.js',
    'scripts/cron-scheduler.js',
    'scripts/api-integration.js',
    'templates/hooks/whale-alert.md',
    'templates/hooks/trend-emerging.md',
    'config/neo-config.example.json',
    'package.json'
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(file => {
    const filePath = path.join(ROOT_DIR, file);
    const exists = fs.existsSync(filePath);
    
    if (exists) {
      console.log(`✅ ${file}: EXISTS`);
    } else {
      console.log(`❌ ${file}: MISSING`);
      allFilesExist = false;
    }
  });
  
  logTest('Required files exist', allFilesExist);
}

async function testContentGeneration() {
  console.log('\n🧪 TEST 5: Content Generation End-to-End');
  console.log('='.repeat(40));
  
  const testOutputDir = path.join(OUTPUT_DIR, 'content-test');
  if (!fs.existsSync(testOutputDir)) {
    fs.mkdirSync(testOutputDir, { recursive: true });
  }
  
  try {
    // Generate one of each content type
    execSync(`node "${SCRIPTS_DIR}/alpha-generator.js" --type whale_alert --count 1 --output "${testOutputDir}"`, {
      cwd: ROOT_DIR,
      stdio: 'pipe'
    });
    
    execSync(`node "${SCRIPTS_DIR}/alpha-generator.js" --type trend_alert --count 1 --output "${testOutputDir}"`, {
      cwd: ROOT_DIR,
      stdio: 'pipe'
    });
    
    execSync(`node "${SCRIPTS_DIR}/alpha-generator.js" --type daily_alpha --count 1 --output "${testOutputDir}"`, {
      cwd: ROOT_DIR,
      stdio: 'pipe'
    });
    
    // Check if files were created
    const files = fs.readdirSync(testOutputDir);
    const hasPosts = files.some(f => f.endsWith('.txt'));
    const hasMetadata = files.some(f => f.startsWith('metadata_'));
    
    logTest('Content files generated', hasPosts, `(${files.length} files)`);
    logTest('Metadata generated', hasMetadata);
    
    if (hasPosts) {
      const postFile = path.join(testOutputDir, files.find(f => f.endsWith('.txt')));
      const content = fs.readFileSync(postFile, 'utf8');
      logTest('Content validation',
        content.length > 50 && content.includes('#'),
        `(${content.length} chars)`);
    }
    
  } catch (error) {
    logTest('End-to-end generation', false, error.message);
  }
}

async function runAllTests() {
  console.log('🦎 NEO CRYPTO TEST SUITE');
  console.log('='.repeat(50));
  console.log(`Started: ${new Date().toISOString()}`);
  console.log(`Test directory: ${TEST_DIR}`);
  console.log('='.repeat(50));
  
  await testAlphaGenerator();
  await testCronScheduler();
  await testApiIntegration();
  await testFileStructure();
  await testContentGeneration();
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed} (${Math.round(testResults.passed/testResults.total*100)}%)`);
  console.log(`Failed: ${testResults.failed} (${Math.round(testResults.failed/testResults.total*100)}%)`);
  
  // Save results
  const resultsFile = saveTestResults();
  
  // Exit with appropriate code
  if (testResults.failed > 0) {
    console.log('\n❌ Some tests failed. Check the results file for details.');
    console.log(`   ${resultsFile}`);
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  }
}

// Run tests
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('❌ Test suite crashed:', error);
    process.exit(1);
  });
}

module.exports = {
  testAlphaGenerator,
  testCronScheduler,
  testApiIntegration,
  testFileStructure,
  testContentGeneration,
  runAllTests
};