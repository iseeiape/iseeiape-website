import { useState, useEffect } from 'react';
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
};

type WhaleTransaction = {
  id: string;
  wallet: string;
  action: string;
  token: string;
  tokenName: string;
  amountUSD: number;
  amountTokens: number;
  price: number;
  timestamp: string;
  successRate: number;
};

type WhaleData = {
  wallet: {
    address: string;
    name: string;
    chain: string;
    tags: string[];
    success_rate: number;
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
    topGainer: Token;
    topLoser: Token;
    whaleCount: number;
    totalWhaleTransactions: number;
  };
};

export default function DashboardEnhanced() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Loading...');

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/enhanced/data?type=dashboard');
      
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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

  if (loading && !data) {
    return (
      <Layout title="Dashboard | iseeiape">
        <div className="container">
          <div className="section">
            <h1 className="heading-2 mb-4">📊 Real-time Dashboard</h1>
            <div className="card">
              <div className="text-center py-12">
                <div className="spinner"></div>
                <p className="mt-4">Loading live market data...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard | iseeiape">
        <div className="container">
          <div className="section">
            <h1 className="heading-2 mb-4">📊 Real-time Dashboard</h1>
            <div className="card">
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">⚠️ Error loading data</div>
                <p>{error}</p>
                <button 
                  className="btn btn-primary mt-4"
                  onClick={fetchDashboardData}
                >
                  🔄 Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard | iseeiape">
      <div className="container">
        {/* Header */}
        <div className="section" style={{ paddingBottom: 0 }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="heading-2 mb-2">📊 Real-time Dashboard</h1>
              <p style={{ color: 'var(--text-muted)' }}>
                Live smart money intelligence • Updated {lastUpdated}
              </p>
              {data && (
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="tag tag-success">
                    {data.tokens.length} Tokens
                  </span>
                  <span className="tag tag-info">
                    {formatVolume(data.summary.totalVolume24h)} Volume
                  </span>
                  <span className="tag tag-warning">
                    {data.summary.whaleCount} Whales
                  </span>
                  <span className="tag tag-primary">
                    Top: {data.summary.topGainer.symbol} +{data.summary.topGainer.priceChange24h?.toFixed(2) || '0.00'}%
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button 
                className="btn btn-secondary"
                onClick={() => window.open('https://dexscreener.com/solana', '_blank')}
              >
                📈 DexScreener
              </button>
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

        {/* Main Grid */}
        <div className="section" style={{ paddingTop: 'var(--space-6)' }}>
          <div className="grid grid-2">
            {/* Trending Tokens */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-4 text-gradient">🔥 Trending Tokens</h2>
                <span className="tag tag-success">Live</span>
              </div>
              
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Token</th>
                      <th>Price</th>
                      <th>24h</th>
                      <th>Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.tokens.map((token, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ fontWeight: 600 }}>${token.symbol}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            {token.name}
                          </div>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>
                          {formatPrice(token.price)}
                        </td>
                        <td>
                          <span className={token.priceChange24h >= 0 ? 'positive' : 'negative'}>
                            {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h?.toFixed(2) || '0.00'}%
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
                          {formatVolume(token.volume24h)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Top Gainer:</span>
                  <span className="positive font-semibold">
                    ${data?.summary.topGainer.symbol} +{data?.summary.topGainer.priceChange24h?.toFixed(2) || '0.00'}%
                  </span>
                </div>
              </div>
            </div>

            {/* Top Narratives */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-4 text-gradient">🌊 Top Narratives</h2>
                <span className="tag tag-info">Trending</span>
              </div>
              
              <div className="space-y-4">
                {data?.narratives.map((narrative, i) => (
                  <div key={i} className="p-3 rounded-lg bg-surface">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{narrative.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          narrative.score >= 80 ? 'bg-green-500/20 text-green-400' :
                          narrative.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {narrative.score}/100
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted mb-3">
                      {narrative.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {narrative.topTokens.map((token, j) => (
                        <span 
                          key={j}
                          className="text-xs px-2 py-1 rounded bg-primary/10 text-primary"
                        >
                          ${token}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-xs mt-3 text-muted">
                      <span>Vol: +{narrative.volumeChange}%</span>
                      <span>Avg: {narrative.avgPriceChange}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Whale Activity */}
          <div className="mt-8">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-4 text-gradient">🐋 Whale Activity</h2>
                <span className="tag tag-warning">
                  {data?.summary.totalWhaleTransactions} Transactions
                </span>
              </div>
              
              <div className="grid grid-3">
                {data?.whales.map((whale, i) => (
                  <div key={i} className="p-4 rounded-lg bg-surface">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{whale.wallet.name}</h3>
                        <p className="text-xs text-muted font-mono">
                          {whale.wallet.address.slice(0, 8)}...{whale.wallet.address.slice(-4)}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        whale.wallet.success_rate >= 0.8 ? 'bg-green-500/20 text-green-400' :
                        whale.wallet.success_rate >= 0.6 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {Math.round(whale.wallet.success_rate * 100)}% Success
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {whale.transactions.map((tx, j) => (
                        <div key={j} className="text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {tx.action === 'bought' ? '🟢 Bought' : 
                               tx.action === 'sold' ? '🔴 Sold' : '🟡 Transferred'} ${tx.token}
                            </span>
                            <span className="font-mono">
                              {formatUSD(tx.amountUSD)}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-muted">
                            <span>@ {formatPrice(tx.price)}</span>
                            <span>{getTimeAgo(tx.timestamp)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {whale.wallet.tags.map((tag, j) => (
                        <span 
                          key={j}
                          className="text-xs px-2 py-0.5 rounded bg-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Summary */}
          <div className="mt-8">
            <div className="card">
              <h2 className="heading-4 text-gradient mb-6">📈 Market Summary</h2>
              
              <div className="grid grid-4">
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-primary">
                    {data?.tokens.length || 0}
                  </div>
                  <div className="text-sm text-muted mt-1">Tokens Tracked</div>
                </div>
                
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-green-500">
                    {data ? formatVolume(data.summary.totalVolume24h) : '$0'}
                  </div>
                  <div className="text-sm text-muted mt-1">24h Volume</div>
                </div>
                
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-yellow-500">
                    {data?.summary.whaleCount || 0}
                  </div>
                  <div className="text-sm text-muted mt-1">Active Whales</div>
                </div>
                
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-purple-500">
                    {data?.narratives.length || 0}
                  </div>
                  <div className="text-sm text-muted mt-1">Narratives</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-sm text-muted">
                  <p>
                    <strong>Note:</strong> This dashboard uses real-time data from DexScreener API 
                    and generates realistic whale transaction data for demonstration. 
                    The enhanced API system updates every 30 minutes.
                  </p>
                  <p className="mt-2">
                    <strong>Next Update:</strong> In ~{30 - (new Date().getMinutes() % 30)} minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}