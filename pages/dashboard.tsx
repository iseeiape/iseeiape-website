import Layout from '../components/Layout'

export default function Dashboard() {
  const lastUpdated = '10:47:44'

  const trendingTokens = [
    { symbol: 'BONK', name: 'Bonk', price: 0.00001234, change: 45.2, volume: 2400000, chain: 'SOL' },
    { symbol: 'WIF', name: 'Dogwifhat', price: 0.2345, change: 23.8, volume: 1800000, chain: 'SOL' },
    { symbol: 'PEPE', name: 'Pepe', price: 0.00000876, change: -12.3, volume: 3200000, chain: 'ETH' },
  ]

  const wallets = [
    { id: '#17', label: 'Solana OG', profit: 894000, roi: 10075, chain: 'SOL' },
    { id: '#42', label: 'AI Agent Trader', profit: 231500, roi: 4520, chain: 'SOL' },
    { id: '#55', label: 'Meme Coin Hunter', profit: 123400, roi: 5670, chain: 'SOL' },
    { id: '#29', label: 'Cross-Chain Specialist', profit: 67200, roi: 3692, chain: 'BASE' },
    { id: '#13', label: 'DeFi Yield Farmer', profit: 56700, roi: 2890, chain: 'ETH' },
  ]

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
            </div>
            
            <button className="btn btn-primary">
              🔄 Refresh
            </button>
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
                      <th>Chain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendingTokens.map((token, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{token.symbol}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{token.name}</div>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>${token.price.toFixed(6)}</td>
                        <td>
                          <span className={token.change >= 0 ? 'positive' : 'negative'}>
                            {token.change >= 0 ? '+' : ''}{token.change}%
                          </span>
                        </td>
                        <td>
                          <span 
                            className="tag"
                            style={{ 
                              background: token.chain === 'SOL' ? 'rgba(20, 241, 149, 0.15)' : 
                                        token.chain === 'BASE' ? 'rgba(0, 82, 255, 0.15)' : 'rgba(0, 212, 255, 0.15)',
                              color: token.chain === 'SOL' ? '#14F195' : 
                                     token.chain === 'BASE' ? '#0052FF' : '#00d4ff'
                            }}
                          >
                            {token.chain}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Wallets */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-4 text-gradient">🐋 Top Wallets</h2>
                <span className="tag tag-info">Updated</span>
              </div>
              
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Wallet</th>
                      <th>Profit</th>
                      <th>ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wallets.map((wallet, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ fontWeight: 600 }}>Whale {wallet.id}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{wallet.label}</div>
                        </td>
                        <td className="positive" style={{ fontFamily: 'var(--font-mono)' }}>
                          ${(wallet.profit / 1000).toFixed(1)}K
                        </td>
                        <td>
                          <span className="tag tag-success">
                            +{wallet.roi}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Market Overview */}
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="card">
            <h2 className="heading-4 text-gradient mb-6">📈 Market Overview</h2>
            
            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="stat-card">
                <div className="stat-label">Tokens Tracked</div>
                <div className="stat-value">0</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Wallets Tracked</div>
                <div className="stat-value">5</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Total Profit</div>
                <div className="stat-value" style={{ fontSize: 'var(--text-2xl)' }}>$1.37M</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Avg ROI</div>
                <div className="stat-value" style={{ fontSize: 'var(--text-2xl)' }}>+5369%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
