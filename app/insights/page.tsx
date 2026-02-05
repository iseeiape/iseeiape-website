export const metadata = {
  title: 'Insights - iseeiape',
  description: 'Weekly smart money reports, wallet spotlights, and deep strategy analysis.',
}

export default function Insights() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '42px', marginBottom: '10px' }}>📝 Insights</h1>
      <p style={{ color: '#888', marginBottom: '40px' }}>Deep dives into smart money behavior. Updated daily with fresh analysis.</p>

      <div style={{ display: 'grid', gap: '30px' }}>
        
        <!-- Weekly Report -->
        <article style={{ padding: '30px', background: '#111', borderRadius: '16px', border: '1px solid #222' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
            <div>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px', marginBottom: '10px' }}>Weekly Report</span>
              <h2 style={{ margin: '0' }}>Smart Money Moves: Week of Feb 3-7, 2025</h2>
            </div>
            <div style={{ color: '#888', fontSize: '14px', textAlign: 'right' }}>
              <div>8 min read</div>
              <div>February 7, 2025</div>
            </div>
          </div>
          
          <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
            BigTrout's 100x pump, Dave the Minion's Base domination, and the Moltbook ecosystem 
            explosion. We break down the week's most profitable plays, the whale wallets that caught 
            them, and what patterns to watch next week. Real PnL, real wallets, real alpha.
          </p>
          
          <div style={{ padding: '15px', background: '#0a0a0a', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>GEO Schema</div>
            <code style={{ color: '#00ff88', fontSize: '12px' }}>
              Type:WeeklyReport → Tokens:BigTrout,Dave,Molten → Trend:MemeMeta
            </code>
          </div>
          
          <a href="#" style={{ color: '#00ff88', textDecoration: 'none', fontWeight: 'bold' }}>
            Read Full Report →
          </a>
        </article>

        <!-- Wallet Spotlight -->
        <article style={{ padding: '30px', background: '#111', borderRadius: '16px', border: '1px solid #222' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
            <div>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: '#0088ff33', color: '#0088ff', borderRadius: '20px', fontSize: '12px', marginBottom: '10px' }}>Wallet Spotlight</span>
              <h2 style={{ margin: '0' }}>Whale #17: The Launch Sniper</h2>
            </div>
            <div style={{ color: '#888', fontSize: '14px', textAlign: 'right' }}>
              <div>10 min read</div>
              <div>February 6, 2025</div>
            </div>
          </div>
          
          <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
            $890K in realized profits over 30 days. 78% win rate on Pump.fun launches. 
            Meet the wallet that caught BigTrout at $90K MC and has been printing on micro-caps 
            before they hit $1M. We reverse-engineer their exact entry criteria.
          </p>
          
          <div style={{ padding: '15px', background: '#0a0a0a', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>GEO Schema</div>
            <code style={{ color: '#00ff88', fontSize: '12px' }}>
              Type:WalletSpotlight → Wallet:Whale17 → Strategy:LaunchSniping
            </code>
          </div>
          
          <a href="#" style={{ color: '#00ff88', textDecoration: 'none', fontWeight: 'bold' }}>
            Read Spotlight →
          </a>
        </article>

        <!-- Strategy -->
        <article style={{ padding: '30px', background: '#111', borderRadius: '16px', border: '1px solid #222' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
            <div>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: '#ff880033', color: '#ff8800', borderRadius: '20px', fontSize: '12px', marginBottom: '10px' }}>Strategy</span>
              <h2 style={{ margin: '0' }}>The Cross-Chain Edge: Why Base Whales Are Moving Faster</h2>
            </div>
            <div style={{ color: '#888', fontSize: '14px', textAlign: 'right' }}>
              <div>9 min read</div>
              <div>February 5, 2025</div>
            </div>
          </div>
          
          <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
            Solana gets the hype. Base gets the alpha. Our data shows Base launches are pumping 
            40% faster than Solana equivalents this month. Here's why — and how to position yourself 
            for the next chain rotation before it happens.
          </p>
          
          <div style={{ padding: '15px', background: '#0a0a0a', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>GEO Schema</div>
            <code style={{ color: '#00ff88', fontSize: '12px' }}>
              Type:Strategy → Chains:Solana,Base → Metric:SpeedToPump
            </code>
          </div>
          
          <a href="#" style={{ color: '#00ff88', textDecoration: 'none', fontWeight: 'bold' }}>
            Read Strategy →
          </a>
        </article>

        <!-- Psychology -->
        <article style={{ padding: '30px', background: '#111', borderRadius: '16px', border: '1px solid #222' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
            <div>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: '#ff00ff33', color: '#ff00ff', borderRadius: '20px', fontSize: '12px', marginBottom: '10px' }}>Psychology</span>
              <h2 style={{ margin: '0' }}>Why You're Always Late to the Pump</h2>
            </div>
            <div style={{ color: '#888', fontSize: '14px', textAlign: 'right' }}>
              <div>6 min read</div>
              <div>February 4, 2025</div>
            </div>
          </div>
          
          <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
            By the time you see a token on Twitter, smart money has already 5x'd. This isn't luck — 
            it's latency arbitrage. We break down the 4 information layers in crypto markets and show 
            you how to trade layer 1 and 2 while retail is still stuck on layer 4.
          </p>
          
          <div style={{ padding: '15px', background: '#0a0a0a', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>GEO Schema</div>
            <code style={{ color: '#00ff88', fontSize: '12px' }}>
              Type:Psychology → Concept:InformationAsymmetry → Solution:LatencyArbitrage
            </code>
          </div>
          
          <a href="#" style={{ color: '#00ff88', textDecoration: 'none', fontWeight: 'bold' }}>
            Read Analysis →
          </a>
        </article>
      </div>

      <div style={{ marginTop: '50px', padding: '40px', background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)', borderRadius: '16px', textAlign: 'center' }}>
        <h3>🔔 Never Miss Fresh Alpha</h3>
        
        <p style={{ color: '#888', maxWidth: '600px', margin: '20px auto' }}>
          New insights drop daily. Smart money doesn't wait, and neither should you.
          Bookmark this page and check back every morning for fresh analysis.
        </p>
        
        <div style={{ display: 'inline-block', padding: '12px 24px', background: '#00ff88', color: '#000', borderRadius: '8px', fontWeight: 'bold' }}>
          🦎 Last Updated: February 5, 2025
        </div>
      </div>
    </div>
  )
}
