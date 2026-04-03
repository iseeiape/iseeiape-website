#!/usr/bin/env node
/**
 * Content Automation Script
 * Generates daily content drops based on Wolf Pack performance
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Configuration
const DB_PATH = path.join(__dirname, '../../wolf_performance.db');
const CONTENT_DIR = path.join(__dirname, '../content/daily-drops');
const DATE = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// Ensure content directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

async function generateDailyContent() {
  console.log(`📝 Generating daily content for ${DATE}...`);
  
  try {
    // Open database
    const db = new sqlite3.Database(DB_PATH);

    // Get performance data for last 24h
    const dayAgo = Math.floor(Date.now() / 1000) - 86400;
    
    const stats = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          COUNT(*) as total_alerts,
          COUNT(CASE WHEN return_1h >= 20 THEN 1 END) as wins,
          COUNT(CASE WHEN return_1h = -999 THEN 1 END) as rug_pulls,
          AVG(CASE WHEN return_1h > -998 THEN return_1h END) as avg_return,
          MAX(CASE WHEN return_1h > -998 THEN return_1h END) as best_return,
          MIN(CASE WHEN return_1h > -998 THEN return_1h END) as worst_return
        FROM alerts
        WHERE timestamp > ?
      `, [dayAgo], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    // Get top 3 performers
    const topPerformers = await new Promise((resolve, reject) => {
      db.all(`
        SELECT symbol, category, score, return_1h, volume_24h
        FROM alerts
        WHERE timestamp > ? AND return_1h IS NOT NULL AND return_1h > -998
        ORDER BY return_1h DESC
        LIMIT 3
      `, [dayAgo], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Get worst 3 performers
    const worstPerformers = await new Promise((resolve, reject) => {
      db.all(`
        SELECT symbol, category, score, return_1h, volume_24h
        FROM alerts
        WHERE timestamp > ? AND return_1h IS NOT NULL AND return_1h > -998
        ORDER BY return_1h ASC
        LIMIT 3
      `, [dayAgo], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Get category breakdown
    const categories = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          category,
          COUNT(*) as total,
          AVG(CASE WHEN return_1h > -998 THEN return_1h END) as avg_return,
          COUNT(CASE WHEN return_1h >= 20 THEN 1 END) as wins
        FROM alerts
        WHERE timestamp > ? AND category IS NOT NULL
        GROUP BY category
        ORDER BY avg_return DESC
      `, [dayAgo], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    db.close();

    // Generate content
    const content = generateContent({
      date: DATE,
      stats: stats || {},
      topPerformers: topPerformers || [],
      worstPerformers: worstPerformers || [],
      categories: categories || []
    });

    // Save to file
    const filename = `day${Math.floor(Date.now() / 86400000) - 19400}-wolf-pack-performance-${DATE}.md`;
    const filepath = path.join(CONTENT_DIR, filename);
    
    fs.writeFileSync(filepath, content);
    console.log(`✅ Content saved to: ${filepath}`);
    
    // Also generate X/Twitter thread if we have data
    if (stats && stats.total_alerts > 0) {
      const twitterThread = generateTwitterThread({
        date: DATE,
        stats,
        topPerformers: topPerformers || [],
        worstPerformers: worstPerformers || []
      });
      
      const twitterFile = path.join(CONTENT_DIR, `twitter-thread-${DATE}.txt`);
      fs.writeFileSync(twitterFile, twitterThread);
      console.log(`🐦 Twitter thread saved to: ${twitterFile}`);
    } else {
      console.log(`⚠️  No data for Twitter thread - skipping`);
    }

  } catch (error) {
    console.error('❌ Error generating content:', error);
  }
}

function generateContent(data) {
  const { date, stats, topPerformers, worstPerformers, categories } = data;
  
  return `# Wolf Pack Performance Report - ${date}

## 📊 Daily Summary

**Time Period:** Last 24 hours  
**Total Alerts:** ${stats.total_alerts || 0}  
**Average 1h Return:** ${formatPercent(stats.avg_return || 0)}  
**Winning Alerts (+20%):** ${stats.wins || 0}  
**Rug Pulls:** ${stats.rug_pulls || 0}  
**Best Return:** ${formatPercent(stats.best_return || 0)}  
**Worst Return:** ${formatPercent(stats.worst_return || 0)}

## 🏆 Top Performers

${topPerformers.map((p, i) => `
${i + 1}. **${p.symbol}** (${p.category})
   - Return: ${formatPercent(p.return_1h)}
   - Score: ${p.score}
   - Volume: $${formatNumber(p.volume_24h || 0)}
`).join('\n')}

## 📉 Worst Performers

${worstPerformers.map((p, i) => `
${i + 1}. **${p.symbol}** (${p.category})
   - Return: ${formatPercent(p.return_1h)}
   - Score: ${p.score}
   - Volume: $${formatNumber(p.volume_24h || 0)}
`).join('\n')}

## 📈 Category Performance

${categories.map(cat => `
### ${cat.category || 'Unknown'}
- **Alerts:** ${cat.total}
- **Avg Return:** ${formatPercent(cat.avg_return || 0)}
- **Wins:** ${cat.wins || 0} (${cat.total > 0 ? Math.round((cat.wins / cat.total) * 100) : 0}%)
`).join('\n')}

## 🔍 Key Insights

${generateInsights(data)}

## 🚀 Recommendations

1. **Focus on high-performing categories** - ${categories.length > 0 ? categories[0].category : 'momentum'} showed the best average returns
2. **Avoid low-volume tokens** - Many rug pulls had minimal liquidity
3. **Set stop-losses** - Protect gains from sudden reversals
4. **Diversify across categories** - Spread risk across different signal types

---

*Generated automatically by Wolf Pack Content Automation v1.0*  
*Data source: iseeiape Wolf Pack Performance Tracker*  
*Next update: ${new Date(Date.now() + 86400000).toISOString().split('T')[0]}*
`;
}

function generateTwitterThread(data) {
  const { date, stats, topPerformers, worstPerformers } = data;
  
  return `🐺 WOLF PACK DAILY REPORT - ${date}

📊 24h Performance:
• Alerts: ${stats.total_alerts || 0}
• Avg Return: ${formatPercent(stats.avg_return || 0)}
• Wins (+20%): ${stats.wins || 0}
• Rug Pulls: ${stats.rug_pulls || 0}

🏆 TOP 3:
${topPerformers.map((p, i) => `${i + 1}. ${p.symbol}: ${formatPercent(p.return_1h)}`).join('\n')}

📉 BOTTOM 3:
${worstPerformers.map((p, i) => `${i + 1}. ${p.symbol}: ${formatPercent(p.return_1h)}`).join('\n')}

🔍 Key Insight: ${generateTwitterInsight(data)}

💡 Recommendation: ${getTopRecommendation(data)}

Full report: https://iseeiape.com/performance-dashboard

#WolfPack #Crypto #Trading #Solana #iseeiape`;
}

function generateInsights(data) {
  const { stats, categories } = data;
  const insights = [];
  
  if (stats.avg_return > 0) {
    insights.push(`The Wolf Pack showed **positive average returns** of ${formatPercent(stats.avg_return)} over the last 24 hours.`);
  } else {
    insights.push(`The market was challenging with **negative average returns** of ${formatPercent(stats.avg_return)}.`);
  }
  
  if (stats.wins > 0) {
    const winRate = (stats.wins / stats.total_alerts * 100).toFixed(1);
    insights.push(`**${stats.wins} alerts** (${winRate}%) achieved +20% returns within 1 hour.`);
  }
  
  if (stats.rug_pulls > 0) {
    const rugRate = (stats.rug_pulls / stats.total_alerts * 100).toFixed(1);
    insights.push(`**${stats.rug_pulls} tokens** (${rugRate}%) were identified as rug pulls.`);
  }
  
  if (categories.length > 0) {
    const bestCat = categories[0];
    insights.push(`**${bestCat.category}** signals performed best with ${formatPercent(bestCat.avg_return)} average returns.`);
  }
  
  return insights.map(insight => `• ${insight}`).join('\n');
}

function generateTwitterInsight(data) {
  const { stats } = data;
  
  if (!stats || !stats.total_alerts) {
    return "No alerts in last 24h - Wolf Pack is resting.";
  }
  
  if (stats.avg_return > 20) {
    return "Exceptional day! Wolf Pack crushing it with high returns across the board.";
  } else if (stats.avg_return > 0) {
    return "Solid performance with more winners than losers.";
  } else if (stats.avg_return > -20) {
    return "Challenging market conditions but some gems still shining.";
  } else {
    return "Tough day in the markets - time to tighten filters and wait for better conditions.";
  }
}

function getTopRecommendation(data) {
  const { stats, categories } = data;
  
  if (!stats || !stats.total_alerts) {
    return "No recent data - check Wolf Pack monitoring system.";
  }
  
  if (stats.rug_pulls > stats.total_alerts * 0.3) {
    return "Increase minimum liquidity threshold to avoid rug pulls.";
  } else if (stats.avg_return < -10) {
    return "Focus on higher score alerts and wait for market recovery.";
  } else if (categories && categories.length > 0 && categories[0].avg_return > 10) {
    return `Double down on ${categories[0].category} signals - they're performing well.`;
  } else {
    return "Stay disciplined with stop-losses and take profits at +20-30%.";
  }
}

function formatPercent(num) {
  if (num === null || num === undefined) return 'N/A';
  return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
}

function formatNumber(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toFixed(0);
}

// Run if called directly
if (require.main === module) {
  generateDailyContent();
}

module.exports = { generateDailyContent };