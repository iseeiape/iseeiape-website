#!/usr/bin/env node

/**
 * Wolf Pack Runner - OPTIMIZED VERSION
 * 
 * Optimized with:
 * 1. Parallel processing for alert parsing
 * 2. Incremental updates instead of full runs
 * 3. Better caching strategy
 * 4. Performance monitoring
 * 5. Graceful degradation
 */

const { exec, spawn } = require('child_process');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { promisify } = require('util');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const execPromise = promisify(exec);

// Configuration
const CONFIG = {
  pythonScript: '/home/matrix/.openclaw/workspace/wolf_pack_v8_complete.py',
  outputDir: path.join(__dirname, '../neo-crypto/data/wolf-pack'),
  cacheFile: path.join(__dirname, '../neo-crypto/data/wolf-pack-cache.json'),
  summaryFile: path.join(__dirname, '../neo-crypto/data/wolf-pack-summary.json'),
  incrementalCacheFile: path.join(__dirname, '../neo-crypto/data/wolf-pack-incremental.json'),
  performanceLog: path.join(__dirname, '../neo-crypto/logs/performance-wolf-pack.log'),
  
  // Optimization settings
  useIncrementalUpdates: true,
  maxCacheAgeMs: 5 * 60 * 1000, // 5 minutes
  parallelParsing: true,
  maxWorkers: 2,
  
  // Performance thresholds
  maxExecutionTimeMs: 8000,
  warningThresholdMs: 5000,
  
  // Alert patterns
  alertPatterns: {
    alpha: /🐺 ALERT:|🔔 ALERT/,
    newPair: /🆕 ALERT:|🆕 NEW_PAIR/,
    momentum: /📈 ALERT:|📈 TRENDING/,
    whale: /🐋 ALERT:|🐋 WHALE/,
    liquidity: /💧 ALERT:/
  }
};

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      startTime: Date.now(),
      phases: {},
      errors: []
    };
  }
  
  startPhase(phase) {
    this.metrics.phases[phase] = {
      start: Date.now(),
      end: null,
      duration: null
    };
  }
  
  endPhase(phase) {
    if (this.metrics.phases[phase]) {
      this.metrics.phases[phase].end = Date.now();
      this.metrics.phases[phase].duration = 
        this.metrics.phases[phase].end - this.metrics.phases[phase].start;
    }
  }
  
  addError(error) {
    this.metrics.errors.push({
      message: error.message,
      timestamp: new Date().toISOString(),
      stack: error.stack
    });
  }
  
  getMetrics() {
    const totalDuration = Date.now() - this.metrics.startTime;
    return {
      ...this.metrics,
      totalDuration,
      success: this.metrics.errors.length === 0
    };
  }
  
  async logPerformance() {
    const metrics = this.getMetrics();
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...metrics
    };
    
    try {
      await fs.appendFile(
        CONFIG.performanceLog,
        JSON.stringify(logEntry) + '\n',
        'utf8'
      );
    } catch (error) {
      console.error('❌ Failed to log performance:', error.message);
    }
    
    return metrics;
  }
}

// Cache manager with TTL
class CacheManager {
  constructor() {
    this.cache = null;
    this.incrementalCache = null;
  }
  
  async loadCache() {
    try {
      const data = await fs.readFile(CONFIG.cacheFile, 'utf8');
      this.cache = JSON.parse(data);
      
      // Check cache age
      if (this.cache.lastRun) {
        const cacheAge = Date.now() - new Date(this.cache.lastRun).getTime();
        if (cacheAge > CONFIG.maxCacheAgeMs) {
          console.log('⚠️  Cache expired, will refresh');
          this.cache.alerts = []; // Clear old alerts
        }
      }
      
      return this.cache;
    } catch (error) {
      console.log('📝 No cache found or error loading, starting fresh');
      return this.initializeCache();
    }
  }
  
  async loadIncrementalCache() {
    if (!CONFIG.useIncrementalUpdates) return null;
    
    try {
      const data = await fs.readFile(CONFIG.incrementalCacheFile, 'utf8');
      this.incrementalCache = JSON.parse(data);
      return this.incrementalCache;
    } catch (error) {
      return this.initializeIncrementalCache();
    }
  }
  
  initializeCache() {
    this.cache = {
      alerts: [],
      lastRun: null,
      performance: {},
      summary: {},
      metadata: {
        version: '2.0',
        optimized: true
      }
    };
    return this.cache;
  }
  
  initializeIncrementalCache() {
    this.incrementalCache = {
      lastTokenUpdates: {},
      tokenMetrics: {},
      updateTimestamps: {},
      metadata: {
        version: '1.0',
        incremental: true
      }
    };
    return this.incrementalCache;
  }
  
  async saveCache() {
    if (!this.cache) return false;
    
    try {
      this.cache.lastRun = new Date().toISOString();
      this.cache.lastOptimizedRun = new Date().toISOString();
      
      await fs.writeFile(
        CONFIG.cacheFile,
        JSON.stringify(this.cache, null, 2),
        'utf8'
      );
      return true;
    } catch (error) {
      console.error('❌ Error saving cache:', error.message);
      return false;
    }
  }
  
  async saveIncrementalCache() {
    if (!this.incrementalCache || !CONFIG.useIncrementalUpdates) return false;
    
    try {
      this.incrementalCache.lastUpdated = new Date().toISOString();
      
      await fs.writeFile(
        CONFIG.incrementalCacheFile,
        JSON.stringify(this.incrementalCache, null, 2),
        'utf8'
      );
      return true;
    } catch (error) {
      console.error('❌ Error saving incremental cache:', error.message);
      return false;
    }
  }
  
  // Merge new alerts with cache, removing duplicates
  mergeAlerts(newAlerts) {
    if (!this.cache) return newAlerts;
    
    const existingIds = new Set(this.cache.alerts.map(a => a.id));
    const uniqueNewAlerts = newAlerts.filter(alert => !existingIds.has(alert.id));
    
    // Combine and keep only recent alerts (last 100)
    const allAlerts = [...uniqueNewAlerts, ...this.cache.alerts];
    this.cache.alerts = allAlerts
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 100);
    
    return this.cache.alerts;
  }
  
  // Update incremental cache with new token data
  updateIncrementalCache(alerts) {
    if (!this.incrementalCache || !CONFIG.useIncrementalUpdates) return;
    
    const now = Date.now();
    
    alerts.forEach(alert => {
      const tokenKey = alert.symbol || alert.token;
      
      // Update last update time
      this.incrementalCache.lastTokenUpdates[tokenKey] = now;
      
      // Update metrics
      if (!this.incrementalCache.tokenMetrics[tokenKey]) {
        this.incrementalCache.tokenMetrics[tokenKey] = {
          alertCount: 0,
          totalScore: 0,
          categories: new Set(),
          firstSeen: now,
          lastSeen: now
        };
      }
      
      const metrics = this.incrementalCache.tokenMetrics[tokenKey];
      metrics.alertCount++;
      metrics.totalScore += alert.score || 0;
      metrics.categories.add(alert.category);
      metrics.lastSeen = now;
      
      // Convert Set to Array for JSON serialization
      metrics.categories = Array.from(metrics.categories);
    });
    
    this.incrementalCache.updateTimestamps[now] = alerts.length;
  }
}

// Parallel alert parser using worker threads
async function parseAlertsParallel(output, monitor) {
  if (!CONFIG.parallelParsing || !isMainThread) {
    return parseAlertsSequential(output);
  }
  
  monitor.startPhase('parallel_parsing');
  
  return new Promise((resolve, reject) => {
    const worker = new Worker(__filename, {
      workerData: { output, config: CONFIG }
    });
    
    worker.on('message', (alerts) => {
      monitor.endPhase('parallel_parsing');
      resolve(alerts);
    });
    
    worker.on('error', (error) => {
      monitor.addError(error);
      monitor.endPhase('parallel_parsing');
      console.log('⚠️  Parallel parsing failed, falling back to sequential');
      resolve(parseAlertsSequential(output));
    });
    
    worker.on('exit', (code) => {
      if (code !== 0) {
        console.log(`⚠️  Worker stopped with exit code ${code}`);
      }
    });
    
    // Timeout for worker
    setTimeout(() => {
      worker.terminate();
      console.log('⚠️  Parallel parsing timeout, falling back to sequential');
      resolve(parseAlertsSequential(output));
    }, 3000);
  });
}

// Worker thread code
if (!isMainThread && parentPort) {
  const { output, config } = workerData;
  const alerts = parseAlertsSequential(output);
  parentPort.postMessage(alerts);
}

// Sequential alert parser (fallback)
function parseAlertsSequential(output) {
  console.log('🔍 Parsing alerts sequentially...');
  
  const alerts = [];
  const lines = output.split('\n');
  const seenTokens = new Set();
  
  // First pass: look for alert sent lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for alert sent lines (optimized regex)
    const alertMatch = line.match(/✅ Alert sent via (.+?): (.+?) \(score=(\d+), type=(.+?)\)/);
    
    if (alertMatch) {
      const [, bot, tokenInfo, scoreStr, alertType] = alertMatch;
      const score = parseInt(scoreStr);
      
      // Parse token info
      let token = tokenInfo;
      let symbol = tokenInfo;
      
      const tokenMatch = tokenInfo.match(/(.+?) \((.+?)\)/);
      if (tokenMatch) {
        token = tokenMatch[1];
        symbol = tokenMatch[2];
      }
      
      // Skip if we've already seen this token in this run
      const tokenKey = `${symbol}_${alertType}`;
      if (seenTokens.has(tokenKey)) continue;
      seenTokens.add(tokenKey);
      
      // Determine category
      let category = 'other';
      let emoji = '📊';
      
      if (bot.includes('🐺 WOLF MAIN') || alertType.includes('🔔 ALERT')) {
        category = 'alpha';
        emoji = '🐺';
      } else if (bot.includes('🆕 WOLF NEWPAIRS') || alertType.includes('🆕 NEW_PAIR')) {
        category = 'new_pair';
        emoji = '🆕';
      } else if (bot.includes('📈 WOLF MOMENTUM') || alertType.includes('📈 TRENDING')) {
        category = 'momentum';
        emoji = '📈';
      } else if (bot.includes('🐋 WOLF WHALE') || alertType.includes('🐋 WHALE')) {
        category = 'whale';
        emoji = '🐋';
      }
      
      // Extract details from following lines (limited scope)
      const details = [];
      let metrics = {};
      
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const nextLine = lines[j];
        
        // Quick pattern matching
        if (nextLine.includes('💰 Price:')) {
          const priceMatch = nextLine.match(/💰 Price: \$([\d.]+)/);
          if (priceMatch) metrics.price = parseFloat(priceMatch[1]);
          details.push(nextLine.trim());
        } else if (nextLine.includes('📊 Volume:')) {
          const volumeMatch = nextLine.match(/📊 Volume: \$([\d.,]+[KMB]?)/);
          if (volumeMatch) {
            let volume = volumeMatch[1];
            // Convert K/M/B
            if (volume.includes('K')) volume = parseFloat(volume) * 1000;
            else if (volume.includes('M')) volume = parseFloat(volume) * 1000000;
            else if (volume.includes('B')) volume = parseFloat(volume) * 1000000000;
            else volume = parseFloat(volume.replace(/,/g, ''));
            metrics.volume = volume;
          }
          details.push(nextLine.trim());
        } else if (nextLine.includes('🚀 Change:')) {
          const changeMatch = nextLine.match(/🚀 Change: ([\d.]+)%/);
          if (changeMatch) metrics.change = parseFloat(changeMatch[1]);
          details.push(nextLine.trim());
        }
      }
      
      const alert = {
        id: `wolf_${Date.now()}_${alerts.length}_${symbol}`,
        timestamp: new Date().toISOString(),
        category,
        emoji,
        token: token.trim(),
        symbol: symbol.trim(),
        score,
        maxScore: 100,
        confidence: score,
        alertType,
        bot,
        details: details.slice(0, 3), // Limit details
        metrics
      };
      
      alerts.push(alert);
    }
  }
  
  // Second pass: top pairs list (only if we didn't find enough alerts)
  if (alerts.length < 3) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      const topPairMatch = line.match(/\d+\.\s+(.+?)\s+Score:\s+(\d+)\s+5m:([+-]?[\d.]+)%\s+1h:([+-]?[\d.]+)%\s+(.+?)\s+age=([\d.]+)h/);
      
      if (topPairMatch) {
        const [, tokenInfo, scoreStr, change5m, change1h, alertType, age] = topPairMatch;
        const score = parseInt(scoreStr);
        const tokenKey = `${tokenInfo.trim()}_${alertType}`;
        
        if (seenTokens.has(tokenKey)) continue;
        seenTokens.add(tokenKey);
        
        let category = 'other';
        let emoji = '📊';
        
        if (alertType.includes('🔔 ALERT')) {
          category = 'alpha';
          emoji = '🐺';
        } else if (alertType.includes('🆕 NEW_PAIR')) {
          category = 'new_pair';
          emoji = '🆕';
        } else if (alertType.includes('📈 TRENDING')) {
          category = 'momentum';
          emoji = '📈';
        }
        
        const alert = {
          id: `wolf_top_${Date.now()}_${alerts.length}_${tokenInfo.trim()}`,
          timestamp: new Date().toISOString(),
          category,
          emoji,
          token: tokenInfo.trim(),
          symbol: tokenInfo.trim(),
          score,
          maxScore: 100,
          confidence: score,
          alertType,
          bot: 'top_pairs_list',
          details: [`5m: ${change5m}%`, `1h: ${change1h}%`, `Age: ${age}h`],
          metrics: {
            change5m: parseFloat(change5m),
            change1h: parseFloat(change1h),
            ageHours: parseFloat(age)
          }
        };
        
        alerts.push(alert);
      }
    }
  }
  
  console.log(`✅ Parsed ${alerts.length} alerts`);
  return alerts;
}

// Run Wolf Pack Python script with streaming output
async function runWolfPackScript(monitor) {
  monitor.startPhase('python_execution');
  
  console.log('🚀 Running Wolf Pack v8 (optimized)...');
  
  if (!fsSync.existsSync(CONFIG.pythonScript)) {
    throw new Error(`Wolf Pack script not found: ${CONFIG.pythonScript}`);
  }
  
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let stdout = '';
    let stderr = '';
    
    const pythonProcess = spawn('python3', [CONFIG.pythonScript], {
      cwd: path.dirname(CONFIG.pythonScript),
      timeout: 120000 // 2 minute timeout
    });
    
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
      // Early parsing if we see completion indicator
      if (stdout.includes('✅ Wolf Pack execution completed')) {
        pythonProcess.kill('SIGTERM');
      }
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      monitor.endPhase('python_execution');
      const executionTime = Date.now() - startTime;
      
      console.log(`✅ Wolf Pack execution completed in ${executionTime}ms`);
      
      if (stderr) {
        console.warn('⚠️  Python stderr (first 200 chars):', stderr.substring(0, 200));
      }
      
      if (executionTime > CONFIG.warningThresholdMs) {
        console.warn(`⚠️  Execution time ${executionTime}ms exceeds warning threshold ${CONFIG.warningThresholdMs}ms`);
      }
      
      if (executionTime > CONFIG.maxExecutionTimeMs) {
        console.error(`❌ Execution time ${executionTime}ms exceeds maximum ${CONFIG.maxExecutionTimeMs}ms`);
        monitor.addError(new Error(`Python execution timeout: ${executionTime}ms`));
      }
      
      resolve(stdout);
    });
    
    pythonProcess.on('error', (error) => {
      monitor.endPhase('python_execution');
      monitor.addError(error);
      console.error('❌ Python process error:', error.message);
      
      // Fallback to cached data
      console.log('🔄 Falling back to cached data...');
      resolve('FALLBACK_DATA - Using cached alerts');
    });
  });
}

// Analyze alerts (optimized version)
function analyzeAlertsOptimized(alerts, incrementalCache) {
  console.log('\n📈 Analyzing alert patterns (optimized)...');
  
  const analysis = {
    summary: {
      totalAlerts: alerts.length,
      byCategory: {},
      byConfidence: { high: 0, medium: 0, low: 0 },
      avgScore: 0,
      timestamp: new Date().toISOString(),
      incrementalUpdates: incrementalCache ? Object.keys(incrementalCache.lastTokenUpdates).length : 0
    },
    topTokens: [],
    marketInsights: [],
    recommendations: []
  };
  
  if (alerts.length === 0) {
    console.log('⚠️  No alerts to analyze');
    return analysis;
  }
  
  // Quick aggregation using Map
  const tokenMap = new Map();
  let totalScore = 0;
  
  for (const alert of alerts) {
    // Category breakdown
    analysis.summary.byCategory[alert.category] = 
      (analysis.summary.byCategory[alert.category] || 0) + 1;
    
    // Confidence breakdown
    if (alert.confidence >= 80) analysis.summary.byConfidence.high++;
    else if (alert.confidence >= 60) analysis.summary.byConfidence.medium++;
    else analysis.summary.byConfidence.low++;
    
    totalScore += alert.score;
    
    // Token aggregation
    const tokenKey = alert.symbol;
    if (!tokenMap.has(tokenKey)) {
      tokenMap.set(tokenKey, {
        symbol: alert.symbol,
        token: alert.token,
        count: 0,
        totalScore: 0,
        categories: new Set(),
        latestAlert: alert.timestamp
      });
    }
    
    const tokenData = tokenMap.get(tokenKey);
    tokenData.count++;
    tokenData.totalScore += alert.score;
    tokenData.categories.add(alert.category);
  }
  
  // Calculate average
  analysis.summary.avgScore = Math.round(totalScore / alerts.length);
  
  // Convert to array and sort
  analysis.topTokens = Array.from(tokenMap.values())
    .map(token => ({
      ...token,
      avgScore: Math.round(token.totalScore / token.count),
      categories: Array.from(token.categories)
    }))
    .sort((a, b) => b.avgScore - a.avgScore) // Sort by average score
    .slice(0, 5); // Top 5 only
  
  // Generate insights (optimized)
  const highConfidenceAlerts = alerts.filter(a => a.confidence >= 80);
  if (highConfidenceAlerts.length > 0) {
    analysis.marketInsights.push({
      type: 'strong_signals',
      message: `${highConfidenceAlerts.length} high-confidence alerts`,
      count: highConfidenceAlerts.length,
      priority: 'high'
    });
  }
  
  const newPairs = alerts.filter(a => a.category === 'new_pair');
  if (newPairs.length > 0) {
    analysis.marketInsights.push({
      type: 'new_opportunities',
      message: `${newPairs.length} new trading pairs`,
      count: newPairs.length,
      priority: 'medium'
    });
  }
  
  // Recommendations
  if (analysis.topTokens.length > 0) {
    const topToken = analysis.topTokens[0];
    analysis.recommendations.push({
      type: 'focus_token',
      message: `Focus on ${topToken.symbol} (score: ${topToken.avgScore}, alerts: ${topToken.count})`,
      action: 'Research trading opportunities',
      priority: 'high'
    });
  }
  
  console.log(`📊 Analysis complete: ${alerts.length} alerts, ${analysis.topTokens.length} top tokens`);
  return analysis;
}

// Generate dashboard summary (optimized)
function generateDashboardSummaryOptimized(alerts, analysis, incrementalCache) {
  const summary = {
    metadata: {
      generatedAt: new Date().toISOString(),
      source: 'wolf-pack-optimized',
      version: '2.0.0',
      optimized: true,
      incremental: CONFIG.useIncrementalUpdates
    },
    snapshot: {
      totalAlerts: analysis.summary.totalAlerts,
      highConfidenceAlerts: analysis.summary.byConfidence.high,
      avgScore: analysis.summary.avgScore,
      lastUpdated: analysis.summary.timestamp,
      performance: 'optimized'
    },
    recentAlerts: alerts.slice(0, 3).map(alert => ({
      timestamp: alert.timestamp,
      category: alert.category,
      symbol: alert.symbol,
      score: alert.score,
      confidence: alert.confidence
    })),
    topTokens: analysis.topTokens.slice(0, 3),
    insights: analysis.marketInsights,
    recommendations: analysis.recommendations.slice(0, 2)
  };
  
  // Add incremental data if available
  if (incrementalCache) {
    summary.incremental = {
      trackedTokens: Object.keys(incrementalCache.lastTokenUpdates).length,
      lastUpdated: incrementalCache.lastUpdated
    };
  }
  
  return summary;
}

// Main execution
async function main() {
  console.log('🐺 Wolf Pack Runner - OPTIMIZED VERSION');
  console.log('='.repeat(50));
  console.log(`⚡ Features: ${CONFIG.parallelParsing ? 'Parallel parsing' : 'Sequential'}, ${CONFIG.useIncrementalUpdates ? 'Incremental updates' : 'Full updates'}`);
  
  const monitor = new PerformanceMonitor();
  const cacheManager = new CacheManager();
  
  try {
    monitor.startPhase('total_execution');
    
    // Load caches
    monitor.startPhase('cache_loading');
    const cache = await cacheManager.loadCache();
    const incrementalCache = await cacheManager.loadIncrementalCache();
    monitor.endPhase('cache_loading');
    
    // Run Wolf Pack script
    const output = await runWolfPackScript(monitor);
    
    // Parse alerts
    monitor.startPhase('alert_parsing');
    const alerts = CONFIG.parallelParsing 
      ? await parseAlertsParallel(output, monitor)
      : parseAlertsSequential(output);
    monitor.endPhase('alert_parsing');
    
    // Merge with cache
    monitor.startPhase('cache_merge');
    const mergedAlerts = cacheManager.mergeAlerts(alerts);
    if (CONFIG.useIncrementalUpdates) {
      cacheManager.updateIncrementalCache(alerts);
    }
    monitor.endPhase('cache_merge');
    
    // Analyze alerts
    monitor.startPhase('analysis');
    const analysis = analyzeAlertsOptimized(mergedAlerts, incrementalCache);
    monitor.endPhase('analysis');
    
    // Generate summary
    monitor.startPhase('summary_generation');
    const summary = generateDashboardSummaryOptimized(mergedAlerts, analysis, incrementalCache);
    monitor.endPhase('summary_generation');
    
    // Save data
    monitor.startPhase('data_saving');
    await fs.writeFile(CONFIG.summaryFile, JSON.stringify(summary, null, 2), 'utf8');
    await cacheManager.saveCache();
    if (CONFIG.useIncrementalUpdates) {
      await cacheManager.saveIncrementalCache();
    }
    
    // Save detailed alerts (only if we have new ones)
    if (alerts.length > 0) {
      const alertFile = path.join(CONFIG.outputDir, `wolf-optimized-${new Date().toISOString().split('T')[0]}.json`);
      await fs.writeFile(alertFile, JSON.stringify({
        metadata: { 
          generatedAt: new Date().toISOString(), 
          alertCount: alerts.length,
          optimized: true 
        },
        alerts: alerts,
        analysis: analysis
      }, null, 2), 'utf8');
      console.log(`💾 Detailed alerts saved: ${alertFile}`);
    }
    monitor.endPhase('data_saving');
    
    // Log performance
    monitor.endPhase('total_execution');
    const metrics = await monitor.logPerformance();
    
    console.log('\n✅ OPTIMIZED Wolf Pack Runner completed successfully!');
    console.log(`📊 Performance metrics:`);
    console.log(`  • Total execution: ${metrics.totalDuration}ms`);
    console.log(`  • Python execution: ${metrics.phases.python_execution?.duration || 0}ms`);
    console.log(`  • Alert parsing: ${metrics.phases.alert_parsing?.duration || 0}ms`);
    console.log(`  • Success: ${metrics.success ? '✅' : '❌'}`);
    
    console.log(`📈 Results:`);
    console.log(`  • Alerts processed: ${mergedAlerts.length} (${alerts.length} new)`);
    console.log(`  • Top token: ${analysis.topTokens[0]?.symbol || 'None'}`);
    console.log(`  • Average score: ${analysis.summary.avgScore}`);
    
    if (incrementalCache) {
      console.log(`  • Incremental tokens: ${Object.keys(incrementalCache.lastTokenUpdates).length}`);
    }
    
    // Check if we met performance goals
    if (metrics.totalDuration > CONFIG.maxExecutionTimeMs) {
      console.warn(`⚠️  Total execution time ${metrics.totalDuration}ms exceeds maximum ${CONFIG.maxExecutionTimeMs}ms`);
    } else if (metrics.totalDuration > CONFIG.warningThresholdMs) {
      console.warn(`⚠️  Total execution time ${metrics.totalDuration}ms exceeds warning threshold ${CONFIG.warningThresholdMs}ms`);
    } else {
      console.log(`🎯 Performance goal met: ${metrics.totalDuration}ms < ${CONFIG.warningThresholdMs}ms`);
    }
    
    return { 
      success: true, 
      alerts: mergedAlerts.length,
      newAlerts: alerts.length,
      performance: metrics,
      optimized: true
    };
    
  } catch (error) {
    monitor.addError(error);
    await monitor.logPerformance();
    
    console.error('❌ OPTIMIZED Wolf Pack Runner failed:', error.message);
    return { 
      success: false, 
      error: error.message,
      optimized: true,
      performance: monitor.getMetrics()
    };
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
  PerformanceMonitor,
  CacheManager,
  parseAlertsSequential,
  analyzeAlertsOptimized,
  main
};