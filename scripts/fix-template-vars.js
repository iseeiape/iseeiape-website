#!/usr/bin/env node

/**
 * Fix template variables in generated content
 */

const fs = require('fs');
const path = require('path');

// Find all generated content files
const contentDir = path.join(__dirname, '../neo-crypto/outputs/enhanced-content');
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const filePath = path.join(contentDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if there are any {{metadata.*}} variables
  const metadataMatches = content.match(/\{\{metadata\.(\w+)\}\}/g);
  
  if (metadataMatches) {
    console.log(`🔧 Fixing ${file}: ${metadataMatches.length} metadata variables`);
    
    // Try to load corresponding metadata file
    const metaFile = filePath.replace('.md', '-meta.json');
    if (fs.existsSync(metaFile)) {
      const metadata = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
      
      // Replace metadata variables
      metadataMatches.forEach(match => {
        const key = match.match(/\{\{metadata\.(\w+)\}\}/)[1];
        if (metadata[key] !== undefined) {
          content = content.replace(match, metadata[key]);
        } else {
          // Provide default values
          const defaults = {
            confidence: metadata.confidence || 'N/A',
            generatedAt: metadata.generatedAt || new Date().toISOString(),
            alertId: metadata.alertId || 'N/A',
            category: metadata.category || 'unknown'
          };
          if (defaults[key] !== undefined) {
            content = content.replace(match, defaults[key]);
          }
        }
      });
      
      // Also fix other common template variables
      const confidence = metadata.confidence || 50;
      content = content.replace(/\{\{confidenceCategory\}\}/g, 
        confidence >= 80 ? 'High' : confidence >= 60 ? 'Medium' : 'Low');
      content = content.replace(/\{\{riskCategory\}\}/g, 
        confidence >= 80 ? 'Medium' : 'High');
      content = content.replace(/\{\{timeHorizon\}\}/g, 
        '1-7 days');
      content = content.replace(/\{\{positionSizing\}\}/g, 
        confidence >= 80 ? '1-3% of portfolio' : '0.5-1% of portfolio');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${file}`);
    } else {
      console.log(`⚠️  No metadata file for: ${file}`);
    }
  }
});

console.log('\n✅ Template variable fix completed!');