export const metadata = {
  title: 'iseeiape - Smart Money Intelligence for Solana & Base',
  description: 'Track whale wallets, spot smart money moves, and trade before the pump. Real-time Solana and Base blockchain analytics.',
  keywords: 'solana, base, smart money, whale tracking, crypto, defi, blockchain analytics',
  openGraph: {
    title: 'iseeiape - See What Smart Money Buys',
    description: 'Smart money intelligence for Solana and Base. Real-time whale tracking and alpha signals.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#0a0a0a', color: '#fff' }}>
        <header style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#00ff88' }}>🦎 iseeiape</h1>
            <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '14px' }}>Smart Money Intelligence</p>
          </div>
          <nav>
            <a href="/" style={{ marginRight: '20px', color: '#fff', textDecoration: 'none' }}>Home</a>
            <a href="/case-studies" style={{ marginRight: '20px', color: '#fff', textDecoration: 'none' }}>Case Studies</a>
            <a href="/guides" style={{ marginRight: '20px', color: '#fff', textDecoration: 'none' }}>Guides</a>
            <a href="/insights" style={{ color: '#fff', textDecoration: 'none' }}>Insights</a>
          </nav>
        </header>
        <main>{children}</main>
        
        <footer style={{ padding: '40px 20px', borderTop: '1px solid #333', textAlign: 'center', color: '#666', marginTop: '60px' }}>
          <p>🦎 Matrix Army Content Machine | Updated Daily</p>
          <p style={{ fontSize: '12px' }}>Last Updated: February 5, 2025</p>
        </footer>
      </body>
    </html>
  )
}
