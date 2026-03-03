const SITE_URL = 'https://www.iseeiape.com';

// Static pages
const staticPages = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '/war-room', priority: '0.9', changefreq: 'hourly' },
  { path: '/insights', priority: '0.9', changefreq: 'daily' },
  { path: '/case-studies', priority: '0.8', changefreq: 'weekly' },
  { path: '/guides', priority: '0.8', changefreq: 'weekly' },
  { path: '/dashboard', priority: '0.7', changefreq: 'daily' },
  { path: '/search', priority: '0.6', changefreq: 'weekly' },
];

// Dynamic content - manually maintained list
const articles = [
  // Insights
  { slug: 'ai-agents-eating-crypto-markets', section: 'insights', date: '2026-03-01' },
  { slug: 'decentralized-intelligence-network', section: 'insights', date: '2026-03-03' },
  { slug: 'information-edge-rotations', section: 'insights', date: '2026-02-27' },
  { slug: 'psychology-smart-money', section: 'insights', date: '2026-02-26' },
  { slug: 'intelligence-to-execution', section: 'insights', date: '2026-02-25' },
  { slug: 'bot-wars-algorithmic-trading', section: 'insights', date: '2026-02-24' },
  { slug: 'alpha-intelligence-swarm', section: 'insights', date: '2026-02-23' },
  { slug: 'real-time-analytics', section: 'insights', date: '2026-02-22' },
  { slug: 'intelligence-to-execution', section: 'insights', date: '2026-02-21' },
  { slug: 'three-layers-intelligence', section: 'insights', date: '2026-02-20' },
  { slug: 'smart-money-mastery', section: 'insights', date: '2026-02-19' },
  { slug: 'cross-chain-edge', section: 'insights', date: '2026-02-18' },
  { slug: 'late-to-pump', section: 'insights', date: '2026-02-17' },
  { slug: 'mltl-alpha-leak', section: 'insights', date: '2026-02-16' },
  { slug: 'iseeiape-fresh-content', section: 'insights', date: '2026-02-15' },
  
  // Case Studies
  { slug: 'whale-made-250k-bonk-48-hours', section: 'case-studies', date: '2026-02-27' },
  { slug: 'complete-guide-whale-watching-solana', section: 'case-studies', date: '2026-02-27' },
  { slug: 'dave-case-study', section: 'case-studies', date: '2026-02-14' },
  { slug: 'molten-case-study', section: 'case-studies', date: '2026-02-13' },
  
  // Guides
  { slug: 'february-2026-market-outlook', section: 'guides', date: '2026-02-27' },
  { slug: 'ai-agent-tokens-guide', section: 'guides', date: '2026-02-12' },
];

function generateSiteMap() {
  const today = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${articles.map(article => `  <url>
    <loc>${SITE_URL}/${article.section}/${article.slug}</loc>
    <lastmod>${article.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  const sitemap = generateSiteMap();
  
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
  
  return { props: {} };
}

export default function SiteMap() {}
