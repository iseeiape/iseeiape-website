#!/usr/bin/env node

/**
 * Test script for enhanced content automation system
 */

const fs = require('fs').promises;
const path = require('path');

// Test the real-time data fetcher
async function testDataFetcher() {
  console.log('🧪 TEST 1: Real-Time Data Fetcher');
  console.log('='.repeat(50));
  
  try {
    const RealTimeDataFetcher = require('../../neo-crypto/scripts/real-time-data-fetcher.js');
    const fetcher = new RealTimeDataFetcher();
    
    console.log('📡 Testing data fetch...');
    const data = await fetcher.fetchAllData();
    
    console.log('✅ Data fetch successful!');
    console.log(`📊 Tokens retrieved: ${data.tokens.length}`);
    console.log(`🧠 Narratives calculated: ${data.narratives.length}`);
    console.log(`🐋 Whale activity: ${data.whales.recentActivity.length} events`);
    
    // Save test data
    const testDir = path.join(__dirname, 'test-output');
    await fs.mkdir(testDir, { recursive: true });
    
    const testFile = path.join(testDir, 'test-data.json');
    await fs.writeFile(testFile, JSON.stringify(data, null, 2));
    console.log(`📁 Test data saved to: ${testFile}`);
    
    return true;
  } catch (error) {
    console.error('❌ Data fetcher test failed:', error.message);
    return false;
  }
}

// Test the enhanced content scheduler
async function testContentScheduler() {
  console.log('\n🧪 TEST 2: Enhanced Content Scheduler');
  console.log('='.repeat(50));
  
  try {
    const EnhancedContentScheduler = require('./enhanced-content-scheduler.js');
    const scheduler = new EnhancedContentScheduler();
    
    console.log('📝 Testing content generation...');
    const result = await scheduler.run();
    
    console.log('✅ Content generation successful!');
    console.log(`📊 Content types generated: ${result.generatedContent.length}`);
    console.log(`📅 Posts scheduled: ${result.scheduledPosts.length}`);
    
    // Check quality scores
    const approvedContent = result.generatedContent.filter(c => c.status === 'approved');
    console.log(`✅ Approved content: ${approvedContent.length}`);
    
    const avgScore = approvedContent.reduce((sum, c) => sum + c.qualityScore, 0) / approvedContent.length;
    console.log(`📈 Average quality score: ${avgScore.toFixed(1)}/100`);
    
    return true;
  } catch (error) {
    console.error('❌ Content scheduler test failed:', error.message);
    return false;
  }
}

// Test the article generator
async function testArticleGenerator() {
  console.log('\n🧪 TEST 3: Article Generator');
  console.log('='.repeat(50));
  
  try {
    const ArticleGenerator = require('./article-generator.js');
    const generator = new ArticleGenerator();
    
    console.log('📄 Testing article generation...');
    const articles = await generator.generateAllArticles();
    
    console.log('✅ Article generation successful!');
    console.log(`📚 Articles generated: ${articles.length}`);
    
    articles.forEach((article, i) => {
      console.log(`  ${i + 1}. ${article.title} (${article.wordCount} words)`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Article generator test failed:', error.message);
    return false;
  }
}

// Run integration test
async function runIntegrationTest() {
  console.log('🚀 INTEGRATION TEST: Complete Content Automation System');
  console.log('='.repeat(60));
  
  const results = {
    dataFetcher: await testDataFetcher(),
    contentScheduler: await testContentScheduler(),
    articleGenerator: await testArticleGenerator()
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 INTEGRATION TEST RESULTS');
  console.log('='.repeat(60));
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    console.log('\n🎉 ALL TESTS PASSED! System is ready for deployment.');
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Set up cron jobs for automated execution');
    console.log('2. Configure API keys for production');
    console.log('3. Set up monitoring and alerts');
    console.log('4. Deploy to production environment');
  } else {
    console.log('\n⚠️ SOME TESTS FAILED. Review errors above.');
  }
  
  return allPassed;
}

// Run tests
async function main() {
  try {
    const success = await runIntegrationTest();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  testDataFetcher,
  testContentScheduler,
  testArticleGenerator,
  runIntegrationTest
};