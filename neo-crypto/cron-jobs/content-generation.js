#!/usr/bin/env node

/**
 * Content Generation Job
 * 
 * Generates new insight articles.
 * Runs every 6 hours.
 */

const path = require('path');
const { execSync } = require('child_process');

console.log('📝 Starting content generation job');
console.log('='.repeat(50));

try {
  // Run the auto content generator
  const scriptPath = path.join(__dirname, '../../scripts/auto-content-generator.js');
  console.log(`📄 Running: ${scriptPath}`);
  
  const output = execSync(`node "${scriptPath}" --topic auto`, {
    encoding: 'utf8',
    stdio: 'pipe',
    cwd: path.join(__dirname, '../..')
  });
  
  console.log(output);
  
  // Log the generation
  const logDir = path.join(__dirname, '../logs');
  if (!require('fs').existsSync(logDir)) {
    require('fs').mkdirSync(logDir, { recursive: true });
  }
  
  const logFile = path.join(logDir, `content-generation-${new Date().toISOString().split('T')[0]}.log`);
  require('fs').appendFileSync(logFile, `\n=== ${new Date().toISOString()} ===\n${output}\n`, 'utf8');
  
  console.log('✅ Content generation completed successfully');
  console.log(`📁 Log saved to: ${logFile}`);
  
} catch (error) {
  console.error('❌ Content generation failed:', error.message);
  process.exit(1);
}