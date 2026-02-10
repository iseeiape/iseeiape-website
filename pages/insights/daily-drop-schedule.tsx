import Head from 'next/head'

export default function Dailydropschedule() {
  return (
    <>
      <Head>
        <title>iseeiape.com Daily Content Drop Schedule - iseeiape</title>
        <meta name="description" content="iseeiape.com Daily Content Drop Schedule" />
      </Head>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', color: '#fff', background: '#0a0a0a', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '36px', color: '#00ff88', marginBottom: '30px' }}>iseeiape.com Daily Content Drop Schedule</h1>
        <div style={{ 
          background: '#111', 
          padding: '30px', 
          borderRadius: '12px',
          lineHeight: '1.6',
          fontSize: '16px'
        }}>
          {/* Content will be rendered here */}
          <p style={{ color: '#888', fontStyle: 'italic' }}>
            This content is auto-generated from markdown. The full content will be displayed here.
          </p>
          <pre style={{ 
            background: '#1a1a1a', 
            padding: '20px', 
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '14px'
          }}>
            {"# iseeiape.com Daily Content Drop Schedule\n## 9-Day Content Calendar (Europe/Bucharest timezone)\n\n---\n\n## 📅 SCHEDULE\n\n### Day 1 — February 6, 2026 (Friday)\n**Content:** Dave Case Study (+3,692% on Base)\n**Type:** Case Study\n**Deploy:** 08:00 AM EET\n**Tags:** Base Chain, Viral Meme, Quick Flip, Cross-chain alpha\n\n### Day 2 — February 7, 2026 (Saturday)\n**Content:** Molten Case Study (+2,169% on Base)\n**Type:** Case Study  \n**Deploy:** 08:00 AM EET\n**Tags:** Ecosystem Play, Base Chain, Trend Ridi..."}
          </pre>
        </div>
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <a href="/insights" style={{ 
            padding: '10px 20px', 
            background: '#00ff88', 
            color: '#000', 
            textDecoration: 'none', 
            borderRadius: '8px' 
          }}>
            ← Back to Insights
          </a>
        </div>
      </div>
    </>
  )
}
