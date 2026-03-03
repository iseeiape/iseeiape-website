#!/usr/bin/env node

/**
 * Enhanced Error Handler for iseeiape Automation System
 * 
 * Provides centralized error handling, logging, and recovery mechanisms
 * for the automation pipeline.
 */

const fs = require('fs').promises;
const path = require('path');

class ErrorHandler {
  constructor(config = {}) {
    this.config = {
      logDir: config.logDir || './content/automation/logs',
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 5000, // 5 seconds
      alertThreshold: config.alertThreshold || 5, // Number of consecutive errors before alert
      ...config
    };
    
    this.errorCount = 0;
    this.consecutiveErrors = 0;
    this.errorHistory = [];
    this.alertSent = false;
  }

  /**
   * Log an error with context
   */
  async logError(error, context = {}) {
    const timestamp = new Date().toISOString();
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const errorEntry = {
      id: errorId,
      timestamp,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code,
        name: error.name
      },
      context,
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      }
    };
    
    this.errorCount++;
    this.consecutiveErrors++;
    this.errorHistory.push(errorEntry);
    
    // Keep only last 100 errors in memory
    if (this.errorHistory.length > 100) {
      this.errorHistory = this.errorHistory.slice(-100);
    }
    
    // Write to error log file
    await this.writeErrorLog(errorEntry);
    
    // Check if we need to send an alert
    if (this.consecutiveErrors >= this.config.alertThreshold && !this.alertSent) {
      await this.sendAlert(errorEntry);
      this.alertSent = true;
    }
    
    return errorId;
  }

  /**
   * Write error to log file
   */
  async writeErrorLog(errorEntry) {
    try {
      await fs.mkdir(this.config.logDir, { recursive: true });
      
      const errorLogPath = path.join(this.config.logDir, 'errors.jsonl');
      const logLine = JSON.stringify(errorEntry) + '\n';
      
      await fs.appendFile(errorLogPath, logLine);
      
      // Also write to daily error file
      const date = new Date().toISOString().split('T')[0];
      const dailyLogPath = path.join(this.config.logDir, `errors_${date}.jsonl`);
      await fs.appendFile(dailyLogPath, logLine);
      
      console.error(`❌ Error logged: ${errorEntry.id} - ${errorEntry.error.message}`);
    } catch (logError) {
      console.error('Failed to write error log:', logError);
      // Fallback to console
      console.error('Original error:', errorEntry);
    }
  }

  /**
   * Send alert for critical errors
   */
  async sendAlert(errorEntry) {
    console.error(`🚨 CRITICAL ALERT: ${this.consecutiveErrors} consecutive errors detected!`);
    console.error(`Latest error: ${errorEntry.error.message}`);
    
    // In a production system, this would send:
    // - Email notification
    // - Slack/Telegram message
    // - PagerDuty alert
    
    // For now, just log to a dedicated alert file
    try {
      const alertLogPath = path.join(this.config.logDir, 'alerts.jsonl');
      const alertEntry = {
        ...errorEntry,
        alertType: 'consecutive_errors',
        count: this.consecutiveErrors,
        sentAt: new Date().toISOString()
      };
      
      await fs.appendFile(alertLogPath, JSON.stringify(alertEntry) + '\n');
    } catch (alertError) {
      console.error('Failed to write alert:', alertError);
    }
  }

  /**
   * Reset consecutive error count on successful operation
   */
  resetConsecutiveErrors() {
    this.consecutiveErrors = 0;
    this.alertSent = false;
    console.log('✅ Consecutive errors reset');
  }

  /**
   * Execute a function with retry logic
   */
  async executeWithRetry(fn, context = {}, maxRetries = null) {
    const retries = maxRetries || this.config.maxRetries;
    let lastError = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${retries}...`);
        const result = await fn();
        
        // Reset consecutive errors on success
        if (attempt === 1) {
          this.resetConsecutiveErrors();
        }
        
        return result;
      } catch (error) {
        lastError = error;
        
        // Log the error
        await this.logError(error, {
          ...context,
          attempt,
          maxRetries: retries
        });
        
        // Check if we should retry
        if (attempt < retries) {
          const delay = this.config.retryDelay * attempt; // Exponential backoff
          console.log(`⏳ Retrying in ${delay}ms...`);
          await this.delay(delay);
        }
      }
    }
    
    throw new Error(`Failed after ${retries} attempts. Last error: ${lastError.message}`);
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const last24h = this.errorHistory.filter(err => {
      const errorTime = new Date(err.timestamp).getTime();
      return Date.now() - errorTime < 24 * 60 * 60 * 1000;
    });
    
    const lastHour = last24h.filter(err => {
      const errorTime = new Date(err.timestamp).getTime();
      return Date.now() - errorTime < 60 * 60 * 1000;
    });
    
    // Group by error type
    const errorTypes = {};
    last24h.forEach(err => {
      const type = err.error.name || 'Unknown';
      errorTypes[type] = (errorTypes[type] || 0) + 1;
    });
    
    return {
      totalErrors: this.errorCount,
      consecutiveErrors: this.consecutiveErrors,
      last24h: last24h.length,
      lastHour: lastHour.length,
      errorTypes,
      alertSent: this.alertSent,
      alertThreshold: this.config.alertThreshold
    };
  }

  /**
   * Generate error report
   */
  async generateErrorReport() {
    const stats = this.getErrorStats();
    const report = {
      generatedAt: new Date().toISOString(),
      summary: stats,
      recentErrors: this.errorHistory.slice(-10), // Last 10 errors
      recommendations: this.generateRecommendations(stats)
    };
    
    // Save report to file
    try {
      const reportDir = path.join(this.config.logDir, 'reports');
      await fs.mkdir(reportDir, { recursive: true });
      
      const reportFile = path.join(reportDir, `error_report_${Date.now()}.json`);
      await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
      
      console.log(`📊 Error report saved: ${reportFile}`);
      return report;
    } catch (error) {
      console.error('Failed to save error report:', error);
      return report;
    }
  }

  /**
   * Generate recommendations based on error patterns
   */
  generateRecommendations(stats) {
    const recommendations = [];
    
    if (stats.consecutiveErrors >= stats.alertThreshold) {
      recommendations.push({
        priority: 'high',
        action: 'Investigate system immediately',
        reason: `${stats.consecutiveErrors} consecutive errors detected`
      });
    }
    
    if (stats.lastHour > 10) {
      recommendations.push({
        priority: 'high',
        action: 'Check API rate limits and dependencies',
        reason: `${stats.lastHour} errors in the last hour`
      });
    }
    
    if (stats.errorTypes['NetworkError'] > 5) {
      recommendations.push({
        priority: 'medium',
        action: 'Check network connectivity and API endpoints',
        reason: 'Multiple network errors detected'
      });
    }
    
    if (stats.errorTypes['TimeoutError'] > 3) {
      recommendations.push({
        priority: 'medium',
        action: 'Increase timeout values or optimize slow operations',
        reason: 'Multiple timeout errors detected'
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'low',
        action: 'System operating normally',
        reason: 'No critical error patterns detected'
      });
    }
    
    return recommendations;
  }

  /**
   * Utility delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clean up old error logs
   */
  async cleanupOldLogs(daysToKeep = 7) {
    try {
      const logDir = this.config.logDir;
      const files = await fs.readdir(logDir);
      const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
      
      for (const file of files) {
        if (file.startsWith('errors_') && file.endsWith('.jsonl')) {
          // Extract date from filename: errors_2026-03-01.jsonl
          const dateMatch = file.match(/errors_(\d{4}-\d{2}-\d{2})\.jsonl/);
          if (dateMatch) {
            const fileDate = new Date(dateMatch[1]);
            if (fileDate.getTime() < cutoffTime) {
              const filePath = path.join(logDir, file);
              await fs.unlink(filePath);
              console.log(`🗑️  Deleted old log file: ${file}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning up old logs:', error);
    }
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const errorHandler = new ErrorHandler();
  
  async function main() {
    if (args.includes('--stats')) {
      const stats = errorHandler.getErrorStats();
      console.log('📊 ERROR STATISTICS:');
      console.log('='.repeat(40));
      console.log(`Total errors: ${stats.totalErrors}`);
      console.log(`Consecutive errors: ${stats.consecutiveErrors}`);
      console.log(`Last 24h: ${stats.last24h}`);
      console.log(`Last hour: ${stats.lastHour}`);
      console.log('\nError types:');
      Object.entries(stats.errorTypes).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
      console.log(`\nAlert sent: ${stats.alertSent}`);
      console.log(`Alert threshold: ${stats.alertThreshold}`);
    } else if (args.includes('--report')) {
      const report = await errorHandler.generateErrorReport();
      console.log('📋 ERROR REPORT:');
      console.log('='.repeat(40));
      console.log(`Generated: ${report.generatedAt}`);
      console.log(`\nSummary:`);
      console.log(`  Total errors: ${report.summary.totalErrors}`);
      console.log(`  Consecutive errors: ${report.summary.consecutiveErrors}`);
      console.log(`  Last 24h: ${report.summary.last24h}`);
      console.log(`\nRecommendations:`);
      report.recommendations.forEach(rec => {
        console.log(`  [${rec.priority.toUpperCase()}] ${rec.action}`);
        console.log(`    Reason: ${rec.reason}`);
      });
    } else if (args.includes('--cleanup')) {
      const days = args.includes('--days') ? parseInt(args[args.indexOf('--days') + 1]) : 7;
      await errorHandler.cleanupOldLogs(days);
      console.log(`✅ Cleaned up logs older than ${days} days`);
    } else {
      console.log('Available commands:');
      console.log('  --stats      Show error statistics');
      console.log('  --report     Generate error report');
      console.log('  --cleanup    Clean up old log files');
      console.log('  --days N     With --cleanup: keep logs from last N days');
    }
  }
  
  main().catch(console.error);
}

module.exports = ErrorHandler;