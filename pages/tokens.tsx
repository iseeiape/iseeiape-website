import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import path from 'path'
import fs from 'fs'

const GREEN = '#00ff88'
const BG = '#000'
const CARD = '#0a0a0a'
const BORDER = '#1a1a1a'

export default function TokensPage({ tokens, generated_at, total_tokens }) {
  const [chain, setChain] = useState('all')
  const [sort, setSort] = useState('score')

  const filtered = tokens
    .filter(t => chain === 'all' || t.chain === chain)
    .sort((a, b) => {
      if (sort === 'score') return b.best_score - a.best_score
      if (sort === 'return') return (b.best_return_1h || -999) - (a.best_return_1h || -999)
      if (sort === 'alerts') return b.alert_count - a.alert_count
      return 0
    })

  return (
    <>
      <Head>
        <title>Wolf Alpha Token Scanner — All Solana & Base Alerts | iseeiape.com</title>
        <meta name="description" content={`Wolf Alert System has tracked ${total_tokens} tokens on Solana and Base. Real-time crypto alpha signals powered by Wolf v9.`} />
        <meta property="og:title" content="Wolf Alpha Token Scanner | iseeiape.com" />
        <meta property="og:description" content={`${total_tokens} tokens tracked. Live Solana & Base alpha signals.`} />
      </Head>
      <div style={{ background: BG, minHeight: '100vh', color: '#fff', fontFamily: 'monospace', padding: '24px' }}>
        {/* Header */}
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Link href="/master" style={{ color: GREEN, textDecoration: 'none', fontSize: 13 }}>← Back to Dashboard</Link>
          <h1 style={{ color: GREEN, fontSize: 28, margin: '16px 0 4px' }}>🐺 Wolf Token Scanner</h1>
          <p style={{ color: '#888', margin: '0 0 24px', fontSize: 14 }}>
            {total_tokens} tokens tracked on Solana & Base · Updated {new Date(generated_at).toLocaleString()}
          </p>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            {['all','solana','base'].map(c => (
              <button key={c} onClick={() => setChain(c)} style={{
                background: chain === c ? GREEN : CARD,
                color: chain === c ? '#000' : '#888',
                border: `1px solid ${chain === c ? GREEN : BORDER}`,
                borderRadius: 6, padding: '6px 16px', cursor: 'pointer',
                fontFamily: 'monospace', fontSize: 13, fontWeight: 600,
                textTransform: 'uppercase',
              }}>{c}</button>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              {[['score','Best Score'],['return','Best 1h Return'],['alerts','Alert Count']].map(([v,l]) => (
                <button key={v} onClick={() => setSort(v)} style={{
                  background: sort === v ? '#111' : 'transparent',
                  color: sort === v ? GREEN : '#666',
                  border: `1px solid ${sort === v ? GREEN : '#222'}`,
                  borderRadius: 6, padding: '6px 12px', cursor: 'pointer',
                  fontFamily: 'monospace', fontSize: 12,
                }}>{l}</button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0d0d0d', borderBottom: `1px solid ${BORDER}` }}>
                  {['Token','Chain','Score','Times Caught','Best 1h Return','First Seen'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 200).map((t, i) => (
                  <tr key={`${t.symbol}-${i}`} style={{ borderBottom: `1px solid ${BORDER}`, transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#0a0a0a')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '12px 16px' }}>
                      <Link href={`/token/${t.symbol}`} style={{ color: GREEN, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
                        ${t.symbol}
                      </Link>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: t.chain === 'solana' ? '#1a0533' : '#001a33', color: t.chain === 'solana' ? '#9945ff' : '#0094ff', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                        {t.chain.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ color: t.best_score >= 85 ? GREEN : t.best_score >= 70 ? '#ffaa00' : '#888', fontWeight: 700 }}>
                        {t.best_score}/100
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#888' }}>{t.alert_count}x</td>
                    <td style={{ padding: '12px 16px' }}>
                      {t.best_return_1h != null
                        ? <span style={{ color: t.best_return_1h >= 0 ? GREEN : '#ff4444', fontWeight: 700 }}>{t.best_return_1h >= 0 ? '+' : ''}{t.best_return_1h.toFixed(1)}%</span>
                        : <span style={{ color: '#333' }}>—</span>
                      }
                    </td>
                    <td style={{ padding: '12px 16px', color: '#555', fontSize: 13 }}>
                      {t.first_seen ? new Date(t.first_seen).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ color: '#333', fontSize: 12, marginTop: 16, textAlign: 'center' }}>
            Showing {Math.min(200, filtered.length)} of {filtered.length} tokens · <Link href="/" style={{ color: '#444' }}>iseeiape.com</Link>
          </p>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'wolf-tokens.json')
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  return { props: data, revalidate: 3600 }
}
