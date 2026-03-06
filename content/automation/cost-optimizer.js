#!/usr/bin/env node

/**
 * Cost Optimizer for iseeiape Content Automation
 * Analyzes AI model usage and suggests optimizations to reduce costs
 */

const fs = require('fs').promises;
const path = require('path');

// Cost per 1k tokens for different models (approximate)
const MODEL_COSTS = {
  // Cheap models for simple tasks
  'claude-3-haiku': 0.00025, // $0.25 per 1M tokens
  'gpt-3.5-turbo': 0.0005,   // $0.50 per 1M tokens
  'deepseek-chat': 0.00014,  // $0.14 per 1M tokens
  
  // Mid-range models
  'claude-3-sonnet': 0.003,  // $3 per 1M tokens
  'gpt-4-turbo': 0.01,       // $10 per 1M tokens
  
  // Expensive models (avoid for automation)
  'claude-3-opus': 0.015,    // $15 per 1M tokens
  'gpt-4': 0.03,             // $30 per 1M tokens
};

// Task complexity mapping
const TASK_COMPLEXITY = {
  'whale-alert': 'low',
  'trend-alert': 'low',
  'market-update': 'medium',
  'educational': 'medium',
  'technical-analysis': 'high',
  'sentiment-report': 'high',
  'article-generation': 'high'
};

// Recommended models for each complexity
const RECOMMENDED_MODELS = {
  'low': ['claude-3-haiku', 'deepseek-chat', 'gpt-3.5-turbo'],
  'medium': ['claude-3-sonnet', 'gpt-4-turbo'],
  'high': ['claude-3-sonnet', 'gpt-4-turbo'] // Only use expensive when necessary
};

class CostOptimizer {
  constructor() {
    this.logsDir = path.join(__dirname, 'logs');
    this.outputDir = path.join(__dirname, 'output');
    this.archiveDir = path.join(__dirname, 'archive');
  }

  async analyzeCosts() {
    console.log('🔍 Analyzing automation costs...\n');
    
    try {
      // Read recent logs to analyze usage
      const logs = await this.readRecentLogs();
      const contentStats = await this.analyzeContentStats();
      
      const analysis = {
        timestamp: new Date().toISOString(),
        totalPosts: logs.length,
        estimatedCosts: this.estimateCosts(logs),
        modelUsage: this.analyzeModelUsage(logs),
        recommendations: this.generateRecommendations(logs, contentStats),
        potentialSavings: this.calculateSavings(logs)
      };
      
      await this.saveAnalysis(analysis);
      this.printAnalysis(analysis);
      
      return analysis;
      
    } catch (error) {
      console.error('Error analyzing costs:', error);
      return null;
    }
  }

  async readRecentLogs() {
    const logs = [];
    const logFiles = await fs.readdir(this.logsDir);
    
    // Read last 7 days of logs
    const recentLogs = logFiles
      .filter(file => file.endsWith('.log') || file.endsWith('.json'))
      .slice(-10); // Last 10 files
    
    for (const file of recentLogs) {
      try {
        const content = await fs.readFile(path.join(this.logsDir, file), 'utf8');
        const lines = content.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const log = JSON.parse(line);
            if (log.type && log.timestamp) {
              logs.push(log);
            }
          } catch (e) {
            // Skip non-JSON lines
          }
        }
      } catch (error) {
        console.warn(`Could not read log file ${file}:`, error.message);
      }
    }
    
    return logs;
  }

  async analyzeContentStats() {
    const stats = {
      byType: {},
      qualityScores: [],
      engagement: []
    };
    
    try {
      // Read output files to analyze content quality
      const outputFiles = await fs.readdir(this.outputDir);
      const jsonFiles = outputFiles.filter(file => file.endsWith('.json')).slice(-20);
      
      for (const file of jsonFiles) {
        try {
          const content = await fs.readFile(path.join(this.outputDir, file), 'utf8');
          const data = JSON.parse(content);
          
          if (data.type) {
            stats.byType[data.type] = (stats.byType[data.type] || 0) + 1;
          }
          
          if (data.qualityScore) {
            stats.qualityScores.push(data.qualityScore);
          }
        } catch (error) {
          // Skip invalid files
        }
      }
    } catch (error) {
      // Output directory might not exist
    }
    
    return stats;
  }

  estimateCosts(logs) {
    const estimates = {
      total: 0,
      byType: {},
      byModel: {},
      dailyAverage: 0
    };
    
    // Group logs by type and estimate token usage
    logs.forEach(log => {
      const type = log.type || 'unknown';
      const model = log.model || 'deepseek-chat'; // Default assumption
      const complexity = TASK_COMPLEXITY[type] || 'medium';
      
      // Estimate tokens based on complexity
      let tokens = 500; // Default
      if (complexity === 'low') tokens = 300;
      if (complexity === 'high') tokens = 1000;
      
      // Estimate cost
      const costPerToken = MODEL_COSTS[model] || MODEL_COSTS['deepseek-chat'];
      const cost = (tokens / 1000) * costPerToken;
      
      estimates.total += cost;
      estimates.byType[type] = (estimates.byType[type] || 0) + cost;
      estimates.byModel[model] = (estimates.byModel[model] || 0) + cost;
    });
    
    // Calculate daily average (assuming logs cover ~7 days)
    estimates.dailyAverage = estimates.total / 7;
    
    return estimates;
  }

  analyzeModelUsage(logs) {
    const usage = {};
    
    logs.forEach(log => {
      const model = log.model || 'deepseek-chat';
      const type = log.type || 'unknown';
      
      if (!usage[model]) {
        usage[model] = { count: 0, types: new Set() };
      }
      
      usage[model].count++;
      usage[model].types.add(type);
    });
    
    return usage;
  }

  generateRecommendations(logs, contentStats) {
    const recommendations = [];
    
    // 1. Check for expensive model usage
    const modelUsage = this.analyzeModelUsage(logs);
    Object.entries(modelUsage).forEach(([model, data]) => {
      const cost = MODEL_COSTS[model];
      if (cost > MODEL_COSTS['claude-3-sonnet']) {
        recommendations.push({
          type: 'high-cost-model',
          severity: 'high',
          message: `Using expensive model ${model} for ${data.count} tasks`,
          suggestion: `Switch to cheaper model like claude-3-haiku or deepseek-chat for these tasks`,
          estimatedSavings: data.count * 0.01 // Rough estimate
        });
      }
    });
    
    // 2. Check content type distribution
    const typeDistribution = {};
    logs.forEach(log => {
      const type = log.type || 'unknown';
      typeDistribution[type] = (typeDistribution[type] || 0) + 1;
    });
    
    // Find low-engagement content types (if we had engagement data)
    const highCostTypes = ['sentiment-report', 'technical-analysis'];
    highCostTypes.forEach(type => {
      if (typeDistribution[type] > 10) { // If generating many high-cost posts
        recommendations.push({
          type: 'high-cost-content',
          severity: 'medium',
          message: `Generating many ${type} posts (${typeDistribution[type]}) which are expensive`,
          suggestion: `Reduce frequency of ${type} or use cheaper model`,
          estimatedSavings: typeDistribution[type] * 0.005
        });
      }
    });
    
    // 3. Check for quality score optimization
    if (contentStats.qualityScores.length > 0) {
      const avgQuality = contentStats.qualityScores.reduce((a, b) => a + b, 0) / contentStats.qualityScores.length;
      if (avgQuality > 85) {
        recommendations.push({
          type: 'over-quality',
          severity: 'low',
          message: `Average quality score is ${avgQuality.toFixed(1)}/100 (very high)`,
          suggestion: `Consider lowering quality threshold to 75 to reduce costs`,
          estimatedSavings: 0.02 // Rough estimate
        });
      }
    }
    
    // 4. Batch processing recommendation
    if (logs.length > 0) {
      const hourlyDistribution = this.analyzeHourlyDistribution(logs);
      const peakHours = Object.entries(hourlyDistribution)
        .filter(([_, count]) => count > 5)
        .map(([hour]) => hour);
      
      if (peakHours.length > 0) {
        recommendations.push({
          type: 'batch-processing',
          severity: 'medium',
          message: `Content generation peaks at hours: ${peakHours.join(', ')}`,
          suggestion: `Consider batching content generation to reduce API calls`,
          estimatedSavings: 0.015
        });
      }
    }
    
    return recommendations;
  }

  analyzeHourlyDistribution(logs) {
    const distribution = {};
    
    logs.forEach(log => {
      const date = new Date(log.timestamp);
      const hour = date.getHours();
      distribution[hour] = (distribution[hour] || 0) + 1;
    });
    
    return distribution;
  }

  calculateSavings(logs) {
    let potentialSavings = 0;
    
    // Calculate savings from switching to cheaper models
    const modelUsage = this.analyzeModelUsage(logs);
    Object.entries(modelUsage).forEach(([model, data]) => {
      const currentCost = MODEL_COSTS[model] || MODEL_COSTS['deepseek-chat'];
      const cheapCost = MODEL_COSTS['deepseek-chat']; // Cheapest option
      
      if (currentCost > cheapCost) {
        // Estimate 300 tokens per task (average)
        const savingsPerTask = (300 / 1000) * (currentCost - cheapCost);
        potentialSavings += data.count * savingsPerTask;
      }
    });
    
    return {
      daily: potentialSavings / 7, // Spread over 7 days
      monthly: potentialSavings * 30 / 7,
      percentage: (potentialSavings / this.estimateCosts(logs).total) * 100
    };
  }

  async saveAnalysis(analysis) {
    const filename = `cost-analysis-${Date.now()}.json`;
    const filepath = path.join(this.logsDir, filename);
    
    await fs.writeFile(filepath, JSON.stringify(analysis, null, 2));
    console.log(`📊 Analysis saved to: ${filepath}`);
  }

  printAnalysis(analysis) {
    console.log('📈 COST ANALYSIS REPORT');
    console.log('=' .repeat(50));
    
    console.log(`\n📊 Overview:`);
    console.log(`Total Posts Analyzed: ${analysis.totalPosts}`);
    console.log(`Estimated Total Cost: $${analysis.estimatedCosts.total.toFixed(4)}`);
    console.log(`Daily Average: $${analysis.estimatedCosts.dailyAverage.toFixed(4)}`);
    console.log(`Monthly Projection: $${(analysis.estimatedCosts.dailyAverage * 30).toFixed(2)}`);
    
    console.log(`\n💸 Cost by Content Type:`);
    Object.entries(analysis.estimatedCosts.byType)
      .sort(([,a], [,b]) => b - a)
      .forEach(([type, cost]) => {
        console.log(`  ${type}: $${cost.toFixed(4)}`);
      });
    
    console.log(`\n🤖 Model Usage:`);
    Object.entries(analysis.modelUsage).forEach(([model, data]) => {
      console.log(`  ${model}: ${data.count} tasks (${Array.from(data.types).join(', ')})`);
    });
    
    console.log(`\n💰 Potential Savings:`);
    console.log(`  Daily: $${analysis.potentialSavings.daily.toFixed(4)}`);
    console.log(`  Monthly: $${analysis.potentialSavings.monthly.toFixed(2)}`);
    console.log(`  Percentage: ${analysis.potentialSavings.percentage.toFixed(1)}%`);
    
    console.log(`\n🎯 Recommendations:`);
    analysis.recommendations.forEach((rec, index) => {
      console.log(`\n${index + 1}. ${rec.message}`);
      console.log(`   Severity: ${rec.severity.toUpperCase()}`);
      console.log(`   Suggestion: ${rec.suggestion}`);
      console.log(`   Estimated Savings: $${rec.estimatedSavings.toFixed(4)}`);
    });
    
    console.log(`\n🚀 Quick Wins:`);
    console.log(`1. Switch whale/trend alerts to claude-3-haiku (saves ~70%)`);
    console.log(`2. Batch content generation (reduces API calls)`);
    console.log(`3. Lower quality threshold from 85 to 75 (saves ~15%)`);
    console.log(`4. Use deepseek-chat for all medium-complexity tasks`);
    
    console.log(`\n` .repeat(2));
  }
}

// Run the optimizer
async function main() {
  const optimizer = new CostOptimizer();
  await optimizer.analyzeCosts();
}

// Export for use in other scripts
module.exports = CostOptimizer;

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}