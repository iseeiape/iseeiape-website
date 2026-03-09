#!/usr/bin/env node

/**
 * Content Batcher for iseeiape Automation
 * 
 * Batches content generation to reduce API calls and optimize costs.
 * Instead of generating content every few hours, generates multiple
 * posts at once during off-peak hours.
 */

const fs = require('fs').promises;
const path = require('path');

class ContentBatcher {
  constructor() {
    this.baseDir = process.cwd();
    this.dataDir = path.join(this.baseDir, 'neo-crypto', 'data');
    this.outputDir = path.join(this.baseDir, 'content', 'automation', 'output');
    this.scheduleFile = path.join(this.baseDir, 'content', 'automation', 'enhanced-schedule.json');
  }

  async run() {
    console.log('📦 CONTENT BATCHING OPTIMIZER');
    console.log('='.repeat(50));
    
    try {
      // 1. Analyze current schedule
      const schedule = await this.analyzeSchedule();
      
      // 2. Identify batching opportunities
      const opportunities = this.findBatchingOpportunities(schedule);
      
      // 3. Generate optimized schedule
      const optimized = this.optimizeSchedule(schedule, opportunities);
      
      // 4. Save optimized schedule
      await this.saveOptimizedSchedule(optimized);
      
      // 5. Estimate savings
      this.estimateSavings(opportunities);
      
      console.log('\n✅ Content batching analysis complete!');
      
    } catch (error) {
      console.error('❌ Error in content batcher:', error.message);
    }
  }

  async analyzeSchedule() {
    console.log('\n📊 Analyzing current content schedule...');
    
    try {
      const content = await fs.readFile(this.scheduleFile, 'utf8');
      const schedule = JSON.parse(content);
      
      // Count posts by type
      const counts = {};
      let totalPosts = 0;
      
      Object.entries(schedule).forEach(([type, times]) => {
        if (Array.isArray(times)) {
          counts[type] = times.length;
          totalPosts += times.length;
        } else if (times === 'immediate') {
          counts[type] = 1;
          totalPosts += 1;
        }
      });
      
      console.log(`   Total scheduled posts: ${totalPosts}`);
      Object.entries(counts).forEach(([type, count]) => {
        console.log(`   - ${type}: ${count} posts`);
      });
      
      return { schedule, counts, totalPosts };
      
    } catch (error) {
      console.log('   Using default schedule analysis');
      
      // Default schedule from enhanced-content-scheduler.js
      const defaultSchedule = {
        "whale-alert": "immediate",
        "trend-alert": ["09:00", "15:00", "21:00"],
        "market-update": ["08:00", "20:00"],
        "educational": ["10:00", "14:00", "18:00"],
        "technical-analysis": ["11:00", "17:00"],
        "sentiment-report": ["12:00", "19:00"]
      };
      
      const counts = {};
      let totalPosts = 0;
      
      Object.entries(defaultSchedule).forEach(([type, times]) => {
        if (Array.isArray(times)) {
          counts[type] = times.length;
          totalPosts += times.length;
        } else if (times === 'immediate') {
          counts[type] = 1;
          totalPosts += 1;
        }
      });
      
      console.log(`   Total scheduled posts: ${totalPosts}`);
      Object.entries(counts).forEach(([type, count]) => {
        console.log(`   - ${type}: ${count} posts`);
      });
      
      return { schedule: defaultSchedule, counts, totalPosts };
    }
  }

  findBatchingOpportunities(analysis) {
    console.log('\n🔍 Finding batching opportunities...');
    
    const opportunities = [];
    const { schedule, counts } = analysis;
    
    // Look for types with multiple posts close in time
    Object.entries(schedule).forEach(([type, times]) => {
      if (Array.isArray(times) && times.length > 1) {
        // Convert times to minutes since midnight
        const timeMinutes = times.map(t => {
          const [hours, minutes] = t.split(':').map(Number);
          return hours * 60 + minutes;
        }).sort((a, b) => a - b);
        
        // Find gaps less than 3 hours (180 minutes)
        for (let i = 0; i < timeMinutes.length - 1; i++) {
          const gap = timeMinutes[i + 1] - timeMinutes[i];
          if (gap < 180) {
            opportunities.push({
              type,
              times: [times[i], times[i + 1]],
              gapMinutes: gap,
              suggestion: `Batch ${type} posts at ${times[i]}`
            });
          }
        }
      }
    });
    
    if (opportunities.length > 0) {
      console.log(`   Found ${opportunities.length} batching opportunities:`);
      opportunities.forEach(opp => {
        console.log(`   - ${opp.suggestion} (${opp.gapMinutes} min gap)`);
      });
    } else {
      console.log('   No immediate batching opportunities found');
    }
    
    return opportunities;
  }

  optimizeSchedule(analysis, opportunities) {
    console.log('\n⚡ Generating optimized schedule...');
    
    const { schedule } = analysis;
    const optimized = JSON.parse(JSON.stringify(schedule));
    
    // Apply batching for opportunities
    opportunities.forEach(opp => {
      if (opp.type in optimized && Array.isArray(optimized[opp.type])) {
        // Keep only the first time, batch with second
        const index = optimized[opp.type].indexOf(opp.times[1]);
        if (index > -1) {
          optimized[opp.type].splice(index, 1);
          console.log(`   - Batched ${opp.type}: removed ${opp.times[1]}`);
        }
      }
    });
    
    // Add batched flag
    optimized._batched = true;
    optimized._batchOptimizedAt = new Date().toISOString();
    
    return optimized;
  }

  async saveOptimizedSchedule(optimized) {
    const outputFile = path.join(this.outputDir, 'optimized-schedule.json');
    await fs.writeFile(outputFile, JSON.stringify(optimized, null, 2));
    console.log(`   ✅ Optimized schedule saved to: ${outputFile}`);
    
    // Also save as markdown for easy reading
    const markdown = this.generateScheduleMarkdown(optimized);
    const markdownFile = outputFile.replace('.json', '.md');
    await fs.writeFile(markdownFile, markdown);
    console.log(`   📝 Markdown version saved to: ${markdownFile}`);
  }

  generateScheduleMarkdown(schedule) {
    let markdown = '# Optimized Content Schedule\n\n';
    markdown += `**Generated:** ${new Date().toLocaleString()}\n`;
    markdown += `**Optimized for:** Batching to reduce API calls\n\n`;
    
    markdown += '## Schedule\n\n';
    
    Object.entries(schedule).forEach(([type, times]) => {
      if (type.startsWith('_')) return;
      
      markdown += `### ${type.replace('-', ' ').toUpperCase()}\n`;
      
      if (times === 'immediate') {
        markdown += '- **Immediate** (when triggered)\n';
      } else if (Array.isArray(times)) {
        times.forEach(time => {
          markdown += `- ${time}\n`;
        });
      }
      
      markdown += '\n';
    });
    
    if (schedule._batched) {
      markdown += '## Optimization Notes\n\n';
      markdown += '- ✅ Schedule has been optimized for batching\n';
      markdown += '- 📦 Multiple posts of the same type are batched together\n';
      markdown += '- 💰 Reduces API calls and costs\n';
      markdown += '- ⏰ Maintains content distribution throughout the day\n';
    }
    
    return markdown;
  }

  estimateSavings(opportunities) {
    console.log('\n💰 Estimating cost savings...');
    
    if (opportunities.length === 0) {
      console.log('   No batching opportunities found');
      return;
    }
    
    // Each API call costs ~$0.0001 (estimate)
    const costPerCall = 0.0001;
    const savedCalls = opportunities.length;
    const dailySavings = savedCalls * costPerCall;
    const monthlySavings = dailySavings * 30;
    
    console.log(`   Estimated API calls saved: ${savedCalls} per day`);
    console.log(`   Daily savings: $${dailySavings.toFixed(4)}`);
    console.log(`   Monthly savings: $${monthlySavings.toFixed(2)}`);
    console.log(`   Annual savings: $${(monthlySavings * 12).toFixed(2)}`);
  }
}

// Run the batcher
const batcher = new ContentBatcher();
batcher.run().catch(console.error);