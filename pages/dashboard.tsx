import Layout from '../components/Layout'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [wolfData, setWolfData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState('Loading...')

  useEffect(() => {
    fetchWolfData()
    // Refresh every 60 seconds
    const interval = setInterval(fetchWolfData, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchWolfData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/market-data')
      const data = await response.json()
      setWolfData(data)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      console.error('Error fetching Wolf data:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`
    return `$${num.toFixed(6)}`
  }

  const topTokens = wolfData?.topTokens || []
  const narratives = wolfData?.narratives || []

  return (
    <Layout title="Dashboard | iseeiape">
      <div className="container">
        {/* Header */}
        <div className="section" style={{ paddingBottom: 0 }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="heading-2 mb-2">🐺 Wolf Alerts Dashboard</h1>
              <p style={{ color: 'var(--text-muted)' }}>
                Real-time high-confidence signals • Updated {lastUpdated}
                {wolfData?.source && <span> • {wolfData.source}</span>}
              </p>
            </div>
            
            <button 
              className="btn btn-primary" 
              onClick={fetchWolfData}
              disabled={loading}
            >
              {loading ? '⏳ Loading...' : '🔄 Refresh'}
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="section" style={{ paddingTop: 'var(--space-6)' }}>
          <div className="grid grid-2">
            {/* Wolf Alerts - Top Tokens */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-4 text-gradient">🔥 Wolf Alerts (Top 5)</h2>
                <span className="tag tag-success">Score 50+</span>
              </div>
              
              {loading ? (
                <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>Loading alerts...</div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Token</th>
                        <th>Price</th>
                        <th>24h</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topTokens.slice(0, 5).map((token: any, i: number) => (
                        <tr key={i}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{token.symbol}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                              Score: {token.score}/100
                            </div>
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{formatNumber(token.price)}</td>
                          <td>
                            <span className={token.priceChange24h >= 0 ? 'positive' : 'negative'}>
                              {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(1)}%
                            </span>
                          </td>
                          <td>
                            <span 
                              className="tag"
                              style={{ 
                                background: token.score >= 90 ? 'rgba(0, 255, 136, 0.2)' : 
                                          token.score >= 80 ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255, 107, 53, 0.2)',
                                color: token.score >= 90 ? '#00ff88' : 
                                       token.score >= 80 ? '#00d4ff' : '#ff6b35'
                              }}
                            >
                              {token.score}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Narratives */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-4 text-gradient">🧠 Active Narratives</h2>
                <span className="tag tag-info">Live</span>
              </div>
              
              {loading ? (
                <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>Loading...</div>
              ) : (
                <div className="space-y-4">
                  {narratives.slice(0, 3).map((narrative: any, i: number) => (
                    <div key={i} className="bg-gray-800 rounded-lg p-4">
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
                      <div className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        {narrative.tokens?.slice(0, 3).join(', ')} • {narrative.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="card">
            <h2 className="heading-4 text-gradient mb-6">📊 Wolf Statistics</h2>
            
            <div className="grid" style={{ 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div className="stat-card">
                <div className="stat-label">Alerts Found</div>
                <div className="stat-value">{wolfData?.stats?.totalTokens || 0}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Narratives</div>
                <div className="stat-value">{wolfData?.stats?.totalNarratives || 0}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Wallets Tracked</div>
                <div className="stat-value">11,661</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Sentiment</div>
                <div className="stat-value" style={{ 
                  color: wolfData?.marketSentiment === 'bullish' ? '#00ff88' : 
                         wolfData?.marketSentiment === 'bearish' ? '#ff4757' : '#ffd700'
                }}>
                  {wolfData?.marketSentiment?.toUpperCase() || 'NEUTRAL'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Last Scan Info */}
        {wolfData?.lastScan && (
          <div className="section" style={{ paddingTop: 0 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
              🐺 Last Wolf Scan: {new Date(wolfData.lastScan).toLocaleString()} • 
              Updates every 30 minutes
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}
