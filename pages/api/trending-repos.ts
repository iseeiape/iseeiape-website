import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'iseeiape-website',
    }

    const [r1, r2] = await Promise.all([
      fetch('https://api.github.com/search/repositories?q=topic:solana+topic:defi+topic:crypto&sort=stars&order=desc&per_page=10', { headers }),
      fetch('https://api.github.com/search/repositories?q=topic:solana&sort=updated&order=desc&per_page=10', { headers }),
    ])

    const [d1, d2] = await Promise.all([r1.json(), r2.json()])

    const seen = new Set<number>()
    const merged = [...(d1.items || []), ...(d2.items || [])]
      .filter(r => {
        if (seen.has(r.id)) return false
        seen.add(r.id)
        return true
      })
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10)
      .map(r => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        description: r.description,
        stargazers_count: r.stargazers_count,
        language: r.language,
        html_url: r.html_url,
        updated_at: r.updated_at,
        topics: r.topics || [],
      }))

    res.setHeader('Cache-Control', 's-maxage=3600')
    res.json({ repos: merged })
  } catch (err) {
    res.json({ repos: [], error: String(err) })
  }
}
