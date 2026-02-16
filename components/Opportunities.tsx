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
    // Fetch from local data or API
    const fetchOpportunities = async () => {
      try {
        // Try to fetch from shared folder (if accessible)
        // Fallback to hardcoded for now
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
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-green-400">🎯 OPPORTUNITIES</h2>
          <span className="text-sm text-gray-500">Live</span>
        </div>
        <div className="animate-pulse space-y-3">
          {[1,2].map(i => (
            <div key={i} className="h-20 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-green-400">🎯 OPPORTUNITIES</h2>
        <span className="text-sm text-gray-500">Live</span>
      </div>

      <div className="space-y-3">
        {opportunities.map((opp) => (
          <div 
            key={opp.id}
            className={`p-4 rounded-lg border-l-4 ${
              opp.urgency === 'high' 
                ? 'bg-red-900/20 border-red-500' 
                : 'bg-yellow-900/20 border-yellow-500'
            }`}
          >
            <div className="font-bold text-white mb-1">🔥 {opp.token}</div>
            <div className="text-xs text-gray-400 mb-2">
              Source: {opp.source} | Action: {opp.action} | Urgency: {opp.urgency.toUpperCase()}
            </div>
            <div className="text-sm text-gray-300">{opp.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
