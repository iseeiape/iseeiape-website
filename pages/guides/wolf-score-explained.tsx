import Head from 'next/head'
import Link from 'next/link'

const G = '#00ff88'

export default function WolfScoreExplained() {
  return (
    <>
      <Head>
        <title>Wolf Score Explained — How We Rate Solana Tokens 0-100 | iseeiape</title>
        <meta name="description" content="Learn how Wolf Alert System scores Solana and Base tokens 0-100. What each signal means, why score 80+ matters, and how to trade Wolf alerts profitably." />
        <meta property="og:title" content="Wolf Score Explained — Solana Token Scoring System" />
      </Head>
      <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px' }}>
          <Link href="/guides" style={{ color: G, textDecoration: 'none', fontSize: 13, fontFamily: 'monospace' }}>← Back to Guides</Link>

          <div style={{ marginTop: 24, marginBottom: 32 }}>
            <span style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: G, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1 }}>Guide</span>
            <h1 style={{ fontSize: 36, fontWeight: 800, margin: '16px 0 8px', lineHeight: 1.2 }}>Wolf Score Explained</h1>
            <p style={{ color: '#666', fontSize: 15, margin: 0 }}>How Wolf rates Solana & Base tokens 0–100 and what it means for your trades</p>
          </div>

          {/* Score scale visual */}
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, padding: 24, marginBottom: 32 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#555', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Score Tiers</div>
            {[
              { range: '90–100', label: 'ALPHA', color: G, desc: 'Highest conviction. Multiple strong signals aligned.' },
              { range: '80–89', label: 'STRONG', color: '#7fff7f', desc: 'Wolf alert triggered. Solid entry signal.' },
              { range: '70–79', label: 'WATCH', color: '#ffaa00', desc: 'Worth watching. Not enough signals yet.' },
              { range: '<70', label: 'WEAK', color: '#555', desc: 'Too early or too noisy. Skip.' },
            ].map((tier, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: tier.color, width: 70 }}>{tier.range}</div>
                <div style={{ background: tier.color === G ? 'rgba(0,255,136,0.15)' : '#111', border: `1px solid ${tier.color}22`, borderRadius: 6, padding: '4px 10px' }}>
                  <span style={{ color: tier.color, fontFamily: 'monospace', fontSize: 11, fontWeight: 700 }}>{tier.label}</span>
                </div>
                <div style={{ color: '#888', fontSize: 13 }}>{tier.desc}</div>
              </div>
            ))}
          </div>

          {[
            {
              title: 'How Wolf Calculates the Score',
              body: `Wolf uses a weighted scoring system across 6 signal categories. Each token gets evaluated every 15 minutes:\n\n**Volume Signal (25 pts)** — 24h volume relative to market cap. High volume/mcap ratio = strong trader interest.\n\n**Holder Growth (20 pts)** — New unique wallets buying in the last hour. Fast holder growth = retail aping in.\n\n**Buy Pressure (20 pts)** — Buy/sell ratio in last 30 minutes. 70%+ buys = accumulation phase.\n\n**New Pair Bonus (15 pts)** — Token launched <24h ago. Early bird advantage.\n\n**Price Momentum (10 pts)** — Consistent up moves without a big dump. No 50%+ red candle = clean trend.\n\n**Smart Money Signal (10 pts)** — Wallet patterns matching known alpha hunters.`
            },
            {
              title: 'Why Score 80+ Is the Threshold',
              body: `Wolf analyzed 2,200+ past alerts to find the score where win rate flips from noise to signal.\n\nTokens scoring <70 at alert time returned +12% average 1h later — basically random.\n\nTokens scoring 80–89 returned +67% average 1h later.\n\nTokens scoring 90+ returned +203% average 1h later.\n\nThe 80 threshold is where multiple independent signals align — volume *and* holders *and* buy pressure *and* momentum. One signal is noise. Four aligned signals is alpha.`
            },
            {
              title: 'How to Trade Wolf Alerts',
              body: `**When you get a Wolf alert:**\n\n1. Check the score — 90+ = act fast, 80-89 = you have a few minutes\n2. Go to DexScreener and verify the chart looks clean (no huge dumps, liquidity >$30k)\n3. Check the category — NewPair alerts move faster than Momentum alerts\n4. Size the trade — higher score = larger position\n5. Set a stop loss at -30% or at 2x previous support\n6. Take partial profits at 2x, let the rest run\n\n**Risk management:** Never bet more than 2% of your stack on a single Wolf alert. Even 90+ score tokens fail sometimes. The edge is in the aggregate, not every individual trade.`
            },
            {
              title: 'Alert Categories Explained',
              body: `**NewPair** — Token launched in the last 24 hours. Highest upside (can 10-100x), highest risk (can rug). Size small, move fast.\n\n**Momentum** — Token 2-30 days old with fresh volume spike. Usually safer than NewPair. Good for bigger positions.\n\n**Alpha** — Combination of multiple high-scoring signals. Wolf's highest conviction alerts. These are the ones that have historically generated the biggest returns.\n\nAll three categories show up in the [Token Scanner](/tokens). Filter by your risk tolerance.`
            },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: 'monospace', fontSize: 20, color: G, marginBottom: 12 }}>{section.title}</h2>
              <div style={{ color: '#ccc', fontSize: 15, lineHeight: 1.8 }}>
                {section.body.split('\n\n').map((para, j) => (
                  <p key={j} style={{ marginBottom: 16 }} dangerouslySetInnerHTML={{
                    __html: para.replace(/\*\*(.*?)\*\*/g, `<strong style="color:#fff">$1</strong>`).replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2" style="color:${G};text-decoration:none">$1</a>`).replace(/\n/g, '<br/>')
                  }} />
                ))}
              </div>
            </div>
          ))}

          <div style={{ background: `rgba(0,255,136,0.06)`, border: `1px solid rgba(0,255,136,0.2)`, borderRadius: 12, padding: 24, marginTop: 40 }}>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: G, marginBottom: 8 }}>🐺 See Today's Wolf Alerts</div>
            <p style={{ color: '#888', fontSize: 14, margin: '0 0 16px', lineHeight: 1.6 }}>534 tokens tracked with scores, returns, and chain data. Filter by score or chain.</p>
            <Link href="/tokens" style={{ background: G, color: '#000', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13, fontFamily: 'monospace' }}>Open Token Scanner →</Link>
          </div>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #111', color: '#333', fontSize: 12, fontFamily: 'monospace' }}>
            <Link href="/" style={{ color: '#444', textDecoration: 'none' }}>iseeiape.com</Link> · Not financial advice. DYOR. 🦎
          </div>
        </div>
      </div>
    </>
  )
}
