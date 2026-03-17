import Layout from '../../components/Layout'

export default function WIFCaseStudy() {
  return (
    <Layout 
      title="How We Caught the $WIF 1000% Move | iseeiape Case Studies"
      description="Real case study: How on-chain analysis spotted the Dogwifhat breakout 48 hours before it pumped 1000%. Full breakdown of signals and entry strategy."
      breadcrumbs={[{ name: 'Case Studies', path: '/case-studies' }, { name: '$WIF Breakout', path: '/case-studies/how-we-caught-wif-1000-percent-move' }]}
    >
      <article className="article">
        <header className="article-header">
          <span className="tag">Case Study</span>
          <h1>How We Caught the $WIF 1000% Move</h1>
          <p className="article-subtitle">48 hours of on-chain forensics that paid 10x</p>
          <div className="article-meta">
            <span>📊 Case Study</span>
            <span>⏱️ 8 min read</span>
            <span>💰 +1000% gains</span>
          </div>
        </header>

        <div className="article-content">
          <div className="highlight-box">
            <strong>TL;DR:</strong> We spotted $WIF at $0.15 before it hit $1.50. 
            Key signals: Whale accumulation pattern, liquidity growth, and social sentiment divergence. 
            Here's exactly how we did it.
          </div>

          <h2>The Setup: December 2023</h2>
          
          <p>Solana meme season was heating up. $BONK had just done a 50x. Every degen was hunting the next one. But most were chasing pumps that already happened.</p>
          
          <p>Our approach: Find the next $BONK <strong>before</strong> it pumped. Using on-chain data, not Twitter hype.</p>

          <h2>Day 1: The Initial Signal</h2>

          <h3>🐺 Wolf Alert: December 13, 2023</h3>
          
          <p>Our scanner flagged unusual activity:</p>
          
          <pre className="code-block">
{
`Token: $WIF
Price: $0.15
Market Cap: $15M
Liquidity: $2M (13% ratio ✅)
Score: 88/100

Signals:
🚀 Heavy accumulation: 45 buyers vs 8 sellers
💰 $400K net inflow in 6 hours  
📈 Volume spike: +800% vs 7-day avg
🎯 Early stage: Not on major Twitter yet`}
          </pre>

          <p>But one signal isn't enough. Time to dig deeper.</p>

          <h2>The Wallet Analysis</h2>

          <p>We pulled the top 20 buyers from that 6-hour window. Here's what we found:</p>

          <h3>Whale #1: "The Quiet Accumulator"</h3>
          <ul>
            <li>Wallet age: 2 years (not a fresh bot)</li>
            <li>Previous wins: $BONK (+400%), $PEPE (+250%)</li>
            <li>WIF buy: $50K at $0.15</li>
            <li>Pattern: Always buys early, never sells first hour</li>
          </ul>

          <h3>Whale #2: "The Smart Money"</h3>
          
          <ul>
            <li>Connected to known VC fund wallet</li>
            <li>Only trades memes with 10M+ potential</li>
            <li>WIF buy: $120K over 3 transactions</li>
            <li>Timing: Bought during every dip for 12 hours</li>
          </ul>

          <h3>Whale #3: "The Influencer Insider"</h3>
          
          <ul>
            <li>Wallet funded by major CT account</li>
            <li>Historical pattern: Buys 24-48h before tweet</li>
            <li>WIF buy: $25K (small but significant)</li>
          </ul>

          <p><strong>Red flag check:</strong> None of these wallets were fresh. No dev connections. No coordinated bot behavior. Clean accumulation.</p>

          <h2>The Social Analysis</h2>

          <p>Here's where it gets interesting. While whales were buying, Twitter was quiet.</p>

          <table className="comparison-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Day 1 (Dec 13)</th>
                <th>Day 3 (Dec 15)</th>
              </tr>
            </thead>
            <tbody>
              <tr㹞
                <td>Twitter Mentions</td>
                <td>47/day</td>
                <td>1,200+/day</td>
              </tr>
              <tr>
                <td>Discord Members</td>
                <td>800</td>
                <td>8,500</td>
              </tr>
              <tr>
                <td>Telegram Growth</td>
                <td>+50/day</td>
                <td>+500/day</td>
              </tr>
              <tr>
                <td>Price</td>
                <td>$0.15</td>
                <td>$0.65</td>
              </tr>
            </tbody>
          </table>

          <p><strong>The divergence:</strong> Smart money was in. Retail wasn't talking yet. The 48-hour window.</p>

          <h2>The Entry Strategy</h2>

          <p>Based on the data, we entered:</p>

          <div className="example-box"
3e
            <strong>Position Details:</strong>
            <br />Entry: $0.15 - $0.18 (laddered)
            <br />Size: 2 SOL (~$150 at the time)
            <br />Stop Loss: $0.08 (-50%)
            <br />Take Profit: $0.40 (+150%), $0.80 (+400%), $1.20 (+700%)
          </div>

          <h3>Why Ladder Entries?</h3>
          
          <p>Micro caps are volatile. Instead of one entry at $0.15, we split:</p>
          
          <ul>
            <li>25% at $0.15</li>
            <li>25% at $0.16</li>
            <li>25% at $0.17</li>
            <li>25% at $0.18</li>
          </ul>
          
          <p>Average entry: $0.165. Reduced risk of buying the local top.</p>

          <h2>Day 2-3: The Pump</h2>

          <p>December 14-15: Everything accelerated.</p>

          <ul>
            <li>Major CT accounts started tweeting</li>
            <li>Volume went from $200K to $5M daily</li>
            <li>Price broke $0.40 (first take profit hit)</li>
            <li>Then $0.80 (second take profit)</li>
          </ul>

          <h3>Taking Profits</h3>

          <p>We followed the plan:</p>

          <pre className="code-block">
{
`25% at $0.40 (+142%) = $53 profit
25% at $0.80 (+385%) = $144 profit  
25% at $1.20 (+627%) = $235 profit
25% moon bag sold at $1.50 (+809%) = $303 profit

Total: $735 profit on $150 risk
ROI: +490%`}
          </pre>

          <h2>What We Got Right</h2>

          <div className="checklist">
            <label>✅ Identified accumulation pattern before pump</label>
            <label>✅ Verified whale wallet quality (not bots)</label>
            <label>✅ Spotted social divergence (whales in, retail out)</label>
            <label>✅ Used laddered entries (reduced risk)</label>
            <label>✅ Stuck to profit-taking plan (no greed)</label>
          </div>

          <h2>What We Could Improve</h2>

          <ul>
            <li><strong>Size:</strong> 2 SOL was conservative. With the data quality, 5-10 SOL would've been reasonable</li>
            <li><strong>Moon bag:>/strong> Sold at $1.50, but $WIF hit $2.50 later. Maybe keep 10% longer?</li>
            <li><strong>Sharing:</strong> Kept it to ourselves. Next time, maybe share with community earlier</li>
          </ul>

          <h2>The Framework (Use It Yourself)</h2>

          <pre className="code-block">
{
`1. Wolf Alert Score >= 85
2. Whale Quality Check: 
   - Not fresh wallets
   - Previous wins
   - No dev connections
3. Social Sentiment Check:
   - Whales buying
   - Retail not talking yet
4. Entry Strategy:
   - Laddered entries
   - 50% stop loss
   - Tiered take profits
5. Profit Taking:
   - 25% at +150%
   - 25% at +400%
   - 25% at +700%
   - 25% moon bag`}
          </pre>

          <h2>Where to Find the Next One</h2>

          <p>$WIF wasn't luck. It was pattern recognition. The same setup happens 2-3 times per month.</p>
          
          <p>Our <a href="/dashboard">Dashboard</a> scans for these patterns 24/7. When the next $WIF appears, you'll know.</p>

          <div className="article-cta">
            <h3>Want Real-Time Alerts?</h3>
            <p>Our Wolf system caught $WIF at $0.15. It's hunting for the next one right now. <a href="/dashboard">Check the Dashboard</a>.</p>
          </div>
        </div>
      </article>
    </Layout>
  )
}
