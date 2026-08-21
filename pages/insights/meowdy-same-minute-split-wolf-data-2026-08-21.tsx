import Head from 'next/head'
import Layout from '../../components/Layout'

export default function MeowdySameMinuteSplitWolfData20260821() {
  return (
    <>
      <Head>
        <title>The Same-Minute Split: MEOWDY Did 12x From $11K. The Same Ticker at $112K Lost 39%. | iseeiape</title>
        <meta name="description" content="Wolf Pack data case study — 575 alerts over 48h (Aug 19-21). MEOWDY fired two alerts in the same minute on two different mints: $11K entry did +1,172%, $112K entry did -39%. The kill filter ate HORNS (+824%), SPYC (+778%), and PSYCHOSIS (+661%) — the session's top delivered prints. Sub-$50K was the only positive mcap band (25.6% WR). Score 90+ went 0/13. Score 100 extinct 23 days." />
        <meta property="og:title" content="The Same-Minute Split: MEOWDY Did 12x From $11K. Same Ticker at $112K Lost 39%." />
        <meta property="og:description" content="575 Wolf alerts, 48h. MEOWDY: same minute, two mints — $11K won +1,172%, $112K died -39%. Kill filter ate top 3 prints (HORNS +824%, SPYC +778%, PSYCHOSIS +661%). Sub-$50K only positive band. Score 90+: 0/13." />
      </Head>
      <Layout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#fff', minHeight: '100vh' }}>

          <a href="/insights" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'block' }}>← Back to Insights</a>

          <span style={{ padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px' }}>🆕 Today — Aug 21, 2026</span>

          <h1 style={{ fontSize: '42px', marginTop: '15px', marginBottom: '20px' }}>⚡ The Same-Minute Split: MEOWDY Did 12x From $11K. The Same Ticker at $112K Lost 39%.</h1>

          <p style={{ color: '#888', marginBottom: '40px', fontSize: '18px' }}>
            Day 24 of the Wolf Pack tracking experiment. 575 alerts fired across the last 48 hours,
            234 completed 24-hour tracking, and the win rate sat at{' '}
            <strong style={{ color: '#00ff88' }}>9.4%</strong> (22/234) — another dead session
            on paper. But the headline is the cleanest identity split in 24 days of data:{' '}
            <strong style={{ color: '#fff' }}>MEOWDY</strong> fired two alerts in the{' '}
            <strong style={{ color: '#fff' }}>exact same minute</strong> on{' '}
            <strong style={{ color: '#fff' }}>two different contract mints</strong>. The fresh mint
            at <strong style={{ color: '#00ff88' }}>$11K mcap</strong> did{' '}
            <strong style={{ color: '#00ff88' }}>+1,172%</strong> (12x). The older mint at{' '}
            <strong style={{ color: '#ff6b6b' }}>$112K mcap</strong> did{' '}
            <strong style={{ color: '#ff6b6b' }}>-39%</strong>. Same ticker. Same scanner. Same
            minute. The only variable was entry mcap — and the gap was 10x. Meanwhile, the kill
            filter ate the session&apos;s top 3 delivered prints:{' '}
            <strong style={{ color: '#ff6b6b' }}>HORNS (+824%), SPYC (+778%), PSYCHOSIS (+661%)</strong> —
            all SYBIL, all cluster_killed, all would have been the biggest winners of the day.
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>8 min read</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Data Case Study</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Wolf Pack</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Identity Split</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Kill Filter</span>
          </div>

          {/* Dataset Overview */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>📊 The Dataset (Last 48 Hours)</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>
              575 alerts across <strong style={{ color: '#fff' }}>351 unique contract mints</strong> and{' '}
              <strong style={{ color: '#fff' }}>303 unique tickers</strong> — a 16% ticker-recycling
              rate (351 mints vs 303 tickers). The suppression filter killed{' '}
              <strong style={{ color: '#ff6b6b' }}>58% of all alerts</strong> (341/575), continuing
              the aggressive tightening trend. Of 234 alerts with full 24h tracking, 22 were green —
              a <strong style={{ color: '#00ff88' }}>9.4% win rate</strong>. The median 24h return
              was <strong style={{ color: '#ff6b6b' }}>-97.7%</strong>; 63.7% of alerts ended below
              -90%. Winners averaged{' '}
              <strong style={{ color: '#00ff88' }}>$87K mcap</strong> at entry; losers averaged{' '}
              <strong style={{ color: '#ff6b6b' }}>$418K</strong> — a 4.8x gap. Score 100 was absent
              for the <strong style={{ color: '#fff' }}>23rd consecutive day</strong> (all-time: 2/171).
              ORGANIC and BUNDLE clusters were both absent — only SYBIL (396 alerts) and unclassified
              (179 alerts) appeared in the 48h window.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px', marginTop: '25px' }}>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>575</div>
                <div style={{ color: '#888', fontSize: '12px' }}>total alerts (48h)</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>9.4%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>24h win rate (22/234)</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#ff6b6b', fontSize: '28px', fontWeight: 'bold' }}>58%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>alerts suppressed (341/575)</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>+1,172%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>best delivered print (MEOWDY)</div>
              </div>
            </div>
          </div>

          {/* MEOWDY Case Study */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #00ff88' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>🐱 The MEOWDY Same-Minute Split: $11K Won 12x. $112K Lost 39%.</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              At 05:15 EET on August 20, the scanner fired two MEOWDY alerts in the same minute. They
              were not the same token. Mint #1 (5s6w...N5wR) was a fresh contract at{' '}
              <strong style={{ color: '#00ff88' }}>$11K mcap</strong>, score 69, unclassified — it
              did <strong style={{ color: '#00ff88' }}>+1,172% at 24h</strong> (12x). Mint #2
              (9SXP...pump) was an older contract at{' '}
              <strong style={{ color: '#ff6b6b' }}>$112K mcap</strong>, score 74, SYBIL-tagged and
              killed — it did <strong style={{ color: '#ff6b6b' }}>-39% at 24h</strong>. Same ticker.
              Same minute. Same scanner. The only variable was which contract you bought — and the
              10x mcap gap between them decided everything.
            </p>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              The old mint then re-alerted 4 more times over the next hour ($95K–$121K mcap), each
              time with a lower score, each time losing more. The fresh mint never alerted again —
              it pumped and was gone. This is the <a href="/insights/elon-identity-split-wolf-data-2026-08-07" style={{ color: '#00ff88' }}>ELON split</a> from
              Day 14 and the <a href="/insights/unitree-identity-split-wolf-data-2026-08-16" style={{ color: '#00ff88' }}>UNITREE split</a> from
              Day 19, but cleaner: both mints fired in the <em>same minute</em>, eliminating any
              time-of-entry variable. The entire outcome was determined by mcap at entry.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #00ff88' }}>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#00ff88' }}>Time (EET)</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#00ff88' }}>Mint</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#00ff88' }}>Score</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#00ff88' }}>Mcap</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#00ff88' }}>1H</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#00ff88' }}>4H</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#00ff88' }}>24H</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#00ff88' }}>Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { time: 'Aug 20 05:15', mint: '#1 (fresh)', score: 69, mcap: '$11K', r1h: 763, r4h: 1172, r24h: 1172, verdict: 'newpairs', status: 'active' },
                    { time: 'Aug 20 05:15', mint: '#2 (old)', score: 74, mcap: '$112K', r1h: 40, r4h: -33, r24h: -39, verdict: 'SYBIL → killed', status: 'cluster_killed' },
                    { time: 'Aug 20 05:30', mint: '#2 (old)', score: 64, mcap: '$103K', r1h: 80, r4h: -27, r24h: -33, verdict: 'newpairs', status: 'active' },
                    { time: 'Aug 20 05:45', mint: '#2 (old)', score: 69, mcap: '$106K', r1h: -12, r4h: -31, r24h: -19, verdict: 'newpairs', status: 'active' },
                    { time: 'Aug 20 06:00', mint: '#2 (old)', score: 69, mcap: '$94K', r1h: -10, r4h: -2, r24h: -8, verdict: 'newpairs', status: 'active' },
                    { time: 'Aug 20 06:15', mint: '#2 (old)', score: 60, mcap: '$121K', r1h: -31, r4h: -25, r24h: -30, verdict: 'newpairs', status: 'active' },
                  ] as const).map((row) => (
                    <tr key={row.time + row.mint} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '10px', color: '#aaa' }}>{row.time}</td>
                      <td style={{ padding: '10px', color: row.mint.includes('fresh') ? '#00ff88' : '#ff6b6b' }}>{row.mint}</td>
                      <td style={{ padding: '10px', color: '#fff' }}>{row.score}</td>
                      <td style={{ padding: '10px', color: row.mcap === '$11K' ? '#00ff88' : '#ff6b6b' }}>{row.mcap}</td>
                      <td style={{ padding: '10px', color: row.r1h > 0 ? '#00ff88' : '#ff6b6b' }}>{row.r1h > 0 ? '+' : ''}{row.r1h}%</td>
                      <td style={{ padding: '10px', color: row.r4h > 0 ? '#00ff88' : '#ff6b6b' }}>{row.r4h > 0 ? '+' : ''}{row.r4h}%</td>
                      <td style={{ padding: '10px', color: row.r24h > 0 ? '#00ff88' : '#ff6b6b' }}>{row.r24h > 0 ? '+' : ''}{row.r24h}%</td>
                      <td style={{ padding: '10px', color: row.verdict.includes('killed') ? '#ff6b6b' : '#00ff88' }}>{row.verdict}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ color: '#666', fontSize: '12px', marginTop: '15px' }}>
              Mint #1 (fresh, $11K) alerted once and did +1,172%. Mint #2 (old, $94K–$121K) alerted 5 times
              and lost on every single one. The same-minute split eliminates time as a variable —
              the only thing that mattered was which contract you were on.
            </p>
          </div>

          {/* The Kill Filter Ate the Winners */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #ff6b6b' }}>
            <h2 style={{ color: '#ff6b6b', marginBottom: '15px' }}>🔪 The Kill Filter Ate the Session&apos;s Top 3 Prints</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              The cluster_killed filter suppressed <strong style={{ color: '#fff' }}>58% of all alerts</strong> this
              session (341/575). Of 136 killed alerts with resolved 24h data, <strong style={{ color: '#00ff88' }}>11 survived</strong>{' '}
              (8.1% false-kill rate, down from 9.1% last session). But the survivors were the session&apos;s
              biggest prints. The top 3 delivered winners were all SYBIL-tagged and killed:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #ff6b6b' }}>
                <div style={{ color: '#ff6b6b', fontSize: '20px', fontWeight: 'bold' }}>HORNS</div>
                <div style={{ color: '#00ff88', fontSize: '24px', fontWeight: 'bold' }}>+824%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>sc84 · SYBIL · $77K · killed</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #ff6b6b' }}>
                <div style={{ color: '#ff6b6b', fontSize: '20px', fontWeight: 'bold' }}>SPYC</div>
                <div style={{ color: '#00ff88', fontSize: '24px', fontWeight: 'bold' }}>+778%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>sc80 · SYBIL · $104K · killed</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #ff6b6b' }}>
                <div style={{ color: '#ff6b6b', fontSize: '20px', fontWeight: 'bold' }}>PSYCHOSIS</div>
                <div style={{ color: '#00ff88', fontSize: '24px', fontWeight: 'bold' }}>+661%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>sc84 · SYBIL · $70K · killed</div>
              </div>
            </div>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginTop: '20px' }}>
              HORNS is the most instructive: it fired 4 alerts across <strong style={{ color: '#fff' }}>two different
              mints</strong>. Mint #1 (DtK8...pump) at $140K–$168K mcap went -71% to -75% — dead. Mint #2
              (85Dc...39i1) at <strong style={{ color: '#00ff88' }}>$77K mcap</strong> did{' '}
              <strong style={{ color: '#00ff88' }}>+824%</strong> — but was killed. The same ticker, same
              session, two mints: the sub-$100K mint won 9x, the $140K+ mints died. The filter killed
              the winner and let the losers through. It&apos;s the MEOWDY story again: mcap is the only
              variable that matters, and the filter can&apos;t see it.
            </p>
          </div>

          {/* ANSEMBULL Re-Alert Trap */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #ffaa00' }}>
            <h2 style={{ color: '#ffaa00', marginBottom: '15px' }}>🐂 ANSEMBULL: 7 Alerts, 7 Kills, 7 Deaths — The Bull Theme Trap</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              ANSEMBULL — a bull-themed ticker that appeared during the same window as the 牛来 family
              from <a href="/insights/bull-comes-11-mints-wolf-data-2026-08-17" style={{ color: '#00ff88' }}>Day 17</a> —
              fired 7 alerts in 3 hours. Every single one was SYBIL-tagged and cluster_killed. Every
              single one died -98.8% to -99.6% at 24h. The kill filter was 100% correct this time.
              But the 4h candles told a different story: +172%, +127%, +89%, +83% — euphoric pumps
              that all collapsed. This is the <a href="/insights/bark-four-hour-trap-wolf-data-2026-08-11" style={{ color: '#00ff88' }}>BARK 4-hour trap</a> from
              Day 11: the 4h candle is the exit, not the entry. By the time the scanner re-alerts at
              $300K–$687K mcap, the pump is already over.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ffaa00' }}>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#ffaa00' }}>Time (EET)</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#ffaa00' }}>Score</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#ffaa00' }}>Mcap</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#ffaa00' }}>4H</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#ffaa00' }}>24H</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { time: 'Aug 19 16:45', score: 76, mcap: '$211K', r4h: 172, r24h: -98.8 },
                    { time: 'Aug 19 17:01', score: 80, mcap: '$253K', r4h: 127, r24h: -99.0 },
                    { time: 'Aug 19 17:15', score: 85, mcap: '$304K', r4h: 89, r24h: -99.2 },
                    { time: 'Aug 19 17:30', score: 79, mcap: '$342K', r4h: 83, r24h: -99.3 },
                    { time: 'Aug 19 17:46', score: 71, mcap: '$366K', r4h: 22, r24h: -99.3 },
                    { time: 'Aug 19 19:00', score: 71, mcap: '$655K', r4h: -47, r24h: -99.6 },
                    { time: 'Aug 19 19:45', score: 72, mcap: '$687K', r4h: -50, r24h: -99.6 },
                  ] as const).map((row) => (
                    <tr key={row.time} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '10px', color: '#aaa' }}>{row.time}</td>
                      <td style={{ padding: '10px', color: '#fff' }}>{row.score}</td>
                      <td style={{ padding: '10px', color: '#ff6b6b' }}>{row.mcap}</td>
                      <td style={{ padding: '10px', color: row.r4h > 0 ? '#00ff88' : '#ff6b6b' }}>{row.r4h > 0 ? '+' : ''}{row.r4h}%</td>
                      <td style={{ padding: '10px', color: '#ff6b6b' }}>{row.r24h}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ color: '#666', fontSize: '12px', marginTop: '15px' }}>
              7 alerts, 3 hours, $211K → $687K mcap. The 4h candles were euphoric (+83% to +172%).
              The 24h candles were catastrophic (-98.8% to -99.6%). The filter killed all 7. All 7 died.
              The bull theme is a trap — again.
            </p>
          </div>

          {/* Score & Mcap Bands */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>📐 Score & Mcap Bands (All Alerts with 24h Data)</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              The score inversion is now in its 4th consecutive week. Score 90+ went{' '}
              <strong style={{ color: '#ff6b6b' }}>0/13</strong> at 24h (-98.3% avg). Score 60-69 was
              the best band: <strong style={{ color: '#00ff88' }}>13.1% win rate</strong>, +104.7% avg
              return — the only score band with a positive average. The mcap wall held at $500K: every
              alert entering above $500K mcap went red (0/32). Sub-$50K was the only positive mcap
              band at <strong style={{ color: '#00ff88' }}>25.6% win rate</strong> and{' '}
              <strong style={{ color: '#00ff88' }}>+199.0% avg</strong> — nearly 2x the next band.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div>
                <h3 style={{ color: '#00ff88', fontSize: '14px', marginBottom: '10px' }}>Score Bands</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #00ff88' }}>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#00ff88' }}>Band</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#00ff88' }}>N</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#00ff88' }}>Win Rate</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#00ff88' }}>Avg 24H</th>
                    </tr>
                  </thead>
                  <tbody>
                    {([
                      { band: '<60', n: 20, wr: 10.0, avg: -65.0 },
                      { band: '60-69', n: 61, wr: 13.1, avg: 104.7 },
                      { band: '70-79', n: 98, wr: 5.1, avg: -80.0 },
                      { band: '80-89', n: 42, wr: 16.7, avg: -14.4 },
                      { band: '90+', n: 13, wr: 0.0, avg: -98.3 },
                    ] as const).map((row) => (
                      <tr key={row.band} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '8px', color: '#fff' }}>{row.band}</td>
                        <td style={{ padding: '8px', color: '#aaa' }}>{row.n}</td>
                        <td style={{ padding: '8px', color: row.wr > 0 ? '#00ff88' : '#ff6b6b' }}>{row.wr.toFixed(1)}%</td>
                        <td style={{ padding: '8px', color: row.avg > 0 ? '#00ff88' : '#ff6b6b' }}>{row.avg > 0 ? '+' : ''}{row.avg.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h3 style={{ color: '#00ff88', fontSize: '14px', marginBottom: '10px' }}>Mcap Bands</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #00ff88' }}>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#00ff88' }}>Band</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#00ff88' }}>N</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#00ff88' }}>Win Rate</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#00ff88' }}>Avg 24H</th>
                    </tr>
                  </thead>
                  <tbody>
                    {([
                      { band: '<$50K', n: 43, wr: 25.6, avg: 199.0 },
                      { band: '$50-100K', n: 36, wr: 16.7, avg: -22.6 },
                      { band: '$100-200K', n: 53, wr: 5.7, avg: -60.3 },
                      { band: '$200-500K', n: 70, wr: 2.9, avg: -91.1 },
                      { band: '$500K-1M', n: 20, wr: 0.0, avg: -82.6 },
                      { band: '$1M+', n: 12, wr: 0.0, avg: -95.9 },
                    ] as const).map((row) => (
                      <tr key={row.band} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '8px', color: '#fff' }}>{row.band}</td>
                        <td style={{ padding: '8px', color: '#aaa' }}>{row.n}</td>
                        <td style={{ padding: '8px', color: row.wr > 0 ? '#00ff88' : '#ff6b6b' }}>{row.wr.toFixed(1)}%</td>
                        <td style={{ padding: '8px', color: row.avg > 0 ? '#00ff88' : '#ff6b6b' }}>{row.avg > 0 ? '+' : ''}{row.avg.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Cluster Verdict */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>🔍 Cluster Verdict: Unclassified Beats SYBIL — Again</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>
              The &ldquo;coordination premium&rdquo; thesis — that SYBIL tokens outperform because
              coordinated buyers create tradable pumps — has fully inverted for delivered alerts.
              Delivered SYBIL alerts went <strong style={{ color: '#ff6b6b' }}>10/150</strong> at 24h
              (6.7% win rate, -64.7% avg). Delivered unclassified alerts went{' '}
              <strong style={{ color: '#00ff88' }}>12/84</strong> at 24h (14.3% win rate, +60.3% avg).
              ORGANIC and BUNDLE were both absent from the 48h window entirely — the first time both
              were simultaneously absent since the experiment began. The only winners in the dataset
              were either unclassified newpairs (MEOWDY, XST, GOOGLE AI) or killed SYBIL tokens that
              the filter tried to suppress (HORNS, SPYC, PSYCHOSIS). The filter&apos;s 8.1% false-kill
              rate is the lowest of the experiment — it&apos;s getting more accurate. But the 11
              false kills it did make were worth +824%, +778%, +661%, +294%, +266%, +152%, +147%,
              +111%, +96%, +82%, +66% — a combined opportunity cost of ~3,500%.
            </p>
          </div>

          {/* Key Takeaways */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #00ff88' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>🎯 Key Takeaways</h2>
            <ol style={{ color: '#aaa', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li><strong style={{ color: '#fff' }}>Same-minute splits eliminate every variable except mcap.</strong> MEOWDY fired two alerts in the same minute on two mints — $11K did +1,172%, $112K did -39%. The 10x mcap gap was the entire ballgame.</li>
              <li><strong style={{ color: '#fff' }}>The kill filter ate the top 3 prints again.</strong> HORNS (+824%), SPYC (+778%), PSYCHOSIS (+661%) were all SYBIL, all killed, all would have been the session&apos;s biggest winners. False-kill rate: 8.1% (11/136).</li>
              <li><strong style={{ color: '#fff' }}>HORNS is the MEOWDY story on one ticker.</strong> Two mints: sub-$100K won 9x, $140K+ died -71%. The filter killed the winner and let the losers through.</li>
              <li><strong style={{ color: '#fff' }}>ANSEMBULL: 7 alerts, 7 kills, 7 deaths.</strong> The bull theme trap from Day 17 repeats. 4h candles were euphoric (+83% to +172%), 24h candles were catastrophic (-98.8% to -99.6%). The filter was 100% correct.</li>
              <li><strong style={{ color: '#fff' }}>Sub-$50K is the only positive mcap band.</strong> 25.6% win rate, +199.0% avg. Every band above $500K went to zero. The mcap wall is now in its 4th consecutive week.</li>
              <li><strong style={{ color: '#fff' }}>Score 100 extinct 23 days.</strong> Zero perfect-score alerts in the 48h window. All-time: 2/171 (1.2%). ORGANIC and BUNDLE both absent for the first time in the experiment.</li>
            </ol>
          </div>

          {/* Previous insights */}
          <div style={{ background: '#111', padding: '25px', borderRadius: '16px', border: '1px solid #222' }}>
            <h3 style={{ color: '#00ff88', marginBottom: '15px', fontSize: '16px' }}>Previous Insights</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="/insights/newbie-re-alert-curse-broken-wolf-data-2026-08-20" style={{ color: '#00ff88', fontSize: '14px' }}>← Aug 20: The Re-Alert Curse Broken: NEWBIE Went 5/5 Green. The 6th Got Killed.</a>
              <a href="/insights/basecat-red-start-32x-wolf-data-2026-08-19" style={{ color: '#00ff88', fontSize: '14px' }}>← Aug 19: The Red-Start Moonshot: BASECAT Was Down 15% at 1H. Then It Did 32x.</a>
              <a href="/insights/dgai-87x-mcap-gap-wolf-data-2026-08-18" style={{ color: '#00ff88', fontSize: '14px' }}>← Aug 18: The 33x Mcap Gap: DGAI Did 87x From $113K. Every $500K+ Token Died.</a>
            </div>
          </div>

        </div>
      </Layout>
    </>
  )
}
