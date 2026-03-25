// MarketDashboardV3.js - Enhanced real-time market data dashboard with caching
import { useState, useEffect } from 'react';

export default function MarketDashboardV3() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // cards, table, compact
  const [sortBy, setSortBy] = useState('score'); // score, volume, change, risk
  const [filterRisk, setFilterRisk] = useState('all'); // all, low, medium, high
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchMarketData();
    // Refresh data every 30 seconds if auto-refresh is enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchMarketData, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/enhanced/market-data-v3');
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
    if (!num && num !== 0) return 'N/A';
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (num) => {
    if (!num && num !== 0) return 'N/A';
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
  };

  const getChangeColor = (change) => {
    if (!change && change !== 0) return 'text-gray-400';
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-500 bg-green-500/10';
      case 'bearish': return 'text-red-500 bg-red-500/10';
      default: return 'text-yellow-500 bg-yellow-500/10';
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'text-green-500 bg-green-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'high': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'high': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getVolatilityIcon = (volatility) => {
    switch (volatility) {
      case 'very-high': return '🌋';
      case 'high': return '⚡';
      case 'medium': return '📊';
      case 'low': return '📈';
      default: return '📊';
    }
  };

  const getTrendIcon = (trendStrength) => {
    switch (trendStrength) {
      case 'very-strong': return '🚀';
      case 'strong': return '📈';
      case 'moderate': return '↗️';
      case 'weak': return '➡️';
      default: return '📊';
    }
  };

  // Process and filter tokens
  const processedTokens = marketData?.topTokens ? [...marketData.topTokens]
    .filter(token => {
      if (filterRisk === 'all') return true;
      return token.riskLevel === filterRisk;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'volume': return b.volume24h - a.volume24h;
        case 'change': return b.priceChange24h - a.priceChange24h;
        case 'risk': 
          const riskOrder = { high: 3, medium: 2, low: 1 };
          return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
        case 'score':
        default: return b.score - a.score;
      }
    }) : [];

  if (loading && !marketData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <div className="text-xl font-semibold">Loading Enhanced Market Data...</div>
              <div className="text-gray-400 mt-2">Powered by Wolf Alerts v3</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-6">
            <div className="text-xl font-semibold text-red-400 mb-2">Error Loading Data</div>
            <div className="text-gray-300">{error}</div>
            <button
              onClick={fetchMarketData}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Neo Dashboard v3
              </h1>
              <div className="text-gray-400 mt-2">
                Real-time market intelligence with advanced analytics
                {marketData?.cached && <span className="ml-2 text-yellow-400">(Cached)</span>}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full ${getSentimentColor(marketData?.marketSentiment)}`}>
                {marketData?.marketSentiment?.toUpperCase() || 'NEUTRAL'}
              </div>
              <div className="text-sm text-gray-400">
                Updated: {marketData?.lastUpdated ? new Date(marketData.lastUpdated).toLocaleTimeString() : 'N/A'}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          {marketData?.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                <div className="text-gray-400 text-sm">Total Tokens</div>
                <div className="text-2xl font-bold">{marketData.stats.totalTokens}</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                <div className="text-gray-400 text-sm">Avg Score</div>
                <div className="text-2xl font-bold">{marketData.stats.averageScore}/100</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                <div className="text-gray-400 text-sm">High Confidence</div>
                <div className="text-2xl font-bold">{marketData.stats.highConfidenceTokens}</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                <div className="text-gray-400 text-sm">Cache Hit Rate</div>
                <div className="text-2xl font-bold">{marketData.cache?.hitRate || '0%'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mb-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">View:</span>
              <div className="flex bg-gray-900/50 rounded-lg p-1">
                {['cards', 'table', 'compact'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 rounded-md capitalize ${viewMode === mode ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1"
              >
                <option value="score">Score</option>
                <option value="volume">Volume</option>
                <option value="change">24h Change</option>
                <option value="risk">Risk Level</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400">Risk filter:</span>
              <div className="flex bg-gray-900/50 rounded-lg p-1">
                {['all', 'low', 'medium', 'high'].map(risk => (
                  <button
                    key={risk}
                    onClick={() => setFilterRisk(risk)}
                    className={`px-3 py-1 rounded-md capitalize ${filterRisk === risk ? getRiskColor(risk) : 'hover:bg-gray-800'}`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-gray-400">Auto-refresh (30s)</span>
              </label>
              <button
                onClick={fetchMarketData}
                className="px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Refresh Now
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tokens */}
          <div className="lg:col-span-2">
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {processedTokens.map((token, index) => (
                  <div
                    key={`${token.symbol}-${index}`}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-gray-600/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-xl font-bold">{token.symbol}</div>
                          <div className={`px-2 py-0.5 rounded-full text-xs ${getRiskColor(token.riskLevel)}`}>
                            {token.riskLevel}
                          </div>
                        </div>
                        <div className="text-gray-400 text-sm">{token.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${token.price?.toFixed(6) || 'N/A'}</div>
                        <div className={`text-sm ${getChangeColor(token.priceChange24h)}`}>
                          {formatPercentage(token.priceChange24h)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-gray-400 text-xs">Volume</div>
                        <div className="font-semibold">{formatNumber(token.volume24h)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs">Score</div>
                        <div className="font-semibold flex items-center gap-1">
                          {token.score}/100
                          <span className={getConfidenceColor(token.confidence)}>
                            ({token.confidence})
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs">Volatility</div>
                        <div className="font-semibold">
                          {getVolatilityIcon(token.volatility)} {token.volatility}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs">Trend</div>
                        <div className="font-semibold">
                          {getTrendIcon(token.trendStrength)} {token.trendStrength}
                        </div>
                      </div>
                    </div>

                    {token.signals && token.signals.length > 0 && (
                      <div className="mb-3">
                        <div className="text-gray-400 text-xs mb-1">Signals:</div>
                        <div className="space-y-1">
                          {token.signals.slice(0, 3).map((signal, i) => (
                            <div key={i} className="text-xs text-gray-300">{signal}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <a
                        href={token.pairUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        View on DexScreener
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : viewMode === 'table' ? (
              <div className="overflow-x-auto rounded-xl border border-gray-700/50">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="py-3 px-4 text-left">Token</th>
                      <th className="py-3 px-4 text-left">Price</th>
                      <th className="py-3 px-4 text-left">24h Change</th>
                      <th className="py-3 px-4 text-left">Volume</th>
                      <th className="py-3 px-4 text-left">Score</th>
                      <th className="py-3 px-4 text-left">Risk</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedTokens.map((token, index) => (
                      <tr 
                        key={`${token.symbol}-${index}`}
                        className="border-t border-gray-700/30 hover:bg-gray-800/30"
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold">{token.symbol}</div>
                          <div className="text-gray-400 text-sm">{token.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          ${token.price?.toFixed(6) || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={getChangeColor(token.priceChange24h)}>
                            {formatPercentage(token.priceChange24h)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {formatNumber(token.volume24h)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {token.score}
                            <span className={getConfidenceColor(token.confidence)}>
                              ({token.confidence})
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${getRiskColor(token.riskLevel)}`}>
                            {token.riskLevel}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={token.pairUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Compact view
              <div className="space-y-2">
                {processedTokens.map((token, index) => (
                  <div
                    key={`${token.symbol}-${index}`}
                    className="flex items-center justify-between bg-gray-800/30 hover:bg-gray-800/50 p-3 rounded-lg border border-gray-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-bold">{token.symbol}</div>
                      <div className={`px-2 py-0.5 rounded-full text-xs ${getRiskColor(token.riskLevel)}`}>
                        {token.riskLevel}
                      </div>
                      <div className="text-gray-400 text-sm">{token.name}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div>${token.price?.toFixed(6) || 'N/A'}</div>
                        <div className={`text-sm ${getChangeColor(token.priceChange24h)}`}>
                          {formatPercentage(token.priceChange24h)}
                        </div>
                      </div>
                      <div className="w-20">
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{ width: `${token.score}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-400 text-center mt-1">{token.score}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Analytics */}
          <div className="space-y-6">
            {/* Narratives */}
            {marketData?.narratives && marketData.narratives.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3">Market Narratives</h3>
                <div className="space-y-3">
                  {marketData.narratives.map((narrative, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        narrative.sentiment === 'bullish' ? 'border-green-500/30 bg-green-500/10' :
                        narrative.sentiment === 'bearish' ? 'border-red-500/30 bg-red-500/10' :
                        'border-yellow-500/30 bg-yellow-500/10'
                      }`}
                    >
                      <div className="font-medium mb-1">{narrative.title}</div>
                      <div className="text-sm text-gray-300">{narrative.content}</div>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          narrative.sentiment === 'bullish' ? 'bg-green-500/20 text-green-400' :
                          narrative.sentiment === 'bearish' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {narrative.sentiment}
                        </span>
                        <span className="text-xs text-gray-400">{narrative.priority} priority</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Whale Activity */}
            {marketData?.whaleActivity && marketData.whaleActivity.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3">Whale Activity</h3>
                <div className="space-y-3">
                  {marketData.whaleActivity.slice(0, 5).map((whale, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{whale.token}</div>
                        <div className={`text-sm ${
                          whale.action === 'buying' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {whale.action} {formatNumber(parseFloat(whale.size.replace('$', '').replace(',', '')))}
                        </div>
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-xs ${
                        whale.confidence === 'high' ? 'bg-green-500/20 text-green-400' :
                        whale.confidence === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {whale.confidence}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Advanced Metrics */}
            {marketData?.advancedMetrics && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3">Advanced Metrics</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-gray-400 text-xs">Market Breadth</div>
                      <div className="text-xl font-bold">{marketData.advancedMetrics.marketBreadth}%</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Volume Concentration</div>
                      <div className="text-xl font-bold">{marketData.advancedMetrics.volumeConcentration}%</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Risk Distribution</div>
                    <div className="flex h-4 rounded-full overflow-hidden">
                      {marketData.advancedMetrics.riskDistribution && (
                        <>
                          <div 
                            className="bg-green-500"
                            style={{ width: `${marketData.advancedMetrics.riskDistribution.low}%` }}
                            title={`Low: ${marketData.advancedMetrics.riskDistribution.low}%`}
                          />
                          <div 
                            className="bg-yellow-500"
                            style={{ width: `${marketData.advancedMetrics.riskDistribution.medium}%` }}
                            title={`Medium: ${marketData.advancedMetrics.riskDistribution.medium}%`}
                          />
                          <div 
                            className="bg-red-500"
                            style={{ width: `${marketData.advancedMetrics.riskDistribution.high}%` }}
                            title={`High: ${marketData.advancedMetrics.riskDistribution.high}%`}
                          />
                        </>
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-xs">Top Performer</div>
                    <div className="font-bold text-green-400">{marketData.advancedMetrics.topPerformer}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Cache Stats */}
            {marketData?.cache && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3">Cache Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hits:</span>
                    <span>{marketData.cache.hits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Misses:</span>
                    <span>{marketData.cache.misses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hit Rate:</span>
                    <span>{marketData.cache.hitRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Memory Usage:</span>
                    <span>{marketData.cache.memoryUsage?.toFixed(2)} MB</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-800/50 text-center text-gray-500 text-sm">
          <div>Powered by Wolf Alerts v3 • Neo Dashboard • Last updated: {new Date().toLocaleString()}</div>
          <div className="mt-1">
            {marketData?.stats?.processingTime && (
              <span>Processing time: {marketData.stats.processingTime}ms • </span>
            )}
            Data source: {marketData?.stats?.dataSource || 'live'}
          </div>
        </div>
      </div>
    </div>
  );
}