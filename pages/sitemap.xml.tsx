import path from 'path'
import fs from 'fs'

function generateSitemap(tokens) {
  const base = 'https://www.iseeiape.com'
  const now = new Date().toISOString()

  const staticPages = [
    { url: base, priority: '1.0', changefreq: 'daily' },
    { url: `${base}/master`, priority: '0.9', changefreq: 'hourly' },
    { url: `${base}/tokens`, priority: '0.9', changefreq: 'hourly' },
  ]

  const tokenPages = tokens.filter(t => t.slug).map(t => ({
    url: `${base}/token/${t.slug}`,
    priority: t.best_score >= 85 ? '0.9' : '0.8',
    changefreq: 'daily',
    lastmod: t.first_seen ? t.first_seen.split('T')[0] : now.split('T')[0],
  }))

  const allPages = [...staticPages, ...tokenPages]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod || now.split('T')[0]}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`
}

export default function Sitemap() { return null }

export async function getServerSideProps({ res }) {
  const filePath = path.join(process.cwd(), 'data', 'wolf-tokens.json')
  const { tokens } = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const sitemap = generateSitemap(tokens)
  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.write(sitemap)
  res.end()
  return { props: {} }
}
