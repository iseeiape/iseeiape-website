// pages/dashboard.js - Real-time market dashboard page
import MarketDashboard from '../components/MarketDashboard';
import Head from 'next/head';

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>🦎 Live Market Dashboard - iseeiape</title>
        <meta name="description" content="Real-time crypto market dashboard with whale alerts, trending narratives, and live price data" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        {/* Navigation */}
        <nav className="border-b border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
                <span className="text-xl font-bold">iseeiape</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">Live Dashboard</span>
              </div>
              <div className="flex space-x-4">
                <a href="/" className="text-gray-400 hover:text-white">Home</a>
                <a href="/dashboard" className="text-blue-400">Dashboard</a>
                <a href="/about" className="text-gray-400 hover:text-white">About</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🦎 Real-Time Crypto Intelligence
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Track whale movements, identify trending narratives, and stay ahead of the market with our automated data pipeline.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-400">24/7</div>
              <div className="text-gray-400">Data Updates</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="text-3xl font-bold text-green-400">100+</div>
              <div className="text-gray-400">Tokens Tracked</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="text-3xl font-bold text-purple-400">50+</div>
              <div className="text-gray-400">Whale Wallets</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-400">10+</div>
              <div className="text-gray-400">Market Narratives</div>
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="mb-8">
            <MarketDashboard />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="text-2xl mb-4">🤖 Automated Analysis</div>
              <p className="text-gray-400">
                Our AI-powered system analyzes market data, identifies patterns, and generates actionable insights 24/7.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="text-2xl mb-4">🐋 Whale Tracking</div>
              <p className="text-gray-400">
                Monitor smart money movements with real-time alerts on large transactions and wallet activity.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="text-2xl mb-4">📈 Narrative Scoring</div>
              <p className="text-gray-400">
                Track trending market narratives with our proprietary scoring system to identify emerging opportunities.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Join the Matrix Army 🦎</h2>
            <p className="text-xl text-gray-300 mb-6">
              Get access to premium features, advanced analytics, and automated trading signals.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200">
                Start Free Trial
              </button>
              <button className="px-6 py-3 border border-white text-white font-bold rounded-lg hover:bg-white hover:text-black">
                View Documentation
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-8">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>🦎 Matrix Army Content Machine • Powered by real-time data automation</p>
            <p className="mt-2 text-sm">
              Data updates every 5 minutes • Last system check: {new Date().toLocaleDateString()}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}