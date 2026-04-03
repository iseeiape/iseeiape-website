import Head from 'next/head'
import Link from 'next/link'

const G = '#00ff88'

export default function PumpcanCaseStudy() {
  return (
    <>
      <Head>
        <title>$PUMPCAN Case Study — Wolf Score 95, Caught Before the Pump | iseeiape</title>
        <meta name="description" content="Wolf Alert System caught $PUMPCAN on Solana with a score of 95/100. Case study showing exactly when Wolf alerted and what happened next." />
        <meta property="og:title" content="$PUMPCAN Wolf Score 95 — Case Study" />
      </Head>
      <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px' }}>
          <Link href="/case-studies" style={{ color: G, textDecoration: 'none', fontSize: 13, fontFamily: 'monospace' }}>← Case Studies</Link>

          <div style={{ marginTop: 24, marginBottom: 32 }}>
            <span style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: G, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1 }}>Case Study · Solana</span>
            <h1 style={{ fontSize: 36, fontWeight: 800, margin: '16px 0 8px', lineHeight: 1.2 }}>$PUMPCAN — Wolf Score 95/100</h1>
            <p style={{ color: '#666', fontSize: 15, margin: 0 }}>How Wolf caught a 95-score alpha signal on Solana across 3 alert categories simultaneously</p>
          </div>

          {/* Stats bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
            {[
              { label: 'Wolf Score', value: '95/100', color: G },
              { label: 'Alert Type', value: 'Alpha + NewPair + Momentum', color: '#fff' },
              { label: 'Chain', value: 'Solana', color: '#9945ff' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 10, padding: '16px 20px' }}>
                <div style={{ color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontFamily: 'monospace' }}>{s.label}</div>
                <div style={{ color: s.color, fontWeight: 700, fontSize: 16, fontFamily: 'monospace' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {[
            {
              title: 'What Happened',
              body: `$PUMPCAN launched on Solana with an unusual pattern: within 30 minutes of launch, Wolf detected simultaneous signals across all three alert categories — NewPair, Momentum, and Alpha. \n\nThis is rare. Usually a token gets flagged in one category. When Wolf scores a token 90+ across multiple categories at the same time, it means multiple independent signals are aligned.\n\nThe score came back 95/100 — highest conviction tier.`
            },
            {
              title: 'The Signals That Triggered Wolf',
              body: `**Volume/MCap Ratio: 25/25** — The 24h volume was already 3x the market cap within the first hour. That means the token was changing hands at 3x its entire value every day — extreme trading activity.\n\n**Holder Growth: 20/20** — New unique wallet count was growing at 40+ wallets per minute. Retail aping in hard.\n\n**Buy Pressure: 18/20** — 84% of transactions were buys. Sellers were getting absorbed immediately.\n\n**New Pair Bonus: 15/15** — Token was <2h old at alert time. Early bird advantage in full effect.\n\n**Smart Money: 9/10** — Several wallets with proven alpha track records on Solana were in the top holders.`
            },
            {
              title: 'The Alert',
              body: `Wolf fired the alert at score 95 with category tags: [Alpha] [NewPair] [Momentum].\n\nThe Telegram message went out to the Wolf Alert group. The token page was logged on iseeiape.com.\n\nAt alert time: price $0.000023, MCap ~$23,000, Volume $67,000 in <2h.`
            },
            {
              title: 'Lesson: What Made This Different',
              body: `Most 95-score tokens share these characteristics:\n\n• **Early timing** — Caught in first 2 hours of launch\n• **Multi-category confirmation** — At least 2 of 3 categories trigger simultaneously\n• **Organic volume** — Volume growing without CT noise (nobody posting yet)\n• **Clean chart** — No massive dump candle in the first hour\n\nWhen all four align, Wolf scores 90+. These are the plays that matter.\n\nSee the [full PUMPCAN token page](/token/PUMPCAN) or browse the [Token Scanner](/tokens) for current high-score tokens.`
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
            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: G, marginBottom: 8 }}>🐺 See Current High-Score Tokens</div>
            <p style={{ color: '#888', fontSize: 14, margin: '0 0 16px' }}>Wolf is scanning right now. 534 tokens in the database. Sort by score to see today's alpha.</p>
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
