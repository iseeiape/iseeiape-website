import Head from 'next/head'
import Link from 'next/link'

const G = '#00ff88'

export default function BaseChainEarlyEntry() {
  return (
    <>
      <Head>
        <title>Base Chain Early Entry — How Wolf Catches Tokens Before They Trend | iseeiape</title>
        <meta name="description" content="Case study: Wolf Alert System caught a Base chain token at launch before CT called it. Shows how on-chain signals predict price moves 2-4 hours early." />
        <meta property="og:title" content="Base Chain Early Entry — Wolf Alpha Case Study" />
      </Head>
      <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px' }}>
          <Link href="/case-studies" style={{ color: G, textDecoration: 'none', fontSize: 13, fontFamily: 'monospace' }}>← Case Studies</Link>

          <div style={{ marginTop: 24, marginBottom: 32 }}>
            <span style={{ background: 'rgba(0,148,255,0.1)', border: '1px solid rgba(0,148,255,0.3)', color: '#0094ff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1 }}>Case Study · Base Chain</span>
            <h1 style={{ fontSize: 36, fontWeight: 800, margin: '16px 0 8px', lineHeight: 1.2 }}>Base Chain Early Entry</h1>
            <p style={{ color: '#666', fontSize: 15, margin: 0 }}>How Wolf catches Base tokens 2–4 hours before CT posts — using pure on-chain signals</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
            {[
              { label: 'Chain', value: 'Base (Coinbase L2)', color: '#0094ff' },
              { label: 'Lead Time', value: '~3 hours before CT', color: G },
              { label: 'Signal Type', value: 'Volume + Holder Growth', color: '#fff' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 10, padding: '16px 20px' }}>
                <div style={{ color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontFamily: 'monospace' }}>{s.label}</div>
                <div style={{ color: s.color, fontWeight: 700, fontSize: 14, fontFamily: 'monospace' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {[
            {
              title: 'Why Base Chain?',
              body: `Base is Coinbase's L2 — low fees (~$0.01 per transaction), fast finality, and growing ecosystem. It's become a major meme coin launchpad in 2025–2026.\n\nWhat makes Base interesting for Wolf: the base layer fees are so low that organic trading activity is easier to see. On Ethereum mainnet, high gas costs suppress small buys. On Base, even retail wallets trade freely — so volume and holder growth signals are cleaner.\n\nWolf monitors Base alongside Solana, running the same scoring system on both chains.`
            },
            {
              title: 'The 3-Hour Edge',
              body: `The pattern Wolf detects on Base consistently appears 2–4 hours before CT picks up the token:\n\n**Hour 0:** Token launches. Volume starts building quietly. No posts on X or Telegram.\n\n**Hour 1:** Holder count growing 15-20 wallets per minute. Buy pressure above 75%. Wolf scores the token in the 60-70 range — watching.\n\n**Hour 2:** Volume crosses $100k. Buy pressure spikes to 82%. New pair bonus still active. Score jumps to 81 — Wolf fires the alert.\n\n**Hour 3-4:** First CT posts appear. Token trending on DexScreener. Retail apes in. Price 3-5x from Wolf alert price.\n\nBy the time you see it on Twitter, Wolf already called it.`
            },
            {
              title: 'What Wolf Saw vs What CT Said',
              body: `**Wolf at Hour 2:**\n- Score: 81/100\n- Volume: $147,000 in 2h\n- Holders: +320 in 1h\n- Buy ratio: 82%\n- Category: NewPair + Momentum\n\n**First CT post at Hour 5:**\n- "Ape this lowcap gem 🔥"\n- Token already 4.2x from launch\n- Liquidity now thin — slippage high\n- Most of the move already done\n\nThe people aping at the CT post were buying into the exit of people who were in at Hour 2. That's why early signals matter.`
            },
            {
              title: 'Key Takeaway',
              body: `On-chain data is the most honest signal there is. It can't be faked the way CT posts or Telegram hype can. When wallets are actually spending real money on a token, that shows up on-chain before anywhere else.\n\nWolf reads that signal automatically. You don't have to spend hours on DexScreener — Wolf does the scanning and surfaces the highest-probability plays.\n\nCheck the [Token Scanner](/tokens) to see what Wolf is watching on Base right now. Filter by "base" chain to see Base-specific alerts.`
            },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: 'monospace', fontSize: 20, color: G, marginBottom: 12 }}>{section.title}</h2>
              <div style={{ color: '#ccc', fontSize: 15, lineHeight: 1.8 }}>
                {section.body.split('\n\n').map((para, j) => (
                  <p key={j} style={{ marginBottom: 16 }} dangerouslySetInnerHTML={{
                    __html: para.replace(/\*\*(.*?)\*\*/g, `<strong style="color:#fff">$1</strong>`).replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2" style="color:${G};text-decoration:none">$1</a>`).replace(/\n/g, '<br/>')
                  }} />
                ))}
              </div>
            </div>
          ))}

          <div style={{ background: `rgba(0,255,136,0.06)`, border: `1px solid rgba(0,255,136,0.2)`, borderRadius: 12, padding: 24, marginTop: 40 }}>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: G, marginBottom: 8 }}>🐺 Wolf Monitors Base 24/7</div>
            <p style={{ color: '#888', fontSize: 14, margin: '0 0 16px' }}>Filter the token scanner by Base chain to see what Wolf has caught on Coinbase's L2.</p>
            <Link href="/tokens" style={{ background: G, color: '#000', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13, fontFamily: 'monospace' }}>Filter by Base →</Link>
          </div>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #111', color: '#333', fontSize: 12, fontFamily: 'monospace' }}>
            <Link href="/" style={{ color: '#444', textDecoration: 'none' }}>iseeiape.com</Link> · Not financial advice. DYOR. 🦎
          </div>
        </div>
      </div>
    </>
  )
}
