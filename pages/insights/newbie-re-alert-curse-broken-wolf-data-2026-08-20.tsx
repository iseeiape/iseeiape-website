import Head from 'next/head'
import Layout from '../../components/Layout'

export default function NewbieReAlertCurseBrokenWolfData20260820() {
  return (
    <>
      <Head>
        <title>The Re-Alert Curse Broken: NEWBIE Went 5/5 Green on One Mint. The 6th Got Killed. | iseeiape</title>
        <meta name="description" content="Wolf Pack data case study — 565 alerts over 48h (Aug 18-20). NEWBIE fired 6 alerts on a single mint: first 5 all green (+552%, +422%, +355%, +147%, +107%), the 6th at $541K got SYBIL-tagged and died. The kill filter suppressed MONKEY (+1,007%) and 67COIN (+766%) — the session's top prints. $200K+ mcap went 0/34. Score 90+ went 0/2. Score 100 extinct 22 days." />
        <meta property="og:title" content="The Re-Alert Curse Broken: NEWBIE Went 5/5 Green. The 6th Got Killed." />
        <meta property="og:description" content="565 Wolf alerts, 48h. NEWBIE: 5/5 green re-alerts on one mint (first ever), 6th at $541K killed. Filter ate MONKEY +1,007% and 67COIN +766%. $200K+ wall: 0/34. Score 90+: 0/2." />
      </Head>
      <Layout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#fff', minHeight: '100vh' }}>

          <a href="/insights" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'block' }}>← Back to Insights</a>

          <span style={{ padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px' }}>🆕 Today — Aug 20, 2026</span>

          <h1 style={{ fontSize: '42px', marginTop: '15px', marginBottom: '20px' }}>🔄 The Re-Alert Curse Broken: NEWBIE Went 5/5 Green on One Mint. The 6th Got Killed.</h1>

          <p style={{ color: '#888', marginBottom: '40px', fontSize: '18px' }}>
            Day 23 of the Wolf Pack tracking experiment. 565 alerts fired across the last 48 hours,
            99 completed 24-hour tracking, and the win rate sat at{' '}
            <strong style={{ color: '#00ff88' }}>10.1%</strong> (10/99) — a dead session
            on paper. But the headline is the most unexpected pattern in 23 days of data:{' '}
            <strong style={{ color: '#fff' }}>NEWBIE</strong> fired 6 alerts on a{' '}
            <strong style={{ color: '#fff' }}>single contract mint</strong> over 22 hours.
            The first 5 were all green at 24h — <strong style={{ color: '#00ff88' }}>+552%, +422%, +355%, +147%, +107%</strong>.
            Every prior re-alert case study in this experiment (DOOM, SAOF, TOAD, BARK, 牛来) showed the same pattern:
            first entry green, every subsequent entry worse. NEWBIE broke the curse. Then the 6th alert
            at <strong style={{ color: '#ff6b6b' }}>$541K mcap</strong> got{' '}
            <strong style={{ color: '#ff6b6b' }}>SYBIL-tagged and cluster_killed</strong> —
            and went flat (0% at 24h). The curse didn&apos;t break because re-alerts got safer.
            It broke because NEWBIE never left the micro-cap zone. The moment it crossed $500K, the re-alert trap snapped back into place.
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>8 min read</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Data Case Study</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Wolf Pack</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Re-Alert Pattern</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Kill Filter</span>
          </div>

          {/* Dataset Overview */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>📊 The Dataset (Last 48 Hours)</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>
              565 alerts across <strong style={{ color: '#fff' }}>285 unique tickers</strong> and{' '}
              <strong style={{ color: '#fff' }}>343 unique contract mints</strong> — a 17% ticker-recycling
              rate, lower than recent sessions (Day 20 hit 100% with 牛来). The suppression filter
              has tightened dramatically: <strong style={{ color: '#ff6b6b' }}>60% of all alerts
              were cluster_killed</strong> (341/565), up from 24% a week ago. Of 99 delivered alerts
              with full 24h tracking, 10 were green — a <strong style={{ color: '#00ff88' }}>10.1% win rate</strong>.
              The median 24h return was <strong style={{ color: '#ff6b6b' }}>-95.6%</strong>; 67% of
              alerts ended below -90%. Winners averaged{' '}
              <strong style={{ color: '#00ff88' }}>$76K mcap</strong> at entry; losers averaged{' '}
              <strong style={{ color: '#ff6b6b' }}>$292K</strong> — a 3.9x gap (median: 2.3x).
              Score 100 was absent for the <strong style={{ color: '#fff' }}>22nd consecutive day</strong> (all-time: 2/171).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px', marginTop: '25px' }}>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>565</div>
                <div style={{ color: '#888', fontSize: '12px' }}>total alerts (48h)</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>10.1%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>24h win rate (10/99)</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#ff6b6b', fontSize: '28px', fontWeight: 'bold' }}>60%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>alerts suppressed (341/565)</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>+552%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>best delivered print (NEWBIE)</div>
              </div>
            </div>
          </div>

          {/* NEWBIE Case Study */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #00ff88' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>🆕 The NEWBIE Case Study: 6 Alerts, 1 Mint, 5 Winners</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              Every re-alert case study in this experiment told the same story: the first alert is the
              only profitable entry. DOOM&apos;s first 5 alerts were green, the 6th at $4.26M was red
              (<a href="/insights/first-entry-sybil-premium-wolf-data-2026-08-05" style={{ color: '#00ff88' }}>Day 9</a>).
              SAOF&apos;s first alert did +2,091%, the re-alert 6.5h later did -97%. TOAD traced a
              complete decay curve across 15 alerts (<a href="/insights/toad-decay-curve-wolf-data-2026-08-10" style={{ color: '#00ff88' }}>Day 14</a>).
              The pattern was iron: re-alerts = worse entries. NEWBIE broke it — not because the token
              was special, but because it <strong style={{ color: '#fff' }}>stayed below $150K mcap
              for all 5 winning alerts</strong>. The re-alert curse isn&apos;t about alert count.
              It&apos;s about entry mcap. The scanner re-alerts as price climbs; if price doesn&apos;t
              climb, the re-alerts are just additional entries at the same good price.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #00ff88' }}>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#00ff88' }}>Time (EET)</th>
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
                    { time: 'Aug 18 21:45', score: 50, mcap: '$34K', r1h: 8, r4h: 152, r24h: 552, verdict: 'newpairs', status: 'active' },
                    { time: 'Aug 19 02:00', score: 66, mcap: '$63K', r1h: 151, r4h: 86, r24h: 355, verdict: 'newpairs', status: 'active' },
                    { time: 'Aug 19 02:15', score: 58, mcap: '$56K', r1h: 183, r4h: 109, r24h: 422, verdict: 'newpairs', status: 'active' },
                    { time: 'Aug 19 04:45', score: 53, mcap: '$104K', r1h: 15, r4h: 1, r24h: 147, verdict: 'newpairs', status: 'active' },
                    { time: 'Aug 19 05:30', score: 62, mcap: '$138K', r1h: 10, r4h: -24, r24h: 107, verdict: 'newpairs', status: 'active' },
                    { time: 'Aug 19 15:45', score: 73, mcap: '$541K', r1h: -29, r4h: -57, r24h: 0, verdict: 'SYBIL → killed', status: 'cluster_killed' },
                    { time: 'Aug 19 18:45', score: 57, mcap: '$310K', r1h: 3, r4h: 9, r24h: 0, verdict: 'newpairs', status: 'active' },
                  ] as const).map((row) => (
                    <tr key={row.time} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '10px', color: '#aaa' }}>{row.time}</td>
                      <td style={{ padding: '10px', color: '#fff' }}>{row.score}</td>
                      <td style={{ padding: '10px', color: row.mcap === '$541K' ? '#ff6b6b' : '#fff' }}>{row.mcap}</td>
                      <td style={{ padding: '10px', color: row.r1h > 0 ? '#00ff88' : '#ff6b6b' }}>{row.r1h > 0 ? '+' : ''}{row.r1h}%</td>
                      <td style={{ padding: '10px', color: row.r4h > 0 ? '#00ff88' : '#ff6b6b' }}>{row.r4h > 0 ? '+' : ''}{row.r4h}%</td>
                      <td style={{ padding: '10px', color: row.r24h > 0 ? '#00ff88' : (row.r24h === 0 ? '#ffaa00' : '#ff6b6b') }}>{row.r24h > 0 ? '+' : ''}{row.r24h}%</td>
                      <td style={{ padding: '10px', color: row.verdict.includes('killed') ? '#ff6b6b' : '#00ff88' }}>{row.verdict}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ color: '#666', fontSize: '12px', marginTop: '15px' }}>
              All 7 alerts on the same contract mint. First 5 alerts entered $34K–$138K — all green.
              Alert #6 at $541K triggered SYBIL detection → suppressed. Alert #7 at $310K was delivered but flat (0%).
              The re-alert curse broke because mcap stayed low. The moment it crossed $500K, the trap snapped back.
            </p>
          </div>

          {/* The Kill Filter Ate the Winners */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #ff6b6b' }}>
            <h2 style={{ color: '#ff6b6b', marginBottom: '15px' }}>🔪 The Kill Filter Ate the Session&apos;s Top Prints</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              The cluster_killed filter suppressed <strong style={{ color: '#fff' }}>60% of all alerts</strong> this
              session — up from 24% a week ago. The scanner is killing more aggressively than ever.
              But of 164 killed alerts with resolved 24h data, <strong style={{ color: '#00ff88' }}>15 survived</strong>{' '}
              (9.1% false-kill rate). All-time the false-kill rate is 11.4% (72/633). The filter kills every
              SYBIL/BUNDLE verdict, but many SYBIL tokens are legitimate coordinated pumps that deliver.
              The session&apos;s top 3 prints were all suppressed:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #ff6b6b' }}>
                <div style={{ color: '#ff6b6b', fontSize: '20px', fontWeight: 'bold' }}>MONKEY</div>
                <div style={{ color: '#00ff88', fontSize: '24px', fontWeight: 'bold' }}>+1,007%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>sc78 · SYBIL · $49K · killed</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #ff6b6b' }}>
                <div style={{ color: '#ff6b6b', fontSize: '20px', fontWeight: 'bold' }}>67COIN</div>
                <div style={{ color: '#00ff88', fontSize: '24px', fontWeight: 'bold' }}>+766%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>sc81 · SYBIL · $11K · killed</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #ff6b6b' }}>
                <div style={{ color: '#ff6b6b', fontSize: '20px', fontWeight: 'bold' }}>GORIKUN</div>
                <div style={{ color: '#00ff88', fontSize: '24px', fontWeight: 'bold' }}>+267%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>sc74 · SYBIL · $374K · killed</div>
              </div>
            </div>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginTop: '20px' }}>
              The pattern is the same one from <a href="/insights/basecat-red-start-32x-wolf-data-2026-08-19" style={{ color: '#00ff88' }}>Day 22</a>{' '}
              (BASECAT, +3,166%, killed) and <a href="/insights/dgai-87x-mcap-gap-wolf-data-2026-08-18" style={{ color: '#00ff88' }}>Day 21</a>{' '}
              (DGAI, +8,616%, killed): the filter&apos;s false kills concentrate at sub-$50K mcap — exactly where
              the real alpha lives. MONKEY at $49K and 67COIN at $11K were textbook micro-cap SYBIL pumps.
              The filter is right 89% of the time, but the 11% it gets wrong are the biggest prints in the session.
            </p>
          </div>

          {/* 67COIN Identity Split */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #ffaa00' }}>
            <h2 style={{ color: '#ffaa00', marginBottom: '15px' }}>🪙 67COIN: 4 Mints, 14 Alerts, 1 Winner — The $11K vs $4M Split</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              67COIN is the session&apos;s most extreme identity split: 14 alerts across{' '}
              <strong style={{ color: '#fff' }}>4 different contract mints</strong> in 2 hours. Mint #1
              (H5SC) fired at $12K, was killed, and went flat. Mint #2 (DLYQ) fired 8 alerts from $607K
              to $4M — every single one died -75% to -98%. Mint #3 (2HGV) fired at{' '}
              <strong style={{ color: '#00ff88' }}>$11K</strong>, was killed, and did{' '}
              <strong style={{ color: '#00ff88' }}>+766%</strong>. Mint #4 (9cpE) at $94K went flat.
              The winner and the losers shared a ticker, a scanner, and a 2-hour window — the only
              variable that mattered was entry mcap. $11K = +766%. $607K–$4M = -75% to -98%.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ffaa00' }}>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#ffaa00' }}>Mint</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#ffaa00' }}>Alerts</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#ffaa00' }}>Mcap Range</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#ffaa00' }}>Best 24H</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#ffaa00' }}>Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { mint: '#1 (H5SC)', alerts: 1, range: '$12K', best: 0, verdict: 'killed, flat' },
                    { mint: '#2 (DLYQ)', alerts: 8, range: '$607K–$4M', best: -75, verdict: 'all dead' },
                    { mint: '#3 (2HGV)', alerts: 1, range: '$11K', best: 766, verdict: 'killed, +766%' },
                    { mint: '#4 (9cpE)', alerts: 1, range: '$94K', best: 0, verdict: 'killed, flat' },
                    { mint: '#5 (65dJ)', alerts: 1, range: '$13K', best: -90, verdict: 'rug_pull' },
                  ] as const).map((row) => (
                    <tr key={row.mint} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '10px', color: '#fff' }}>{row.mint}</td>
                      <td style={{ padding: '10px', color: '#aaa' }}>{row.alerts}</td>
                      <td style={{ padding: '10px', color: '#aaa' }}>{row.range}</td>
                      <td style={{ padding: '10px', color: row.best > 0 ? '#00ff88' : (row.best === 0 ? '#ffaa00' : '#ff6b6b') }}>{row.best > 0 ? '+' : ''}{row.best}%</td>
                      <td style={{ padding: '10px', color: row.best > 0 ? '#00ff88' : '#ff6b6b' }}>{row.verdict}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Score & Mcap Bands */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>📐 Score & Mcap Bands (Delivered Alerts)</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              The score inversion is now structural. Score 70+ went <strong style={{ color: '#ff6b6b' }}>0/18</strong> at
              24h — every single delivered alert scoring 70 or above died. The only winners came from
              the &lt;70 band (12.3% WR). Score 90+ went 0/2 (GIKO and BULL500, both SYBIL, both -99%).
              The mcap wall held at $200K: every delivered alert entering above $200K mcap went red
              (0/34). The $100K–$200K band was the only positive zone above $50K at 21.1% WR — but
              that&apos;s 4 winners out of 19, all low-score newpairs alerts.
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
                      { band: '<70', n: 81, wr: 12.3, avg: -45.0 },
                      { band: '70-79', n: 11, wr: 0.0, avg: -98.8 },
                      { band: '80-89', n: 5, wr: 0.0, avg: -97.9 },
                      { band: '90+', n: 2, wr: 0.0, avg: -99.2 },
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
                      { band: '<50K', n: 20, wr: 15.0, avg: -19.3 },
                      { band: '50-100K', n: 21, wr: 14.3, avg: -25.3 },
                      { band: '100-200K', n: 19, wr: 21.1, avg: -54.6 },
                      { band: '200-500K', n: 28, wr: 0.0, avg: -90.5 },
                      { band: '500K-1M', n: 5, wr: 0.0, avg: -94.7 },
                      { band: '1M+', n: 6, wr: 0.0, avg: -76.2 },
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
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>🔍 Cluster Verdict: SYBIL Is Now a Death Sentence</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>
              The &ldquo;coordination premium&rdquo; — the thesis that SYBIL-tagged tokens outperform
              because coordinated buyers create tradable pumps — has fully inverted for delivered alerts.
              Every delivered SYBIL alert went 0/18 at 24h (avg -98.6%). The only delivered winners
              were <strong style={{ color: '#fff' }}>unclassified</strong> alerts (12.3% WR, 10/81).
              ORGANIC and BUNDLE were both absent from the delivered set entirely. But the killed set
              tells the other half: 15/164 killed alerts survived (9.1%), and the top 3 prints were
              all SYBIL. The filter is throwing the baby out with the bathwater — but only at micro-cap.
              At $200K+, SYBIL is genuinely a death sentence. The filter&apos;s flaw is that it
              can&apos;t distinguish a $11K SYBIL pump (67COIN, +766%) from a $4M SYBIL dump (-98%).
            </p>
          </div>

          {/* Pending tokens */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #ffaa00' }}>
            <h2 style={{ color: '#ffaa00', marginBottom: '15px' }}>⏳ Pending: XST Did +8,792% at 1H (Again)</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>
              XST — the ticker that produced 26 mints since July 24 — fired 3 more alerts this session.
              The latest at $35K mcap did <strong style={{ color: '#00ff88' }}>+8,792% at 1h</strong> (24h pending).
              The 1h == 4h return signature (both +8,792%) is the BARK exit-trap pattern: the entire
              move happened in hour one. MEOWDY also appeared on a fresh mint at $11K (+763% at 1h),
              while the same ticker on an older mint at $112K was killed. The 67COIN pattern repeating
              in real time: same ticker, different mint, micro-cap entry = the only shot.
            </p>
          </div>

          {/* Key Takeaways */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #00ff88' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>🎯 Key Takeaways</h2>
            <ol style={{ color: '#aaa', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li><strong style={{ color: '#fff' }}>Re-alerts aren&apos;t the trap — rising mcap is.</strong> NEWBIE proved 5 re-alerts can all win if the token stays below $150K. The curse snaps back the moment mcap crosses $500K.</li>
              <li><strong style={{ color: '#fff' }}>The kill filter is eating the alpha.</strong> 60% suppression rate, 9.1% false-kill rate this session. The top 3 prints (MONKEY +1,007%, 67COIN +766%, GORIKUN +267%) were all suppressed. All-time false-kill rate: 11.4%.</li>
              <li><strong style={{ color: '#fff' }}>Score 70+ is now a death sentence for delivered alerts.</strong> 0/18 at 24h. The only winners scored below 70. The scanner&apos;s confidence score has fully inverted — high score = high mcap = exit liquidity.</li>
              <li><strong style={{ color: '#fff' }}>The $200K wall is impenetrable.</strong> 0/34 delivered alerts above $200K mcap survived. 67COIN&apos;s $11K mint did +766%; its $4M mint did -98%. Same ticker, same hour, same scanner.</li>
              <li><strong style={{ color: '#fff' }}>Score 100 is extinct 22 days.</strong> Zero perfect-score alerts fired in the 48h window. All-time: 2/171 (1.2%). The signal has gone silent.</li>
            </ol>
          </div>

          {/* Previous insights */}
          <div style={{ background: '#111', padding: '25px', borderRadius: '16px', border: '1px solid #222' }}>
            <h3 style={{ color: '#00ff88', marginBottom: '15px', fontSize: '16px' }}>Previous Insights</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="/insights/basecat-red-start-32x-wolf-data-2026-08-19" style={{ color: '#00ff88', fontSize: '14px' }}>← Aug 19: The Red-Start Moonshot: BASECAT Was Down 15% at 1H. Then It Did 32x.</a>
              <a href="/insights/dgai-87x-mcap-gap-wolf-data-2026-08-18" style={{ color: '#00ff88', fontSize: '14px' }}>← Aug 18: The 33x Mcap Gap: DGAI Did 87x From $113K. Every $500K+ Token Died.</a>
              <a href="/insights/bull-comes-11-mints-wolf-data-2026-08-17" style={{ color: '#00ff88', fontSize: '14px' }}>← Aug 17: The Bull Comes 11 Times: 牛来 Spawned 11 Mints in 44 Hours.</a>
            </div>
          </div>

        </div>
      </Layout>
    </>
  )
}
