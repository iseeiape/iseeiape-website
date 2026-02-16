import { useState, useEffect } from 'react'

interface NewsItem {
  title: string
  url: string
  source: string
}

export default function LatestNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsItems: NewsItem[] = [
          {
            title: 'Crypto Funds Fall $3.8B as XRP and Solana See Strong $64M Inflows...',
            url: 'https://coinpaper.com/14655/crypto-funds-fall-3-8-b-as-xrp-and-solana-see-strong-64-m-inflows',
            source: 'Coinpaper'
          },
          {
            title: 'Crypto is playing a growing role in human trafficking networks...',
            url: 'https://cnbc.com/2026/02/16/crypto-payments-stablecoin-growing-role-human-trafficking-csam-networks-chainalysis.html',
            source: 'CNBC'
          },
          {
            title: 'Crypto funds bleed for fourth week, XRP and Solana attract inflows...',
            url: 'https://www.cryptopolitan.com/crypto-funds-bleed-xrp-solana-inflows/',
            source: 'Cryptopolitan'
          },
          {
            title: 'Harvard endowment reduces stake in Bitcoin ETF, adds Ether exposure...',
            url: 'https://coindesk.com',
            source: 'Coindesk'
          },
          {
            title: 'Tokenized RWAs climb 13.5% despite $1T crypto market drawdown...',
            url: 'https://cointelegraph.com',
            source: 'Cointelegraph'
          },
        ]
        setNews(newsItems)
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return (
      <div style={styles.panel}>
        <div style={styles.header}>
          <h2 style={styles.title}>📰 LATEST NEWS</h2>
          <span style={styles.badge}>Brave Search</span>
        </div>
        <div style={styles.loading}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <h2 style={styles.title}>📰 LATEST NEWS</h2>
        <span style={styles.badge}>Brave Search</span>
      </div>

      <div style={styles.list}>
        {news.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.newsItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <div style={styles.newsTitle}>📰 {item.title}</div>
            <div style={styles.newsSource}>{item.source}</div>
          </a>
        ))}
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  panel: {
    background: 'rgba(18, 18, 26, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 255, 136, 0.2)',
    borderRadius: '12px',
    padding: '20px',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(0, 255, 136, 0.2)',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#00ff88',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    margin: 0,
  },
  badge: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  loading: {
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    padding: '20px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  newsItem: {
    display: 'block',
    padding: '10px',
    borderRadius: '6px',
    textDecoration: 'none',
    background: 'transparent',
    transition: 'background 0.2s',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  newsTitle: {
    color: '#fff',
    fontSize: '13px',
    lineHeight: 1.4,
    marginBottom: '4px',
  },
  newsSource: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '11px',
  },
}
