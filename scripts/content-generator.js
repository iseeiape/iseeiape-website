// scripts/content-generator.js - Automated content generation from market data
const fs = require('fs');
const path = require('path');

class ContentGenerator {
  constructor() {
    this.contentDir = path.join(__dirname, '../content/generated');
    this.ensureDirectories();
  }

  ensureDirectories() {
    const dirs = [
      this.contentDir,
      path.join(this.contentDir, 'tweets'),
      path.join(this.contentDir, 'articles'),
      path.join(this.contentDir, 'threads')
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async generateFromMarketData(marketData) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Generate different types of content
    const tweets = this.generateTweets(marketData);
    const article = this.generateArticle(marketData);
    const thread = this.generateThread(marketData);
    
    // Save all content
    this.saveContent('tweets', `tweets-${timestamp}.json`, tweets);
    this.saveContent('articles', `article-${timestamp}.md`, article);
    this.saveContent('threads', `thread-${timestamp}.md`, thread);
    
    return {
      tweets,
      article,
      thread,
      timestamp
    };
  }

  generateTweets(marketData) {
    const tweets = [];
    
    // Top performer tweet
    if (marketData.topTokens && marketData.topTokens.length > 0) {
      const topToken = marketData.topTokens[0];
      tweets.push({
        type: 'top_performer',
        content: `🚀 ${topToken.symbol} leading the pack with +${topToken.priceChange24h.toFixed(1)}% in 24h!\n\nScore: ${topToken.score}/100\nVolume: $${(topToken.volume24h / 1000).toFixed(0)}K\n\n#Solana #Crypto #Trading`,
        hashtags: ['#Solana', '#Crypto', '#Trading', '#DeFi'],
        metrics: {
          score: topToken.score,
          change: topToken.priceChange24h,
          volume: topToken.volume24h
        }
      });
    }
    
    // Market sentiment tweet
    if (marketData.marketSentiment) {
      const emoji = marketData.marketSentiment === 'bullish' ? '📈' : 
                   marketData.marketSentiment === 'bearish' ? '📉' : '➡️';
      
      tweets.push({
        type: 'market_sentiment',
        content: `${emoji} Market Sentiment: ${marketData.marketSentiment.toUpperCase()}\n\nBased on ${marketData.stats?.totalTokens || 0} tokens\n${marketData.stats?.highConfidenceTokens || 0} high confidence alerts\n\n#MarketAnalysis #Crypto`,
        hashtags: ['#MarketAnalysis', '#Crypto', '#TradingSignals']
      });
    }
    
    // Risk alert tweet
    if (marketData.advancedMetrics?.riskDistribution?.high > 30) {
      tweets.push({
        type: 'risk_alert',
        content: `⚠️ HIGH RISK ALERT ⚠️\n\n${marketData.advancedMetrics.riskDistribution.high}% of tokens flagged as high risk\n\nExercise caution and DYOR!\n\n#RiskManagement #Crypto #Trading`,
        hashtags: ['#RiskManagement', '#Crypto', '#Trading', '#DYOR'],
        priority: 'high'
      });
    }
    
    // Volume surge tweet
    if (marketData.topTokens && marketData.topTokens.length > 1) {
      const volumeLeader = [...marketData.topTokens].sort((a, b) => b.volume24h - a.volume24h)[0];
      if (volumeLeader.volume24h > 100000) {
        tweets.push({
          type: 'volume_surge',
          content: `💰 ${volumeLeader.symbol} volume surge: $${(volumeLeader.volume24h / 1000).toFixed(0)}K\n\nPrice: $${volumeLeader.price.toFixed(6)}\n24h Change: +${volumeLeader.priceChange24h.toFixed(1)}%\n\n#Volume #Trading #Crypto`,
          hashtags: ['#Volume', '#Trading', '#Crypto', '#Solana']
        });
      }
    }
    
    return tweets;
  }

  generateArticle(marketData) {
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    let article = `# Market Analysis Report - ${date}\n\n`;
    article += `*Generated automatically from real-time market data*\n\n`;
    
    // Executive Summary
    article += `## 📊 Executive Summary\n\n`;
    article += `- **Market Sentiment**: ${marketData.marketSentiment?.toUpperCase() || 'Neutral'}\n`;
    article += `- **Total Tokens Analyzed**: ${marketData.stats?.totalTokens || 0}\n`;
    article += `- **High Confidence Alerts**: ${marketData.stats?.highConfidenceTokens || 0}\n`;
    article += `- **Average Score**: ${marketData.advancedMetrics?.averageScore || 'N/A'}/100\n\n`;
    
    // Top Performers
    if (marketData.topTokens && marketData.topTokens.length > 0) {
      article += `## 🏆 Top Performers\n\n`;
      marketData.topTokens.slice(0, 5).forEach((token, index) => {
        article += `${index + 1}. **${token.symbol}** (${token.name})\n`;
        article += `   - Price: $${token.price?.toFixed(6) || 'N/A'}\n`;
        article += `   - 24h Change: +${token.priceChange24h?.toFixed(2) || '0'}%\n`;
        article += `   - Volume: $${(token.volume24h / 1000).toFixed(0)}K\n`;
        article += `   - Score: ${token.score}/100 (${token.confidence} confidence)\n`;
        article += `   - Risk Level: ${token.riskLevel}\n\n`;
      });
    }
    
    // Market Metrics
    if (marketData.advancedMetrics) {
      article += `## 📈 Market Metrics\n\n`;
      article += `- **Market Breadth**: ${marketData.advancedMetrics.marketBreadth}% bullish\n`;
      article += `- **Volume Concentration**: ${marketData.advancedMetrics.volumeConcentration}% in top 5 tokens\n`;
      article += `- **Risk Distribution**:\n`;
      article += `  - High Risk: ${marketData.advancedMetrics.riskDistribution.high}%\n`;
      article += `  - Medium Risk: ${marketData.advancedMetrics.riskDistribution.medium}%\n`;
      article += `  - Low Risk: ${marketData.advancedMetrics.riskDistribution.low}%\n\n`;
    }
    
    // Narratives
    if (marketData.narratives && marketData.narratives.length > 0) {
      article += `## 🎯 Key Narratives\n\n`;
      marketData.narratives.forEach(narrative => {
        article += `### ${narrative.title}\n`;
        article += `${narrative.content}\n\n`;
        article += `*Sentiment: ${narrative.sentiment} | Priority: ${narrative.priority}*\n\n`;
      });
    }
    
    // Trading Insights
    article += `## 💡 Trading Insights\n\n`;
    
    if (marketData.marketSentiment === 'bullish') {
      article += `### Bullish Market Conditions\n`;
      article += `- Multiple tokens showing strong momentum\n`;
      article += `- Consider scaling into positions with proper risk management\n`;
      article += `- Focus on tokens with high scores and good liquidity\n\n`;
    } else if (marketData.marketSentiment === 'bearish') {
      article += `### Bearish Market Conditions\n`;
      article += `- Exercise caution with new positions\n`;
      article += `- Consider waiting for better risk/reward setups\n`;
      article += `- Focus on preservation of capital\n\n`;
    } else {
      article += `### Neutral Market Conditions\n`;
      article += `- Market in consolidation phase\n`;
      article += `- Look for breakout opportunities\n`;
      article += `- Smaller position sizes recommended\n\n`;
    }
    
    // Risk Management
    article += `## ⚠️ Risk Management\n\n`;
    article += `1. **Always DYOR** - This is automated analysis, not financial advice\n`;
    article += `2. **Position Sizing** - Never risk more than 1-2% per trade\n`;
    article += `3. **Stop Losses** - Always use stop losses to manage risk\n`;
    article += `4. **Diversification** - Spread risk across multiple tokens\n`;
    article += `5. **Emotion Control** - Stick to your trading plan\n\n`;
    
    // Footer
    article += `---\n\n`;
    article += `*Report generated automatically by Neo Dashboard v3*\n`;
    article += `*Data source: Wolf Alerts real-time scanning*\n`;
    article += `*Timestamp: ${new Date().toISOString()}*\n`;
    
    return article;
  }

  generateThread(marketData) {
    let thread = `🧵 Market Thread - ${new Date().toLocaleDateString()}\n\n`;
    
    // Thread intro
    thread += `1/ Real-time market analysis from ${marketData.stats?.totalTokens || 0} tokens\n`;
    thread += `Powered by @iseeicode's Wolf Alerts system\n\n`;
    
    // Market sentiment
    thread += `2/ Market Sentiment: ${marketData.marketSentiment?.toUpperCase() || 'NEUTRAL'}\n`;
    thread += `${marketData.stats?.highConfidenceTokens || 0} high confidence signals\n`;
    thread += `Average score: ${marketData.advancedMetrics?.averageScore || 'N/A'}/100\n\n`;
    
    // Top 3 tokens
    if (marketData.topTokens && marketData.topTokens.length >= 3) {
      thread += `3/ Top 3 Tokens:\n`;
      marketData.topTokens.slice(0, 3).forEach((token, index) => {
        thread += `${index + 1}. ${token.symbol}: +${token.priceChange24h?.toFixed(1) || '0'}%\n`;
      });
      thread += `\n`;
    }
    
    // Volume leader
    if (marketData.topTokens && marketData.topTokens.length > 0) {
      const volumeLeader = [...marketData.topTokens].sort((a, b) => b.volume24h - a.volume24h)[0];
      thread += `4/ Volume Leader: ${volumeLeader.symbol}\n`;
      thread += `$${(volumeLeader.volume24h / 1000).toFixed(0)}K volume\n`;
      thread += `Score: ${volumeLeader.score}/100\n\n`;
    }
    
    // Risk alert
    if (marketData.advancedMetrics?.riskDistribution?.high > 20) {
      thread += `5/ ⚠️ Risk Alert\n`;
      thread += `${marketData.advancedMetrics.riskDistribution.high}% high risk tokens\n`;
      thread += `Exercise caution & proper risk management\n\n`;
    }
    
    // Trading tip
    thread += `6/ Trading Tip:\n`;
    if (marketData.marketSentiment === 'bullish') {
      thread += `In bullish markets, focus on tokens with:\n`;
      thread += `• High scores (>80)\n`;
      thread += `• Good liquidity\n`;
      thread += `• Strong volume confirmation\n\n`;
    } else {
      thread += `Manage risk with:\n`;
      thread += `• Smaller position sizes\n`;
      thread += `• Tight stop losses\n`;
      thread += `• Focus on preservation\n\n`;
    }
    
    // Call to action
    thread += `7/ Want real-time alerts?\n`;
    thread += `Check out iseeiape.com for live dashboard\n`;
    thread += `Powered by Neo Dashboard v3\n\n`;
    
    thread += `#Solana #Crypto #Trading #WolfAlerts`;
    
    return thread;
  }

  saveContent(type, filename, content) {
    const filepath = path.join(this.contentDir, type, filename);
    
    if (typeof content === 'object') {
      fs.writeFileSync(filepath, JSON.stringify(content, null, 2));
    } else {
      fs.writeFileSync(filepath, content);
    }
    
    console.log(`✅ Saved ${type}: ${filepath}`);
  }

  async run() {
    try {
      console.log('🚀 Starting content generation...');
      
      // Read market data
      const dataFile = path.join(__dirname, '../data/wolf-live.json');
      if (!fs.existsSync(dataFile)) {
        console.log('❌ No market data found');
        return;
      }
      
      const rawData = fs.readFileSync(dataFile, 'utf8');
      const wolfData = JSON.parse(rawData);
      
      // Process similar to API
      const marketData = {
        topTokens: wolfData.alerts?.slice(0, 10).map(alert => ({
          symbol: alert.symbol,
          name: alert.name || alert.symbol,
          price: alert.price,
          priceChange24h: alert.price_change_24h || alert.priceChange24h || 0,
          volume24h: alert.volume_24h || alert.volume24h || 0,
          liquidity: alert.liquidity || 0,
          score: alert.score || 50,
          confidence: this.calculateConfidence(alert),
          riskLevel: this.calculateRiskLevel(alert)
        })) || [],
        marketSentiment: this.calculateMarketSentiment(wolfData.alerts || []),
        stats: {
          totalTokens: wolfData.alerts?.length || 0,
          highConfidenceTokens: wolfData.alerts?.filter(a => (a.score || 50) >= 80).length || 0
        },
        advancedMetrics: this.calculateAdvancedMetrics(wolfData.alerts || []),
        narratives: this.generateNarratives(wolfData.alerts || [])
      };
      
      // Generate content
      const results = await this.generateFromMarketData(marketData);
      
      console.log('\n🎯 Content Generation Complete!');
      console.log(`📊 Generated: ${results.tweets.length} tweets, 1 article, 1 thread`);
      console.log(`📁 Saved to: ${this.contentDir}`);
      
      return results;
      
    } catch (error) {
      console.error('❌ Content generation failed:', error);
    }
  }

  // Helper functions
  calculateConfidence(alert) {
    const factors = [];
    if (alert.volume_24h > 100000) factors.push('high-volume');
    if (alert.liquidity > 20000) factors.push('good-liquidity');
    if (alert.price_change_24h > 50) factors.push('strong-momentum');
    
    if (factors.length >= 3) return 'high';
    if (factors.length >= 2) return 'medium';
    return 'low';
  }

  calculateRiskLevel(alert) {
    if (alert.liquidity < 10000) return 'high';
    if (alert.volume_24h < 50000) return 'medium';
    return 'low';
  }

  calculateMarketSentiment(alerts) {
    const bullishCount = alerts.filter(a => (a.price_change_24h || 0) > 0).length;
    const totalCount = alerts.length;
    
    if (totalCount === 0) return 'neutral';
    
    const bullishPercentage = (bullishCount / totalCount) * 100;
    
    if (bullishPercentage >= 70) return 'bullish';
    if (bullishPercentage >= 40) return 'neutral';
    return 'bearish';
  }

  calculateAdvancedMetrics(alerts) {
    const totalAlerts = alerts.length;
    if (totalAlerts === 0) return {};
    
    const bullishCount = alerts.filter(a => (a.price_change_24h || 0) > 0).length;
    const marketBreadth = (bullishCount / totalAlerts) * 100;
    
    // Risk distribution
    const highRiskCount = alerts.filter(a => this.calculateRiskLevel(a) === 'high').length;
    const mediumRiskCount = alerts.filter(a => this.calculateRiskLevel(a) === 'medium').length;
    const lowRiskCount = alerts.filter(a => this.calculateRiskLevel(a) === 'low').length;
    
    return {
      marketBreadth: Math.round(marketBreadth),
      riskDistribution: {
        high: Math.round((highRiskCount / totalAlerts) * 100),
        medium: Math.round((mediumRiskCount / totalAlerts) * 100),
        low: Math.round((lowRiskCount / totalAlerts) * 100)
      }
    };
  }

  generateNarratives(alerts) {
    const narratives = [];
    
    // Find top performers
    const topPerformers = alerts
      .filter(a => (a.price_change_24h || 0) > 50)
      .slice(0, 3);
    
    if (topPerformers.length > 0) {
      narratives.push({
        title: '🔥 Hot Tokens Alert',
        content: `${topPerformers.map(t => t.symbol).join(', ')} showing strong momentum with gains over 50% in 24h.`,
        sentiment: 'bullish',
        priority: 'high'
      });
    }
    
    return narratives;
  }
}

// Run if called directly
if (require.main === module) {
  const generator = new ContentGenerator();
  generator.run();
}

module.exports = ContentGenerator;