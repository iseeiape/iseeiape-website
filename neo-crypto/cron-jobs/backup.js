#!/usr/bin/env node

/**
 * Backup Job
 * 
 * Backups critical data.
 * Runs daily at 2 AM.
 */

const path = require('path');
const { execSync } = require('child_process');

console.log('💾 Starting backup job');
console.log('='.repeat(50));

try {
  // Run the backup script
  const scriptPath = path.join(__dirname, '../../scripts/backup.js');
  console.log(`📦 Running: ${scriptPath}`);
  
  const output = execSync(`node "${scriptPath}"`, {
    encoding: 'utf8',
    stdio: 'pipe',
    cwd: path.join(__dirname, '../..')
  });
  
  console.log(output);
  
  // Verify backup was created
  const backupDir = path.join(__dirname, '../../backups');
  if (require('fs').existsSync(backupDir)) {
    const backups = require('fs').readdirSync(backupDir)
      .filter(f => f.startsWith('backup_'))
      .sort()
      .reverse();
    
    if (backups.length > 0) {
      const latest = backups[0];
      const backupPath = path.join(backupDir, latest);
      const stats = require('fs').statSync(backupPath);
      
      console.log(`✅ Latest backup: ${latest}`);
      console.log(`📁 Size: ${formatBytes(stats.size)}`);
      console.log(`🕒 Created: ${stats.mtime.toISOString()}`);
    }
  }
  
  console.log('✅ Backup completed successfully');
  
} catch (error) {
  console.error('❌ Backup failed:', error.message);
  process.exit(1);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}