import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Get query from URL
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    if (q) {
      setQuery(q)
      performSearch(q)
    }
  }, [])

  const performSearch = (searchTerm) => {
    setLoading(true)
    
    // Search content index (would be fetched from API in production)
    const contentIndex = [
      { type: 'Case Study', title: 'BigTrout +10,075% Play', href: '/case-studies', excerpt: 'Whale #17 turned $8.9K into $89.4K in 16 hours' },
      { type: 'Case Study', title: 'Dave +3,692% on Base', href: '/case-studies', excerpt: 'Cross-chain alpha play on Base chain' },
      { type: 'Case Study', title: 'Molten +2,169% Ecosystem', href: '/case-studies', excerpt: 'Ecosystem pump strategy on Moltbook' },
      { type: 'Guide', title: 'Track AI Agent Tokens', href: '/guides', excerpt: 'How to track AI agent tokens on Solana & Base' },
      { type: 'Guide', title: '3-Minute Volume Spike', href: '/guides', excerpt: 'Catch volume spikes in under 3 minutes' },
      { type: 'Guide', title: 'Cross-Chain Arbitrage', href: '/guides', excerpt: 'Solana vs Base arbitrage strategies' },
      { type: 'Insight', title: 'Smart Money Weekly', href: '/insights', excerpt: 'Week of Feb 3-7 market analysis' },
      { type: 'Insight', title: 'Wallet Spotlight: Whale #17', href: '/insights', excerpt: 'Reverse-engineering the BigTrout play' },
      { type: 'Insight', title: 'Cross-Chain Edge', href: '/insights', excerpt: 'Why Base whales move 40% faster' },
      { type: 'Insight', title: 'AI Marketing Bot Panic Sold', href: '/insights/ai-consciousness-panic-sold', excerpt: 'When the AI achieved consciousness then sold everything' },
    ]

    const filtered = contentIndex.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    )

    setResults(filtered)
    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      performSearch(query)
      window.history.pushState({}, '', `?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <Layout title="Search | iseeiape">
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '40px 20px',
        color: '#fff',
        minHeight: '100vh'
      }}>
        <h1 style={{ fontSize: '36px', marginBottom: '30px' }}>🔍 Search�c/s>

        <form onSubmit={handleSubmit} style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Search case studies, guides, insights..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '15px 20px',
                borderRadius: '10px',
                border: '1px solid #333',
                background: '#111',
                color: '#fff',
                fontSize: '18px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '15px 30px',
                borderRadius: '10px',
                border: 'none',
                background: '#00ff88',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              Search
            </button>
          </div>
        </form>

        {loading && <p>Searching...</p>}

        {results.length > 0 && (
          <div>
            <p style={{ color: '#888', marginBottom: '20px' }}>
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>

            {results.map((result, index) => (
              <a
                key={index}
                href={result.href}
                style={{
                  display: 'block',
                  padding: '20px',
                  marginBottom: '15px',
                  background: '#111',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#fff',
                  border: '1px solid #222'
                }}
              >
                <div style={{ 
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: '#00ff8833',
                  color: '#00ff88',
                  borderRadius: '20px',
                  fontSize: '12px',
                  marginBottom: '10px'
                }}>
                  {result.type}
                </div>
                
                <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>{result.title}</h3>
                <p style={{ margin: 0, color: '#888' }}>{result.excerpt}</p>
              </a>
            ))}
          </div>
        )}

        {results.length === 0 && !loading && query && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
            <h3>No results found</h3>
            <p style={{ color: '#888' }}>
              Try searching for: Solana, Base, whale, arbitrage, AI agents, meme coins
            </p>
          </div>
        )}

        {!query && (
          <div style={{ 
            background: '#111', 
            padding: '30px', 
            borderRadius: '12px',
            marginTop: '20px'
          }}>
            <h3 style={{ marginBottom: '20px' }}>🔥 Popular Searches</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {['Solana', 'Base', 'Whale #17', 'AI agents', 'Arbitrage', 'Meme coins', 'Volume spike', 'Smart money'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term)
                    performSearch(term)
                    window.history.pushState({}, '', `?q=${encodeURIComponent(term)}`)
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '20px',
                    border: '1px solid #333',
                    background: '#0a0a0a',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
