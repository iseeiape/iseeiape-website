// pages/dashboard-enhanced-v3.tsx - Enhanced real-time dashboard
import MarketDashboardEnhanced from '../components/MarketDashboardEnhanced';
import SystemStatus from '../components/SystemStatus';
import LiveWhaleFeed from '../components/LiveWhaleFeed';
import XTrends from '../components/XTrends';
import Head from 'next/head';
import { useState } from 'react';

export default function DashboardEnhancedV3() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);

  return (
    <>
      <Head>
        <title>🦎 Neo Dashboard v3 - Real-time Crypto Intelligence</title>
        <meta name="description" content="Enhanced real-time crypto market dashboard with whale alerts, AI-powered insights, and live trading signals" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-gray-50 to-white'} text-${darkMode ? 'white' : 'gray-900'}`}>
        {/* Navigation */}
        <nav className={`border-b ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white/50'} backdrop-blur-lg sticky top-0 z-50`}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold">🦎</span>
                  </div>
                  <div>
                    <div className="text-xl font-bold">iseeiape</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Neo Dashboard v3</div>
                  </div>
                </div>
                
                {/* Tabs */}
                <div className="hidden md:flex ml-8">
                  <div className={`flex ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-1`}>
                    {[
                      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                      { id: 'whales', label: 'Whales', icon: '🐋' },
                      { id: 'trends', label: 'Trends', icon: '🔥' },
                      { id: 'system', label: 'System', icon: '⚙️' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id 
                          ? `${darkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'}` 
                          : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}`}
                      >
                        <span>{tab.icon}</span>
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                  title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? '🌙' : '☀️'}
                </button>
                
                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Live</span>
                </div>
                
                {/* Links */}
                <div className="hidden md:flex items-center gap-4">
                  <a href="/" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Home</a>
                  <a href="/insights" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Insights</a>
                  <a href="/premium" className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'} text-white font-medium transition-all`}>
                    Premium
                  </a>
                </div>
              </div>
            </div>
            
            {/* Mobile Tabs */}
            <div className="flex md:hidden mt-4 overflow-x-auto">
              <div className={`flex ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-1 min-w-max`}>
                {[
                  { id: 'dashboard', label: '📊 Dashboard' },
                  { id: 'whales', label: '🐋 Whales' },
                  { id: 'trends', label: '🔥 Trends' },
                  { id: 'system', label: '⚙️ System' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${activeTab === tab.id 
                      ? `${darkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'}` 
                      : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className={`px-4 py-2 rounded-full ${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30' : 'bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200'}`}>
                <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>🦎 NIGHT SHIFT BUILD • v3.0</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Real-Time Crypto Intelligence
              </span>
            </h1>
            <p className={`text-xl max-w-3xl mx-auto mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Track whale movements, identify trending narratives, and execute with precision using our AI-powered data pipeline.
              <span className="block mt-2 text-sm">Updated every 30 seconds • Powered by Wolf Alerts v4.2</span>
            </p>
            
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200'}`}>
                <div className="text-2xl font-bold">24/7</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Monitoring</div>
              </div>
              <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200'}`}>
                <div className="text-2xl font-bold">AI</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Powered</div>
              </div>
              <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200'}`}>
                <div className="text-2xl font-bold">Real-time</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Alerts</div>
              </div>
              <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200'}`}>
                <div className="text-2xl font-bold">95%</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-8">
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <MarketDashboardEnhanced />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-black border border-gray-800' : 'bg-white border border-gray-200'}`}>
                      <h3 className="text-2xl font-bold mb-6">📈 Market Overview</h3>
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl mb-4">📊</div>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Market overview chart coming soon</p>
                          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Integration with TradingView in progress</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <SystemStatus />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'whales' && (
              <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-black border border-gray-800' : 'bg-white border border-gray-200'}`}>
                <h2 className="text-3xl font-bold mb-6">🐋 Live Whale Feed</h2>
                <LiveWhaleFeed />
              </div>
            )}
            
            {activeTab === 'trends' && (
              <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-black border border-gray-800' : 'bg-white border border-gray-200'}`}>
                <h2 className="text-3xl font-bold mb-6">🔥 X/Twitter Trends</h2>
                <XTrends />
              </div>
            )}
            
            {activeTab === 'system' && (
              <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-black border border-gray-800' : 'bg-white border border-gray-200'}`}>
                <h2 className="text-3xl font-bold mb-6">⚙️ System Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SystemStatus />
                  <div>
                    <h3 className="text-xl font-bold mb-4">System Information</h3>
                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <div className="text-sm text-gray-400 mb-1">Version</div>
                        <div className="font-bold">Neo Dashboard v3.0</div>
                      </div>
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <div className="text-sm text-gray-400 mb-1">Last Updated</div>
                        <div className="font-bold">{new Date().toLocaleString()}</div>
                      </div>
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <div className="text-sm text-gray-400 mb-1">Data Source</div>
                        <div className="font-bold">Wolf Alerts v4.2 + DexScreener API</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className={`mt-12 pt-8 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} text-center`}>
            <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
              🦎 Built during Night Shift • {new Date().toLocaleDateString()} • Data updates every 30 seconds
              <br />
              <span className="mt-2 block">iseeiape.com • @iseeicode • Matrix Army</span>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}