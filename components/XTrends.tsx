import { useState, useEffect } from 'react'

interface Trend {
  name: string
  url: string
}

export default function XTrends() {
  const [trends, setTrends] = useState<Trend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulated trends - in production would fetch from API
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
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-cyan-400">🐦 X TRENDS</h2>
          <span className="text-sm text-gray-500">Report2</span>
        </div>
        <div className="animate-pulse space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-12 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-cyan-400">🐦 X TRENDS</h2>
        <span className="text-sm text-gray-500">Report2</span>
      </div>

      <div className="space-y-2">
        {trends.map((trend, index) => (
          <a
            key={index}
            href={trend.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group"
          >
            <span className="text-cyan-300 group-hover:text-cyan-200">🐦 {trend.name}</span>
            <span className="text-green-400">🔍</span>
          </a>
        ))}
      </div>

      <p className="text-gray-500 text-sm mt-4">
        🔗 Click to search on X
      </p>
    </div>
  )
}
