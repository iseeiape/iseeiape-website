#!/usr/bin/env node

/**
 * Twitter/X Poster Module for iseeiape Automation System
 * 
 * This module posts scheduled content to Twitter/X using the bird CLI.
 * It reads the enhanced schedule JSON and posts content according to schedule.
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class TwitterPoster {
  constructor(config = {}) {
    this.config = {
      schedulePath: config.schedulePath || './content/automation/output',
      archivePath: config.archivePath || './content/automation/archive',
      logPath: config.logPath || './content/automation/logs',
      birdPath: config.birdPath || 'bird',
      dryRun: config.dryRun || false,
      maxPostLength: 280,
      ...config
    };
    
    this.postingHistory = [];
  }

  /**
   * Get the latest schedule file
   */
  async getLatestSchedule() {
    try {
      const files = await fs.readdir(this.config.schedulePath);
      const scheduleFiles = files.filter(f => f.startsWith('enhanced_schedule_') && f.endsWith('.json'));
      
      if (scheduleFiles.length === 0) {
        throw new Error('No schedule files found');
      }
      
      // Sort by timestamp (newest first)
      scheduleFiles.sort((a, b) => {
        const aTime = parseInt(a.match(/enhanced_schedule_(\d+)\.json/)[1]);
        const bTime = parseInt(b.match(/enhanced_schedule_(\d+)\.json/)[1]);
        return bTime - aTime;
      });
      
      const latestFile = scheduleFiles[0];
      const filePath = path.join(this.config.schedulePath, latestFile);
      const content = await fs.readFile(filePath, 'utf8');
      
      return {
        file: latestFile,
        path: filePath,
        data: JSON.parse(content),
        timestamp: parseInt(latestFile.match(/enhanced_schedule_(\d+)\.json/)[1])
      };
    } catch (error) {
      console.error('Error reading schedule:', error);
      return null;
    }
  }

  /**
   * Check if a post should be sent now
   */
  shouldPostNow(scheduleTime) {
    if (scheduleTime === 'immediate') {
      return true;
    }
    
    const now = new Date();
    const [hours, minutes] = scheduleTime.split(':').map(Number);
    
    // Create a date object for today at the scheduled time
    const scheduledDate = new Date(now);
    scheduledDate.setHours(hours, minutes, 0, 0);
    
    // Check if it's within 5 minutes of the scheduled time
    const timeDiff = Math.abs(now - scheduledDate);
    return timeDiff <= 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Post a tweet using bird CLI
   */
  async postTweet(text, options = {}) {
    if (this.config.dryRun) {
      console.log(`[DRY RUN] Would post tweet: ${text.substring(0, 50)}...`);
      return { success: true, id: 'dry-run', text: text.substring(0, 100) + '...' };
    }
    
    try {
      // Clean up text for command line
      const cleanText = text.replace(/"/g, '\\"').replace(/'/g, "\\'");
      
      // Build command
      let command = `${this.config.birdPath} tweet "${cleanText}"`;
      
      // Add media if provided
      if (options.media) {
        const mediaPaths = Array.isArray(options.media) ? options.media : [options.media];
        mediaPaths.forEach(mediaPath => {
          command += ` --media "${mediaPath}"`;
        });
      }
      
      // Add alt text if provided
      if (options.alt) {
        const altTexts = Array.isArray(options.alt) ? options.alt : [options.alt];
        altTexts.forEach(altText => {
          command += ` --alt "${altText}"`;
        });
      }
      
      console.log(`Posting tweet: ${text.substring(0, 50)}...`);
      const { stdout, stderr } = await execAsync(command, { timeout: 30000 });
      
      if (stderr && stderr.includes('Error')) {
        throw new Error(`bird CLI error: ${stderr}`);
      }
      
      // Parse the output to get tweet ID
      const match = stdout.match(/Tweet posted: https:\/\/x\.com\/\w+\/status\/(\d+)/);
      const tweetId = match ? match[1] : 'unknown';
      
      return {
        success: true,
        id: tweetId,
        url: `https://x.com/dog_on_chain/status/${tweetId}`,
        text: text.substring(0, 100) + '...',
        stdout,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error posting tweet:', error);
      return {
        success: false,
        error: error.message,
        text: text.substring(0, 100) + '...',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Process scheduled posts
   */
  async processScheduledPosts() {
    const schedule = await this.getLatestSchedule();
    if (!schedule) {
      console.log('No schedule found to process');
      return { processed: 0, posted: 0, errors: 0 };
    }
    
    console.log(`📅 Processing schedule: ${schedule.file}`);
    console.log(`📊 Total posts: ${schedule.data.scheduledPosts.length}`);
    
    const now = new Date();
    const results = {
      processed: 0,
      posted: 0,
      errors: 0,
      posts: []
    };
    
    for (const post of schedule.data.scheduledPosts) {
      results.processed++;
      
      // Check if this post should be sent now
      if (this.shouldPostNow(post.schedule) || post.schedule === 'immediate') {
        console.log(`\n🚀 Posting ${post.type} (scheduled: ${post.schedule})...`);
        
        const result = await this.postTweet(post.content, {
          type: post.type,
          priority: post.priority
        });
        
        result.postType = post.type;
        result.scheduledTime = post.schedule;
        result.qualityScore = post.qualityScore;
        
        if (result.success) {
          console.log(`✅ Posted: ${result.url}`);
          results.posted++;
          
          // Update post status in schedule
          post.posted = true;
          post.postedAt = new Date().toISOString();
          post.tweetId = result.id;
          post.tweetUrl = result.url;
        } else {
          console.log(`❌ Failed: ${result.error}`);
          results.errors++;
          post.error = result.error;
        }
        
        results.posts.push(result);
        
        // Add delay between posts to avoid rate limiting
        if (results.posted > 0) {
          await this.delay(5000); // 5 second delay
        }
      } else {
        console.log(`⏰ Skipping ${post.type} (scheduled for ${post.schedule}, now is ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')})`);
      }
    }
    
    // Save updated schedule with posting status
    if (results.posted > 0 || results.errors > 0) {
      await this.saveUpdatedSchedule(schedule);
    }
    
    // Log results
    await this.logResults(results, schedule.file);
    
    return results;
  }

  /**
   * Save updated schedule with posting status
   */
  async saveUpdatedSchedule(schedule) {
    try {
      const updatedPath = path.join(this.config.archivePath, `posted_${schedule.file}`);
      await fs.writeFile(updatedPath, JSON.stringify(schedule.data, null, 2));
      console.log(`📁 Updated schedule saved: ${updatedPath}`);
    } catch (error) {
      console.error('Error saving updated schedule:', error);
    }
  }

  /**
   * Log posting results
   */
  async logResults(results, scheduleFile) {
    try {
      // Ensure log directory exists
      await fs.mkdir(this.config.logPath, { recursive: true });
      
      const logFile = path.join(this.config.logPath, `posting_${Date.now()}.json`);
      const logData = {
        timestamp: new Date().toISOString(),
        scheduleFile,
        summary: {
          processed: results.processed,
          posted: results.posted,
          errors: results.errors
        },
        posts: results.posts
      };
      
      await fs.writeFile(logFile, JSON.stringify(logData, null, 2));
      console.log(`📝 Results logged: ${logFile}`);
    } catch (error) {
      console.error('Error logging results:', error);
    }
  }

  /**
   * Utility delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check bird CLI availability
   */
  async checkBirdAvailability() {
    try {
      const { stdout } = await execAsync(`${this.config.birdPath} --version`);
      console.log(`✅ bird CLI available: ${stdout.trim()}`);
      return true;
    } catch (error) {
      console.error('❌ bird CLI not available:', error.message);
      return false;
    }
  }

  /**
   * Test posting with a sample tweet
   */
  async testPosting() {
    console.log('🧪 Testing Twitter/X posting...');
    
    const available = await this.checkBirdAvailability();
    if (!available) {
      console.log('⚠️ Skipping test - bird CLI not available');
      return false;
    }
    
    const testTweet = `🧪 Test tweet from iseeiape automation system\n\nTime: ${new Date().toLocaleString()}\n\n#Test #Automation #Crypto`;
    
    console.log(`Test tweet: ${testTweet.substring(0, 50)}...`);
    
    if (this.config.dryRun) {
      console.log('✅ Test passed (dry run mode)');
      return true;
    }
    
    try {
      const result = await this.postTweet(testTweet);
      if (result.success) {
        console.log(`✅ Test passed! Tweet posted: ${result.url}`);
        return true;
      } else {
        console.log(`❌ Test failed: ${result.error}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Test error:', error);
      return false;
    }
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const poster = new TwitterPoster({
    dryRun: args.includes('--dry-run'),
    schedulePath: './content/automation/output',
    archivePath: './content/automation/archive',
    logPath: './content/automation/logs'
  });
  
  async function main() {
    if (args.includes('--test')) {
      await poster.testPosting();
    } else if (args.includes('--check')) {
      await poster.checkBirdAvailability();
    } else {
      const results = await poster.processScheduledPosts();
      console.log('\n📊 POSTING SUMMARY:');
      console.log('='.repeat(40));
      console.log(`Processed: ${results.processed}`);
      console.log(`Posted: ${results.posted}`);
      console.log(`Errors: ${results.errors}`);
      
      if (results.posted > 0) {
        console.log('\n✅ Successfully posted tweets!');
      }
    }
  }
  
  main().catch(console.error);
}

module.exports = TwitterPoster;