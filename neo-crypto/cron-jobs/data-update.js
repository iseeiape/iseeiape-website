#!/usr/bin/env node

/**
 * Data Update Job
 * 
 * Updates market data and whale tracking.
 * Runs every 30 minutes.
 */

const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Starting data update job');
console.log('='.repeat(50));

try {
  // Run the enhanced API script
  const scriptPath = path.join(__dirname, '../../scripts/enhanced-api.js');
  console.log(`📊 Running: ${scriptPath}`);
  
  const output = execSync(`node "${scriptPath}"`, {
    encoding: 'utf8',
    stdio: 'pipe',
    cwd: path.join(__dirname, '../..')
  });
  
  console.log(output);
  
  // Also run Wolf Pack integration if available
  const wolfPackScript = path.join(__dirname, '../scripts/wolf-pack-integration.js');
  if (require('fs').existsSync(wolfPackScript)) {
    console.log('\n🐺 Running Wolf Pack integration...');
    try {
      const wolfOutput = execSync(`node "${wolfPackScript}" --fetch`, {
        encoding: 'utf8',
        stdio: 'pipe',
        cwd: path.join(__dirname, '../..')
      });
      console.log(wolfOutput);
    } catch (wolfError) {
      console.warn('⚠️ Wolf Pack integration failed:', wolfError.message);
    }
  }
  
  console.log('✅ Data update completed successfully');
  
} catch (error) {
  console.error('❌ Data update failed:', error.message);
  process.exit(1);
}