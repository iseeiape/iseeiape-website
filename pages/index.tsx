import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout title="iseeiape - Smart Money Intelligence">
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px', 
        color: '#fff', 
        minHeight: '100vh' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '48px', color: '#00ff88', marginBottom: '20px' }}>
            🦎 iseeiape
          </h1>
          <p style={{ color: '#888', fontSize: '20px', maxWidth: '600px', margin: '0 auto' }}>
            Smart Money Intelligence for Solana & Base
          </p>
          <p style={{ color: '#666', marginTop: '10px' }}>
            Track whale wallets. Find alpha. Never miss the pump.
          </p>
        </div>
        
        {/* Quick Action Buttons */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '60px'
        }}>
          <a href="/case-studies" style={{
            padding: '20px',
            background: '#00ff88',
            color: '#000',
            textDecoration: 'none',
            borderRadius: '12px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            📊 Case Studies
          </a>
          
          <a href="/guides" style={{
            padding: '20px',
            background: '#111',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '12px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            border: '1px solid #333'
          }}>
            📚 Guides
          </a>
          
          <a href="/insights" style={{
            padding: '20px',
            background: '#111',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '12px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            border: '1px solid #333'
          }}>
            💡 Insights
          </a>
          
          <a href="/dashboard" style={{
            padding: '20px',
            background: '#0052FF',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '12px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            📈 Dashboard
          </a>
        </div>
        
        {/* This Week's Top Plays */}
        <div style={{ padding: '30px', background: '#111', borderRadius: '16px' }}>
          <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🔥 This Week's Top Plays
          </h2>
          
          <div>
            {[
              { roi: '+10,075%', title: 'BigTrout', desc: 'Whale #17 turned $8.9K into $89.4K', time: '16 hours' },
              { roi: '+3,692%', title: 'Dave (Base)', desc: 'Cross-chain alpha play', time: '38 hours' },
              { roi: '+2,169%', title: 'Molten', desc: 'Ecosystem pump strategy', time: '21 hours' },
            ].map((play, i) => (
              <div key={i} style={{ 
                padding: '20px', 
                marginBottom: '15px', 
                background: '#1a1a1a', 
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px'
              }}>
                <div>
                  <strong style={{ color: '#00ff88', fontSize: '20px' }}>{play.roi}</strong>
                  <div style={{ fontSize: '18px', marginTop: '5px' }}>{play.title}</div>
                  <div style={{ color: '#888', fontSize: '14px' }}>{play.desc}</div>
                </div>
                <span style={{ color: '#666', fontSize: '14px' }}>{play.time}</span>
              </div>
            ))}
          </div>
          
          <a href="/case-studies" style={{
            display: 'block',
            marginTop: '20px',
            padding: '15px',
            background: '#00ff8833',
            color: '#00ff88',
            textDecoration: 'none',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            View All Case Studies →
          </a>
        </div>
        
        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px',
          marginTop: '40px'
        }}>
          {[
            { label: 'Total Profits Tracked', value: '$620K+' },
            { label: 'Best ROI', value: '10,075%' },
            { label: 'Avg Hold Time', value: '2.1 days' },
            { label: 'Win Rate', value: '100%' },
          ].map((stat, i) => (
            <div key={i} style={{ 
              padding: '20px', 
              background: '#111', 
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00ff88' }}>{stat.value}</div>
              <div style={{ color: '#888', fontSize: '14px', marginTop: '5px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
