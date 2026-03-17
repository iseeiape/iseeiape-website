#!/usr/bin/env node

/**
 * Cleanup Job
 * 
 * Cleans up old logs and temporary files.
 * Runs daily at midnight.
 */

const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Starting cleanup job');
console.log('='.repeat(50));

try {
  // Run the cleanup script
  const scriptPath = path.join(__dirname, '../../scripts/cleanup.js');
  console.log(`🧼 Running: ${scriptPath}`);
  
  const output = execSync(`node "${scriptPath}"`, {
    encoding: 'utf8',
    stdio: 'pipe',
    cwd: path.join(__dirname, '../..')
  });
  
  console.log(output);
  
  console.log('✅ Cleanup completed successfully');
  
} catch (error) {
  console.error('❌ Cleanup failed:', error.message);
  process.exit(1);
}