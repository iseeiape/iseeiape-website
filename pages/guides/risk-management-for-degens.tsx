import Layout from '../../components/Layout'
import Head from 'next/head'

export default function RiskManagement() {
  return (
    <Layout 
      title="Risk Management for Degens | iseeiape Guides"
      description="Don't get rekt. Learn position sizing, stop losses, and portfolio management strategies that keep you in the game long-term."
      breadcrumbs={[{ name: 'Guides', path: '/guides' }, { name: 'Risk Management', path: '/guides/risk-management-for-degens' }]}
    >
      <Head>
        <title>Risk Management for Degens | iseeiape Guides</title>
        <meta name="description" content="Don't get rekt. Learn position sizing, stop losses, and portfolio management strategies that keep you in the game long-term." />
      </Head>
      
      <article className="article">
        <header className="article-header">
          <span className="tag">Guide</span>
          <h1>Risk Management for Degens</h1>
          <p className="article-subtitle">How to survive long enough to get lucky</p>
          <div className="article-meta">
            <span>📚 Guide</span>
            <span>⏱️ 8 min read</span>
            <span>🎯 Essential</span>
          </div>
        </header>

        <div className="article-content">
          <h2>The Degen Paradox</h2>
          <p>You want 100x gains but can't handle 50% drawdowns. You ape into memes but panic sell at -20%. You want the lottery ticket without the risk.</p>
          
          <p>Here's the truth: <strong>Every profitable trader has one thing in common - they're still in the game.</strong> Survival comes first, profits second.</p>

          <h2>The 5 Rules That Keep You Alive</h2>

          <h3>1. The 5% Rule</h3>
          
          <p>Never risk more than 5% of your portfolio on a single trade. Period.</p>
          
          <div className="example-box">
            <strong>Example:</strong>
            <br />Portfolio: $10,000
            <br />Max position size: $500
            <br />Even if it goes to zero, you're down 5% not 50%
          </div>

          <h3>2. The Stop Loss Discipline</h3>
          
          <p>Set your stop loss BEFORE you enter. Not after you start losing. Emotions run high when you're underwater.</p>
          
          <ul>
            <li>Day trades: -10% stop</li>
            <li>Swing trades: -20% stop</li>
            <li>Long-term holds: -30% stop (with conviction)</li>
          </ul>

          <p>Pro tip: Use mental stops for micro caps (low liquidity). Hard stops can get hunted.</p>

          <h3>3. The Profit Ladder</h3e
          
          <p>Don't hodl to the top. Sell in chunks:</p>
          
          <ul>
            <li>25% at +50%</li>
            <li>25% at +100%</li>
            <li>25% at +200%</li>
            <li>25% moon bag (let it ride)</li>
          </ul>
          
          <p>This locks in profits while keeping upside exposure.</p>

          <h3>4. The Correlation Check</h3>
          
          <p>Don't have 10 positions that all move together. If everything is Solana memes, you're not diversified - you're concentrated.</p>
          
          <ul>
            <li>Max 30% in one sector</li>
            <li>Mix: Large caps, mid caps, micros</li>
            <li>Cross-chain exposure (ETH, SOL, BASE)</li>
            <li>Stablecoin reserve (20% minimum)</li>
          </ul>

          <h3>5. The Journal Habit</h3>
          
          <p>Every trade gets logged:</p>
          
          <ul>
            <li>Why did you enter?</li>
            <li>What was your thesis?</li>
            <li>Did you follow your rules?</li>
            <li>What did you learn?</li>
          </ul>
          
          <p>Review monthly. Patterns emerge. You'll see you're better at certain setups.</p>

          <h2>Position Sizing Examples</h2>

          <h3>Conservative (50% win rate, 2:1 reward/risk)</h3>
          <ul>
            <li>Large caps: 5% positions</li>
            <li>Mid caps: 3% positions</li>
            <li>Micro caps: 1% positions</li>
          </ul>

          <h3>Aggressive (Proven edge, 60%+ win rate)</h3>
          <ul>
            <li>High conviction: 10% positions</li>
            <li>Medium conviction: 5% positions</li>
            <li>Speculation: 2% positions</li>
          </ul>

          <div className="warning-box">
            <strong>Warning:</strong> Only size up AFTER you've proven profitability over 50+ trades. Most traders should stay conservative.
          </div>

          <h2>When to Break the Rules</h2>

          <p>Sometimes rules are meant to be bent:</p>

          <ul>
            <li><strong>Black swan events:</strong> Flash crashes can be buying opportunities</li>
            <li><strong>Insider info edge:</strong> If you're certain (legally), size up</li>
            <li><strong>Life-changing money:</strong> Sometimes you take the shot</li>
          </ul>

          <p>But 95% of the time, follow the rules. Discipline beats genius.</p>

          <h2>The Rebuild Plan</h2>

          <p>If you get rekt (it happens), here's how to rebuild:</p>

          <ol>
            <li><strong>Stop trading immediately.</strong> Emotional decisions = more losses.</li>
            <li><strong>Analyze what went wrong.</strong> Was it risk management or bad analysis?</li>
            <li><strong>Withdraw remaining funds.</strong> Protect what's left.</li>
            <li><strong>Paper trade for a month.</strong> Prove your edge before risking real money.</li>
            <li><strong>Come back with 10% of previous size.</strong> Rebuild slowly.</li>
          </ol>

          <h2>Remember</h2>

          <p>Crypto is a marathon, not a sprint. The traders who survive 3+ bear markets are the ones who got rich. Not the ones who 100x'd once and gave it all back.</p>

          <blockquote>
            "It's not about how much you make when you're right, it's about how little you lose when you're wrong."
          </blockquote>

          <div className="article-cta">
            <h3>Ready to Trade Smart?</h3>
            <p>Use our <a href="/dashboard">Dashboard</a> to track your positions and set alerts. Stay disciplined, stay profitable.</p>
          </div>
        </div>
      </article>
    </Layout>
  )
}
