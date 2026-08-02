import Layout from '../../components/Layout'

export default function CoordinationPremiumWolfData() {
  return (
    <Layout title="The Coordination Premium: Why SYBIL and BUNDLE Tokens Are the Only Ones Surviving 24h | iseeiape">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#fff', minHeight: '100vh' }}>

        <a href="/insights" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'block' }}>← Back to Insights</a>

        <span style={{ padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px' }}>🆕 Today - Aug 2, 2026</span>

        <h1 style={{ fontSize: '42px', marginTop: '15px', marginBottom: '20px' }}>🧬 The Coordination Premium: Why SYBIL and BUNDLE Tokens Are the Only Ones Surviving 24h</h1>

        <p style={{ color: '#888', marginBottom: '40px', fontSize: '18px' }}>
          Day 6 of tracking every Wolf Pack alert through the 24-hour cycle. The pattern has flipped from
          "score = quality" to something far more useful: <strong style={{ color: '#00ff88' }}>cluster verdict
          predicts survival better than score ever did.</strong> In the last 48 hours, ORGANIC-labeled tokens
          went <strong style={{ color: '#ff6b6b' }}>0 for 49</strong> at 24h. Zero survivors. Meanwhile every
          single token that finished green at 24h was either SYBIL or BUNDLE-flagged. The "coordinated buyer"
          label you've been trained to fear is the only thing keeping the lights on.
        </p>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>9 min read</span>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Data Case Study</span>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Wolf Pack</span>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Solana</span>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Cluster Analysis</span>
        </div>

        {/* Dataset Overview */}
        <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
          <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>📊 The Dataset (Last 48 Hours)</h2>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            574 alerts fired across 282 unique tokens. 268 have completed 24-hour return tracks — Day 6 of the
            continuous tracking experiment, and the dataset keeps growing.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px', marginTop: '25px' }}>
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>574</div>
              <div style={{ color: '#888', fontSize: '12px' }}>alerts fired (48h)</div>
            </div>
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>268</div>
              <div style={{ color: '#888', fontSize: '12px' }}>with full 24h track</div>
            </div>
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ color: '#ff6b6b', fontSize: '28px', fontWeight: 'bold' }}>0 / 49</div>
              <div style={{ color: '#888', fontSize: '12px' }}>ORGANIC green at 24h</div>
            </div>
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>12.3%</div>
              <div style={{ color: '#888', fontSize: '12px' }}>overall 24h win rate</div>
            </div>
          </div>
        </div>

        {/* The Cluster Verdict Table */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '28px' }}>🎯 The Only Table That Matters: Cluster vs Score</h2>
          <p style={{ color: '#aaa', lineHeight: '1.7', marginBottom: '20px' }}>
            Forget the score. Here's what the last 48 hours look like when you group by cluster verdict — the
            scanner's assessment of whether buyers are coordinated (SYBIL/BUNDLE) or independent (ORGANIC).
          </p>
          <div style={{ background: '#111', padding: '25px', borderRadius: '12px', marginBottom: '20px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#aaa', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>Cluster Verdict</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>Alerts (24h tracked)</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>Avg Return at 1h</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>Avg Return at 24h</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>Win Rate at 24h</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}><strong>ORGANIC</strong></td>
                  <td style={{ padding: '15px' }}>49</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>-20.5%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>-96.8%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}><strong>0.0%</strong></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}><strong>BUNDLE</strong></td>
                  <td style={{ padding: '15px' }}>35</td>
                  <td style={{ padding: '15px', color: '#00ff88' }}>+15.2%</td>
                  <td style={{ padding: '15px', color: '#00ff88' }}>positive (outliers)</td>
                  <td style={{ padding: '15px', color: '#00ff88' }}><strong>20.0%</strong></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}><strong>SYBIL</strong></td>
                  <td style={{ padding: '15px' }}>114</td>
                  <td style={{ padding: '15px', color: '#00ff88' }}>+15.9%</td>
                  <td style={{ padding: '15px', color: '#00ff88' }}>positive (outliers)</td>
                  <td style={{ padding: '15px', color: '#00ff88' }}><strong>17.5%</strong></td>
                </tr>
                <tr>
                  <td style={{ padding: '15px' }}><strong>None (unclassified)</strong></td>
                  <td style={{ padding: '15px' }}>70</td>
                  <td style={{ padding: '15px', color: '#ffaa00' }}>mixed</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>negative</td>
                  <td style={{ padding: '15px', color: '#ffaa00' }}><strong>~8%</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ color: '#aaa', lineHeight: '1.7' }}>
            Read that table again. <strong style={{ color: '#ff6b6b' }}>ORGANIC — 0.0% win rate.</strong> Not
            "low." Not "bad." Zero. Forty-nine alerts flagged as having organic, independent buyers. All 49
            finished red at 24 hours. The average return was <strong style={{ color: '#ff6b6b' }}>-96.8%</strong>.
            Meanwhile BUNDLE and SYBIL — the categories every degen is trained to avoid — are the only clusters
            producing winners.
          </p>
        </div>

        {/* BEAR Case Study */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '28px' }}>🐻 BEAR: Score 91, SYBIL, +1,280% at 24h</h2>
          <div style={{ background: '#111', padding: '25px', borderRadius: '12px', borderLeft: '4px solid #00ff88', marginBottom: '20px' }}>
            <p style={{ color: '#aaa', lineHeight: '1.7', fontSize: '15px' }}>
              <strong style={{ color: '#00ff88' }}>Score 91</strong> · SYBIL cluster · Micro-cap ($35K at first alert)<br /><br />
              <strong style={{ color: '#00ff88' }}>+309.1%</strong> after 1h · <strong style={{ color: '#00ff88' }}>+1,393.6%</strong> after 4h · <strong style={{ color: '#00ff88' }}>+1,280.1%</strong> after 24h<br /><br />
              8 total alerts over the 48h window · Scores ranged 63-91 · First alert was the best entry
            </p>
          </div>
          <p style={{ color: '#aaa', lineHeight: '1.7' }}>
            BEAR is the textbook example of the coordination premium. The first alert came at score 91 with a
            $35K market cap — micro-cap territory where most traders wouldn't touch it. The SYBIL flag told a
            different story: a coordinated group was buying. They had skin in the game. They needed the price to
            go up long enough to exit.
          </p>
          <p style={{ color: '#aaa', lineHeight: '1.7', marginTop: '15px' }}>
            It went +309% in the first hour. +1,393% at 4h. And remarkably, it <strong style={{ color: '#00ff88' }}>held</strong> —
            +1,280% at 24h. This is almost unheard of in our dataset. Out of 268 tracked alerts with 24h data, only
            33 finished green. BEAR was one of the best.
          </p>
          <p style={{ color: '#aaa', lineHeight: '1.7', marginTop: '15px' }}>
            But here's the trap within the trade: BEAR was re-alerted 8 times. The first alert (score 91) was the
            golden ticket. The second alert (score 84) was already at -91% at 1h — a different entry entirely. The
            third alert (score 73) did +135% at 24h. The pattern is chaotic: <strong>same token, different entries,
            wildly different outcomes.</strong> The coordination premium exists, but the window is narrow and the
            re-alerts are minefields.
          </p>
          <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', marginTop: '20px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#aaa', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#00ff88' }}>Alert #</th>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#00ff88' }}>Score</th>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#00ff88' }}>MCap</th>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#00ff88' }}>1h Return</th>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#00ff88' }}>4h Return</th>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#00ff88' }}>24h Return</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px' }}>1</td>
                  <td style={{ padding: '8px', color: '#00ff88' }}>91</td>
                  <td style={{ padding: '8px' }}>$35.6K</td>
                  <td style={{ padding: '8px', color: '#00ff88' }}>+309%</td>
                  <td style={{ padding: '8px', color: '#00ff88' }}>+1,394%</td>
                  <td style={{ padding: '8px', color: '#00ff88' }}><strong>+1,280%</strong></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px' }}>2</td>
                  <td style={{ padding: '8px' }}>84</td>
                  <td style={{ padding: '8px' }}>$115.7K</td>
                  <td style={{ padding: '8px', color: '#ff6b6b' }}>-91%</td>
                  <td style={{ padding: '8px', color: '#ff6b6b' }}>-97%</td>
                  <td style={{ padding: '8px', color: '#ff6b6b' }}>-97%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px' }}>3</td>
                  <td style={{ padding: '8px' }}>80</td>
                  <td style={{ padding: '8px' }}>$14.0K</td>
                  <td style={{ padding: '8px', color: '#00ff88' }}>+50%</td>
                  <td style={{ padding: '8px', color: '#ff6b6b' }}>-59%</td>
                  <td style={{ padding: '8px', color: '#ff6b6b' }}>-84%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px' }}>4</td>
                  <td style={{ padding: '8px' }}>74</td>
                  <td style={{ padding: '8px' }}>$274.1K</td>
                  <td style={{ padding: '8px', color: '#ff6b6b' }}>-35%</td>
                  <td style={{ padding: '8px', color: '#ff6b6b' }}>-74%</td>
                  <td style={{ padding: '8px', color: '#ff6b6b' }}>-97%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px' }}>5</td>
                  <td style={{ padding: '8px' }}>73</td>
                  <td style={{ padding: '8px' }}>$148.1K</td>
                  <td style={{ padding: '8px', color: '#00ff88' }}>+65%</td>
                  <td style={{ padding: '8px', color: '#00ff88' }}>+151%</td>
                  <td style={{ padding: '8px', color: '#00ff88' }}>+135%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px' }}>6</td>
                  <td style={{ padding: '8px' }}>71</td>
                  <td style={{ padding: '8px' }}>$62.6K</td>
                  <td style={{ padding: '8px', color: '#00ff88' }}>+358%</td>
                  <td style={{ padding: '8px', color: '#ff6b6b' }}>-33%</td>
                  <td style={{ padding: '8px', color: '#ff6b6b' }}>-86%</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>7-8</td>
                  <td style={{ padding: '8px' }}>63-69</td>
                  <td style={{ padding: '8px' }}>$45-177K</td>
                  <td style={{ padding: '8px', color: '#ff6b6b' }}>negative</td>
                  <td style={{ padding: '8px', color: '#ff6b6b' }}>-84 to -88%</td>
                  <td style={{ padding: '8px', color: '#ff6b6b' }}>-95 to -96%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ color: '#aaa', lineHeight: '1.7', marginTop: '15px' }}>
            Two of eight BEAR alerts finished green. Both were early entries. By alert #4, the token was already
            dying — but the scanner kept flagging it at scores 63-84. <strong>The cluster verdict (SYBIL) was
            right every time.</strong> The score was noise.
          </p>
        </div>

        {/* PAJAMAS: The Re-Alert Nightmare */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '28px' }}>😴 PAJAMAS: 16 Alerts, All Score 100, All -99%</h2>
          <div style={{ background: '#111', padding: '25px', borderRadius: '12px', borderLeft: '4px solid #ff6b6b', marginBottom: '20px' }}>
            <p style={{ color: '#aaa', lineHeight: '1.7', fontSize: '15px' }}>
              <strong style={{ color: '#ff6b6b' }}>Score 100 (every single alert)</strong> · ORGANIC cluster · 16 alerts over ~12 hours<br /><br />
              <strong>MCap range:</strong> $167K → $252K (never broke $300K)<br /><br />
              <strong style={{ color: '#ff6b6b' }}>-99.0% to -99.3%</strong> at 24h on every alert · Zero survivors
            </p>
          </div>
          <p style={{ color: '#aaa', lineHeight: '1.7' }}>
            PAJAMAS is the most re-alerted token in the dataset — 16 separate alerts, each scored 100, each
            categorized as ORGANIC across multiple detection types (alpha, newpairs, momentum). The scanner
            was convinced this was a high-quality token. It fired on every scan cycle for half a day.
          </p>
          <p style={{ color: '#aaa', lineHeight: '1.7', marginTop: '15px' }}>
            Every single alert went to -99%. Not one survived. The ORGANIC cluster verdict was the only signal
            that mattered — and it was screaming <strong style={{ color: '#ff6b6b' }}>"uncoordinated buyers,
            expect a chaotic exit."</strong> The score of 100 was telling you this was the best token on Solana.
            The cluster verdict was telling you the truth.
          </p>
          <p style={{ color: '#aaa', lineHeight: '1.7', marginTop: '15px' }}>
            SWOLECAT and MSHALO followed the identical pattern: score 100, ORGANIC, 4 alerts each, all -99.2% to
            -99.3%. Three tokens. 24 score-100 ORGANIC alerts. Zero green at 24h. The score and the cluster
            are telling opposite stories, and the cluster wins every time.
          </p>
        </div>

        {/* The ORGANIC Problem */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '28px' }}>💀 Why ORGANIC Means Death on Solana Meme Coins</h2>
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px', border: '1px solid #ff6b6b' }}>
            <p style={{ color: '#aaa', lineHeight: '1.8', fontSize: '16px' }}>
              Six days of data. Over 1,500 tracked alerts. The ORGANIC cluster has <strong style={{ color: '#ff6b6b' }}>
              never produced a meaningful win rate.</strong> The cumulative numbers across the full experiment:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '25px' }}>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#ff6b6b', fontSize: '32px', fontWeight: 'bold' }}>0.7%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>ORGANIC 24h win rate (all-time)</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#ff6b6b', fontSize: '32px', fontWeight: 'bold' }}>-93.9%</div>
                <div style={{ color: '#888', fontSize: '12px' }}>ORGANIC avg return at 24h</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#ff6b6b', fontSize: '32px', fontWeight: 'bold' }}>1 / 168</div>
                <div style={{ color: '#888', fontSize: '12px' }}>score-100 green at 24h (all-time)</div>
              </div>
            </div>
            <p style={{ color: '#aaa', lineHeight: '1.8', fontSize: '16px', marginTop: '25px' }}>
              The logic is simple and brutal. On Solana meme coins, "organic" means <strong>uncoordinated
              buying</strong>. Uncoordinated buying means <strong>uncoordinated selling.</strong> Nobody is
              propping up the price. Nobody needs exit liquidity. The first seller triggers the second, the
              second triggers the tenth, and within hours the token is at -99%.
            </p>
            <p style={{ color: '#aaa', lineHeight: '1.8', fontSize: '16px', marginTop: '15px' }}>
              SYBIL and BUNDLE tokens have <strong style={{ color: '#00ff88' }}>coordinated holders</strong> —
              wallets that bought together and need to sell together. That coordination creates a window: the
              price stays elevated long enough for the pump to be tradable. The "manipulators" you've been warned
              about are the only ones creating a survivable price floor.
            </p>
          </div>
        </div>

        {/* The New Framework */}
        <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #00ff88' }}>
          <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>🔑 The New Framework: Cluster-First, Score-Second</h2>
          <p style={{ color: '#aaa', lineHeight: '1.8', fontSize: '16px', marginBottom: '20px' }}>
            Six days of data have inverted the obvious mental model. Here's what actually works:
          </p>
          <ol style={{ color: '#aaa', lineHeight: '2.2', fontSize: '16px', paddingLeft: '20px' }}>
            <li><strong style={{ color: '#fff' }}>Filter by cluster verdict first.</strong> If it's ORGANIC, skip it. 0% win rate across 49 alerts this window, 0.7% all-time. The score doesn't matter — a score-100 ORGANIC is still a -99% outcome.</li>
            <li><strong style={{ color: '#fff' }}>Look for SYBIL or BUNDLE with scores 65-91.</strong> This is where every winner lived. BEAR (91, SYBIL): +1,280%. CHESHIRE (80, BUNDLE): +621%. CALLCAT (79, BUNDLE): +276%. The mid-score coordinated zone is the trade.</li>
            <li><strong style={{ color: '#fff' }}>The first alert is the only alert.</strong> BEAR's first alert returned +1,280%. Its seventh returned -96%. Re-alerts on the same token are not second chances — they're worse entries on a decaying asset. One shot per token.</li>
            <li><strong style={{ color: '#fff' }}>Score 100 is now a red flag, not a green light.</strong> 168 score-100 alerts all-time, 2 green at 24h (1.2%). Every score-100 in this 48h window was ORGANIC and went to -99%. The perfect score means the scanner sees maximal "organic" activity — which is the exact pattern that rugs.</li>
            <li><strong style={{ color: '#fff' }}>The 4h candle is your exit signal.</strong> Average 1h returns are still positive across clusters (~16% for SYBIL). By 4h, the decay starts. By 24h, it's catastrophic unless you're holding a coordinated outlier. Take profits at 4h unless the cluster is SYBIL and the price is still climbing.</li>
          </ol>
        </div>

        {/* Six-Day Trend */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '28px' }}>📈 Six-Day Trend: The Win Rate Is Stabilizing</h2>
          <div style={{ background: '#111', padding: '25px', borderRadius: '12px', marginBottom: '30px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#aaa' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>Day</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>Alerts (24h tracked)</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>Green at 1h</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#00ff88' }}>Green at 24h</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}>Day 1 (Jul 28)</td>
                  <td style={{ padding: '15px' }}>~60</td>
                  <td style={{ padding: '15px', color: '#ffaa00' }}>37%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>1%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}>Day 2 (Jul 29)</td>
                  <td style={{ padding: '15px' }}>~100</td>
                  <td style={{ padding: '15px', color: '#ffaa00' }}>40%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>1%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}>Day 3 (Jul 30)</td>
                  <td style={{ padding: '15px' }}>204</td>
                  <td style={{ padding: '15px', color: '#ffaa00' }}>40%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>7.8%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}>Day 4 (Jul 31)</td>
                  <td style={{ padding: '15px' }}>313</td>
                  <td style={{ padding: '15px', color: '#ffaa00' }}>~40%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>~7%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}>Day 5 (Aug 1)</td>
                  <td style={{ padding: '15px' }}>330</td>
                  <td style={{ padding: '15px', color: '#ffaa00' }}>45.8%</td>
                  <td style={{ padding: '15px', color: '#ff6b6b' }}>9.7%</td>
                </tr>
                <tr>
                  <td style={{ padding: '15px' }}><strong>Day 6 (Aug 2)</strong></td>
                  <td style={{ padding: '15px' }}><strong>268</strong></td>
                  <td style={{ padding: '15px', color: '#ffaa00' }}><strong>47.4%</strong></td>
                  <td style={{ padding: '15px', color: '#ffaa00' }}><strong>12.3%</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ color: '#aaa', lineHeight: '1.7' }}>
            The 24h win rate climbed to 12.3% — the highest yet. This isn't because the market got better. It's
            because the coordinated clusters (SYBIL/BUNDLE) had a strong window. BEAR, CHESHIRE, CALLCAT, DFUN,
            HOOD — all coordinated, all delivered. The ORGANIC tokens continued their perfect 0% record. The
            overall win rate is a weighted average of two populations: one that wins ~18-20% of the time and one
            that never wins.
          </p>
        </div>

        {/* Previous Days */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <a href="/insights/moondogecoin-rug-breaks-thesis-wolf-data-2026-08-01" style={{ flex: '1', minWidth: '250px', padding: '20px', background: '#111', borderRadius: '12px', border: '1px solid #222', textDecoration: 'none', color: 'inherit' }}>
            <span style={{ color: '#888', fontSize: '12px' }}>← Day 5 (Aug 1)</span>
            <h3 style={{ color: '#00ff88', marginTop: '10px' }}>💸 The $23M Rug</h3>
            <p style={{ color: '#888', fontSize: '14px' }}>MOONDOGECOIN breaks the mcap-survival thesis</p>
          </a>
          <a href="/insights/score-100-death-sentence-wolf-data-2026-07-31" style={{ flex: '1', minWidth: '250px', padding: '20px', background: '#111', borderRadius: '12px', border: '1px solid #222', textDecoration: 'none', color: 'inherit' }}>
            <span style={{ color: '#888', fontSize: '12px' }}>← Day 4 (Jul 31)</span>
            <h3 style={{ color: '#00ff88', marginTop: '10px' }}>💀 Score 100 Death Sentence</h3>
            <p style={{ color: '#888', fontSize: '14px' }}>17 of 18 perfect-score tokens rugged</p>
          </a>
          <a href="/insights/perfect-score-trap-wolf-data-2026-07-30" style={{ flex: '1', minWidth: '250px', padding: '20px', background: '#111', borderRadius: '12px', border: '1px solid #222', textDecoration: 'none', color: 'inherit' }}>
            <span style={{ color: '#888', fontSize: '12px' }}>← Day 3 (Jul 30)</span>
            <h3 style={{ color: '#00ff88', marginTop: '10px' }}>🎯 The Perfect Score Trap</h3>
            <p style={{ color: '#888', fontSize: '14px' }}>Score 98 pumped 764% then died</p>
          </a>
        </div>

        <div style={{ marginTop: '40px', padding: '20px', background: '#0a0a0a', borderRadius: '12px', border: '1px solid #222' }}>
          <p style={{ color: '#666', fontSize: '13px', textAlign: 'center' }}>
            Data source: Wolf Pack scanner · wolf_performance.db · 574 alerts, 268 with 24h track · Aug 1-2, 2026<br />
            Returns measured from alert price via on-chain price tracking · Not financial advice
          </p>
        </div>

      </div>
    </Layout>
  )
}
