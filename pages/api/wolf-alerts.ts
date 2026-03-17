import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

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
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WolfAlertsResponse | { error: string }>
) {
  try {
    // Find the 5 most recent wolf alert files in /tmp
    let alertFiles: string[] = []
    try {
      const result = execSync('ls -t /tmp/wolf_alerts_*.json 2>/dev/null | head -5', { encoding: 'utf8' })
      alertFiles = result.trim().split('\n').filter(f => f.length > 0)
    } catch {
      // No files found
    }

    if (alertFiles.length === 0) {
      return res.status(200).json({
        alerts: [],
        lastUpdated: new Date().toISOString(),
        totalScanned: 0,
      })
    }

    // Merge alerts from all files, deduplicate by token_address
    const alertMap = new Map<string, WolfAlert>()
    let totalScanned = 0
    let latestTimestamp = ''

    for (const filePath of alertFiles) {
      try {
        const raw = fs.readFileSync(filePath.trim(), 'utf8')
        const data = JSON.parse(raw)

        // Support both { alerts: [...] } and flat array formats
        const alerts: any[] = Array.isArray(data) ? data : (data.alerts || data.tokens || [])
        if (data.total_scanned) totalScanned = Math.max(totalScanned, data.total_scanned)
        if (data.timestamp && (!latestTimestamp || data.timestamp > latestTimestamp)) {
          latestTimestamp = data.timestamp
        }

        for (const alert of alerts) {
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
            timestamp: alert.timestamp || data.timestamp || new Date().toISOString(),
          }

          // Keep the highest-score version if duplicate
          const existing = alertMap.get(addr)
          if (!existing || normalized.score > existing.score) {
            alertMap.set(addr, normalized)
          }
        }
      } catch {
        // Skip malformed files
      }
    }

    // Sort by score descending, take top 20
    const alerts = Array.from(alertMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
    return res.status(200).json({
      alerts,
      lastUpdated: latestTimestamp || new Date().toISOString(),
      totalScanned: totalScanned || alertMap.size,
    })
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
