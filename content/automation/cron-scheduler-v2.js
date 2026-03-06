#!/usr/bin/env node

/**
 * Cron Job Scheduler v2 for iseeiape Automation System
 * 
 * Enhanced version with:
 * 1. Better error handling
 * 2. Step dependencies
 * 3. Health checks
 * 4. Performance monitoring
 * 
 * This script manages the entire automation pipeline:
 * 1. Generate fresh market data (using enhanced fetcher)
 * 2. Generate content based on data
 * 3. Post content to Twitter/X
 * 4. Generate articles for website
 * 
 * Can be run manually or via system cron.
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class EnhancedCronScheduler {
  constructor(config = {}) {
    this.config = {
      baseDir: config.baseDir || process.cwd(),
      logDir: config.logDir || './content/automation/logs',
      cronLogFile: config.cronLogFile || 'cron-execution-v2.log',
      dataFile: config.dataFile || './neo-crypto/data/enhanced-live-data.json',
      dryRun: config.dryRun || false,
      verbose: config.verbose || false,
      ...config
    };
    
    this.executionHistory = [];
    this.systemStatus = {
      lastDataUpdate: null,
      lastContentGeneration: null,
      lastTwitterPost: null,
      lastArticleGeneration: null,
      errors: [],
      warnings: []
    };
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
        duration: result.duration,
        warnings: result.warnings || []
      }
    };
    
    this.executionHistory.push(logEntry);
    
    // Write to log file
    const logLine = `${timestamp} | ${step} | ${result.success ? 'SUCCESS' : 'FAILED'} | ${result.duration}ms\n`;
    
    try {
      await fs.mkdir(this.config.logDir, { recursive: true });
      await fs.appendFile(path.join(this.config.logDir, this.config.cronLogFile), logLine);
      
      if (this.config.verbose) {
        console.log(`📝 ${step}: ${result.success ? '✅' : '❌'} (${result.duration}ms)`);
        if (result.warnings?.length > 0) {
          result.warnings.forEach(warning => console.log(`   ⚠️  ${warning}`));
        }
      }
    } catch (error) {
      console.error('❌ Failed to write log:', error.message);
    }
    
    return logEntry;
  }

  /**
   * Execute command with timeout and error handling
   */
  async executeCommand(command, stepName, timeout = 30000) {
    const startTime = Date.now();
    const warnings = [];
    
    if (this.config.dryRun) {
      console.log(`🧪 DRY RUN: ${stepName}`);
      console.log(`   Command: ${command}`);
      return {
        success: true,
        output: 'Dry run - no execution',
        duration: Date.now() - startTime,
        warnings: ['Dry run mode']
      };
    }
    
    try {
      console.log(`🚀 ${stepName}`);
      console.log(`   Command: ${command}`);
      
      const { stdout, stderr } = await execAsync(command, {
        cwd: this.config.baseDir,
        timeout,
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });
      
      const duration = Date.now() - startTime;
      
      // Check for warnings in stderr
      if (stderr) {
        const stderrLines = stderr.split('\n').filter(line => line.trim());
        stderrLines.forEach(line => {
          if (line.includes('warning') || line.includes('⚠️') || line.includes('rate limit')) {
            warnings.push(line);
          } else if (!line.includes('✅') && !line.includes('🚀')) {
            // Non-warning stderr
            console.log(`   ⚠️  Stderr: ${line}`);
          }
        });
      }
      
      // Update system status
      if (stepName === 'Generate Market Data') {
        this.systemStatus.lastDataUpdate = new Date().toISOString();
      } else if (stepName === 'Generate Enhanced Content') {
        this.systemStatus.lastContentGeneration = new Date().toISOString();
      } else if (stepName === 'Post to Twitter') {
        this.systemStatus.lastTwitterPost = new Date().toISOString();
      } else if (stepName === 'Generate Articles') {
        this.systemStatus.lastArticleGeneration = new Date().toISOString();
      }
      
      return {
        success: true,
        output: stdout,
        error: null,
        duration,
        warnings
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ ${stepName} failed:`, error.message);
      
      // Add to system errors
      this.systemStatus.errors.push({
        step: stepName,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      return {
        success: false,
        output: null,
        error: error.message,
        duration,
        warnings
      };
    }
  }

  /**
   * Step 1: Generate fresh market data using enhanced fetcher
   */
  async generateMarketData() {
    const command = 'node neo-crypto/scripts/real-time-data-fetcher-v2.js';
    return await this.executeCommand(command, 'Generate Market Data');
  }

  /**
   * Step 2: Generate enhanced content
   */
  async generateEnhancedContent() {
    // First check if we have fresh data
    try {
      const data = await fs.readFile(this.config.dataFile, 'utf8');
      const marketData = JSON.parse(data);
      
      const dataAge = Date.now() - new Date(marketData.timestamp).getTime();
      const maxAge = 30 * 60 * 1000; // 30 minutes
      
      if (dataAge > maxAge) {
        console.log(`⚠️  Market data is ${Math.round(dataAge / 60000)} minutes old`);
        this.systemStatus.warnings.push(`Market data is ${Math.round(dataAge / 60000)} minutes old`);
      }
    } catch (error) {
      console.log('⚠️  Could not read market data file');
      this.systemStatus.warnings.push('Could not read market data file');
    }
    
    const command = 'node content/automation/enhanced-content-scheduler.js';
    return await this.executeCommand(command, 'Generate Enhanced Content');
  }

  /**
   * Step 3: Post to Twitter/X
   */
  async postToTwitter() {
    const command = 'node content/automation/twitter-poster.js';
    return await this.executeCommand(command, 'Post to Twitter');
  }

  /**
   * Step 4: Generate articles
   */
  async generateArticles() {
    const command = 'node content/automation/article-generator.js';
    return await this.executeCommand(command, 'Generate Articles');
  }

  /**
   * Health check
   */
  async healthCheck() {
    console.log('🏥 Running health check...');
    
    const checks = [];
    
    // Check data file exists and is recent
    try {
      const data = await fs.readFile(this.config.dataFile, 'utf8');
      const marketData = JSON.parse(data);
      const dataAge = Date.now() - new Date(marketData.timestamp).getTime();
      
      checks.push({
        name: 'Market Data Freshness',
        status: dataAge < 60 * 60 * 1000 ? 'healthy' : 'warning',
        message: `Data is ${Math.round(dataAge / 60000)} minutes old`,
        age: dataAge
      });
    } catch (error) {
      checks.push({
        name: 'Market Data File',
        status: 'error',
        message: 'Could not read data file',
        error: error.message
      });
    }
    
    // Check log directory
    try {
      await fs.access(this.config.logDir);
      const logs = await fs.readdir(this.config.logDir);
      checks.push({
        name: 'Log Directory',
        status: 'healthy',
        message: `${logs.length} log files found`
      });
    } catch (error) {
      checks.push({
        name: 'Log Directory',
        status: 'warning',
        message: 'Log directory not accessible'
      });
    }
    
    // Print health check results
    console.log('\n📊 HEALTH CHECK RESULTS:');
    console.log('==================================================');
    
    checks.forEach(check => {
      const emoji = check.status === 'healthy' ? '✅' : 
                   check.status === 'warning' ? '⚠️' : '❌';
      console.log(`${emoji} ${check.name}: ${check.message}`);
    });
    
    console.log('==================================================\n');
    
    return {
      success: checks.every(c => c.status !== 'error'),
      checks,
      systemStatus: this.systemStatus
    };
  }

  /**
   * Run specific step or all steps
   */
  async run(step = null) {
    console.log('🎯 Enhanced Cron Scheduler v2');
    console.log('==================================================\n');
    
    const startTime = Date.now();
    
    try {
      if (step) {
        console.log(`Running single step: ${step}\n`);
        
        switch (step.toLowerCase()) {
          case 'data':
            await this.generateMarketData();
            break;
          case 'content':
            await this.generateEnhancedContent();
            break;
          case 'twitter':
            await this.postToTwitter();
            break;
          case 'articles':
            await this.generateArticles();
            break;
          case 'health':
            await this.healthCheck();
            break;
          default:
            console.error(`❌ Unknown step: ${step}`);
            console.log('Available steps: data, content, twitter, articles, health');
            return;
        }
      } else {
        console.log('Running full automation pipeline...\n');
        
        // Run all steps in sequence
        const dataResult = await this.generateMarketData();
        await this.logExecution('Generate Market Data', dataResult);
        
        if (dataResult.success) {
          const contentResult = await this.generateEnhancedContent();
          await this.logExecution('Generate Enhanced Content', contentResult);
          
          const twitterResult = await this.postToTwitter();
          await this.logExecution('Post to Twitter', twitterResult);
          
          // Articles only run once per day (check time)
          const now = new Date();
          if (now.getUTCHours() === 3) { // 3 AM UTC
            const articleResult = await this.generateArticles();
            await this.logExecution('Generate Articles', articleResult);
          } else {
            console.log('⏰ Not time for article generation (runs at 3 AM UTC)');
          }
        } else {
          console.log('⚠️  Skipping content generation due to data fetch failure');
          this.systemStatus.warnings.push('Skipped content generation due to data fetch failure');
        }
      }
      
      // Run health check at the end
      const healthResult = await this.healthCheck();
      await this.logExecution('Health Check', {
        success: healthResult.success,
        output: JSON.stringify(healthResult.checks),
        duration: Date.now() - startTime
      });
      
      const totalDuration = Date.now() - startTime;
      console.log(`\n✅ Automation completed in ${totalDuration}ms`);
      
      // Print summary
      this.printSummary();
      
    } catch (error) {
      console.error('❌ Automation pipeline failed:', error.message);
      await this.logExecution('Pipeline Error', {
        success: false,
        error: error.message,
        duration: Date.now() - startTime
      });
    }
  }

  /**
   * Print execution summary
   */
  printSummary() {
    console.log('\n📋 EXECUTION SUMMARY:');
    console.log('==================================================');
    
    const successful = this.executionHistory.filter(h => h.result.success).length;
    const failed = this.executionHistory.filter(h => !h.result.success).length;
    
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (this.systemStatus.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${this.systemStatus.warnings.length}):`);
      this.systemStatus.warnings.forEach((warning, i) => {
        console.log(`   ${i + 1}. ${warning}`);
      });
    }
    
    if (this.systemStatus.errors.length > 0) {
      console.log(`\n❌ Errors (${this.systemStatus.errors.length}):`);
      this.systemStatus.errors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error.step}: ${error.error}`);
      });
    }
    
    console.log('\n🕐 Last Updates:');
    if (this.systemStatus.lastDataUpdate) {
      console.log(`   Data: ${new Date(this.systemStatus.lastDataUpdate).toLocaleString()}`);
    }
    if (this.systemStatus.lastContentGeneration) {
      console.log(`   Content: ${new Date(this.systemStatus.lastContentGeneration).toLocaleString()}`);
    }
    if (this.systemStatus.lastTwitterPost) {
      console.log(`   Twitter: ${new Date(this.systemStatus.lastTwitterPost).toLocaleString()}`);
    }
    
    console.log('==================================================\n');
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  
  const config = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    dryRun: args.includes('--dry-run')
  };
  
  // Extract step from args
  let step = null;
  const stepArg = args.find(arg => arg.startsWith('--step='));
  if (stepArg) {
    step = stepArg.split('=')[1];
  } else if (args.length > 0 && !args[0].startsWith('--')) {
    step = args[0];
  }
  
  const scheduler = new EnhancedCronScheduler(config);
  await scheduler.run(step);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

// Run the scheduler
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = EnhancedCronScheduler;