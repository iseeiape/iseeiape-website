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
        // Fallback news data
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
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-green-400">📰 LATEST NEWS</h2>
          <span className="text-sm text-gray-500">Brave Search</span>
        </div>
        <div className="animate-pulse space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-green-400">📰 LATEST NEWS</h2>
        <span className="text-sm text-gray-500">Brave Search</span>
      </div>

      <div className="space-y-3">
        {news.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group"
          >
            <div className="text-white group-hover:text-green-300 transition-colors mb-1">
              📰 {item.title}
            </div>
            <div className="text-xs text-gray-500">{item.source}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
