// MarketDashboardEnhanced.js - Enhanced real-time market data dashboard
import { useState, useEffect, useCallback } from 'react';

export default function MarketDashboardEnhanced() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [sortBy, setSortBy] = useState('score');

  const fetchMarketData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchMarketData();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchMarketData, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchMarketData, autoRefresh]);

  const formatNumber = (num) => {
    if (!num && num !== 0) return 'N/A';
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (num) => {
    if (!num && num !== 0) return 'N/A';
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return 'bg-gradient-to-r from-green-900/30 to-green-500/10 border-green-500/50';
      case 'bearish': return 'bg-gradient-to-r from-red-900/30 to-red-500/10 border-red-500/50';
      default: return 'bg-gradient-to-r from-yellow-900/30 to-yellow-500/10 border-yellow-500/50';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (score >= 80) return 'bg-gradient-to-r from-blue-500 to-cyan-600';
    if (score >= 70) return 'bg-gradient-to-r from-purple-500 to-pink-600';
    return 'bg-gradient-to-r from-gray-500 to-gray-700';
  };

  const getChangeColor = (change) => {
    if (change > 20) return 'text-green-400';
    if (change > 5) return 'text-green-300';
    if (change > 0) return 'text-green-200';
    if (change < -20) return 'text-red-400';
    if (change < -5) return 'text-red-300';
    if (change < 0) return 'text-red-200';
    return 'text-gray-400';
  };

  const sortTokens = (tokens) => {
    if (!tokens) return [];
    
    const sorted = [...tokens];
    switch (sortBy) {
      case 'score':
        return sorted.sort((a, b) => b.score - a.score);
      case 'volume':
        return sorted.sort((a, b) => b.volume24h - a.volume24h);
      case 'change':
        return sorted.sort((a, b) => b.priceChange24h - a.priceChange24h);
      case 'liquidity':
        return sorted.sort((a, b) => b.liquidity - a.liquidity);
      default:
        return sorted;
    }
  };

  const getTimeframeChange = (token) => {
    switch (selectedTimeframe) {
      case '1h':
        return token.priceChange1h || 0;
      case '24h':
        return token.priceChange24h || 0;
      default:
        return token.priceChange24h || 0;
    }
  };

  if (loading && !marketData) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800 shadow-2xl">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-blue-400 text-2xl">🦎</div>
            </div>
          </div>
          <p className="mt-6 text-gray-400 text-lg">Loading real-time market data...</p>
          <p className="text-gray-600 text-sm mt-2">Fetching latest Wolf Alerts</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800 shadow-2xl">
        <div className="text-center py-12">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-400 mb-2">Connection Error</h3>
          <p className="text-gray-400 mb-6">Unable to load market data</p>
          <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-800">
            <code className="text-sm text-gray-500">{error}</code>
          </div>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={fetchMarketData}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold transition-all duration-200"
            >
              ↻ Retry Connection
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 rounded-lg font-semibold transition-all duration-200"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sortedTokens = sortTokens(marketData?.topTokens || []);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800 shadow-2xl">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🦎</div>
            <div>
              <h2 className="text-3xl font-bold text-white">Live Market Intelligence</h2>
              <p className="text-gray-400">
                Real-time crypto data • Updated {marketData?.lastUpdated ? new Date(marketData.lastUpdated).toLocaleTimeString() : 'N/A'}
                {marketData?.source && <span className="ml-2 text-blue-400">• {marketData.source}</span>}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {/* Timeframe Selector */}
          <div className="bg-gray-900 rounded-xl p-1 border border-gray-800">
            <div className="flex">
              {['1h', '24h'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTimeframe === tf ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          
          {/* Sort Options */}
          <div className="bg-gray-900 rounded-xl p-1 border border-gray-800">
            <div className="flex">
              {[
                { id: 'score', label: 'Score' },
                { id: 'volume', label: 'Volume' },
                { id: 'change', label: 'Change' },
                { id: 'liquidity', label: 'Liquidity' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${sortBy === option.id ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  title={`Sort by ${option.label}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-xl border transition-all ${autoRefresh ? 'bg-gradient-to-r from-green-900/30 to-green-500/10 border-green-500/50 text-green-400' : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white'}`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
              <span className="text-sm font-medium">Auto-refresh</span>
            </div>
          </button>
        </div>
      </div>

      {/* Market Sentiment Banner */}
      <div className={`mb-8 rounded-2xl p-6 border ${getSentimentColor(marketData?.marketSentiment)}`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`text-2xl ${marketData?.marketSentiment === 'bullish' ? '📈' : marketData?.marketSentiment === 'bearish' ? '📉' : '📊'}`}></div>
              <div>
                <h3 className="text-xl font-bold text-white">Market Sentiment: <span className="capitalize">{marketData?.marketSentiment || 'neutral'}</span></h3>
                <p className="text-gray-300">
                  Based on {marketData?.stats?.totalTokens || 0} tokens • {marketData?.stats?.totalNarratives || 0} active narratives
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{marketData?.stats?.totalTokens || 0}</div>
              <div className="text-xs text-gray-400">Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{marketData?.stats?.totalNarratives || 0}</div>
              <div className="text-xs text-gray-400">Narratives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{marketData?.stats?.totalWhales || 0}</div>
              <div className="text-xs text-gray-400">Whales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {sortedTokens.length > 0 ? sortedTokens[0].score : '--'}
              </div>
              <div className="text-xs text-gray-400">Top Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Tokens Grid */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">🔥 Top Alpha Opportunities</h3>
          <div className="text-gray-400 text-sm">
            Showing {Math.min(sortedTokens.length, 6)} of {sortedTokens.length} tokens
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTokens.slice(0, 6).map((token, index) => {
            const timeframeChange = getTimeframeChange(token);
            return (
              <div 
                key={index} 
                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getScoreColor(token.score)}`}>
                        <span className="font-bold text-white">{token.score}</span>
                      </div>
                      <div>
                        <div className="font-bold text-xl text-white group-hover:text-blue-300 transition-colors">
                          {token.symbol}
                        </div>
                        <div className="text-sm text-gray-400">{token.name}</div>
                      </div>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getChangeColor(timeframeChange)}`}>
                    {formatPercentage(timeframeChange)}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Price</span>
                    <span className="font-semibold text-white">${token.price?.toFixed(8) || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">24h Volume</span>
                    <span className="font-semibold text-white">{formatNumber(token.volume24h)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Liquidity</span>
                    <span className="font-semibold text-white">{formatNumber(token.liquidity)}</span>
                  </div>
                  
                  {token.signals && token.signals.length > 0 && (
                    <div className="pt-3 border-t border-gray-800">
                      <div className="text-gray-400 text-sm mb-2">Signals:</div>
                      <div className="flex flex-wrap gap-2">
                        {token.signals.slice(0, 3).map((signal, sigIndex) => (
                          <span 
                            key={sigIndex} 
                            className="px-2 py-1 bg-gray-800 rounded-lg text-xs text-gray-300"
                          >
                            {signal}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-800">
                  <a 
                    href={`https://dexscreener.com/solana/${token.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold transition-all duration-200 group-hover:scale-[1.02]"
                  >
                    View on DexScreener ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Narratives Section */}
      {marketData?.narratives && marketData.narratives.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">📊 Market Narratives</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketData.narratives.map((narrative, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-2xl mb-2">{narrative.name.split(' ')[0]}</div>
                    <h4 className="text-lg font-bold text-white">{narrative.name}</h4>
                    <p className="text-gray-400 text-sm mt-1">{narrative.description}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${getScoreColor(narrative.score)} text-white font-bold`}>
                    {narrative.score}
                  </div>
                </div>
                
                {narrative.tokens && narrative.tokens.length > 0 && (
                  <div className="mt-4">
                    <div className="text-gray-400 text-sm mb-2">Tokens in this narrative:</div>
                    <div className="flex flex-wrap gap-2">
                      {narrative.tokens.map((token, tokenIndex) => (
                        <span 
                          key={tokenIndex} 
                          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-colors cursor-pointer"
                          onClick={() => {
                            // Find and scroll to token
                            const tokenElement = document.querySelector(`[data-token="${token}"]`);
                            if (tokenElement) {
                              tokenElement.scrollIntoView({ behavior: 'smooth' });
                              tokenElement.classList.add('ring-2', 'ring-blue-500');
                              setTimeout(() => tokenElement.classList.remove('ring-2', 'ring-blue-500'), 2000);
                            }
                          }}
                        >
                          {token}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Whale Activity */}
      {marketData?.whaleActivity && marketData.whaleActivity.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">🐋 Recent Whale Activity</h3>
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Token</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Value</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Whale</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.whaleActivity.slice(0, 5).map((activity, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${index % 2 === 0 ? 'bg-gray-900/20' : ''}`}
                    >
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${activity.type === 'buy' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${activity.type === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="font-medium capitalize">{activity.type}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-white">{activity.token}</td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{formatNumber(activity.amount)}</div>
                        <div className="text-xs text-gray-400">{activity.token}</div>
                      </td>
                      <td className="p-4 font-bold text-white">{formatNumber(activity.value)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                          <span className="text-gray-300">{activity.wallet}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            Data updates every 30 seconds • Last scan: {marketData?.lastScan ? new Date(marketData.lastScan).toLocaleString() : 'N/A'}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchMarketData}
              className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              <span>↻</span>
              <span>Refresh Now</span>
            </button>
            <div className="text-xs text-gray-600">
              {autoRefresh ? 'Auto-refresh: ON' : 'Auto-refresh: OFF'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}