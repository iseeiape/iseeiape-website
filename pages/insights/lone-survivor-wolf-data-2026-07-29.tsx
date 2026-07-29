import Layout from '../../components/Layout'

export default function LoneSurvivorWolfData() {
  return (
    <Layout title="The Lone Survivor: 371 Wolf Alerts, Exactly 1 Green at 24h | iseeiape">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#fff', minHeight: '100vh' }}>

        <a href="/insights" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'block' }}>← Back to Insights</a>

        <span style={{ padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px' }}>🆕 Today - Jul 29, 2026</span>

        <h1 style={{ fontSize: '42px', marginTop: '15px', marginBottom: '20px' }}>🕯️ The Lone Survivor: 371 Wolf Alerts, Exactly 1 Green at 24h</h1>

        <p style={{ color: '#888', marginBottom: '40px', fontSize: '18px' }}>
          Yesterday we showed you the 4-hour window. Today the market doubled down on the lesson: of the 106 Wolf Pack
          alerts from the last 48 hours that have a full 24-hour track record, exactly <strong style={{ color: '#00ff88' }}>one</strong> finished
          in profit. And it wasn't the highest score, the loudest signal, or the biggest pump. It was the boring one.
        </p>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>6 min read</span>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Data Case Study</span>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Wolf Pack</span>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Solana</span>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Survival Bias</span>
        </div>

        <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
          <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>📊 The Dataset (July 27–29, 2026)</h2>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            Every alert the Wolf Pack scanner fired in the last 48 hours — 371 alerts across 132 Solana tokens —
            returns measured from alert price at 1h, 4h, and 24h. Full firehose, no cherry-picking.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px', marginTop: '25px' }}>
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>371</div>
              <div style={{ color: '#888', fontSize: '12px' }}>alerts fired</div>
            </div>
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>132</div>
              <div style={{ color: '#888', fontSize: '12px' }}>unique tokens</div>
            </div>
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ color: '#ff6b6b', fontSize: '28px', fontWeight: 'bold' }}>64 / 106</div>
              <div style={{ color: '#888', fontSize: '12px' }}>down 90%+ at 24h</div>
            </div>
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>1</div>
              <div style={{ color: '#888', fontSize: '12px' }}>alert green at 24h</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '28px' }}>📉 The Decay Curve, Day 2</h2>
          <div style={{ background: '#111', padding: '25px', borderRadius: '12px', marginBottom: '30px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#aaa' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>Metric</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>1 Hour After Alert</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>4 Hours</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>24 Hours</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}><strong>Average return</strong></td>
                  <td style={{ padding: '15px' }}>+0.6%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>-34.1%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>-84.2%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}><strong>Alerts up +20% or more</strong></td>
                  <td style={{ padding: '15px', color: '#00ff88' }}>tracked live</td>
                  <td style={{ padding: '15px', color: '#00ff88' }}>54 (18%)</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>0 (0%)</td>
                </tr>
                <tr>
                  <td style={{ padding: '15px' }}><strong>Alerts in profit at all</strong></td>
                  <td style={{ padding: '15px', color: '#00ff88' }}>148 (40%)</td>
                  <td style={{ padding: '15px' }}>69 (23%)</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>1 (1%)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            Two independent 48-hour windows, two identical shapes: ~40% green at 1 hour, ~1% green at 24 hours.
            That's no longer an anecdote — it's a regime. The average alert was <em>flat to positive</em> at hour one
            and down 84% by hour 24. The edge exists. It just has a half-life measured in hours.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '28px' }}>🦆 Meet the Lone Survivor: DUKY</h2>
          <div style={{ background: '#111', padding: '25px', borderRadius: '12px', borderLeft: '4px solid #00ff88', marginBottom: '20px' }}>
            <p style={{ color: '#aaa', lineHeight: '1.7', fontSize: '15px' }}>
              Score 70 · 🆕 NEW_PAIR · July 27, 18:15 UTC · MCap $89K · Vol $145K · 5,478 buys vs 772 sells (1h)<br /><br />
              <strong style={{ color: '#ff6b6b' }}>-7%</strong> after 1h · <strong style={{ color: '#ff6b6b' }}>-2%</strong> after 4h · <strong style={{ color: '#00ff88' }}>+19%</strong> after 24h<br /><br />
              Look at that trajectory. DUKY didn't pump. It dipped, went sideways, and ground higher while everything
              around it evaporated. Score 70 — the scanner's <em>lowest-conviction passing grade</em>. No euphoric signal
              stack, no vertical candle, just a quiet micro-cap with steady buy pressure.
            </p>
          </div>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            Meanwhile the score bands tell the other half of the story. Alerts scoring <strong style={{ color: '#fff' }}>90+</strong> averaged
            <strong style={{ color: '#ff6b6b' }}> -99.1%</strong> at 24h. The 80–89 band averaged -89.8%. The 70–79 band — DUKY's neighborhood —
            averaged -75.2% but produced the only survivor. Maximum hype still marks the top. Boring still outlives loud.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '28px' }}>🪤 The Re-Alert Trap: SHAYDE's Autopsy</h2>
          <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
            73 of the 132 tokens were alerted more than once. SHAYDE shows why the second alert is not a second chance:
          </p>
          <div style={{ background: '#111', padding: '25px', borderRadius: '12px', marginBottom: '20px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#aaa' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88' }}>Alert (UTC)</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88' }}>Score</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88' }}>vs First Alert Price</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88' }}>1h</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88' }}>4h</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88' }}>24h</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '12px' }}>Jul 27, 05:45</td>
                  <td style={{ padding: '12px' }}>77</td>
                  <td style={{ padding: '12px' }}>entry</td>
                  <td style={{ padding: '12px' }}>+7%</td>
                  <td style={{ padding: '12px', color: '#00ff88' }}><strong>+73%</strong></td>
                  <td style={{ padding: '12px', color: '#ff6b6b' }}>-48%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '12px' }}>Jul 27, 09:45</td>
                  <td style={{ padding: '12px', color: '#ff6b6b' }}>88</td>
                  <td style={{ padding: '12px', color: '#ff6b6b' }}>+105% (2x higher)</td>
                  <td style={{ padding: '12px', color: '#ff6b6b' }}>-29%</td>
                  <td style={{ padding: '12px', color: '#ff6b6b' }}>-33%</td>
                  <td style={{ padding: '12px', color: '#ff6b6b' }}>-77%</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px' }}>Jul 27, 10:45</td>
                  <td style={{ padding: '12px' }}>53</td>
                  <td style={{ padding: '12px' }}>+62%</td>
                  <td style={{ padding: '12px', color: '#ff6b6b' }}>-16%</td>
                  <td style={{ padding: '12px', color: '#ff6b6b' }}>-18%</td>
                  <td style={{ padding: '12px', color: '#ff6b6b' }}>-70%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            The first alert was the trade: +73% inside the 4-hour window. Four hours later the scanner fired again at
            a <em>higher score</em> — because more hype was on-chain — but the entry was 2x the first alert's price and it
            bled -29% within the hour. A rising score on a re-alert doesn't mean the setup improved. It means
            <strong style={{ color: '#fff' }}> you're later</strong>.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '28px' }}>⚡ The Window Is Still Open — For Now</h2>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            It's not all graves. 54 alerts (18%) hit +20% or better inside 4 hours, and two monsters are still inside
            their windows as we write: <strong style={{ color: '#00ff88' }}>ATSUKO +1,190%</strong> and <strong style={{ color: '#00ff88' }}>GRASS +941%</strong> at
            the 4-hour mark (24h verdicts pending). The scanner keeps finding 10x candles. The data keeps saying the same
            thing about what to do with them: <strong style={{ color: '#fff' }}>take the win while the window is open.</strong>
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '28px' }}>🧭 Playbook Update (Day 2 Confirmation)</h2>
          <div style={{ background: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #222' }}>
            <ol style={{ color: '#aaa', lineHeight: '2', paddingLeft: '20px' }}>
              <li><strong style={{ color: '#fff' }}>The first alert is the trade; the re-alert is the trap.</strong> SHAYDE's score-88 re-entry was 2x the price and -29% in an hour. If you missed it, you missed it.</li>
              <li><strong style={{ color: '#fff' }}>Don't confuse survival with strength.</strong> DUKY won by not dying: -7% at 1h, flat at 4h, +19% at 24h. In a -84% average market, boring is alpha.</li>
              <li><strong style={{ color: '#fff' }}>90+ scores are exit-liquidity detectors.</strong> Two days running, the max-conviction band averaged ~-99% at 24h. Treat them as scalp-only or skip.</li>
              <li><strong style={{ color: '#fff' }}>The 4-hour window is now a two-sample regime, not a one-off.</strong> 40% green at 1h → 1% at 24h, twice in a row. Scale out inside the window, flat by dinner.</li>
              <li><strong style={{ color: '#fff' }}>Holding overnight is a -84% average bet.</strong> 1 survivor in 106. If your plan requires being that 1, it's not a plan — it's a lottery ticket.</li>
            </ol>
          </div>
        </div>

        <div style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '12px', padding: '24px', marginTop: '40px' }}>
          <div style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#00ff88', marginBottom: '8px' }}>🐺 Trade the Window Live</div>
          <p style={{ color: '#888', fontSize: '14px', margin: '0 0 16px' }}>
            Wolf Pack fires alerts 24/7 — the scanner finds them, the window decides what you keep.
            Watch today's scores on the live dashboard.
          </p>
          <a href="/wolf-alerts" style={{ background: '#00ff88', color: '#000', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', fontFamily: 'monospace' }}>Open Wolf Alerts →</a>
        </div>

        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #111', color: '#555', fontSize: '12px', fontFamily: 'monospace' }}>
          Data: Wolf Pack performance tracker (wolf_performance.db), July 27–29 2026, 371 alerts / 132 tokens · Not financial advice. DYOR. 🦎
        </div>
      </div>
    </Layout>
  )
}
