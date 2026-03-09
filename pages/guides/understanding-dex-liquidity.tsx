import Layout from '../../components/Layout'
import Head from 'next/head'

export default function UnderstandingLiquidity() {
  return (
    <Layout 
      title="Understanding DEX Liquidity | iseeiape Guides"
      description="Master liquidity analysis. Learn how to spot rug pulls, identify safe entry points, and avoid getting stuck in illiquid positions."
      breadcrumbs={[{ name: 'Guides', path: '/guides' }, { name: 'DEX Liquidity', path: '/guides/understanding-dex-liquidity' }]}
    >
      <Head>
        <title>Understanding DEX Liquidity | iseeiape Guides</title>
        <meta name="description" content="Master liquidity analysis. Learn how to spot rug pulls, identify safe entry points, and avoid getting stuck in illiquid positions." />
      </Head>
      
      <article className="article">
        <header className="article-header">
          <span className="tag">Guide</span>
          <h1>Understanding DEX Liquidity</h1>
          <p className="article-subtitle">Don't get stuck. Don't get rugged. Read the pool.</p>
          <div className="article-meta">
            <span>📚 Guide</span>
            <span>⏱️ 10 min read</span>
            <span>🎯 Essential</span>
          </div>
        </header>

        <div className="article-content">
          <h2>What is Liquidity?</h2>
          
          <p>Liquidity is how easily you can buy or sell without affecting the price.</p>
          
          <ul>
            <li><strong>High liquidity ($1M+):</strong> Buy $10K, price barely moves</li>
            <li><strong>Low liquidity ($50K):</strong> Buy $1K, price jumps 20%</li>
            <li><strong>No liquidity:</strong> You can't sell. You're stuck.</li>
          </ul>

          <h2>Why Liquidity Matters</h2>

          <h3>For Entry (Buying)</h3>
          <p>Low liquidity = high slippage. You think you're buying at $0.01, but you actually pay $0.012 (20% higher).</p>

          <h3>For Exit (Selling)</h3>
          <p>Low liquidity = can't exit. You have $5K in profits on paper, but selling crashes the price to zero. You're trapped.</p>

          <h3>For Price Action</h3>
          <p>Low liquidity = volatile. Small buys pump 50%. Small dumps crash 80%. Hard to predict, dangerous to trade.</p>

          <h2>Reading Liquidity Metrics</h2>

          <h3>Total Liquidity (TVL)</h3>
          
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Liquidity</th>
                <th>Risk Level</th>
                <th>Safe Position Size</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><$10K</td>
                <td className="high-risk">🔴 Extreme</td>
                <td><$100</td>
              </tr>
              <tr>
                <td>$10K - $50K</td>
                <td className="medium-risk">🟠 High</td>
                <td><$500</td>
              </tr>
              <tr>
                <td>$50K - $200K</td>
                <td className="moderate-risk">🟡 Medium</td>
                <td><$2K</td>
              </tr>
              <tr>
                <td>$200K - $1M</td>
                <td className="low-risk">🟢 Low</td>
                <td><$10K</td>
              </tr>
              <tr>
                <td>>$1M</td>
                <td className="safe">✅ Safe</td>
                <td><$50K</td>
              </tr>
            </tbody>
          </table>

          <h3>Liquidity to Market Cap Ratio</h3>
          
          <p>Healthy ratio: Liquidity should be 10-30% of market cap</p>
          
          <div className="example-box">
            <strong>Good:</strong> $1M market cap / $200K liquidity = 20% ✅
            <br />
            <strong>Bad:</strong> $10M market cap / $50K liquidity = 0.5% 🔴 (Rug risk!)
          </div>

          <h3>24h Volume vs Liquidity</h3>
          
          <p>Volume should be 10-50% of liquidity daily. Higher = active trading, easier exits.</p>

          <h2>Spotting Rug Pulls</h2>

          <h3>🚩 Red Flag #1: Low Liquidity, High Market Cap</h3>
          <p>Market cap shows $50M but liquidity is only $100K. 99.8% of "value" is fake. One sell crashes it.</p>

          <h3>🚩 Red Flag #2: Locked Liquidity... But Not Really</h3>
          <p>"Liquidity locked for 1 year" - check the lock. Sometimes it's:</p>
          <ul>
            <li>Locked in dev's own contract (they control it)</li>
            <li>Locked for 7 days not 1 year</li>
            <li>Fake lock transaction</li>
          </ul>

          <h3>🚩 Red Flag #3: Concentrated Liquidity</h3>
          <p>80%+ of LP tokens held by 1-2 wallets. They can drain the pool instantly.</p>

          <h3>🚩 Red Flag #4: No LP Token Burn</h3>
          <p>Legit projects burn LP tokens (send to dead address). If dev keeps LP tokens, they can rug.</p>

          <h2>Safe Entry Checklist</h2>

          <p>Before buying any token:</p>

          <div className="checklist">
            <label>
              <input type="checkbox" /> Liquidity >$50K (micro cap) or >$200K (small cap)
            </label>
            <label>
              <input type="checkbox" /> Liquidity/MC ratio >10%
            </label>
            <label>
              <input type="checkbox" /> 24h volume >10% of liquidity
            </label>
            <label>
              <input type="checkbox" /> LP tokens burned or locked (verify!)
            </label>
            <label>
              <input type="checkbox" /> No single wallet holds >50% of LP
            </label>
            <label>
              <input type="checkbox" /> Test sell: Can you exit without 20%+ slippage?
            </label>
          </div>

          <h2>Tools for Liquidity Analysis</h2>

          <h3>Free Tools</h3>
          <ul>
            <li><strong>DexScreener:</strong> Liquidity, volume, holders at a glance</li>
            <li><strong>Solscan:</strong> Deep dive into LP tokens and holders</li>
            <li><strong>RugCheck.xyz:</strong> Quick risk assessment</li>
          </ul>

          <h3>What to Check</h3>
          
          <ol>
            <li>Go to DexScreener, search token</li>
            <li>Click "Liquidity" tab</li>
            <li>Check total locked/burned LP %</li>
            <li>Verify lock duration on locker (Uncx, Mudra, etc.)</li>
            <li>Check top LP holders</li>
          </ol>

          <h2>Real Examples</h2>

          <h3>✅ Good Liquidity: $PEPE (Early Days)</h3>
          <ul>
            <li>Market Cap: $50M</li>
            <li>Liquidity: $8M (16% ratio)</li>
            <li>Volume: $15M/day (high activity)</li>
            <li>LP burned by community</li>
          </ul>

          <h3>🔴 Bad Liquidity: RugPullToken69</h3>
          
          <ul>
            <li>Market Cap: $5M (fake)</li>
            <li>Liquidity: $15K (0.3% ratio)</li>
            <li>Volume: $2K/day (fake wash trades)</li>
            <li>Dev holds 90% of LP</li>
          </ul>

          <h2>Your Action Plan</h2>

          <p>This week:</p>

          <ol>
            <li>Pick 5 tokens you're watching</li>
            <li>Check their liquidity on DexScreener</li>
            <li>Calculate liquidity/MC ratio</li>
            <li>Verify LP lock status</li>
            <li>Grade each: Safe / Caution / Danger</li>
          </ol>

          <div className="article-cta">
            <h3>Want Live Data?</h3>
            <p>Our <a href="/dashboard">Dashboard</a> shows liquidity metrics for every Wolf Alert. Never trade blind again.</p>
          </div>
        </div>
      </article>
    </Layout>
  )
}
