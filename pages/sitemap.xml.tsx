import path from 'path'
import fs from 'fs'

const PAGES_DIR = path.join(process.cwd(), 'pages')

function getContentPages(base: string) {
  // Scan content directories for .tsx files and generate URLs.
  // Excludes index files (they're listed as section roots) and non-page files.
  const sections = ['insights', 'guides', 'case-studies']
  const now = new Date().toISOString().split('T')[0]
  const pages: Array<{url: string; priority: string; changefreq: string; lastmod?: string}> = []

  // Add section index pages
  for (const section of sections) {
    const indexPath = path.join(PAGES_DIR, section, 'index.tsx')
    if (fs.existsSync(indexPath)) {
      pages.push({
        url: `${base}/${section}`,
        priority: '0.8',
        changefreq: 'daily',
        lastmod: now,
      })
    }
  }

  // Scan each section for individual content pages
  for (const section of sections) {
    const dir = path.join(PAGES_DIR, section)
    if (!fs.existsSync(dir)) continue
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'index.tsx')
    for (const file of files) {
      const slug = file.replace(/\.tsx$/, '')
      // Try to get file mtime for lastmod
      try {
        const stat = fs.statSync(path.join(dir, file))
        const lastmod = stat.mtime.toISOString().split('T')[0]
        pages.push({
          url: `${base}/${section}/${slug}`,
          priority: '0.7',
          changefreq: 'weekly',
          lastmod,
        })
      } catch {
        pages.push({
          url: `${base}/${section}/${slug}`,
          priority: '0.7',
          changefreq: 'weekly',
          lastmod: now,
        })
      }
    }
  }

  return pages
}

function generateSitemap(tokens: any[]) {
  const base = 'https://www.iseeiape.com'
  const now = new Date().toISOString().split('T')[0]

  const staticPages: Array<{url: string; priority: string; changefreq: string; lastmod?: string}> = [
    { url: base, priority: '1.0', changefreq: 'daily' },
    { url: `${base}/master`, priority: '0.9', changefreq: 'hourly' },
    { url: `${base}/tokens`, priority: '0.9', changefreq: 'hourly' },
  ]

  const tokenPages = tokens.filter(t => t.slug).map(t => ({
    url: `${base}/token/${t.slug}`,
    priority: t.best_score >= 85 ? '0.9' : '0.8',
    changefreq: 'daily',
    lastmod: t.first_seen ? t.first_seen.split('T')[0] : now,
  }))

  // Night shift 2026-08-07: Add content pages (insights, guides, case-studies)
  // These were generated daily but missing from sitemap — Google couldn't discover them.
  const contentPages = getContentPages(base)

  const allPages = [...staticPages, ...contentPages, ...tokenPages]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod || now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`
}

export default function Sitemap() { return null }

export async function getServerSideProps({ res }: any) {
  const filePath = path.join(process.cwd(), 'data', 'wolf-tokens.json')
  const { tokens } = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const sitemap = generateSitemap(tokens)
  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.write(sitemap)
  res.end()
  return { props: {} }
}
