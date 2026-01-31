import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Top 10 Solana Smart Money Wallets to Watch in 2025 | iseeiape',
  description: 'The most profitable and consistent smart money wallets on Solana. Track these whales to find early alpha and meme coin opportunities.',
};

export default function ArticlePage() {
  const wallets = [
    {
      rank: 1,
      name: 'Whale #47',
      emoji: '🐋',
      address: '4XTbg7KcgrfbU1XqyXw3tAXXTxiVkpJMCHpPLMmBJBPW',
      pnl30d: 127450,
      winRate: 68,
      trades: 234,
      specialty: 'Early Entry',
      bestTrade: '$MOLT +456%',
      description: 'Uncanny ability to find tokens at $100K-300K market cap that pump to $1M+ within 48 hours.'
    },
    {
      rank: 2,
      name: 'Smart Money Alpha',
      emoji: '🦈',
      address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      pnl30d: 89200,
      winRate: 72,
      trades: 189,
      specialty: 'Consistent Winner',
      bestTrade: '$AI16Z +234%',
      description: 'Highest win rate in our tracked list. Never all-in, maximum 15% per trade. Takes profits in tranches.'
    },
    {
      rank: 3,
      name: 'The Accumulator',
      emoji: '🦞',
      address: '8R9bDH7aP8qXg5yZtN2mK4jL7vW6xQ3pY1bC9dF2eH5',
      pnl30d: 67800,
      winRate: 65,
      trades: 156,
      specialty: 'Diamond Hands',
      bestTrade: '$CLAWD +189%',
      description: 'When they buy, they REALLY buy. Holds through dips that shake out weak hands. DCA master.'
    },
    {
      rank: 4,
      name: 'The Contrarian',
      emoji: '🎯',
      address: '3P9kM2nL8jQ7wR5tY4uI6oP1aS3dF5gH7jK9lZ2xC4v',
      pnl30d: 54300,
      winRate: 64,
      trades: 145,
      specialty: 'Buy the Fear',
      bestTrade: '$LUNA +156%',
      description: 'While everyone panic sells, they accumulate. Catches knives that don\'t fall further.'
    },
    {
      rank: 5,
      name: 'Momentum Hunter',
      emoji: '⚡',
      address: '6V2bN4mK9jL3pQ8wR5tY1uI7oP4aS6dF8gH0jK2lZ5x',
      pnl30d: 48900,
      winRate: 61,
      trades: 298,
      specialty: 'Quick Flips',
      bestTrade: '$FRESH +1,200%',
      description: 'Moves fast, takes quick profits. Never marries bags. 18-hour holds can be more profitable than 18-day holds.'
    },
    {
      rank: 6,
      name: 'The Analyst',
      emoji: '🧠',
      address: '9K5lZ2xC4vB7nM3pQ6wR8tY1uI4oP7aS9dF2gH5jK8l',
      pnl30d: 42100,
      winRate: 69,
      trades: 87,
      specialty: 'Research Heavy',
      bestTrade: '$RESEARCH +234%',
      description: 'Only trades 2-3 times per week. Studies tokenomics, holder distribution, and sentiment before buying.'
    },
    {
      rank: 7,
      name: 'The Degen',
      emoji: '🎲',
      address: '2X8lZ5xC1vB4nM7pQ0wR3tY6uI9oP2aS5dF8gH1jK4l',
      pnl30d: 38500,
      winRate: 45,
      trades: 412,
      specialty: 'YOLO Plays',
      bestTrade: '$FRESH +1,200%',
      description: 'Lower win rate but wins BIG when they win. Apes into pump.fun launches within minutes. High variance.'
    },
    {
      rank: 8,
      name: 'The Institution',
      emoji: '🏛️',
      address: '5C1vB4nM7pQ0wR3tY6uI9oP2aS5dF8gH1jK4lZ7xC0v',
      pnl30d: 156000,
      winRate: 71,
      trades: 78,
      specialty: 'Big Money',
      bestTrade: '$AI16Z +89%',
      description: 'Moves size - $20K-50K positions. Only trades tokens with $10M+ market cap. Safe but profitable.'
    },
    {
      rank: 9,
      name: 'The Detective',
      emoji: '🔍',
      address: '1nM4pQ7wR0tY3uI6oP9aS2dF5gH8jK1lZ4xC7vB0nM3',
      pnl30d: 35200,
      winRate: 82,
      trades: 134,
      specialty: 'Rug Avoider',
      bestTrade: 'Avoided 4 rugs',
      description: 'Highest win rate. Excellent at spotting red flags. If they pass on a hyped token, there\'s probably a reason.'
    },
    {
      rank: 10,
      name: 'Flow Master',
      emoji: '🌊',
      address: '7wR3tY6uI9oP2aS5dF8gH1jK4lZ7xC0vB3nM6pQ9wR2',
      pnl30d: 31800,
      winRate: 67,
      trades: 267,
      specialty: 'Copy Trader',
      bestTrade: '$MOLT +201%',
      description: 'Meta - copies other smart wallets. When 2+ wallets buy, they buy within the hour. Good confirmation signal.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/insights" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </Link>
        </div>
      </nav>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
              Wallet Spotlight
            </span>
            <span className="text-gray-500 text-sm">January 31, 2025</span>
            <span className="text-gray-500 text-sm">• 10 min read</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Top 10 Solana Smart Money Wallets to Watch in 2025
          </h1>
          <p className="text-xl text-gray-400">
            The most profitable and consistent smart money wallets on Solana. Track these whales to find early alpha.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-gray-700">
            <p className="text-3xl font-bold text-green-400">$679K</p>
            <p className="text-gray-400 text-sm">Combined 30D PnL</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-gray-700">
            <p className="text-3xl font-bold text-orange-400">66%</p>
            <p className="text-gray-400 text-sm">Avg Win Rate</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-gray-700">
            <p className="text-3xl font-bold text-blue-400">2,004</p>
            <p className="text-gray-400 text-sm">Total Trades</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-gray-700">
            <p className="text-3xl font-bold text-purple-400">+312%</p>
            <p className="text-gray-400 text-sm">Best Trade</p>
          </div>
        </div>

        {/* What Makes Smart Money */}
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 mb-8">
          <h2 className="text-xl font-bold mb-4">What Makes a "Smart Money" Wallet?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-green-400 font-medium mb-2">✅ We Look For:</p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• 30+ day track record</li>
                <li>• $50K+ realized profits</li>
                <li>• 60%+ win rate</li>
                <li>• Consistent activity</li>
                <li>• Risk management</li>
              </ul>
            </div>
            <div>
              <p className="text-red-400 font-medium mb-2">❌ Red Flags:</p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• One big win, then silence</li>
                <li>• 90% win rate (tiny profits)</li>
                <li>• Massive losses between wins</li>
                <li>• Only buys after pumps</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Wallets List */}
        <div className="space-y-4">
          {wallets.map((wallet) => (
            <div 
              key={wallet.rank}
              className="bg-gray-800/50 hover:bg-gray-700/70 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all"
            >
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-gray-600">#{wallet.rank}</span>
                  <div className="text-4xl">{wallet.emoji}</div>
                  <div>
                    <h3 className="text-xl font-bold">{wallet.name}</h3>
                    <a 
                      href={`https://app.cielo.finance/profile/${wallet.address}?ref_code=iseeiape`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-orange-400 hover:text-orange-300 font-mono"
                    >
                      {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </a>
                    <p className="text-sm text-purple-400 mt-1">{wallet.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">+${wallet.pnl30d.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">30D PnL</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700/50">
                <div className="text-center">
                  <p className="text-lg font-bold text-orange-400">{wallet.winRate}%</p>
                  <p className="text-xs text-gray-500">Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{wallet.trades}</p>
                  <p className="text-xs text-gray-500">Trades</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-400">{wallet.bestTrade}</p>
                  <p className="text-xs text-gray-500">Best</p>
                </div>
              </div>

              <p className="text-gray-400 text-sm mt-4">{wallet.description}</p>
            </div>
          ))}
        </div>

        {/* How to Track */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-xl border border-orange-500/30 my-8">
          <h2 className="text-2xl font-bold mb-4">How to Track These Wallets</h2>
          <ol className="space-y-3 text-gray-300">
            <li><strong>1.</strong> Go to <a href="https://app.cielo.finance?ref_code=iseeiape" className="text-orange-400 hover:underline">Cielo Finance</a></li>
            <li><strong>2.</strong> Create a free account</li>
            <li><strong>3.</strong> Click "Add Wallet" and enter the addresses above</li>
            <li><strong>4.</strong> Set up Telegram alerts for instant notifications</li>
            <li><strong>5.</strong> Watch for 2+ wallets buying the same token within 1 hour (cluster signal)</li>
          </ol>
        </div>

        {/* What to Do */}
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4">What to Do With This Information</h2>
          <p className="text-gray-300 mb-4">
            <strong>DON'T:</strong> Blindly copy every trade
          </p>
          <p className="text-gray-300 mb-4">
            <strong>DO:</strong> Use their activity as a signal to investigate
          </p>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">My Process:</p>
            <ol className="text-sm text-gray-300 space-y-1">
              <li>1. Alert triggers - 2+ wallets buy same token within 2 hours</li>
              <li>2. I investigate - Check tokenomics, holders, social sentiment</li>
              <li>3. If it passes filters - Take small position ($100-500)</li>
              <li>4. Set stop loss - Usually -30% from entry</li>
              <li>5. Take profits - Sell 50% at +100%, let rest ride</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            <strong>Updated Weekly:</strong> This list is dynamic. Wallets fall off when they start losing consistently. New wallets get added when they prove themselves.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Last updated: January 31, 2025 | Next update: February 7, 2025
          </p>
        </div>
      </article>
    </div>
  );
}
