import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';

type Token = {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  pairAddress: string;
  dex: string;
  updatedAt: string;
  marketCap?: number;
  holders?: number;
};

type Narrative = {
  name: string;
  description: string;
  tokens: string[];
  score: number;
  volumeChange: number;
  avgPriceChange: string;
  totalVolume: number;
  topTokens: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
};

type WhaleTransaction = {
  id: string;
  wallet: string;
  action: 'bought' | 'sold' | 'transferred';
  token: string;
  tokenName: string;
  amountUSD: number;
  amountTokens: number;
  price: number;
  timestamp: string;
  successRate: number;
  profitLoss?: number;
};

type WhaleData = {
  wallet: {
    address: string;
    name: string;
    chain: string;
    tags: string[];
    success_rate: number;
    total_volume_usd: number;
    total_transactions: number;
  };
  transactions: WhaleTransaction[];
};

type DashboardData = {
  tokens: Token[];
  narratives: Narrative[];
  whales: WhaleData[];
  summary: {
    totalTokens: number;
    totalVolume24h: number;
    totalMarketCap: number;
    topGainer: Token;
    topLoser: Token;
    whaleCount: number;
    totalWhaleTransactions: number;
    avgWhaleSuccessRate: number;
  };
  timestamp: string;
};

type Timeframe = '1h' | '24h' | '7d' | '30d';

export default function DashboardEnhancedV2() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Loading...');
  const [timeframe, setTimeframe] = useState<Timeframe>('24h');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeTab, setActiveTab] = useState<'tokens' | 'narratives' | 'whales' | 'portfolio'>('tokens');
  
  const refreshInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchDashboardData();
    
    if (autoRefresh) {
      refreshInterval.current = setInterval(fetchDashboardData, 30000); // 30 seconds
    }
    
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [autoRefresh, timeframe]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/enhanced/data?type=dashboard&timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatUSD = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(2)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(2)}K`;
    return `$${amount.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    if (price < 0.0001) return `$${price.toFixed(8)}`;
    if (price < 1) return `$${price.toFixed(6)}`;
    if (price < 100) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`;
    return `$${volume.toFixed(0)}`;
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return '#00ff88';
      case 'bearish': return '#ff4757';
      default: return '#ffa502';
    }
  };

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? '#00ff88' : '#ff4757';
  };

  const filteredTokens = data?.tokens.filter(token => 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredWhales = selectedChain === 'all' 
    ? data?.whales || []
    : data?.whales.filter(whale => whale.wallet.chain === selectedChain) || [];

  if (loading && !data) {
    return (
      <Layout title="Dashboard V2 | iseeiape">
        <div className="container">
          <div className="section">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="heading-2 mb-2">🚀 Enhanced Dashboard</h1>
                <p className="text-muted">Loading real-time market intelligence...</p>
              </div>
            </div>
            
            <div className="card">
              <div className="text-center py-16">
                <div className="spinner mx-auto"></div>
                <p className="mt-6 text-lg">Initializing Neo Crypto Engine...</p>
                <p className="mt-2 text-sm text-muted">Fetching live data from multiple sources</p>
                
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 rounded-lg bg-surface text-center">
                    <div className="text-xs text-muted mb-1">DexScreener</div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-pulse" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-surface text-center">
                    <div className="text-xs text-muted mb-1">Birdeye</div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 animate-pulse" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-surface text-center">
                    <div className="text-xs text-muted mb-1">On-chain</div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-surface text-center">
                    <div className="text-xs text-muted mb-1">Whale Data</div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 animate-pulse" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard V2 | iseeiape">
        <div className="container">
          <div className="section">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="heading-2 mb-2">🚀 Enhanced Dashboard</h1>
                <p className="text-muted">Real-time market intelligence</p>
              </div>
            </div>
            
            <div className="card">
              <div className="text-center py-12">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold mb-2">Connection Error</h3>
                <p className="text-muted mb-6">{error}</p>
                <div className="flex gap-3 justify-center">
                  <button 
                    className="btn btn-primary"
                    onClick={fetchDashboardData}
                  >
                    🔄 Retry Connection
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => window.open('https://dexscreener.com', '_blank')}
                  >
                    📈 Open DexScreener
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard V2 | iseeiape">
      <div className="container">
        {/* Header */}
        <div className="section" style={{ paddingBottom: 0 }}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="heading-2 mb-2">🚀 Enhanced Dashboard</h1>
              <p className="text-muted">
                Neo Crypto Engine • Live smart money intelligence • Updated {lastUpdated}
              </p>
              {data && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="tag tag-success">
                    {data.tokens.length} Tokens
                  </span>
                  <span className="tag tag-info">
                    {formatUSD(data.summary.totalVolume24h)} Volume
                  </span>
                  <span className="tag tag-warning">
                    {data.summary.whaleCount} Whales
                  </span>
                  <span className="tag tag-primary">
                    Top: {data.summary.topGainer.symbol} +{data.summary.topGainer.priceChange24h?.toFixed(2) || '0.00'}%
                  </span>
                  <span className="tag tag-purple">
                    {Math.round(data.summary.avgWhaleSuccessRate * 100)}% Whale Success
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted">Auto-refresh:</span>
                <button
                  className={`px-3 py-1 rounded text-sm ${autoRefresh ? 'bg-primary text-white' : 'bg-surface'}`}
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  {autoRefresh ? 'ON' : 'OFF'}
                </button>
              </div>
              
              <div className="flex gap-1">
                {(['1h', '24h', '7d', '30d'] as Timeframe[]).map(tf => (
                  <button
                    key={tf}
                    className={`px-3 py-1 rounded text-sm ${timeframe === tf ? 'bg-primary text-white' : 'bg-surface'}`}
                    onClick={() => setTimeframe(tf)}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              
              <button 
                className="btn btn-primary"
                onClick={fetchDashboardData}
                disabled={loading}
              >
                {loading ? '🔄 Updating...' : '🔄 Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card p-4">
              <div className="text-sm text-muted mb-1">Total Market Cap</div>
              <div className="text-2xl font-bold">
                {data ? formatUSD(data.summary.totalMarketCap) : '$0'}
              </div>
              <div className="text-xs text-muted mt-1">Across all tracked tokens</div>
            </div>
            
            <div className="card p-4">
              <div className="text-sm text-muted mb-1">24h Volume</div>
              <div className="text-2xl font-bold text-green-500">
                {data ? formatUSD(data.summary.totalVolume24h) : '$0'}
              </div>
              <div className="text-xs text-muted mt-1">Trading activity</div>
            </div>
            
            <div className="card p-4">
              <div className="text-sm text-muted mb-1">Whale Activity</div>
              <div className="text-2xl font-bold text-yellow-500">
                {data?.summary.totalWhaleTransactions || 0}
              </div>
              <div className="text-xs text-muted mt-1">Transactions tracked</div>
            </div>
            
            <div className="card p-4">
              <div className="text-sm text-muted mb-1">Avg Whale Success</div>
              <div className="text-2xl font-bold text-purple-500">
                {data ? Math.round(data.summary.avgWhaleSuccessRate * 100) : 0}%
              </div>
              <div className="text-xs text-muted mt-1">Historical accuracy</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="section" style={{ paddingTop: 0 }}>
          {/* Tabs */}
          <div className="flex border-b border-border mb-6">
            {(['tokens', 'narratives', 'whales', 'portfolio'] as const).map(tab => (
              <button
                key={tab}
                className={`px-4 py-3 font-medium text-sm border-b-2 -mb-px transition-colors ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted hover:text-white'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'tokens' && '📈 Tokens'}
                {tab === 'narratives' && '🌊 Narratives'}
                {tab === 'whales' && '🐋 Whale Activity'}
                {tab === 'portfolio' && '💼 Portfolio'}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tokens, narratives, or whales..."
                  className="w-full px-4 py-2 bg-surface border border-border rounded-lg pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted">
                  🔍
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                className="px-3 py-2 bg-surface border border-border rounded-lg text-sm"
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
              >
                <option value="all">All Chains</option>
                <option value="solana">Solana</option>
                <option value="ethereum">Ethereum</option>
                <option value="base">Base</option>
                <option value="arbitrum">Arbitrum</option>
              </select>
              
              <button className="px-3 py-2 bg-surface border border-border rounded-lg text-sm hover:bg-surface-hover">
                ⚙️ Filters
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'tokens' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-4">📈 Trending Tokens</h2>
                <div className="text-sm text-muted">
                  Showing {filteredTokens.length} of {data?.tokens.length || 0} tokens
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted">Token</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted">24h Change</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted">Volume (24h)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted">Liquidity</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted">Market Cap</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTokens.map((token, i) => (
                      <tr key={i} className="border-b border-border hover:bg-surface">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-sm font-bold">{token.symbol.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="font-medium">${token.symbol}</div>
                              <div className="text-xs text-muted">{token.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {formatPrice(token.price)}
                        </td>
                        <td className="py-3 px-4">
                          <span style={{ color: getPriceChangeColor(token.priceChange24h) }}>
                            {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h?.toFixed(2) || '0.00'}%
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">
                          {formatVolume(token.volume24h)}
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">
                          {formatVolume(token.liquidity)}
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">
                          {token.marketCap ? formatUSD(token.marketCap) : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button 
                              className="px-2 py-1 text-xs bg-primary/20 text-primary rounded hover:bg-primary/30"
                              onClick={() => window.open(`https://dexscreener.com/solana/${token.pairAddress}`, '_blank')}
                            >
                              Chart
                            </button>
                            <button 
                              className="px-2 py-1 text-xs bg-green-500/20 text-green-500 rounded hover:bg-green-500/30"
                              onClick={() => {/* Add to watchlist */}}
                            >
                              Watch
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredTokens.length === 0 && (
                <div className="text-center py-8 text-muted">
                  No tokens found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}

          {activeTab === 'narratives' && data && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.narratives.map((narrative, i) => (
                <div key={i} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{narrative.name}</h3>
                      <p className="text-sm text-muted mt-1">{narrative.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        narrative.sentiment === 'bullish' ? 'bg-green-500/20 text-green-500' :
                        narrative.sentiment === 'bearish' ? 'bg-red-500/20 text-red-500' :
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {narrative.sentiment.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-bold">
                        {narrative.score}/100
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted">Top Tokens:</span>
                      <span className="font-medium">{narrative.topTokens.map(t => `$${t}`).join(', ')}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted">Volume Change:</span>
                      <span className="font-medium text-green-500">+{narrative.volumeChange}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Total Volume:</span>
                      <span className="font-medium">{formatUSD(narrative.totalVolume)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {narrative.tokens.map((token, j) => (
                      <button
                        key={j}
                        className="px-3 py-1 text-xs bg-surface border border-border rounded hover:bg-surface-hover"
                        onClick={() => setSearchQuery(token)}
                      >
                        ${token}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'whales' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-4">🐋 Whale Activity</h2>
                <div className="text-sm text-muted">
                  {filteredWhales.length} whales • {filteredWhales.reduce((sum, w) => sum + w.transactions.length, 0)} transactions
                </div>
              </div>
              
              <div className="space-y-6">
                {filteredWhales.map((whale, i) => (
                  <div key={i} className="p-4 rounded-lg bg-surface">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold">{whale.wallet.name}</h3>
                        <p className="text-sm text-muted font-mono mt-1">
                          {whale.wallet.address.slice(0, 8)}...{whale.wallet.address.slice(-4)}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {whale.wallet.tags.map((tag, j) => (
                            <span key={j} className="px-2 py-1 text-xs bg-border rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold" style={{ color: getSentimentColor(whale.wallet.success_rate > 0.7 ? 'bullish' : 'bearish') }}>
                          {Math.round(whale.wallet.success_rate * 100)}% Success
                        </div>
                        <div className="text-sm text-muted">
                          {formatUSD(whale.wallet.total_volume_usd)} • {whale.wallet.total_transactions} txs
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {whale.transactions.map((tx, j) => (
                        <div key={j} className="flex items-center justify-between p-3 rounded bg-surface-hover">
                          <div className="flex items-center gap-3">
                            <span className={`text-lg ${tx.action === 'bought' ? 'text-green-500' : 'text-red-500'}`}>
                              {tx.action === 'bought' ? '🟢' : tx.action === 'sold' ? '🔴' : '🟡'}
                            </span>
                            <div>
                              <div className="font-medium">
                                {tx.action === 'bought' ? 'Bought' : tx.action === 'sold' ? 'Sold' : 'Transferred'} ${tx.token}
                              </div>
                              <div className="text-xs text-muted">
                                {tx.tokenName} • {getTimeAgo(tx.timestamp)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold font-mono">{formatUSD(tx.amountUSD)}</div>
                            <div className="text-xs text-muted">
                              @ {formatPrice(tx.price)}
                              {tx.profitLoss !== undefined && (
                                <span className={`ml-2 ${tx.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                  {tx.profitLoss >= 0 ? '+' : ''}{tx.profitLoss.toFixed(2)}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="card">
              <div className="text-center py-12">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-xl font-bold mb-2">Portfolio Tracking</h3>
                <p className="text-muted mb-6">
                  Connect your wallet to track your portfolio performance alongside whale activity.
                </p>
                <div className="flex gap-3 justify-center">
                  <button className="btn btn-primary">
                    🔗 Connect Wallet
                  </button>
                  <button className="btn btn-secondary">
                    📊 Demo Portfolio
                  </button>
                </div>
                <p className="text-sm text-muted mt-6">
                  Supports Solana, Ethereum, and Base wallets. Coming soon: Automated portfolio rebalancing.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="card">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">🦎</span>
                  <span className="font-bold">Neo Crypto Engine</span>
                </div>
                <p className="text-sm text-muted">
                  Part of the Matrix Army • Real-time data from DexScreener, Birdeye, and on-chain sources
                </p>
              </div>
              
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-xs text-muted mb-1">Data Freshness</div>
                  <div className="text-sm font-bold text-green-500">
                    {data ? getTimeAgo(data.timestamp) : 'N/A'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-muted mb-1">API Status</div>
                  <div className="text-sm font-bold text-green-500">
                    ✅ Live
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-muted mb-1">Next Update</div>
                  <div className="text-sm font-bold">
                    {autoRefresh ? '30s' : 'Manual'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border text-xs text-muted">
              <p>
                <strong>⚠️ Risk Disclaimer:</strong> This dashboard provides data for informational purposes only. 
                Not financial advice. Always do your own research. Whale activity does not guarantee future performance.
              </p>
              <p className="mt-2">
                <strong>📊 Data Sources:</strong> DexScreener API, simulated whale data, narrative analysis by Neo AI.
                Real whale data integration coming soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}