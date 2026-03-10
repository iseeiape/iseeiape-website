import Layout from '../components/Layout'
import { useState, useEffect } from 'react'

export default function DashboardEnhancedSimple() {
  const [marketData, setMarketData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState('Loading...')

  useEffect(() => {
    fetchMarketData()
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
      }
    } catch (err) {
      console.error('Error fetching market data:', err)
    } finally {
      setLoading(false)
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

  return (
    <Layout title="Enhanced Dashboard | iseeiape">
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', color: '#fff' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          🦎 Matrix Army Dashboard
        </h1>
        <p style={{ color: '#888', marginBottom: '24px' }}>
          Unified market intelligence • Updated {lastUpdated}
        </p>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #333',
              borderTopColor: '#00ff88',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p>Loading unified market data...</p>
          </div>
        )}

        {!loading && marketData && (
          <>
            {/* Top Tokens */}
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
              🔥 Top Market Movers
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px',
              marginBottom: '32px'
            }}>
              {marketData.tokens.slice(0, 6).map((token: any, index: number) => (
                <div key={index} style={{
                  background: '#1a1a1a',
                  borderRadius: '12px',
                  border: '1px solid #222',
                  padding: '16px',
                  transition: 'transform 0.2s, border-color 0.2s'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '2px' }}>
                        {token.symbol}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#888' }}>{token.name}</p>
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: token.source === 'wolf-alerts' ? '#ff6b00' : '#00a8ff',
                      color: 'white',
                      fontSize: '16px'
                    }}>
                      {token.source === 'wolf-alerts' ? '🐺' : '🔮'}
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '2px' }}>Price</div>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>{formatNumber(token.price)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '2px' }}>24h Change</div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: token.priceChange24h > 0 ? '#00ff88' : token.priceChange24h < 0 ? '#ff4444' : '#fff'
                      }}>
                        {formatPercentage(token.priceChange24h)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '2px' }}>Volume</div>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>{formatNumber(token.volume24h)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '2px' }}>Score</div>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>{token.score || 'N/A'}</div>
                    </div>
                  </div>
                  
                  {token.signals && token.signals.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <p style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>Signals:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {token.signals.slice(0, 3).map((signal: string, i: number) => (
                          <span key={i} style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            background: '#222',
                            borderRadius: '6px',
                            fontSize: '12px',
                            color: '#ccc'
                          }}>
                            {signal}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Market Overview */}
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
              📊 Market Overview
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '32px'
            }}>
              <div style={{
                padding: '20px',
                background: '#1a1a1a',
                borderRadius: '12px',
                border: '1px solid #222',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🪙</div>
                <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                  {marketData.marketOverview.totalTokensTracked || 0}
                </div>
                <div style={{ fontSize: '14px', color: '#888' }}>Tokens Tracked</div>
              </div>
              
              <div style={{
                padding: '20px',
                background: '#1a1a1a',
                borderRadius: '12px',
                border: '1px solid #222',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
                <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                  {formatNumber(marketData.marketOverview.totalVolume24h || 0)}
                </div>
                <div style={{ fontSize: '14px', color: '#888' }}>24h Volume</div>
              </div>
              
              <div style={{
                padding: '20px',
                background: '#1a1a1a',
                borderRadius: '12px',
                border: '1px solid #222',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📈</div>
                <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                  {marketData.marketOverview.averageScore ? marketData.marketOverview.averageScore.toFixed(1) : 'N/A'}
                </div>
                <div style={{ fontSize: '14px', color: '#888' }}>Avg. Score</div>
              </div>
              
              <div style={{
                padding: '20px',
                background: '#1a1a1a',
                borderRadius: '12px',
                border: '1px solid #222',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔄</div>
                <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                  {marketData.marketOverview.lastUpdated ? new Date(marketData.marketOverview.lastUpdated).toLocaleTimeString() : 'N/A'}
                </div>
                <div style={{ fontSize: '14px', color: '#888' }}>Last Updated</div>
              </div>
            </div>
          </>
        )}

        {!loading && !marketData && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '16px',
            borderRadius: '12px',
            background: '#331111',
            border: '1px solid #ff4444'
          }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '4px' }}>Failed to load market data</h3>
              <p style={{ color: '#ccc' }}>Check your connection and try again.</p>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  )
}