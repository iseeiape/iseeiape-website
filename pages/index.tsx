import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>iseeiape - Smart Money Intelligence</title>
        <meta name="description" content="Track whale wallets on Solana and Base. Real-time smart money intelligence." />
      </Head>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#fff', background: '#0a0a0a', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '48px', color: '#00ff88', textAlign: 'center' }}>🦎 iseeiape</h1>
        <p style={{ textAlign: 'center', color: '#888', fontSize: '20px' }}>Smart Money Intelligence for Solana & Base</p>
        
        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <a href="/dashboard" style={{ margin: '10px', padding: '15px 30px', background: '#0052FF', color: '#fff', textDecoration: 'none', borderRadius: '8px', display: 'inline-block', fontWeight: 'bold' }}>📊 Live Dashboard</a>
          <a href="/analytics" style={{ margin: '10px', padding: '15px 30px', background: '#FF6B00', color: '#fff', textDecoration: 'none', borderRadius: '8px', display: 'inline-block', fontWeight: 'bold' }}>📈 Analytics</a>
          <a href="/case-studies" style={{ margin: '10px', padding: '15px 30px', background: '#00ff88', color: '#000', textDecoration: 'none', borderRadius: '8px', display: 'inline-block' }}>Case Studies</a>
          <a href="/guides" style={{ margin: '10px', padding: '15px 30px', background: '#00ff88', color: '#000', textDecoration: 'none', borderRadius: '8px', display: 'inline-block' }}>Guides</a>
          <a href="/insights" style={{ margin: '10px', padding: '15px 30px', background: '#00ff88', color: '#000', textDecoration: 'none', borderRadius: '8px', display: 'inline-block' }}>Insights</a>
        </div>
        
        <div style={{ marginTop: '60px', padding: '30px', background: '#111', borderRadius: '12px' }}>
          <h2>🔥 This Week's Top Plays</h2>
          <div style={{ marginTop: '20px' }}>
            <div style={{ padding: '20px', marginBottom: '15px', background: '#1a1a1a', borderRadius: '8px' }}>
              <strong style={{ color: '#00ff88' }}>+10,075%</strong> BigTrout - Whale #17 turned $8.9K into $89.4K
            </div>
            <div style={{ padding: '20px', marginBottom: '15px', background: '#1a1a1a', borderRadius: '8px' }}>
              <strong style={{ color: '#00ff88' }}>+3,692%</strong> Dave (Base) - Cross-chain alpha play
            </div>
            <div style={{ padding: '20px', background: '#1a1a1a', borderRadius: '8px' }}>
              <strong style={{ color: '#00ff88' }}>+2,169%</strong> Molten - Ecosystem pump strategy
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
