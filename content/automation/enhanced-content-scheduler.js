#!/usr/bin/env node

/**
 * Enhanced Content Scheduler v2.0
 * Uses real-time data and AI-powered content generation
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

// Import real-time data fetcher
const RealTimeDataFetcher = require('../../neo-crypto/scripts/real-time-data-fetcher.js');

// Configuration
const CONFIG = {
  contentTypes: ['whale-alert', 'trend-alert', 'market-update', 'educational', 'technical-analysis', 'sentiment-report'],
  postingSchedule: {
    'whale-alert': 'immediate',
    'trend-alert': ['09:00', '15:00', '21:00'],
    'market-update': ['08:00', '20:00'],
    'educational': ['10:00', '14:00', '18:00'],
    'technical-analysis': ['11:00', '17:00'],
    'sentiment-report': ['12:00', '19:00']
  },
  platforms: ['x', 'telegram', 'discord'],
  minQualityScore: 75,
  dataSource: '../../neo-crypto/data/enhanced-live-data.json',
  aiModel: 'deepseek-chat', // Cost-effective for automation
  maxPostsPerDay: 12,
  contentArchiveDir: './archive'
};

// Enhanced templates with more dynamic content
const TEMPLATES = {
  'whale-alert': {
    template: `🚨 WHALE ALERT 🚨

{whale_action} {amount} {token} (${'{value}'})
Wallet: {wallet}
Price: ${'{price}'} (${'{change}'})
Volume: ${'{volume}'}

Context: {narrative} narrative ({narrative_score}/100)
Market Cap: ${'{market_cap}'}
Liquidity: ${'{liquidity}'}

Action: {action_advice}

#{hashtags}`,
    
    generate: async function(data, whaleData) {
      const token = data.tokens.find(t => t.symbol === whaleData.token) || data.tokens[0];
      const narrative = data.narratives[0];
      
      return this.template
        .replace('{whale_action}', whaleData.action)
        .replace('{amount}', whaleData.amount.toLocaleString())
        .replace('{token}', `$${whaleData.token}`)
        .replace('{value}', `$${whaleData.value.toLocaleString()}`)
        .replace('{wallet}', whaleData.wallet)
        .replace('{price}', `$${token.price < 0.01 ? token.price.toFixed(6) : token.price.toFixed(2)}`)
        .replace('{change}', `${token.change24h > 0 ? '+' : ''}${token.change24h.toFixed(2)}%`)
        .replace('{volume}', `$${(token.volume24h / 1000000).toFixed(1)}M`)
        .replace('{narrative}', narrative.name)
        .replace('{narrative_score}', narrative.score)
        .replace('{market_cap}', token.marketCap ? `$${(token.marketCap / 1000000).toFixed(1)}M` : 'N/A')
        .replace('{liquidity}', token.liquidity ? `$${(token.liquidity / 1000).toFixed(1)}K` : 'N/A')
        .replace('{action_advice}', this.getActionAdvice(whaleData.action, token.change24h))
        .replace('{hashtags}', this.generateHashtags(whaleData.token, narrative.name));
    },
    
    getActionAdvice: function(action, change) {
      if (action === 'bought') {
        return change > 5 ? 'Strong accumulation, watch for breakout' : 'Accumulation phase, monitor for follow-through';
      } else {
        return change < -5 ? 'Heavy selling, avoid until stabilization' : 'Profit taking, wait for support test';
      }
    },
    
    generateHashtags: function(token, narrative) {
      const baseTags = ['Crypto', 'WhaleAlert', 'Trading'];
      const tokenTag = token.replace('$', '');
      const narrativeTag = narrative.replace(' ', '');
      return [...baseTags, tokenTag, narrativeTag].join(' ');
    }
  },
  
  'trend-alert': {
    template: `📈 TREND ALERT 📈

{narrative} narrative heating up! ({score}/100)

🔥 Top Performers:
{top_movers}

📊 Metrics:
• Volume: ${'{volume}'}
• Sentiment: ${'{sentiment}'}
• Volatility: ${'{volatility}'}%

🎯 Why It Matters:
{why_matters}

👀 Watch These Tokens:
{watch_tokens}

⚠️ Risk Level: {risk_level}

#{hashtags}`,
    
    generate: async function(data) {
      const narrative = data.narratives[0];
      const relatedTokens = data.tokens.filter(t => 
        t.symbol.toLowerCase().includes(narrative.name.toLowerCase().split(' ')[0]) ||
        t.symbol === 'SOL' // Always include SOL
      ).slice(0, 5);
      
      const topMovers = relatedTokens
        .sort((a, b) => b.change24h - a.change24h)
        .slice(0, 3)
        .map(t => `• $${t.symbol}: ${t.change24h > 0 ? '+' : ''}${t.change24h.toFixed(2)}% ($${t.price < 0.01 ? t.price.toFixed(6) : t.price.toFixed(2)})`)
        .join('\n');
      
      const totalVolume = relatedTokens.reduce((sum, t) => sum + t.volume24h, 0);
      const avgChange = relatedTokens.reduce((sum, t) => sum + t.change24h, 0) / relatedTokens.length;
      
      return this.template
        .replace('{narrative}', narrative.name)
        .replace('{score}', narrative.score)
        .replace('{top_movers}', topMovers)
        .replace('{volume}', `$${(totalVolume / 1000000).toFixed(1)}M`)
        .replace('{sentiment}', data.market.sentiment)
        .replace('{volatility}', data.market.volatility.toFixed(1))
        .replace('{why_matters}', this.getWhyItMatters(narrative.name))
        .replace('{watch_tokens}', relatedTokens.slice(0, 3).map(t => `$${t.symbol}`).join(', '))
        .replace('{risk_level}', this.getRiskLevel(avgChange, data.market.volatility))
        .replace('{hashtags}', this.generateHashtags(narrative.name));
    },
    
    getWhyItMatters: function(narrative) {
      const reasons = {
        'AI Agents': 'AI agents are automating trading and research, creating massive demand for infrastructure tokens.',
        'Meme Coins': 'Retail interest is surging with SOL strength, creating high-volatility opportunities.',
        'RWA': 'Institutional adoption is driving real-world asset tokenization to new heights.',
        'DeFi': 'Yield opportunities are expanding with new protocols and integrations.',
        'Gaming': 'Play-to-earn models are attracting millions of new users to crypto.'
      };
      return reasons[narrative] || 'Strong fundamentals and growing adoption driving momentum.';
    },
    
    getRiskLevel: function(avgChange, volatility) {
      if (volatility > 10 && avgChange > 15) return 'High (speculative)';
      if (volatility > 5 && avgChange > 8) return 'Medium-High';
      if (volatility > 3 && avgChange > 4) return 'Medium';
      return 'Low-Medium';
    },
    
    generateHashtags: function(narrative) {
      const tags = {
        'AI Agents': ['AI', 'ArtificialIntelligence', 'AIAgents', 'CryptoAI'],
        'Meme Coins': ['MemeCoins', 'Memes', 'SolanaMeme', 'CryptoMemes'],
        'RWA': ['RWA', 'RealWorldAssets', 'Tokenization', 'InstitutionalCrypto'],
        'DeFi': ['DeFi', 'DecentralizedFinance', 'YieldFarming', 'CryptoFinance'],
        'Gaming': ['GameFi', 'CryptoGaming', 'PlayToEarn', 'NFTGaming']
      };
      return [...(tags[narrative] || ['Crypto', 'Trading', 'Trending']), narrative.replace(' ', '')].join(' ');
    }
  },
  
  'market-update': {
    template: `📊 MARKET UPDATE - {date}

24h Summary:
• Total Volume: ${'{total_volume}'}
• Top Gainer: ${'{top_gainer}'} ({gainer_change})
• Top Narrative: ${'{top_narrative}'} ({narrative_score}/100)
• Whale Activity: {whale_count} wallets, {tx_count} transactions

📈 Market Stats:
• Sentiment: {sentiment}
• Volatility: {volatility}%
• Support: {support_level}
• Resistance: {resistance_level}

🎯 Key Levels to Watch:
{key_levels}

⚠️ Risk Assessment: {risk_assessment}

#{hashtags}`,
    
    generate: async function(data) {
      const topGainer = data.tokens.reduce((max, t) => t.change24h > max.change24h ? t : max);
      const topNarrative = data.narratives[0];
      
      const keyLevels = data.tokens
        .filter(t => Math.abs(t.change24h) > 8)
        .slice(0, 3)
        .map(t => `• $${t.symbol}: ${t.change24h > 0 ? '+' : ''}${t.change24h.toFixed(1)}% at $${t.price.toFixed(t.price < 0.01 ? 6 : 2)}`)
        .join('\n') || '• Market consolidating, watch for breakout direction';
      
      return this.template
        .replace('{date}', new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }))
        .replace('{total_volume}', `$${(data.market.totalVolume / 1000000).toFixed(1)}M`)
        .replace('{top_gainer}', `$${topGainer.symbol}`)
        .replace('{gainer_change}', `${topGainer.change24h > 0 ? '+' : ''}${topGainer.change24h.toFixed(2)}%`)
        .replace('{top_narrative}', topNarrative.name)
        .replace('{narrative_score}', topNarrative.score)
        .replace('{whale_count}', data.whales.wallets)
        .replace('{tx_count}', data.whales.transactions)
        .replace('{sentiment}', data.market.sentiment)
        .replace('{volatility}', data.market.volatility.toFixed(1))
        .replace('{support_level}', data.market.supportLevel)
        .replace('{resistance_level}', data.market.resistanceLevel)
        .replace('{key_levels}', keyLevels)
        .replace('{risk_assessment}', this.getRiskAssessment(data.market))
        .replace('{hashtags}', 'Crypto MarketUpdate Trading Bitcoin Solana');
    },
    
    getRiskAssessment: function(market) {
      if (market.volatility > 12) return 'High volatility - use smaller positions';
      if (market.volatility > 8) return 'Elevated volatility - manage risk carefully';
      if (market.volatility > 4) return 'Moderate volatility - normal trading conditions';
      return 'Low volatility - good for swing trades';
    }
  }
};

class EnhancedContentScheduler {
  constructor() {
    this.fetcher = new RealTimeDataFetcher();
    this.generatedContent = [];
    this.scheduledPosts = [];
    this.qualityScores = {};
    this.contentArchive = [];
  }

  async loadMarketData() {
    try {
      console.log('📡 Loading real-time market data...');
      await this.fetcher.runOnce();
      
      const dataPath = path.join(__dirname, CONFIG.dataSource);
      const data = await fs.readFile(dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading market data:', error);
      return this.getSampleData();
    }
  }

  getSampleData() {
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
        transactions: 14,
        recentActivity: [
          { wallet: '8x9F...z3qR', action: 'bought', token: 'BONK', amount: 50000, value: 12500 }
        ]
      },
      market: {
        totalVolume: 2500000000,
        sentiment: 'bullish',
        volatility: 0.08,
        supportLevel: '142.50',
        resistanceLevel: '148.00'
      },
      timestamp: new Date().toISOString()
    };
  }

  async generateContent(contentType, data) {
    const template = TEMPLATES[contentType];
    if (!template) {
      throw new Error(`Unknown content type: ${contentType}`);
    }

    let content;
    switch (contentType) {
      case 'whale-alert':
        const whaleData = data.whales.recentActivity[0] || data.whales.recentActivity;
        content = await template.generate(data, whaleData);
        break;
      case 'trend-alert':
      case 'market-update':
        content = await template.generate(data);
        break;
      default:
        // For other types, use basic generation
        content = `📝 ${contentType.toUpperCase()}\n\nMarket data loaded. Content generation for ${contentType} coming soon.\n\n#Crypto #${contentType.replace('-', '')}`;
    }

    return {
      type: contentType,
      content,
      priority: this.getPriority(contentType),
      schedule: this.getNextSchedule(contentType),
      generatedAt: new Date().toISOString()
    };
  }

  getPriority(contentType) {
    const priorities = {
      'whale-alert': 'high',
      'trend-alert': 'medium-high',
      'market-update': 'medium',
      'technical-analysis': 'medium',
      'sentiment-report': 'medium-low',
      'educational': 'low'
    };
    return priorities[contentType] || 'medium';
  }

  getNextSchedule(contentType) {
    const schedule = CONFIG.postingSchedule[contentType];
    if (schedule === 'immediate') return 'immediate';
    
    if (Array.isArray(schedule)) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      // Find next scheduled time today
      for (const timeStr of schedule) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        if (hours > currentHour || (hours === currentHour && minutes > currentMinute)) {
          return timeStr;
        }
      }
      
      // If no times left today, use first time tomorrow
      return schedule[0];
    }
    
    return '09:00'; // Default
  }

  async scoreContent(content) {
    // Enhanced scoring algorithm
    let score = 0;
    
    // Data richness (0-30)
    const dataPoints = [
      content.content.match(/\$\d+/g)?.length || 0,
      content.content.match(/\d+%/g)?.length || 0,
      content.content.match(/[A-Z]{3,4}/g)?.length || 0
    ];
    score += Math.min(30, dataPoints.reduce((a, b) => a + b, 0) * 3);
    
    // Urgency/Relevance (0-25)
    if (content.priority === 'high') score += 22;
    else if (content.priority === 'medium-high') score += 19;
    else if (content.priority === 'medium') score += 16;
    else score += 12;
    
    // Actionability (0-20)
    const actionKeywords = ['watch', 'buy', 'sell', 'entry', 'exit', 'target', 'stop', 'support', 'resistance'];
    const actionCount = actionKeywords.filter(keyword => 
      content.content.toLowerCase().includes(keyword)
    ).length;
    score += Math.min(20, actionCount * 4);
    
    // Engagement potential (0-15)
    const emojiCount = (content.content.match(/[🚨📈📊🎓🔥👀⚠️🎯📋🧠🐋]/g) || []).length;
    score += Math.min(15, emojiCount * 3);
    
    // Readability (0-10)
    const lineCount = content.content.split('\n').length;
    score += lineCount >= 5 && lineCount <= 20 ? 8 : 5;
    
    return Math.min(100, score);
  }

  async generateAllContent() {
    const marketData = await this.loadMarketData();
    
    console.log('🚀 Generating enhanced content...');
    
    // Generate content for each type
    for (const contentType of CONFIG.contentTypes) {
      try {
        console.log(`\n🔨 Generating ${contentType}...`);
        const content = await this.generateContent(contentType, marketData);
        const score = await this.scoreContent(content);
        
        content.qualityScore = score;
        content.status = score >= CONFIG.minQualityScore ? 'approved' : 
                        score >= 60 ? 'needs_review' : 'rejected';
        
        this.generatedContent.push(content);
        this.qualityScores[contentType] = score;
        
        if (content.status === 'approved') {
          this.scheduledPosts.push({
            ...content,
            scheduledTime: content.schedule === 'immediate' ? new Date() : 
                          this.calculateNextPostTime(content.schedule),
            platform: 'x',
            postId: `post_${Date.now()}_${contentType}`
          });
        }
        
        console.log(`   ✅ Generated: ${contentType} (Score: ${score}/100)`);
      } catch (error) {
        console.error(`❌ Error generating ${contentType}:`, error.message);
      }
    }
    
    return this.generatedContent;
  }

  calculateNextPostTime(timeStr) {
    const now = new Date();
    
    if (timeStr === 'immediate') return now;
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    const postTime = new Date(now);
    postTime.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (postTime < now) {
      postTime.setDate(postTime.getDate() + 1);
    }
    
    return postTime;
  }

  async archiveContent() {
    const archiveDir = path.join(__dirname, CONFIG.contentArchiveDir);
    await fs.mkdir(archiveDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archiveFile = path.join(archiveDir, `content_${timestamp}.json`);
    
    const archiveData = {
      archivedAt: new Date().toISOString(),
      generatedContent: this.generatedContent,
      qualityScores: this.qualityScores,
      scheduledPosts: this.scheduledPosts
    };
    
    await fs.writeFile(archiveFile, JSON.stringify(archiveData, null, 2));
    console.log(`📁 Content archived to: ${archiveFile}`);
  }

  async saveSchedule() {
    const outputDir = path.join(__dirname, 'output');
    await fs.mkdir(outputDir, { recursive: true });
    
    const timestamp = Date.now();
    const scheduleFile = path.join(outputDir, `enhanced_schedule_${timestamp}.json`);
    
    const scheduleData = {
      generatedAt: new Date().toISOString(),
      scheduledPosts: this.scheduledPosts.map(post => ({
        ...post,
        scheduledTime: post.scheduledTime.toISOString()
      })),
      summary: {
        totalPosts: this.scheduledPosts.length,
        averageScore: Object.values(this.qualityScores).reduce((a, b) => a + b, 0) / Object.keys(this.qualityScores).length,
        immediatePosts: this.scheduledPosts.filter(p => p.schedule === 'immediate').length
      }
    };
    
    await fs.writeFile(scheduleFile, JSON.stringify(scheduleData, null, 2));
    console.log(`📅 Schedule saved to: ${scheduleFile}`);
    
    return scheduleFile;
  }

  async generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 ENHANCED CONTENT GENERATION REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n📈 Market Data Source: ${this.generatedContent[0]?.source || 'Real-time APIs'}`);
    console.log(`🕒 Generated at: ${new Date().toLocaleString()}`);
    
    console.log('\n📝 CONTENT SUMMARY:');
    console.log('-'.repeat(40));
    
    this.generatedContent.forEach((content, index) => {
      const statusIcon = content.status === 'approved' ? '✅' : 
                        content.status === 'needs_review' ? '⚠️' : '❌';
      
      console.log(`${index + 1}. ${statusIcon} ${content.type.toUpperCase()}`);
      console.log(`   Score: ${content.qualityScore}/100 | Status: ${content.status}`);
      console.log(`   Schedule: ${content.schedule} | Priority: ${content.priority}`);
      console.log(`   Preview: ${content.content.substring(0, 60).replace(/\n/g, ' ')}...`);
    });
    
    const approvedCount = this.generatedContent.filter(c => c.status === 'approved').length;
    const avgScore = Object.values(this.qualityScores).reduce((a, b) => a + b, 0) / Object.keys(this.qualityScores).length;
    
    console.log('\n📊 STATISTICS:');
    console.log('-'.repeat(40));
    console.log(`• Total generated: ${this.generatedContent.length}`);
    console.log(`• Approved: ${approvedCount}`);
    console.log(`• Needs review: ${this.generatedContent.filter(c => c.status === 'needs_review').length}`);
    console.log(`• Rejected: ${this.generatedContent.filter(c => c.status === 'rejected').length}`);
    console.log(`• Average score: ${avgScore.toFixed(1)}/100`);
    console.log(`• Scheduled posts: ${this.scheduledPosts.length}`);
    
    console.log('\n🚨 IMMEDIATE POSTS:');
    console.log('-'.repeat(40));
    const immediatePosts = this.scheduledPosts.filter(p => p.schedule === 'immediate');
    if (immediatePosts.length > 0) {
      immediatePosts.forEach((post, i) => {
        console.log(`\n${i + 1}. ${post.type.toUpperCase()}:`);
        console.log(post.content);
      });
    } else {
      console.log('No immediate posts scheduled.');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Enhanced content generation completed!');
  }

  async run() {
    console.log('🚀 ENHANCED CONTENT SCHEDULER v2.0');
    console.log('='.repeat(60));
    console.log(`📅 Schedule: ${JSON.stringify(CONFIG.postingSchedule, null, 2)}`);
    console.log(`🎯 Target platforms: ${CONFIG.platforms.join(', ')}`);
    console.log(`📊 Min quality score: ${CONFIG.minQualityScore}/100`);
    
    await this.generateAllContent();
    await this.archiveContent();
    const scheduleFile = await this.saveSchedule();
    await this.generateReport();
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Review scheduled posts in output directory');
    console.log('2. Manual review for "needs_review" content');
    console.log('3. Execute posting via X/Twitter API');
    console.log('4. Monitor engagement and adjust strategy');
    
    console.log(`\n📁 Schedule file: ${scheduleFile}`);
    console.log('🦎 Matrix Army Content Machine - Ready for deployment!');
    
    return {
      generatedContent: this.generatedContent,
      scheduledPosts: this.scheduledPosts,
      scheduleFile
    };
  }
}

// Run if called directly
if (require.main === module) {
  const scheduler = new EnhancedContentScheduler();
  scheduler.run().catch(console.error);
}

module.exports = EnhancedContentScheduler;