import Head from 'next/head'
import Layout from '../../components/Layout'

export default function BarkFourHourTrapWolfData20260811() {
  return (
    <>
      <Head>
        <title>The 4-Hour Trap: BARK Pumped +931% at 4H. All 14 Tracked Alerts Lost at 24H. | iseeiape</title>
        <meta name="description" content="Wolf Pack data case study — 569 alerts over 48h. BARK fired 15 alerts with massive 4h pumps (+931%, +915%) but 0/14 survived to 24h. REMUS fired 16 alerts same window, 9/13 green at 24h. ALFE re-launched on a new pair and did +7,939%. Score 100 extinct Day 9. Score <60 outperformed score 80-89." />
        <meta property="og:title" content="The 4-Hour Trap: BARK +931% at 4H, 0/14 Green at 24H" />
        <meta property="og:description" content="569 Wolf alerts, 48h. BARK's 15 alerts all died at 24h despite huge 4h pumps. REMUS went 9/13 green. ALFE +7,939% on re-launch. Score 100 extinct Day 9." />
      </Head>
      <Layout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#fff', minHeight: '100vh' }}>

          <a href="/insights" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'block' }}>← Back to Insights</a>

          <span style={{ padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px' }}>🆕 Today — Aug 11, 2026</span>

          <h1 style={{ fontSize: '42px', marginTop: '15px', marginBottom: '20px' }}>⚡ The 4-Hour Trap: BARK Pumped +931% at 4H. All 14 Tracked Alerts Lost at 24H.</h1>

          <p style={{ color: '#888', marginBottom: '40px', fontSize: '18px' }}>
            Day 15 of the Wolf Pack tracking experiment. We've tracked score bands, cluster verdicts,
            market caps, and re-alert traps. Today the data handed us something we could finally test
            in isolation: <strong style={{ color: '#fff' }}>two tokens, same scanner, same time window,
            nearly identical alert counts</strong> — and <strong style={{ color: '#00ff88' }}>completely
            opposite outcomes</strong>. At <strong style={{ color: '#fff' }}>10:00 UTC on August 9</strong>,
            Wolf started firing on <strong style={{ color: '#ff6b6b' }}>BARK</strong>. Over the next 4.5 hours,
            15 alerts went out as the market cap climbed from $79K to{' '}
            <strong style={{ color: '#ff6b6b' }}>$2.45M</strong>. The 4-hour candles were euphoric —
            <strong style={{ color: '#00ff88' }}> +931%</strong>, <strong style={{ color: '#00ff88' }}>+915%</strong>,
            <strong style={{ color: '#00ff88' }}> +264%</strong>. Every single one of them reversed.
            <strong style={{ color: '#ff6b6b' }}> 0 out of 14 tracked BARK alerts were green at 24h.</strong>{' '}
            Meanwhile, at 14:30 UTC that same day, Wolf started firing on{' '}
            <strong style={{ color: '#00ff88' }}>REMUS</strong> — 16 alerts over 23 hours. Its 4h candles
            were modest (+100%, -71%, -78%). But <strong style={{ color: '#00ff88' }}>9 out of 13 tracked
            REMUS alerts were green at 24h</strong>, including a <strong style={{ color: '#00ff88' }}>+577%</strong>{' '}
            winner. The 4-hour candle is not your friend. It's the trap door.
          </p>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>8 min read</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Data Case Study</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Wolf Pack</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>4H Trap</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Mirror Image</span>
          </div>

          {/* Dataset Overview */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>📊 The Dataset (Last 48 Hours)</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>
              569 alerts fired across hundreds of tokens, with <strong style={{ color: '#fff' }}>220</strong>{' '}
              having completed 24-hour tracking. Win rate settled at{' '}
              <strong style={{ color: '#00ff88' }}>14.1%</strong> (31/220) — a step down from yesterday's
              record 19.9%, but consistent with the experiment average. Score 100 remains extinct
              (<strong style={{ color: '#ff6b6b' }}>Day 9</strong> — zero fired in the window). Score 90+
              went 0/2 again. The most striking shift: <strong style={{ color: '#00ff88' }}>score &lt;60
              had the highest win rate at 26.3%</strong>, while the supposedly premium score 80-89 band
              collapsed to <strong style={{ color: '#ff6b6b' }}>5.3%</strong> (1/19). The median 24h return
              was <strong style={{ color: '#ff6b6b' }}>-88.6%</strong> — nearly half of all tracked alerts
              ended below -90%.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px', marginTop: '25px' }}>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>569</div>
                <div style={{ color: '#888', fontSize: '12px' }}>total alerts (48h)</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>14.1%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>24h win rate (31/220)</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#ff6b6b', fontSize: '28px', fontWeight: 'bold' }}>48.2%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>alerts ending below -90%</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#ff6b6b', fontSize: '28px', fontWeight: 'bold' }}>0</div>
                <div style={{ color: '#888', fontSize: '12px' }}>score 100 alerts (extinct Day 9)</div>
              </div>
            </div>
          </div>

          {/* BARK - The 4-Hour Trap */}
          <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #ff6b6b44' }}>
            <h2 style={{ color: '#ff6b6b', marginBottom: '20px' }}>🪤 Case Study: BARK — The 4-Hour Trap</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              BARK is the textbook exit-liquidity pump. Wolf fired 15 alerts from 10:00 to 14:15 UTC on
              August 9. The pattern was deceptively bullish at first glance: six alerts had 4-hour returns
              above <strong style={{ color: '#00ff88' }}>+120%</strong>, peaking at{' '}
              <strong style={{ color: '#00ff88' }}>+931%</strong>. If you bought on the 4h candle signal,
              you felt like a genius for four hours. Then the floor fell out.
            </p>

            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #333' }}>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#00ff88' }}>Time (UTC)</th>
                    <th style={{ padding: '10px', textAlign: 'center', color: '#00ff88' }}>Score</th>
                    <th style={{ padding: '10px', textAlign: 'center', color: '#00ff88' }}>Cluster</th>
                    <th style={{ padding: '10px', textAlign: 'right', color: '#00ff88' }}>Mcap</th>
                    <th style={{ padding: '10px', textAlign: 'right', color: '#00ff88' }}>4H Return</th>
                    <th style={{ padding: '10px', textAlign: 'right', color: '#00ff88' }}>24H Return</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { time: '10:15 Aug 9', score: '74', cluster: 'SYBIL', mcap: '$219K', r4: '+915%', r24: '-36.5%', win: false },
                    { time: '10:30 Aug 9', score: '69', cluster: '—', mcap: '$191K', r4: '+931%', r24: '-27.1%', win: false },
                    { time: '10:45 Aug 9', score: '74', cluster: 'SYBIL', mcap: '$321K', r4: '+264%', r24: '-56.7%', win: false },
                    { time: '11:01 Aug 9', score: '66', cluster: '—', mcap: '$416K', r4: '+181%', r24: '-63.5%', win: false },
                    { time: '11:30 Aug 9', score: '69', cluster: '—', mcap: '$527K', r4: '+120%', r24: '-71.9%', win: false },
                    { time: '11:45 Aug 9', score: '74', cluster: 'SYBIL', mcap: '$860K', r4: '+28%', r24: '-82.8%', win: false },
                    { time: '12:15 Aug 9', score: '74', cluster: 'SYBIL', mcap: '$948K', r4: '+16%', r24: '-84.4%', win: false },
                    { time: '14:01 Aug 9', score: '69', cluster: '—', mcap: '$1.97M', r4: '-57%', r24: '-93.0%', win: false },
                    { time: '14:15 Aug 9', score: '72', cluster: 'SYBIL', mcap: '$2.45M', r4: '-63%', r24: '-94.1%', win: false },
                  ] as const).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '10px', color: '#888' }}>{row.time}</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#aaa' }}>{row.score}</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#aaa' }}>{row.cluster}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#aaa' }}>{row.mcap}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: row.r4.startsWith('+') ? '#00ff88' : '#ff6b6b' }}>{row.r4}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#ff6b6b', fontWeight: 'bold' }}>{row.r24}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ color: '#666', fontSize: '11px', marginTop: '8px' }}>Showing 9 of 14 tracked alerts. All 14 ended negative at 24h.</p>
            </div>

            <div style={{ background: '#111', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #ff6b6b' }}>
              <p style={{ color: '#aaa', lineHeight: '1.6', margin: 0 }}>
                <strong style={{ color: '#ff6b6b' }}>The tell:</strong> BARK's 4h returns peaked early
                (+931% on the 2nd alert) and <strong style={{ color: '#fff' }}>declined with every
                successive alert</strong> as market cap climbed. By the time mcap hit $860K, the 4h
                return had collapsed to +28%. At $1.97M, it was already negative (-57%). The 4h green
                candle wasn't the start of a move — it was the coordinated exit. Each new alert brought
                fresh exit liquidity for the wallets that bought at launch.
              </p>
            </div>
          </div>

          {/* REMUS - The Mirror Image */}
          <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #00ff8844' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>🪞 Case Study: REMUS — The Mirror Image</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              REMUS fired 16 alerts starting 14:30 UTC on August 9 — overlapping BARK's window. Same
              scanner, same SYBIL-heavy cluster mix, similar alert count. But the outcome was inverted:
              <strong style={{ color: '#00ff88' }}> 9 out of 13 tracked alerts were green at 24h</strong>{' '}
              (69% win rate). The difference was in the 4-hour behavior. REMUS's 4h candles were chaotic
              — +100%, -71%, -78%, +30% — no clean pump pattern. The price discovery was messy, which
              meant <strong style={{ color: '#fff' }}>no coordinated exit</strong>. The token actually
              found a floor and held.
            </p>

            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #333' }}>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#00ff88' }}>Time (UTC)</th>
                    <th style={{ padding: '10px', textAlign: 'center', color: '#00ff88' }}>Score</th>
                    <th style={{ padding: '10px', textAlign: 'center', color: '#00ff88' }}>Cluster</th>
                    <th style={{ padding: '10px', textAlign: 'right', color: '#00ff88' }}>Mcap</th>
                    <th style={{ padding: '10px', textAlign: 'right', color: '#00ff88' }}>4H Return</th>
                    <th style={{ padding: '10px', textAlign: 'right', color: '#00ff88' }}>24H Return</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { time: '14:30 Aug 9', score: '73', cluster: 'SYBIL', mcap: '$122K', r4: '-95%', r24: '-97.6%', win: false },
                    { time: '14:45 Aug 9', score: '74', cluster: 'SYBIL', mcap: '$283K', r4: '+101%', r24: '+577.6%', win: true },
                    { time: '15:16 Aug 9', score: '77', cluster: 'SYBIL', mcap: '$825K', r4: '-72%', r24: '+132.3%', win: true },
                    { time: '15:30 Aug 9', score: '77', cluster: 'SYBIL', mcap: '$1.38M', r4: '-78%', r24: '+38.4%', win: true },
                    { time: '15:31 Aug 9', score: '71', cluster: 'SYBIL', mcap: '$1.29M', r4: '-78%', r24: '+41.9%', win: true },
                    { time: '15:45 Aug 9', score: '62', cluster: '—', mcap: '$26K', r4: '-84%', r24: '-84.3%', win: false },
                    { time: '17:31 Aug 9', score: '73', cluster: 'SYBIL', mcap: '$885K', r4: '-69%', r24: '-8.7%', win: false },
                    { time: '21:15 Aug 9', score: '56', cluster: '—', mcap: '$419K', r4: '+31%', r24: '+7.9%', win: true },
                    { time: '00:15 Aug 10', score: '55', cluster: '—', mcap: '$310K', r4: '+29%', r24: '+134.6%', win: true },
                  ] as const).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '10px', color: '#888' }}>{row.time}</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#aaa' }}>{row.score}</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#aaa' }}>{row.cluster}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#aaa' }}>{row.mcap}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: row.r4.startsWith('+') ? '#00ff88' : '#ff6b6b' }}>{row.r4}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: row.win ? '#00ff88' : '#ff6b6b', fontWeight: 'bold' }}>{row.r24}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ color: '#666', fontSize: '11px', marginTop: '8px' }}>Showing 9 of 13 tracked alerts. 9/13 ended green at 24h.</p>
            </div>

            <div style={{ background: '#111', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #00ff88' }}>
              <p style={{ color: '#aaa', lineHeight: '1.6', margin: 0 }}>
                <strong style={{ color: '#00ff88' }}>The tell:</strong> REMUS's 4h returns were messy —
                deep red (-78%) alongside moderate green (+101%). There was no clean coordinated pump
                pattern. <strong style={{ color: '#fff' }}>Messy 4h = organic price discovery.</strong>{' '}
                Clean euphoric 4h (BARK's +931%) = coordinated exit already in progress. The tokens that
                look worst at 4h sometimes have the best 24h — because nobody's rushing for the exit yet.
              </p>
            </div>
          </div>

          {/* The Mirror Comparison */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#fff', marginBottom: '20px' }}>⚡ Head-to-Head: BARK vs REMUS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: '#0a0a0a', padding: '25px', borderRadius: '12px', border: '1px solid #ff6b6b33' }}>
                <h3 style={{ color: '#ff6b6b', marginBottom: '15px' }}>BARK 📉</h3>
                <div style={{ color: '#aaa', fontSize: '14px', lineHeight: '2' }}>
                  <div>Alerts: <strong style={{ color: '#fff' }}>15</strong></div>
                  <div>24h tracked: <strong style={{ color: '#fff' }}>14</strong></div>
                  <div>Winners: <strong style={{ color: '#ff6b6b' }}>0 (0%)</strong></div>
                  <div>Best 4h: <strong style={{ color: '#00ff88' }}>+931%</strong></div>
                  <div>Best 24h: <strong style={{ color: '#ff6b6b' }}>-27.1%</strong></div>
                  <div>Worst 24h: <strong style={{ color: '#ff6b6b' }}>-94.1%</strong></div>
                  <div>Mcap range: <strong style={{ color: '#fff' }}>$17K → $2.45M</strong></div>
                  <div>4h pattern: <strong style={{ color: '#00ff88' }}>clean euphoric pump</strong></div>
                </div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '25px', borderRadius: '12px', border: '1px solid #00ff8833' }}>
                <h3 style={{ color: '#00ff88', marginBottom: '15px' }}>REMUS 📈</h3>
                <div style={{ color: '#aaa', fontSize: '14px', lineHeight: '2' }}>
                  <div>Alerts: <strong style={{ color: '#fff' }}>16</strong></div>
                  <div>24h tracked: <strong style={{ color: '#fff' }}>13</strong></div>
                  <div>Winners: <strong style={{ color: '#00ff88' }}>9 (69.2%)</strong></div>
                  <div>Best 4h: <strong style={{ color: '#00ff88' }}>+101%</strong></div>
                  <div>Best 24h: <strong style={{ color: '#00ff88' }}>+577.6%</strong></div>
                  <div>Worst 24h: <strong style={{ color: '#ff6b6b' }}>-97.6%</strong></div>
                  <div>Mcap range: <strong style={{ color: '#fff' }}>$26K → $1.38M</strong></div>
                  <div>4h pattern: <strong style={{ color: '#ff6b6b' }}>messy, mixed</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* ALFE - New Pair Reset */}
          <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #ffaa0044' }}>
            <h2 style={{ color: '#ffaa00', marginBottom: '20px' }}>🔄 Case Study: ALFE — The New Pair Reset</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              Yesterday we showed TOAD re-launching as a new pair at $38K and pumping +536%. Today's data
              gave us a second example. <strong style={{ color: '#fff' }}>ALFE</strong> was first alerted
              on pair address <code style={{ color: '#00ff88', fontSize: '12px' }}>5mL2...7i72</code> at
              a $77K market cap. Wolf fired 3 alerts on this pair as mcap climbed to $379K. All three went
              <strong style={{ color: '#ff6b6b' }}> negative at 24h</strong> (-77%, -92%, -96%). Then ALFE
              launched on a <strong style={{ color: '#fff' }}>completely new pair</strong>{' '}
              (<code style={{ color: '#00ff88', fontSize: '12px' }}>SibL...Dm8</code>) at $415K mcap. That
              single alert did <strong style={{ color: '#00ff88' }}>+7,939% at 24h</strong> — the biggest
              print of the session. Same ticker, same scanner, different pair address = different token
              lifecycle. The decay curve resets when insiders migrate to fresh liquidity.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ background: '#111', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#ff6b6b', fontSize: '14px', marginBottom: '5px' }}>Pair 1 (5mL2...)</div>
                <div style={{ color: '#888', fontSize: '12px' }}>3 alerts: -77% / -92% / -96%</div>
              </div>
              <div style={{ background: '#111', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '14px', marginBottom: '5px' }}>Pair 2 (SibL...)</div>
                <div style={{ color: '#00ff88', fontSize: '20px', fontWeight: 'bold' }}>+7,939%</div>
              </div>
            </div>
          </div>

          {/* Score Band Analysis */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>🏆 Score Band Analysis</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              The score inversion continues to deepen. Score &lt;60 had the highest win rate at{' '}
              <strong style={{ color: '#00ff88' }}>26.3%</strong>. Score 80-89 collapsed to{' '}
              <strong style={{ color: '#ff6b6b' }}>5.3%</strong> (1 winner out of 19). Score 90+ remains
              a death sentence: <strong style={{ color: '#ff6b6b' }}>0/2, averaging -99.8%</strong>. Score
              100 has been extinct for 9 consecutive sessions. The scanner's score is now inversely
              correlated with profitability — the higher the score, the more likely the token is already
              primed for a coordinated exit.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #333' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88' }}>Score Band</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#00ff88' }}>Alerts</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#00ff88' }}>Winners</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#00ff88' }}>Win Rate</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#00ff88' }}>Avg Return</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { band: 'Score < 60', n: 19, wins: 5, wr: '26.3%', avg: '-29.6%', best: true },
                    { band: 'Score 60-69', n: 62, wins: 5, wr: '8.1%', avg: '-43.3%', best: false },
                    { band: 'Score 70-79', n: 118, wins: 20, wr: '16.9%', avg: '+18.7%', best: false },
                    { band: 'Score 80-89', n: 19, wins: 1, wr: '5.3%', avg: '-67.2%', best: false },
                    { band: 'Score 90+', n: 2, wins: 0, wr: '0.0%', avg: '-99.8%', best: false },
                    { band: 'Score 100', n: 0, wins: 0, wr: 'EXTINCT', avg: '—', best: false },
                  ] as const).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '12px', color: row.best ? '#00ff88' : '#aaa', fontWeight: row.best ? 'bold' : 'normal' }}>{row.band}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#aaa' }}>{row.n}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#aaa' }}>{row.wins}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: row.best ? '#00ff88' : '#aaa', fontWeight: row.best ? 'bold' : 'normal' }}>{row.wr}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: row.avg.startsWith('+') ? '#00ff88' : '#ff6b6b' }}>{row.avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Return Distribution */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>📉 The 24H Return Distribution</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              The median 24h return was <strong style={{ color: '#ff6b6b' }}>-88.6%</strong>. Nearly half
              of all tracked alerts (48.2%) ended below -90%. Only <strong style={{ color: '#00ff88' }}>7.3%</strong>{' '}
              of alerts finished above +100%. This is the brutal math of meme token trading: the floor is
              where most tokens live, and the ceiling is reserved for the few that find real liquidity
              before the exit.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {([
                { label: '> +500%', count: '4', pct: '1.8%', color: '#00ff88' },
                { label: '+100% to +500%', count: '12', pct: '5.5%', color: '#00ff88' },
                { label: '0 to +100%', count: '15', pct: '6.8%', color: '#7fd' },
                { label: '-50% to 0%', count: '14', pct: '6.4%', color: '#ffaa00' },
                { label: '-90% to -50%', count: '69', pct: '31.4%', color: '#ff6b6b' },
                { label: '< -90%', count: '106', pct: '48.2%', color: '#ff6b6b' },
              ] as const).map((b, i) => (
                <div key={i} style={{ background: '#0a0a0a', padding: '15px', borderRadius: '10px', textAlign: 'center', borderTop: `3px solid ${b.color}` }}>
                  <div style={{ color: b.color, fontSize: '22px', fontWeight: 'bold' }}>{b.pct}</div>
                  <div style={{ color: '#888', fontSize: '11px', marginTop: '4px' }}>{b.label}</div>
                  <div style={{ color: '#555', fontSize: '10px' }}>{b.count} alerts</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Takeaways */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #00ff88' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>🎯 Key Takeaways</h2>
            <ol style={{ color: '#aaa', lineHeight: '2.2', paddingLeft: '20px', fontSize: '15px' }}>
              <li><strong style={{ color: '#fff' }}>The 4-hour candle is a trap, not a signal.</strong> BARK's +931% at 4h was the coordinated exit already in progress. By 24h, 0/14 alerts were green. If the 4h return is euphoric and clean, the exit is already happening.</li>
              <li><strong style={{ color: '#fff' }}>Messy 4h = organic discovery.</strong> REMUS's 4h candles were all over the place (-78%, +101%, -69%). That chaos meant no coordinated exit — and 9/13 alerts held green at 24h.</li>
              <li><strong style={{ color: '#fff' }}>Score inversion deepens.</strong> Score &lt;60: 26.3% win rate. Score 80-89: 5.3%. Score 90+: 0%. Score 100: extinct 9 days running. The scanner's high scores now mark exit-primed tokens, not quality ones.</li>
              <li><strong style={{ color: '#fff' }}>New pair = decay curve reset.</strong> ALFE's first pair went -77% to -96% across 3 alerts. Its second pair (new address) did +7,939%. Same ticker, fresh liquidity, different lifecycle.</li>
              <li><strong style={{ color: '#fff' }}>The median is the message.</strong> Median 24h return: -88.6%. Nearly half of all alerts end below -90%. The few winners (+577%, +7,939%) are outliers — position sizing for the floor, not the ceiling.</li>
            </ol>
          </div>

          {/* Previous Days */}
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ color: '#888', marginBottom: '15px', fontSize: '14px' }}>Previous Wolf Pack Insights:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="/insights/toad-decay-curve-wolf-data-2026-08-10" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '13px' }}>← Aug 10: The Decay Curve — TOAD 66x From $190K, Then -44% at $14.7M</a>
              <a href="/insights/bid-one-minute-window-wolf-data-2026-08-09" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '13px' }}>← Aug 9: The 1-Minute Window — BID Did 5,151x at $53K</a>
              <a href="/insights/elon-identity-split-wolf-data-2026-08-07" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '13px' }}>← Aug 7: The Identity Split — ELON Score 64 Did 40x, Score 84 Died</a>
            </div>
          </div>

        </div>
      </Layout>
    </>
  )
}
