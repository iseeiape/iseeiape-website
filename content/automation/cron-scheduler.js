#!/usr/bin/env node

/**
 * Cron Job Scheduler for iseeiape Automation System
 * 
 * This script manages the entire automation pipeline:
 * 1. Generate fresh market data
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

class CronScheduler {
  constructor(config = {}) {
    this.config = {
      baseDir: config.baseDir || process.cwd(),
      logDir: config.logDir || './content/automation/logs',
      cronLogFile: config.cronLogFile || 'cron-execution.log',
      dryRun: config.dryRun || false,
      ...config
    };
    
    this.executionHistory = [];
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
      await fs.mkdir(this.config.logDir, { recursive: true });
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
   * Execute a command and log results
   */
  async executeCommand(command, stepName) {
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
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: this.config.baseDir,
        timeout: 300000 // 5 minute timeout
      });
      
      const duration = Date.now() - startTime;
      
      console.log(`   ✅ Completed in ${duration}ms`);
      
      if (stderr && !stderr.includes('warning')) {
        console.log(`   ⚠️  Stderr: ${stderr.substring(0, 200)}...`);
      }
      
      return await this.logExecution(stepName, {
        success: true,
        output: stdout,
        error: stderr,
        duration
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      
      console.log(`   ❌ Failed after ${duration}ms`);
      console.log(`   Error: ${error.message}`);
      
      return await this.logExecution(stepName, {
        success: false,
        error: error.message,
        output: error.stdout,
        duration
      });
    }
  }

  /**
   * Step 1: Generate fresh market data
   */
  async generateMarketData() {
    const command = 'node neo-crypto/scripts/real-time-data-fetcher.js';
    return await this.executeCommand(command, 'Generate Market Data');
  }

  /**
   * Step 2: Generate enhanced content
   */
  async generateEnhancedContent() {
    const command = 'node content/automation/enhanced-content-scheduler.js';
    return await this.executeCommand(command, 'Generate Enhanced Content');
  }

  /**
   * Step 3: Post to Twitter/X
   */
  async postToTwitter() {
    const command = 'node content/automation/twitter-poster.js';
    return await this.executeCommand(command, 'Post to Twitter/X');
  }

  /**
   * Step 4: Generate articles
   */
  async generateArticles() {
    const command = 'node content/automation/article-generator.js';
    return await this.executeCommand(command, 'Generate Articles');
  }

  /**
   * Run the full pipeline
   */
  async runFullPipeline() {
    console.log('='.repeat(60));
    console.log('🦎 MATRIX ARMY AUTOMATION PIPELINE');
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
    
    // Step 1: Generate market data
    results.marketData = await this.generateMarketData();
    if (!results.marketData.success) {
      console.log('\n⚠️  Market data generation failed. Continuing with existing data...');
    }
    
    // Step 2: Generate content
    results.content = await this.generateEnhancedContent();
    if (!results.content.success) {
      console.log('\n❌ Content generation failed. Stopping pipeline.');
      return results;
    }
    
    // Step 3: Post to Twitter
    results.twitter = await this.postToTwitter();
    
    // Step 4: Generate articles (optional)
    try {
      results.articles = await this.generateArticles();
    } catch (error) {
      console.log('\n⚠️  Article generation failed or not available:', error.message);
    }
    
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
    
    return results;
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
   * Run a specific step only
   */
  async runStep(stepName) {
    console.log(`\n🎯 Running single step: ${stepName}`);
    
    switch (stepName.toLowerCase()) {
      case 'data':
      case 'marketdata':
        return await this.generateMarketData();
      
      case 'content':
      case 'generate':
        return await this.generateEnhancedContent();
      
      case 'twitter':
      case 'post':
        return await this.postToTwitter();
      
      case 'articles':
      case 'article':
        return await this.generateArticles();
      
      default:
        console.log(`❌ Unknown step: ${stepName}`);
        console.log('Available steps: data, content, twitter, articles');
        return null;
    }
  }

  /**
   * Show execution history
   */
  async showHistory(limit = 10) {
    try {
      const logPath = path.join(this.config.logDir, this.config.cronLogFile);
      
      if (await fs.access(logPath).then(() => true).catch(() => false)) {
        const logContent = await fs.readFile(logPath, 'utf8');
        const lines = logContent.trim().split('\n').reverse();
        
        console.log('\n📜 EXECUTION HISTORY (latest first)');
        console.log('='.repeat(80));
        
        lines.slice(0, limit).forEach(line => {
          console.log(line);
        });
        
        if (lines.length > limit) {
          console.log(`... and ${lines.length - limit} more entries`);
        }
      } else {
        console.log('No execution history found.');
      }
    } catch (error) {
      console.error('Error reading history:', error);
    }
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  const scheduler = new CronScheduler({
    dryRun: args.includes('--dry-run'),
    baseDir: process.cwd(),
    logDir: './content/automation/logs'
  });
  
  async function main() {
    if (args.includes('--step')) {
      const stepIndex = args.indexOf('--step');
      if (stepIndex + 1 < args.length) {
        const stepName = args[stepIndex + 1];
        await scheduler.runStep(stepName);
      } else {
        console.log('Please specify a step name: --step <data|content|twitter|articles>');
      }
    } else if (args.includes('--history')) {
      const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : 10;
      await scheduler.showHistory(limit);
    } else if (args.includes('--test')) {
      console.log('🧪 Running test pipeline...');
      scheduler.config.dryRun = true;
      await scheduler.runFullPipeline();
    } else {
      // Run full pipeline
      const results = await scheduler.runFullPipeline();
      
      // Check if pipeline was successful
      // Content generation is critical, market data can use cached data
      const successful = results && 
        results.content && results.content.success;
      
      if (!successful) {
        console.error('\n❌ Pipeline execution failed!');
        process.exit(1);
      }
    }
  }
  
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = CronScheduler;