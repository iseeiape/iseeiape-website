#!/usr/bin/env node

/**
 * Performance Optimizer for iseeiape-website
 * 
 * Analyzes and optimizes performance bottlenecks in the automation system.
 * Focuses on Wolf Pack runner, API calls, and content generation.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  logsDir: path.join(__dirname, '../neo-crypto/logs'),
  outputDir: path.join(__dirname, '../neo-crypto/outputs/performance'),
  wolfPackScript: path.join(__dirname, '../neo-crypto/scripts/wolf-pack-runner.js'),
  cacheDir: path.join(__dirname, '../neo-crypto/data'),
  
  // Performance thresholds (in milliseconds)
  thresholds: {
    wolfPackExecution: 5000, // 5 seconds
    apiResponse: 2000,       // 2 seconds
    contentGeneration: 3000, // 3 seconds
    cacheHitRate: 0.7,       // 70%
  }
};

// Ensure directories exist
function ensureDirectories() {
  const dirs = [CONFIG.outputDir];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
}

// Analyze Wolf Pack performance
function analyzeWolfPackPerformance() {
  console.log('🔍 Analyzing Wolf Pack performance...');
  
  const analysis = {
    executionTimes: [],
    averageTime: 0,
    bottlenecks: [],
    recommendations: []
  };
  
  try {
    // Get recent wolf-pack logs
    const logFiles = fs.readdirSync(CONFIG.logsDir)
      .filter(file => file.startsWith('wolf-pack-') && file.endsWith('.log'))
      .sort()
      .slice(-10); // Last 10 runs
    
    for (const logFile of logFiles) {
      const logPath = path.join(CONFIG.logsDir, logFile);
      const content = fs.readFileSync(logPath, 'utf8');
      
      // Extract execution time
      const timeMatch = content.match(/Execution completed in (\d+)ms/);
      if (timeMatch) {
        const execTime = parseInt(timeMatch[1]);
        analysis.executionTimes.push(execTime);
        
        // Check for bottlenecks
        if (execTime > CONFIG.thresholds.wolfPackExecution) {
          analysis.bottlenecks.push({
            file: logFile,
            executionTime: execTime,
            issue: `Wolf Pack execution took ${execTime}ms (threshold: ${CONFIG.thresholds.wolfPackExecution}ms)`
          });
        }
      }
      
      // Check for errors
      if (content.includes('❌') || content.includes('Error:')) {
        const errorLines = content.split('\n').filter(line => line.includes('❌') || line.includes('Error:'));
        analysis.bottlenecks.push({
          file: logFile,
          errors: errorLines.slice(0, 3)
        });
      }
    }
    
    // Calculate average
    if (analysis.executionTimes.length > 0) {
      analysis.averageTime = Math.round(
        analysis.executionTimes.reduce((a, b) => a + b, 0) / analysis.executionTimes.length
      );
    }
    
    // Generate recommendations
    if (analysis.averageTime > CONFIG.thresholds.wolfPackExecution) {
      analysis.recommendations.push({
        priority: 'high',
        action: 'Optimize Wolf Pack runner',
        details: `Average execution time: ${analysis.averageTime}ms (threshold: ${CONFIG.thresholds.wolfPackExecution}ms)`,
        suggestions: [
          'Implement parallel processing for alert parsing',
          'Add incremental updates instead of full runs',
          'Optimize Python script execution'
        ]
      });
    }
    
    if (analysis.bottlenecks.some(b => b.errors)) {
      analysis.recommendations.push({
        priority: 'high',
        action: 'Fix error handling',
        details: 'Errors detected in recent runs',
        suggestions: [
          'Add retry logic for API failures',
          'Implement fallback data sources',
          'Improve error logging and notification'
        ]
      });
    }
    
    console.log(`📊 Wolf Pack Analysis:`);
    console.log(`  • Average execution time: ${analysis.averageTime}ms`);
    console.log(`  • Recent runs analyzed: ${analysis.executionTimes.length}`);
    console.log(`  • Bottlenecks found: ${analysis.bottlenecks.length}`);
    
  } catch (error) {
    console.error('❌ Error analyzing Wolf Pack performance:', error.message);
  }
  
  return analysis;
}

// Analyze cache performance
function analyzeCachePerformance() {
  console.log('🔍 Analyzing cache performance...');
  
  const analysis = {
    cacheFiles: [],
    hitRate: 0,
    recommendations: []
  };
  
  try {
    // Check cache directory
    if (fs.existsSync(CONFIG.cacheDir)) {
      const cacheFiles = fs.readdirSync(CONFIG.cacheDir)
        .filter(file => file.includes('cache') || file.includes('wolf-pack'))
        .map(file => ({
          name: file,
          path: path.join(CONFIG.cacheDir, file),
          size: fs.statSync(path.join(CONFIG.cacheDir, file)).size
        }));
      
      analysis.cacheFiles = cacheFiles;
      
      // Check for large cache files
      const largeFiles = cacheFiles.filter(file => file.size > 1024 * 1024); // > 1MB
      if (largeFiles.length > 0) {
        analysis.recommendations.push({
          priority: 'medium',
          action: 'Optimize cache storage',
          details: `${largeFiles.length} cache files larger than 1MB`,
          suggestions: [
            'Implement cache compression',
            'Add TTL (time-to-live) for cache entries',
            'Clean up old cache files automatically'
          ]
        });
      }
      
      console.log(`📊 Cache Analysis:`);
      console.log(`  • Cache files found: ${cacheFiles.length}`);
      console.log(`  • Total cache size: ${Math.round(cacheFiles.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024 * 100) / 100} MB`);
      
    } else {
      console.log('⚠️  Cache directory not found');
    }
    
  } catch (error) {
    console.error('❌ Error analyzing cache performance:', error.message);
  }
  
  return analysis;
}

// Analyze API performance
function analyzeApiPerformance() {
  console.log('🔍 Analyzing API performance...');
  
  const analysis = {
    endpoints: [],
    responseTimes: [],
    recommendations: []
  };
  
  try {
    // Check for API endpoint files
    const apiDir = path.join(__dirname, '../pages/api');
    if (fs.existsSync(apiDir)) {
      const apiFiles = fs.readdirSync(apiDir, { recursive: true })
        .filter(file => file.endsWith('.js') || file.endsWith('.ts'));
      
      analysis.endpoints = apiFiles.map(file => ({
        path: `/api/${file.replace(/\.(js|ts)$/, '').replace(/\/index$/, '')}`,
        file: file
      }));
      
      // Check for caching in API endpoints
      const uncachedEndpoints = [];
      for (const endpoint of analysis.endpoints.slice(0, 5)) { // Check first 5
        const filePath = path.join(apiDir, endpoint.file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (!content.includes('cache') && !content.includes('Cache') && !content.includes('CACHE')) {
          uncachedEndpoints.push(endpoint.path);
        }
      }
      
      if (uncachedEndpoints.length > 0) {
        analysis.recommendations.push({
          priority: 'medium',
          action: 'Add caching to API endpoints',
          details: `${uncachedEndpoints.length} endpoints without caching`,
          suggestions: [
            'Implement node-cache for frequently accessed data',
            'Add Redis caching for distributed environments',
            'Set appropriate TTL based on data freshness requirements'
          ]
        });
      }
      
      console.log(`📊 API Analysis:`);
      console.log(`  • API endpoints found: ${analysis.endpoints.length}`);
      console.log(`  • Uncached endpoints: ${uncachedEndpoints.length}`);
      
    } else {
      console.log('⚠️  API directory not found');
    }
    
  } catch (error) {
    console.error('❌ Error analyzing API performance:', error.message);
  }
  
  return analysis;
}

// Generate optimization report
function generateOptimizationReport(wolfPackAnalysis, cacheAnalysis, apiAnalysis) {
  console.log('\n📈 Generating optimization report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      wolfPackPerformance: wolfPackAnalysis.averageTime,
      cacheSize: cacheAnalysis.cacheFiles.reduce((sum, file) => sum + file.size, 0),
      apiEndpoints: apiAnalysis.endpoints.length,
      totalRecommendations: [
        ...wolfPackAnalysis.recommendations,
        ...cacheAnalysis.recommendations,
        ...apiAnalysis.recommendations
      ].length
    },
    wolfPackAnalysis,
    cacheAnalysis,
    apiAnalysis,
    allRecommendations: [
      ...wolfPackAnalysis.recommendations,
      ...cacheAnalysis.recommendations,
      ...apiAnalysis.recommendations
    ].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }),
    quickWins: [],
    implementationPlan: {
      immediate: [],
      shortTerm: [],
      longTerm: []
    }
  };
  
  // Identify quick wins
  report.allRecommendations.forEach(rec => {
    if (rec.priority === 'high' && rec.suggestions.some(s => s.includes('retry') || s.includes('TTL') || s.includes('cleanup'))) {
      report.quickWins.push(rec);
    }
  });
  
  // Create implementation plan
  report.allRecommendations.forEach(rec => {
    if (rec.priority === 'high') {
      report.implementationPlan.immediate.push(rec);
    } else if (rec.priority === 'medium') {
      report.implementationPlan.shortTerm.push(rec);
    } else {
      report.implementationPlan.longTerm.push(rec);
    }
  });
  
  // Save report
  const reportFile = path.join(CONFIG.outputDir, `performance-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');
  
  console.log(`💾 Performance report saved: ${reportFile}`);
  
  // Print summary
  console.log('\n🚀 PERFORMANCE OPTIMIZATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`📊 Wolf Pack: ${wolfPackAnalysis.averageTime}ms average execution`);
  console.log(`💾 Cache: ${Math.round(report.summary.cacheSize / 1024 / 1024 * 100) / 100} MB total`);
  console.log(`🔌 API: ${apiAnalysis.endpoints.length} endpoints`);
  console.log(`💡 Recommendations: ${report.summary.totalRecommendations} total`);
  console.log(`⚡ Quick Wins: ${report.quickWins.length} high-impact fixes`);
  
  console.log('\n🎯 TOP PRIORITIES:');
  report.implementationPlan.immediate.slice(0, 3).forEach((rec, i) => {
    console.log(`  ${i + 1}. ${rec.action} - ${rec.details}`);
  });
  
  return report;
}

// Run performance tests
function runPerformanceTests() {
  console.log('⚡ Running performance tests...');
  
  const tests = {
    wolfPackColdStart: null,
    wolfPackWarmStart: null,
    apiResponseTime: null
  };
  
  try {
    // Test Wolf Pack cold start
    console.log('  Testing Wolf Pack cold start...');
    const startCold = Date.now();
    execSync(`node "${CONFIG.wolfPackScript}" --test`, { 
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 30000 // 30 second timeout
    });
    tests.wolfPackColdStart = Date.now() - startCold;
    console.log(`    Cold start: ${tests.wolfPackColdStart}ms`);
    
    // Wait a moment
    setTimeout(() => {
      // Test Wolf Pack warm start (with cache)
      console.log('  Testing Wolf Pack warm start...');
      const startWarm = Date.now();
      execSync(`node "${CONFIG.wolfPackScript}" --test`, { 
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 30000
      });
      tests.wolfPackWarmStart = Date.now() - startWarm;
      console.log(`    Warm start: ${tests.wolfPackWarmStart}ms`);
      
      // Calculate improvement
      if (tests.wolfPackColdStart && tests.wolfPackWarmStart) {
        const improvement = Math.round((1 - tests.wolfPackWarmStart / tests.wolfPackColdStart) * 100);
        console.log(`    Cache improvement: ${improvement}% faster`);
      }
      
    }, 2000);
    
  } catch (error) {
    console.error('❌ Performance test error:', error.message);
  }
  
  return tests;
}

// Main execution
async function main() {
  console.log('⚡ Performance Optimizer for iseeiape-website');
  console.log('='.repeat(50));
  
  ensureDirectories();
  
  try {
    // Run analyses
    const wolfPackAnalysis = analyzeWolfPackPerformance();
    const cacheAnalysis = analyzeCachePerformance();
    const apiAnalysis = analyzeApiPerformance();
    
    // Run performance tests
    const performanceTests = runPerformanceTests();
    
    // Generate report
    const report = generateOptimizationReport(wolfPackAnalysis, cacheAnalysis, apiAnalysis);
    
    console.log('\n✅ Performance optimization analysis completed!');
    console.log(`📋 Next steps:`);
    console.log(`  1. Review ${report.quickWins.length} quick wins`);
    console.log(`  2. Implement ${report.implementationPlan.immediate.length} high-priority fixes`);
    console.log(`  3. Monitor performance after changes`);
    
    return { success: true, report };
    
  } catch (error) {
    console.error('❌ Performance optimizer failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  analyzeWolfPackPerformance,
  analyzeCachePerformance,
  analyzeApiPerformance,
  generateOptimizationReport,
  runPerformanceTests,
  main
};