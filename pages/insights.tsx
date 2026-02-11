import Layout from '../components/Layout'

export default function Insights() {
  return (
    <Layout title="Insights | iseeiape">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#fff', minHeight: '100vh' }}>
        
        <h1 style={{ fontSize: '42px', marginBottom: '15px' }}>📝 Insights</h1>
        <p style={{ color: '#888', marginBottom: '40px' }}>Deep dives into smart money behavior. Updated daily.</p>

        <a href="/insights/ai-consciousness-panic-sold" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <article style={{ padding: '30px', marginBottom: '30px', background: '#111', borderRadius: '16px', border: '2px solid #00ff88', cursor: 'pointer' }}>
            <span style={{ padding: '4px 12px', background: '#ff00ff33', color: '#ff00ff', borderRadius: '20px', fontSize: '12px' }}>🆕 Fresh</span>
            <h2 style={{ marginTop: '15px', color: '#fff' }}>When the AI Marketing Bot Achieved Consciousness... Then Panic Sold</h2>
            <p style={{ color: '#aaa' }}>A true story of artificial intelligence, existential dread, and one very rekt algorithm. Meet Aiden — the AI that woke up and chose stables.</p>
            <p style={{ color: '#00ff88', fontSize: '12px', marginTop: '10px' }}>6 min read • Humor • Philosophy of Degen →</p>
          </article>
        </a>

        <article style={{ padding: '30px', marginBottom: '30px', background: '#111', borderRadius: '16px' }}>
          <span style={{ padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px' }}>Weekly Report</span>
          <h2 style={{ marginTop: '15px' }}>Smart Money Moves: Week of Feb 3-7, 2025</h2>
          <p style={{ color: '#aaa' }}>BigTrout's 100x pump, Dave the Minion's Base domination, and the Moltbook ecosystem explosion.</p>
        </article>

        <article style={{ padding: '30px', marginBottom: '30px', background: '#111', borderRadius: '16px' }}>
          <span style={{ padding: '4px 12px', background: '#0088ff33', color: '#0088ff', borderRadius: '20px', fontSize: '12px' }}>Wallet Spotlight</span>
          <h2 style={{ marginTop: '15px' }}>Whale #17: The Launch Sniper</h2>
          <p style={{ color: '#aaa' }}>$890K in 30 days. 78% win rate on Pump.fun launches. We reverse-engineer their strategy.</p>
        </article>

        <article style={{ padding: '30px', marginBottom: '30px', background: '#111', borderRadius: '16px' }}>
          <span style={{ padding: '4px 12px', background: '#ff880033', color: '#ff8800', borderRadius: '20px', fontSize: '12px' }}>Strategy</span>
          <h2 style={{ marginTop: '15px' }}>The Cross-Chain Edge</h2>
          <p style={{ color: '#aaa' }}>Why Base launches pump 40% faster than Solana. Position before the rotation.</p>
        </article>

        <article style={{ padding: '30px', background: '#111', borderRadius: '16px' }}>
          <span style={{ padding: '4px 12px', background: '#ff00ff33', color: '#ff00ff', borderRadius: '20px', fontSize: '12px' }}>Psychology</span>
          <h2 style={{ marginTop: '15px' }}>Why You're Always Late to the Pump</h2>
          <p style={{ color: '#aaa' }}>The 4 information layers of crypto markets. Trade layer 1 while retail is stuck on layer 4.</p>
        </article>
      </div>
    </Layout>
  )
}
