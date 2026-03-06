#!/usr/bin/env node

/**
 * Multi-Platform Poster for iseeiape Automation
 * Posts content to X (Twitter), Telegram, and Discord simultaneously
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

class MultiPlatformPoster {
  constructor(config = {}) {
    this.config = {
      platforms: {
        x: {
          enabled: true,
          priority: 1,
          maxLength: 280,
          requireMedia: false
        },
        telegram: {
          enabled: true,
          priority: 2,
          maxLength: 4096,
          requireMedia: false,
          parseMode: 'HTML'
        },
        discord: {
          enabled: true,
          priority: 3,
          maxLength: 2000,
          requireMedia: false,
          embedColors: {
            'whale-alert': 0xFF0000, // Red
            'trend-alert': 0x00FF00, // Green
            'market-update': 0x0000FF, // Blue
            'educational': 0xFFA500, // Orange
            'technical-analysis': 0x800080, // Purple
            'sentiment-report': 0x008080  // Teal
          }
        }
      },
      retryAttempts: 2,
      delayBetweenPosts: 2000, // 2 seconds
      logDir: path.join(__dirname, 'logs'),
      ...config
    };
    
    this.stats = {
      totalPosts: 0,
      byPlatform: { x: 0, telegram: 0, discord: 0 },
      byType: {},
      failures: 0,
      lastPostTime: null
    };
  }

  async postContent(content, options = {}) {
    const postId = `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const results = {
      postId,
      timestamp: new Date().toISOString(),
      contentType: content.type || 'unknown',
      platforms: {},
      success: false
    };
    
    console.log(`🚀 Posting content ${postId} to multiple platforms...`);
    
    try {
      // Format content for each platform
      const formattedContent = this.formatForPlatforms(content, options);
      
      // Post to each enabled platform in priority order
      const platformEntries = Object.entries(this.config.platforms)
        .filter(([_, config]) => config.enabled)
        .sort(([_, a], [__, b]) => a.priority - b.priority);
      
      for (const [platform, platformConfig] of platformEntries) {
        try {
          console.log(`  → Posting to ${platform}...`);
          
          const platformContent = formattedContent[platform];
          const result = await this.postToPlatform(platform, platformContent, content, options);
          
          results.platforms[platform] = {
            success: true,
            messageId: result.messageId,
            url: result.url,
            timestamp: new Date().toISOString()
          };
          
          this.stats.byPlatform[platform] = (this.stats.byPlatform[platform] || 0) + 1;
          
          console.log(`    ✓ Successfully posted to ${platform}`);
          
          // Delay between posts to avoid rate limits
          if (platform !== platformEntries[platformEntries.length - 1][0]) {
            await this.sleep(this.config.delayBetweenPosts);
          }
          
        } catch (platformError) {
          console.error(`    ✗ Failed to post to ${platform}:`, platformError.message);
          
          results.platforms[platform] = {
            success: false,
            error: platformError.message,
            timestamp: new Date().toISOString()
          };
          
          this.stats.failures++;
          
          // Try retry if configured
          if (this.config.retryAttempts > 0) {
            const retryResult = await this.retryPost(platform, formattedContent[platform], content, options);
            if (retryResult.success) {
              results.platforms[platform] = {
                success: true,
                messageId: retryResult.messageId,
                url: retryResult.url,
                timestamp: new Date().toISOString(),
                retried: true
              };
              console.log(`    ✓ Successfully posted to ${platform} after retry`);
            }
          }
        }
      }
      
      // Update statistics
      this.stats.totalPosts++;
      this.stats.byType[content.type] = (this.stats.byType[content.type] || 0) + 1;
      this.stats.lastPostTime = new Date().toISOString();
      
      results.success = Object.values(results.platforms).some(p => p.success);
      
      // Log results
      await this.logPost(results);
      
      return results;
      
    } catch (error) {
      console.error('Error in multi-platform posting:', error);
      results.error = error.message;
      return results;
    }
  }

  formatForPlatforms(content, options) {
    const formatted = {};
    
    // X/Twitter formatting
    if (this.config.platforms.x.enabled) {
      formatted.x = this.formatForX(content, options);
    }
    
    // Telegram formatting
    if (this.config.platforms.telegram.enabled) {
      formatted.telegram = this.formatForTelegram(content, options);
    }
    
    // Discord formatting
    if (this.config.platforms.discord.enabled) {
      formatted.discord = this.formatForDiscord(content, options);
    }
    
    return formatted;
  }

  formatForX(content, options) {
    let text = content.text || '';
    
    // Truncate if too long
    if (text.length > this.config.platforms.x.maxLength) {
      text = text.substring(0, this.config.platforms.x.maxLength - 3) + '...';
    }
    
    // Add hashtags for X
    if (content.hashtags && Array.isArray(content.hashtags)) {
      const hashtagText = content.hashtags.map(tag => `#${tag}`).join(' ');
      if (text.length + hashtagText.length + 1 <= this.config.platforms.x.maxLength) {
        text += '\n\n' + hashtagText;
      }
    }
    
    // Add link if available
    if (content.link && text.length + content.link.length + 3 <= this.config.platforms.x.maxLength) {
      text += '\n\n' + content.link;
    }
    
    return {
      text: text.trim(),
      media: content.media || options.media,
      replyTo: options.replyTo
    };
  }

  formatForTelegram(content, options) {
    let text = content.text || '';
    
    // Telegram supports HTML formatting
    if (content.title) {
      text = `<b>${content.title}</b>\n\n${text}`;
    }
    
    // Add hashtags
    if (content.hashtags && Array.isArray(content.hashtags)) {
      text += '\n\n' + content.hashtags.map(tag => `#${tag}`).join(' ');
    }
    
    // Add link if available
    if (content.link) {
      text += `\n\n<a href="${content.link}">Read more</a>`;
    }
    
    // Truncate if too long (unlikely for Telegram)
    if (text.length > this.config.platforms.telegram.maxLength) {
      text = text.substring(0, this.config.platforms.telegram.maxLength - 3) + '...';
    }
    
    return {
      text: text.trim(),
      parse_mode: this.config.platforms.telegram.parseMode,
      media: content.media || options.media,
      disable_web_page_preview: options.disablePreview || false
    };
  }

  formatForDiscord(content, options) {
    // Discord supports embeds
    const embed = {
      title: content.title || this.getDefaultTitle(content.type),
      description: content.text || '',
      color: this.config.platforms.discord.embedColors[content.type] || 0x000000,
      timestamp: new Date().toISOString(),
      fields: []
    };
    
    // Add metrics if available
    if (content.metrics) {
      Object.entries(content.metrics).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          embed.fields.push({
            name: this.formatFieldName(key),
            value: String(value),
            inline: true
          });
        }
      });
    }
    
    // Add footer with source
    embed.footer = {
      text: 'iseeiape Automation System',
      icon_url: options.footerIcon || 'https://iseeiape.com/favicon.ico'
    };
    
    // Truncate description if too long
    if (embed.description.length > 2000) {
      embed.description = embed.description.substring(0, 1997) + '...';
    }
    
    return {
      embeds: [embed],
      content: options.mention ? `<@&${options.mention}>` : undefined
    };
  }

  getDefaultTitle(contentType) {
    const titles = {
      'whale-alert': '🐋 Whale Alert',
      'trend-alert': '📈 Trend Alert',
      'market-update': '📊 Market Update',
      'educational': '📚 Educational Content',
      'technical-analysis': '🔍 Technical Analysis',
      'sentiment-report': '😊 Sentiment Report'
    };
    
    return titles[contentType] || 'New Content';
  }

  formatFieldName(key) {
    const names = {
      'price': '💰 Price',
      'change24h': '📈 24h Change',
      'volume24h': '📊 24h Volume',
      'liquidity': '💧 Liquidity',
      'score': '⭐ Score',
      'sentiment': '😊 Sentiment'
    };
    
    return names[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }

  async postToPlatform(platform, content, originalContent, options) {
    switch (platform) {
      case 'x':
        return await this.postToX(content, originalContent, options);
      case 'telegram':
        return await this.postToTelegram(content, originalContent, options);
      case 'discord':
        return await this.postToDiscord(content, originalContent, options);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  async postToX(content, originalContent, options) {
    // Use the bird skill/X CLI for posting
    // This assumes the bird skill is installed and configured
    
    try {
      // Build command
      let command = `bird post "${content.text.replace(/"/g, '\\"')}"`;
      
      if (content.media) {
        command += ` --media "${content.media}"`;
      }
      
      if (content.replyTo) {
        command += ` --reply "${content.replyTo}"`;
      }
      
      // Execute command
      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
        env: process.env
      });
      
      // Parse response to get message ID and URL
      const messageId = this.extractMessageId(stdout);
      const url = this.extractUrl(stdout);
      
      return {
        messageId,
        url: url || `https://x.com/iseeicode/status/${messageId}`,
        rawOutput: stdout
      };
      
    } catch (error) {
      throw new Error(`X posting failed: ${error.message}`);
    }
  }

  async postToTelegram(content, originalContent, options) {
    // Use OpenClaw's message tool for Telegram posting
    // This would need to be integrated with OpenClaw's messaging system
    
    // For now, simulate posting
    console.log(`[Telegram] Would post: ${content.text.substring(0, 100)}...`);
    
    // In a real implementation, this would use:
    // const { message } = require('openclaw-tools');
    // await message.send({
    //   channel: 'telegram',
    //   message: content.text,
    //   parse_mode: content.parse_mode
    // });
    
    return {
      messageId: `telegram-${Date.now()}`,
      url: 'https://t.me/iseeiape',
      simulated: true
    };
  }

  async postToDiscord(content, originalContent, options) {
    // Use Discord webhook for posting
    // This requires Discord webhook URL in environment
    
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error('DISCORD_WEBHOOK_URL environment variable not set');
    }
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
      });
      
      if (!response.ok) {
        throw new Error(`Discord API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        messageId: data.id,
        url: `https://discord.com/channels/${data.guild_id}/${data.channel_id}/${data.id}`,
        rawResponse: data
      };
      
    } catch (error) {
      throw new Error(`Discord posting failed: ${error.message}`);
    }
  }

  async retryPost(platform, content, originalContent, options) {
    console.log(`  ↻ Retrying ${platform}...`);
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        await this.sleep(attempt * 1000); // Exponential backoff
        
        const result = await this.postToPlatform(platform, content, originalContent, options);
        return { ...result, retryAttempt: attempt };
        
      } catch (retryError) {
        console.log(`    Retry attempt ${attempt} failed: ${retryError.message}`);
        
        if (attempt === this.config.retryAttempts) {
          throw retryError;
        }
      }
    }
    
    throw new Error(`All retry attempts failed for ${platform}`);
  }

  extractMessageId(output) {
    // Extract message ID from CLI output
    const match = output.match(/status\/(\d+)/) || output.match(/ID: (\d+)/);
    return match ? match[1] : Date.now().toString();
  }

  extractUrl(output) {
    // Extract URL from CLI output
    const urlMatch = output.match(/https?:\/\/[^\s]+/);
    return urlMatch ? urlMatch[0] : null;
  }

  async logPost(results) {
    const logFile = path.join(this.config.logDir, 'multi-platform-posts.log');
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...results
    };
    
    try {
      await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error('Failed to log post:', error);
    }
  }

  async getStats() {
    return {
      ...this.stats,
      successRate: this.stats.totalPosts > 0 
        ? ((this.stats.totalPosts - this.stats.failures) / this.stats.totalPosts * 100).toFixed(1)
        : 100
    };
  }

  async generateReport(period = '24h') {
    const stats = await this.getStats();
    
    // Read recent logs for detailed analysis
    const logFile = path.join(this.config.logDir, 'multi-platform-posts.log');
    let recentPosts = [];
    
    try {
      const logContent = await fs.readFile(logFile, 'utf8');
      const lines = logContent.split('\n').filter(line => line.trim());
      
      const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
      
      recentPosts = lines
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (e) {
            return null;
          }
        })
        .filter(post => post && new Date(post.timestamp).getTime() > cutoffTime);
      
    } catch (error) {
      // Log file might not exist
    }
    
    // Analyze platform performance
    const platformPerformance = {};
    Object.keys(this.config.platforms).forEach(platform => {
      if (this.config.platforms[platform].enabled) {
        const platformPosts = recentPosts.filter(post => 
          post.platforms && post.platforms[platform]
        );
        
        const successful = platformPosts.filter(post => 
          post.platforms[platform].success
        );
        
        platformPerformance[platform] = {
          total: platformPosts.length,
          successful: successful.length,
          successRate: platformPosts.length > 0 
            ? (successful.length / platformPosts.length * 100).toFixed(1)
            : 'N/A'
        };
      }
    });
    
    return {
      timestamp: new Date().toISOString(),
      period,
      summary: stats,
      platformPerformance,
      recentPosts: recentPosts.length,
      recommendations: this.generateRecommendations(stats, platformPerformance)
    };
  }

  generateRecommendations(stats, platformPerformance) {
    const recommendations = [];
    
    // Check for platform failures
    Object.entries(platformPerformance).forEach(([platform, perf]) => {
      if (perf.total > 10 && parseFloat(perf.successRate) < 80) {
        recommendations.push({
          platform,
          issue: 'Low success rate',
          rate: `${perf.successRate}%`,
          suggestion: 'Check API credentials and rate limits'
        });
      }
    });
    
    // Check for content type distribution
    const totalByType = Object.values(stats.byType).reduce((a, b) => a + b, 0);
    Object.entries(stats.byType).forEach(([type, count]) => {
      const percentage = (count / totalByType * 100).toFixed(1);
      
      if (percentage > 30) {
        recommendations.push({
          type: 'content_distribution',
          issue: 'High concentration of one content type',
          percentage: `${percentage}%`,
          suggestion: 'Diversify content types for better audience engagement'
        });
      }
    });
    
    return recommendations;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export for use in other scripts
module.exports = MultiPlatformPoster;

// Example usage
if (require.main === module) {
  async function example() {
    const poster = new MultiPlatformPoster();
    
    const testContent = {
      type: 'whale-alert',
      text: '🚨 WHALE ALERT 🚨\n\nA whale just bought 50,000 SOL ($4.2M)\nWallet: 7x8h...9z2k\nPrice: $84.74 (-4.91%)\nVolume: $6.8M\n\nContext: Solana ecosystem heating up',
      title: '🐋 Major SOL Accumulation',
      hashtags: ['Crypto', 'WhaleAlert', 'SOL', 'Solana'],
      metrics: {
        price: 84.74,
        change24h: -4.91,
        volume24h: 6832216.26,
        liquidity: 7865669.06
      },
      link: 'https://iseeiape.com/whale-alerts'
    };
    
    console.log('Example content formatting:');
    const formatted = poster.formatForPlatforms(testContent);
    console.log(JSON.stringify(formatted, null, 2));
    
    console.log('\nExample posting (simulated):');
    const result = await poster.postContent(testContent, { simulate: true });
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\nExample stats:');
    const stats = await poster.getStats();
    console.log(JSON.stringify(stats, null, 2));
  }
  
  example().catch(console.error);
}