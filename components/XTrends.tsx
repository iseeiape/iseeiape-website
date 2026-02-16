import { useState, useEffect } from 'react'

interface Trend {
  name: string
  url: string
}

export default function XTrends() {
  const [trends, setTrends] = useState<Trend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const xTrends: Trend[] = [
          { name: 'AI-Driven Memecoins', url: 'https://x.com/search?q=AI-Driven%20Memecoins&src=trend_click' },
          { name: 'Solana Ecosystem Restaking', url: 'https://x.com/search?q=Solana%20Ecosystem%20Restaking&src=trend_click' },
          { name: 'Privacy-Focused Layer 2s', url: 'https://x.com/search?q=Privacy-Focused%20Layer%202s&src=trend_click' },
          { name: 'Web3 SocialFi Revival', url: 'https://x.com/search?q=Web3%20SocialFi%20Revival&src=trend_click' },
          { name: 'RWA Tokenization', url: 'https://x.com/search?q=RWA%20Tokenization&src=trend_click' },
        ]
        setTrends(xTrends)
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }

    fetchTrends()
  }, [])

  if (loading) {
    return (
      <div style={styles.panel}>
        <div style={styles.header}>
          <h2 style={styles.title}>🐦 X TRENDS</h2>
          <span style={styles.badge}>Report2</span>
        </div>
        <div style={styles.loading}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <h2 style={styles.title}>🐦 X TRENDS</h2>
        <span style={styles.badge}>Report2</span>
      </div>

      <div style={styles.list}>
        {trends.map((trend, index) => (
          <a
            key={index}
            href={trend.url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.trendItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)'
            }}
          >
            <span style={styles.trendName}>🐦 {trend.name}</span>
            <span style={styles.trendIcon}>🔍</span>
          </a>
        ))}
      </div>

      <p style={styles.hint}>🔗 Click to search on X</p>
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
    gap: '8px',
  },
  trendItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'background 0.2s',
  },
  trendName: {
    color: '#00d4ff',
    fontSize: '14px',
  },
  trendIcon: {
    color: '#00ff88',
    fontSize: '12px',
  },
  hint: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '12px',
    marginTop: '12px',
    marginBottom: 0,
  },
}
