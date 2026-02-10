import Head from 'next/head';
import { useState, useEffect } from 'react';

type TrendingToken = {
  name: string;
  symbol: string;
  chain: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  url: string;
  buys24h: number;
  sells24h: number;
  buySellRatio: number;
  createdAt: string | null;
};

type WalletData = {
  address: string;
  label: string;
  chain: string;
  totalProfit: number;
  totalROI: number;
  recentTrades: Array<{
    token: string;
    profit: number;
    roi: number;
    timeframe: string;
  }>;
  lastActive: string;
};

export default function Dashboard() {
  const [trendingTokens, setTrendingTokens] = useState<TrendingToken[]>([]);
  const [topWallets, setTopWallets] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch trending tokens
      const tokensRes = await fetch('/api/dexscreener/trending');
      const tokensData = await tokensRes.json();
      
      // Fetch top wallets
      const walletsRes = await fetch('/api/cielo/wallets?limit=5');
      const walletsData = await walletsRes.json();
      
      if (tokensData.success) {
        setTrendingTokens(tokensData.data);
      }
      
      if (walletsData.success) {
        setTopWallets(walletsData.data.wallets);
      }
      
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh data every 2 minutes
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(2)}K`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <>
      <Head>
        <title>Real-time Dashboard - iseeiape</title>
        <meta name="description" content="Real-time smart money intelligence dashboard" />
      </Head>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px', color: '#fff', background: '#0a0a0a', minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '36px', color: '#00ff88', marginBottom: '10px' }}>📊 Real-time Dashboard</h1>
            <p style={{ color: '#888' }}>
              Live smart money intelligence for Solana & Base
              {lastUpdated && <span> • Last updated: {lastUpdated}</span>}
            </p>
          </div>
          <button
            onClick={fetchData}
            style={{
              padding: '10px 20px',
              background: '#00ff88',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '24px', color: '#00ff88' }}>Loading real-time data...</div>
            <div style={{ marginTop: '20px', color: '#888' }}>Fetching from DexScreener & Cielo APIs</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
              {/* Trending Tokens */}
              <div style={{ background: '#111', padding: '30px', borderRadius: '12px' }}>
                <h2 style={{ fontSize: '24px', color: '#00ff88', marginBottom: '20px' }}>🔥 Trending Tokens</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #333' }}>
                        <th style={{ textAlign: 'left', padding: '10px', color: '#888' }}>Token</th>
                        <th style={{ textAlign: 'left', padding: '10px', color: '#888' }}>Price</th>
                        <th style={{ textAlign: 'left', padding: '10px', color: '#888' }}>24h Change</th>
                        <th style={{ textAlign: 'left', padding: '10px', color: '#888' }}>Volume</th>
                        <th style={{ textAlign: 'left', padding: '10px', color: '#888' }}>Chain</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trendingTokens.map((token, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #222' }}>
                          <td style={{ padding: '10px' }}>
                            <div style={{ fontWeight: 'bold' }}>{token.symbol}</div>
                            <div style={{ fontSize: '12px', color: '#888' }}>{token.name}</div>
                          </td>
                          <td style={{ padding: '10px' }}>${token.price.toFixed(6)}</td>
                          <td style={{ padding: '10px', color: token.priceChange24h >= 0 ? '#00ff88' : '#ff4444' }}>
                            {formatPercentage(token.priceChange24h)}
                          </td>
                          <td style={{ padding: '10px' }}>{formatCurrency(token.volume24h)}</td>
                          <td style={{ padding: '10px' }}>
                            <span style={{
                              padding: '4px 8px',
                              background: token.chain === 'solana' ? '#14F195' : '#0052FF',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              {token.chain.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Wallets */}
              <div style={{ background: '#111', padding: '30px', borderRadius: '12px' }}>
                <h2 style={{ fontSize: '24px', color: '#00ff88', marginBottom: '20px' }}>🐋 Top Performing Wallets</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #333' }}>
                        <th style={{ textAlign: 'left', padding: '10px', color: '#888' }}>Wallet</th>
                        <th style={{ textAlign: 'left', padding: '10px', color: '#888' }}>Total Profit</th>
                        <th style={{ textAlign: 'left', padding: '10px', color: '#888' }}>ROI</th>
                        <th style={{ textAlign: 'left', padding: '10px', color: '#888' }}>Recent Trades</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topWallets.map((wallet, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #222' }}>
                          <td style={{ padding: '10px' }}>
                            <div style={{ fontWeight: 'bold' }}>{wallet.label}</div>
                            <div style={{ fontSize: '12px', color: '#888' }}>{wallet.address}</div>
                          </td>
                          <td style={{ padding: '10px', color: '#00ff88' }}>
                            {formatCurrency(wallet.totalProfit)}
                          </td>
                          <td style={{ padding: '10px', color: '#00ff88' }}>
                            +{wallet.totalROI.toFixed(2)}%
                          </td>
                          <td style={{ padding: '10px' }}>
                            <div style={{ fontSize: '12px' }}>
                              {wallet.recentTrades.map((trade, i) => (
                                <div key={i} style={{ marginBottom: '4px' }}>
                                  <span style={{ color: '#00ff88' }}>${trade.token}</span>: 
                                  <span> +{formatCurrency(trade.profit)} </span>
                                  <span style={{ color: '#888' }}>({trade.timeframe})</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div style={{ background: '#111', padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', color: '#00ff88', marginBottom: '20px' }}>📈 Market Overview</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <div style={{ textAlign: 'center', padding: '20px', background: '#1a1a1a', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>Total Tokens Tracked</div>
                  <div style={{ fontSize: '32px', color: '#00ff88' }}>{trendingTokens.length}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', background: '#1a1a1a', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>Total Wallets Tracked</div>
                  <div style={{ fontSize: '32px', color: '#00ff88' }}>{topWallets.length}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', background: '#1a1a1a', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>Total Profit Tracked</div>
                  <div style={{ fontSize: '32px', color: '#00ff88' }}>
                    {formatCurrency(topWallets.reduce((sum, wallet) => sum + wallet.totalProfit, 0))}
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', background: '#1a1a1a', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>Avg ROI</div>
                  <div style={{ fontSize: '32px', color: '#00ff88' }}>
                    {topWallets.length > 0 
                      ? `+${(topWallets.reduce((sum, wallet) => sum + wallet.totalROI, 0) / topWallets.length).toFixed(2)}%`
                      : '0%'
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div style={{ background: '#111', padding: '30px', borderRadius: '12px' }}>
              <h2 style={{ fontSize: '24px', color: '#00ff88', marginBottom: '20px' }}>🚀 How to Use This Dashboard</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div style={{ padding: '20px', background: '#1a1a1a', borderRadius: '8px' }}>
                  <h3 style={{ color: '#00ff88', marginBottom: '10px' }}>1. Monitor Trending Tokens</h3>
                  <p style={{ color: '#888', fontSize: '14px' }}>
                    Watch tokens with high volume and positive price action. Green = bullish, Red = bearish.
                  </p>
                </div>
                <div style={{ padding: '20px', background: '#1a1a1a', borderRadius: '8px' }}>
                  <h3 style={{ color: '#00ff88', marginBottom: '10px' }}>2. Follow Smart Wallets</h3>
                  <p style={{ color: '#888', fontSize: '14px' }}>
                    Track wallets with consistent profits. Their moves often signal upcoming trends.
                  </p>
                </div>
                <div style={{ padding: '20px', background: '#1a1a1a', borderRadius: '8px' }}>
                  <h3 style={{ color: '#00ff88', marginBottom: '10px' }}>3. Set Alerts</h3>
                  <p style={{ color: '#888', fontSize: '14px' }}>
                    Data refreshes every 2 minutes. Bookmark this page for real-time updates.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <a href="/" style={{ 
            padding: '10px 20px', 
            background: '#00ff88', 
            color: '#000', 
            textDecoration: 'none', 
            borderRadius: '8px',
            marginRight: '10px'
          }}>
            ← Back to Home
          </a>
          <button
            onClick={fetchData}
            style={{
              padding: '10px 20px',
              background: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Manual Refresh
          </button>
        </div>

        <div style={{ marginTop: '40px', padding: '20px', background: '#111', borderRadius: '8px', fontSize: '12px', color: '#888' }}>
          <p><strong>Data Sources:</strong> DexScreener API (real-time token data) • Cielo API (wallet transaction data)</p>
          <p><strong>Note:</strong> This is a demo dashboard. Real API integration requires valid API keys.</p>
          <p><strong>Auto-refresh:</strong> Every 2 minutes • Last manual refresh: {lastUpdated || 'Never'}</p>
        </div>
      </div>
    </>
  );
}