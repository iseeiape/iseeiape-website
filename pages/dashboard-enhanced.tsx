import Layout from '../components/Layout'
import { useState, useEffect } from 'react'

export default function DashboardEnhanced() {
  const [marketData, setMarketData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState('Loading...')
  const [activeTab, setActiveTab] = useState('all') // 'all', 'wolf', 'enhanced'

  useEffect(() => {
    fetchMarketData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchMarketData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchMarketData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/unified-market-data')
      const data = await response.json()
      
      if (data.success) {
        setMarketData(data.data)
        setLastUpdated(new Date().toLocaleTimeString())
      } else {
        console.error('API error:', data.error)
      }
    } catch (err) {
      console.error('Error fetching market data:', err)
      // Fallback to individual APIs
      fetchFallbackData()
    } finally {
      setLoading(false)
    }
  }

  const fetchFallbackData = async () => {
    try {
      const [wolfResponse, enhancedResponse] = await Promise.all([
        fetch('/api/market-data'),
        fetch('/api/enhanced-market-data')
      ])
      
      const wolfData = await wolfResponse.json()
      const enhancedData = await enhancedResponse.json()
      
      // Combine manually
      setMarketData({
        tokens: [...(wolfData.topTokens || []), ...(enhancedData.topTokens || [])],
        narratives: [...(wolfData.narratives || []), ...(enhancedData.narratives || [])],
        whaleActivity: enhancedData.whaleActivity || [],
        marketOverview: {
          totalTokensTracked: (wolfData.topTokens?.length || 0) + (enhancedData.topTokens?.length || 0),
          lastUpdated: new Date().toISOString()
        }
      })
      setLastUpdated(new Date().toLocaleTimeString() + ' (fallback)')
    } catch (err) {
      console.error('Fallback also failed:', err)
    }
  }

  const formatNumber = (num: number) => {
    if (!num && num !== 0) return 'N/A'
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`
    return `$${num.toFixed(6)}`
  }

  const formatPercentage = (num: number) => {
    if (!num && num !== 0) return 'N/A'
    return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`
  }

  const getFilteredTokens = () => {
    if (!marketData?.tokens) return []
    
    switch (activeTab) {
      case 'wolf':
        return marketData.tokens.filter((t: any) => t.source === 'wolf-alerts')
      case 'enhanced':
        return marketData.tokens.filter((t: any) => t.source === 'enhanced-data')
      default:
        return marketData.tokens
    }
  }

  const tokens = getFilteredTokens()
  const narratives = marketData?.narratives || []
  const whaleActivity = marketData?.whaleActivity || []
  const marketOverview = marketData?.marketOverview || {}

  return (
    <Layout title="Enhanced Dashboard | iseeiape">
      <div className="container">
        {/* Header */}
        <div className="section" style={{ paddingBottom: 0 }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="heading-2 mb-2">🦎 Matrix Army Dashboard</h1>
              <p style={{ color: 'var(--text-muted)' }}>
                Unified market intelligence • Wolf Alerts + Enhanced Data • Updated {lastUpdated}
                {marketOverview.dataSources && (
                  <span> • Sources: {marketOverview.dataSources.join(', ')}</span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="chip" style={{ background: 'var(--accent-dark)' }}>
                <span className="chip-icon">📊</span>
                {marketOverview.totalTokensTracked || 0} tokens
              </div>
              <div className="chip" style={{ background: 'var(--success-dark)' }}>
                <span className="chip-icon">📈</span>
                {marketOverview.bullishTokens || 0} bullish
              </div>
              <div className="chip" style={{ background: 'var(--danger-dark)' }}>
                <span className="chip-icon">📉</span>
                {marketOverview.bearishTokens || 0} bearish
              </div>
            </div>
          </div>
        </div>

        {/* Data Source Tabs */}
        <div className="section" style={{ paddingTop: '10px', paddingBottom: '20px' }}>
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              🌐 All Tokens ({marketData?.tokens?.length || 0})
            </button>
            <button 
              className={`tab ${activeTab === 'wolf' ? 'active' : ''}`}
              onClick={() => setActiveTab('wolf')}
            >
              🐺 Wolf Alerts ({marketData?.tokens?.filter((t: any) => t.source === 'wolf-alerts').length || 0})
            </button>
            <button 
              className={`tab ${activeTab === 'enhanced' ? 'active' : ''}`}
              onClick={() => setActiveTab('enhanced')}
            >
              🔮 Enhanced Data ({marketData?.tokens?.filter((t: any) => t.source === 'enhanced-data').length || 0})
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="section">
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading unified market data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && !marketData && (
          <div className="section">
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <div>
                <h3>Failed to load market data</h3>
                <p>Check your connection and try again. Using fallback data sources.</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && marketData && (
          <>
            {/* Top Tokens Grid */}
            <div className="section">
              <h2 className="heading-3 mb-4">
                {activeTab === 'all' ? '🔥 Top Market Movers' : 
                 activeTab === 'wolf' ? '🐺 Wolf High Conviction' : 
                 '🔮 Enhanced Market Leaders'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tokens.slice(0, 6).map((token: any, index: number) => (
                  <div key={`${token.symbol}-${index}`} className="card">
                    <div className="card-header">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="card-title">{token.symbol}</h3>
                          <p className="card-subtitle">{token.name}</p>
                        </div>
                        <div className={`badge ${token.source === 'wolf-alerts' ? 'badge-wolf' : 'badge-enhanced'}`}>
                          {token.source === 'wolf-alerts' ? '🐺' : '🔮'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <div className="metric-grid">
                        <div className="metric">
                          <span className="metric-label">Price</span>
                          <span className="metric-value">{formatNumber(token.price)}</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">24h Change</span>
                          <span className={`metric-value ${token.priceChange24h > 0 ? 'positive' : token.priceChange24h < 0 ? 'negative' : ''}`}>
                            {formatPercentage(token.priceChange24h)}
                          </span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Volume</span>
                          <span className="metric-value">{formatNumber(token.volume24h)}</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Score</span>
                          <span className="metric-value">{token.score || 'N/A'}</span>
                        </div>
                      </div>
                      
                      {token.signals && token.signals.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-muted mb-1">Signals:</p>
                          <div className="flex flex-wrap gap-1">
                            {token.signals.slice(0, 3).map((signal: string, i: number) => (
                              <span key={i} className="tag">
                                {signal}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-between items-center">
                        <a 
                          href={token.pairUrl || `https://dexscreener.com/solana/${token.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline"
                        >
                          View on DexScreener
                        </a>
                        <span className="text-xs text-muted">
                          {token.dex || 'Unknown DEX'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {tokens.length > 6 && (
                <div className="mt-4 text-center">
                  <button className="btn btn-outline">
                    View All {tokens.length} Tokens →
                  </button>
                </div>
              )}
            </div>

            {/* Narratives & Whale Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Narratives */}
              <div className="section">
                <h2 className="heading-3 mb-4">📈 Market Narratives</h2>
                <div className="space-y-3">
                  {narratives.slice(0, 5).map((narrative: any, index: number) => (
                    <div key={index} className="narrative-card">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{narrative.name}</h4>
                          <p className="text-sm text-muted mt-1">{narrative.description}</p>
                          {narrative.tokens && narrative.tokens.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {narrative.tokens.slice(0, 3).map((token: string, i: number) => (
                                <span key={i} className="tag tag-sm">
                                  {token}
                                </span>
                              ))}
                              {narrative.tokens.length > 3 && (
                                <span className="tag tag-sm">
                                  +{narrative.tokens.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className={`score-badge ${narrative.score >= 80 ? 'score-high' : narrative.score >= 60 ? 'score-medium' : 'score-low'}`}>
                          {narrative.score}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted">
                        Source: {narrative.source || 'unknown'} • {narrative.type || 'general'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Whale Activity */}
              <div className="section">
                <h2 className="heading-3 mb-4">🐋 Recent Whale Activity</h2>
                <div className="space-y-3">
                  {whaleActivity.slice(0, 5).map((activity: any, index: number) => (
                    <div key={index} className="whale-activity">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`whale-icon ${activity.type === 'buy' ? 'buy' : activity.type === 'sell' ? 'sell' : 'neutral'}`}>
                            {activity.type === 'buy' ? '📈' : activity.type === 'sell' ? '📉' : '📊'}
                          </span>
                          <div>
                            <h4 className="font-medium">{activity.token}</h4>
                            <p className="text-sm text-muted">
                              {activity.type} • {activity.amount} • {activity.value}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-muted">
                          {activity.timestamp ? new Date(activity.timestamp).toLocaleTimeString() : 'Recently'}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted">
                        Wallet: {activity.wallet?.slice(0, 8)}... • Source: {activity.source || 'unknown'}
                      </div>
                    </div>
                  ))}
                  
                  {whaleActivity.length === 0 && (
                    <div className="text-center py-8 text-muted">
                      <p>No recent whale activity detected</p>
                      <p className="text-sm mt-1">Check back later for large wallet movements</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Market Overview Stats */}
            <div className="section">
              <h2 className="heading-3 mb-4">📊 Market Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="stat-card">
                  <div className="stat-icon">🪙</div>
                  <div className="stat-value">{marketOverview.totalTokensTracked || 0}</div>
                  <div className="stat-label">Tokens Tracked</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-value">{formatNumber(marketOverview.totalVolume24h || 0)}</div>
                  <div className="stat-label">24h Volume</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-value">{marketOverview.averageScore ? marketOverview.averageScore.toFixed(1) : 'N/A'}</div>
                  <div className="stat-label">Avg. Score</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🔄</div>
                  <div className="stat-value">
                    {marketOverview.lastUpdated ? new Date(marketOverview.lastUpdated).toLocaleTimeString() : 'N/A'}
                  </div>
                  <div className="stat-label">Last Updated</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          color: #fff;
        }
        
        .section {
          background: #111;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid #222;
        }
        
        .heading-2 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .heading-3 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .chip-icon {
          font-size: 16px;
        }
        
        .tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #222;
          padding-bottom: 8px;
        }
        
        .tab {
          padding: 8px 16px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .tab:hover {
          background: #222;
          color: #fff;
        }
        
        .tab.active {
          background: #00ff88;
          color: #000;
        }
        
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #333;
          border-top-color: #00ff88;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .alert {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border-radius: 12px;
          background: #331111;
          border: 1px solid #ff4444;
        }
        
        .alert-error {
          background: #331111;
          border-color: #ff4444;
        }
        
        .alert-icon {
          font-size: 20px;
        }
        
        .grid {
          display: grid;
        }
        
        .grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
        .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
        .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
        
        @media (min-width: 768px) {
          .md\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
          .md\\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
        }
        
        @media (min-width: 1024px) {
          .lg\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
          .lg\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
        }
        
        .gap-1 { gap: 4px; }
        .gap-2 { gap: 8px; }
        .gap-3 { gap: 12px; }
        .gap-4 { gap: 16px; }
        .gap-6 { gap: 24px; }
        
        .card {
          background: #1a1a1a;
          border-radius: 12px;
          border: 1px solid #222;
          overflow: hidden;
          transition: transform 0.2s, border-color 0.2s;
        }
        
        .card:hover {
          transform: translateY(-2px);
          border-color: #00ff88;
        }
        
        .card-header {
          padding: 16px;
          border-bottom: 1px solid #222;
        }
        
        .card-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 2px;
        }
        
        .card-subtitle {
          font-size: 14px;
          color: #888;
        }
        
        .card-body {
          padding: 16px;
        }
        
        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 16px;
        }
        
        .badge-wolf {
          background: #ff6b00;
          color: white;
        }
        
        .badge-enhanced {
          background: #00a8ff;
          color: white;
        }
        
        .metric-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        
        .metric {
          display: flex;
          flex-direction: column;
        }
        
        .metric-label {
          font-size: 12px;
          color: #888;
          margin-bottom: 2px;
        }
        
        .metric-value {
          font-size: 16px;
          font-weight: 600;
        }
        
        .metric-value.positive {
          color: #00ff88;
        }
        
        .metric-value.negative {
          color: #ff4444;
        }
        
        .tag {
          display: inline-block;
          padding: 4px 8px;
          background: #222;
          border-radius: 6px;
          font-size: 12px;
          color: #ccc;
        }
        
        .tag-sm {
          padding: 2px 6px;
          font-size: 11px;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          background: #00ff88;
          color: #000;
          text-decoration: none;
        }
        
        .btn:hover {
          background: #00cc6d;
        }
        
        .btn-sm {
          padding: 6px 12px;
          font-size: 14px;
        }
        
        .btn-outline {
          background: transparent;
          border: 1px solid #00ff88;
          color: #00ff88;
        }
        
        .btn-outline:hover {
          background: #00ff88;
          color: #000;
        }
        
        .mt-1 { margin-top: 4px; }
        .mt-2 { margin-top: 8px; }
        .mt-3 { margin-top: 12px; }
        .mt-4 { margin-top: 16px; }
        
        .mb-1 { margin-bottom: 4px; }
        .mb-2 { margin-bottom: 8px; }
        .mb-4 { margin-bottom: 16px; }
        
        .text-sm { font-size: 14px; }
        .text-xs { font-size: 12px; }
        
        .text-muted { color: #888; }
        
        .text-center { text-align: center; }
        
        .space-y-3 > * + * {
          margin-top: 12px;
        }
        
        .narrative-card {
          padding: 16px;
          background: #1a1a1a;
          border-radius: 12px;
          border: 1px solid #222;
        }
        
        .score-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-weight: 600;
          font-size: 16px;
        }
        
        .score-high {
          background: #00ff88;
          color: #000;
        }
        
        .score-medium {
          background: #ffaa00;
          color: #000;
        }
        
        .score-low {
          background: #ff4444;
          color: white;
        }
        
        .whale-activity {
          padding: 16px;
          background: #1a1a1a;
          border-radius: 12px;
          border: 1px solid #222;
        }
        
        .whale-icon {
          font-size: 20px;
        }
        
        .whale-icon.buy {
          color: #00ff88;
        }
        
        .whale-icon.sell {
          color: #ff4444;
        }
        
        .whale-icon.neutral {
          color: #888;
        }
        
        .stat-card {
          padding: 20px;
          background: #1a1a1a;
          border-radius: 12px;
          border: 1px solid #222;
          text-align: center;
        }
        
        .stat-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #888;
        }
        
        .flex {
          display: flex;
        }
        
        .flex-col {
          flex-direction: column;
        }
        
        .items-start {
          align-items: flex-start;
        }
        
        .items-center {
          align-items: center;
        }
        
        .justify-between {
          justify-content: space-between;
        }
        
        .justify-center {
          justify-content: center;
        }
        
        .gap-2 {
          gap: 8px;
        }
        
        .gap-4 {
          gap: 16px;
        }
        
        .font-medium {
          font-weight: 500;
        }
        
        .font-bold {
          font-weight: 700;
        }
        
        .py-8 {
          padding-top: 32px;
          padding-bottom: 32px;
        }
        
        .flex-wrap {
          flex-wrap: wrap;
        }