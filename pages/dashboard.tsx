import Layout from '../components/Layout'

export default function Dashboard() {
  const lastUpdated = '10:47:44'

  const trendingTokens = [
    { symbol: 'BONK', name: 'Bonk', price: 0.00001234, change: 45.2, volume: 2400000, chain: 'SOL' },
    { symbol: 'WIF', name: 'Dogwifhat', price: 0.2345, change: 23.8, volume: 1800000, chain: 'SOL' },
    { symbol: 'PEPE', name: 'Pepe', price: 0.00000876, change: -12.3, volume: 3200000, chain: 'ETH' },
  ]

  const wallets = [
    { id: '#17', label: 'Solana OG', profit: 894000, roi: 10075 },
    { id: '#42', label: 'AI Agent Trader', profit: 231500, roi: 4520 },
    { id: '#55', label: 'Meme Coin Hunter', profit: 123400, roi: 5670 },
    { id: '#29', label: 'Cross-Chain Specialist', profit: 67200, roi: 3692 },
    { id: '#13', label: 'DeFi Yield Farmer', profit: 56700, roi: 2890 },
  ]

  return (
    <Layout title="Dashboard | iseeiape">
      <>
        <style>{`
          .dashboard-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            color: #fff;
            min-height: 100vh;
          }
          .dashboard-header {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 30px;
          }
          .dashboard-title {
            font-size: clamp(24px, 5vw, 36px);
            color: #00ff88;
            margin-bottom: 8px;
          }
          .refresh-btn {
            padding: 12px 24px;
            background: #00ff88;
            color: #000;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            align-self: flex-start;
          }
          .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          @media (min-width: 768px) {
            .dashboard-header {
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            }
            .dashboard-grid {
              grid-template-columns: 1fr 1fr;
            }
          }
          .dashboard-card {
            background: #111;
            padding: 20px;
            border-radius: 12px;
            overflow: hidden;
          }
          .card-title {
            font-size: 20px;
            color: #00ff88;
            margin-bottom: 15px;
          }
          .table-container {
            overflow-x: auto;
            margin: -10px;
            padding: 10px;
          }
          .data-table {
            width: 100%;
            min-width: 400px;
            border-collapse: collapse;
            font-size: 14px;
          }
          .data-table th {
            text-align: left;
            padding: 10px;
            color: #888;
            font-weight: normal;
            border-bottom: 1px solid #333;
          }
          .data-table td {
            padding: 10px;
            border-bottom: 1px solid #222;
          }
          .token-symbol {
            font-weight: bold;
          }
          .token-name {
            font-size: 12px;
            color: #888;
          }
          .positive {
            color: #00ff88;
          }
          .negative {
            color: #ff4444;
          }
          .wallet-label {
            font-size: 12px;
            color: #888;
          }
          .overview-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          @media (min-width: 640px) {
            .overview-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }
          .stat-card {
            text-align: center;
            padding: 20px;
            background: #1a1a1a;
            border-radius: 8px;
          }
          .stat-label {
            font-size: 12px;
            color: #888;
            margin-bottom: 8px;
          }
          .stat-value {
            font-size: 24px;
            color: #00ff88;
          }
        `}</style>

        <div className="dashboard-container">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">📊 Real-time Dashboard</h1>
              <p style={{ color: '#888', fontSize: '14px' }}>
                Live smart money intelligence for Solana & Base
                <span style={{ display: 'block', marginTop: '4px' }}>
                  Last updated: {lastUpdated}
                </span>
              </p>
            </div>
            
            <button className="refresh-btn">
              🔄 Refresh
            </button>
          </div>

          {/* Main Grid */}
          <div className="dashboard-grid">
            {/* Trending Tokens */}
            <div className="dashboard-card">
              <h2 className="card-title">🔥 Trending Tokens</h2>
              
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Token</th>
                      <th>Price</th>
                      <th>24h</th>
                      <th>Vol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendingTokens.map((token, i) => (
                      <tr key={i}>
                        <td>
                          <div className="token-symbol">{token.symbol}</div>
                          <div className="token-name">{token.name}</div>
                        </td>
                        <td>${token.price.toFixed(6)}</td>
                        <td className={token.change >= 0 ? 'positive' : 'negative'}>
                          {token.change >= 0 ? '+' : ''}{token.change}%
                        </td>
                        <td>${(token.volume / 1000000).toFixed(1)}M</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Wallets */}
            <div className="dashboard-card">
              <h2 className="card-title">🐋 Top Performing Wallets</h2>
              
              <div className="table-container">
                <table className="data-table">
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
                          <div style={{ fontWeight: 'bold' }}>Whale {wallet.id}</div>
                          <div className="wallet-label">{wallet.label}</div>
                        </td>
                        <td className="positive">
                          ${(wallet.profit / 1000).toFixed(1)}K
                        </td>
                        <td className="positive">
                          +{wallet.roi}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Market Overview */}
          <div className="dashboard-card">
            <h2 className="card-title">📈 Market Overview</h2>
            
            <div className="overview-grid">
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
                <div className="stat-value" style={{ fontSize: '20px' }}>$1.37M</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Avg ROI</div>
                <div className="stat-value" style={{ fontSize: '20px' }}>+5369%</div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Layout>
  )
}
