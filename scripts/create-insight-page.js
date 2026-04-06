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
let inFrontMatter = false;

for (const line of lines) {
  if (line.startsWith('# ')) {
    title = line.substring(2);
  } else if (line.startsWith('**Date:**')) {
    date = line.replace('**Date:**', '').trim();
  } else if (line.startsWith('**Type:**')) {
    // Skip type line
  } else if (line.startsWith('**Read Time:**')) {
    readTime = line.replace('**Read Time:**', '').trim();
  } else if (line.startsWith('**Tags:**')) {
    const tagsStr = line.replace('**Tags:**', '').trim();
    tags = tagsStr.split(',').map(tag => tag.trim());
  } else {
    contentLines.push(line);
  }
}

// Clean up title (remove date part)
title = title.split(':')[0].trim();

// Create the page content
const pageContent = `import Layout from '../../components/Layout'

export default function WolfPackPerformanceFix() {
  return (
    <Layout title="${title} | iseeiape">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#fff', minHeight: '100vh' }}>

        <a href="/insights" style={{ color: '#00ff88', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'block' }}>← Back to Insights</a>

        <span style={{ padding: '4px 12px', background: '#00ff8833', color: '#00ff88', borderRadius: '20px', fontSize: '12px' }}>🆕 Today - ${date}</span>
        
        <h1 style={{ fontSize: '42px', marginTop: '15px', marginBottom: '20px' }}>${title}</h1>
        
        <p style={{ color: '#888', marginBottom: '40px', fontSize: '18px' }}>
          A deep dive into debugging and fixing critical performance tracking: from 98.5% delisted tokens to robust price tracking. Learn how we diagnosed API endpoint confusion, fixed database schema, and built resilient DeFi data pipelines.
        </p>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>${readTime}</span>
          <span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>Technical Case Study</span>
          ${tags.map(tag => `<span style={{ padding: '6px 15px', background: '#111', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff88' }}>${tag}</span>`).join('\n          ')}
        </div>

        <div style={{ background: '#111', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #222' }}>
          <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>📊 Executive Summary</h2>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            For weeks, our Wolf Pack performance tracker was broken - 98.5% of alerts were being marked as "delisted" incorrectly. The root cause? A subtle but critical data modeling error: we were storing pair addresses (LP pool addresses) but trying to fetch prices using token address endpoints. This case study walks through how we diagnosed and fixed the issue, turning a broken system into a robust performance tracking engine.
          </p>
        </div>

        <div style={{ whiteSpace: 'pre-wrap', color: '#aaa', lineHeight: '1.6', fontSize: '16px' }}>
          ${contentLines.join('\n').replace(/`/g, '\\`').replace(/\${/g, '\\${')}
        </div>

      </div>
    </Layout>
  );
}`;

// Write the page file
const pagePath = path.join(__dirname, '../pages/insights/wolf-pack-performance-fix-2026-04-03.tsx');
fs.writeFileSync(pagePath, pageContent, 'utf8');

console.log(`✅ Created page at ${pagePath}`);