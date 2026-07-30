import Layout from '../../components/Layout'

export default function PerfectScoreTrapWolfData() {
  return (
    <Layout title="The Perfect Score Trap: 647 Wolf Alerts, Score 98 Rug, Score 77 Survives | iseeiape">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#fff', minHeight: '100vh' }}>

        <a href="/insights" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'block' }}>← Back to Insights</a>

        <span style={{ padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px' }}>🆕 Today - Jul 30, 2026</span>

        <h1 style={{ fontSize: '42px', marginTop: '15px', marginBottom: '20px' }}>🎯 The Perfect Score Trap: Score 98 Pumped 764% Then Died. Score 77 Dipped 58% Then Did 1,809%.</h1>

        <p style={{ color: '#888', marginBottom: '40px', fontSize: '18px' }}>
          Day 3 of tracking every Wolf Pack alert through the full 24-hour cycle. Today's dataset has 647 alerts
          across the last 48 hours — 204 with a complete 24-hour return. The headline: <strong style={{ color: '#00ff88' }}>DOGCAT</strong>,
          the highest-scored token in the entire window (score 98, ORGANIC cluster, 98% unique buyers), went
          <strong style={{ color: '#ff6b6b' }}> +764% in 4 hours</strong> then <strong style={{ color: '#ff6b6b' }}> -99% by hour 24</strong>.
          Meanwhile <strong style={{ color: '#00ff88' }}>FRANK</strong> (score 77) opened at <strong style={{ color: '#ff6b6b' }}>-58%</strong> after
          one hour and finished at <strong style={{ color: '#00ff88' }}>+1,809%</strong>. The data keeps screaming the same thing: score predicts the pump. It does not predict the exit.
        </p>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>7 min read</span>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Data Case Study</span>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Wolf Pack</span>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Solana</span>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Exit Strategy</span>
        </div>

        {/* Dataset Overview */}
        <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
          <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>📊 The Dataset (July 28–30, 2026)</h2>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            647 alerts fired by the Wolf Pack scanner in the last 48 hours. 204 have a full 24-hour price track.
            Every number below is measured from the alert price — no cherry-picking, no survivorship bias.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px', marginTop: '25px' }}>
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>647</div>
              <div style={{ color: '#888', fontSize: '12px' }}>alerts fired (48h)</div>
            </div>
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>204</div>
              <div style={{ color: '#888', fontSize: '12px' }}>with full 24h track</div>
            </div>
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>16 / 204</div>
              <div style={{ color: '#888', fontSize: '12px' }}>green at 24h (7.8%)</div>
            </div>
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ color: '#ff6b6b', fontSize: '28px', fontWeight: 'bold' }}>-47.5%</div>
              <div style={{ color: '#888', fontSize: '12px' }}>score-90+ avg at 24h</div>
            </div>
          </div>
        </div>

        {/* Survival Curve */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '28px' }}>📉 The Survival Curve, Day 3</h2>
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
                  <td style={{ padding: '15px', color: '#00ff88' }}>+3.8%</td>
                  <td style={{ padding: '15px', color: '#00ff88' }}>+7.1%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>-40.3%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}><strong>Alerts in profit</strong></td>
                  <td style={{ padding: '15px', color: '#00ff88' }}>82 (40.2%)</td>
                  <td style={{ padding: '15px', color: '#00ff88' }}>53 (26.0%)</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>16 (7.8%)</td>
                </tr>
                <tr>
                  <td style={{ padding: '15px' }}><strong>Avg return, score 90+ band</strong></td>
                  <td style={{ padding: '15px', color: '#00ff88' }}>+1.7%</td>
                  <td style={{ padding: '15px', color: '#00ff88' }}>+104.4%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>-47.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            Three days, three datasets, one shape. ~40% green at hour one, under 8% green at hour 24. But today
            added a twist: the score-90+ band averaged <strong style={{ color: '#00ff88' }}>+104% at 4 hours</strong> — the
            highest mid-window return we've seen — and still finished at <strong style={{ color: '#ff6b6b' }}>-47.5%</strong>. The
            higher they pump, the harder they dump. Score isn't broken. It's just measuring the wrong timeframe.
          </p>
        </div>

        {/* DOGCAT Case Study */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '28px' }}>🐕‍🦺 DOGCAT: The Perfect Trap</h2>
          <div style={{ background: '#111', padding: '25px', borderRadius: '12px', borderLeft: '4px solid #ff6b6b', marginBottom: '20px' }}>
            <p style={{ color: '#aaa', lineHeight: '1.7', fontSize: '15px' }}>
              <strong style={{ color: '#ff6b6b' }}>Score 98</strong> · ORGANIC cluster · 98% unique buyers · 2 selective wallets · July 29, 05:03 UTC<br /><br />
              <strong>MCap at alert:</strong> $257,550 · <strong>Volume 24h:</strong> $251,718<br /><br />
              <strong style={{ color: '#00ff88' }}>+90.7%</strong> after 1h · <strong style={{ color: '#00ff88' }}>+764.1%</strong> after 4h · <strong style={{ color: '#ff6b6b' }}>-98.9%</strong> after 24h<br /><br />
              <strong>Signals at alert time:</strong> ⚡ 5m rocket +113% · 📈 1h surge +292% · 🔥 Daily moon +292% · 🎯 Micro cap gem $257K · 👛 47 unique swappers
            </p>
          </div>
          <p style={{ color: '#aaa', lineHeight: '1.7' }}>
            This was the kind of alert that makes you lean forward. Score 98 — the highest in 647 alerts. ORGANIC cluster verdict
            (not a bundle, not a sybil). 98% unique buyer ratio. Two selective wallets that had picked winners before. The
            signals were all green: 5-minute rocket already +113%, 1h surge +292%. Volume matching market cap. Everything the
            Wolf Pack scoring system is designed to surface.
          </p>
          <p style={{ color: '#aaa', lineHeight: '1.7', marginTop: '15px' }}>
            And it worked — for 4 hours. Price went from $0.0002575 to $0.002225. A 764% gain. If you bought at alert
            and sold at the 4-hour mark, you printed. If you held overnight, you watched 99% of your position evaporate.
            The token that scored 98 outperformed everything at 4h and underperformed everything at 24h. <strong style={{ color: '#ff6b6b' }}>The score
            was right about the direction and wrong about the duration.</strong>
          </p>
          <p style={{ color: '#aaa', lineHeight: '1.7', marginTop: '15px' }}>
            DOGCAT was re-alerted 4 times in 90 minutes (05:03, 05:17, 06:01, 06:19) as the price climbed from $257K mcap
            to $1.14M mcap. Each re-alert scored 98 or 90. Each one was a higher entry into the same dying trajectory.
            By the time the last alert fired at mcap $1.14M — "💎 Small cap: $1,141,653" — the token was 15 hours from
            a -99.7% wipeout.
          </p>
        </div>

        {/* FRANK: The Survivor */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '28px' }}>🔥 FRANK: The Comeback Nobody Expected</h2>
          <div style={{ background: '#111', padding: '25px', borderRadius: '12px', borderLeft: '4px solid #00ff88', marginBottom: '20px' }}>
            <p style={{ color: '#aaa', lineHeight: '1.7', fontSize: '15px' }}>
              <strong style={{ color: '#00ff88' }}>Score 77</strong> · No cluster verdict · July 29<br /><br />
              <strong>MCap at alert:</strong> $69,786<br /><br />
              <strong style={{ color: '#ff6b6b' }}>-58.0%</strong> after 1h · <strong style={{ color: '#00ff88' }}>+284.5%</strong> after 4h · <strong style={{ color: '#00ff88' }}>+1,808.9%</strong> after 24h
            </p>
          </div>
          <p style={{ color: '#aaa', lineHeight: '1.7' }}>
            While DOGCAT was scoring 98 and dying, FRANK was scoring 77 and mooning. The alert hit at a $69K micro-cap.
            One hour later, the price was down 58%. By any reasonable stop-loss logic, you'd have been out. But by hour 4,
            it had recovered to +284%. And at 24 hours: <strong style={{ color: '#00ff88' }}>+1,809%</strong> — the single
            best return in the entire 647-alert dataset.
          </p>
          <p style={{ color: '#aaa', lineHeight: '1.7', marginTop: '15px' }}>
            FRANK also re-alerted multiple times at different scores (77, 88). The score-88 re-alert caught the move
            at +329% in the first hour — a much better entry than the original. But the score-77 initial alert, the one
            that looked dead on arrival, was the one that captured the full 18x.
          </p>
        </div>

        {/* Score Band Paradox */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '28px' }}>⚖️ The Score Paradox</h2>
          <div style={{ background: '#111', padding: '25px', borderRadius: '12px', marginBottom: '30px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#aaa' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>Score Band</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>Alerts (24h tracked)</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>Avg at 1h</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>Avg at 4h</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>Avg at 24h</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}><strong style={{ color: '#ff6b6b' }}>90+</strong></td>
                  <td style={{ padding: '15px' }}>61</td>
                  <td style={{ padding: '15px', color: '#00ff88' }}>+1.7%</td>
                  <td style={{ padding: '15px', color: '#00ff88' }}>+104.4%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>-47.5%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}><strong>80–89</strong></td>
                  <td style={{ padding: '15px' }}>46</td>
                  <td style={{ padding: '15px', color: '#00ff88' }}>+26.9%</td>
                  <td style={{ padding: '15px', color: '#00ff88' }}>+13.0%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>-17.2%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}><strong>70–79</strong></td>
                  <td style={{ padding: '15px' }}>70</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>-17.2%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>-53.0%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>-27.3%</td>
                </tr>
                <tr>
                  <td style={{ padding: '15px' }}><strong>&lt;70</strong></td>
                  <td style={{ padding: '15px' }}>27</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>-4.9%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>-51.9%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>-88.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ color: '#aaa', lineHeight: '1.7' }}>
            The score-90+ band is a volatility amplifier, not a profit predictor. It averaged <strong style={{ color: '#00ff88' }}>+104% at 4h</strong> —
            meaning if you could time the exit, high scores are your best bet for the biggest mid-window gains. But
            the same band averaged <strong style={{ color: '#ff6b6b' }}>-47.5% at 24h</strong>. The conclusion writes
            itself: <strong>score predicts the spike. Your exit discipline predicts whether you keep it.</strong>
          </p>
          <p style={{ color: '#aaa', lineHeight: '1.7', marginTop: '15px' }}>
            Meanwhile, the 80-89 band quietly outperformed at 24h (-17.2% vs -47.5%). Lower volatility, lower ceiling,
            but more of the gain survived. For holders, the mid-score band is the sweet spot. For scalpers, it's 90+.
          </p>
        </div>

        {/* GRASS: The Sustained Winner */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '28px' }}>🌿 GRASS: The One That Held</h2>
          <div style={{ background: '#111', padding: '25px', borderRadius: '12px', borderLeft: '4px solid #00ff88', marginBottom: '20px' }}>
            <p style={{ color: '#aaa', lineHeight: '1.7', fontSize: '15px' }}>
              <strong style={{ color: '#00ff88' }}>Score 91</strong> · ORGANIC cluster · 98% unique buyers · July 29<br /><br />
              <strong>MCap at alert:</strong> $223,327 · <strong>Volume 24h:</strong> strong<br /><br />
              <strong style={{ color: '#00ff88' }}>+73.9%</strong> after 1h · <strong style={{ color: '#00ff88' }}>+940.6%</strong> after 4h · <strong style={{ color: '#00ff88' }}>+688.7%</strong> after 24h
            </p>
          </div>
          <p style={{ color: '#aaa', lineHeight: '1.7' }}>
            GRASS is the exception that proves the rule. Score 91, ORGANIC cluster, and it actually <em>retained</em> its gains.
            At 4h it was +940%. At 24h it was still +689%. The only high-score token in the window that didn't round-trip.
            What made GRASS different? Larger initial mcap ($223K vs DOGCAT's $257K — similar), real volume, and it was
            alerted 4 times as it climbed — suggesting sustained buyer interest rather than a single spike. But with n=1,
            the honest answer is: we don't know yet. The sample size for "score 90+ that held gains" is still too small
            to separate signal from luck.
          </p>
        </div>

        {/* Key Takeaways */}
        <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #00ff88' }}>
          <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>🔑 Key Takeaways</h2>
          <ol style={{ color: '#aaa', lineHeight: '2.0', fontSize: '16px', paddingLeft: '20px' }}>
            <li><strong style={{ color: '#fff' }}>Score ≠ survival.</strong> Score 98 (DOGCAT) rug-pulled. Score 77 (FRANK) did 18x. The score measures signal quality at entry, not durability.</li>
            <li><strong style={{ color: '#fff' }}>The 4-hour exit holds.</strong> Score-90+ averaged +104% at 4h and -47.5% at 24h. If you're not taking profits at the 4-hour mark, you're donating them back.</li>
            <li><strong style={{ color: '#fff' }}>Re-alerts are traps.</strong> DOGCAT re-alerted 4 times as the mcap climbed from $257K → $1.14M. Every re-alert was a worse entry into the same dying token.</li>
            <li><strong style={{ color: '#fff' }}>The mid-score band outperforms on risk-adjusted basis.</strong> 80-89 averaged -17.2% at 24h vs -47.5% for 90+. Less upside, but you keep more of it.</li>
            <li><strong style={{ color: '#fff' }}>7.8% green at 24h.</strong> Up from 1% yesterday. The market is slightly less hostile, but the overwhelming majority of alerts still round-trip to zero.</li>
          </ol>
        </div>

        {/* Previous Days */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <a href="/insights/lone-survivor-wolf-data-2026-07-29" style={{ flex: '1', minWidth: '250px', padding: '20px', background: '#111', borderRadius: '12px', border: '1px solid #222', textDecoration: 'none', color: 'inherit' }}>
            <span style={{ color: '#888', fontSize: '12px' }}>← Day 2 (Jul 29)</span>
            <h3 style={{ color: '#00ff88', marginTop: '10px' }}>🕯️ The Lone Survivor</h3>
            <p style={{ color: '#888', fontSize: '14px' }}>371 alerts, 1 green at 24h</p>
          </a>
          <a href="/insights/four-hour-window-wolf-data-2026-07-28" style={{ flex: '1', minWidth: '250px', padding: '20px', background: '#111', borderRadius: '12px', border: '1px solid #222', textDecoration: 'none', color: 'inherit' }}>
            <span style={{ color: '#888', fontSize: '12px' }}>← Day 1 (Jul 28)</span>
            <h3 style={{ color: '#00ff88', marginTop: '10px' }}>⏱️ The 4-Hour Window</h3>
            <p style={{ color: '#888', fontSize: '14px' }}>211 alerts show where profit lives</p>
          </a>
        </div>

        <div style={{ marginTop: '40px', padding: '20px', background: '#0a0a0a', borderRadius: '12px', border: '1px solid #222' }}>
          <p style={{ color: '#666', fontSize: '13px', textAlign: 'center' }}>
            Data source: Wolf Pack scanner · wolf_performance.db · 647 alerts, 204 with 24h track · July 28–30, 2026<br />
            Returns measured from alert price via on-chain price tracking · Not financial advice
          </p>
        </div>

      </div>
    </Layout>
  )
}
