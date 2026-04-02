import Head from 'next/head'
import Link from 'next/link'
import path from 'path'
import fs from 'fs'

const GREEN = '#00ff88'
const BG = '#000'
const BORDER = '#1a1a1a'

export default function TokenPage({ token }) {
  if (!token) return <div style={{ background: '#000', color: '#fff', padding: 40, fontFamily: 'monospace' }}>Token not found.</div>

  const scoreColor = token.best_score >= 85 ? GREEN : token.best_score >= 70 ? '#ffaa00' : '#888'
  const scoreFill = `${token.best_score}%`
  const cielo = token.address ? `https://app.cielo.finance/trading/${token.address}?ref=iseeiape` : null
  const dex = token.address ? `https://dexscreener.com/${token.chain}/${token.address}` : null

  return (
    <>
      <Head>
        <title>${token.symbol} Wolf Alert — Score {token.best_score}/100 | iseeiape.com</title>
        <meta name="description" content={`Wolf caught $${token.symbol} on ${token.chain} with score ${token.best_score}/100.${token.best_return_1h ? ` Best 1h return: ${token.best_return_1h > 0 ? '+' : ''}${token.best_return_1h.toFixed(1)}%.` : ''} Tracked by Wolf Alert System on iseeiape.com`} />
        <meta property="og:title" content={`$${token.symbol} Wolf Alert — Score ${token.best_score}/100`} />
        <meta property="og:description" content={`Wolf Alert System caught $${token.symbol} on ${token.chain.toUpperCase()}. Score: ${token.best_score}/100. Alerted ${token.alert_count} times.`} />
        <meta property="og:site_name" content="iseeiape.com" />
      </Head>
      <div style={{ background: BG, minHeight: '100vh', color: '#fff', fontFamily: 'monospace', padding: '24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          {/* Nav */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 32, fontSize: 13 }}>
            <Link href="/tokens" style={{ color: GREEN, textDecoration: 'none' }}>← All Tokens</Link>
            <Link href="/master" style={{ color: '#555', textDecoration: 'none' }}>Dashboard</Link>
          </div>

          {/* Hero */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <h1 style={{ color: '#fff', fontSize: 48, margin: 0, fontWeight: 900 }}>${token.symbol}</h1>
            <span style={{
              background: token.chain === 'solana' ? '#1a0533' : '#001a33',
              color: token.chain === 'solana' ? '#9945ff' : '#0094ff',
              borderRadius: 6, padding: '4px 12px', fontSize: 13, fontWeight: 700
            }}>{token.chain.toUpperCase()}</span>
          </div>

          {/* Score card */}
          <div style={{ background: '#0a0a0a', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ color: '#888', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Wolf Score</span>
              <span style={{ color: scoreColor, fontSize: 32, fontWeight: 900 }}>{token.best_score}/100</span>
            </div>
            <div style={{ background: '#111', borderRadius: 4, height: 8, overflow: 'hidden' }}>
              <div style={{ background: scoreColor, height: '100%', width: scoreFill, borderRadius: 4, transition: 'width 0.5s' }} />
            </div>
            <p style={{ color: '#555', fontSize: 12, margin: '12px 0 0' }}>
              {token.best_score >= 90 ? '🔥 Alpha signal — highest conviction' :
               token.best_score >= 80 ? '⚡ Strong signal — high momentum' :
               token.best_score >= 70 ? '📈 Momentum signal — worth watching' :
               '👀 Low signal — early stage'}
            </p>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              ['Times Caught', `${token.alert_count}x`, GREEN],
              ['First Seen', token.first_seen ? new Date(token.first_seen).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'}) : '—', '#fff'],
              ['Best 1h Return', token.best_return_1h != null ? `${token.best_return_1h > 0 ? '+' : ''}${token.best_return_1h.toFixed(1)}%` : 'No data yet', token.best_return_1h > 0 ? GREEN : '#ff4444'],
              ['Best 24h Return', token.best_return_24h != null ? `${token.best_return_24h > 0 ? '+' : ''}${token.best_return_24h.toFixed(1)}%` : 'No data yet', token.best_return_24h > 0 ? GREEN : '#ff4444'],
            ].map(([label, value, color]) => (
              <div key={label} style={{ background: '#0a0a0a', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '16px 20px' }}>
                <div style={{ color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</div>
                <div style={{ color, fontSize: 22, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Categories */}
          {token.categories?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Alert Types</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {token.categories.map(c => (
                  <span key={c} style={{ background: '#111', border: `1px solid #222`, borderRadius: 4, padding: '4px 10px', fontSize: 12, color: '#888', textTransform: 'uppercase' }}>{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
            {cielo && (
              <a href={cielo} target="_blank" rel="noopener noreferrer" style={{
                background: GREEN, color: '#000', borderRadius: 8, padding: '12px 24px',
                textDecoration: 'none', fontWeight: 700, fontSize: 14,
              }}>🔗 Trade on Cielo</a>
            )}
            {dex && (
              <a href={dex} target="_blank" rel="noopener noreferrer" style={{
                background: '#0a0a0a', color: GREEN, border: `1px solid ${GREEN}`,
                borderRadius: 8, padding: '12px 24px', textDecoration: 'none', fontWeight: 700, fontSize: 14,
              }}>📊 DexScreener</a>
            )}
          </div>

          {/* Footer */}
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20, color: '#333', fontSize: 12 }}>
            <p>Tracked by <Link href="/" style={{ color: GREEN, textDecoration: 'none' }}>Wolf Alert System</Link> — autonomous Solana & Base scanner running 24/7.</p>
            <p style={{ marginTop: 8 }}>⚠️ DYOR. Not financial advice. Past performance does not guarantee future results. 🦎</p>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), 'data', 'wolf-tokens.json')
  const { tokens } = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const paths = tokens.map(t => ({ params: { symbol: t.symbol } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'data', 'wolf-tokens.json')
  const { tokens } = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const token = tokens.find(t => t.symbol === params.symbol) || null
  return { props: { token }, revalidate: 3600 }
}
