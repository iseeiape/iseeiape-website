#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the markdown file
const markdownPath = path.join(__dirname, '../content/daily-drops/day37-wolf-pack-performance-fix-2026-04-03.md');
const markdownContent = fs.readFileSync(markdownPath, 'utf8');

// Parse the markdown to extract metadata and content
const lines = markdownContent.split('\n');
let title = '';
let date = '';
let readTime = '';
let tags = [];
let contentLines = [];
let executiveSummary = '';

// Extract title (first line after #)
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('# ')) {
    title = lines[i].substring(2).trim();
    // Remove "Day 37: " prefix if present
    title = title.replace(/^Day \d+: /, '');
    break;
  }
}

// Extract metadata
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith('**Date:**')) {
    date = line.replace('**Date:**', '').trim();
  } else if (line.startsWith('**Read Time:**')) {
    readTime = line.replace('**Read Time:**', '').trim();
  } else if (line.startsWith('**Tags:**')) {
    const tagsStr = line.replace('**Tags:**', '').trim();
    tags = tagsStr.split(',').map(tag => tag.trim());
  } else if (line.startsWith('## Executive Summary')) {
    // Get the executive summary (next paragraph)
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j].trim() === '' || lines[j].startsWith('##')) break;
      executiveSummary += lines[j].trim() + ' ';
    }
    break;
  }
}

// Get the full content (skip the front matter)
let inContent = false;
const fullContent = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('## Executive Summary')) {
    inContent = true;
  }
  if (inContent) {
    fullContent.push(lines[i]);
  }
}

// Create the page content with proper JSX
const pageContent = `import Layout from '../../components/Layout'

export default function WolfPackPerformanceFix() {
  return (
    <Layout title="${title} | iseeiape">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#fff', minHeight: '100vh' }}>

        <a href="/insights" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'block' }}>← Back to Insights</a>

        <span style={{ padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px' }}>🆕 Today - ${date}</span>
        
        <h1 style={{ fontSize: '42px', marginTop: '15px', marginBottom: '20px' }}>${title}</h1>
        
        <p style={{ color: '#888', marginBottom: '40px', fontSize: '18px' }}>
          ${executiveSummary.trim()}
        </p>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>${readTime}</span>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Technical Case Study</span>
          ${tags.map(tag => `<span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>${tag}</span>`).join('\n          ')}
        </div>

        <div style={{ color: '#aaa', lineHeight: '1.6', fontSize: '16px' }}>
          ${fullContent.map(line => {
            // Convert markdown to simple JSX
            if (line.startsWith('# ')) {
              return `<h1 style={{ fontSize: '32px', margin: '30px 0 15px', color: '#fff' }}>${line.substring(2)}</h1>`;
            } else if (line.startsWith('## ')) {
              return `<h2 style={{ fontSize: '24px', margin: '25px 0 12px', color: '#00ff88' }}>${line.substring(3)}</h2>`;
            } else if (line.startsWith('### ')) {
              return `<h3 style={{ fontSize: '20px', margin: '20px 0 10px', color: '#4ecdc4' }}>${line.substring(4)}</h3>`;
            } else if (line.startsWith('#### ')) {
              return `<h4 style={{ fontSize: '18px', margin: '15px 0 8px', color: '#feca57' }}>${line.substring(5)}</h4>`;
            } else if (line.startsWith('- ') || line.startsWith('* ')) {
              return `<div style={{ marginLeft: '20px', marginBottom: '8px' }}>• ${line.substring(2)}</div>`;
            } else if (line.startsWith('```')) {
              return `<div style={{ background: '#0a0a0a', padding: '15px', borderRadius: '8px', margin: '15px 0', fontFamily: 'monospace', fontSize: '14px', border: '1px solid #333' }}>`;
            } else if (line.trim() === '') {
              return `<div style={{ height: '15px' }}></div>`;
            } else {
              return `<p style={{ marginBottom: '15px' }}>${line}</p>`;
            }
          }).join('\n          ')}
        </div>

      </div>
    </Layout>
  );
}`;

// Write the page file
const pagePath = path.join(__dirname, '../pages/insights/wolf-pack-performance-fix-2026-04-03.tsx');
fs.writeFileSync(pagePath, pageContent, 'utf8');

console.log(`✅ Created page at ${pagePath}`);