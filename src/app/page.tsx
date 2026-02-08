// AEO-Optimized Landing Page for iseeiape
// Addresses new on-chain user pain points + structured for AI agents

import Link from 'next/link';
import LiveFeed from './components/LiveFeed';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              🦞 iseeiape
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/trending" className="text-gray-400 hover:text-white transition-colors">
                Trending
              </Link>
              <Link href="/insights" className="text-gray-400 hover:text-white transition-colors">
                Insights
              </Link>
              <Link href="/guides" className="text-gray-400 hover:text-white transition-colors">
                Guides
              </Link>
              <Link href="/case-studies" className="text-gray-400 hover:text-white transition-colors">
                Case Studies
              </Link>
              <Link href="/tools" className="text-gray-400 hover:text-white transition-colors">
                Tools
              </Link>
              <Link href="/analytics" className="text-gray-400 hover:text-white transition-colors">
                📊 Analytics
              </Link>
            </div>
            <a
              href="https://t.me/iseeiape"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-full text-sm font-bold transition-colors"
            >
              Join Telegram
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section - Clear Value Proposition */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 bg-clip-text text-transparent">
          🦞 iseeiape
        </h1>
        
        {/* AEO: Direct Answer to Common Question */}
        <h2 className="text-2xl md:text-3xl text-gray-200 mb-4 max-w-3xl mx-auto font-semibold">
          What Are the Hottest Solana Meme Coins Right Now?
        </h2>
        
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          Track trending tokens, smart money wallets, and early alpha in real-time. 
          Stop guessing. Start following the whales.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link 
            href="/trending"
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-orange-500/30"
          >
            🔥 See Trending Tokens
          </Link>
          <a 
            href="https://app.cielo.finance?ref_code=iseeiape"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-gray-800 border border-gray-600 rounded-full font-bold text-lg hover:bg-gray-700 transition-colors"
          >
            Track Smart Money
          </a>
        </div>
      </div>

      {/* Problem/Solution Section - AEO Q&A Format */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-orange-400">
          Common Problems New Crypto Traders Face
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Problem 1 */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-red-400">
              ❌ "I always buy at the top and sell at the bottom"
            </h3>
            <p className="text-gray-400 mb-4">
              Most retail traders follow Twitter hype and enter when smart money is already exiting.
            </p>
            <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/50">
              <p className="text-green-400 font-semibold mb-1">✅ Solution:</p>
              <p className="text-gray-300 text-sm">
                Follow whale wallets that consistently profit. See what they buy BEFORE it pumps.
              </p>
            </div>
          </div>

          {/* Problem 2 */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-red-400">
              ❌ "I miss every 10x opportunity"
            </h3>
            <p className="text-gray-400 mb-4">
              By the time you hear about a gem on social media, insiders have already 10x'd.
            </p>
            <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/50">
              <p className="text-green-400 font-semibold mb-1">✅ Solution:</p>
              <p className="text-gray-300 text-sm">
                Get alerts when smart money apes into new launches. Be early, not late.
              </p>
            </div>
          </div>

          {/* Problem 3 */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-red-400">
              ❌ "I don't know which wallets to trust"
            </h3>
            <p className="text-gray-400 mb-4">
              Thousands of wallets trade daily. Most are just gambling. Which ones actually win?
            </p>
            <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/50">
              <p className="text-green-400 font-semibold mb-1">✅ Solution:</p>
              <p className="text-gray-300 text-sm">
                We track wallets with proven track records. See their PnL, win rate, and history.
              </p>
            </div>
          </div>

          {/* Problem 4 */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-red-400">
              ❌ "I spend hours on-chain but find nothing"
            </h3>
            <p className="text-gray-400 mb-4">
              Manually scanning Solscan and DexScreener is exhausting and inefficient.
            </p>
            <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/50">
              <p className="text-green-400 font-semibold mb-1">✅ Solution:</p>
              <p className="text-gray-300 text-sm">
                Aggregated intelligence in one dashboard. Save time, find alpha faster.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Feed Section */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <LiveFeed />
      </div>

      {/* What is iseeiape - AEO Structured Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">
            What is iseeiape and How Does It Work?
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="text-3xl">🔍</div>
              <div>
                <h3 className="text-xl font-bold mb-2">1. We Monitor Smart Money Wallets</h3>
                <p className="text-gray-400">
                  Our system tracks hundreds of profitable wallets on Solana. These are wallets with 
                  consistent 6-figure+ PnL, high win rates, and early entry patterns.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">⚡</div>
              <div>
                <h3 className="text-xl font-bold mb-2">2. Real-Time Transaction Feed</h3>
                <p className="text-gray-400">
                  When a tracked whale buys a new token, you'll see it instantly. 
                  No more FOMO - you'll be in before the pump starts.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">📊</div>
              <div>
                <h3 className="text-xl font-bold mb-2">3. Trending Tokens Dashboard</h3>
                <p className="text-gray-400">
                  See what's hot right now across volume, mindshare, and smart money flow. 
                  Updated every 2 minutes with real market data.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="text-xl font-bold mb-2">4. Make Informed Decisions</h3>
                <p className="text-gray-400">
                  Follow the smart money. When multiple profitable wallets ape into the same token, 
                  that's your signal to investigate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AEO: Direct Answers Section */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-orange-400">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-6 mb-16">
          {/* Q1 */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold mb-3 text-orange-400">
              Which smart money wallets should I follow on Solana?
            </h3>
            <p className="text-gray-300 mb-3">
              The best wallets to follow have these characteristics:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Consistent 6-figure+ realized PnL over 30+ days</li>
              <li>Win rate above 60% on closed trades</li>
              <li>Early entry patterns (buying before 2x+ pumps)</li>
              <li>Diverse token selection (not just gambling on one)</li>
              <li>Regular activity (not dormant wallets)</li>
            </ul>
            <p className="text-gray-400 mt-3">
              Use our <a href="https://app.cielo.finance?ref_code=iseeiape" className="text-orange-400 hover:underline">Cielo integration</a> to discover and track these wallets.
            </p>
          </div>

          {/* Q2 */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold mb-3 text-orange-400">
              What are the top 3 Solana meme coins today?
            </h3>
            <p className="text-gray-300 mb-3">
              Our trending page updates every 2 minutes with the hottest tokens by volume and smart money flow.
            </p>
            <Link 
              href="/trending"
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium"
            >
              View Live Trending Tokens →
            </Link>
          </div>

          {/* Q3 */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold mb-3 text-orange-400">
              How do I identify good meme coin opportunities early?
            </h3>
            <p className="text-gray-300 mb-3">
              Look for these signals:
            </p>
            <ol className="list-decimal list-inside text-gray-400 space-y-2 ml-4">
              <li><strong>Smart money clustering:</strong> Multiple profitable wallets buying the same new token</li>
              <li><strong>Volume spike:</strong> 24h volume increasing 5x+ from baseline</li>
              <li><strong>Holder growth:</strong> Unique holders increasing rapidly (check Solscan)</li>
              <li><strong>Community sentiment:</strong> Organic Twitter/Discord engagement (not botted)</li>
              <li><strong>Token distribution:</strong> No single wallet holds more than 5% (avoids rugs)</li>
            </ol>
          </div>

          {/* Q4 */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold mb-3 text-orange-400">
              Is iseeiape free to use?
            </h3>
            <p className="text-gray-300">
              Yes! Our basic trending dashboard is completely free. For advanced wallet tracking 
              and alerts, we integrate with Cielo Finance which offers both free and paid plans.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid - AEO Structured */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-12">
          What You Get With iseeiape
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all hover:scale-105">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold mb-2">Live Trending Tokens</h3>
            <p className="text-gray-400 text-sm">
              Real-time Solana token rankings by volume, price change, and smart money flow. 
              Updated every 2 minutes.
            </p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all hover:scale-105">
            <div className="text-4xl mb-3">🐋</div>
            <h3 className="text-xl font-bold mb-2">Smart Money Tracking</h3>
            <p className="text-gray-400 text-sm">
              Follow profitable whale wallets. See their trades, PnL, and token allocations 
              in real-time via Cielo integration.
            </p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all hover:scale-105">
            <div className="text-4xl mb-3">🔔</div>
            <h3 className="text-xl font-bold mb-2">Early Entry Signals</h3>
            <p className="text-gray-400 text-sm">
              Get notified when multiple smart money wallets ape into new launches. 
              Be early, not late.
            </p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all hover:scale-105">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-xl font-bold mb-2">On-Chain Analytics</h3>
            <p className="text-gray-400 text-sm">
              Market cap, volume, holder count, and liquidity data for every token. 
              Make informed decisions.
            </p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all hover:scale-105">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-xl font-bold mb-2">Fast & Lightweight</h3>
            <p className="text-gray-400 text-sm">
              No bloated interface. Clean, fast dashboard that loads instantly. 
              Mobile-responsive for trading on the go.
            </p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all hover:scale-105">
            <div className="text-4xl mb-3">🔗</div>
            <h3 className="text-xl font-bold mb-2">Cielo Integration</h3>
            <p className="text-gray-400 text-sm">
              Direct links to Cielo Terminal for deep-dive analytics. 
              Track any wallet, any token, any time.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-8 border border-orange-500/30 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Stop Guessing and Start Winning?
          </h2>
          <p className="text-gray-300 mb-6">
            Join thousands of traders using smart money intelligence to find alpha on Solana.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/trending"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              🔥 View Trending Tokens
            </Link>
            <a 
              href="https://app.cielo.finance?ref_code=iseeiape"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gray-800 border border-gray-600 rounded-full font-bold text-lg hover:bg-gray-700 transition-colors"
            >
              Track Smart Money
            </a>
          </div>
        </div>
      </div>

      {/* AEO: Authority & Trust Section */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-400 mb-4">
            Data Sources & Methodology
          </h2>
          <p className="text-gray-500 text-sm">
            We aggregate data from multiple sources to ensure accuracy and timeliness:
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-gray-400">
          <a href="https://dexscreener.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
            DexScreener
          </a>
          <a href="https://cielo.finance" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
            Cielo Finance
          </a>
          <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
            Solscan
          </a>
          <span className="text-gray-600">•</span>
          <span>Data updated every 2 minutes</span>
          <span className="text-gray-600">•</span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-gray-500 text-sm border-t border-gray-800">
        <p>Powered by iseeiape • Smart Money Intelligence for Solana</p>
        <p className="mt-2">
          <a href="https://app.cielo.finance?ref_code=iseeiape" className="text-orange-400 hover:underline">
            app.cielo.finance/?ref_code=iseeiape
          </a>
        </p>
        <p className="mt-4 text-xs text-gray-600">
          Not financial advice. DYOR. Crypto trading involves significant risk.
        </p>
      </div>
    </div>
  );
}
