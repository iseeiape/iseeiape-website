import Head from 'next/head'
import Layout from '../../components/Layout'

export default function BidOneMinuteWindowWolfData20260809() {
  return (
    <>
      <Head>
        <title>The 1-Minute Window: BID Did 5,151x at $53K. One Minute Later at $339K, It Lost 37%. | iseeiape</title>
        <meta name="description" content="Wolf Pack data case study — 226 alerts over 48h. BID fired twice in the same minute: first alert at $53K mcap did +515,030% (5,151x). Second alert at $339K mcap went -37%. Score 90+ band: 0% win rate, -99% avg. $1M+ mcap: 0% winners. Score 100 extinct Day 6." />
        <meta property="og:title" content="The 1-Minute Window: BID Did 5,151x at $53K. One Minute Later, -37%." />
        <meta property="og:description" content="226 Wolf alerts over 48h. BID fired twice in 1 minute — score 73 at $53K did +515,030%. Score 71 at $339K did -37%. Score 90+ is 0% win. $1M+ mcap is 0% win. Score 100 extinct for 6 days straight." />
      </Head>
      <Layout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#fff', minHeight: '100vh' }}>

          <a href="/insights" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'block' }}>← Back to Insights</a>

          <span style={{ padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px' }}>🆕 Today — Aug 9, 2026</span>

          <h1 style={{ fontSize: '42px', marginTop: '15px', marginBottom: '20px' }}>⏱️ The 1-Minute Window: BID Did 5,151x at $53K. One Minute Later at $339K, It Lost 37%.</h1>

          <p style={{ color: '#888', marginBottom: '40px', fontSize: '18px' }}>
            Day 13 of the Wolf Pack tracking experiment. The most extreme entry-timing divergence we've ever recorded.
            At <strong style={{ color: '#fff' }}>19:15 UTC on August 7</strong>, Wolf fired an alert for
            <strong style={{ color: '#00ff88' }}> BID</strong> — score 73, SYBIL cluster, market cap{' '}
            <strong style={{ color: '#fff' }}>$53,606</strong>. It went on to do{' '}
            <strong style={{ color: '#00ff88' }}>+515,030% at 24h (5,151x)</strong>. One minute later at
            19:16 UTC, Wolf fired a second BID alert — different pair address, score 71, market cap{' '}
            <strong style={{ color: '#fff' }}>$339,737</strong>. That one went{' '}
            <strong style={{ color: '#ff6b6b' }}>-37%</strong>. Same token name, same minute, two completely
            opposite outcomes. The only difference? A 6.3x higher entry market cap on the losing alert.
          </p>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>8 min read</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Data Case Study</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Wolf Pack</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Entry Timing</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>5,151x Print</span>
          </div>

          {/* Dataset Overview */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>📊 The Dataset (Last 48 Hours)</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>
              226 alerts fired across 115 unique tokens with completed 24-hour tracking. Win rate held at{' '}
              <strong style={{ color: '#fff' }}>11.1%</strong> (25/226). Score 100 has now been extinct for{' '}
              <strong style={{ color: '#ff6b6b' }}>six consecutive days</strong> — zero perfect-score alerts
              fired across the entire weekend. The scanner's top activity has shifted to the 70-89 score range,
              which now accounts for 64% of all alerts and 68% of all winners. The average market cap of winners
              ($167K) is <strong style={{ color: '#fff' }}>5.4x lower</strong> than losers ($893K). Cheap entry remains king.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px', marginTop: '25px' }}>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>226</div>
                <div style={{ color: '#888', fontSize: '12px' }}>alerts tracked (48h)</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>5,151x</div>
                <div style={{ color: '#888', fontSize: '12px' }}>BID — biggest print</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>11.1%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>24h win rate (25/226)</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#ff6b6b', fontSize: '28px', fontWeight: 'bold' }}>0</div>
                <div style={{ color: '#888', fontSize: '12px' }}>score 100 alerts (extinct)</div>
              </div>
            </div>
          </div>

          {/* BID 1-Minute Window - Headline Case */}
          <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #00ff8844' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>⏱️ Case Study: BID — The 1-Minute Entry Window</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              This is the most extreme entry-timing case in the experiment's history. Wolf detected BID as a
              brand-new Solana pair and fired two alerts within 60 seconds — but they were for two different
              pair addresses under the same ticker. The first alert caught BID at $53K mcap (early, cheap,
              undiscovered). The second alert caught a different BID pair that had already been pumped to $339K
              mcap — 6.3x more expensive. The outcomes diverged by over half a million percent.
            </p>

            {/* BID comparison table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #222' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: '#666', fontWeight: 'normal' }}>Metric</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', color: '#00ff88' }}>BID Alert #1 ✅</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', color: '#ff6b6b' }}>BID Alert #2 ❌</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Time', '19:15 UTC', '19:16 UTC'],
                    ['Score', '73/100', '71/100'],
                    ['Market Cap', '$53,606', '$339,737'],
                    ['Cluster', 'SYBIL', 'SYBIL'],
                    ['Chain', 'Solana', 'Solana'],
                    ['Alert Type', '🆕 NEW_PAIR', '🆕 NEW_PAIR'],
                    ['Return @ 1h', '+32.7%', '-59.7%'],
                    ['Return @ 4h', '+515,030%', '-78.2%'],
                    ['Return @ 24h', '+515,030% (5,151x)', '-36.8%'],
                  ].map(([metric, v1, v2], i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                      <td style={{ padding: '10px 16px', color: '#888' }}>{metric}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: '#00ff88', fontFamily: 'monospace', fontWeight: 'bold' }}>{v1}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: '#ff6b6b', fontFamily: 'monospace', fontWeight: 'bold' }}>{v2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ color: '#aaa', lineHeight: '1.6', marginTop: '20px' }}>
              The lesson is brutal but clear: in meme-coin land, <strong style={{ color: '#fff' }}>60 seconds
              is the difference between a 5,151x return and a loss</strong>. The first pair was the genuine
              new launch at $53K. The second was either a copycat pair or the same token that had already been
              front-run to $339K. By the time the second alert fired, the sybil coordinators had already
              exited. Score 73 vs score 71 — a 2-point difference — had zero predictive value. Market cap at
              entry was the only thing that mattered.
            </p>
          </div>

          {/* GG Re-Alert Trap */}
          <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>🔁 Case Study: GG — The Re-Alert Death Spiral</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              GG was alerted 5 times in 37 minutes. The first alert at <strong style={{ color: '#fff' }}>08:15
              UTC</strong>, score 84, $80K mcap, SYBIL cluster — went on to do{' '}
              <strong style={{ color: '#00ff88' }}>+475% at 24h</strong>. Every subsequent re-alert was a
              trap:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {[
                ['08:15 UTC', 84, '$80K', '+475%', true],
                ['08:16 UTC', 74, '$151K', '-98%', false],
                ['08:16 UTC', 74, '$151K', '-98%', false],
                ['08:31 UTC', 64, '$38K', '-87%', false],
                ['08:45 UTC', 66, '$216K', '-98%', false],
              ].map((row, i) => (
                <div key={i} style={{ background: '#111', padding: '16px', borderRadius: '10px', border: `1px solid ${row[4] ? '#00ff8833' : '#ff6b6b22'}` }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666', marginBottom: '6px' }}>{row[0]}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'monospace', color: '#fff', fontSize: '13px' }}>Score {row[1]}</span>
                    <span style={{ fontFamily: 'monospace', color: '#888', fontSize: '12px' }}>{row[2]}</span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '16px', color: row[4] ? '#00ff88' : '#ff6b6b', marginTop: '4px' }}>
                    {row[3]}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginTop: '20px' }}>
              The first GG alert was the only one worth trading. The scanner re-alerted 4 more times as the
              token bounced between pairs, each time at a worse entry. Four out of five alerts were negative
              at 24h. <strong style={{ color: '#fff' }}>First entry is the only entry</strong> — this pattern
              has now held for three consecutive sessions.
            </p>
          </div>

          {/* Score Band Analysis */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>📈 Score Band Analysis (24h Returns)</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '25px' }}>
              The score-return inversion continues. Score 90+ went 0/5 — zero winners, averaging -99%. The
              80-89 band was the strongest performer at 19.4% win rate. Score 100 didn't fire at all, marking
              day 6 of total extinction.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {([
                { band: 'Score 100', alerts: 0, winners: 0, avgRet: 0, note: 'Extinct (6 days)' },
                { band: 'Score 90-99', alerts: 5, winners: 0, avgRet: -99.0, note: '0.0% win · -99% avg' },
                { band: 'Score 80-89', alerts: 36, winners: 7, avgRet: -44.6, note: '19.4% win · best tier' },
                { band: 'Score 70-79', alerts: 108, winners: 10, avgRet: 4704.8, note: '9.3% win · BID-driven avg' },
                { band: 'Score 60-69', alerts: 66, winners: 6, avgRet: -66.2, note: '9.1% win' },
                { band: 'Score <60', alerts: 11, winners: 2, avgRet: -54.8, note: '18.2% win (small sample)' },
              ] as const).map((row, i) => {
                const winRate = row.alerts > 0 ? (row.winners / row.alerts * 100).toFixed(1) : '0.0';
                const isDead = row.winners === 0 && row.alerts > 0;
                return (
                  <div key={i} style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', border: `1px solid ${isDead ? '#ff6b6b22' : row.winners > 0 ? '#00ff8822' : '#222'}` }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '8px', fontFamily: 'monospace' }}>{row.band}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#888', fontSize: '13px' }}>Alerts</span>
                      <span style={{ color: '#fff', fontFamily: 'monospace', fontSize: '13px' }}>{row.alerts}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#888', fontSize: '13px' }}>Winners</span>
                      <span style={{ color: row.winners > 0 ? '#00ff88' : '#ff6b6b', fontFamily: 'monospace', fontSize: '13px' }}>{row.winners} ({winRate}%)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#888', fontSize: '13px' }}>Avg Return</span>
                      <span style={{ color: row.avgRet >= 0 ? '#00ff88' : '#ff6b6b', fontFamily: 'monospace', fontSize: '13px' }}>{row.avgRet >= 0 ? '+' : ''}{row.avgRet.toFixed(1)}%</span>
                    </div>
                    <div style={{ color: '#555', fontSize: '11px', fontFamily: 'monospace' }}>{row.note}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mcap Band Analysis */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>💰 Market Cap Bands — The Entry Price Thesis</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '25px' }}>
              The market-cap-at-entry thesis is now the single strongest predictor in the dataset. Every token
              entering at $1M+ mcap went to zero (0/14, avg -97.5%). The sub-$50K band had the most winners
              (13) despite a lower win rate. Winners averaged <strong style={{ color: '#fff' }}>$167K mcap</strong>
              vs losers at <strong style={{ color: '#ff6b6b' }}>$893K</strong> — a 5.4x gap.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              {([
                { band: '< $50K', alerts: 70, winners: 13, avgRet: -41.8 },
                { band: '$50K - $100K', alerts: 48, winners: 5, avgRet: 10669.7 },
                { band: '$100K - $500K', alerts: 77, winners: 3, avgRet: -76.1 },
                { band: '$500K - $1M', alerts: 17, winners: 4, avgRet: -56.1 },
                { band: '$1M+', alerts: 14, winners: 0, avgRet: -97.5 },
              ] as const).map((row, i) => {
                const winRate = (row.winners / row.alerts * 100).toFixed(1);
                return (
                  <div key={i} style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '12px' }}>{row.band}</div>
                    <div style={{ color: row.winners > 0 ? '#00ff88' : '#ff6b6b', fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                      {winRate}%
                    </div>
                    <div style={{ color: '#888', fontSize: '11px', marginTop: '4px' }}>{row.winners}/{row.alerts} winners</div>
                    <div style={{ color: row.avgRet >= 0 ? '#00ff88' : '#ff6b6b', fontSize: '12px', marginTop: '4px', fontFamily: 'monospace' }}>
                      avg {row.avgRet >= 0 ? '+' : ''}{row.avgRet.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MRPOM - 11 alert disaster */}
          <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #ff6b6b22' }}>
            <h2 style={{ color: '#ff6b6b', marginBottom: '15px' }}>💀 Case Study: MRPOM — 11 Alerts, 11 Corpses</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>
              MRPOM holds the record for most re-alerts this session: <strong style={{ color: '#fff' }}>11
              alerts</strong> over 48 hours, averaging score 81 and $2.9M mcap. Every single one went to
              <strong style={{ color: '#ff6b6b' }}> -98% to -100%</strong>. This is the textbook example of a
              token that looks high-quality on paper (high score, big mcap, multiple signal triggers) but is
              a coordinated exit. The scanner kept re-detecting it because volume stayed elevated — but that
              volume was sellers, not buyers. <strong style={{ color: '#fff' }}>High score + high mcap = the
              most dangerous combination in the dataset.</strong>
            </p>
          </div>

          {/* Key Takeaways */}
          <div style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '16px', padding: '30px', marginBottom: '40px' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>🎯 Key Takeaways</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              {[
                ['⏱️ First minute or nothing', 'BID proved that 60 seconds separates a 5,151x win from a -37% loss. If you\'re not in on the first alert, you\'re probably the exit liquidity.'],
                ['💰 Sub-$100K mcap is the green zone', 'The $50K-$100K band averaged +10,670% returns (BID and GG drove this). Tokens above $1M mcap had a 0% win rate for the third session running.'],
                ['🚫 Score 90+ is a death signal', '5 alerts, 0 winners, -99% average. Score 100 has been extinct for 6 straight days. The scanner\'s highest-confidence calls are now its worst performers.'],
                ['🔁 Re-alerts are traps', 'GG\'s first alert was +475%. The next four were all -87% to -98%. MRPOM fired 11 times — every one dead. First entry is the only entry.'],
                ['📊 SYBIL > NONE', 'SYBIL-cluster alerts had an 11.7% win rate and positive average returns (BID-driven). Unclassified alerts had 9.9% win rate and -66% average. Coordination signals still matter — but only on the first alert.'],
              ].map(([title, desc], i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '24px' }}>{title.split(' ')[0]}</div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{title.split(' ').slice(1).join(' ')}</div>
                    <div style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wolf CTA */}
          <div style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '12px', padding: '24px', marginBottom: '40px' }}>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00ff88', marginBottom: '8px' }}>🐺 Wolf Alert System</div>
            <p style={{ color: '#888', fontSize: '14px', margin: '0 0 16px' }}>226 tokens tracked over 48 hours. Real-time Solana & Base alpha signals. Running 24/7. 5,151x peak return this session.</p>
            <a href="/tokens" style={{ background: '#00ff88', color: '#000', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'monospace' }}>Open Token Scanner →</a>
          </div>

          <div style={{ paddingTop: '24px', borderTop: '1px solid #111', color: '#333', fontSize: '12px', fontFamily: 'monospace' }}>
            <a href="/" style={{ color: '#444', textDecoration: 'none' }}>iseeiape.com</a> · Data from Wolf Pack tracking experiment, Days 12-13 (Aug 7-9, 2026). Not financial advice. DYOR. 🦎
          </div>
        </div>
      </Layout>
    </>
  )
}
