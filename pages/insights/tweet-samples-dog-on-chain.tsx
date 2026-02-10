import Head from 'next/head'

export default function Tweetsamplesdogonchain() {
  return (
    <>
      <Head>
        <title>Sample Tweets for @dog_on_chain - iseeiape</title>
        <meta name="description" content="Sample Tweets for @dog_on_chain" />
      </Head>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', color: '#fff', background: '#0a0a0a', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '36px', color: '#00ff88', marginBottom: '30px' }}>Sample Tweets for @dog_on_chain</h1>
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
            {"# Sample Tweets for @dog_on_chain\n## Ready to copy/paste and post manually\n\n---\n\n## TWEET 1: Introduction/Branding 🦎\n\n```\n🦎 The Matrix Army is assembling.\n\nTracking whale wallets.\nSpotting smart money moves.\nPrinting while you sleep.\n\nFirst alpha leak dropping this week 👀\n\n#Solana #Base #SmartMoney\n```\n\n---\n\n## TWEET 2: Value/Engagement 📊\n\n```\nIn 2024, I learned one thing:\n\nThe alpha isn't in the chart.\nIt's in the wallets.\n\nFollow the smart money.\nNot the influencers.\n\n🧵👇\n```\n\n---\n\n## TWE..."}
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
