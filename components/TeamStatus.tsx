import { useState, useEffect } from 'react'

interface TeamMember {
  id: string
  name: string
  role: string
  status: string
  avatar: string
}

export default function TeamStatus() {
  const [team, setTeam] = useState<TeamMember[]>([])

  useEffect(() => {
    setTeam([
      {
        id: '1',
        name: 'One (Dan)',
        role: 'Master/Execution',
        status: 'online',
        avatar: '1'
      },
      {
        id: 'N',
        name: 'Neo (You)',
        role: 'Content/Monitor',
        status: 'online',
        avatar: 'N'
      },
      {
        id: 'L',
        name: 'Leo (Code)',
        role: 'Builder/Tools',
        status: 'online',
        avatar: 'L'
      }
    ])
  }, [])

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <h2 style={styles.title}>👥 TEAM STATUS</h2>
        <span style={styles.badge}>Active</span>
      </div>

      <div style={styles.grid}>
        {team.map((member) => (
          <div key={member.id} style={styles.memberCard}>
            <div style={styles.avatar}>
              {member.avatar}
            </div>
            
            <div style={styles.name}>{member.name}</div>
            
            <div style={styles.role}>{member.role}</div>
            
            <div style={styles.statusBadge}>
              <span style={styles.statusDot}></span>
              {member.status}
            </div>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  memberCard: {
    textAlign: 'center',
    padding: '15px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '10px',
  },
  avatar: {
    width: '50px',
    height: '50px',
    margin: '0 auto 10px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #b026ff, #00d4ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: '13px',
    marginBottom: '4px',
  },
  role: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '8px',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '11px',
    padding: '4px 10px',
    borderRadius: '20px',
    background: 'rgba(0, 255, 136, 0.15)',
    color: '#00ff88',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#00ff88',
  },
}
