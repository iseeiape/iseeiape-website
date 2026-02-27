#!/usr/bin/env node

/**
 * Content Scheduler - Automated Crypto Content Generation
 * Generates and schedules 4 types of crypto content based on market data
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

// Configuration
const CONFIG = {
  contentTypes: ['whale-alert', 'trend-alert', 'market-update', 'educational'],
  postingSchedule: {
    'whale-alert': 'immediate', // Post immediately when detected
    'trend-alert': ['09:00', '15:00', '21:00'],
    'market-update': ['08:00', '20:00'],
    'educational': ['10:00', '14:00', '18:00']
  },
  platforms: ['x', 'telegram', 'discord'],
  minQualityScore: 70,
  dataSource: '../neo-crypto/data/enhanced-live-data.json'
};

// Content templates
const TEMPLATES = {
  'whale-alert': `🚨 WHALE ALERT 🚨
{whale_action} {amount} {token} (${value})
Wallet: {wallet}
Price: ${price} ({change})
Context: {narrative} narrative ({narrative_score}/100)
Action: {action_advice}

#{hashtags}`,

  'trend-alert': `📈 TREND ALERT 📈
{narrative} narrative heating up! ({score}/100)

Top movers:
{top_movers}

Why it matters:
{why_matters}

Watch: {watch_tokens}

#{hashtags}`,

  'market-update': `📊 MARKET UPDATE - {date}
24h Summary:
• Total Volume: ${total_volume}
• Top Gainer: {top_gainer} ({gainer_change})
• Top Narrative: {top_narrative} ({narrative_score}/100)
• Whale Activity: {whale_count} wallets, {tx_count} transactions

Key Levels:
• Support: {support_level}
• Resistance: {resistance_level}
• Sentiment: {sentiment}

#{hashtags}`,

  'educational': `🎓 TRADING STRATEGY: {strategy_name}

Concept: {concept}

How it works:
{how_it_works}

Example:
{example}

Risk Management:
{risk_management}

Pro Tip: {pro_tip}

#{hashtags}`
};

class ContentScheduler {
  constructor() {
    this.generatedContent = [];
    this.scheduledPosts = [];
    this.qualityScores = {};
  }

  async loadMarketData() {
    try {
      const dataPath = path.join(__dirname, CONFIG.dataSource);
      const data = await fs.readFile(dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading market data:', error);
      return this.getSampleData();
    }
  }

  getSampleData() {
    // Fallback sample data if real data unavailable
    return {
      tokens: [
        { symbol: 'SOL', price: 145.67, change24h: 14.49, volume24h: 1200000000 },
        { symbol: 'BONK', price: 0.00025, change24h: 8.2, volume24h: 87000000 },
        { symbol: 'JUP', price: 1.45, change24h: 5.7, volume24h: 189000000 }
      ],
      narratives: [
        { name: 'AI Agents', score: 95 },
        { name: 'RWA', score: 95 },
        { name: 'Meme Coins', score: 95 }
      ],
      whales: {
        wallets: 5,
        transactions: 14
      },
      timestamp: new Date().toISOString()
    };
  }

  generateWhaleAlert(data) {
    const token = data.tokens[1]; // BONK as example
    const narrative = data.narratives[2]; // Meme Coins
    
    const content = TEMPLATES['whale-alert']
      .replace('{whale_action}', 'bought')
      .replace('{amount}', '50,000')
      .replace('{token}', `$${token.symbol}`)
      .replace('{value}', `$${(50000 * token.price).toLocaleString()}`)
      .replace('{wallet}', '8x9F...z3qR')
      .replace('${price}', `$${token.price.toFixed(6)}`)
      .replace('{change}', `${token.change24h > 0 ? '+' : ''}${token.change24h}% in 24h`)
      .replace('{narrative}', narrative.name)
      .replace('{narrative_score}', narrative.score)
      .replace('{action_advice}', 'Watch for follow-through buying')
      .replace('{hashtags}', `Crypto ${token.symbol} WhaleAlert Trading`);

    return {
      type: 'whale-alert',
      content,
      priority: 'high',
      schedule: 'immediate'
    };
  }

  generateTrendAlert(data) {
    const narrative = data.narratives[0]; // AI Agents
    const topMovers = data.tokens.slice(0, 3)
      .map(t => `• $${t.symbol}: ${t.change24h > 0 ? '+' : ''}${t.change24h}%`)
      .join('\n');

    const content = TEMPLATES['trend-alert']
      .replace('{narrative}', narrative.name)
      .replace('{score}', narrative.score)
      .replace('{top_movers}', topMovers)
      .replace('{why_matters}', 'AI agents are automating trading and research, creating new demand for infrastructure tokens')
      .replace('{watch_tokens}', 'NEAR, FET, AGIX')
      .replace('{hashtags}', `AI Crypto ${narrative.name.replace(' ', '')} Trading`);

    return {
      type: 'trend-alert',
      content,
      priority: 'medium',
      schedule: CONFIG.postingSchedule['trend-alert'][0]
    };
  }

  generateMarketUpdate(data) {
    const totalVolume = data.tokens.reduce((sum, t) => sum + t.volume24h, 0);
    const topGainer = data.tokens.reduce((max, t) => t.change24h > max.change24h ? t : max);
    const topNarrative = data.narratives.reduce((max, n) => n.score > max.score ? n : max);

    const content = TEMPLATES['market-update']
      .replace('{date}', new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }))
      .replace('${total_volume}', `$${(totalVolume / 1000000).toFixed(1)}M`)
      .replace('{top_gainer}', `$${topGainer.symbol}`)
      .replace('{gainer_change}', `${topGainer.change24h > 0 ? '+' : ''}${topGainer.change24h}%`)
      .replace('{top_narrative}', topNarrative.name)
      .replace('{narrative_score}', topNarrative.score)
      .replace('{whale_count}', data.whales.wallets)
      .replace('{tx_count}', data.whales.transactions)
      .replace('{support_level}', '142.50 (SOL)')
      .replace('{resistance_level}', '148.00 (SOL)')
      .replace('{sentiment}', 'Bullish')
      .replace('{hashtags}', 'Crypto MarketUpdate Trading Bitcoin');

    return {
      type: 'market-update',
      content,
      priority: 'medium',
      schedule: CONFIG.postingSchedule['market-update'][0]
    };
  }

  generateEducational() {
    const content = TEMPLATES['educational']
      .replace('{strategy_name}', 'Whale Following')
      .replace('{concept}', 'Track large wallet transactions to identify market-moving activity')
      .replace('{how_it_works}', '1. Monitor wallets with >$100k in assets\n2. Look for accumulation patterns\n3. Confirm with volume/price action\n4. Enter with proper risk management')
      .replace('{example}', 'Whale buys 50K $BONK → Price rises 8% in 2 hours → Take profit at 15% gain')
      .replace('{risk_management}', '• 2% max risk per trade\n• 8% stop loss\n• 25% take profit\n• Confirm with volume')
      .replace('{pro_tip}', 'Combine whale watching with narrative analysis for higher success rate')
      .replace('{hashtags}', 'TradingStrategy CryptoEducation WhaleWatching');

    return {
      type: 'educational',
      content,
      priority: 'low',
      schedule: CONFIG.postingSchedule['educational'][0]
    };
  }

  async scoreContent(content) {
    // Simple scoring algorithm
    let score = 0;
    
    // Relevance (0-25)
    if (content.type === 'whale-alert') score += 20;
    else if (content.type === 'trend-alert') score += 18;
    else if (content.type === 'market-update') score += 15;
    else score += 10;
    
    // Urgency (0-25)
    if (content.priority === 'high') score += 20;
    else if (content.priority === 'medium') score += 15;
    else score += 10;
    
    // Educational Value (0-20)
    if (content.type === 'educational') score += 18;
    else if (content.content.includes('Strategy') || content.content.includes('How to')) score += 15;
    else score += 8;
    
    // Actionability (0-20)
    if (content.content.includes('Action:') || content.content.includes('Watch:')) score += 15;
    else if (content.content.includes('Pro Tip:')) score += 12;
    else score += 8;
    
    // Engagement Potential (0-10)
    if (content.content.includes('🚨') || content.content.includes('📈')) score += 8;
    else if (content.content.includes('🎓') || content.content.includes('📊')) score += 6;
    else score += 4;
    
    return Math.min(100, score);
  }

  async generateAllContent() {
    const marketData = await this.loadMarketData();
    
    // Generate all content types
    const contents = [
      this.generateWhaleAlert(marketData),
      this.generateTrendAlert(marketData),
      this.generateMarketUpdate(marketData),
      this.generateEducational()
    ];
    
    // Score each piece
    for (const content of contents) {
      const score = await this.scoreContent(content);
      content.qualityScore = score;
      content.status = score >= CONFIG.minQualityScore ? 'approved' : 
                      score >= 60 ? 'needs_review' : 'rejected';
      
      this.generatedContent.push(content);
      this.qualityScores[content.type] = score;
      
      if (content.status === 'approved') {
        this.scheduledPosts.push({
          ...content,
          scheduledTime: content.schedule === 'immediate' ? new Date() : 
                        this.calculateNextPostTime(content.schedule),
          platform: 'x' // Default to X/Twitter
        });
      }
    }
    
    return this.generatedContent;
  }

  calculateNextPostTime(timeStr) {
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const postTime = new Date(now);
    postTime.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (postTime < now) {
      postTime.setDate(postTime.getDate() + 1);
    }
    
    return postTime;
  }

  async saveContent() {
    const timestamp = Date.now();
    const outputDir = path.join(__dirname, 'output');
    
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Save generated content
    const contentFile = path.join(outputDir, `generated_${timestamp}.json`);
    await fs.writeFile(contentFile, JSON.stringify({
      generatedAt: new Date().toISOString(),
      content: this.generatedContent,
      qualityScores: this.qualityScores,
      scheduledPosts: this.scheduledPosts
    }, null, 2));
    
    // Save scheduled posts for cron
    const scheduleFile = path.join(outputDir, `schedule_${timestamp}.json`);
    await fs.writeFile(scheduleFile, JSON.stringify(this.scheduledPosts, null, 2));
    
    // Log performance
    const logFile = path.join(__dirname, 'logs', `generation_${timestamp}.log`);
    await fs.writeFile(logFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      totalGenerated: this.generatedContent.length,
      approved: this.generatedContent.filter(c => c.status === 'approved').length,
      averageScore: Object.values(this.qualityScores).reduce((a, b) => a + b, 0) / Object.keys(this.qualityScores).length,
      scheduled: this.scheduledPosts.length
    }, null, 2));
    
    console.log(`Content saved to ${contentFile}`);
    console.log(`Schedule saved to ${scheduleFile}`);
    console.log(`Log saved to ${logFile}`);
  }

  async run() {
    console.log('🚀 Starting Content Scheduler...');
    console.log(`📅 Schedule: ${JSON.stringify(CONFIG.postingSchedule, null, 2)}`);
    
    await this.generateAllContent();
    
    console.log('\n📊 Content Generation Results:');
    console.log('='.repeat(50));
    
    this.generatedContent.forEach((content, index) => {
      console.log(`\n${index + 1}. ${content.type.toUpperCase()}`);
      console.log(`   Score: ${content.qualityScore}/100`);
      console.log(`   Status: ${content.status}`);
      console.log(`   Schedule: ${content.schedule}`);
      console.log(`   Preview: ${content.content.substring(0, 80)}...`);
    });
    
    console.log('\n' + '='.repeat(50));
    console.log(`✅ Generated ${this.generatedContent.length} pieces of content`);
    console.log(`✅ ${this.scheduledPosts.length} scheduled for posting`);
    
    const avgScore = Object.values(this.qualityScores).reduce((a, b) => a + b, 0) / Object.keys(this.qualityScores).length;
    console.log(`✅ Average quality score: ${avgScore.toFixed(1)}/100`);
    
    await this.saveContent();
    
    // If there are immediate posts, show them
    const immediatePosts = this.scheduledPosts.filter(p => p.schedule === 'immediate');
    if (immediatePosts.length > 0) {
      console.log('\n🚨 IMMEDIATE POSTS READY:');
      immediatePosts.forEach((post, i) => {
        console.log(`\n${i + 1}. ${post.type}:`);
        console.log(post.content);
      });
    }
    
    return this.generatedContent;
  }
}

// Run if called directly
if (require.main === module) {
  const scheduler = new ContentScheduler();
  scheduler.run().catch(console.error);
}

module.exports = ContentScheduler;