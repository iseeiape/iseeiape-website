import Layout from '../components/Layout'

export default function CaseStudies() {
  return (
    <Layout title="Case Studies | iseeiape">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#fff', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '42px', marginBottom: '15px' }}>📊 Case Studies</h1>
        <p style={{ color: '#888', marginBottom: '40px' }}>Real trades, real wallets, real alpha. Updated daily.</p>

        <article style={{ padding: '30px', marginBottom: '30px', background: '#111', borderRadius: '16px', border: '2px solid #00ff88' }}>
          <div style={{ color: '#00ff88', fontSize: '14px', marginBottom: '10px' }}>📈 +10,075% • Feb 5, 2025</div>
          <h2>How Whale #17 Caught the BigTrout Wave</h2>
          <p style={{ color: '#aaa' }}>$89,400 profit in 16 hours. Entry: $0.0000038 → Exit: $0.000384</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px', padding: '20px', background: '#0a0a0a', borderRadius: '8px' }}>
            <div><div style={{ color: '#888', fontSize: '12px' }}>Entry</div>$0.0000038</div>
            <div><div style={{ color: '#888', fontSize: '12px' }}>Exit</div>$0.000384</div>
            <div><div style={{ color: '#888', fontSize: '12px' }}>Position</div>$8,900</div>
            <div><div style={{ color: '#888', fontSize: '12px' }}>Profit</div><span style={{ color: '#00ff88' }}>$89,400</span></div>
          </div>
        </article>

        <article style={{ padding: '30px', marginBottom: '30px', background: '#111', borderRadius: '16px' }}>
          <div style={{ color: '#00ff88', fontSize: '14px', marginBottom: '10px' }}>📈 +3,692% • Feb 4, 2025</div>
          <h2>The Dave Minion Play on Base</h2>
          <p style={{ color: '#aaa' }}>$67,200 profit in 38 hours. Cross-chain alpha on Base.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px', padding: '20px', background: '#0a0a0a', borderRadius: '8px' }}>
            <div><div style={{ color: '#888', fontSize: '12px' }}>Entry</div>$0.00154</div>
            <div><div style={{ color: '#888', fontSize: '12px' }}>Exit</div>$0.0586</div>
            <div><div style={{ color: '#888', fontSize: '12px' }}>Position</div>$12,400</div>
            <div><div style={{ color: '#888', fontSize: '12px' }}>Profit</div><span style={{ color: '#00ff88' }}>$67,200</span></div>
          </div>
        </article>

        <article style={{ padding: '30px', background: '#111', borderRadius: '16px' }}>
          <div style={{ color: '#00ff88', fontSize: '14px', marginBottom: '10px' }}>📈 +2,169% • Feb 4, 2025</div>
          <h2>Molten: The Moltbook Ecosystem Play</h2>
          <p style={{ color: '#aaa' }}>$45,800 profit riding the ecosystem wave on Base.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px', padding: '20px', background: '#0a0a0a', borderRadius: '8px' }}>
            <div><div style={{ color: '#888', fontSize: '12px' }}>Entry</div>$0.00241</div>
            <div><div style={{ color: '#888', fontSize: '12px' }}>Exit</div>$0.0549</div>
            <div><div style={{ color: '#888', fontSize: '12px' }}>Position</div>$9,200</div>
            <div><div style={{ color: '#888', fontSize: '12px' }}>Profit</div><span style={{ color: '#00ff88' }}>$45,800</span></div>
          </div>
        </article>
      </div>
    </Layout>
  )
}
