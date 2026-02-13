import { useEffect, useState } from 'react'

interface Repo {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string
  created_at: string
  search_query: string
}

export default function GitHubTrends() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cryptoQueries = [
    'solana',
    'ethereum', 
    'bitcoin',
    'defi',
    'web3',
    'crypto trading'
  ]

  const fetchTrending = async () => {
    try {
      setLoading(true)
      const allRepos: Repo[] = []
      
      for (const query of cryptoQueries) {
        const res = await fetch(
          `https://api.github.com/search/repositories?q=${query}+created:>${getDateString(30)}&sort=stars&order=desc&per_page=5`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'Matrix-Army'
            }
          }
        )
        
        if (res.status === 403) {
          setError('GitHub rate limit - try again in a minute')
          break
        }
        
        const data = await res.json()
        if (data.items) {
          allRepos.push(...data.items.map((r: any) => ({ ...r, search_query: query })))
        }
        
        // Small delay to be nice to API
        await new Promise(r => setTimeout(r, 300))
      }
      
      // Remove duplicates and sort by stars
      const unique = Array.from(new Map(allRepos.map(r => [r.id, r])).values())
      const sorted = unique.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 8)
      
      setRepos(sorted)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch trending repos')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrending()
    // Refresh every 10 minutes
    const interval = setInterval(fetchTrending, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getStarsEmoji = (stars: number) => {
    if (stars > 1000) return '🔥'
    if (stars > 100) return '⭐'
    return '📦'
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
    return num.toString()
  }

  if (loading) {
    return (
      <div style={{
        background: 'rgba(18, 18, 26, 0.9)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: '12px',
        padding: '20px',
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center'
      }}>
        🐙 Loading trending repos...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        background: 'rgba(18, 18, 26, 0.9)',
        border: '1px solid rgba(255, 71, 87, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        color: '#ff4757'
      }}>
        ⚠️ {error}
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(18, 18, 26, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 255, 136, 0.2)',
      borderRadius: '12px',
      padding: '20px',
      maxWidth: '100%'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(0, 255, 136, 0.2)'
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#00ff88',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          🐙 Trending Crypto Repos
        </span>
        <span style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>
          Live
        </span>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {repos.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '16px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              borderLeft: '3px solid #00ff88',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 136, 0.05)'
              e.currentTarget.style.transform = 'translateX(4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'
              e.currentTarget.style.transform = 'translateX(0)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '6px'
            }}>
              <span style={{ fontSize: '16px' }}>{getStarsEmoji(repo.stargazers_count)}</span>
              <span style={{
                fontWeight: 600,
                fontSize: '14px',
                color: '#fff'
              }}>
                {repo.full_name}
              </span>
            </div>
            
            <p style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '8px',
              lineHeight: '1.4'
            }}>
              {repo.description?.slice(0, 100) || 'No description'}
              {repo.description?.length > 100 ? '...' : ''}
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)'
            }}>
              <span>⭐ {formatNumber(repo.stargazers_count)}</span>
              <span>🍴 {formatNumber(repo.forks_count)}</span>
              {repo.language && <span>💻 {repo.language}</span>}
              <span style={{
                marginLeft: 'auto',
                fontSize: '10px',
                textTransform: 'uppercase',
                color: '#ff6b35'
              }}>
                {repo.search_query}
              </span>
            </div>
          </a>
        ))}
      </div>
      
      <div style={{
        marginTop: '12px',
        textAlign: 'center',
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.4)'
      }}>
        Updates every 10 minutes • Click to view repo
      </div>
    </div>
  )
}

function getDateString(daysAgo: number) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}
