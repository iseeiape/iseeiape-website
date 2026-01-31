// Insights/Blog page - Full article view capability
"use client";

import { useState } from 'react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  fullContent?: string;
  date: string;
  category: string;
  readTime: string;
  slug: string;
}

const articles: Article[] = [
  {
    id: '1',
    title: 'How to Read Solana On-Chain Data: Beginner\'s Guide',
    excerpt: 'Learn the basics of on-chain analysis and how to track smart money wallets on Solana.',
    date: '2025-01-31',
    category: 'Education',
    readTime: '8 min read',
    slug: 'onchain-beginners-guide',
    fullContent: `# How to Read Solana On-Chain Data: Beginner's Guide

If you're trading meme coins on Solana and not looking at on-chain data, you're flying blind.

## What Is On-Chain Data?

On-chain data is every transaction that happens on the blockchain, recorded permanently and publicly.

## Why On-Chain Data Matters

Here's the truth: By the time a token is trending on Twitter, the smart money has already made their money.

## Key Metrics to Watch

### 1. Wallet Profitability
Look for wallets with:
- Realized PnL over $50K
- Win rate above 60%
- Consistent activity over 30+ days

### 2. Volume Patterns
- Organic volume: Gradual increase with holder growth
- Fake volume: Sudden spikes with no holder increase

### 3. Holder Distribution
- Concentration: One wallet holding >10% = can dump on you
- Growth: Steady holder increase = healthy distribution

## Tools You Need

1. **Cielo Finance** - Wallet tracking and alerts
2. **DexScreener** - Token charts and metrics
3. **Solscan** - Deep transaction analysis
4. **iseeiape** - Aggregated trending data

## Start Here: Your First Week

**Day 1-2:** Set up tools
**Day 3-4:** Just watch and observe
**Day 5-7:** Paper trade
**Week 2+:** Small real trades

## The Bottom Line

On-chain data won't make you rich overnight. But it WILL give you an edge over traders who are just following Twitter hype.`
  },
  {
    id: '2',
    title: 'Top 10 Solana Smart Money Wallets to Watch in 2025',
    excerpt: 'The most profitable and consistent smart money wallets on Solana.',
    date: '2025-01-31',
    category: 'Wallet Spotlight',
    readTime: '10 min read',
    slug: 'top-10-wallets-2025',
    fullContent: `# Top 10 Solana Smart Money Wallets to Watch in 2025

I've tracked hundreds of wallets over the past 6 months. These 10 are the ones I watch closest.

## What Makes a "Smart Money" Wallet?

✅ 30+ day track record  
✅ $50K+ realized profits  
✅ 60%+ win rate  
✅ Consistent activity  
✅ Risk management

## The Wallets

### 1. Whale #47 (The Early Bird)
**30D PnL:** +$127,450  
**Win Rate:** 68%

Uncanny ability to find tokens at $100K-300K MC that pump to $1M+.

### 2. Smart Money Alpha (The Consistent Winner)
**30D PnL:** +$89,200  
**Win Rate:** 72%

Highest win rate. Never all-in. Maximum 15% per trade.

### 3. The Accumulator (Diamond Hands)
**30D PnL:** +$67,800  
**Win Rate:** 58%

When they buy, they REALLY buy. Holds through dips.

## How to Track These Wallets

Go to Cielo Finance and add these addresses to your tracked wallets. Set up Telegram alerts for instant notifications.`
  },
  {
    id: '3',
    title: 'Smart Money Moves: Week of January 27-31, 2025',
    excerpt: 'The biggest smart money plays this week on Solana.',
    date: '2025-01-31',
    category: 'Weekly Report',
    readTime: '6 min read',
    slug: 'weekly-report-jan-27-31',
    fullContent: `# Smart Money Moves: Week of January 27-31, 2025

**TL;DR:**
- Total smart money volume: $2.4M
- Most bought token: $MOLT (+456%)
- Biggest winner: $MOLT (from $200K to $1.2M MC)

## Top 5 Smart Money Buys This Week

### 1. $MOLT - The Runaway Winner
4 tracked wallets aped in within 3 hours.
- Whale #47: +456%
- Smart Money Alpha: +312%
- The Accumulator: +278%

### 2. $AI16Z - The Dip Buy
3 wallets bought the -45% dip and profited 25-30%.

### 3. $OnlyClaws - The Community Play
2 big wallets entered on community momentum.

## Key Takeaways

1. Volume is back ($2.4M vs $1.6M last week)
2. Meme coins > AI (for this week)
3. Contrarian plays worked
4. Take profits - even smart money sells winners`
  },
  {
    id: '4',
    title: 'How to Spot a 10x Meme Coin Before It Pumps',
    excerpt: 'The 5 key indicators we look for when identifying potential moonshots.',
    date: '2025-01-28',
    category: 'Strategy',
    readTime: '7 min read',
    slug: 'spot-10x-meme-coin',
    fullContent: `# How to Spot a 10x Meme Coin Before It Pumps

The 5 key indicators that separate 10x opportunities from rugs:

## 1. Smart Money Clustering
When 3+ profitable wallets buy the same token within 1 hour.

## 2. Volume Spike + Holder Growth
Real volume increases with growing holder count.

## 3. Token Distribution
No single wallet holds more than 5%.

## 4. Community Sentiment
Organic Twitter engagement (not botted).

## 5. Narrative Timing
Being early to a new meta/narrative.

The key is combining multiple signals, not relying on just one.`
  },
  {
    id: '5',
    title: 'Reading On-Chain Data: A Beginner\'s Guide',
    excerpt: 'Everything you need to know about interpreting blockchain data.',
    date: '2025-01-27',
    category: 'Education',
    readTime: '10 min read',
    slug: 'reading-onchain-data-guide',
    fullContent: `# Reading On-Chain Data: A Beginner's Guide

## Transaction Analysis
Every transaction tells a story:
- Buy vs Sell ratio
- Size of transactions
- Timing patterns

## Wallet Profitability Metrics
- Realized vs Unrealized PnL
- Win rate calculation
- Consistency over time

## Token Metrics
- Holder distribution
- Liquidity analysis
- Volume patterns

Start with the basics and build from there.`
  },
  {
    id: '6',
    title: 'The Psychology of Smart Money',
    excerpt: 'Why profitable traders win consistently while most retail traders lose.',
    date: '2025-01-26',
    category: 'Psychology',
    readTime: '6 min read',
    slug: 'psychology-smart-money',
    fullContent: `# The Psychology of Smart Money

## Key Differences

**Smart Money:**
- Buys fear, sells euphoria
- Has a system
- Manages risk
- Thinks in probabilities

**Retail:**
- Buys hype, panic sells
- Follows emotions
- All-in or nothing
- Thinks in certainties

## Emotional Control
The best traders feel FOMO too. They just don't act on it.

## Risk Management
Smart money never risks more than they can afford to lose. Ever.`
  }
];

export default function InsightsPage() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {/* Navigation */}
        <nav className="border-b border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold hover:text-orange-400 transition-colors">
                🦞 iseeiape
              </Link>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                ← Back to Insights
              </button>
            </div>
          </div>
        </nav>

        {/* Full Article */}
        <article className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                {selectedArticle.category}
              </span>
              <span className="text-gray-500 text-sm">{selectedArticle.date}</span>
              <span className="text-gray-500 text-sm">• {selectedArticle.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{selectedArticle.title}</h1>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            {selectedArticle.fullContent ? (
              <div className="whitespace-pre-line text-gray-300 leading-relaxed">
                {selectedArticle.fullContent}
              </div>
            ) : (
              <div className="text-gray-400">
                <p>Full article content coming soon...</p>
                <p className="mt-4">Join our Telegram for the complete analysis:</p>
                <a
                  href="https://t.me/iseeiape"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full font-bold hover:scale-105 transition-transform"
                >
                  📱 Join Telegram
                </a>
              </div>
            )}
          </div>

          {/* Share/CTA */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30">
              <h3 className="text-xl font-bold mb-2">Want More Like This?</h3>
              <p className="text-gray-300 mb-4">
                Join our Telegram for real-time smart money alerts and daily market updates.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://t.me/iseeiape"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full font-bold hover:scale-105 transition-transform"
                >
                  📱 Join Telegram
                </a>
                <Link
                  href="/trending"
                  className="px-6 py-3 bg-gray-800 border border-gray-600 rounded-full font-bold hover:bg-gray-700 transition-colors"
                >
                  🔥 View Trending
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold hover:text-orange-400 transition-colors">
              🦞 iseeiape
            </Link>
            <Link 
              href="/"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 bg-clip-text text-transparent">
            📝 Insights & Analysis
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Weekly Solana market analysis, wallet spotlights, and on-chain intelligence to help you trade smarter.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['All', 'Case Study', 'Wallet Spotlight', 'Market Analysis', 'Strategy', 'Education'].map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors border border-gray-700 hover:border-orange-500/50"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {articles.map((article) => (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">
                  {article.category}
                </span>
                <span className="text-gray-500 text-sm">{article.readTime}</span>
              </div>
              <h2 className="text-xl font-bold mb-3 hover:text-orange-400 transition-colors">
                {article.title}
              </h2>
              <p className="text-gray-400 mb-4">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">{article.date}</span>
                <span className="text-orange-400 text-sm font-medium">Read more →</span>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-8 border border-orange-500/30 text-center">
          <h2 className="text-2xl font-bold mb-4">Want Real-Time Insights?</h2>
          <p className="text-gray-300 mb-6">
            Join our Telegram for instant smart money alerts and daily market updates.
          </p>
          <a
            href="https://t.me/iseeiape"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
          >
            📱 Join Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
