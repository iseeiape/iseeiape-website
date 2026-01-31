import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'How to Read Solana On-Chain Data: Beginner\'s Guide | iseeiape',
  description: 'Learn the basics of on-chain analysis and how to track smart money wallets on Solana. A complete beginner\'s guide to reading blockchain data.',
};

export default function ArticlePage() {
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

      <article className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
              Education
            </span>
            <span className="text-gray-500 text-sm">January 31, 2025</span>
            <span className="text-gray-500 text-sm">• 8 min read</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            How to Read Solana On-Chain Data: Beginner's Guide
          </h1>
          <p className="text-xl text-gray-400">
            Learn the basics of on-chain analysis and how to track smart money wallets on Solana.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="lead text-xl text-gray-300">
            If you're trading meme coins on Solana and not looking at on-chain data, you're flying blind.
          </p>

          <p>
            I learned this the hard way. For months, I'd buy tokens based on Twitter hype, only to watch smart money sell into my buys. I was the exit liquidity.
          </p>

          <p>
            Then I started tracking wallets. Real profitable wallets. And everything changed.
          </p>

          <p>
            This guide will teach you what I wish I knew from day one.
          </p>

          <h2 className="text-2xl font-bold text-orange-400 mt-8 mb-4">What Is On-Chain Data?</h2>

          <p>
            On-chain data is every transaction that happens on the blockchain, recorded permanently and publicly.
          </p>

          <p>
            Every buy. Every sell. Every wallet. Every token. It's all there.
          </p>

          <p>
            For Solana, this means you can see:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Who bought what token and when</li>
            <li>How much they bought/sold</li>
            <li>Wallet balances and trading history</li>
            <li>Token holder distribution</li>
            <li>Volume and liquidity changes</li>
          </ul>

          <p className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-orange-500 my-6">
            <strong>Think of it like having a dashboard showing what every trader is doing in real-time.</strong>
          </p>

          <h2 className="text-2xl font-bold text-orange-400 mt-8 mb-4">Why On-Chain Data Matters</h2>

          <p>
            Here's the truth: By the time a token is trending on Twitter, the smart money has already made their money.
          </p>

          <p>
            On-chain data lets you:
          </p>

          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li><strong>See moves before they become news</strong> - Catch whales accumulating before the pump</li>
            <li><strong>Identify real buying vs. fake volume</strong> - Spot wash trading and bot activity</li>
            <li><strong>Follow proven winners</strong> - Copy wallets with consistent profits</li>
            <li><strong>Avoid traps</strong> - See when insiders are dumping on retail</li>
          </ol>

          <p className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg my-6">
            <strong>💡 Real example:</strong> Last week, I saw 3 tracked wallets apes into $MOLT within 2 hours. The token was at $200K market cap. 24 hours later? $1.2M market cap. +500%. Twitter found out 12 hours after the smart money.
          </p>

          <h2 className="text-2xl font-bold text-orange-400 mt-8 mb-4">Key Metrics to Watch</h2>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">1. Wallet Profitability (Most Important)</h3>

          <p>Not all wallets are created equal. Look for:</p>

          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li><strong>Realized PnL</strong> - Actual profits taken (not unrealized)</li>
            <li><strong>Win rate</strong> - % of profitable trades</li>
            <li><strong>Trade frequency</strong> - Active vs. dormant wallets</li>
            <li><strong>Consistency</strong> - Profits over 30+ days, not just one lucky trade</li>
          </ul>

          <p className="text-red-400 my-4">
            <strong>Red flag:</strong> A wallet with 1 big win and 20 losses = gambler, not smart money.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">2. Volume Patterns</h3>

          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li><strong>Organic volume:</strong> Gradual increase with holder growth</li>
            <li><strong>Fake volume:</strong> Sudden spikes with no holder increase (likely wash trading)</li>
            <li><strong>Smart money volume:</strong> Multiple profitable wallets buying in clusters</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">3. Holder Distribution</h3>

          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li><strong>Concentration:</strong> One wallet holding &gt;10% = can dump on you</li>
            <li><strong>Growth:</strong> Steady holder increase = healthy distribution</li>
            <li><strong>Retention:</strong> Holders not selling quickly = conviction</li>
          </ul>

          <h2 className="text-2xl font-bold text-orange-400 mt-8 mb-4">Tools You Need</h2>

          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h4 className="font-bold text-orange-400 mb-2">Cielo Finance</h4>
              <p className="text-sm text-gray-400">Best for wallet tracking and alerts</p>
              <ul className="text-sm text-gray-300 mt-2 space-y-1">
                <li>• Track unlimited wallets</li>
                <li>• Real-time transaction feed</li>
                <li>• PnL analytics</li>
              </ul>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h4 className="font-bold text-orange-400 mb-2">DexScreener</h4>
              <p className="text-sm text-gray-400">Best for token charts and metrics</p>
              <ul className="text-sm text-gray-300 mt-2 space-y-1">
                <li>• Price charts</li>
                <li>• Volume data</li>
                <li>• Holder counts</li>
              </ul>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h4 className="font-bold text-orange-400 mb-2">Solscan</h4>
              <p className="text-sm text-gray-400">Best for deep transaction analysis</p>
              <ul className="text-sm text-gray-300 mt-2 space-y-1">
                <li>• View any wallet's full history</li>
                <li>• Token holder lists</li>
                <li>• Transaction details</li>
              </ul>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h4 className="font-bold text-orange-400 mb-2">iseeiape</h4>
              <p className="text-sm text-gray-400">Best for aggregated trending data</p>
              <ul className="text-sm text-gray-300 mt-2 space-y-1">
                <li>• Top tokens by smart money flow</li>
                <li>• Live whale activity</li>
                <li>• Trending analysis</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-orange-400 mt-8 mb-4">Start Here: Your First Week</h2>

          <div className="space-y-4">
            <div className="bg-gray-800/30 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-bold text-white">Day 1-2: Set up tools</h4>
              <p className="text-gray-400 text-sm mt-1">Create Cielo account, connect your wallet for tracking, add 5-10 wallets to watch</p>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-bold text-white">Day 3-4: Just watch</h4>
              <p className="text-gray-400 text-sm mt-1">Don't trade yet. Observe the feed. Note patterns. See what happens after smart money buys.</p>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-lg border-l-4 border-green-500">
              <h4 className="font-bold text-white">Day 5-7: Paper trade</h4>
              <p className="text-gray-400 text-sm mt-1">Pretend to buy when you see signals. Track what happens. Don't risk real money yet.</p>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-bold text-white">Week 2+: Small real trades</h4>
              <p className="text-gray-400 text-sm mt-1">$50-100 positions max. Focus on learning, not profit. Document everything.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-orange-400 mt-8 mb-4">The Bottom Line</h2>

          <p>
            On-chain data won't make you rich overnight. But it WILL give you an edge over traders who are just following Twitter hype.
          </p>

          <p>
            The goal isn't to be perfect. The goal is to be better than the average trader who's flying blind.
          </p>

          <p>
            Start tracking wallets today. In 30 days, you'll see patterns you never noticed before.
          </p>

          <p>
            In 90 days, you'll have a completely different understanding of how this market actually works.
          </p>

          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-xl border border-orange-500/30 my-8">
            <p className="font-bold text-lg mb-2">Ready to start tracking?</p>
            <p className="text-gray-300">
              Check out our <Link href="/trending" className="text-orange-400 hover:underline">trending tokens</Link> page to see what smart money is buying right now.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Last updated: January 31, 2025
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Questions? Join our <a href="https://t.me/iseeiape" className="text-orange-400 hover:underline">Telegram community</a> for daily insights.
          </p>
        </div>
      </article>
    </div>
  );
}
