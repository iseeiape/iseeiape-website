#!/usr/bin/env node

/**
 * Enhanced Content Sync Script
 * 
 * Syncs generated articles and updates website with proper categorization
 * 
 * Usage: node scripts/enhanced-sync.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const WEBSITE_ROOT = path.join(__dirname, '..');
const GENERATED_ARTICLES_DIR = path.join(WEBSITE_ROOT, 'content', 'generated-articles');
const CONTENT_DEST = path.join(WEBSITE_ROOT, 'content');
const PAGES_DIR = path.join(WEBSITE_ROOT, 'pages');

console.log('🚀 Starting Enhanced Content Sync...');
console.log(`Website Root: ${WEBSITE_ROOT}`);
console.log(`Generated Articles: ${GENERATED_ARTICLES_DIR}`);
console.log(`Content Destination: ${CONTENT_DEST}`);
console.log(`Pages Directory: ${PAGES_DIR}`);

// Ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

// Categorize article based on content and filename
function categorizeArticle(filename, content) {
  const lowerContent = content.toLowerCase();
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes('case-study') || lowerContent.includes('case study')) {
    return 'case-studies';
  } else if (lowerFilename.includes('guide') || lowerContent.includes('guide') || lowerContent.includes('step-by-step')) {
    return 'guides';
  } else if (lowerFilename.includes('outlook') || lowerFilename.includes('insight') || lowerContent.includes('market insight')) {
    return 'insights';
  } else if (lowerFilename.includes('whale') || lowerContent.includes('whale')) {
    return 'case-studies';
  } else {
    return 'insights'; // default
  }
}

// Generate proper React component from markdown
function generateReactComponent(title, content, category, slug) {
  // Extract metadata from markdown
  const lines = content.split('\n');
  const metadata = {};
  let bodyStart = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('**') && line.includes(':**')) {
      const match = line.match(/\*\*([^:]+):\*\*\s*(.+)/);
      if (match) {
        metadata[match[1].toLowerCase()] = match[2].trim();
      }
    } else if (line.startsWith('# ') && i === 0) {
      // Skip title line
    } else if (line.startsWith('## ') || line.startsWith('### ')) {
      bodyStart = i;
      break;
    }
  }
  
  const readTime = metadata['read time'] || '5';
  const author = metadata.author || 'Neo (Matrix Army)';
  const date = metadata.date || new Date().toISOString().split('T')[0];
  
  // Convert markdown to simple HTML (basic conversion)
  let htmlContent = content
    .replace(/^# .+\n?/gm, '') // Remove H1
    .replace(/## (.+)/g, '<h2>$1</h2>')
    .replace(/### (.+)/g, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
  
  // Wrap in paragraphs
  htmlContent = `<p>${htmlContent}</p>`;
  
  // Fix table formatting
  htmlContent = htmlContent.replace(/\|(.+?)\|/g, (match) => {
    if (match.includes('---')) return '';
    return `<tr>${match.split('|').slice(1, -1).map(cell => `<td>${cell.trim()}</td>`).join('')}</tr>`;
  });
  
  htmlContent = htmlContent.replace(/<tr>/g, '</p><table><tr>').replace(/<\/tr>/g, '</tr></table><p>');
  
  return `import Head from 'next/head'
import Layout from '../components/Layout'

export default function ${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, '')}() {
  return (
    <Layout>
      <Head>
        <title>${title} - iseeiape</title>
        <meta name="description" content="${title}" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${title}" />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content="${date}" />
        <meta property="article:author" content="${author}" />
        <meta property="article:section" content="${category}" />
      </Head>
      
      <div className="article-container">
        <div className="article-header">
          <h1 className="article-title">${title}</h1>
          <div className="article-meta">
            <span className="article-author">${author}</span>
            <span className="article-date">${date}</span>
            <span className="article-read-time">${readTime} min read</span>
            <span className="article-category">${category}</span>
          </div>
        </div>
        
        <div className="article-content">
          <div dangerouslySetInnerHTML={{ __html: \`${htmlContent}\` }} />
        </div>
        
        <div className="article-footer">
          <a href="/${category}" className="back-button">
            ← Back to ${category.charAt(0).toUpperCase() + category.slice(1)}
          </a>
        </div>
      </div>
      
      <style jsx>{\`
        .article-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          color: #fff;
          background: #0a0a0a;
          min-height: 100vh;
        }
        
        .article-header {
          margin-bottom: 40px;
          border-bottom: 1px solid #333;
          padding-bottom: 20px;
        }
        
        .article-title {
          font-size: 36px;
          color: #00ff88;
          margin-bottom: 20px;
          line-height: 1.2;
        }
        
        .article-meta {
          display: flex;
          gap: 20px;
          color: #888;
          font-size: 14px;
        }
        
        .article-content {
          line-height: 1.6;
          font-size: 16px;
        }
        
        .article-content h2 {
          color: #00ff88;
          margin-top: 40px;
          margin-bottom: 20px;
          font-size: 24px;
        }
        
        .article-content h3 {
          color: #00ff88;
          margin-top: 30px;
          margin-bottom: 15px;
          font-size: 20px;
        }
        
        .article-content p {
          margin-bottom: 20px;
        }
        
        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background: #1a1a1a;
        }
        
        .article-content th,
        .article-content td {
          border: 1px solid #333;
          padding: 10px;
          text-align: left;
        }
        
        .article-content th {
          background: #222;
          color: #00ff88;
        }
        
        .article-content code {
          background: #1a1a1a;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }
        
        .article-footer {
          margin-top: 60px;
          text-align: center;
        }
        
        .back-button {
          display: inline-block;
          padding: 12px 24px;
          background: #00ff88;
          color: #000;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          transition: background 0.3s;
        }
        
        .back-button:hover {
          background: #00cc66;
        }
      \`}</style>
    </Layout>
  )
}
`;
}

// Sync generated articles to website
async function syncGeneratedArticles() {
  console.log('\n📦 Syncing generated articles...');
  
  ensureDir(GENERATED_ARTICLES_DIR);
  
  const articles = fs.readdirSync(GENERATED_ARTICLES_DIR)
    .filter(file => file.endsWith('.md') && file !== 'README.md');
  
  console.log(`Found ${articles.length} generated articles`);
  
  for (const articleFile of articles) {
    const articlePath = path.join(GENERATED_ARTICLES_DIR, articleFile);
    const content = fs.readFileSync(articlePath, 'utf8');
    
    // Extract title from first line
    const firstLine = content.split('\n')[0];
    const title = firstLine.startsWith('# ') ? firstLine.substring(2) : articleFile.replace('.md', '').replace(/-/g, ' ');
    
    // Create slug
    const slug = articleFile.replace('.md', '').toLowerCase();
    
    // Categorize article
    const category = categorizeArticle(articleFile, content);
    
    // Create category directory in content
    const categoryDir = path.join(CONTENT_DEST, category);
    ensureDir(categoryDir);
    
    // Copy markdown file to content directory
    const destPath = path.join(categoryDir, articleFile);
    fs.copyFileSync(articlePath, destPath);
    console.log(`📄 Copied: ${category}/${articleFile}`);
    
    // Generate React component
    const component = generateReactComponent(title, content, category, slug);
    const componentDir = path.join(PAGES_DIR, category);
    ensureDir(componentDir);
    
    const componentPath = path.join(componentDir, `${slug}.tsx`);
    fs.writeFileSync(componentPath, component);
    console.log(`⚛️  Generated: ${category}/${slug}.tsx`);
  }
  
  return articles.length;
}

// Update category index pages
function updateCategoryIndex(category) {
  const categoryDir = path.join(PAGES_DIR, category);
  const categoryContentDir = path.join(CONTENT_DEST, category);
  
  // Ensure directories exist
  ensureDir(categoryDir);
  ensureDir(categoryContentDir);
  
  if (!fs.existsSync(categoryDir) || !fs.existsSync(categoryContentDir)) {
    return;
  }
  
  // Get all articles in this category
  const articles = fs.readdirSync(categoryContentDir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const content = fs.readFileSync(path.join(categoryContentDir, file), 'utf8');
      const firstLine = content.split('\n')[0];
      const title = firstLine.startsWith('# ') ? firstLine.substring(2) : file.replace('.md', '').replace(/-/g, ' ');
      const slug = file.replace('.md', '');
      const dateMatch = content.match(/\*\*Date:\*\*\s*(.+)/);
      const date = dateMatch ? dateMatch[1] : 'Unknown date';
      
      return { title, slug, date, filename: file };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
  
  // Generate index page
  const indexContent = `import Head from 'next/head'
import Layout from '../components/Layout'

export default function ${category.charAt(0).toUpperCase() + category.slice(1)}() {
  const articles = ${JSON.stringify(articles, null, 2)};
  
  return (
    <Layout>
      <Head>
        <title>${category.charAt(0).toUpperCase() + category.slice(1)} - iseeiape</title>
        <meta name="description" content="${category} articles and analysis from iseeiape." />
      </Head>
      
      <div className="category-container">
        <h1 className="category-title">${category === 'case-studies' ? '📊 Case Studies' : category === 'guides' ? '🎓 Guides' : '📈 Insights'}</h1>
        <p className="category-description">
          ${category === 'case-studies' ? 'Real-world trading examples and whale activity analysis.' : 
            category === 'guides' ? 'Step-by-step tutorials and educational content.' : 
            'Market analysis, trends, and investment insights.'}
        </p>
        
        <div className="articles-grid">
          {articles.map((item, index) => (
            <div key={index} className="article-card">
              <h2 className="article-card-title">
                <a href={\`/${category}/\${item.slug}\`}>{item.title}</a>
              </h2>
              <div className="article-card-meta">
                <span className="article-card-date">{item.date}</span>
              </div>
              <a href={\`/${category}/\${item.slug}\`} className="article-card-link">
                Read Article →
              </a>
            </div>
          ))}
        </div>
        
        <div className="back-home">
          <a href="/" className="back-button">
            ← Back to Home
          </a>
        </div>
      </div>
      
      <style jsx>{\`
        .category-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
          color: #fff;
          background: #0a0a0a;
          min-height: 100vh;
        }
        
        .category-title {
          font-size: 36px;
          color: #00ff88;
          margin-bottom: 20px;
        }
        
        .category-description {
          color: #888;
          margin-bottom: 40px;
          font-size: 18px;
        }
        
        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }
        
        .article-card {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 25px;
          transition: transform 0.3s, background 0.3s;
        }
        
        .article-card:hover {
          transform: translateY(-5px);
          background: #222;
        }
        
        .article-card-title {
          font-size: 20px;
          color: #fff;
          margin-bottom: 15px;
          line-height: 1.3;
        }
        
        .article-card-title a {
          color: inherit;
          text-decoration: none;
        }
        
        .article-card-title a:hover {
          color: #00ff88;
        }
        
        .article-card-meta {
          color: #888;
          font-size: 14px;
          margin-bottom: 20px;
        }
        
        .article-card-link {
          display: inline-block;
          color: #00ff88;
          text-decoration: none;
          font-weight: bold;
        }
        
        .article-card-link:hover {
          text-decoration: underline;
        }
        
        .back-home {
          margin-top: 60px;
          text-align: center;
        }
        
        .back-button {
          display: inline-block;
          padding: 12px 24px;
          background: #00ff88;
          color: #000;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          transition: background 0.3s;
        }
        
        .back-button:hover {
          background: #00cc66;
        }
      \`}</style>
    </Layout>
  )
}
`;
  
  const indexPath = path.join(categoryDir, 'index.tsx');
  fs.writeFileSync(indexPath, indexContent);
  console.log(`📋 Updated: ${category}/index.tsx (${articles.length} articles)`);
}

// Update main navigation
function updateMainNavigation() {
  console.log('\n🔗 Updating main navigation...');
  
  const categories = ['insights', 'guides', 'case-studies'];
  let navLinks = '';
  
  categories.forEach(category => {
    const categoryDir = path.join(CONTENT_DEST, category);
    let count = 0;
    
    if (fs.existsSync(categoryDir)) {
      count = fs.readdirSync(categoryDir)
        .filter(file => file.endsWith('.md')).length;
    }
    
    navLinks += `
          <li className="nav-item">
            <a href="/${category}" className="nav-link">
              ${category === 'case-studies' ? '📊 Case Studies' : category === 'guides' ? '🎓 Guides' : '📈 Insights'}
              <span className="nav-count">${count}</span>
            </a>
          </li>`;
  });
  
  console.log('✅ Navigation updated with article counts');
  return navLinks;
}

// Main execution
async function main() {
  try {
    console.log('🎯 Enhanced Content Sync');
    console.log('='.repeat(60));
    
    // Step 1: Sync generated articles
    const articleCount = await syncGeneratedArticles();
    
    // Step 2: Update category index pages
    console.log('\n📋 Updating category index pages...');
    const categories = ['insights', 'guides', 'case-studies'];
    categories.forEach(category => {
      updateCategoryIndex(category);
    });
    
    // Step 3: Update main navigation
    updateMainNavigation();
    
    console.log('\n🎉 Enhanced sync completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`  • Articles synced: ${articleCount}`);
    console.log(`  • Categories updated: ${categories.join(', ')}`);
    console.log(`  • React components generated: ${articleCount}`);
    
    console.log('\n🚀 Next steps:');
    console.log('1. Review generated pages in pages/[category]/');
    console.log('2. Test the website locally');
    console.log('3. Create PR with all changes');
    console.log('4. Deploy to production');
    
  } catch (error) {
    console.error('❌ Error during enhanced sync:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { syncGeneratedArticles, updateCategoryIndex };