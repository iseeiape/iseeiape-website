import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

interface WolfAlert {
  symbol: string
  name: string
  score: number
  alert_type: string
  price: number
  price_change_5m: number
  price_change_1h: number
  price_change_24h: number
  volume_24h: number
  liquidity: number
  market_cap: number
  pair_url: string
  token_address: string
  chain: string
  signals: string[]
  timestamp: string
}

function formatNumber(n: number): string {
  if (!n && n !== 0) return 'N/A'
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  if (n >= 1) return `$${n.toFixed(2)}`
  if (n >= 0.01) return `$${n.toFixed(4)}`
  return `$${n.toFixed(8)}`
}

function formatPct(n: number): string {
  if (!n && n !== 0) return 'N/A'
  return `${n > 0 ? '+' : ''}${n.toFixed(2)}%`
}

function pctColor(n: number): string {
  if (n > 0) return '#00ff88'
  if (n < 0) return '#ff4444'
  return '#888'
}

function scoreColor(score: number): string {
  if (score >= 80) return '#00ff88'
  if (score >= 60) return '#ffcc00'
  return '#888'
}

function chainBadgeStyle(chain: string) {
  const c = chain?.toLowerCase() || ''
  if (c.includes('sol')) return { background: '#9945ff22', color: '#9945ff', border: '1px solid #9945ff44' }
  if (c.includes('base')) return { background: '#0052ff22', color: '#6699ff', border: '1px solid #0052ff44' }
  return { background: '#33333344', color: '#aaa', border: '1px solid #444' }
}

function chainLabel(chain: string): string {
  const c = chain?.toLowerCase() || ''
  if (c.includes('sol')) return 'SOLANA'
  if (c.includes('base')) return 'BASE'
  return chain?.toUpperCase() || 'UNKNOWN'
}

export default function WolfAlerts() {
  const [alerts, setAlerts] = useState<WolfAlert[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [totalScanned, setTotalScanned] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [fetchedAt, setFetchedAt] = useState<string>('')

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/wolf-alerts')
      const data = await res.json()
      setAlerts(data.alerts || [])
      setLastUpdated(data.lastUpdated || '')
      setTotalScanned(data.totalScanned || 0)
      setFetchedAt(new Date().toLocaleTimeString())
    } catch (err) {
      console.error('Failed to fetch wolf alerts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Layout title="Wolf Alerts — Live Crypto Signals | iseeiape">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#fff', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '42px', marginBottom: '8px' }}>🐺 Wolf Alerts</h1>
          <p style={{ color: '#888', marginBottom: '16px' }}>Live crypto signals from the wolf pack scanner. Auto-refreshes every 2 minutes.</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <div style={{ padding: '8px 16px', background: '#111', borderRadius: '8px', border: '1px solid #333', fontSize: '13px', color: '#aaa' }}>
              <span style={{ color: '#00ff88' }}>●</span>{' '}
              {fetchedAt ? `Fetched at ${fetchedAt}` : 'Loading...'}
            </div>
            {totalScanned > 0 && (
              <div style={{ padding: '8px 16px', background: '#111', borderRadius: '8px', border: '1px solid #333', fontSize: '13px', color: '#aaa' }}>
                🔍 {totalScanned.toLocaleString()} tokens scanned
              </div>
            )}
            {lastUpdated && (
              <div style={{ padding: '8px 16px', background: '#111', borderRadius: '8px', border: '1px solid #333', fontSize: '13px', color: '#aaa' }}>
                🕐 Data from {new Date(lastUpdated).toLocaleTimeString()}
              </div>
            )}
            <button
              onClick={fetchAlerts}
              disabled={loading}
              style={{
                padding: '8px 16px',
                background: '#00ff8822',
                border: '1px solid #00ff8844',
                borderRadius: '8px',
                color: '#00ff88',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? '⟳ Refreshing...' : '⟳ Refresh'}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && alerts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐺</div>
            <p style={{ fontSize: '18px' }}>Sniffing for signals...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && alerts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: '#111',
            borderRadius: '16px',
            border: '1px solid #222',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐺</div>
            <h2 style={{ color: '#888', marginBottom: '8px' }}>Waiting for next scan...</h2>
            <p style={{ color: '#555' }}>The wolf pack scanner runs every 15 minutes. Check back soon.</p>
          </div>
        )}

        {/* Alerts grid */}
        {alerts.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {alerts.map((alert, i) => (
              <div key={i} style={{
                background: '#111',
                borderRadius: '16px',
                border: `1px solid ${alert.score >= 80 ? '#00ff8844' : alert.score >= 60 ? '#ffcc0033' : '#222'}`,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                {/* Token name + badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '0.5px' }}>
                      ${alert.symbol}
                    </div>
                    <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>{alert.name}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                    <span style={{
                      padding: '4px 10px',
                      background: `${scoreColor(alert.score)}22`,
                      color: scoreColor(alert.score),
                      border: `1px solid ${scoreColor(alert.score)}44`,
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                    }}>
                      {alert.score}/100
                    </span>
                    <span style={{
                      padding: '3px 8px',
                      background: '#1a1a1a',
                      color: '#ccc',
                      borderRadius: '12px',
                      fontSize: '11px',
                      border: '1px solid #333',
                    }}>
                      {alert.alert_type}
                    </span>
                  </div>
                </div>

                {/* Price + changes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  <div style={{ background: '#1a1a1a', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#555', marginBottom: '3px' }}>PRICE</div>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>{formatNumber(alert.price)}</div>
                  </div>
                  <div style={{ background: '#1a1a1a', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#555', marginBottom: '3px' }}>5M</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: pctColor(alert.price_change_5m) }}>{formatPct(alert.price_change_5m)}</div>
                  </div>
                  <div style={{ background: '#1a1a1a', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#555', marginBottom: '3px' }}>1H</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: pctColor(alert.price_change_1h) }}>{formatPct(alert.price_change_1h)}</div>
                  </div>
                  <div style={{ background: '#1a1a1a', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#555', marginBottom: '3px' }}>24H</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: pctColor(alert.price_change_24h) }}>{formatPct(alert.price_change_24h)}</div>
                  </div>
                </div>

                {/* Volume / Liquidity / MCap */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#555', marginBottom: '2px' }}>VOLUME 24H</div>
                    <div style={{ fontSize: '13px', color: '#ccc' }}>{formatNumber(alert.volume_24h)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#555', marginBottom: '2px' }}>LIQUIDITY</div>
                    <div style={{ fontSize: '13px', color: '#ccc' }}>{formatNumber(alert.liquidity)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#555', marginBottom: '2px' }}>MARKET CAP</div>
                    <div style={{ fontSize: '13px', color: '#ccc' }}>{formatNumber(alert.market_cap)}</div>
                  </div>
                </div>

                {/* Signals */}
                {alert.signals && alert.signals.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {alert.signals.slice(0, 5).map((sig, j) => (
                      <span key={j} style={{
                        padding: '3px 8px',
                        background: '#00ff8811',
                        color: '#00ff88',
                        borderRadius: '10px',
                        fontSize: '11px',
                        border: '1px solid #00ff8822',
                      }}>
                        {sig}
                      </span>
                    ))}
                  </div>
                )}

                {/* Chain badge + action buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: '600',
                    ...chainBadgeStyle(alert.chain),
                  }}>
                    {chainLabel(alert.chain)}
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={`https://dexscreener.com/${alert.chain?.toLowerCase().includes('base') ? 'base' : 'solana'}/${alert.token_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 12px',
                        background: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: '#aaa',
                        textDecoration: 'none',
                        fontSize: '12px',
                      }}
                    >
                      📊 DexScreener
                    </a>
                    <a
                      href={`https://app.cielo.finance/trading/${alert.token_address}?ref=iseeiape`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 12px',
                        background: '#00ff8822',
                        border: '1px solid #00ff8844',
                        borderRadius: '8px',
                        color: '#00ff88',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      ⚡ Trade on Cielo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
