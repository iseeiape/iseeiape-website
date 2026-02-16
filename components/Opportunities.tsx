import { useState, useEffect } from 'react'

interface Opportunity {
  id: string
  token: string
  type: string
  urgency: string
  source: string
  description: string
  action: string
}

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const fallbackOpps: Opportunity[] = [
          {
            id: '1',
            token: '62eFhsfHF5Fn',
            type: 'meme_coin_launch',
            urgency: 'high',
            source: 'DexScreener',
            description: 'Kosuke Kano, Punch father. The man who raised Punch the abandoned japanese monkey.',
            action: 'research_token'
          },
          {
            id: '2',
            token: '8yyBAFFfCA4f',
            type: 'meme_coin_launch',
            urgency: 'high',
            source: 'DexScreener',
            description: 'Mochi is a baby panda with the softest fur and the happiest heart.',
            action: 'research_token'
          }
        ]
        setOpportunities(fallbackOpps)
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }

    fetchOpportunities()
  }, [])

  if (loading) {
    return (
      <div style={styles.panel}>
        <div style={styles.header}>
          <h2 style={styles.title}>🎯 OPPORTUNITIES</h2>
          <span style={styles.badge}>Live</span>
        </div>
        <div style={styles.loading}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <h2 style={styles.title}>🎯 OPPORTUNITIES</h2>
        <span style={styles.badge}>Live</span>
      </div>

      <div style={styles.list}>
        {opportunities.map((opp) => (
          <div 
            key={opp.id}
            style={{
              ...styles.oppCard,
              borderLeft: opp.urgency === 'high' 
                ? '4px solid #ff4757' 
                : '4px solid #ffa502'
            }}
          >
            <div style={styles.oppTitle}>🔥 {opp.token}</div>
            <div style={styles.oppMeta}>
              Source: {opp.source} | Action: {opp.action} | Urgency: {opp.urgency.toUpperCase()}
            </div>
            <div style={styles.oppDesc}>{opp.description}</div>
          </div>
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
    gap: '12px',
  },
  oppCard: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    padding: '15px',
  },
  oppTitle: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '5px',
  },
  oppMeta: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '8px',
  },
  oppDesc: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.5,
  },
}
