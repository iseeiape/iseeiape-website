import Head from 'next/head'
import Link from 'next/link'

export default function DailyDrop20260405() {
  return (
    <>
      <Head>
        <title>Wolf Daily Alpha — April 05, 2026 | Solana & Base Token Signals | iseeiape</title>
        <meta name="description" content="Wolf Alert System daily report for April 05, 2026. Top Solana and Base token alpha signals, scores, and smart money moves tracked by Wolf." />
        <meta property="og:title" content="Wolf Daily Alpha — April 05, 2026" />
        <meta property="og:description" content="227 high-score alerts on April 05, 2026. Wolf scanned 625+ tokens on Solana & Base." />
      </Head>
      <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px' }}>
          <Link href="/insights" style={{ color: '#00ff88', textDecoration: 'none', fontSize: 13, fontFamily: 'monospace' }}>← Insights</Link>

          <div style={{ marginTop: 24, marginBottom: 32 }}>
            <span style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: '#00ff88', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1 }}>Daily Drop · Sunday</span>
            <h1 style={{ fontSize: 32, fontWeight: 800, margin: '16px 0 8px', lineHeight: 1.2 }}>Wolf Alpha Report — April 05, 2026</h1>
            <p style={{ color: '#666', fontSize: 15, margin: 0 }}>Top Solana & Base token signals from the last 24 hours. Wolf scored 625+ tokens, surfaced 227 high-conviction plays.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 32 }}>
            {% /* stats */ %}
            {[
              ['Alerts Today', '227'],
              ['Avg Score', '76/100'],
              ['Tokens Scanned', '625+'],
              ['Unique Tokens', '154'],
            ].map(([label, value], i) => (
              <div key={i} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 10, padding: '16px 20px' }}>
                <div style={{ color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontFamily: 'monospace' }}>{label}</div>
                <div style={{ color: '#00ff88', fontWeight: 700, fontSize: 20, fontFamily: 'monospace' }}>{value}</div>
              </div>
            ))}
          </div>

          <h2 style={{ fontFamily: 'monospace', fontSize: 18, color: '#00ff88', marginBottom: 0 }}>🐺 Top Signals Today</h2>
          <div style={{ background: '#080808', border: '1px solid #1a1a1a', borderRadius: 12, overflow: 'hidden', margin: '16px 0 32px' }}>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>Token</span>
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>Score / 1h Return</span>
            </div>
            <div style={{{{ padding: "20px", color: "#555", textAlign: "center", fontFamily: "monospace" }}}}>No high-score alerts in last 24h</div>
          </div>

          <h2 style={{ fontFamily: 'monospace', fontSize: 18, color: '#00ff88', marginBottom: 12 }}>What Moved Today</h2>
          <p style={{ color: '#888', fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
            Wolf ran continuous scans across Solana and Base on April 05, 2026. The scanner evaluates 6 independent signals per token — volume/mcap ratio, holder growth rate, buy pressure, new pair status, price momentum, and smart money wallet activity.
          </p>
          <p style={{ color: '#888', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Tokens scoring 80+ across multiple signal categories are the highest-conviction plays. Today's top score was <strong style={{ color: '#fff' }}>N/A/100</strong> for <strong style={{ color: '#00ff88' }}>$N/A</strong>. See the full token history on the <Link href="/tokens" style={{ color: '#00ff88', textDecoration: 'none' }}>Token Scanner</Link>.
          </p>

          <div style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 12, padding: 24, marginBottom: 40 }}>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00ff88', marginBottom: 8 }}>🐺 Wolf Alert System</div>
            <p style={{ color: '#888', fontSize: 14, margin: '0 0 16px' }}>534 tokens tracked. Real-time Solana & Base alpha signals. Running 24/7.</p>
            <Link href="/tokens" style={{ background: '#00ff88', color: '#000', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13, fontFamily: 'monospace' }}>Open Token Scanner →</Link>
          </div>

          <div style={{ paddingTop: 24, borderTop: '1px solid #111', color: '#333', fontSize: 12, fontFamily: 'monospace' }}>
            <Link href="/" style={{ color: '#444', textDecoration: 'none' }}>iseeiape.com</Link> · Not financial advice. DYOR. 🦎
          </div>
        </div>
      </div>
    </>
  )
}
