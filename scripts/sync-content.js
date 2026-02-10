#!/usr/bin/env node

/**
 * Content Sync Script
 * 
 * Syncs content from workspace to iseeiape-website
 * 
 * Usage: node scripts/sync-content.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const WORKSPACE_ROOT = path.join(__dirname, '..', '..');
const WEBSITE_ROOT = path.join(__dirname, '..');
const CONTENT_SOURCE = path.join(WORKSPACE_ROOT, 'content');
const CONTENT_DEST = path.join(WEBSITE_ROOT, 'content');

console.log('🚀 Starting content sync...');
console.log(`Workspace: ${WORKSPACE_ROOT}`);
console.log(`Website: ${WEBSITE_ROOT}`);
console.log(`Source: ${CONTENT_SOURCE}`);
console.log(`Destination: ${CONTENT_DEST}`);

// Ensure destination exists
if (!fs.existsSync(CONTENT_DEST)) {
  fs.mkdirSync(CONTENT_DEST, { recursive: true });
}

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      // Only copy markdown files
      if (entry.name.endsWith('.md')) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`📄 Copied: ${entry.name}`);
      }
    }
  }
}

// Function to generate pages from content
function generatePages() {
  console.log('\n📝 Generating pages from content...');
  
  const pagesDir = path.join(WEBSITE_ROOT, 'pages');
  const contentDir = path.join(CONTENT_DEST);
  
  // Read all markdown files
  const markdownFiles = [];
  
  function findMarkdownFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        findMarkdownFiles(fullPath);
      } else if (entry.name.endsWith('.md')) {
        markdownFiles.push({
          path: fullPath,
          relativePath: path.relative(contentDir, fullPath),
          name: entry.name
        });
      }
    }
  }
  
  findMarkdownFiles(contentDir);
  
  console.log(`Found ${markdownFiles.length} markdown files`);
  
  // Create directories if they don't exist
  const insightsDir = path.join(pagesDir, 'insights');
  const guidesDir = path.join(pagesDir, 'guides');
  const caseStudiesDir = path.join(pagesDir, 'case-studies');
  
  if (!fs.existsSync(insightsDir)) {
    fs.mkdirSync(insightsDir, { recursive: true });
  }
  if (!fs.existsSync(guidesDir)) {
    fs.mkdirSync(guidesDir, { recursive: true });
  }
  if (!fs.existsSync(caseStudiesDir)) {
    fs.mkdirSync(caseStudiesDir, { recursive: true });
  }
  
  // Generate pages for each markdown file
  for (const file of markdownFiles) {
    const content = fs.readFileSync(file.path, 'utf8');
    
    // Extract title from first line (assuming # Title format)
    const firstLine = content.split('\n')[0];
    const title = firstLine.startsWith('# ') ? firstLine.substring(2) : file.name.replace('.md', '');
    
    // Create slug from filename
    const slug = file.name.replace('.md', '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Determine page type based on directory
    let pageType = 'insights';
    if (file.relativePath.includes('daily-drops')) {
      pageType = 'guides';
    } else if (file.relativePath.includes('case-studies')) {
      pageType = 'case-studies';
    } else if (file.relativePath.includes('x-articles')) {
      pageType = 'insights';
    } else if (file.relativePath.includes('viral-threads')) {
      pageType = 'insights';
    }
    
    // Generate React component
    const componentContent = `import Head from 'next/head'

export default function ${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, '')}() {
  return (
    <>
      <Head>
        <title>${title} - iseeiape</title>
        <meta name="description" content="${title}" />
      </Head>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', color: '#fff', background: '#0a0a0a', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '36px', color: '#00ff88', marginBottom: '30px' }}>${title}</h1>
        <div style={{ 
          background: '#111', 
          padding: '30px', 
          borderRadius: '12px',
          lineHeight: '1.6',
          fontSize: '16px'
        }}>
          {/* Content will be rendered here */}
          <p style={{ color: '#888', fontStyle: 'italic' }}>
            This content is auto-generated from markdown. The full content will be displayed here.
          </p>
          <pre style={{ 
            background: '#1a1a1a', 
            padding: '20px', 
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '14px'
          }}>
            {${JSON.stringify(content.substring(0, 500) + '...')}}
          </pre>
        </div>
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <a href="/${pageType}" style={{ 
            padding: '10px 20px', 
            background: '#00ff88', 
            color: '#000', 
            textDecoration: 'none', 
            borderRadius: '8px' 
          }}>
            ← Back to ${pageType.charAt(0).toUpperCase() + pageType.slice(1)}
          </a>
        </div>
      </div>
    </>
  )
}
`;
    
    // Write component file
    const outputDir = path.join(pagesDir, pageType);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputPath = path.join(outputDir, `${slug}.tsx`);
    fs.writeFileSync(outputPath, componentContent);
    console.log(`📄 Generated: ${pageType}/${slug}.tsx`);
  }
}

// Function to update navigation
function updateNavigation() {
  console.log('\n🔗 Updating navigation...');
  
  const pagesDir = path.join(WEBSITE_ROOT, 'pages');
  const insightsDir = path.join(pagesDir, 'insights');
  
  // Get all insight pages
  const insightPages = fs.readdirSync(insightsDir)
    .filter(file => file.endsWith('.tsx') && file !== 'index.tsx')
    .map(file => ({
      name: file.replace('.tsx', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      path: `/insights/${file.replace('.tsx', '')}`
    }));
  
  console.log(`Found ${insightPages.length} insight pages`);
  
  // Update insights index page
  const insightsIndexPath = path.join(insightsDir, 'index.tsx');
  if (fs.existsSync(insightsIndexPath)) {
    let insightsIndex = fs.readFileSync(insightsIndexPath, 'utf8');
    
    // Generate links HTML
    const linksHTML = insightPages.map(page => `
          <div style={{ padding: '20px', marginBottom: '15px', background: '#1a1a1a', borderRadius: '8px' }}>
            <a href="${page.path}" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '18px' }}>
              ${page.name}
            </a>
          </div>
        `).join('\n');
    
    // Update the page content (simplified - in real implementation would parse and update properly)
    const updatedContent = `import Head from 'next/head'

export default function Insights() {
  return (
    <>
      <Head>
        <title>Insights - iseeiape</title>
        <meta name="description" content="Latest insights and analysis from iseeiape." />
      </Head>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', color: '#fff', background: '#0a0a0a', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '36px', color: '#00ff88', marginBottom: '30px' }}>📈 Insights & Analysis</h1>
        <p style={{ color: '#888', marginBottom: '40px' }}>
          Latest research, analysis, and deep dives from the Matrix Army.
        </p>
        
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Latest Articles</h2>
          ${linksHTML}
        </div>
        
        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <a href="/" style={{ 
            padding: '10px 20px', 
            background: '#00ff88', 
            color: '#000', 
            textDecoration: 'none', 
            borderRadius: '8px' 
          }}>
            ← Back to Home
          </a>
        </div>
      </div>
    </>
  )
}
`;
    
    fs.writeFileSync(insightsIndexPath, updatedContent);
    console.log('✅ Updated insights index page');
  }
}

// Main execution
try {
  // Step 1: Copy content from workspace
  console.log('\n📦 Step 1: Copying content from workspace...');
  copyDir(CONTENT_SOURCE, CONTENT_DEST);
  
  // Step 2: Generate pages from content
  generatePages();
  
  // Step 3: Update navigation
  updateNavigation();
  
  console.log('\n🎉 Content sync completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Review the generated pages');
  console.log('2. Test the website locally');
  console.log('3. Create PR with changes');
  
} catch (error) {
  console.error('❌ Error during content sync:', error);
  process.exit(1);
}