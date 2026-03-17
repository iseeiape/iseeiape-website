import type { NextApiRequest, NextApiResponse } from 'next'

const SOURCES = [
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', name: 'CoinDesk' },
  { url: 'https://decrypt.co/feed', name: 'Decrypt' },
  { url: 'https://cointelegraph.com/rss', name: 'CoinTelegraph' },
]

function parseItems(xml: string, source: string) {
  const items: Array<{ title: string; url: string; source: string; publishedAt: string; description: string }> = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]

    const title =
      (/<title>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/title>/i.exec(block) ||
        /<title>\s*([\s\S]*?)\s*<\/title>/i.exec(block))?.[1]?.trim() || ''

    const link =
      (/<link>\s*(https?:\/\/[^\s<]+)\s*<\/link>/i.exec(block) ||
        /<guid[^>]*>\s*(https?:\/\/[^\s<]+)\s*<\/guid>/i.exec(block))?.[1]?.trim() || ''

    const pubDate =
      (/<pubDate>\s*([\s\S]*?)\s*<\/pubDate>/i.exec(block))?.[1]?.trim() || ''

    const rawDesc =
      (/<description>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/description>/i.exec(block) ||
        /<description>\s*([\s\S]*?)\s*<\/description>/i.exec(block))?.[1] || ''

    const description = rawDesc.replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').trim().slice(0, 150)

    if (title && link) {
      items.push({ title, url: link, source, publishedAt: pubDate, description })
    }
  }

  return items
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results = await Promise.allSettled(
    SOURCES.map(async ({ url, name }) => {
      const r = await fetch(url, {
        headers: { 'User-Agent': 'iseeiape-website/1.0' },
        signal: AbortSignal.timeout(8000),
      })
      const xml = await r.text()
      return parseItems(xml, name)
    })
  )

  const all = results
    .flatMap(r => (r.status === 'fulfilled' ? r.value : []))
    .filter(item => item.publishedAt)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 15)

  res.setHeader('Cache-Control', 's-maxage=300')
  res.json({ news: all })
}
