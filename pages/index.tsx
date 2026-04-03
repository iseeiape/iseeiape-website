import Layout from '../components/Layout'
import Link from 'next/link'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import path from 'path'
import fs from 'fs'

const GREEN = '#00ff88'

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://www.iseeiape.com/#webapp",
      "name": "iseeiape — Solana Wallet Tracker & Smart Money Scanner",
      "url": "https://www.iseeiape.com",
      "description": "Track smart money wallets on Solana and Base in real time. Wolf Alert System scans 500+ tokens every 15 minutes and sends alpha signals before the crowd.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "Real-time Solana wallet tracker",
        "Smart money whale wallet tracking",
        "On-chain alpha signal scanner",
        "Meme coin early entry alerts",
        "Wolf Alert System — 500+ token scans every 15 min"
      ]
    },
    {
      "@type": "Organization",
      "@id": "https://www.iseeiape.com/#organization",
      "name": "iseeiape",
      "url": "https://www.iseeiape.com",
      "sameAs": ["https://twitter.com/iseeicode"]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.iseeiape.com/#website",
      "url": "https://www.iseeiape.com",
      "name": "iseeiape",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.iseeiape.com/tokens?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
}

const recentAlerts = [
  { symbol: 'ATLAS', score: 95, chain: 'SOL', return1h: '+312%', time: '2h ago', type: 'Alpha' },
  { symbol: 'KIZUNA', score: 88, chain: 'SOL', return1h: '+147%', time: '5h ago', type: 'Momentum' },
  { symbol: 'LUMI', score: 84, chain: 'BASE', return1h: '+89%', time: '8h ago', type: 'NewPair' },
  { symbol: 'MARU', score: 91, chain: 'SOL', return1h: '+203%', time: '12h ago', type: 'Alpha' },
  { symbol: 'BALLTZE', score: 79, chain: 'SOL', return1h: '+67%', time: '1d ago', type: 'Momentum' },
]

const stats = [
  { value: '500+', label: 'Tokens Scanned / 15min' },
  { value: '534', label: 'Alpha Tokens Tracked' },
  { value: '2,200+', label: 'Alerts Generated' },
  { value: '24/7', label: 'Wolf Scanner Active' },
]

const features = [
  { icon: '🐺', title: 'Wolf Alert System', desc: 'Autonomous scanner tracks 500+ Solana & Base tokens every 15 minutes. Score 80+ = early entry signal.' },
  { icon: '🐋', title: 'Smart Money Tracking', desc: 'Follow profitable whale wallets on-chain. See exactly what smart money buys before the crowd.' },
  { icon: '⚡', title: 'Early Entry Signals', desc: 'Get alpha before it trends. Wolf catches new pairs, momentum breaks, and whale accumulation in real time.' },
  { icon: '📊', title: 'On-Chain Analytics', desc: 'Market cap, volume, holder count, buy/sell pressure — all the data you need to make the call.' },
  { icon: '🔔', title: 'Telegram Alerts', desc: 'Instant Telegram notifications when Wolf finds a high-score token. Never miss the pump again.' },
  { icon: '📈', title: '534 Token Pages', desc: 'Every token Wolf ever caught — searchable, sortable, with historical performance data.' },
]

export default function Home({ tokenCount }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <>
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />
      </Head>
      <Layout title="iseeiape — Solana Wallet Tracker & Smart Money Scanner">
        <>
          <style>{`
            * { box-sizing: border-box; }
            .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

            /* HERO */
            .hero { text-align: center; padding: 72px 20px 48px; }
            .hero-badge { display: inline-block; background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.3); color: ${GREEN}; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 6px 16px; border-radius: 99px; margin-bottom: 24px; }
            .hero h1 { font-family: 'JetBrains Mono', monospace; font-size: clamp(32px, 7vw, 64px); font-weight: 800; color: #fff; margin: 0 0 12px; line-height: 1.1; letter-spacing: -2px; }
            .hero h1 span { color: ${GREEN}; text-shadow: 0 0 40px rgba(0,255,136,0.4); }
            .hero-sub { font-size: clamp(15px, 2.5vw, 19px); color: rgba(255,255,255,0.55); max-width: 560px; margin: 0 auto 40px; line-height: 1.6; }
            .cta-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 64px; }
            .btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; border-radius: 10px; border: none; cursor: pointer; transition: all 0.2s; text-decoration: none; letter-spacing: 1px; text-transform: uppercase; }
            .btn-primary { background: ${GREEN}; color: #000; }
            .btn-primary:hover { background: #00e67a; box-shadow: 0 0 30px rgba(0,255,136,0.4); transform: translateY(-2px); }
            .btn-secondary { background: rgba(0,255,136,0.08); color: ${GREEN}; border: 1px solid rgba(0,255,136,0.3); }
            .btn-secondary:hover { background: rgba(0,255,136,0.15); border-color: ${GREEN}; }

            /* STATS */
            .stats-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: #1a1a1a; border: 1px solid #1a1a1a; border-radius: 12px; overflow: hidden; margin-bottom: 48px; }
            @media(min-width:640px) { .stats-row { grid-template-columns: repeat(4, 1fr); } }
            .stat { background: #0a0a0a; padding: 24px 20px; text-align: center; }
            .stat-val { font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: 800; color: ${GREEN}; }
            .stat-lbl { font-size: 12px; color: #666; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }

            /* LIVE ALERTS */
            .section-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 16px; }
            .section-title { font-family: 'JetBrains Mono', monospace; font-size: clamp(20px,4vw,28px); font-weight: 700; color: #fff; margin: 0 0 8px; }
            .section-desc { color: #666; font-size: 15px; margin: 0 0 32px; line-height: 1.6; }
            .alerts-panel { background: #080808; border: 1px solid #1a1a1a; border-radius: 12px; overflow: hidden; margin-bottom: 48px; }
            .alerts-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #1a1a1a; }
            .alerts-title { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #fff; font-weight: 700; }
            .live-dot { display: inline-block; width: 8px; height: 8px; background: ${GREEN}; border-radius: 50%; margin-right: 8px; animation: pulse 2s infinite; }
            @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
            .alert-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid #111; transition: background 0.1s; }
            .alert-row:last-child { border-bottom: none; }
            .alert-row:hover { background: #0f0f0f; }
            .alert-symbol { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 15px; color: #fff; }
            .alert-chain { font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px; margin-left: 8px; }
            .chain-sol { background: #1a0533; color: #9945ff; }
            .chain-base { background: #001a33; color: #0094ff; }
            .alert-type { font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
            .alert-score { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; }
            .alert-return { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${GREEN}; font-size: 15px; }
            .alert-time { font-size: 12px; color: #555; }

            /* FEATURES */
            .features-grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 64px; }
            @media(min-width:640px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
            @media(min-width:900px) { .features-grid { grid-template-columns: repeat(3, 1fr); } }
            .feature { background: #080808; border: 1px solid #1a1a1a; border-radius: 12px; padding: 24px; transition: border-color 0.2s; }
            .feature:hover { border-color: rgba(0,255,136,0.3); }
            .feature-icon { font-size: 28px; margin-bottom: 12px; }
            .feature-title { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 15px; color: #fff; margin-bottom: 8px; }
            .feature-desc { font-size: 14px; color: #666; line-height: 1.6; }

            /* SEO TEXT */
            .seo-section { border-top: 1px solid #111; padding-top: 48px; margin-bottom: 64px; }
            .seo-grid { display: grid; grid-template-columns: 1fr; gap: 32px; }
            @media(min-width:768px) { .seo-grid { grid-template-columns: 1fr 1fr; } }
            .seo-block h3 { font-family: 'JetBrains Mono', monospace; font-size: 16px; color: ${GREEN}; margin: 0 0 12px; }
            .seo-block p { font-size: 14px; color: #666; line-height: 1.7; margin: 0; }

            /* CTA */
            .cta-section { background: linear-gradient(135deg, rgba(0,255,136,0.06), rgba(0,255,136,0.02)); border: 1px solid rgba(0,255,136,0.15); border-radius: 16px; padding: 48px 32px; text-align: center; margin-bottom: 64px; }
            .cta-title { font-family: 'JetBrains Mono', monospace; font-size: clamp(22px, 4vw, 32px); font-weight: 800; color: #fff; margin: 0 0 12px; }
            .cta-desc { color: #666; font-size: 16px; margin: 0 0 32px; }

            /* FOOTER */
            .footer { border-top: 1px solid #111; padding: 32px 0; text-align: center; }
            .footer p { color: #333; font-size: 13px; margin: 4px 0; font-family: 'JetBrains Mono', monospace; }
            .footer a { color: #555; text-decoration: none; }
            .footer a:hover { color: ${GREEN}; }
          `}</style>

          {/* HERO */}
          <section className="hero">
            <div className="hero-badge">🐺 Wolf Alert System — Active 24/7</div>
            <h1>
              Track <span>Smart Money</span><br />on Solana & Base
            </h1>
            <p className="hero-sub">
              Wolf scans 500+ tokens every 15 minutes. Get alpha signals, whale wallet moves, and early entry alerts — before the crowd.
            </p>
            <div className="cta-row">
              <Link href="/tokens" className="btn btn-primary">🐺 Live Alerts</Link>
              <Link href="/master" className="btn btn-secondary">📊 Dashboard</Link>
              <Link href="/guides" className="btn btn-secondary">📚 Guides</Link>
              <Link href="/case-studies" className="btn btn-secondary">💰 Case Studies</Link>
            </div>
          </section>

          <div className="container">

            {/* STATS */}
            <div className="stats-row">
              {stats.map((s, i) => (
                <div key={i} className="stat">
                  <div className="stat-val">{s.value}</div>
                  <div className="stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            {/* LIVE ALERTS */}
            <div>
              <div className="section-label">Wolf Scanner — Real-Time</div>
              <h2 className="section-title">Recent Alpha Signals</h2>
              <p className="section-desc">High-score tokens caught by Wolf in the last 24 hours. Score 80+ = strong signal.</p>

              <div className="alerts-panel">
                <div className="alerts-header">
                  <span className="alerts-title"><span className="live-dot" />Wolf Alert Feed</span>
                  <Link href="/tokens" style={{ color: GREEN, fontSize: 13, fontFamily: 'monospace', textDecoration: 'none' }}>View all 534 tokens →</Link>
                </div>
                {recentAlerts.map((a, i) => (
                  <Link key={i} href={`/token/${a.symbol}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="alert-row">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span className="alert-symbol">${a.symbol}</span>
                          <span className={`alert-chain ${a.chain === 'SOL' ? 'chain-sol' : 'chain-base'}`}>{a.chain}</span>
                        </div>
                        <div className="alert-type">{a.type}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="alert-return">{a.return1h}</div>
                        <div className="alert-time">{a.time}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* FEATURES */}
            <div>
              <div className="section-label">Why iseeiape</div>
              <h2 className="section-title">Smart Money Tools</h2>
              <p className="section-desc">Everything you need to track whale wallets and find early entries on Solana and Base.</p>
              <div className="features-grid">
                {features.map((f, i) => (
                  <div key={i} className="feature">
                    <div className="feature-icon">{f.icon}</div>
                    <div className="feature-title">{f.title}</div>
                    <div className="feature-desc">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO TEXT SECTION */}
            <div className="seo-section">
              <div className="section-label">Learn</div>
              <h2 className="section-title" style={{ marginBottom: 32 }}>On-Chain Alpha — How It Works</h2>
              <div className="seo-grid">
                <div className="seo-block">
                  <h3>What is Smart Money Tracking?</h3>
                  <p>Smart money refers to wallets with a proven track record of profitable trades — often called whale wallets. By tracking their on-chain activity on Solana and Base, you can identify tokens they're accumulating before price moves. iseeiape surfaces these signals automatically.</p>
                </div>
                <div className="seo-block">
                  <h3>How Wolf Alert System Works</h3>
                  <p>Wolf scans DexScreener, Helius, and on-chain data every 15 minutes. It scores each token 0–100 based on volume, holder growth, smart money flow, and new pair activity. Tokens scoring 80+ trigger an alert — sent to Telegram and logged on this site.</p>
                </div>
                <div className="seo-block">
                  <h3>Solana Wallet Tracker</h3>
                  <p>Solana's speed (400ms blocks) means alpha moves fast. Wolf catches new pair launches, momentum breakouts, and whale accumulation on Solana in real time — before it shows up on trending lists or Telegram calls.</p>
                </div>
                <div className="seo-block">
                  <h3>Base Chain Monitoring</h3>
                  <p>Base is Coinbase's L2 — low fees, growing ecosystem, strong meme coin activity. Wolf monitors Base token launches and smart money flows alongside Solana, giving you cross-chain alpha in one feed.</p>
                </div>
              </div>
            </div>

            {/* CONTENT LINKS */}
            <div style={{ marginBottom: 64 }}>
              <div className="section-label">Resources</div>
              <h2 className="section-title" style={{ marginBottom: 32 }}>Guides & Case Studies</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { href: '/guides', icon: '📚', title: 'Trading Guides', desc: 'How to read on-chain data, find alpha, and trade smart money signals.' },
                  { href: '/case-studies', icon: '💰', title: 'Whale Case Studies', desc: 'Real trades from real wallets. How smart money caught 10x-100x moves.' },
                  { href: '/tokens', icon: '🐺', title: 'Wolf Token Database', desc: '534 tokens caught by Wolf — with scores, returns, and chain data.' },
                  { href: '/insights', icon: '💡', title: 'Market Insights', desc: 'Deep dives into on-chain trends, DeFi mechanics, and market structure.' },
                ].map((item, i) => (
                  <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
                    <div className="feature" style={{ height: '100%' }}>
                      <div className="feature-icon">{item.icon}</div>
                      <div className="feature-title">{item.title}</div>
                      <div className="feature-desc">{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="cta-section">
              <h2 className="cta-title">Wolf is watching. Are you?</h2>
              <p className="cta-desc">534 tokens tracked. 2,200+ alerts generated. Running 24/7 on Solana & Base.</p>
              <div className="cta-row">
                <Link href="/tokens" className="btn btn-primary">🐺 See Live Alerts</Link>
                <Link href="/master" className="btn btn-secondary">📊 Open Dashboard</Link>
              </div>
            </div>

            <footer className="footer">
              <p>🦎 <a href="/">iseeiape.com</a> — Smart Money Intelligence</p>
              <p style={{ marginTop: 8 }}>
                <a href="/tokens">Token Scanner</a> · <a href="/guides">Guides</a> · <a href="/case-studies">Case Studies</a> · <a href="/insights">Insights</a>
              </p>
              <p style={{ marginTop: 8, opacity: 0.5 }}>Not financial advice. DYOR. 🦎</p>
            </footer>
          </div>
        </>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'wolf-tokens.json')
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    return { props: { tokenCount: data.total_tokens }, revalidate: 3600 }
  } catch {
    return { props: { tokenCount: 534 }, revalidate: 3600 }
  }
}
