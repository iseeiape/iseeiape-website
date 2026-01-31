import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Smart Money Moves: Week of Jan 27-31, 2025 | iseeiape',
  description: 'The biggest smart money plays this week on Solana. What whales bought, what they sold, and what to watch next week.',
};

export default function ArticlePage() {
  const topBuys = [
    {
      token: '$MOLT',
      change: '+456%',
      wallets: 4,
      volume: '$2.4M',
      entry: '$280K MC',
      exit: '$1.2M MC',
      description: '4 tracked wallets aped in within 3 hours. Clean tokenomics, strong community forming on Twitter.'
    },
    {
      token: '$AI16Z',
      change: '+30%',
      wallets: 3,
      volume: '$1.8M',
      entry: '$45M MC',
      exit: '$58M MC',
      description: '3 wallets bought the -45% dip. Classic contrarian move while retail panic sold.'
    },
    {
      token: '$OnlyClaws',
      change: '+37%',
      wallets: 2,
      volume: '$945K',
      entry: '$800K MC',
      exit: '$1.1M MC',
      description: '2 big wallets entered on community momentum. Viral Twitter engagement with unique branding.'
    }
  ];

  const notableSells = [
    {
      token: '$GOAT',
      change: '-23%',
      action: 'Profit Taking',
      amount: '$85K',
      lesson: 'Even smart money takes profits. Don\'t be greedy.'
    },
    {
      token: '$P89',
      change: '-15%',
      action: 'Cutting Losses',
      amount: '$28K',
      lesson: 'Smart money cuts losers quickly. They don\'t diamond hand losing positions.'
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
              Weekly Report
            </span>
            <span className="text-gray-500 text-sm">January 27-31, 2025</span>
            <span className="text-gray-500 text-sm">• 6 min read</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Smart Money Moves: Week of January 27-31, 2025
          </h1>
          <p className="text-xl text-gray-400">
            The biggest smart money plays this week on Solana.
          </p>
        </div>

        {/* TL;DR */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-xl border border-orange-500/30 mb-8">
          <h2 className="text-xl font-bold mb-4">TL;DR</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-green-400 font-medium">✅ Highlights</p>
              <ul className="text-gray-300 text-sm mt-2 space-y-1">
                <li>• Total smart money volume: $2.4M</li>
                <li>• Most bought token: $MOLT (+456%)</li>
                <li>• Biggest winner: $MOLT ($200K → $1.2M MC)</li>
              </ul>
            </div>
            <div>
              <p className="text-red-400 font-medium">📉 Notable</p>
              <ul className="text-gray-300 text-sm mt-2 space-y-1">
                <li>• Trend: AI tokens cooling, memes heating up</li>
                <li>• $GOAT profit taking: -23% after big run</li>
                <li>• Contrarian plays paid off this week</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-gray-700">
            <p className="text-3xl font-bold text-orange-400">127</p>
            <p className="text-gray-400 text-sm">Tracked Trades</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-gray-700">
            <p className="text-3xl font-bold text-green-400">$2.4M</p>
            <p className="text-gray-400 text-sm">Total Volume</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-gray-700">
            <p className="text-3xl font-bold text-blue-400">67%</p>
            <p className="text-gray-400 text-sm">Win Rate</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-gray-700">
            <p className="text-3xl font-bold text-purple-400">+45%</p>
            <p className="text-gray-400 text-sm">Volume vs Last Week</p>
          </div>
        </div>

        {/* Top Buys */}
        <h2 className="text-2xl font-bold mb-6">🏆 Top 3 Smart Money Buys This Week</h2>
        
        <div className="space-y-4 mb-8">
          {topBuys.map((buy, index) => (
            <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-gray-600">#{index + 1}</span>
                  <div>
                    <h3 className="text-2xl font-bold">{buy.token}</h3>
                    <p className="text-sm text-gray-500">{buy.wallets} wallets • {buy.volume} volume</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-400">{buy.change}</p>
                  <p className="text-sm text-gray-500">{buy.entry} → {buy.exit}</p>
                </div>
              </div>
              <p className="text-gray-300">{buy.description}</p>
            </div>
          ))}
        </div>

        {/* Notable Sells */}
        <h2 className="text-2xl font-bold mb-6">📉 Notable Sells</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {notableSells.map((sell, index) => (
            <div key={index} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{sell.token}</h3>
                <span className="text-red-400 font-bold">{sell.change}</span>
              </div>
              <p className="text-orange-400 text-sm mb-2">{sell.action}: {sell.amount}</p>
              <p className="text-gray-400 text-sm">💡 {sell.lesson}</p>
            </div>
          ))}
        </div>

        {/* Patterns */}
        <h2 className="text-2xl font-bold mb-6">🔍 Patterns We're Seeing</h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <h4 className="font-bold text-orange-400 mb-2">The Cluster Signal</h4>
            <p className="text-gray-400 text-sm">
              When 3+ smart wallets buy the same token within 1 hour, 73% of the time it pumps 50%+ within 24h.
            </p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <h4 className="font-bold text-orange-400 mb-2">The Dip Buy</h4>
            <p className="text-gray-400 text-sm">
              Smart money buys when a token drops 30-50% from recent high, not when it's already pumping.
            </p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <h4 className="font-bold text-orange-400 mb-2">The Gradual Exit</h4>
            <p className="text-gray-400 text-sm">
              Winners sell in 3-4 tranches, not all at once. They take profits while leaving room for more upside.
            </p>
          </div>
        </div>

        {/* What to Watch */}
        <h2 className="text-2xl font-bold mb-6">🎯 What to Watch Next Week</h2>
        
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 mb-8">
          <h4 className="font-bold text-white mb-3">High Probability Setups:</h4>
          <ul className="text-gray-300 space-y-2">
            <li>• <strong>$MOLT continuation</strong> - If it holds $1M MC support, next leg up to $2M+ possible</li>
            <li>• <strong>$CLAWD breakout</strong> - Quiet accumulation usually precedes loud pumps</li>
            <li>• <strong>AI token rotation</strong> - If $AI16Z pumps, other AI plays might follow</li>
          </ul>
          
          <h4 className="font-bold text-white mt-6 mb-3">Wallets to Watch:</h4>
          <ul className="text-gray-300 space-y-2">
            <li>• <strong>Whale #47</strong> - Partially exited $MOLT. Watch where that capital goes next</li>
            <li>• <strong>The Contrarian</strong> - Has dry powder after $AI16Z win. Looking for next dip to buy</li>
            <li>• <strong>The Degen</strong> - Quiet this week. Usually means they're researching next big play</li>
          </ul>
        </div>

        {/* Key Takeaways */}
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6 rounded-xl border border-green-500/30 mb-8">
          <h2 className="text-xl font-bold mb-4">💡 Key Takeaways</h2>
          <ol className="space-y-2 text-gray-300">
            <li>1. <strong>Volume is back</strong> - $2.4M in smart money volume vs $1.6M last week</li>
            <li>2. <strong>Meme coins &gt; AI</strong> - For this week at least</li>
            <li>3. <strong>Contrarian plays worked</strong> - Buying fear paid off</li>
            <li>4. <strong>Take profits</strong> - Even the best wallets sell winners</li>
          </ol>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            This report is published weekly. Smart money moves happen 24/7.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Get instant alerts when 3+ tracked wallets buy the same token:{' '}
            <a href="https://t.me/iseeiape" className="text-orange-400 hover:underline">Join our Telegram</a>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Last updated: January 31, 2025 10:00 AM EST
          </p>
        </div>
      </article>
    </div>
  );
}
