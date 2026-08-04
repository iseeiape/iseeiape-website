import Head from 'next/head'
import Layout from '../../components/Layout'

export default function InvertedScoreWolfData20260804() {
  return (
    <>
      <Head>
        <title>The Inverted Score: Score 94 Rugged 99.8%, Score 69 Did 1,488% | iseeiape</title>
        <meta name="description" content="Wolf Pack data case study — 566 alerts over 48h. Score 90+ went 0/2 at 24h. The biggest winner scored 69. Score is now inversely correlated with survival." />
        <meta property="og:title" content="The Inverted Score: High Scores Kill, Mid-Scores Pay" />
        <meta property="og:description" content="566 Wolf alerts over 48h. Score 90+: 0% win rate. Score 69 GOOGLE: +1,488%. The signal has inverted." />
      </Head>
      <Layout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#fff', minHeight: '100vh' }}>

          <a href="/insights" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'block' }}>← Back to Insights</a>

          <span style={{ padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px' }}>🆕 Today — Aug 4, 2026</span>

          <h1 style={{ fontSize: '42px', marginTop: '15px', marginBottom: '20px' }}>📉 The Inverted Score: Score 94 Rugged 99.8%. Score 69 Did +1,488%.</h1>

          <p style={{ color: '#888', marginBottom: '40px', fontSize: '18px' }}>
            Day 8 of the Wolf Pack tracking experiment. The score-return correlation has officially inverted.
            Over the last 48 hours, <strong style={{ color: '#fff' }}>566 alerts</strong> fired across{' '}
            <strong style={{ color: '#fff' }}>274 unique tokens</strong>. Every single score-90+ alert with completed
            24h tracking went to zero — <strong style={{ color: '#ff6b6b' }}>0 for 2, average -99.9%</strong>.
            Meanwhile, the biggest winner in the dataset scored just <strong style={{ color: '#00ff88' }}>69/100</strong>{' '}
            and returned <strong style={{ color: '#00ff88' }}>+1,488% at 24h</strong>. The mid-score band (80-89)
            was the only profitable tier with a <strong style={{ color: '#00ff88' }}>22.6% win rate</strong>. Score is
            no longer a quality signal. It's a <strong style={{ color: '#ff6b6b' }}>danger signal</strong>.
          </p>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>7 min read</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Data Case Study</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Wolf Pack</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Score Inversion</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Solana</span>
          </div>

          {/* Dataset Overview */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>📊 The Dataset (Last 48 Hours)</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>
              566 alerts fired across 274 unique tokens. 192 have completed their 24-hour return tracking.
              Zero score-100 alerts fired — the second consecutive day of extinction. The highest score in this
              window was 94, and every one of them rugged.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px', marginTop: '25px' }}>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>566</div>
                <div style={{ color: '#888', fontSize: '12px' }}>alerts fired (48h)</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>274</div>
                <div style={{ color: '#888', fontSize: '12px' }}>unique tokens</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>14.6%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>24h win rate (28/192)</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#ff6b6b', fontSize: '28px', fontWeight: 'bold' }}>0</div>
                <div style={{ color: '#888', fontSize: '12px' }}>score-100 alerts (extinct)</div>
              </div>
            </div>
          </div>

          {/* The Inversion */}
          <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #ff6b6b44' }}>
            <h2 style={{ color: '#ff6b6b', marginBottom: '20px' }}>🔴 Score Inversion Confirmed</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              The 8-day experiment has produced a clear and unsettling pattern: higher scores now correlate with{' '}
              <em>worse</em> outcomes. Here's the score-band breakdown for the last 48 hours:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
              <div style={{ background: '#1a0505', padding: '20px', borderRadius: '10px', border: '1px solid #ff6b6b33' }}>
                <div style={{ color: '#ff6b6b', fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>90-94</div>
                <div style={{ color: '#ff6b6b', fontSize: '16px', fontFamily: 'monospace', marginTop: '5px' }}>0% win rate</div>
                <div style={{ color: '#888', fontSize: '13px', marginTop: '5px' }}>2 alerts tracked · avg -99.9%</div>
                <div style={{ color: '#666', fontSize: '11px', marginTop: '8px' }}>TNOS -99.8% · SAOF -99.9%</div>
              </div>
              <div style={{ background: '#0a1a05', padding: '20px', borderRadius: '10px', border: '1px solid #00ff8833' }}>
                <div style={{ color: '#00ff88', fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>80-89</div>
                <div style={{ color: '#00ff88', fontSize: '16px', fontFamily: 'monospace', marginTop: '5px' }}>22.6% win rate</div>
                <div style={{ color: '#888', fontSize: '13px', marginTop: '5px' }}>31 alerts tracked · avg -39.8%</div>
                <div style={{ color: '#666', fontSize: '11px', marginTop: '8px' }}>Best performing tier</div>
              </div>
              <div style={{ background: '#1a1a05', padding: '20px', borderRadius: '10px', border: '1px solid #ffaa0033' }}>
                <div style={{ color: '#ffaa00', fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>70-79</div>
                <div style={{ color: '#ffaa00', fontSize: '16px', fontFamily: 'monospace', marginTop: '5px' }}>13.2% win rate</div>
                <div style={{ color: '#888', fontSize: '13px', marginTop: '5px' }}>159 alerts tracked · avg -51.1%</div>
                <div style={{ color: '#666', fontSize: '11px', marginTop: '8px' }}>Bulk of alerts, mediocre returns</div>
              </div>
            </div>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginTop: '20px' }}>
              The 80-89 band is now the sweet spot — high enough to signal real on-chain activity, low enough to
              avoid the "perfect score = pumped for exit" trap. The 90+ tier has been a consistent death sentence
              since Day 5.
            </p>
          </div>

          {/* GOOGLE Case Study */}
          <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #00ff8844' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>🏆 Case Study: GOOGLE — Score 69, Return +1,488%</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              The biggest winner in this 48-hour window didn't crack the top 25 by score. GOOGLE entered the Wolf
              radar at score <strong style={{ color: '#fff' }}>69/100</strong> and proceeded to print{' '}
              <strong style={{ color: '#00ff88' }}>+1,488% at 24h</strong> — outperforming every score-90+ token by
              a factor of infinity (since they all went to zero).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <div style={{ background: '#111', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>69</div>
                <div style={{ color: '#888', fontSize: '11px' }}>Wolf Score</div>
              </div>
              <div style={{ background: '#111', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>+1,488%</div>
                <div style={{ color: '#888', fontSize: '11px' }}>24h return</div>
              </div>
              <div style={{ background: '#111', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>SYBIL</div>
                <div style={{ color: '#888', fontSize: '11px' }}>Cluster verdict</div>
              </div>
            </div>
            <p style={{ color: '#888', lineHeight: '1.6', marginTop: '20px', fontSize: '14px' }}>
              This is the same pattern we saw with PETE (score 88, 14,447x on Day 7) and FRANK (score 77, 1,809% on
              Day 6). The winners live in the 66-88 score range. They have coordinated buyers (SYBIL cluster) but
              haven't triggered enough Wolf signals to hit 90+. That "imperfection" is exactly why they survive —
              the exit liquidity hasn't been primed yet.
            </p>
          </div>

          {/* The Score-94 Rug Gallery */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#ff6b6b', marginBottom: '20px' }}>💀 The Score-94 Graveyard</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              The two highest-scoring tokens with completed 24h tracking. Both SYBIL cluster. Both annihilated.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
              <div style={{ background: '#1a0505', padding: '20px', borderRadius: '12px', border: '1px solid #ff6b6b33' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>$TNOS</span>
                  <span style={{ background: '#ff6b6b22', color: '#ff6b6b', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>SYBIL</span>
                </div>
                <div style={{ color: '#888', fontSize: '13px' }}>Score: <strong style={{ color: '#fff' }}>94</strong> · Mcap: <strong style={{ color: '#fff' }}>$905K</strong></div>
                <div style={{ marginTop: '10px', fontSize: '14px', fontFamily: 'monospace' }}>
                  <span style={{ color: '#00ff88' }}>1h: +7.0%</span>
                  <span style={{ color: '#00ff88', marginLeft: '15px' }}>4h: +14.9%</span>
                </div>
                <div style={{ marginTop: '5px', fontSize: '18px', fontFamily: 'monospace', color: '#ff6b6b', fontWeight: 'bold' }}>24h: -99.8%</div>
                <div style={{ color: '#555', fontSize: '12px', marginTop: '8px' }}>Classic pump-and-dump: green at 1h and 4h, then full rug.</div>
              </div>
              <div style={{ background: '#1a0505', padding: '20px', borderRadius: '12px', border: '1px solid #ff6b6b33' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>$SAOF</span>
                  <span style={{ background: '#ff6b6b22', color: '#ff6b6b', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>SYBIL</span>
                </div>
                <div style={{ color: '#888', fontSize: '13px' }}>Score: <strong style={{ color: '#fff' }}>94</strong> · Mcap: <strong style={{ color: '#fff' }}>$1.62M</strong></div>
                <div style={{ marginTop: '10px', fontSize: '14px', fontFamily: 'monospace' }}>
                  <span style={{ color: '#00ff88' }}>1h: +6.9%</span>
                  <span style={{ color: '#ff6b6b', marginLeft: '15px' }}>4h: -99.9%</span>
                </div>
                <div style={{ marginTop: '5px', fontSize: '18px', fontFamily: 'monospace', color: '#ff6b6b', fontWeight: 'bold' }}>24h: -99.9%</div>
                <div style={{ color: '#555', fontSize: '12px', marginTop: '8px' }}>Faster rug — barely survived 1 hour before the dump.</div>
              </div>
            </div>
          </div>

          {/* Top 5 Winners */}
          <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>🟢 Top 5 Survivors (24h Return)</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #333' }}>
                    <th style={{ textAlign: 'left', padding: '10px 15px', color: '#888', fontSize: '12px' }}>TOKEN</th>
                    <th style={{ textAlign: 'center', padding: '10px 15px', color: '#888', fontSize: '12px' }}>SCORE</th>
                    <th style={{ textAlign: 'center', padding: '10px 15px', color: '#888', fontSize: '12px' }}>CLUSTER</th>
                    <th style={{ textAlign: 'right', padding: '10px 15px', color: '#888', fontSize: '12px' }}>24H RETURN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <td style={{ padding: '12px 15px', color: '#00ff88', fontWeight: 'bold' }}>$GOOGLE</td>
                    <td style={{ padding: '12px 15px', textAlign: 'center', color: '#fff' }}>69</td>
                    <td style={{ padding: '12px 15px', textAlign: 'center', color: '#888' }}>—</td>
                    <td style={{ padding: '12px 15px', textAlign: 'right', color: '#00ff88', fontWeight: 'bold' }}>+1,488%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <td style={{ padding: '12px 15px', color: '#00ff88', fontWeight: 'bold' }}>$PT</td>
                    <td style={{ padding: '12px 15px', textAlign: 'center', color: '#fff' }}>80</td>
                    <td style={{ padding: '12px 15px', textAlign: 'center', color: '#888' }}>SYBIL</td>
                    <td style={{ padding: '12px 15px', textAlign: 'right', color: '#00ff88', fontWeight: 'bold' }}>+608%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <td style={{ padding: '12px 15px', color: '#00ff88', fontWeight: 'bold' }}>$OFFICIAL</td>
                    <td style={{ padding: '12px 15px', textAlign: 'center', color: '#fff' }}>76</td>
                    <td style={{ padding: '12px 15px', textAlign: 'center', color: '#888' }}>SYBIL</td>
                    <td style={{ padding: '12px 15px', textAlign: 'right', color: '#00ff88', fontWeight: 'bold' }}>+251%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <td style={{ padding: '12px 15px', color: '#00ff88', fontWeight: 'bold' }}>$PIZZA</td>
                    <td style={{ padding: '12px 15px', textAlign: 'center', color: '#fff' }}>66</td>
                    <td style={{ padding: '12px 15px', textAlign: 'center', color: '#888' }}>—</td>
                    <td style={{ padding: '12px 15px', textAlign: 'right', color: '#00ff88', fontWeight: 'bold' }}>+228%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 15px', color: '#00ff88', fontWeight: 'bold' }}>$NOCK</td>
                    <td style={{ padding: '12px 15px', textAlign: 'center', color: '#fff' }}>76</td>
                    <td style={{ padding: '12px 15px', textAlign: 'center', color: '#888' }}>SYBIL</td>
                    <td style={{ padding: '12px 15px', textAlign: 'right', color: '#00ff88', fontWeight: 'bold' }}>+211%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ color: '#666', fontSize: '12px', marginTop: '15px' }}>
              Average score of top 5 winners: <strong style={{ color: '#fff' }}>73.4</strong>. Not a single one above 80.
            </p>
          </div>

          {/* The Multi-Alert Trap */}
          <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#ffaa00', marginBottom: '20px' }}>⚠️ The Multi-Alert Trap</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              MEME was alerted <strong style={{ color: '#fff' }}>11 times</strong> in 48 hours. CAP was alerted 11
              times. ELONCOIN 10 times. These are tokens the scanner keeps re-flagging as the price drops — each
              re-alert is a worse entry than the last. The re-alert pattern is a confirmation that the token is
              bleeding, not that it's "still a good play."
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ background: '#111', padding: '16px', borderRadius: '10px' }}>
                <div style={{ color: '#ffaa00', fontFamily: 'monospace', fontWeight: 'bold' }}>$MEME</div>
                <div style={{ color: '#888', fontSize: '13px' }}>11 alerts · scores 60-83 · $90K avg mcap</div>
              </div>
              <div style={{ background: '#111', padding: '16px', borderRadius: '10px' }}>
                <div style={{ color: '#ffaa00', fontFamily: 'monospace', fontWeight: 'bold' }}>$CAP</div>
                <div style={{ color: '#888', fontSize: '13px' }}>11 alerts · scores 75-84 · $10K avg mcap</div>
              </div>
              <div style={{ background: '#111', padding: '16px', borderRadius: '10px' }}>
                <div style={{ color: '#ffaa00', fontFamily: 'monospace', fontWeight: 'bold' }}>$ELONCOIN</div>
                <div style={{ color: '#888', fontSize: '13px' }}>10 alerts · scores 64-87 · $209K avg mcap</div>
              </div>
              <div style={{ background: '#111', padding: '16px', borderRadius: '10px' }}>
                <div style={{ color: '#ffaa00', fontFamily: 'monospace', fontWeight: 'bold' }}>$JORDAN</div>
                <div style={{ color: '#888', fontSize: '13px' }}>8 alerts · scores 51-73 · $1.06M avg mcap</div>
              </div>
            </div>
          </div>

          {/* Key Takeaway */}
          <div style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '16px', padding: '30px', marginBottom: '40px' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>🧠 The Trading Edge</h2>
            <p style={{ color: '#aaa', lineHeight: '1.7' }}>
              After 8 days and 5,000+ tracked alerts, the pattern is clear:
            </p>
            <ul style={{ color: '#aaa', lineHeight: '2', marginTop: '15px', paddingLeft: '20px' }}>
              <li><strong style={{ color: '#ff6b6b' }}>Score 90+ = exit liquidity.</strong> Someone pumped it enough to trigger every signal. You're the exit.</li>
              <li><strong style={{ color: '#00ff88' }}>Score 66-85 with SYBIL cluster = the alpha zone.</strong> Coordinated buyers haven't finished accumulating yet.</li>
              <li><strong style={{ color: '#ffaa00' }}>3+ re-alerts = bleeding out.</strong> The scanner re-flags because price dropped, making ratios "look good" again. It's a trap.</li>
              <li><strong style={{ color: '#fff' }}>Score 100 is extinct.</strong> Two days running with zero perfect-score alerts. The market has adapted.</li>
            </ul>
            <p style={{ color: '#888', fontSize: '14px', marginTop: '20px' }}>
              The Wolf Pack scanner is being recalibrated to weight these inversions. Until then, trade the 80-89
              SYBIL band and treat anything above 90 as a sell signal.
            </p>
          </div>

          {/* Footer */}
          <div style={{ paddingTop: '24px', borderTop: '1px solid #111', color: '#333', fontSize: '12px', fontFamily: 'monospace' }}>
            <a href="/" style={{ color: '#444', textDecoration: 'none' }}>iseeiape.com</a> · Not financial advice. DYOR. 🦎
          </div>

        </div>
      </Layout>
    </>
  )
}
