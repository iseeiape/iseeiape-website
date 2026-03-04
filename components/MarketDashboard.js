// MarketDashboard.js - Real-time market data dashboard component
import { useState, useEffect } from 'react';

export default function MarketDashboard() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarketData();
    // Refresh data every 60 seconds
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/market-data');
      if (!response.ok) throw new Error('Failed to fetch market data');
      const data = await response.json();
      setMarketData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching market data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-500';
      case 'bearish': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  if (loading && !marketData) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="text-red-500 text-center">
          <p>⚠️ Error loading market data</p>
          <p className="text-sm text-gray-400">{error}</p>
          <button 
            onClick={fetchMarketData}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">🦎 Live Market Dashboard</h2>
          <p className="text-gray-400 text-sm">
            Real-time crypto data • Updated {marketData?.lastUpdated ? new Date(marketData.lastUpdated).toLocaleTimeString() : 'N/A'}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg ${getSentimentColor(marketData?.marketSentiment)} bg-gray-800`}>
          <span className="font-bold">{marketData?.marketSentiment?.toUpperCase() || 'NEUTRAL'}</span>
        </div>
      </div>

      {/* Top Tokens */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">📈 Top Movers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {marketData?.topTokens?.slice(0, 5).map((token, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-white">{token.symbol}</div>
                  <div className="text-sm text-gray-400">{token.name}</div>
                </div>
                <div className={`text-lg font-bold ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {token.priceChange24h >= 0 ? '↗' : '↘'} {Math.abs(token.priceChange24h).toFixed(2)}%
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-white">{formatNumber(token.price)}</div>
                <div className="text-sm text-gray-400">Vol: {formatNumber(token.volume24h)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Narratives */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">🧠 Trending Narratives</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketData?.narratives?.slice(0, 3).map((narrative, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-white">{narrative.name}</div>
                <div className="text-lg font-bold text-blue-400">{narrative.score}/100</div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${narrative.score}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                {narrative.tokens?.length || 0} tokens • {narrative.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Whale Activity */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">🐋 Recent Whale Activity</h3>
        <div className="space-y-3">
          {marketData?.whaleActivity?.slice(0, 3).map((activity, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${activity.type === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <div className="font-bold text-white">
                      {activity.type === 'buy' ? 'BOUGHT' : 'SOLD'} {activity.amount.toLocaleString()} {activity.token}
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatNumber(activity.value)} • {activity.wallet}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <div>
            <span className="text-blue-400">🦎 Matrix Army</span> • Powered by real-time APIs
          </div>
          <button 
            onClick={fetchMarketData}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs"
          >
            ↻ Refresh
          </button>
        </div>
      </div>
    </div>
  );
}