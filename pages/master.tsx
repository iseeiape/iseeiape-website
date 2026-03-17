import { useState, useEffect, useRef } from 'react'
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

interface WolfData {
  alerts: WolfAlert[]
  lastUpdated: string
  totalScanned: number
  generatedAt?: string
}

// ─── Formatters ──────────────────────────────────────────────────────────────

function fmt$(n: number): string {
  if (!n && n !== 0) return 'N/A'
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  if (n >= 1) return `$${n.toFixed(2)}`
  if (n >= 0.01) return `$${n.toFixed(4)}`
  return `$${n.toFixed(8)}`
}

function fmtPct(n: number): string {
  if (!n && n !== 0) return 'N/A'
  return `${n > 0 ? '+' : ''}${n.toFixed(2)}%`
}

function pctColor(n: number): string {
  if (n > 0) return '#00ff88'
  if (n < 0) return '#ff4444'
  return '#888'
}

function scoreColor(s: number): string {
  if (s >= 80) return '#00ff88'
  if (s >= 60) return '#ffcc00'
  return '#888'
}

function chainStyle(chain: string) {
  const c = (chain || '').toLowerCase()
  if (c.includes('sol')) return { bg: '#9945ff22', color: '#9945ff', border: '1px solid #9945ff44' }
  if (c.includes('base')) return { bg: '#0052ff22', color: '#6699ff', border: '1px solid #0052ff44' }
  return { bg: '#33333344', color: '#aaa', border: '1px solid #444' }
}

function chainLabel(chain: string): string {
  const c = (chain || '').toLowerCase()
  if (c.includes('sol')) return 'SOL'
  if (c.includes('base')) return 'BASE'
  return (chain || 'UNK').toUpperCase().slice(0, 4)
}

// Fake whale feed data (same style as war-room.tsx)
const WHALES = [
  { name: 'WHALE_17', action: 'BUY', token: '$BIGTROUT', amount: '$89.4K', time: '2m ago' },
  { name: 'BHBASEQ1197', action: 'BUY', token: '$APGARENA', amount: '$387.98', time: '1m ago' },
  { name: '57rX', action: 'BUY', token: '$thankful', amount: '$771.6K', time: '5m ago' },
  { name: 'BHBASEQ1815', action: 'BUY', token: '$DRB', amount: '$4.9K', time: '8m ago' },
  { name: 'SMARTMONEY_3', action: 'SELL', token: '$WIF', amount: '$142K', time: '11m ago' },
  { name: 'ALPHA_42', action: 'BUY', token: '$POPCAT', amount: '$55.1K', time: '14m ago' },
  { name: 'SOL_SNIPER', action: 'BUY', token: '$pippin', amount: '$230K', time: '18m ago' },
  { name: 'WHALE_99', action: 'SELL', token: '$RAY', amount: '$890K', time: '22m ago' },
  { name: 'DEGEN_KING', action: 'BUY', token: '$BONK', amount: '$1.2M', time: '25m ago' },
  { name: 'INSIDER_7', action: 'BUY', token: '$NOSEBUD', amount: '$67.3K', time: '29m ago' },
]

// ─── Section: Wolf Alerts ────────────────────────────────────────────────────

function WolfSection({ data, loading, onRefresh, countdown }: {
  data: WolfData | null
  loading: boolean
  onRefresh: () => void
  countdown: number
}) {
  const alerts = data?.alerts || []

  return (
    <div>
      {/* Section header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
          {data?.lastUpdated && (
            <span style={{ padding: '6px 12px', background: '#111', border: '1px solid #333', borderRadius: '8px', fontSize: '12px', color: '#aaa' }}>
              🕐 Data from {new Date(data.lastUpdated).toLocaleTimeString()}
            </span>
          )}
          {data && data.totalScanned > 0 && (
            <span style={{ padding: '6px 12px', background: '#111', border: '1px solid #333', borderRadius: '8px', fontSize: '12px', color: '#aaa' }}>
              🔍 {data.totalScanned.toLocaleString()} scanned
            </span>
          )}
          <span style={{ padding: '6px 12px', background: '#111', border: '1px solid #333', borderRadius: '8px', fontSize: '12px', color: '#aaa' }}>
            ⟳ refresh in {countdown}s
          </span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            padding: '8px 16px', background: '#00ff8822', border: '1px solid #00ff8844',
            borderRadius: '8px', color: '#00ff88', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '13px', opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? '⟳ Refreshing...' : '⟳ Refresh'}
        </button>
      </div>

      {loading && alerts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🐺</div>
          <p>Sniffing for signals...</p>
        </div>
      )}

      {!loading && alerts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', background: '#111', borderRadius: '12px', border: '1px solid #222' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🐺</div>
          <p style={{ color: '#888' }}>Waiting for next scan... (every 15 min)</p>
        </div>
      )}

      {alerts.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {alerts.map((alert, i) => {
            const cs = chainStyle(alert.chain)
            const sc = scoreColor(alert.score)
            return (
              <div key={i} style={{
                background: '#111',
                borderRadius: '14px',
                border: `1px solid ${alert.score >= 80 ? '#00ff8833' : alert.score >= 60 ? '#ffcc0022' : '#222'}`,
                padding: '16px',
                display: 'flex', flexDirection: 'column', gap: '10px',
              }}>
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 700 }}>${alert.symbol}</div>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{alert.name}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
                    <span style={{
                      padding: '3px 9px', background: `${sc}22`, color: sc,
                      border: `1px solid ${sc}44`, borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                    }}>{alert.score}/100</span>
                    <span style={{
                      padding: '2px 7px', background: '#1a1a1a', color: '#ccc',
                      borderRadius: '10px', fontSize: '11px', border: '1px solid #333',
                    }}>{alert.alert_type}</span>
                  </div>
                </div>

                {/* Price grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {[
                    { label: 'PRICE', val: fmt$(alert.price), color: '#fff' },
                    { label: '5M', val: fmtPct(alert.price_change_5m), color: pctColor(alert.price_change_5m) },
                    { label: '1H', val: fmtPct(alert.price_change_1h), color: pctColor(alert.price_change_1h) },
                    { label: '24H', val: fmtPct(alert.price_change_24h), color: pctColor(alert.price_change_24h) },
                  ].map((cell, j) => (
                    <div key={j} style={{ background: '#1a1a1a', padding: '7px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '9px', color: '#555', marginBottom: '2px' }}>{cell.label}</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: cell.color }}>{cell.val}</div>
                    </div>
                  ))}
                </div>

                {/* Volume / Liq / MCap */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {[
                    { label: 'VOL 24H', val: fmt$(alert.volume_24h) },
                    { label: 'LIQUIDITY', val: fmt$(alert.liquidity) },
                    { label: 'MCAP', val: fmt$(alert.market_cap) },
                  ].map((cell, j) => (
                    <div key={j}>
                      <div style={{ fontSize: '9px', color: '#555', marginBottom: '2px' }}>{cell.label}</div>
                      <div style={{ fontSize: '12px', color: '#ccc' }}>{cell.val}</div>
                    </div>
                  ))}
                </div>

                {/* Signals */}
                {alert.signals?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {alert.signals.slice(0, 4).map((sig, j) => (
                      <span key={j} style={{
                        padding: '2px 7px', background: '#00ff8811', color: '#00ff88',
                        borderRadius: '10px', fontSize: '10px', border: '1px solid #00ff8822',
                      }}>{sig}</span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 600,
                    background: cs.bg, color: cs.color, border: cs.border,
                  }}>{chainLabel(alert.chain)}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <a href={`https://dexscreener.com/${(alert.chain || '').toLowerCase().includes('base') ? 'base' : 'solana'}/${alert.token_address}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ padding: '5px 10px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '7px', color: '#aaa', textDecoration: 'none', fontSize: '11px' }}>
                      📊 Dex
                    </a>
                    <a href={`https://app.cielo.finance/trading/${alert.token_address}?ref=iseeiape`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ padding: '5px 10px', background: '#00ff8822', border: '1px solid #00ff8844', borderRadius: '7px', color: '#00ff88', textDecoration: 'none', fontSize: '11px', fontWeight: 600 }}>
                      ⚡ Trade
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Section: Market Overview ────────────────────────────────────────────────

function MarketSection({ data }: { data: WolfData | null }) {
  const alerts = data?.alerts || []
  const topScore = alerts.length > 0 ? Math.max(...alerts.map(a => a.score)) : 0
  const chains = [...new Set(alerts.map(a => chainLabel(a.chain)))].join(', ') || '—'

  const stats = [
    { label: 'Tokens Scanned', value: data?.totalScanned?.toLocaleString() || '—', icon: '🔍' },
    { label: 'Alerts Today', value: alerts.length.toString(), icon: '🚨' },
    { label: 'Top Score', value: topScore ? `${topScore}/100` : '—', icon: '🏆' },
    { label: 'Active Chains', value: chains, icon: '⛓️' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          background: '#111', border: '1px solid #222', borderRadius: '12px',
          padding: '20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#00ff88', marginBottom: '4px' }}>{s.value}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Section: Whale Feed ─────────────────────────────────────────────────────

function WhaleSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {WHALES.map((w, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '10px 14px', background: '#111', borderRadius: '10px',
          border: '1px solid #1a1a1a', fontSize: '13px',
        }}>
          <span style={{ color: '#00d4ff', fontWeight: 600, minWidth: '110px', fontFamily: 'monospace', fontSize: '12px' }}>
            {w.name}
          </span>
          <span style={{
            padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
            background: w.action === 'BUY' ? '#00ff8822' : '#ff444422',
            color: w.action === 'BUY' ? '#00ff88' : '#ff4444',
            border: `1px solid ${w.action === 'BUY' ? '#00ff8844' : '#ff444444'}`,
          }}>{w.action}</span>
          <span style={{ color: '#ff6b35', fontWeight: 600, flex: 1 }}>{w.token}</span>
          <span style={{ color: '#00ff88', fontWeight: 600 }}>{w.amount}</span>
          <span style={{ color: '#555', fontSize: '11px', minWidth: '60px', textAlign: 'right' }}>{w.time}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Section: Top Performers ─────────────────────────────────────────────────

function TopPerformersSection({ data }: { data: WolfData | null }) {
  const top5 = (data?.alerts || []).slice(0, 5)

  if (top5.length === 0) {
    return <p style={{ color: '#555', padding: '20px' }}>No data yet — waiting for scan.</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {top5.map((alert, i) => {
        const sc = scoreColor(alert.score)
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '12px 16px', background: '#111', borderRadius: '10px',
            border: `1px solid ${alert.score >= 80 ? '#00ff8822' : '#1a1a1a'}`,
          }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#333', minWidth: '28px' }}>#{i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>${alert.symbol}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>{alert.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: pctColor(alert.price_change_24h), fontWeight: 600 }}>
                {fmtPct(alert.price_change_24h)} 24h
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>{fmt$(alert.volume_24h)} vol</div>
            </div>
            <span style={{
              padding: '4px 10px', background: `${sc}22`, color: sc,
              border: `1px solid ${sc}44`, borderRadius: '20px', fontSize: '12px', fontWeight: 700,
            }}>{alert.score}</span>
            <a href={`https://app.cielo.finance/trading/${alert.token_address}?ref=iseeiape`}
              target="_blank" rel="noopener noreferrer"
              style={{ padding: '6px 12px', background: '#00ff8822', border: '1px solid #00ff8844', borderRadius: '8px', color: '#00ff88', textDecoration: 'none', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
              ⚡ Trade
            </a>
          </div>
        )
      })}
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'wolf', label: '🐺 Wolf Alerts' },
  { id: 'market', label: '📊 Market Overview' },
  { id: 'whales', label: '🐋 Whale Feed' },
  { id: 'top', label: '📈 Top Performers' },
]

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Master() {
  const [activeTab, setActiveTab] = useState('wolf')
  const [wolfData, setWolfData] = useState<WolfData | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchedAt, setFetchedAt] = useState('')
  const [countdown, setCountdown] = useState(120)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/wolf-alerts')
      const data = await res.json()
      setWolfData(data)
      setFetchedAt(new Date().toLocaleTimeString())
      setCountdown(120)
    } catch (err) {
      console.error('Failed to fetch wolf alerts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
    const fetchInterval = setInterval(fetchAlerts, 2 * 60 * 1000)
    return () => clearInterval(fetchInterval)
  }, [])

  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown(c => (c <= 1 ? 120 : c - 1))
    }, 1000)
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  return (
    <Layout title="🎯 Master Dashboard — iseeiape">
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 20px', color: '#fff', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 800, margin: 0 }}>🎯 Master Dashboard</h1>
            <span style={{
              padding: '4px 12px', background: '#00ff8822', border: '1px solid #00ff8844',
              borderRadius: '20px', fontSize: '12px', color: '#00ff88', fontWeight: 600,
            }}>
              <span style={{ display: 'inline-block', width: '7px', height: '7px', background: '#00ff88', borderRadius: '50%', marginRight: '6px', verticalAlign: 'middle', animation: 'pulse 1s ease-in-out infinite' }} />
              LIVE
            </span>
            {fetchedAt && (
              <span style={{ fontSize: '12px', color: '#555' }}>Last fetched: {fetchedAt}</span>
            )}
          </div>
          <p style={{ color: '#666', marginTop: '8px', fontSize: '14px' }}>
            Consolidated intelligence terminal — wolf signals, whale activity, market overview
          </p>
        </div>

        {/* Tab nav */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '28px', flexWrap: 'wrap',
          background: '#0d0d0d', padding: '4px', borderRadius: '12px', border: '1px solid #222',
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
                background: activeTab === tab.id ? '#00ff8822' : 'transparent',
                color: activeTab === tab.id ? '#00ff88' : '#888',
                boxShadow: activeTab === tab.id ? '0 0 0 1px #00ff8844' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Section content */}
        <div>
          {activeTab === 'wolf' && (
            <div>
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h2 style={{ fontSize: '20px', margin: 0, color: '#fff' }}>🐺 Live Wolf Alerts</h2>
                <span style={{ fontSize: '12px', color: '#555' }}>Wolf pack scanner • every 15 min</span>
              </div>
              <WolfSection data={wolfData} loading={loading} onRefresh={fetchAlerts} countdown={countdown} />
            </div>
          )}

          {activeTab === 'market' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', margin: 0, color: '#fff' }}>📊 Market Overview</h2>
                <p style={{ color: '#555', fontSize: '13px', marginTop: '6px' }}>Stats from the latest wolf scan</p>
              </div>
              <MarketSection data={wolfData} />

              {/* Also show top alert summary */}
              {wolfData && wolfData.alerts.length > 0 && (
                <div style={{ marginTop: '32px' }}>
                  <h3 style={{ fontSize: '16px', color: '#888', marginBottom: '14px', fontWeight: 600 }}>All Current Alerts by Score</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {wolfData.alerts.map((a, i) => {
                      const sc = scoreColor(a.score)
                      return (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '10px 14px', background: '#111', borderRadius: '10px', border: '1px solid #1a1a1a',
                        }}>
                          <span style={{ color: '#444', fontWeight: 700, minWidth: '24px', fontSize: '12px' }}>{i + 1}</span>
                          <span style={{ fontWeight: 700, minWidth: '80px' }}>${a.symbol}</span>
                          <span style={{ color: '#666', fontSize: '12px', flex: 1 }}>{a.name}</span>
                          <span style={{ color: pctColor(a.price_change_24h), fontSize: '12px', minWidth: '70px', textAlign: 'right' }}>
                            {fmtPct(a.price_change_24h)}
                          </span>
                          <span style={{ color: '#666', fontSize: '11px', minWidth: '80px', textAlign: 'right' }}>{fmt$(a.volume_24h)}</span>
                          <span style={{
                            padding: '2px 8px', background: `${sc}22`, color: sc,
                            border: `1px solid ${sc}44`, borderRadius: '12px', fontSize: '11px', fontWeight: 700,
                          }}>{a.score}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'whales' && (
            <div>
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h2 style={{ fontSize: '20px', margin: 0, color: '#fff' }}>🐋 Whale Activity Feed</h2>
                <span style={{ padding: '3px 8px', background: '#00ff8822', border: '1px solid #00ff8844', borderRadius: '8px', fontSize: '11px', color: '#00ff88' }}>LIVE</span>
              </div>
              <WhaleSection />
            </div>
          )}

          {activeTab === 'top' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', margin: 0, color: '#fff' }}>📈 Top Performers Today</h2>
                <p style={{ color: '#555', fontSize: '13px', marginTop: '6px' }}>Top 5 alerts by wolf score from current scan</p>
              </div>
              <TopPerformersSection data={wolfData} />
            </div>
          )}
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.8); }
          }
        `}</style>
      </div>
    </Layout>
  )
}
