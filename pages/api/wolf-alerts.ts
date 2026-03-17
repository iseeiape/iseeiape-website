import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

interface WolfAlert {
  symbol: string
  name: string
  score: number
  alert_type: string
  price: number
  price_change_5m: number
  price_change_1h: number
  price_change_24h: number
  volume_24h: number
  liquidity: number
  market_cap: number
  pair_url: string
  token_address: string
  chain: string
  signals: string[]
  timestamp: string
}

interface WolfAlertsResponse {
  alerts: WolfAlert[]
  lastUpdated: string
  totalScanned: number
  generatedAt?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WolfAlertsResponse | { error: string }>
) {
  try {
    // Read from the committed data file (updated by the wolf scanner cron)
    const dataPath = path.join(process.cwd(), 'data', 'wolf-live.json')

    if (!fs.existsSync(dataPath)) {
      return res.status(200).json({
        alerts: [],
        lastUpdated: new Date().toISOString(),
        totalScanned: 0,
      })
    }

    const raw = fs.readFileSync(dataPath, 'utf8')
    const data = JSON.parse(raw)

    // Support both { alerts: [...] } and flat array formats
    const alertsRaw: any[] = Array.isArray(data) ? data : (data.alerts || data.tokens || [])
    const totalScanned: number = data.total_scanned ?? data.totalScanned ?? alertsRaw.length
    const lastUpdated: string = data.lastUpdated ?? data.timestamp ?? new Date().toISOString()

    const alertMap = new Map<string, WolfAlert>()

    for (const alert of alertsRaw) {
      const addr = alert.token_address || alert.tokenAddress || alert.address || alert.pairAddress || ''
      if (!addr) continue

      const normalized: WolfAlert = {
        symbol: alert.symbol || alert.baseToken?.symbol || 'UNKNOWN',
        name: alert.name || alert.baseToken?.name || alert.symbol || 'Unknown Token',
        score: alert.score ?? alert.wolfScore ?? 0,
        alert_type: alert.alert_type || alert.alertType || alert.type || 'SIGNAL',
        price: alert.price ?? alert.priceUsd ?? 0,
        price_change_5m: alert.price_change_5m ?? alert.priceChange?.m5 ?? 0,
        price_change_1h: alert.price_change_1h ?? alert.priceChange?.h1 ?? 0,
        price_change_24h: alert.price_change_24h ?? alert.priceChange?.h24 ?? 0,
        volume_24h: alert.volume_24h ?? alert.volume?.h24 ?? 0,
        liquidity: alert.liquidity ?? alert.liquidity?.usd ?? 0,
        market_cap: alert.market_cap ?? alert.marketCap ?? alert.fdv ?? 0,
        pair_url: alert.pair_url || alert.url || `https://dexscreener.com/solana/${addr}`,
        token_address: addr,
        chain: alert.chain || alert.chainId || 'solana',
        signals: alert.signals || alert.tags || [],
        timestamp: alert.timestamp || lastUpdated,
      }

      const existing = alertMap.get(addr)
      if (!existing || normalized.score > existing.score) {
        alertMap.set(addr, normalized)
      }
    }

    const alerts = Array.from(alertMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
    return res.status(200).json({
      alerts,
      lastUpdated,
      totalScanned: totalScanned || alertMap.size,
      generatedAt: data.generatedAt,
    })
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
