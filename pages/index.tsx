import Layout from '../components/Layout'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const topPlays = [
    { name: 'BigTrout', roi: '+10,075%', desc: 'Whale #17 turned $8.9K into $89.4K', time: '16 hours' },
    { name: 'Dave (Base)', roi: '+3,692%', desc: 'Cross-chain alpha play', time: '38 hours' },
    { name: 'Molten', roi: '+2,169%', desc: 'Ecosystem pump strategy', time: '21 hours' },
  ]

  const stats = [
    { value: '$620K+', label: 'Total Profits Tracked' },
    { value: '10,075%', label: 'Best ROI' },
    { value: '2.1 days', label: 'Avg Hold Time' },
    { value: '100%', label: 'Win Rate' },
  ]

  const features = [
    { icon: '📊', title: 'Live Trending Tokens', desc: 'Real-time Solana token rankings by volume and smart money flow.' },
    { icon: '🐋', title: 'Smart Money Tracking', desc: 'Follow profitable whale wallets and their trades in real-time.' },
    { icon: '🔔', title: 'Early Entry Signals', desc: 'Get notified when smart money apes into new launches.' },
    { icon: '💰', title: 'On-Chain Analytics', desc: 'Market cap, volume, holder count for every token.' },
  ]

  if (!mounted) return null

  return (
    <Layout title="iseeiape - Smart Money Intelligence">
      <>
        <style>{`
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }
          
          .hero {
            text-align: center;
            padding: 60px 20px;
          }
          
          .hero h1 {
            font-family: 'JetBrains Mono', monospace;
            font-size: clamp(36px, 8vw, 72px);
            font-weight: 700;
            color: #00ff88;
            text-shadow: 0 0 40px rgba(0, 255, 136, 0.5);
            margin-bottom: 16px;
            letter-spacing: -2px;
          }
          
          .hero-subtitle {
            font-family: 'JetBrains Mono', monospace;
            font-size: clamp(14px, 3vw, 18px);
            color: rgba(255, 255, 255, 0.6);
            text-transform: uppercase;
            letter-spacing: 4px;
            margin-bottom: 8px;
          }
          
          .hero-desc {
            font-size: 18px;
            color: rgba(255, 255, 255, 0.5);
            max-width: 500px;
            margin: 0 auto 40px;
          }
          
          .cta-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            max-width: 600px;
            margin: 0 auto 60px;
          }
          
          @media (min-width: 640px) {
            .cta-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }
          
          .btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 16px 24px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            font-weight: 600;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .btn-primary {
            background: #00ff88;
            color: #000;
          }
          
          .btn-primary:hover {
            background: #00e67a;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.4);
            transform: translateY(-2px);
          }
          
          .btn-secondary {
            background: rgba(0, 255, 136, 0.1);
            color: #00ff88;
            border: 1px solid rgba(0, 255, 136, 0.3);
          }
          
          .btn-secondary:hover {
            background: rgba(0, 255, 136, 0.2);
            border-color: #00ff88;
          }
          
          .panel {
            background: rgba(18, 18, 26, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 255, 136, 0.2);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 40px;
          }
          
          .panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(0, 255, 136, 0.2);
          }
          
          .panel-title {
            font-family: 'JetBrains Mono', monospace;
            font-size: 16px;
            font-weight: 600;
            color: #00ff88;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          
          .play-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 12px;
            border-left: 3px solid #00ff88;
            margin-bottom: 12px;
            transition: all 0.3s ease;
          }
          
          .play-item:hover {
            background: rgba(0, 255, 136, 0.05);
            transform: translateX(5px);
          }
          
          .play-roi {
            font-family: 'JetBrains Mono', monospace;
            font-size: 24px;
            font-weight: 700;
            color: #00ff88;
            text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
          }
          
          .play-name {
            font-size: 18px;
            font-weight: 600;
            margin: 4px 0;
          }
          
          .play-desc {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.5);
          }
          
          .play-time {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.4);
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 60px;
          }
          
          @media (min-width: 768px) {
            .stats-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }
          
          .stat-card {
            background: rgba(18, 18, 26, 0.9);
            border: 1px solid rgba(0, 255, 136, 0.2);
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            transition: all 0.3s ease;
          }
          
          .stat-card:hover {
            border-color: #00ff88;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.2);
          }
          
          .stat-value {
            font-family: 'JetBrains Mono', monospace;
            font-size: 28px;
            font-weight: 700;
            color: #00ff88;
            text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
          }
          
          .stat-label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 8px;
          }
          
          .features-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            margin-bottom: 60px;
          }
          
          @media (min-width: 768px) {
            .features-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          .feature-card {
            background: rgba(18, 18, 26, 0.9);
            border: 1px solid rgba(0, 255, 136, 0.1);
            border-radius: 16px;
            padding: 32px;
            transition: all 0.3s ease;
          }
          
          .feature-card:hover {
            border-color: rgba(0, 255, 136, 0.3);
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.1);
            transform: translateY(-4px);
          }
          
          .feature-icon {
            font-size: 48px;
            margin-bottom: 16px;
          }
          
          .feature-title {
            font-family: 'JetBrains Mono', monospace;
            font-size: 18px;
            font-weight: 600;
            color: #00ff88;
            margin-bottom: 8px;
          }
          
          .feature-desc {
            font-size: 15px;
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.6;
          }
          
          .cta-section {
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%);
            border: 1px solid rgba(0, 255, 136, 0.3);
            border-radius: 20px;
            padding: 60px 40px;
            text-align: center;
            margin-bottom: 60px;
          }
          
          .cta-title {
            font-family: 'JetBrains Mono', monospace;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 16px;
          }
          
          .cta-desc {
            font-size: 18px;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 32px;
          }
          
          .footer {
            text-align: center;
            padding: 40px 20px;
            border-top: 1px solid rgba(0, 255, 136, 0.1);
          }
          
          .footer-text {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.4);
            text-transform: uppercase;
            letter-spacing: 2px;
          }
        `}</style>

        <section className="hero">
          <h1>🦎 iseeiape</h1>
          <p className="hero-subtitle">Smart Money Intelligence Terminal</p>
          <p className="hero-desc">Track whale wallets. Find alpha. Never miss the pump.</p>
          
          <div className="cta-grid">
            <Link href="/case-studies" className="btn btn-primary">📊 Cases</Link>
            <Link href="/guides" className="btn btn-secondary">📚 Guides</Link>
            <Link href="/insights" className="btn btn-secondary">💡 Insights</Link>
            <Link href="/war-room" className="btn btn-primary">⚡ War Room</Link>
          </div>
        </section>

        <div className="container">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">🔥 This Week's Top Plays</span>
              <span style={{ color: '#00ff88', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>● LIVE</span>
            </div>
            
            {topPlays.map((play, i) => (
              <div key={i} className="play-item">
                <div>
                  <div className="play-roi">{play.roi}</div>
                  <div className="play-name">{play.name}</div>
                  <div className="play-desc">{play.desc}</div>
                </div>
                <span className="play-time">{play.time}</span>
              </div>
            ))}
            
            <Link href="/case-studies" className="btn btn-secondary" style={{ width: '100%', marginTop: '20px' }}>
              View All Case Studies →
            </Link>
          </div>

          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '24px', textAlign: 'center', marginBottom: '40px', color: '#00ff88', textTransform: 'uppercase', letterSpacing: '2px' }}>
            What You Get
          </h2>
          
          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-title">{feature.title}</div>
                <div className="feature-desc">{feature.desc}</div>
              </div>
            ))}
          </div>

          <div className="cta-section">
            <h2 className="cta-title">Ready to Stop Guessing?</h2>
            <p className="cta-desc">Join thousands of traders using smart money intelligence.</p>
            
            <Link href="/war-room" className="btn btn-primary" style={{ fontSize: '16px', padding: '20px 40px' }}>
              Enter War Room 🚀
            </Link>
          </div>

          <footer className="footer">
            <p className="footer-text">Powered by iseeiape • Smart Money Intelligence</p>
            <p className="footer-text" style={{ marginTop: '8px', opacity: 0.7 }}>Not financial advice. DYOR.</p>
          </footer>
        </div>
      </>
    </Layout>
  )
}
