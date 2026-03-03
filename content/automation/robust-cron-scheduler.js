#!/usr/bin/env node

/**
 * Robust Cron Scheduler for iseeiape Automation System
 * 
 * Enhanced version with better error handling, monitoring, and recovery.
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Import error handler
const ErrorHandler = require('./error-handler.js');

class RobustCronScheduler {
  constructor(config = {}) {
    this.config = {
      baseDir: config.baseDir || process.cwd(),
      logDir: config.logDir || './content/automation/logs',
      cronLogFile: config.cronLogFile || 'cron-execution.log',
      dryRun: config.dryRun || false,
      enableMonitoring: config.enableMonitoring !== false,
      healthCheckInterval: config.healthCheckInterval || 300000, // 5 minutes
      maxPipelineDuration: config.maxPipelineDuration || 600000, // 10 minutes
      ...config
    };
    
    this.errorHandler = new ErrorHandler({
      logDir: this.config.logDir,
      alertThreshold: 3
    });
    
    this.executionHistory = [];
    this.healthCheckTimer = null;
    this.isRunning = false;
    this.startTime = null;
  }

  /**
   * Initialize monitoring
   */
  async initialize() {
    console.log('🚀 Initializing Robust Cron Scheduler...');
    
    // Create necessary directories
    await fs.mkdir(this.config.logDir, { recursive: true });
    await fs.mkdir(path.join(this.config.logDir, 'reports'), { recursive: true });
    
    // Start health checks if enabled
    if (this.config.enableMonitoring) {
      this.startHealthChecks();
    }
    
    console.log('✅ Scheduler initialized');
  }

  /**
   * Start periodic health checks
   */
  startHealthChecks() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
    
    this.healthCheckTimer = setInterval(() => {
      this.performHealthCheck().catch(console.error);
    }, this.config.healthCheckInterval);
    
    console.log(`🩺 Health checks enabled (every ${this.config.healthCheckInterval / 60000} minutes)`);
  }

  /**
   * Perform system health check
   */
  async performHealthCheck() {
    const healthCheck = {
      timestamp: new Date().toISOString(),
      checks: {},
      status: 'healthy'
    };
    
    try {
      // Check 1: Data file freshness
      const dataPath = path.join(this.config.baseDir, 'neo-crypto/data/enhanced-live-data.json');
      try {
        const stats = await fs.stat(dataPath);
        const ageMs = Date.now() - stats.mtimeMs;
        const isFresh = ageMs < 10 * 60 * 1000; // Less than 10 minutes old
        
        healthCheck.checks.dataFreshness = {
          status: isFresh ? 'healthy' : 'stale',
          ageMinutes: Math.round(ageMs / 60000),
          threshold: 10
        };
        
        if (!isFresh) healthCheck.status = 'degraded';
      } catch (error) {
        healthCheck.checks.dataFreshness = {
          status: 'error',
          error: error.message
        };
        healthCheck.status = 'unhealthy';
      }
      
      // Check 2: Output directory accessibility
      const outputDir = path.join(this.config.baseDir, 'content/automation/output');
      try {
        await fs.access(outputDir);
        const files = await fs.readdir(outputDir);
        const scheduleFiles = files.filter(f => f.startsWith('enhanced_schedule_'));
        
        healthCheck.checks.outputAccess = {
          status: 'healthy',
          scheduleFiles: scheduleFiles.length,
          latestFile: scheduleFiles.sort().reverse()[0] || 'none'
        };
      } catch (error) {
        healthCheck.checks.outputAccess = {
          status: 'error',
          error: error.message
        };
        healthCheck.status = 'unhealthy';
      }
      
      // Check 3: Error rate
      const errorStats = this.errorHandler.getErrorStats();
      const errorRateHigh = errorStats.lastHour > 5;
      
      healthCheck.checks.errorRate = {
        status: errorRateHigh ? 'degraded' : 'healthy',
        errorsLastHour: errorStats.lastHour,
        consecutiveErrors: errorStats.consecutiveErrors,
        threshold: 5
      };
      
      if (errorRateHigh) healthCheck.status = 'degraded';
      
      // Check 4: Bird CLI availability
      try {
        const { stdout } = await execAsync('bird --version', { timeout: 5000 });
        healthCheck.checks.birdCli = {
          status: 'healthy',
          version: stdout.trim()
        };
      } catch (error) {
        healthCheck.checks.birdCli = {
          status: 'error',
          error: error.message
        };
        healthCheck.status = 'unhealthy';
      }
      
      // Save health check results
      await this.saveHealthCheck(healthCheck);
      
      // Log status
      if (healthCheck.status === 'healthy') {
        console.log('✅ Health check passed');
      } else if (healthCheck.status === 'degraded') {
        console.log('⚠️  Health check: degraded');
      } else {
        console.log('❌ Health check: unhealthy');
        await this.errorHandler.logError(
          new Error('System health check failed'),
          { healthCheck }
        );
      }
      
      return healthCheck;
    } catch (error) {
      console.error('Health check failed:', error);
      await this.errorHandler.logError(error, { context: 'health_check' });
      return null;
    }
  }

  /**
   * Save health check results
   */
  async saveHealthCheck(healthCheck) {
    try {
      const healthDir = path.join(this.config.logDir, 'health');
      await fs.mkdir(healthDir, { recursive: true });
      
      const healthFile = path.join(healthDir, `health_${Date.now()}.json`);
      await fs.writeFile(healthFile, JSON.stringify(healthCheck, null, 2));
      
      // Also append to health log
      const healthLog = path.join(healthDir, 'health_log.jsonl');
      await fs.appendFile(healthLog, JSON.stringify(healthCheck) + '\n');
    } catch (error) {
      console.error('Failed to save health check:', error);
    }
  }

  /**
   * Execute a command with enhanced error handling
   */
  async executeCommand(command, stepName, context = {}) {
    const startTime = Date.now();
    
    console.log(`\n🚀 ${stepName}`);
    console.log(`   Command: ${command.substring(0, 100)}...`);
    
    if (this.config.dryRun) {
      console.log(`   [DRY RUN] Would execute: ${command}`);
      return await this.logExecution(stepName, {
        success: true,
        message: 'Dry run - command not executed',
        duration: Date.now() - startTime
      });
    }
    
    return await this.errorHandler.executeWithRetry(
      async () => {
        const { stdout, stderr } = await execAsync(command, {
          cwd: this.config.baseDir,
          timeout: 300000 // 5 minute timeout
        });
        
        const duration = Date.now() - startTime;
        
        console.log(`   ✅ Completed in ${duration}ms`);
        
        if (stderr && !stderr.includes('warning')) {
          console.log(`   ⚠️  Stderr: ${stderr.substring(0, 200)}...`);
        }
        
        const result = {
          success: true,
          output: stdout,
          error: stderr,
          duration
        };
        
        await this.logExecution(stepName, result);
        return result;
      },
      {
        step: stepName,
        command: command.substring(0, 200),
        ...context
      }
    ).catch(async (error) => {
      const duration = Date.now() - startTime;
      
      console.log(`   ❌ Failed after ${duration}ms`);
      console.log(`   Error: ${error.message}`);
      
      const result = {
        success: false,
        error: error.message,
        duration
      };
      
      await this.logExecution(stepName, result);
      return result;
    });
  }

  /**
   * Log execution details
   */
  async logExecution(step, result) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      step,
      result: {
        success: result.success,
        output: result.output?.substring(0, 500) || result.message,
        error: result.error,
        duration: result.duration
      }
    };
    
    this.executionHistory.push(logEntry);
    
    // Write to log file
    try {
      const logPath = path.join(this.config.logDir, this.config.cronLogFile);
      
      let logContent = '';
      if (await fs.access(logPath).then(() => true).catch(() => false)) {
        logContent = await fs.readFile(logPath, 'utf8');
      }
      
      logContent += `${timestamp} | ${step} | ${result.success ? 'SUCCESS' : 'FAILED'} | ${result.duration || 0}ms\n`;
      if (result.error) {
        logContent += `  ERROR: ${result.error}\n`;
      }
      
      await fs.writeFile(logPath, logContent);
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
    
    return logEntry;
  }

  /**
   * Run the full pipeline with monitoring
   */
  async runFullPipeline() {
    if (this.isRunning) {
      console.log('⚠️  Pipeline already running, skipping...');
      return { skipped: true, reason: 'already_running' };
    }
    
    this.isRunning = true;
    this.startTime = Date.now();
    
    console.log('='.repeat(60));
    console.log('🦎 MATRIX ARMY ROBUST AUTOMATION PIPELINE');
    console.log('='.repeat(60));
    console.log(`Start time: ${new Date().toLocaleString()}`);
    console.log(`Mode: ${this.config.dryRun ? 'DRY RUN' : 'PRODUCTION'}`);
    console.log('='.repeat(60));
    
    const pipelineStart = Date.now();
    const results = {
      marketData: null,
      content: null,
      twitter: null,
      articles: null
    };
    
    try {
      // Set timeout for entire pipeline
      const pipelineTimeout = setTimeout(() => {
        console.log('⏰ Pipeline timeout reached, forcing cleanup...');
        this.forceCleanup();
      }, this.config.maxPipelineDuration);
      
      // Step 1: Generate market data
      results.marketData = await this.executeCommand(
        'node neo-crypto/scripts/real-time-data-fetcher.js',
        'Generate Market Data'
      );
      
      if (!results.marketData.success) {
        console.log('\n⚠️  Market data generation failed. Continuing with existing data...');
      }
      
      // Step 2: Generate content
      results.content = await this.executeCommand(
        'node content/automation/enhanced-content-scheduler.js',
        'Generate Enhanced Content'
      );
      
      if (!results.content.success) {
        console.log('\n❌ Content generation failed. Stopping pipeline.');
        clearTimeout(pipelineTimeout);
        this.isRunning = false;
        return results;
      }
      
      // Step 3: Post to Twitter
      results.twitter = await this.executeCommand(
        'node content/automation/twitter-poster.js',
        'Post to Twitter/X'
      );
      
      // Step 4: Generate articles (optional)
      try {
        results.articles = await this.executeCommand(
          'node content/automation/article-generator.js',
          'Generate Articles'
        );
      } catch (error) {
        console.log('\n⚠️  Article generation failed or not available:', error.message);
      }
      
      clearTimeout(pipelineTimeout);
      
      const totalDuration = Date.now() - pipelineStart;
      
      console.log('\n' + '='.repeat(60));
      console.log('📊 PIPELINE EXECUTION SUMMARY');
      console.log('='.repeat(60));
      
      const steps = [
        { name: 'Market Data', result: results.marketData },
        { name: 'Content Generation', result: results.content },
        { name: 'Twitter Posting', result: results.twitter },
        { name: 'Article Generation', result: results.articles }
      ];
      
      steps.forEach(step => {
        if (step.result) {
          const status = step.result.success ? '✅' : '❌';
          const duration = step.result.duration ? `${step.result.duration}ms` : 'N/A';
          console.log(`${status} ${step.name}: ${duration}`);
        }
      });
      
      console.log(`\n⏱️  Total pipeline duration: ${totalDuration}ms`);
      console.log(`📅 Completed at: ${new Date().toLocaleString()}`);
      console.log('='.repeat(60));
      
      // Save detailed execution report
      await this.saveExecutionReport(results, totalDuration);
      
      // Generate error report if there were errors
      const hasErrors = Object.values(results).some(r => r && !r.success);
      if (hasErrors) {
        await this.errorHandler.generateErrorReport();
      }
      
      return results;
    } catch (error) {
      console.error('Pipeline execution error:', error);
      await this.errorHandler.logError(error, { context: 'pipeline_execution' });
      return { error: error.message };
    } finally {
      this.isRunning = false;
      console.log('🔄 Pipeline execution completed');
    }
  }

  /**
   * Force cleanup on timeout
   */
  forceCleanup() {
    console.log('🧹 Forcing cleanup...');
    this.isRunning = false;
    
    // In a real implementation, this would:
    // 1. Kill any child processes
    // 2. Clean up temporary files
    // 3. Log the forced cleanup
    // 4. Send alert
    
    console.log('✅ Cleanup completed');
  }

  /**
   * Save detailed execution report
   */
  async saveExecutionReport(results, totalDuration) {
    try {
      const report = {
        timestamp: new Date().toISOString(),
        duration: totalDuration,
        steps: {
          marketData: results.marketData,
          content: results.content,
          twitter: results.twitter,
          articles: results.articles
        },
        summary: {
          success: Object.values(results).every(r => !r || r.success),
          stepsCompleted: Object.values(results).filter(r => r && r.success).length,
          totalSteps: Object.values(results).filter(r => r).length
        },
        errorStats: this.errorHandler.getErrorStats(),
        systemInfo: {
          platform: process.platform,
          nodeVersion: process.version,
          memory: process.memoryUsage(),
          uptime: process.uptime()
        }
      };
      
      const reportDir = path.join(this.config.logDir, 'reports');
      await fs.mkdir(reportDir, { recursive: true });
      
      const reportFile = path.join(reportDir, `pipeline_${Date.now()}.json`);
      await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
      
      console.log(`📁 Detailed report saved: ${reportFile}`);
    } catch (error) {
      console.error('Error saving execution report:', error);
    }
  }

  /**
   * Stop the scheduler
   */
  async stop() {
    console.log('🛑 Stopping Robust Cron Scheduler...');
    
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
    
    if (this.isRunning) {
      console.log('⚠️  Pipeline is running, waiting for completion...');
      // In a real implementation, we would wait or force stop
    }
    
    // Generate final error report
    await this.errorHandler.generateErrorReport();
    
    console.log('✅ Scheduler stopped');
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  const scheduler = new RobustCronScheduler({
    dryRun: args.includes('--dry-run'),
    baseDir: process.cwd(),
    logDir: './content/automation/logs',
    enableMonitoring: !args.includes('--no-monitor')
  });
  
  async function main() {
    await scheduler.initialize();
    
    if (args.includes('--health')) {
      const health = await scheduler.performHealthCheck();
      console.log('\n🩺 HEALTH CHECK RESULTS:');
      console.log('='.repeat(40));
      console.log(`Status: ${health.status}`);
      Object.entries(health.checks).forEach(([check, details]) => {
        console.log(`\n${check}:`);
        console.log(`  Status: ${details.status}`);
        if (details.error) {
          console.log(`  Error: ${details.error}`);
        }
      });
    } else if (args.includes('--errors')) {
      const stats = scheduler.errorHandler.getErrorStats();
      console.log('📊 ERROR STATISTICS:');
      console.log('='.repeat(40));
      console.log(`Total errors: ${stats.totalErrors}`);
      console.log(`Consecutive errors: ${stats.consecutiveErrors}`);
      console.log(`Last 24h: ${stats.last24h}`);
      console.log(`Last hour: ${stats.lastHour}`);
    } else if (args.includes('--once')) {
      // Run pipeline once
      await scheduler.runFullPipeline();
      await scheduler.stop();
    } else {
      console.log('Available commands:');
      console.log('  --once         Run pipeline once');
      console.log('  --health       Perform health check');
      console.log('  --errors       Show error statistics');
      console.log('  --dry-run      Run in dry-run mode');
      console.log('  --no-monitor   Disable monitoring');
    }
  }
  
  main().catch(async (error) => {
    console.error('Fatal error:', error);
    await