#!/usr/bin/env node
/**
 * Performance Updater Script
 * Updates Wolf Pack performance metrics
 */

const { exec } = require('child_process');
const path = require('path');

console.log('🔄 Updating Wolf Pack performance metrics...');

// Run the fix script
const fixScript = path.join(__dirname, '../../fix_performance_tracker.py');
const command = `python3 ${fixScript}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error updating performance:', error.message);
    console.error('stderr:', stderr);
    return;
  }
  
  console.log('✅ Performance metrics updated successfully');
  console.log(stdout);
});
