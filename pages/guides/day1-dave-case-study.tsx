import Head from 'next/head'

export default function Day1davecasestudy() {
  return (
    <>
      <Head>
        <title>Day 1 Content — Dave Case Study - iseeiape</title>
        <meta name="description" content="Day 1 Content — Dave Case Study" />
      </Head>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', color: '#fff', background: '#0a0a0a', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '36px', color: '#00ff88', marginBottom: '30px' }}>Day 1 Content — Dave Case Study</h1>
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
            {"# Day 1 Content — Dave Case Study\n## Deploy: February 7, 2026 at 08:00 AM EET\n\n---\n\n## Case Study to Add\n\n**ID:** '6' (after BigTrout #5)\n**Title:** How Whale #29 Caught the Dave Wave on Base\n**Token:** $Dave\n**Profit:** $67,200\n**ROI:** +3,692%\n**Timeframe:** 38 hours\n**Wallet:** 0x9a3...7c1e\n**WalletLabel:** Whale #29 (Cross-Chain Specialist)\n**Date:** 2025-02-04\n\n**Summary:**\nBase chain was quiet. Then Dave the Minion dropped. Whale #29 had their Base scanner running, caught the launch at $23..."}
          </pre>
        </div>
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <a href="/guides" style={{ 
            padding: '10px 20px', 
            background: '#00ff88', 
            color: '#000', 
            textDecoration: 'none', 
            borderRadius: '8px' 
          }}>
            ← Back to Guides
          </a>
        </div>
      </div>
    </>
  )
}
