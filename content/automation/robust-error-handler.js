#!/usr/bin/env node

/**
 * Robust Error Handler for iseeiape Automation System
 * Provides advanced error recovery, retry logic, and notification system
 */

const fs = require('fs').promises;
const path = require('path');

class RobustErrorHandler {
  constructor(config = {}) {
    this.config = {
      maxRetries: 3,
      retryDelay: 5000, // 5 seconds
      exponentialBackoff: true,
      notifyOnCritical: true,
      logErrors: true,
      errorLogFile: path.join(__dirname, 'logs', 'error-handler.log'),
      recoveryStrategies: {
        'API_RATE_LIMIT': 'delay_and_retry',
        'NETWORK_ERROR': 'retry_with_backoff',
        'DATA_VALIDATION': 'use_fallback_data',
        'AUTH_ERROR': 'refresh_token',
        'UNKNOWN_ERROR': 'log_and_continue'
      },
      ...config
    };
    
    this.errorCounts = {};
    this.recoveryHistory = [];
  }

  async handleError(error, context = {}) {
    const errorId = this.generateErrorId(error, context);
    const errorType = this.classifyError(error);
    
    // Log error
    if (this.config.logErrors) {
      await this.logError(error, context, errorType, errorId);
    }
    
    // Update error counts
    this.errorCounts[errorType] = (this.errorCounts[errorType] || 0) + 1;
    
    // Check if we should notify
    if (this.config.notifyOnCritical && this.isCriticalError(errorType)) {
      await this.sendNotification(error, context, errorId);
    }
    
    // Get recovery strategy
    const strategy = this.config.recoveryStrategies[errorType] || 'log_and_continue';
    
    // Execute recovery
    const recoveryResult = await this.executeRecovery(strategy, error, context);
    
    // Record recovery attempt
    this.recoveryHistory.push({
      timestamp: new Date().toISOString(),
      errorId,
      errorType,
      strategy,
      success: recoveryResult.success,
      context
    });
    
    return {
      errorId,
      errorType,
      strategy,
      recovered: recoveryResult.success,
      retrySuggested: recoveryResult.retrySuggested,
      fallbackData: recoveryResult.fallbackData,
      nextAction: recoveryResult.nextAction
    };
  }

  generateErrorId(error, context) {
    const timestamp = Date.now();
    const errorCode = error.code || error.name || 'UNKNOWN';
    const contextHash = this.hashString(JSON.stringify(context));
    return `ERR-${timestamp}-${errorCode}-${contextHash.substring(0, 8)}`;
  }

  classifyError(error) {
    // API Errors
    if (error.response) {
      const status = error.response.status;
      if (status === 429) return 'API_RATE_LIMIT';
      if (status === 401 || status === 403) return 'AUTH_ERROR';
      if (status >= 500) return 'API_SERVER_ERROR';
      return 'API_CLIENT_ERROR';
    }
    
    // Network Errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return 'NETWORK_ERROR';
    }
    
    // Data Errors
    if (error.name === 'ValidationError' || error.message?.includes('validation')) {
      return 'DATA_VALIDATION';
    }
    
    // Timeout Errors
    if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
      return 'TIMEOUT_ERROR';
    }
    
    return 'UNKNOWN_ERROR';
  }

  async logError(error, context, errorType, errorId) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      errorId,
      errorType,
      error: {
        message: error.message,
        code: error.code,
        stack: error.stack
      },
      context,
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage()
      }
    };
    
    try {
      await fs.appendFile(
        this.config.errorLogFile,
        JSON.stringify(logEntry) + '\n'
      );
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  isCriticalError(errorType) {
    const criticalErrors = ['AUTH_ERROR', 'API_SERVER_ERROR', 'DATA_CORRUPTION'];
    return criticalErrors.includes(errorType);
  }

  async sendNotification(error, context, errorId) {
    // In a real implementation, this would send to Slack/Telegram/Email
    console.error(`🚨 CRITICAL ERROR: ${errorId}`);
    console.error(`Type: ${this.classifyError(error)}`);
    console.error(`Message: ${error.message}`);
    console.error(`Context:`, context);
    
    // For now, just log to console
    // TODO: Integrate with notification system
  }

  async executeRecovery(strategy, error, context) {
    console.log(`🔄 Executing recovery strategy: ${strategy}`);
    
    switch (strategy) {
      case 'delay_and_retry':
        return await this.delayAndRetry(error, context);
        
      case 'retry_with_backoff':
        return await this.retryWithBackoff(error, context);
        
      case 'use_fallback_data':
        return await this.useFallbackData(error, context);
        
      case 'refresh_token':
        return await this.refreshToken(error, context);
        
      case 'log_and_continue':
        return await this.logAndContinue(error, context);
        
      default:
        return await this.defaultRecovery(error, context);
    }
  }

  async delayAndRetry(error, context) {
    const maxRetries = this.config.maxRetries;
    let lastError = error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`Retry attempt ${attempt}/${maxRetries} after ${this.config.retryDelay}ms delay`);
      
      await this.sleep(this.config.retryDelay);
      
      try {
        // Re-execute the original function if provided
        if (context.retryFunction) {
          const result = await context.retryFunction();
          return {
            success: true,
            retrySuggested: false,
            fallbackData: null,
            nextAction: 'continue',
            attempts: attempt
          };
        }
        
        // If no retry function, just return success
        return {
          success: true,
          retrySuggested: false,
          fallbackData: null,
          nextAction: 'continue',
          attempts: attempt
        };
        
      } catch (retryError) {
        lastError = retryError;
        console.log(`Retry attempt ${attempt} failed:`, retryError.message);
        
        // Exponential backoff
        if (this.config.exponentialBackoff) {
          this.config.retryDelay *= 2;
        }
      }
    }
    
    return {
      success: false,
      retrySuggested: false,
      fallbackData: null,
      nextAction: 'use_fallback',
      lastError: lastError.message,
      attempts: maxRetries
    };
  }

  async retryWithBackoff(error, context) {
    // Similar to delay_and_retry but with exponential backoff
    return await this.delayAndRetry(error, context);
  }

  async useFallbackData(error, context) {
    console.log('🔄 Using fallback data');
    
    try {
      // Try to load cached or backup data
      const fallbackData = await this.loadFallbackData(context);
      
      if (fallbackData) {
        return {
          success: true,
          retrySuggested: false,
          fallbackData,
          nextAction: 'continue_with_fallback'
        };
      }
    } catch (fallbackError) {
      console.error('Failed to load fallback data:', fallbackError);
    }
    
    // If no fallback data, try to generate minimal data
    const minimalData = this.generateMinimalData(context);
    
    return {
      success: !!minimalData,
      retrySuggested: false,
      fallbackData: minimalData,
      nextAction: minimalData ? 'continue_with_minimal' : 'abort'
    };
  }

  async loadFallbackData(context) {
    // Try different fallback sources
    const fallbackSources = [
      path.join(__dirname, '../neo-crypto/data/backups'),
      path.join(__dirname, 'archive'),
      path.join(__dirname, 'output')
    ];
    
    for (const source of fallbackSources) {
      try {
        const files = await fs.readdir(source);
        const recentFiles = files
          .filter(file => file.endsWith('.json'))
          .sort()
          .reverse()
          .slice(0, 3);
        
        for (const file of recentFiles) {
          try {
            const content = await fs.readFile(path.join(source, file), 'utf8');
            const data = JSON.parse(content);
            
            // Check if data is relevant to context
            if (this.isRelevantData(data, context)) {
              console.log(`Loaded fallback data from: ${file}`);
              return data;
            }
          } catch (e) {
            // Skip invalid files
          }
        }
      } catch (e) {
        // Source doesn't exist or can't be read
      }
    }
    
    return null;
  }

  isRelevantData(data, context) {
    // Basic relevance check
    if (context.dataType && data.type) {
      return context.dataType === data.type;
    }
    
    // Check timestamp (within last 24 hours)
    if (data.timestamp) {
      const dataTime = new Date(data.timestamp).getTime();
      const now = Date.now();
      return (now - dataTime) < 24 * 60 * 60 * 1000;
    }
    
    return true; // Accept any data if we're desperate
  }

  generateMinimalData(context) {
    // Generate minimal valid data structure
    return {
      timestamp: new Date().toISOString(),
      type: context.dataType || 'fallback',
      source: 'error_handler',
      data: {
        message: 'Generated from fallback due to error',
        errorContext: context
      }
    };
  }

  async refreshToken(error, context) {
    console.log('🔄 Attempting token refresh');
    
    // In a real implementation, this would refresh API tokens
    // For now, just log and suggest manual intervention
    
    return {
      success: false,
      retrySuggested: true,
      fallbackData: null,
      nextAction: 'manual_intervention',
      message: 'Authentication token may need refresh'
    };
  }

  async logAndContinue(error, context) {
    console.log('📝 Logging error and continuing');
    
    return {
      success: true,
      retrySuggested: false,
      fallbackData: null,
      nextAction: 'continue',
      logged: true
    };
  }

  async defaultRecovery(error, context) {
    console.log('⚙️ Using default recovery');
    
    return {
      success: false,
      retrySuggested: false,
      fallbackData: null,
      nextAction: 'abort',
      message: 'No recovery strategy available'
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  async getErrorReport() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentErrors = this.recoveryHistory.filter(
      entry => new Date(entry.timestamp) > oneDayAgo
    );
    
    const errorTypes = Object.entries(this.errorCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([type, count]) => ({ type, count }));
    
    const successRate = recentErrors.length > 0
      ? (recentErrors.filter(e => e.success).length / recentErrors.length) * 100
      : 100;
    
    return {
      timestamp: now.toISOString(),
      period: '24h',
      totalErrors: recentErrors.length,
      errorTypes,
      recoverySuccessRate: successRate.toFixed(1),
      mostCommonError: errorTypes[0]?.type || 'none',
      recommendations: this.generateReportRecommendations(recentErrors)
    };
  }

  generateReportRecommendations(errors) {
    const recommendations = [];
    
    // Analyze error patterns
    const errorTypeCounts = {};
    errors.forEach(error => {
      errorTypeCounts[error.errorType] = (errorTypeCounts[error.errorType] || 0) + 1;
    });
    
    // Generate recommendations based on patterns
    Object.entries(errorTypeCounts).forEach(([type, count]) => {
      if (type === 'API_RATE_LIMIT' && count > 5) {
        recommendations.push({
          type: 'rate_limit',
          severity: 'high',
          message: `High rate limit errors (${count} in 24h)`,
          suggestion: 'Increase delay between API calls or implement better rate limiting'
        });
      }
      
      if (type === 'NETWORK_ERROR' && count > 3) {
        recommendations.push({
          type: 'network',
          severity: 'medium',
          message: `Frequent network errors (${count} in 24h)`,
          suggestion: 'Add network resilience with multiple API endpoints'
        });
      }
      
      if (type === 'AUTH_ERROR' && count > 0) {
        recommendations.push({
          type: 'auth',
          severity: 'critical',
          message: 'Authentication errors detected',
          suggestion: 'Check API keys and implement automatic token refresh'
        });
      }
    });
    
    return recommendations;
  }

  async cleanupOldLogs(daysToKeep = 7) {
    try {
      const files = await fs.readdir(path.dirname(this.config.errorLogFile));
      const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
      
      for (const file of files) {
        if (file.includes('error-handler') || file.includes('cost-analysis')) {
          const filePath = path.join(path.dirname(this.config.errorLogFile), file);
          const stats = await fs.stat(filePath);
          
          if (stats.mtimeMs < cutoffTime) {
            await fs.unlink(filePath);
            console.log(`Cleaned up old log file: ${file}`);
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning up logs:', error);
    }
  }
}

// Export for use in other scripts
module.exports = RobustErrorHandler;

// Example usage
if (require.main === module) {
  async function example() {
    const errorHandler = new RobustErrorHandler();
    
    // Example 1: Handle a network error
    const networkError = new Error('Connection refused');
    networkError.code = 'ECONNREFUSED';
    
    const result1 = await errorHandler.handleError(networkError, {
      operation: 'fetch_market_data',
      apiEndpoint: 'https://api.dexscreener.com'
    });
    
    console.log('Network error recovery:', result1);
    
    // Example 2: Get error report
    const report = await errorHandler.getErrorReport();
    console.log('\nError Report:', JSON.stringify(report, null, 2));
    
    // Example 3: Cleanup old logs
    await errorHandler.cleanupOldLogs();
  }
  
  example().catch(console.error);
}