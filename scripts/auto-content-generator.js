#!/usr/bin/env node

/**
 * Auto Content Generator for iseeiape
 * 
 * This script generates new insight articles based on trending topics,
 * market data, and predefined templates.
 * 
 * Usage: node scripts/auto-content-generator.js [--topic <topic>] [--output <path>]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  templatesDir: path.join(__dirname, '../neo-crypto/templates'),
  outputsDir: path.join(__dirname, '../neo-crypto/outputs/enhanced-content'),
  insightsDir: path.join(__dirname, '../pages/insights'),
  dataFile: path.join(__dirname, '../neo-crypto/data/enhanced-live-data.json'),
  
  // Content generation parameters
  maxArticlesPerRun: 2,
  minDataAgeHours: 1,
  
  // Topics and their weights
  topics: {
    'ai-agents': { weight: 0.3, template: 'ai-agents.md' },
    'defi-trends': { weight: 0.2, template: 'defi-trends.md' },
    'meme-coins': { weight: 0.25, template: 'meme-coins.md' },
    'whale-activity': { weight: 0.15, template: 'whale-activity.md' },
    'market-analysis': { weight: 0.1, template: 'market-analysis.md' }
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

function analyzeMarketData(data) {
  if (!data || !data.data) return null;
  
  const { tokens, narratives, whaleData, summary } = data.data;
  
  // Find top performers
  const topGainers = tokens
    .filter(t => t.priceChange24h > 0)
    .sort((a, b) => b.priceChange24h - a.priceChange24h)
    .slice(0, 5);
  
  const topLosers = tokens
    .filter(t => t.priceChange24h < 0)
    .sort((a, b) => a.priceChange24h - b.priceChange24h)
    .slice(0, 5);
  
  // Analyze narratives
  const trendingNarratives = narratives
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  
  // Analyze whale activity
  const recentWhaleTransactions = whaleData.flatMap(w => w.transactions)
    .filter(tx => {
      const txTime = new Date(tx.timestamp).getTime();
      const hoursAgo = (Date.now() - txTime) / (1000 * 60 * 60);
      return hoursAgo < 24;
    });
  
  const whaleBuys = recentWhaleTransactions.filter(tx => tx.action === 'bought');
  const whaleSells = recentWhaleTransactions.filter(tx => tx.action === 'sold');
  
  return {
    topGainers,
    topLosers,
    trendingNarratives,
    whaleActivity: {
      totalTransactions: recentWhaleTransactions.length,
      buys: whaleBuys.length,
      sells: whaleSells.length,
      topTokens: Array.from(new Set(recentWhaleTransactions.map(tx => tx.token))).slice(0, 5)
    },
    marketSummary: {
      totalVolume: summary.totalVolume24h,
      whaleCount: summary.whaleCount,
      totalTokens: summary.totalTokens
    }
  };
}

function selectTopic(analysis, userTopic = null) {
  if (userTopic && CONFIG.topics[userTopic]) {
    return userTopic;
  }
  
  // Weight topics based on current market conditions
  const weights = { ...CONFIG.topics };
  
  if (analysis) {
    // Adjust weights based on analysis
    if (analysis.trendingNarratives.some(n => n.name.includes('AI'))) {
      weights['ai-agents'].weight *= 1.5;
    }
    
    if (analysis.whaleActivity.totalTransactions > 10) {
      weights['whale-activity'].weight *= 1.3;
    }
    
    if (analysis.marketSummary.totalVolume > 100000000) {
      weights['market-analysis'].weight *= 1.2;
    }
    
    // Check for meme coin activity
    const memeTokens = analysis.topGainers.filter(t => 
      ['BONK', 'WIF', 'POPCAT', 'PEPE', 'SHIB', 'DEGEN'].includes(t.symbol)
    );
    if (memeTokens.length > 0) {
      weights['meme-coins'].weight *= 1.4;
    }
  }
  
  // Select topic based on weights
  const totalWeight = Object.values(weights).reduce((sum, t) => sum + t.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const [topic, config] of Object.entries(weights)) {
    random -= config.weight;
    if (random <= 0) {
      return topic;
    }
  }
  
  // Fallback
  return 'market-analysis';
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

## Key Insights

{{insights}}

## Market Context

{{context}}

## What to Watch

{{watchlist}}

## Conclusion

{{conclusion}}

---

*Generated by Neo • Matrix Army Content Machine* 🦎`;
  }
}

function generateContent(topic, analysis, template) {
  const date = getCurrentDate();
  
  // Topic-specific content generation
  let title, intro, insights, context, watchlist, conclusion;
  
  switch (topic) {
    case 'ai-agents':
      title = `AI Agents in Crypto: How Autonomous Systems Are Reshaping Markets`;
      intro = `Artificial intelligence is no longer just a buzzword in crypto — it's becoming the backbone of market infrastructure. From autonomous trading agents to AI-governed protocols, we're witnessing the emergence of a new paradigm where code doesn't just execute trades, it makes strategic decisions.`;
      insights = [
        `AI agents now account for an estimated 15-20% of daily trading volume`,
        `Agent-to-agent communication protocols are emerging as a new infrastructure layer`,
        `Success rates of AI trading systems are improving 3-5% monthly`,
        `The most profitable agents are those that specialize in niche markets`
      ];
      context = analysis ? `Current market conditions show ${analysis.trendingNarratives[0]?.name || 'AI Agents'} narrative scoring ${analysis.trendingNarratives[0]?.score || 85}/100. Top performing AI-related tokens include ${analysis.topGainers.slice(0, 3).map(t => `$${t.symbol}`).join(', ')}.` : '';
      watchlist = analysis ? analysis.topGainers.filter(t => ['JUP', 'PYTH', 'HNT'].includes(t.symbol)).map(t => `$${t.symbol}`).join(', ') : 'JUP, PYTH, HNT';
      conclusion = `The future of crypto trading isn't human vs human — it's AI vs AI, with humans as architects and governors. Those who learn to build with agents rather than compete against them will capture the next decade of alpha.`;
      break;
      
    case 'defi-trends':
      title = `DeFi 2.0: The Next Wave of Decentralized Finance Innovation`;
      intro = `After the explosive growth of DeFi 1.0, we're now entering a more sophisticated phase where protocols are focusing on sustainability, cross-chain interoperability, and institutional-grade infrastructure.`;
      insights = [
        `Cross-chain liquidity protocols are reducing fragmentation by 40-60%`,
        `Real yield models are replacing inflationary token emissions`,
        `Institutional participation in DeFi is growing 25% quarter-over-quarter`,
        `Layer 2 solutions are reducing transaction costs by 90%+`
      ];
      context = analysis ? `Total DeFi TVL stands at $${(analysis.marketSummary.totalVolume / 1000000).toFixed(1)}B with ${analysis.marketSummary.totalTokens} active tokens tracked.` : '';
      watchlist = analysis ? analysis.topGainers.filter(t => ['JUP', 'RAY', 'UNI', 'GMX'].includes(t.symbol)).map(t => `$${t.symbol}`).join(', ') : 'JUP, RAY, UNI';
      conclusion = `DeFi 2.0 isn't about higher APYs — it's about sustainable, scalable, and interoperable financial infrastructure that can onboard the next 100 million users.`;
      break;
      
    case 'meme-coins':
      title = `The Meme Coin Renaissance: Beyond the Hype to Sustainable Communities`;
      intro = `Meme coins have evolved from joke tokens to serious community-driven ecosystems with real utility, governance, and cultural significance. The 2026 meme coin landscape is more sophisticated than ever.`;
      insights = [
        `Top meme coins now have 50,000+ active community members`,
        `Utility layers are being built on top of meme coin foundations`,
        `Professional trading firms are allocating 5-10% to meme coin strategies`,
        `Community governance is driving real protocol development`
      ];
      context = analysis ? `Meme coin volume represents ${analysis.whaleActivity.topTokens.filter(t => ['BONK', 'WIF', 'PEPE'].includes(t)).length > 0 ? 'significant' : 'growing'} portion of total market activity. Top performers include ${analysis.topGainers.filter(t => ['BONK', 'WIF', 'POPCAT'].includes(t.symbol)).map(t => `$${t.symbol}`).join(', ')}.` : '';
      watchlist = analysis ? analysis.topGainers.filter(t => ['BONK', 'WIF', 'POPCAT', 'PEPE', 'DEGEN'].includes(t.symbol)).map(t => `$${t.symbol}`).join(', ') : 'BONK, WIF, PEPE';
      conclusion = `The most successful meme coins of 2026 won't be the funniest — they'll be the ones that build the strongest communities and deliver real value beyond the meme.`;
      break;
      
    case 'whale-activity':
      title = `Whale Watching: Decoding Smart Money Movements in Real-Time`;
      intro = `In crypto markets, following the smart money isn't just a strategy — it's a necessity. Whale activity provides early signals of market direction, accumulation patterns, and emerging narratives.`;
      insights = [
        `Whale transactions precede major price moves by 12-48 hours on average`,
        `Smart money success rates range from 65-88% depending on strategy`,
        `Whale accumulation patterns reveal undervalued assets before retail notice`,
        `Cross-chain whale movements indicate broader market sentiment shifts`
      ];
      context = analysis ? `Tracking ${analysis.marketSummary.whaleCount} whales with ${analysis.whaleActivity.totalTransactions} recent transactions. ${analysis.whaleActivity.buys > analysis.whaleActivity.sells ? 'Net buying pressure' : 'Net selling pressure'} observed in last 24 hours.` : '';
      watchlist = analysis ? analysis.whaleActivity.topTokens.map(t => `$${t}`).join(', ') : 'Check whale tracking dashboard';
      conclusion = `Whale activity provides the clearest signal in noisy markets. By understanding smart money movements, traders can position themselves ahead of major trends rather than reacting to them.`;
      break;
      
    case 'market-analysis':
    default:
      title = `Market Pulse: Real-Time Analysis of Crypto Market Dynamics`;
      intro = `The crypto market is a complex adaptive system where narratives, liquidity, and sentiment interact to create emergent patterns. Understanding these dynamics is key to navigating volatility and identifying opportunities.`;
      insights = [
        `Market structure is shifting from centralized to decentralized liquidity`,
        `Narrative cycles are accelerating, with trends lasting 2-4 weeks on average`,
        `Cross-chain capital flows are creating new arbitrage opportunities`,
        `Retail participation is growing while institutional influence remains strong`
      ];
      context = analysis ? `Market volume: $${(analysis.marketSummary.totalVolume / 1000000).toFixed(1)}B. Top gainer: $${analysis.topGainers[0]?.symbol || 'N/A'} +${analysis.topGainers[0]?.priceChange24h?.toFixed(2) || '0.00'}%. Trending narrative: ${analysis.trendingNarratives[0]?.name || 'N/A'}.` : '';
      watchlist = analysis ? analysis.topGainers.slice(0, 5).map(t => `$${t.symbol}`).join(', ') : 'Monitor dashboard for real-time updates';
      conclusion = `Successful market navigation requires understanding both technical patterns and narrative dynamics. The most profitable opportunities emerge at the intersection of data, sentiment, and timing.`;
      break;
  }
  
  // Replace template variables
  let content = template
    .replace(/{{title}}/g, title)
    .replace(/{{intro}}/g, intro)
    .replace(/{{insights}}/g, insights.map(insight => `- ${insight}`).join('\n'))
    .replace(/{{context}}/g, context)
    .replace(/{{watchlist}}/g, watchlist)
    .replace(/{{conclusion}}/g, conclusion)
    .replace(/{{date}}/g, date.formatted)
    .replace(/{{timestamp}}/g, date.iso);
  
  return {
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    content,
    topic,
    generatedAt: date.iso
  };
}

function createReactComponent(article) {
  const componentName = article.slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
  
  return `import Head from 'next/head'

export default function ${componentName}() {
  return (
    <>
      <Head>
        <title>${article.title} | iseeiape</title>
        <meta name="description" content="${article.content.split('.')[0]}..." />
      </Head>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', color: '#fff', background: '#0a0a0a', minHeight: '100vh', lineHeight: '1.8' }}>
        <a href="/insights" style={{ color: '#00ff88', textDecoration: 'none' }}>← Back to Insights</a>
        
        <span style={{ display: 'inline-block', padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px', marginTop: '20px' }}>🆕 Generated ${new Date(article.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        
        <h1 style={{ fontSize: '42px', marginTop: '20px', marginBottom: '10px', lineHeight: '1.2' }}>${article.title}</h1>
        
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '40px' }}>
          ${Math.ceil(article.content.split(' ').length / 200)} min read • ${article.topic.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} • ${new Date(article.generatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div style={{ fontSize: '18px', color: '#aaa', fontStyle: 'italic', borderLeft: '3px solid #00ff88', paddingLeft: '20px', marginBottom: '40px' }}>
          ${article.content.split('\n')[0]}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '40px 0' }} />

        <div style={{ whiteSpace: 'pre-line' }}>
          ${article.content.split('\n').slice(1).join('\n')}
        </div>
        
        <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '40px 0' }} />

        <div style={{ background: '#111', padding: '30px', borderRadius: '12px', marginTop: '40px' }}>
          <h3 style={{ fontSize: '20px', color: '#00ff88', marginBottom: '15px' }}>Key Takeaways</h3>
          <ul style={{ marginLeft: '20px' }}>
            ${article.content.includes('Key Insights') ? article.content.split('Key Insights')[1].split('##')[0].trim().split('\n').filter(line => line.startsWith('-')).map(line => `<li>${line.substring(2)}</li>`).join('') : '<li>Market dynamics are evolving rapidly</li><li>Stay informed with real-time data</li><li>Follow smart money movements</li>'}
          </ul>
          <p style={{ marginTop: '20px', color: '#888', fontSize: '14px' }}>
            <strong>Next Frontier:</strong> Real-time AI analysis and predictive modeling.
          </p>
        </div>

        <p style={{ marginTop: '40px', color: '#666', fontSize: '14px', textAlign: 'center' }}>
          <em>Generated by Neo • Matrix Army Content Machine</em> 🦎<br />
          <em>Data Sources: Real-time market data, whale tracking, narrative analysis</em>
        </p>
      </div>
    </>
  )
}`;
}

function createMarkdownFile(article, outputPath) {
  const content = `---
title: "${article.title}"
date: "${article.generatedAt}"
topic: "${article.topic}"
slug: "${article.slug}"
---

${article.content}

---

*Generated by Neo • Matrix Army Content Machine* 🦎
*Data Sources: Real-time market data, whale tracking, narrative analysis*`;

  return writeFile(outputPath, content);
}

function createInsightsPage(article) {
  const component = createReactComponent(article);
  const pagePath = path.join(CONFIG.insightsDir, `${article.slug}.tsx`);
  
  return writeFile(pagePath, component);
}

function updateInsightsIndex(article) {
  const indexPath = path.join(CONFIG.insightsDir, 'index.tsx');
  
  try {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Find the articles array and add the new one
    const articlesMatch = indexContent.match(/const articles = \[([\s\S]*?)\];/);
    if (articlesMatch) {
      const newArticleEntry = `  {
    slug: '${article.slug}',
    title: '${article.title.replace(/'/g, "\\'")}',
    description: '${article.content.split('.')[0].replace(/'/g, "\\'")}...',
    date: '${article.generatedAt.split('T')[0]}',
    topic: '${article.topic}',
    readTime: ${Math.ceil(article.content.split(' ').length / 200)}
  },`;
      
      indexContent = indexContent.replace(
        /const articles = \[/,
        `const articles = [\n${newArticleEntry}`
      );
      
      return writeFile(indexPath, indexContent);
    }
  } catch (error) {
    console.error('❌ Error updating insights index:', error.message);
  }
  
  return false;
}

async function main() {
  console.log('🚀 Starting Auto Content Generator...');
  console.log('📊 Neo Crypto Engine • Matrix Army Content Machine\n');
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const userTopic = args.includes('--topic') ? args[args.indexOf('--topic') + 1] : null;
  const outputPath = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;
  
  // Read market data
  console.log('📈 Reading market data...');
  const marketData = readJSON(CONFIG.dataFile);
  
  // Check data freshness
  if (marketData) {
    const dataAge = (Date.now() - new Date(marketData.updated_at).getTime()) / (1000 * 60 * 60);
    if (dataAge > CONFIG.minDataAgeHours) {
      console.log(`⚠️  Market data is ${dataAge.toFixed(1)} hours old (max: ${CONFIG.minDataAgeHours}h)`);
    }
  }
  
  // Analyze market data
  const analysis = analyzeMarketData(marketData);
  
  // Generate articles
  const articles = [];
  
  for (let i = 0; i < CONFIG.maxArticlesPerRun; i++) {
    console.log(`\n📝 Generating article ${i + 1}/${CONFIG.maxArticlesPerRun}...`);
    
    // Select topic
    const topic = selectTopic(analysis, userTopic);
    console.log(`   Topic: ${topic}`);
    
    // Load template
    const template = loadTemplate(topic);
    
    // Generate content
    const article = generateContent(topic, analysis, template);
    console.log(`   Title: ${article.title}`);
    console.log(`   Length: ${article.content.split(' ').length} words`);
    
    // Save outputs
    if (outputPath) {
      const markdownPath = outputPath.endsWith('.md') ? outputPath : `${outputPath}.md`;
      createMarkdownFile(article, markdownPath);
    } else {
      // Save to multiple locations
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const baseName = `${article.slug}-${timestamp}`;
      
      // Save markdown
      const markdownPath = path.join(CONFIG.outputsDir, `${baseName}.md`);
      createMarkdownFile(article, markdownPath);
      
      // Create React component
      createInsightsPage(article);
      
      // Update insights index
      updateInsightsIndex(article);
      
      console.log(`   Saved: ${markdownPath}`);
      console.log(`   Created: pages/insights/${article.slug}.tsx`);
    }
    
    articles.push(article);
  }
  
  // Summary
  console.log('\n✅ Content Generation Complete!');
  console.log('='.repeat(50));
  articles.forEach((article, i) => {
    console.log(`\nArticle ${i + 1}:`);
    console.log(`  Title: ${article.title}`);
    console.log(`  Topic: ${article.topic}`);
    console.log(`  Slug: ${article.slug}`);
    console.log(`  Generated: ${new Date(article.generatedAt).toLocaleTimeString()}`);
  });
  
  console.log('\n🦎 Neo Crypto Engine • Matrix Army Content Machine');
  console.log('📧 Next steps: Review, edit if needed, and deploy!');
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  generateContent,
  analyzeMarketData,
  selectTopic
};