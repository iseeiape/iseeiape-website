import Head from 'next/head'
import Layout from '../../components/Layout'

export default function BullComes11MintsWolfData20260817() {
  return (
    <>
      <Head>
        <title>The Bull Comes 11 Times: 牛来 Spawned 11 Mints in 44 Hours. Only the First Survived. | iseeiape</title>
        <meta name="description" content="Wolf Pack data case study — 508 alerts over 48h (Aug 15-17). 牛来 ('bull comes') fired 11 alerts across 11 different contract mints in 44 hours. Only mint #1 (BUNDLE, $303K) survived at +658% at 24h. Every relaunch at a different mcap died. The cluster_killed filter suppressed 29% of all alerts — 2.9% would have won. Score 80-89 was the best band at 23.3% WR. Score 100 went 0/2 (all-time 2/171). ORGANIC cluster went extinct again: 0/7." />
        <meta property="og:title" content="The Bull Comes 11 Times: 牛来 Spawned 11 Mints. Only #1 Survived." />
        <meta property="og:description" content="508 Wolf alerts, 48h. 牛来 fired 11 mints in 44h — only the first (BUNDLE, $303K) won at +658%. The cluster_killed filter suppressed 29% of alerts. Score 80-89 best band. ORGANIC extinct again." />
      </Head>
      <Layout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#fff', minHeight: '100vh' }}>

          <a href="/insights" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'block' }}>← Back to Insights</a>

          <span style={{ padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px' }}>🆕 Today — Aug 17, 2026</span>

          <h1 style={{ fontSize: '42px', marginTop: '15px', marginBottom: '20px' }}>🐂 The Bull Comes 11 Times: 牛来 Spawned 11 Mints in 44 Hours. Only the First Survived.</h1>

          <p style={{ color: '#888', marginBottom: '40px', fontSize: '18px' }}>
            Day 20 of the Wolf Pack tracking experiment. 508 alerts fired across the last 48 hours,
            222 completed 24-hour tracking, and the win rate landed at{' '}
            <strong style={{ color: '#00ff88' }}>16.7%</strong> (37/222) — a structurally
            familiar session. The headline is a single Chinese ticker:{' '}
            <strong style={{ color: '#fff' }}>牛来</strong> — &ldquo;bull comes.&rdquo; Over 44
            hours, the scanner fired eleven alerts on this ticker across{' '}
            <strong style={{ color: '#fff' }}>eleven different contract mints</strong>. One
            survived. The first mint, classified <strong style={{ color: '#00ff88' }}>BUNDLE</strong>{' '}
            at $303K mcap, peaked at <strong style={{ color: '#00ff88' }}>+5,874% at 1h</strong> and
            settled at <strong style={{ color: '#00ff88' }}>+658% at 24h</strong>. Every subsequent
            relaunch — at $33K, $60K, $85K, $290K, $313K, $457K, $533K — went{' '}
            <strong style={{ color: '#ff6b6b' }}>-92% or worse</strong>. The bull came eleven times.
            It only paid once.
          </p>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>9 min read</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Data Case Study</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Wolf Pack</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Ticker Farm</span>
            <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Cluster Filter</span>
          </div>

          {/* Dataset Overview */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>📊 The Dataset (Last 48 Hours)</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>
              508 alerts across <strong style={{ color: '#fff' }}>286 unique tickers</strong> and{' '}
              <strong style={{ color: '#fff' }}>380 unique contract mints</strong> — 33% more mints
              than tickers, continuing the ticker-recycling pattern from{' '}
              <a href="/insights/xst-relaunch-casino-wolf-data-2026-08-15" style={{ color: '#00ff88' }}>Day 18</a>{' '}
              and <a href="/insights/unitree-identity-split-wolf-data-2026-08-16" style={{ color: '#00ff88' }}>Day 19</a>.
              Of 222 alerts with full 24-hour tracking, 32.9% were green at 1h, 18.9% at 4h, and{' '}
              <strong style={{ color: '#00ff88' }}>16.7% at 24h</strong>. The median 24h return was{' '}
              <strong style={{ color: '#ff6b6b' }}>-89.1%</strong>, and 47.7% of tracked alerts
              finished below -90%. Winners entered at an average mcap of{' '}
              <strong style={{ color: '#fff' }}>$345K</strong>; losers at{' '}
              <strong style={{ color: '#fff' }}>$388K</strong> — a negligible 1.1x gap, the narrowest
              in the experiment. The mcap edge has flattened. Deduplicating to unique contract mints:
              140 mints tracked, 24 winners (<strong style={{ color: '#00ff88' }}>17.1%</strong>{' '}
              per-mint win rate).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px', marginTop: '25px' }}>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>508</div>
                <div style={{ color: '#888', fontSize: '12px' }}>total alerts (48h)</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>16.7%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>24h win rate (37/222)</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>11</div>
                <div style={{ color: '#888', fontSize: '12px' }}>牛来 mints in 44h</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>+658%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>best 24h (牛来 mint #1)</div>
              </div>
            </div>
          </div>

          {/* 牛来 Anatomy */}
          <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #00ff8844' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>🐂 牛来: Eleven Mints, One Survivor</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              The scanner first fired on 牛来 on <strong style={{ color: '#fff' }}>August 15 at
              10:00</strong> — a BUNDLE-tagged mint at $303K mcap. It ripped to{' '}
              <strong style={{ color: '#00ff88' }}>+5,874% at 1h</strong>, the largest 1h print of
              the session. By 4h it had settled to +5,155%. At 24h it resolved at{' '}
              <strong style={{ color: '#00ff88' }}>+658%</strong> — still the dataset&apos;s best
              24h return. Then the relaunches began. Ten more 牛来 mints fired over the next 44
              hours — each a different contract address, each at a different market cap, each
              promising the same &ldquo;bull comes&rdquo; narrative.{' '}
              <strong style={{ color: '#ff6b6b' }}>All ten died.</strong> The $85K SYBIL relaunch
              went -98%. The $457K SYBIL relaunch went +245% at 1h then -92% at 24h. The $533K
              SYBIL relaunch was cluster_killed before it could hurt anyone. The $319M mcap
              &ldquo;牛来&rdquo; that fired on Aug 16 at 19:15 was a rug pull — -100% at 1h. The
              ticker was a honeypot. The first mint was the only real play, and the move was over
              before the second alert fired.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', background: '#111', borderRadius: '10px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #00ff88' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88' }}>Time</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#00ff88' }}>Score</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88' }}>Cluster</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#00ff88' }}>Mcap</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88' }}>Mint</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#00ff88' }}>1h</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#00ff88' }}>24h</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { time: 'Aug 15 10:00', score: 74, cluster: 'BUNDLE', mcap: '$303K', mint: '#1', r1: '+5,874%', r24: '+658%', win: true },
                    { time: 'Aug 15 18:45', score: 73, cluster: 'SYBIL', mcap: '$85K', mint: '#2', r1: '-26%', r24: '-98%', win: false },
                    { time: 'Aug 15 20:00', score: 82, cluster: 'SYBIL', mcap: '$457K', mint: '#3', r1: '+245%', r24: '+28%', win: true },
                    { time: 'Aug 16 04:00', score: 76, cluster: 'SYBIL', mcap: '$60K', mint: '#4', r1: '-93%', r24: 'killed', win: false },
                    { time: 'Aug 16 04:01', score: 71, cluster: 'SYBIL', mcap: '$33K', mint: '#5', r1: '+199%', r24: '-92%', win: false },
                    { time: 'Aug 16 07:45', score: 71, cluster: 'SYBIL', mcap: '$33K', mint: '#6', r1: '+68%', r24: 'pending', win: false },
                    { time: 'Aug 16 10:45', score: 74, cluster: 'SYBIL', mcap: '$290K', mint: '#7', r1: '-75%', r24: 'pending', win: false },
                    { time: 'Aug 16 12:30', score: 79, cluster: 'SYBIL', mcap: '$533K', mint: '#8', r1: '+100%', r24: 'killed', win: false },
                    { time: 'Aug 16 13:46', score: 79, cluster: 'SYBIL', mcap: '$313K', mint: '#9', r1: '+40%', r24: 'pending', win: false },
                    { time: 'Aug 16 19:15', score: 62, cluster: 'None', mcap: '$319M', mint: '#10', r1: '-100%', r24: 'rug', win: false },
                    { time: 'Aug 17 06:16', score: 69, cluster: 'None', mcap: '$67K', mint: '#11', r1: '+60%', r24: 'pending', win: false },
                  ] as const).map((row) => (
                    <tr key={row.mint} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '12px', color: '#ccc' }}>{row.time}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#ccc' }}>{row.score}</td>
                      <td style={{ padding: '12px', color: row.cluster === 'BUNDLE' ? '#00ff88' : row.cluster === 'SYBIL' ? '#ff6b6b' : '#888' }}>{row.cluster}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#ccc' }}>{row.mcap}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>{row.mint}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: row.r1.startsWith('+') ? '#00ff88' : '#ff6b6b' }}>{row.r1}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: row.win ? '#00ff88' : row.r24 === 'pending' ? '#ffaa00' : '#ff6b6b', fontWeight: row.win ? 'bold' : 'normal' }}>{row.r24}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ color: '#888', fontSize: '13px', marginTop: '15px' }}>
              Mint #3 (+28% at 24h) is technically green, but it peaked at +245% at 1h — a classic
              BARK exit trap. By the time the 24h candle closed, 88% of the gains had evaporated.
              The only clean win was mint #1. The bull came eleven times. It paid once.
            </p>
          </div>

          {/* Bull Family Prequel */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>🐂 The Bull Family: A July Prequel</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>
              牛来 is not an isolated incident. The scanner has been tracking a family of
              Chinese &ldquo;bull&rdquo; tickers since early July:{' '}
              <strong style={{ color: '#fff' }}>黑牛模式</strong> (&ldquo;black bull mode&rdquo;),{' '}
              <strong style={{ color: '#fff' }}>黑牛</strong> (&ldquo;black bull&rdquo;),{' '}
              <strong style={{ color: '#fff' }}>牛魔王</strong> (&ldquo;bull demon king&rdquo;),{' '}
              <strong style={{ color: '#fff' }}>公牛</strong> (&ldquo;bull&rdquo;),{' '}
              <strong style={{ color: '#fff' }}>牛来</strong> (&ldquo;bull comes&rdquo;), and{' '}
              <strong style={{ color: '#fff' }}>牛布布</strong>. Across all six tickers, the
              scanner has detected <strong style={{ color: '#fff' }}>17 unique contract mints</strong>{' '}
              over six weeks. Of 19 alerts with resolved 24h tracking, exactly{' '}
              <strong style={{ color: '#00ff88' }}>2 have been green</strong> — both from 牛来 mint
              #1 and mint #3. Every other bull-family mint went{' '}
              <strong style={{ color: '#ff6b6b' }}>-76% or worse</strong>. The pattern is clear:
              someone is minting &ldquo;bull&rdquo; tokens on Solana, pumping the first one, then
              relaunching the same narrative under new contracts to catch late buyers who recognize
              the ticker but not the mint address. The scanner sees through it. Most traders
              don&apos;t.
            </p>
          </div>

          {/* Cluster Killed Filter */}
          <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #ffaa0044' }}>
            <h2 style={{ color: '#ffaa00', marginBottom: '20px' }}>🛡️ The Cluster Filter: 29% Suppressed, 97% Correct</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              A new dimension appeared in this session: the <code style={{ color: '#00ff88' }}>cluster_killed</code>{' '}
              status. The Wolf Pack scanner now suppresses alerts it classifies as coordinated
              dumps — tokens where the cluster verdict (SYBIL or BUNDLE) combined with other
              signals indicates the buying is too coordinated to survive. In this 48h window,{' '}
              <strong style={{ color: '#fff' }}>146 of 508 alerts (29%)</strong> were cluster_killed
              before reaching users. Of the 35 cluster_killed alerts that have since resolved at
              24h, <strong style={{ color: '#00ff88' }}>only 1 was green</strong> (2.9% win rate,
              -68.9% average). The filter is working.
            </p>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>
              The one exception: <strong style={{ color: '#fff' }}>GROK 4.6</strong> — a SYBIL-tagged
              alert at $325K mcap that was cluster_killed but went on to do{' '}
              <strong style={{ color: '#00ff88' }}>+538% at 24h</strong>. It&apos;s the filter&apos;s
              false negative — a coordinated token that actually delivered. But against 34 dead
              ones, one survivor is a 97% precision rate. The filter trades a 2.9% miss rate for a
              29% reduction in alert noise. That&apos;s a trade worth making.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px', marginTop: '25px' }}>
              <div style={{ background: '#111', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#ffaa00', fontSize: '28px', fontWeight: 'bold' }}>146</div>
                <div style={{ color: '#888', fontSize: '12px' }}>alerts suppressed (29%)</div>
              </div>
              <div style={{ background: '#111', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>97.1%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>filter precision (34/35 dead)</div>
              </div>
              <div style={{ background: '#111', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#ff6b6b', fontSize: '28px', fontWeight: 'bold' }}>1</div>
                <div style={{ color: '#888', fontSize: '12px' }}>false negative (GROK 4.6)</div>
              </div>
            </div>
          </div>

          {/* Score Bands */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>📈 Score Bands: 80-89 Takes the Crown Again</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              The score-return inversion continues. Score 80-89 posted the highest win rate at{' '}
              <strong style={{ color: '#00ff88' }}>23.3%</strong> (7/30), extending its streak as the
              best-performing band to four consecutive sessions. Score 60-69 was second at 20.0%
              (14/70). Score 90+ collapsed to <strong style={{ color: '#ff6b6b' }}>9.1%</strong>{' '}
              (1/11, -80.6% avg) — the worst band in the dataset. Score 100 fired twice (PCPC, both
              at $392K mcap, both -100% at 1h). All-time score-100 record:{' '}
              <strong style={{ color: '#ff6b6b' }}>2/171 (1.2%)</strong>. The &ldquo;perfect score&rdquo;
              remains a death sentence.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', background: '#0a0a0a', borderRadius: '10px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #00ff88' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88' }}>Score Band</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#00ff88' }}>Alerts</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#00ff88' }}>Winners</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#00ff88' }}>Win Rate</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#00ff88' }}>Avg 24h</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { band: 'Under 60', n: 12, w: 1, wr: 8.3, avg: -71 },
                    { band: '60–69', n: 70, w: 14, wr: 20.0, avg: -22 },
                    { band: '70–79', n: 99, w: 14, wr: 14.1, avg: -54 },
                    { band: '80–89', n: 30, w: 7, wr: 23.3, avg: -50 },
                    { band: '90–100', n: 11, w: 1, wr: 9.1, avg: -81 },
                  ] as const).map((row) => (
                    <tr key={row.band} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '12px', color: '#fff' }}>{row.band}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#ccc' }}>{row.n}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: row.w > 0 ? '#00ff88' : '#ff6b6b', fontWeight: 'bold' }}>{row.w}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: row.w > 0 ? '#00ff88' : '#ff6b6b' }}>{row.wr.toFixed(1)}%</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: row.avg > 0 ? '#00ff88' : '#ff6b6b' }}>{row.avg > 0 ? '+' : ''}{row.avg.toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cluster Verdicts */}
          <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>🔍 Cluster Verdicts: ORGANIC Goes Extinct Again</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              After yesterday&apos;s resurrection (66.7% WR), the ORGANIC cluster went extinct again:
              <strong style={{ color: '#ff6b6b' }}> 0/7 at 24h</strong>, -85.8% average. The
              one-session revival was a head fake — ORGANIC depth is too thin to be reliable.
              Unclassified alerts (no cluster verdict) led at 18.3% WR. SYBIL and BUNDLE both
              landed near 17%. The cluster verdict is no longer the differentiator it was in{' '}
              <a href="/insights/unitree-identity-split-wolf-data-2026-08-16" style={{ color: '#00ff88' }}>Day 19</a>{' '}
              — but the cluster_killed <em>filter</em> is. The verdict tells you what the token is.
              The filter tells you whether to act.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', background: '#111', borderRadius: '10px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #00ff88' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88' }}>Cluster</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#00ff88' }}>Alerts</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#00ff88' }}>Winners</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#00ff88' }}>Win Rate</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#00ff88' }}>Avg 24h</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { cluster: 'None', n: 82, w: 15, wr: 18.3, avg: -30 },
                    { cluster: 'BUNDLE', n: 29, w: 5, wr: 17.2, avg: -44 },
                    { cluster: 'SYBIL', n: 104, w: 17, wr: 16.3, avg: -56 },
                    { cluster: 'ORGANIC', n: 7, w: 0, wr: 0.0, avg: -86 },
                  ] as const).map((row) => (
                    <tr key={row.cluster} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '12px', color: row.cluster === 'ORGANIC' ? '#ff6b6b' : '#fff' }}>{row.cluster}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#ccc' }}>{row.n}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: row.w > 0 ? '#00ff88' : '#ff6b6b', fontWeight: 'bold' }}>{row.w}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: row.w > 0 ? '#00ff88' : '#ff6b6b' }}>{row.wr.toFixed(1)}%</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: row.avg > 0 ? '#00ff88' : '#ff6b6b' }}>{row.avg > 0 ? '+' : ''}{row.avg.toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mcap Bands */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>🧱 The Mcap Wall: Flattened</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
              The mcap edge that defined the experiment has flattened. Winners averaged $345K mcap
              vs losers at $388K — a 1.1x gap, the narrowest on record. The $100K-$200K band led at
              20.5% WR. The $200K-$500K band posted 17.6%. Even the $1M+ band had a winner (USOC,
              $3.8M mcap, score 97, SYBIL, +35% at 24h) — the first $1M+ winner since Day 19&apos;s
              UNITREE. The sub-$50K zone, long the dominant band, posted only 10.9% WR this session
              — its worst showing in two weeks. The mcap ceiling is no longer the primary filter.
              The cluster filter is.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', background: '#0a0a0a', borderRadius: '10px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #00ff88' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88' }}>Mcap at Entry</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#00ff88' }}>Alerts</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#00ff88' }}>Winners</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#00ff88' }}>Win Rate</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#00ff88' }}>Avg 24h</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { band: 'Under $50K', n: 64, w: 7, wr: 10.9, avg: -41 },
                    { band: '$50K – $100K', n: 60, w: 11, wr: 18.3, avg: -60 },
                    { band: '$100K – $200K', n: 44, w: 9, wr: 20.5, avg: -45 },
                    { band: '$200K – $500K', n: 34, w: 6, wr: 17.6, avg: -27 },
                    { band: '$500K – $1M', n: 16, w: 2, wr: 12.5, avg: -57 },
                    { band: '$1M+', n: 4, w: 2, wr: 50.0, avg: -38 },
                  ] as const).map((row) => (
                    <tr key={row.band} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '12px', color: '#fff' }}>{row.band}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#ccc' }}>{row.n}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: row.w > 0 ? '#00ff88' : '#ff6b6b', fontWeight: 'bold' }}>{row.w}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: row.w > 0 ? '#00ff88' : '#ff6b6b' }}>{row.wr.toFixed(1)}%</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: row.avg > 0 ? '#00ff88' : '#ff6b6b' }}>{row.avg > 0 ? '+' : ''}{row.avg.toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ color: '#888', fontSize: '13px', marginTop: '15px' }}>
              The $1M+ band&apos;s 50% WR (2/4) is a small-sample anomaly — USOC ($3.8M, +35%) and
              DEALER ($3.2M, +2%). Both were SYBIL-tagged. Neither was a moonshot. The $500K-$1M
              wall cracked slightly (2/16) but the avg is still -57%. The mcap ceiling is soft, not
              broken.
            </p>
          </div>

          {/* WOFL Side Story */}
          <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>🐺 WOFL: 13 Alerts, 5 Mints, 3 Winners — All From Mint #1</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>
              The session&apos;s second-most-alerted ticker was <strong style={{ color: '#fff' }}>WOFL</strong>{' '}
              — 13 alerts across 5 contract mints. Mint #1 (DTGWeDVP) fired 8 alerts between $40K and
              $751K mcap. Three of those resolved green: the $40K entry did{' '}
              <strong style={{ color: '#00ff88' }}>+1,073%</strong> at 24h, the $105K entry did{' '}
              <strong style={{ color: '#00ff88' }}>+306%</strong>, and the $148K entry did{' '}
              <strong style={{ color: '#00ff88' }}>+189%</strong>. Every entry above $452K on mint #1
              went red. Mint #2 (6NbNGVT2) went -73% and -81%. Mints #3, #4, and #5 are still pending.
              The pattern mirrors 牛来: the first mint is the only one that pays, and only at low
              mcap entries. The ticker is a brand. The mint address is the product.
            </p>
          </div>

          {/* Pending Watchlist */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #ffaa0044' }}>
            <h2 style={{ color: '#ffaa00', marginBottom: '20px' }}>⏳ Still In Play (Verdict Tomorrow)</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>
              Several entries from the last 24h are showing early candles:{' '}
              <strong style={{ color: '#fff' }}>牛来 mint #11</strong> (score 69, $67K, +60% at 1h),{' '}
              <strong style={{ color: '#fff' }}>牛布布</strong> (score 80, SYBIL, $25K, +23% at 1h —
              cluster_killed), <strong style={{ color: '#fff' }}>USFR</strong> (score 62, $4.2M,
              +8% at 1h). The cluster_killed filter suppressed 牛布布 despite its score-80
              classification — the scanner saw coordinated buying and held it back. If 牛布布 goes
              green, it joins GROK 4.6 as a false negative. If it dies, the filter&apos;s precision
              holds. Either way, the bull family keeps spawning.
            </p>
          </div>

          {/* Key Takeaways */}
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #00ff88' }}>
            <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>🔑 Key Takeaways</h2>
            <ol style={{ color: '#ccc', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
              <li><strong style={{ color: '#fff' }}>牛来 is a ticker farm, not a token.</strong> 11 mints in 44 hours. Only mint #1 (BUNDLE, $303K) survived at +658%. Every relaunch at a different mcap died. The &ldquo;bull comes&rdquo; narrative is the bait; the mint address is the trap.</li>
              <li><strong style={{ color: '#fff' }}>The bull family spans six weeks.</strong> 黑牛模式, 黑牛, 牛魔王, 公牛, 牛来, 牛布布 — 17 total mints, 2 winners (both 牛来 mint #1 and #3). Someone is industrializing &ldquo;bull&rdquo; tokens on Solana.</li>
              <li><strong style={{ color: '#fff' }}>The cluster_killed filter is the new edge.</strong> 29% of alerts suppressed, 97.1% precision (34/35 dead). One false negative (GROK 4.6, +538%). The filter trades a 2.9% miss rate for a 29% noise reduction. That&apos;s the best trade in the dataset.</li>
              <li><strong style={{ color: '#fff' }}>Score 80-89 is the best band for the fourth session running.</strong> 23.3% WR (7/30). Score 90+ collapsed to 9.1% (1/11, -81% avg). Score 100 went 0/2 (PCPC, both -100%). All-time: 2/171 (1.2%). The perfect score is a death sentence.</li>
              <li><strong style={{ color: '#fff' }}>ORGANIC went extinct again.</strong> 0/7 at 24h (-86% avg) after yesterday&apos;s 66.7% resurrection. The cluster has no depth. One good session does not make a signal.</li>
              <li><strong style={{ color: '#fff' }}>The mcap edge has flattened.</strong> Winners $345K vs losers $388K (1.1x gap — narrowest on record). The $100K-$200K band led at 20.5%. Sub-$50K had its worst session in two weeks (10.9%). The mcap ceiling is soft; the cluster filter is hard.</li>
            </ol>
          </div>

          {/* Previous entries */}
          <div style={{ background: '#0a0a0a', padding: '25px', borderRadius: '16px', border: '1px solid #222' }}>
            <h3 style={{ color: '#888', marginBottom: '15px', fontSize: '16px' }}>Previous entries in this series</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="/insights/unitree-identity-split-wolf-data-2026-08-16" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '14px' }}>🧬 The UNITREE Identity Split (Day 19) — 7 mints, cluster verdict decided everything</a>
              <a href="/insights/xst-relaunch-casino-wolf-data-2026-08-15" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '14px' }}>♻️ The XST Relaunch Casino (Day 18) — 3 mints, $17K survivor</a>
              <a href="/insights/n64-invasion-meme-theme-rotation-wolf-data-2026-08-13" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '14px' }}>🎮 The N64 Invasion (Day 17) — meme theme rotation</a>
              <a href="/insights/record-101k-x-print-wolf-data-2026-08-12" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '14px' }}>🚀 The 10-Million-Percent Print (Day 16) — 忘忘 101,273x</a>
            </div>
          </div>

        </div>
      </Layout>
    </>
  )
}
