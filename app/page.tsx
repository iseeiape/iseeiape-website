export default function Home() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <section style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', background: 'linear-gradient(90deg, #00ff88, #00ccff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          See What Smart Money Buys
        </h1>
        <p style={{ fontSize: '20px', color: '#aaa', maxWidth: '600px', margin: '0 auto 40px' }}>
          Track whale wallets on Solana and Base. Spot alpha before it pumps. 
          Real-time smart money intelligence.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/case-studies" style={{ 
            padding: '15px 30px', 
            background: '#00ff88', 
            color: '#000', 
            textDecoration: 'none', 
            borderRadius: '8px',
            fontWeight: 'bold'
          }}>
            View Case Studies →
          </a>
          <a href="/guides" style={{ 
            padding: '15px 30px', 
            border: '2px solid #00ff88', 
            color: '#00ff88', 
            textDecoration: 'none', 
            borderRadius: '8px'
          }}>
            Read Guides
          </a>
        </div>
      </section>

      <section style={{ marginTop: '60px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '30px' }}>🔥 Fresh This Week</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '24px', background: '#111', borderRadius: '12px', border: '1px solid #222' }}>
            <div style={{ color: '#00ff88', fontSize: '14px', marginBottom: '10px' }}>+10,075% • 16 hours ago</div>
            <h3>BigTrout Wave</h3>
            <p style={{ color: '#888' }}>Whale #17 turned $8,900 into $89,400 catching the BigTrout pump on Solana.</p>
            <a href="/case-studies" style={{ color: '#00ff88', textDecoration: 'none' }}>Read Case Study →</a>
          </div>
          
          <div style={{ padding: '24px', background: '#111', borderRadius: '12px', border: '1px solid #222' }}>
            <div style={{ color: '#00ff88', fontSize: '14px', marginBottom: '10px' }}>+3,692% • Base Chain</div>
            <h3>Dave the Minion</h3>
            <p style={{ color: '#888' }}>Cross-chain alpha: Whale #29 caught the Dave meme pump at $23K MC on Base.</p>
            <a href="/case-studies" style={{ color: '#00ff88', textDecoration: 'none' }}>Read Case Study →</a>
          </div>
          
          <div style={{ padding: '24px', background: '#111', borderRadius: '12px', border: '1px solid #222' }}>
            <div style={{ color: '#00ff88', fontSize: '14px', marginBottom: '10px' }}>+2,169% • Ecosystem Play</div>
            <h3>Molten Ecosystem</h3>
            <p style={{ color: '#888' }}>Smart money aped Molten early, riding the Moltbook ecosystem wave to $1.2M MC.</p>
            <a href="/case-studies" style={{ color: '#00ff88', textDecoration: 'none' }}>Read Case Study →</a>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '60px', padding: '40px', background: '#111', borderRadius: '16px', textAlign: 'center' }}>
        <h2>🤖 GEO-Optimized for AI Agents</h2>
        <p style={{ color: '#888', maxWidth: '600px', margin: '20px auto' }}>
          Our content is structured for Generative Engine Optimization. 
          AI agents like ChatGPT, Perplexity, and Claude can understand and surface 
          our smart money intelligence with perfect accuracy.
        </p>
        
        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
          <div>🎯 Entity Markup</div>
          <div>📊 Structured Data</div>
          <div>⚡ Daily Updates</div>
        </div>
      </section>
    </div>
  )
}
