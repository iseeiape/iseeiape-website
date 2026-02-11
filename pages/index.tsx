import Layout from '../components/Layout'
import Link from 'next/link'

export default function Home() {
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
    {
      icon: '📊',
      title: 'Live Trending Tokens',
      desc: 'Real-time Solana token rankings by volume, price change, and smart money flow.',
    },
    {
      icon: '🐋',
      title: 'Smart Money Tracking',
      desc: 'Follow profitable whale wallets. See their trades, PnL, and token allocations.',
    },
    {
      icon: '🔔',
      title: 'Early Entry Signals',
      desc: 'Get notified when multiple smart money wallets ape into new launches.',
    },
    {
      icon: '💰',
      title: 'On-Chain Analytics',
      desc: 'Market cap, volume, holder count, and liquidity data for every token.',
    },
  ]

  return (
    <Layout title="iseeiape - Smart Money Intelligence">
      <div className="container">
        {/* Hero Section */}
        <section className="section">
          <div className="text-center mb-8">
            <h1 className="heading-1 mb-4">
              🦎 iseeiape
            </h1>
            <p className="heading-4" style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Smart Money Intelligence for Solana & Base
            </p>            
            <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-4)' }}>
              Track whale wallets. Find alpha. Never miss the pump.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-4 mb-8">
            <Link href="/case-studies" className="btn btn-primary">
              📊 Case Studies
            </Link>
            <Link href="/guides" className="btn btn-secondary">
              📚 Guides
            </Link>
            <Link href="/insights" className="btn btn-secondary">
              💡 Insights
            </Link>
            <Link href="/dashboard" className="btn btn-primary">
              📈 Dashboard
            </Link>
          </div>

          {/* Top Plays Card */}
          <div className="card card-elevated">
            <h2 className="heading-4 mb-6">
              <span className="text-gradient">🔥 This Week's Top Plays</span>
            </h2>
            
            <div className="flex flex-col gap-4">
              {topPlays.map((play, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-4"
                  style={{ 
                    background: 'var(--bg-secondary)', 
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gradient" style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
                        {play.roi}
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{play.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{play.desc}</div>
                  </div>
                  
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{play.time}</span>
                </div>
              ))}
            </div>
            
            <Link 
              href="/case-studies" 
              className="btn btn-secondary mt-6"
              style={{ width: '100%' }}
            >
              View All Case Studies →
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="grid grid-4">
            {stats.map((stat, i) => (
              <div key={i} className="card text-center">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="section">
          <h2 className="heading-3 text-center mb-8">
            What You Get With iseeiape
          </h2>
          
          <div className="grid grid-2">
            {features.map((feature, i) => (
              <div key={i} className="card">
                <div style={{ fontSize: '40px', marginBottom: 'var(--space-4)' }}>{feature.icon}</div>
                <h3 className="heading-4 mb-2">{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section text-center">
          <div className="card card-elevated" style={{ background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)' }}>
            <h2 className="heading-3 mb-4">
              Ready to Stop Guessing and Start Winning?
            </h2>            
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Join thousands of traders using smart money intelligence to find alpha on Solana.
            </p>
            
            <Link href="/dashboard" className="btn btn-primary">
              Launch Dashboard 🚀
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: 'var(--space-8) 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          <p>Powered by iseeiape • Smart Money Intelligence for Solana</p>
          <p className="mt-2">Not financial advice. DYOR. Crypto trading involves significant risk.</p>
        </footer>
      </div>
    </Layout>
  )
}
