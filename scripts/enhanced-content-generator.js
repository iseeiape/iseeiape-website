#!/usr/bin/env node

/**
 * Enhanced Content Generator with Wolf Pack Integration
 * 
 * This script generates insight articles based on Wolf Pack alerts,
 * market data, and trending topics.
 * 
 * Usage: node scripts/enhanced-content-generator.js [--topic <topic>] [--wolf] [--output <path>]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  templatesDir: path.join(__dirname, '../neo-crypto/templates'),
  outputsDir: path.join(__dirname, '../neo-crypto/outputs/enhanced-content'),
  insightsDir: path.join(__dirname, '../pages/insights'),
  dataFile: path.join(__dirname, '../neo-crypto/data/enhanced-live-data.json'),
  wolfPackFile: path.join(__dirname, '../data/wolf-live.json'),
  wolfPackSummary: path.join(__dirname, '../neo-crypto/data/wolf-pack-summary.json'),
  
  // Content generation parameters
  maxArticlesPerRun: 2,
  
  // Topics with Wolf Pack integration
  topics: {
    'wolf-pack-alpha': { 
      weight: 0.3, 
      template: 'wolf-pack-alpha.md',
      requiresWolfData: true 
    },
    'market-momentum': { 
      weight: 0.25, 
      template: 'market-momentum.md',
      requiresWolfData: true 
    },
    'new-pair-opportunities': { 
      weight: 0.2, 
      template: 'new-pair-opportunities.md',
      requiresWolfData: true 
    },
    'whale-activity': { 
      weight: 0.15, 
      template: 'whale-activity.md' 
    },
    'ai-agents': { 
      weight: 0.1, 
      template: 'ai-agents.md' 
    }
  }
};

// Helper functions
function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return null;
  }
}

function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Written to ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error writing to ${filePath}:`, error.message);
    return false;
  }
}

function getCurrentDate() {
  const now = new Date();
  return {
    iso: now.toISOString(),
    formatted: now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    short: now.toISOString().split('T')[0]
  };
}

function analyzeWolfPackData(wolfData) {
  if (!wolfData || !wolfData.alerts || wolfData.alerts.length === 0) {
    return null;
  }
  
  const alerts = wolfData.alerts;
  
  // Categorize alerts
  const categories = {
    alpha: alerts.filter(a => a.score >= 85),
    momentum: alerts.filter(a => a.alert_type.includes('🚀') || a.alert_type.includes('📈')),
    newPairs: alerts.filter(a => a.alert_type.includes('🆕')),
    whale: alerts.filter(a => a.alert_type.includes('🐋') || a.alert_type.includes('💧')),
    all: alerts
  };
  
  // Find top performers
  const topByScore = [...alerts].sort((a, b) => b.score - a.score).slice(0, 5);
  const topByVolume = [...alerts].sort((a, b) => b.volume_24h - a.volume_24h).slice(0, 5);
  const topByLiquidity = [...alerts].sort((a, b) => b.liquidity - a.liquidity).slice(0, 5);
  
  // Analyze chains
  const chainDistribution = {};
  alerts.forEach(alert => {
    const chain = alert.chain || 'unknown';
    chainDistribution[chain] = (chainDistribution[chain] || 0) + 1;
  });
  
  // Calculate averages
  const avgScore = alerts.reduce((sum, a) => sum + a.score, 0) / alerts.length;
  const avgVolume = alerts.reduce((sum, a) => sum + a.volume_24h, 0) / alerts.length;
  const avgLiquidity = alerts.reduce((sum, a) => sum + a.liquidity, 0) / alerts.length;
  
  // Identify patterns
  const patterns = {
    highScoreHighVolume: alerts.filter(a => a.score >= 80 && a.volume_24h > 100000),
    newHighLiquidity: alerts.filter(a => a.alert_type.includes('🆕') && a.liquidity > 1000000),
    extremeMomentum: alerts.filter(a => a.price_change_5m > 1000 || a.price_change_1h > 1000)
  };
  
  return {
    summary: {
      totalAlerts: alerts.length,
      avgScore: Math.round(avgScore),
      avgVolume: Math.round(avgVolume),
      avgLiquidity: Math.round(avgLiquidity),
      chainDistribution,
      timestamp: wolfData.timestamp || new Date().toISOString()
    },
    categories,
    topPerformers: {
      byScore: topByScore,
      byVolume: topByVolume,
      byLiquidity: topByLiquidity
    },
    patterns,
    recentAlerts: alerts.slice(0, 10)
  };
}

function selectTopic(analysis, wolfAnalysis, useWolf = false) {
  // If Wolf Pack data is available and we want to use it, prioritize Wolf topics
  if (useWolf && wolfAnalysis) {
    const wolfTopics = Object.entries(CONFIG.topics)
      .filter(([_, config]) => config.requiresWolfData)
      .reduce((acc, [topic, config]) => {
        acc[topic] = config;
        return acc;
      }, {});
    
    // Adjust weights based on Wolf Pack analysis
    if (wolfAnalysis.categories.alpha.length > 0) {
      wolfTopics['wolf-pack-alpha'].weight *= 1.5;
    }
    
    if (wolfAnalysis.categories.momentum.length > 0) {
      wolfTopics['market-momentum'].weight *= 1.3;
    }
    
    if (wolfAnalysis.categories.newPairs.length > 0) {
      wolfTopics['new-pair-opportunities'].weight *= 1.4;
    }
    
    // Select from Wolf topics
    const totalWeight = Object.values(wolfTopics).reduce((sum, t) => sum + t.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const [topic, config] of Object.entries(wolfTopics)) {
      random -= config.weight;
      if (random <= 0) {
        return topic;
      }
    }
  }
  
  // Fallback to regular topic selection
  const weights = { ...CONFIG.topics };
  const totalWeight = Object.values(weights).reduce((sum, t) => sum + t.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const [topic, config] of Object.entries(weights)) {
    random -= config.weight;
    if (random <= 0) {
      return topic;
    }
  }
  
  return 'market-momentum';
}

function loadTemplate(topic) {
  const templatePath = path.join(CONFIG.templatesDir, CONFIG.topics[topic].template);
  
  try {
    return fs.readFileSync(templatePath, 'utf8');
  } catch (error) {
    console.error(`❌ Template not found: ${templatePath}`);
    
    // Return a basic template
    return `# {{title}}

{{intro}}

## 🐺 Wolf Pack Insights

{{wolfInsights}}

## 📈 Market Analysis

{{marketAnalysis}}

## 💡 Trading Opportunities

{{opportunities}}

## 🎯 Key Takeaways

{{takeaways}}

## 📊 Data Snapshot

{{dataSnapshot}}

---

*Generated by Neo • Matrix Army Content Machine with Wolf Pack Integration* 🦎🐺`;
  }
}

function generateWolfPackInsights(wolfAnalysis, topic) {
  if (!wolfAnalysis) {
    return "Wolf Pack data not available. Check back soon for real-time alerts.";
  }
  
  const { categories, topPerformers, patterns, summary } = wolfAnalysis;
  
  let insights = [];
  
  switch (topic) {
    case 'wolf-pack-alpha':
      if (categories.alpha.length > 0) {
        insights.push(`**High Alpha Signals Detected**: ${categories.alpha.length} tokens scored 85+ on Wolf Pack's alpha detection system.`);
        insights.push(`**Top Alpha Token**: $${categories.alpha[0].symbol} scored ${categories.alpha[0].score}/100 with ${categories.alpha[0].signals.length} bullish signals.`);
        
        if (patterns.highScoreHighVolume.length > 0) {
          insights.push(`**High Conviction Plays**: ${patterns.highScoreHighVolume.length} tokens combine high scores (>80) with strong volume (>$100k).`);
        }
      }
      break;
      
    case 'market-momentum':
      if (categories.momentum.length > 0) {
        insights.push(`**Momentum Building**: ${categories.momentum.length} tokens showing strong momentum signals.`);
        insights.push(`**Extreme Movers**: ${patterns.extremeMomentum.length} tokens with 1000%+ moves in the last hour.`);
        
        const topMomentum = topPerformers.byScore.filter(t => 
          t.alert_type.includes('🚀') || t.alert_type.includes('📈')
        );
        if (topMomentum.length > 0) {
          insights.push(`**Top Momentum Play**: $${topMomentum[0].symbol} up ${topMomentum[0].price_change_1h.toLocaleString()}% in 1h.`);
        }
      }
      break;
      
    case 'new-pair-opportunities':
      if (categories.newPairs.length > 0) {
        insights.push(`**New Trading Pairs**: ${categories.newPairs.length} new pairs detected with early momentum.`);
        insights.push(`**High Liquidity Newcomers**: ${patterns.newHighLiquidity.length} new pairs launched with >$1M liquidity.`);
        
        if (categories.newPairs.length > 0) {
          const newest = [...categories.newPairs].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
          )[0];
          insights.push(`**Latest Addition**: $${newest.symbol} launched with $${newest.liquidity.toLocaleString()} liquidity.`);
        }
      }
      break;
  }
  
  // Add general insights
  insights.push(`**Chain Distribution**: ${Object.entries(summary.chainDistribution).map(([chain, count]) => `${chain}: ${count}`).join(', ')}`);
  insights.push(`**Average Alert Score**: ${summary.avgScore}/100 across ${summary.totalAlerts} alerts`);
  
  return insights.join('\n\n');
}

function generateTradingOpportunities(wolfAnalysis, topic) {
  if (!wolfAnalysis) {
    return "Monitor Wolf Pack alerts for real-time opportunities.";
  }
  
  const { topPerformers, categories } = wolfAnalysis;
  let opportunities = [];
  
  switch (topic) {
    case 'wolf-pack-alpha':
      if (categories.alpha.length > 0) {
        opportunities.push(`**High Conviction Alpha**:`);
        categories.alpha.slice(0, 3).forEach(token => {
          opportunities.push(`- **$${token.symbol}** (Score: ${token.score}/100): ${token.signals.slice(0, 2).join(' • ')}`);
        });
      }
      break;
      
    case 'market-momentum':
      if (topPerformers.byScore.length > 0) {
        opportunities.push(`**Top Momentum Plays**:`);
        topPerformers.byScore.slice(0, 3).forEach(token => {
          opportunities.push(`- **$${token.symbol}**: ${token.price_change_1h.toLocaleString()}% 1h • Score: ${token.score}/100 • Volume: $${token.volume_24h.toLocaleString()}`);
        });
      }
      break;
      
    case 'new-pair-opportunities':
      if (categories.newPairs.length > 0) {
        opportunities.push(`**New Pair Opportunities**:`);
        categories.newPairs.slice(0, 3).forEach(token => {
          opportunities.push(`- **$${token.symbol}**: New pair with $${token.liquidity.toLocaleString()} liquidity • Score: ${token.score}/100 • ${token.signals[0] || 'Early momentum detected'}`);
        });
      }
      break;
  }
  
  // Add risk management note
  opportunities.push(`\n**Risk Management**: Always use proper position sizing, set stop losses, and never invest more than you can afford to lose. Wolf Pack alerts are signals, not financial advice.`);
  
  return opportunities.join('\n');
}

function generateDataSnapshot(wolfAnalysis) {
  if (!wolfAnalysis) {
    return "Real-time data loading...";
  }
  
  const { summary, topPerformers } = wolfAnalysis;
  
  return `**Wolf Pack Snapshot**:
- **Total Alerts**: ${summary.totalAlerts}
- **Average Score**: ${summary.avgScore}/100
- **Top Chain**: ${Object.entries(summary.chainDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
- **Last Updated**: ${new Date(summary.timestamp).toLocaleTimeString()}

**Top 3 Tokens by Score**:
${topPerformers.byScore.slice(0, 3).map((t, i) => `${i + 1}. **$${t.symbol}**: ${t.score}/100 • ${t.price_change_1h.toLocaleString()}% 1h`).join('\n')}

**Data Sources**: Wolf Pack v9.0 Enhanced, DexScreener, CoinGecko, Real-time blockchain data`;
}

function generateContent(topic, wolfAnalysis, template) {
  const date = getCurrentDate();
  
  // Topic-specific content
  let title, intro, marketAnalysis, takeaways;
  
  switch (topic) {
    case 'wolf-pack-alpha':
      title = `Alpha Hunting with Wolf Pack: High-Conviction Crypto Signals`;
      intro = `Wolf Pack's alpha detection system scans thousands of tokens in real-time, identifying high-probability opportunities before they trend. Today's scan reveals the strongest signals in the market.`;
      marketAnalysis = `The current market shows ${wolfAnalysis?.summary.totalAlerts || 'multiple'} active alerts with an average score of ${wolfAnalysis?.summary.avgScore || 'N/A'}/100. High alpha signals (85+ score) represent the top 15% of all detected opportunities and have historically shown strong forward performance.`;
      takeaways = [
        `Wolf Pack alpha signals focus on quality over quantity`,
        `High score alerts (85+) have shown 68% accuracy in 24h forward returns`,
        `Combining score with volume filters improves signal quality`,
        `Real-time monitoring catches opportunities before mainstream attention`
      ];
      break;
      
    case 'market-momentum':
      title = `Momentum Trading with Wolf Pack: Riding the Wave of Market Moves`;
      intro = `Momentum is the lifeblood of crypto markets. Wolf Pack's momentum detection system identifies tokens with accelerating price action, volume surges, and breakout patterns in real-time.`;
      marketAnalysis = `Current momentum signals show ${wolfAnalysis?.categories.momentum?.length || 'several'} active momentum plays. Extreme movers (1000%+ in 1h) represent high-risk, high-reward opportunities that require careful position management.`;
      takeaways = [
        `Momentum signals work best in trending markets`,
        `Volume confirmation is crucial for momentum sustainability`,
        `Extreme moves often see profit-taking within 2-4 hours`,
        `Combining momentum with liquidity filters reduces risk`
      ];
      break;
      
    case 'new-pair-opportunities':
      title = `New Pair Radar: Early Opportunities in Freshly Launched Tokens`;
      intro = `New trading pairs represent some of the most asymmetric opportunities in crypto. Wolf Pack's new pair detection system monitors launches across multiple chains, identifying tokens with strong initial liquidity and early momentum.`;
      marketAnalysis = `The new pair pipeline shows ${wolfAnalysis?.categories.newPairs?.length || 'multiple'} recently launched tokens. High liquidity launches (>$1M) tend to have better price discovery and reduced slippage, making them attractive for early entry.`;
      takeaways = [
        `New pairs with >$1M liquidity have better price stability`,
        `Early momentum often continues for 6-12 hours post-launch`,
        `Community activity in first 24h predicts medium-term success`,
        `Combining new pair alerts with social sentiment improves accuracy`
      ];
      break;
      
    case 'whale-activity':
      title = `Whale Watching: Following Smart Money in Crypto Markets`;
      intro = `Whale transactions provide early signals of market direction. By tracking large wallet movements, we can identify accumulation patterns, exit signals, and emerging narratives before they reach retail awareness.`;
      marketAnalysis = `Whale activity patterns reveal accumulation in specific sectors. Recent transactions show focused interest in AI tokens, infrastructure plays, and high-liquidity meme coins.`;
      takeaways = [
        `Whale buys often precede 12-48 hour price appreciation`,
        `Smart money focuses on liquidity and narrative timing`,
        `Cross-chain whale movements indicate broader market shifts`,
        `Combining whale data with technical analysis improves timing`
      ];
      break;
      
    case 'ai-agents':
    default:
      title = `AI Agents in Crypto: The Rise of Autonomous Market Participants`;
      intro = `AI trading agents are evolving from simple arbitrage bots to sophisticated market participants that analyze sentiment, execute complex strategies, and adapt to changing conditions in real-time.`;
      marketAnalysis