import Head from 'next/head'

export default function Guides() {
  return (
    <>
      <Head>
        <title>Guides - iseeiape</title>
      </Head>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#fff', background: '#0a0a0a', minHeight: '100vh' }}>
        <a href="/" style={{ color: '#00ff88', textDecoration: 'none' }}>← Back to Home</a>
        
        <h1 style={{ fontSize: '42px', marginTop: '30px' }}>📚 Guides</h1>
        <p style={{ color: '#888', marginBottom: '40px' }}>Master smart money tracking. From beginner basics to advanced strategies.</p>

        {/* Featured Guide Banner */}
        <div style={{ padding: '30px', background: 'linear-gradient(135deg, #ff880022, #00ff8822)', border: '1px solid #ff880044', borderRadius: '16px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '64px' }}>🤖</div>
            <div style={{ flex: 1 }}>
              <span style={{ padding: '6px 16px', background: '#ff8800', color: '#000', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>🔥 TODAY'S FEATURED • FEB 9, 2026</span>
              <h2 style={{ marginTop: '15px', fontSize: '28px' }}>How to Track AI Agent Tokens on Solana & Base</h2>
              <p style={{ color: '#ccc', marginBottom: '15px' }}>AI agents are eating crypto. This guide shows you how to separate legitimate AI projects from GPT-wrapped rugs. Includes wallet scanning for AI-focused whales and timing strategies for meta rotations.</p>
              <div style={{ display: 'flex', gap: '20px', color: '#888', fontSize: '14px' }}>
                <span>📖 11 steps</span>
                <span>⏱️ 28 minutes</span>
                <span>🟡 Intermediate</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
          <article style={{ padding: '30px', background: '#111', borderRadius: '16px', border: '2px solid #00ff88' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🤖</div>
            <span style={{ padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px' }}>Intermediate • Featured Today</span>
            <h2 style={{ marginTop: '15px' }}>How to Track AI Agent Tokens</h2>
            <p style={{ color: '#aaa' }}>Separate legitimate AI projects from GPT-wrapped rugs on Solana & Base.</p>
          </article>

          <article style={{ padding: '30px', background: '#111', borderRadius: '16px' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚡</div>
            <span style={{ padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px' }}>Beginner</span>
            <h2 style={{ marginTop: '15px' }}>The 3-Minute Volume Spike Framework</h2>
            <p style={{ color: '#aaa' }}>Identify high-probability entries fast using volume and buyer count.</p>
          </article>

          <article style={{ padding: '30px', background: '#111', borderRadius: '16px' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎯</div>
            <span style={{ padding: '4px 12px', background: '#ff880033', color: '#ff8800', borderRadius: '20px', fontSize: '12px' }}>Advanced</span>
            <h2 style={{ marginTop: '15px' }}>Cross-Chain Arbitrage</h2>
            <p style={{ color: '#aaa' }}>Track whale movements across Solana and Base for maximum alpha.</p>
          </article>
        </div>
      </div>
    </>
  )
}
