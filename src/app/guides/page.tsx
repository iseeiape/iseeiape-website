// Guides page - Educational content
import Link from 'next/link';

export const metadata = {
  title: 'Guides | How to Track Smart Money on Solana | iseeiape',
  description: 'Step-by-step guides on tracking whale wallets, reading on-chain data, and finding early meme coin opportunities on Solana.',
};

const guides = [
  {
    id: '1',
    title: 'How to Spot Smart Money Wallets',
    description: 'Learn the 5 key metrics that separate profitable whales from gamblers.',
    steps: 7,
    difficulty: 'Beginner',
    time: '15 min',
    icon: '🐋',
    content: `
## Step 1: Look for Consistent Profits
Don't follow wallets with just one big win. Look for 30+ days of consistent profitability.

## Step 2: Check Win Rate
A 60%+ win rate indicates skill, not luck.

## Step 3: Analyze Position Sizing
Smart money never goes all-in. They risk 5-15% per trade.

## Step 4: Study Entry Timing
Do they buy dips or FOMO into pumps?

## Step 5: Review Exit Strategy
Do they take profits gradually or hold forever?

## Step 6: Check Activity Level
Active wallets provide more signals than dormant ones.

## Step 7: Verify Track Record
Cross-reference their trades on Solscan.`
  },
  {
    id: '2',
    title: 'Reading On-Chain Data Like a Pro',
    description: 'Master transaction analysis, holder distribution, and liquidity metrics.',
    steps: 10,
    difficulty: 'Intermediate',
    time: '25 min',
    icon: '🔗',
    content: 'Detailed guide content coming soon...'
  },
  {
    id: '3',
    title: 'Finding 10x Meme Coins Early',
    description: 'The complete framework for identifying moonshots before they pump.',
    steps: 8,
    difficulty: 'Advanced',
    time: '30 min',
    icon: '🚀',
    content: 'Detailed guide content coming soon...'
  },
  {
    id: '4',
    title: 'Setting Up Your First Cielo Feed',
    description: 'Step-by-step setup for tracking your first smart money wallets.',
    steps: 5,
    difficulty: 'Beginner',
    time: '10 min',
    icon: '⚙️',
    content: 'Detailed guide content coming soon...'
  },
  {
    id: '5',
    title: 'Risk Management for Meme Coins',
    description: 'Position sizing, stop losses, and protecting your capital.',
    steps: 6,
    difficulty: 'Intermediate',
    time: '20 min',
    icon: '🛡️',
    content: 'Detailed guide content coming soon...'
  },
  {
    id: '6',
    title: 'Understanding Pump.fun Mechanics',
    description: 'How the bonding curve works and when to enter/exit.',
    steps: 9,
    difficulty: 'Intermediate',
    time: '15 min',
    icon: '📈',
    content: 'Detailed guide content coming soon...'
  }
];

export default function GuidesPage() {
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
            📚 Guides & Tutorials
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Learn how to track smart money, read on-chain data, and find early alpha on Solana.
          </p>
        </div>

        {/* Featured Guide */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-8 border border-orange-500/30 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-6xl">🎯</div>
            <div className="flex-1">
              <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-medium">
                Start Here
              </span>
              <h2 className="text-2xl font-bold mt-3 mb-2">
                Complete Beginner's Guide to Smart Money Tracking
              </h2>
              <p className="text-gray-300 mb-4">
                Everything you need to know to start following profitable wallets on Solana.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>📖 12 chapters</span>
                <span>⏱️ 45 minutes</span>
                <span>🟢 Beginner friendly</span>
              </div>
            </div>
            <Link
              href="/insights"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-full font-bold transition-colors"
            >
              Read Now
            </Link>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all hover:scale-[1.02] cursor-pointer group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{guide.icon}</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">
                {guide.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {guide.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className={`px-2 py-1 rounded ${
                  guide.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                  guide.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {guide.difficulty}
                </span>
                <span>{guide.steps} steps • {guide.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Tips Section */}
        <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">💡 Quick Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-2xl">1️⃣</div>
              <div>
                <h3 className="font-bold mb-1">Start with 3-5 wallets</h3>
                <p className="text-gray-400 text-sm">Don't overwhelm yourself. Pick a few proven winners and watch them closely.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">2️⃣</div>
              <div>
                <h3 className="font-bold mb-1">Look for clustering</h3>
                <p className="text-gray-400 text-sm">When multiple smart wallets buy the same token, that's a strong signal.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">3️⃣</div>
              <div>
                <h3 className="font-bold mb-1">Check their history</h3>
                <p className="text-gray-400 text-sm">A wallet with 30 days of consistent profits &gt; a wallet that got lucky once.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">4️⃣</div>
              <div>
                <h3 className="font-bold mb-1">Don't blindly copy</h3>
                <p className="text-gray-400 text-sm">Use smart money as a signal, not a guarantee. Always DYOR.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
