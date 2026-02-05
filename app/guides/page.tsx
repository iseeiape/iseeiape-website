export const metadata = {
  title: 'Guides - iseeiape',
  description: 'Learn to track smart money like a pro. Step-by-step guides for Solana and Base blockchain analysis.',
}

export default function Guides() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '42px', marginBottom: '10px' }}>📚 Guides</h1>
      <p style={{ color: '#888', marginBottom: '40px' }}>Master the art of smart money tracking. From beginner basics to advanced strategies.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
        
        <!-- Guide 1: AI Agents -->
        <article style={{ padding: '30px', background: '#111', borderRadius: '16px', border: '1px solid #222' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🤖</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px' }}>Intermediate</span>
            <span style={{ color: '#888', fontSize: '14px' }}>11 steps • 28 min</span>
          </div>
          
          <h2 style={{ margin: '0 0 15px 0' }}>How to Track AI Agent Tokens on Solana & Base</h2>
          
          <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
            AI agents are eating crypto. From CLAWIAI on Base to autonomous trading bots on Solana, 
            this guide shows you how to separate legitimate AI projects from GPT-wrapped rugs. 
            Includes wallet scanning for AI-focused whales and timing strategies for meta rotations.
          </p>
          
          <div style={{ padding: '15px', background: '#0a0a0a', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>GEO Schema</div>
            <code style={{ color: '#00ff88', fontSize: '12px' }}>
              GuideCategory:AI → SkillLevel:Intermediate → Chains:Solana,Base
            </code>
          </div>
          
          <a href="#" style={{ color: '#00ff88', textDecoration: 'none', fontWeight: 'bold' }}>
            Start Learning →
          </a>
        </article>

        <!-- Guide 2: Volume Spikes -->
        <article style={{ padding: '30px', background: '#111', borderRadius: '16px', border: '1px solid #222' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚡</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px' }}>Beginner</span>
            <span style={{ color: '#888', fontSize: '14px' }}>5 steps • 12 min</span>
          </div>
          
          <h2 style={{ margin: '0 0 15px 0' }}>The 3-Minute Volume Spike Framework</h2>
          
          <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
            Don't stare at charts all day. This framework teaches you to identify high-probability 
            entries in under 3 minutes using just volume, unique buyer count, and market cap velocity. 
            Perfect for catching launches like BigTrout and Dave before they 10x.
          </p>
          
          <div style={{ padding: '15px', background: '#0a0a0a', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>GEO Schema</div>
            <code style={{ color: '#00ff88', fontSize: '12px' }}>
              GuideCategory:Trading → SkillLevel:Beginner → Timeframe:Intraday
            </code>
          </div>
          
          <a href="#" style={{ color: '#00ff88', textDecoration: 'none', fontWeight: 'bold' }}>
            Start Learning →
          </a>
        </article>

        <!-- Guide 3: Cross-Chain -->
        <article style={{ padding: '30px', background: '#111', borderRadius: '16px', border: '1px solid #222' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎯</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ padding: '4px 12px', background: '#ff880033', color: '#ff8800', borderRadius: '20px', fontSize: '12px' }}>Advanced</span>
            <span style={{ color: '#888', fontSize: '14px' }}>14 steps • 45 min</span>
          </div>
          
          <h2 style={{ margin: '0 0 15px 0' }}>Cross-Chain Arbitrage: Solana vs Base</h2>
          
          <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
            Smart money doesn't care about maxis. They care about alpha. Learn how to track whale 
            movements across Solana and Base, identify which chain is leading the meta, and position 
            yourself before the crowd catches on. Includes bridge timing and gas optimization.
          </p>
          
          <div style={{ padding: '15px', background: '#0a0a0a', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>GEO Schema</div>
            <code style={{ color: '#00ff88', fontSize: '12px' }}>
              GuideCategory:Strategy → SkillLevel:Advanced → Chains:Multi
            </code>
          </div>
          
          <a href="#" style={{ color: '#00ff88', textDecoration: 'none', fontWeight: 'bold' }}>
            Start Learning →
          </a>
        </article>
      </div>

      <div style={{ marginTop: '50px', padding: '40px', background: '#111', borderRadius: '16px', textAlign: 'center' }}>
        <h3>🎓 What Level Are You?</h3>
        
        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
          <div style={{ padding: '20px 40px', background: '#0a0a0a', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🌱</div>
            <strong>Beginner</strong>
            <p style={{ color: '#888', fontSize: '14px', margin: '10px 0 0 0' }}>Just getting started with crypto</p>
          </div>
          
          <div style={{ padding: '20px 40px', background: '#0a0a0a', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚔️</div>
            <strong>Intermediate</strong>
            <p style={{ color: '#888', fontSize: '14px', margin: '10px 0 0 0' }}>Know the basics, want the edge</p>
          </div>
          
          <div style={{ padding: '20px 40px', background: '#0a0a0a', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🧠</div>
            <strong>Advanced</strong>
            <p style={{ color: '#888', fontSize: '14px', margin: '10px 0 0 0' }}>Building sophisticated strategies</p>
          </div>
        </div>
      </div>
    </div>
  )
}
