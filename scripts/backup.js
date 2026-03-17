#!/usr/bin/env node

/**
 * Backup Script for iseeiape
 * 
 * Creates backups of critical data and configuration files.
 * 
 * Usage: node scripts/backup.js [--destination <path>] [--incremental]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// Configuration
const CONFIG = {
  // Source directories to backup
  sources: [
    {
      path: path.join(__dirname, '../neo-crypto/data'),
      name: 'neo-crypto-data',
      include: ['*.json', '*.db'],
      exclude: ['temp_*', '*.tmp']
    },
    {
      path: path.join(__dirname, '../neo-crypto/config'),
      name: 'neo-crypto-config',
      include: ['*.json', '*.yaml', '*.yml']
    },
    {
      path: path.join(__dirname, '../neo-crypto/templates'),
      name: 'content-templates',
      include: ['*.md']
    },
    {
      path: path.join(__dirname, '../pages/insights'),
      name: 'insight-pages',
      include: ['*.tsx', '*.md']
    }
  ],
  
  // Backup destination
  defaultDestination: path.join(__dirname, '../backups'),
  
  // Retention policy
  retention: {
    daily: 7,     // Keep daily backups for 7 days
    weekly: 4,    // Keep weekly backups for 4 weeks
    monthly: 12   // Keep monthly backups for 12 months
  },
  
  // Compression settings
  compression: {
    enabled: true,
    format: 'zip' // or 'tar.gz'
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const destination = args.find(arg => arg.startsWith('--destination='))?.split('=')[1] || CONFIG.defaultDestination;
const incremental = args.includes('--incremental');
const dryRun = args.includes('--dry-run');

console.log(`💾 Starting backup${dryRun ? ' (DRY RUN)' : ''}`);
console.log(`📁 Destination: ${destination}`);
console.log(`🔄 Mode: ${incremental ? 'Incremental' : 'Full'}`);
console.log('='.repeat(50));

// Helper functions
function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

function getTimestamp() {
  const now = new Date();
  return {
    date: now.toISOString().split('T')[0],
    datetime: now.toISOString().replace(/[:.]/g, '-'),
    year: now.getFullYear(),
    month: String(now.getMonth() + 1).padStart(2, '0'),
    day: String(now.getDate()).padStart(2, '0'),
    hour: String(now.getHours()).padStart(2, '0'),
    minute: String(now.getMinutes()).padStart(2, '0')
  };
}

function calculateFileHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256');
    hash.update(fileBuffer);
    return hash.digest('hex');
  } catch (error) {
    console.error(`❌ Error calculating hash for ${filePath}:`, error.message);
    return null;
  }
}

function getFilesToBackup(sourceConfig) {
  const files = [];
  
  if (!fs.existsSync(sourceConfig.path)) {
    console.log(`⚠️ Source directory does not exist: ${sourceConfig.path}`);
    return files;
  }
  
  function scanDirectory(currentDir, relativePath = '') {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item.name);
      const relPath = path.join(relativePath, item.name);
      
      if (item.isDirectory()) {
        scanDirectory(fullPath, relPath);
      } else if (item.isFile()) {
        // Check include/exclude patterns
        let includeFile = sourceConfig.include.length === 0;
        for (const pattern of sourceConfig.include) {
          const regex = new RegExp(pattern.replace('*', '.*'));
          if (regex.test(item.name)) {
            includeFile = true;
            break;
          }
        }
        
        for (const pattern of (sourceConfig.exclude || [])) {
          const regex = new RegExp(pattern.replace('*', '.*'));
          if (regex.test(item.name)) {
            includeFile = false;
            break;
          }
        }
        
        if (includeFile) {
          const stats = fs.statSync(fullPath);
          const hash = calculateFileHash(fullPath);
          
          files.push({
            source: fullPath,
            relative: relPath,
            name: item.name,
            size: stats.size,
            mtime: stats.mtimeMs,
            hash: hash
          });
        }
      }
    }
  }
  
  scanDirectory(sourceConfig.path);
  return files;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function copyFile(source, target) {
  if (dryRun) {
    console.log(`📋 Would copy: ${source} → ${target}`);
    return true;
  }
  
  try {
    // Ensure target directory exists
    ensureDirectory(path.dirname(target));
    
    // Copy file
    fs.copyFileSync(source, target);
    console.log(`✅ Copied: ${path.basename(source)}`);
    return true;
  } catch (error) {
    console.error(`❌ Error copying ${source}:`, error.message);
    return false;
  }
}

function createManifest(files, backupType) {
  const timestamp = getTimestamp();
  const manifest = {
    backup: {
      id: `backup_${timestamp.datetime}`,
      type: backupType,
      timestamp: new Date().toISOString(),
      date: timestamp.date,
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0)
    },
    sources: {},
    files: files.map(file => ({
      path: file.relative,
      size: file.size,
      hash: file.hash,
      mtime: file.mtime
    }))
  };
  
  // Group by source
  files.forEach(file => {
    const sourceName = file.source.split('/').find(part => part.includes('neo-crypto') || part.includes('insights')) || 'unknown';
    if (!manifest.sources[sourceName]) {
      manifest.sources[sourceName] = {
        fileCount: 0,
        totalSize: 0
      };
    }
    manifest.sources[sourceName].fileCount++;
    manifest.sources[sourceName].totalSize += file.size;
  });
  
  return manifest;
}

// Main backup process
async function runBackup() {
  const timestamp = getTimestamp();
  const backupType = incremental ? 'incremental' : 'full';
  const backupId = `backup_${timestamp.date}_${backupType}`;
  const backupDir = path.join(destination, backupId);
  
  console.log(`📦 Backup ID: ${backupId}`);
  
  // Ensure backup directory exists
  ensureDirectory(backupDir);
  
  let totalFiles = 0;
  let totalSize = 0;
  const allFiles = [];
  
  // Process each source
  for (const source of CONFIG.sources) {
    console.log(`\n📁 Processing: ${source.name}`);
    
    const files = getFilesToBackup(source);
    console.log(`  Found ${files.length} files`);
    
    if (files.length === 0) {
      continue;
    }
    
    // Copy files
    const sourceBackupDir = path.join(backupDir, source.name);
    let copiedCount = 0;
    
    for (const file of files) {
      const targetPath = path.join(sourceBackupDir, file.relative);
      const copied = copyFile(file.source, targetPath);
      
      if (copied && !dryRun) {
        copiedCount++;
        totalFiles++;
        totalSize += file.size;
        allFiles.push({
          ...file,
          backupPath: targetPath
        });
      }
    }
    
    console.log(`  Copied: ${copiedCount}/${files.length} files`);
  }
  
  // Create manifest
  if (!dryRun && allFiles.length > 0) {
    const manifest = createManifest(allFiles, backupType);
    const manifestPath = path.join(backupDir, 'manifest.json');
    
    fs.writeFileSync(
      manifestPath,
      JSON.stringify(manifest, null, 2),
      'utf8'
    );
    
    console.log(`\n📄 Created manifest: ${manifestPath}`);
  }
  
  // Apply retention policy
  console.log('\n🧹 Applying retention policy:');
  applyRetentionPolicy(destination);
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('💾 BACKUP SUMMARY');
  console.log('='.repeat(50));
  
  if (dryRun) {
    console.log('📋 DRY RUN - No files were actually backed up');
    console.log(`📋 Would backup: ${totalFiles} files`);
    console.log(`📋 Total size: ${formatBytes(totalSize)}`);
  } else {
    console.log(`✅ Backed up: ${totalFiles} files`);
    console.log(`✅ Total size: ${formatBytes(totalSize)}`);
    console.log(`✅ Location: ${backupDir}`);
    
    // Create symlink to latest backup
    const latestLink = path.join(destination, 'latest');
    try {
      if (fs.existsSync(latestLink)) {
        fs.unlinkSync(latestLink);
      }
      fs.symlinkSync(backupDir, latestLink, 'dir');
      console.log(`🔗 Created symlink: ${latestLink} → ${backupId}`);
    } catch (error) {
      console.error('⚠️ Could not create latest symlink:', error.message);
    }
  }
  
  console.log('\n✅ Backup completed successfully!');
}

function applyRetentionPolicy(backupDir) {
  if (!fs.existsSync(backupDir)) {
    return;
  }
  
  const items = fs.readdirSync(backupDir, { withFileTypes: true });
  const backups = [];
  
  // Collect all backups
  for (const item of items) {
    if (item.isDirectory() && item.name.startsWith('backup_')) {
      const backupPath = path.join(backupDir, item.name);
      const stats = fs.statSync(backupPath);
      
      backups.push({
        name: item.name,
        path: backupPath,
        date: item.name.match(/backup_(\d{4}-\d{2}-\d{2})/)?.[1],
        timestamp: stats.mtimeMs,
        age: Math.floor((Date.now() - stats.mtimeMs) / (24 * 60 * 60 * 1000))
      });
    }
  }
  
  // Sort by date (newest first)
  backups.sort((a, b) => b.timestamp - a.timestamp);
  
  console.log(`  Found ${backups.length} existing backups`);
  
  // Apply retention
  let deleted = 0;
  for (const backup of backups) {
    let shouldKeep = false;
    
    // Keep backups from last 7 days
    if (backup.age <= CONFIG.retention.daily) {
      shouldKeep = true;
    }
    // Keep weekly backups (Sunday backups) for 4 weeks
    else if (backup.age <= CONFIG.retention.weekly * 7) {
      const date = new Date(backup.timestamp);
      if (date.getDay() === 0) { // Sunday
        shouldKeep = true;
      }
    }
    // Keep monthly backups (1st of month) for 12 months
    else if (backup.age <= CONFIG.retention.monthly * 30) {
      const date = new Date(backup.timestamp);
      if (date.getDate() === 1) { // 1st of month
        shouldKeep = true;
      }
    }
    
    if (!shouldKeep) {
      if (dryRun) {
        console.log(`  📋 Would delete old backup: ${backup.name} (${backup.age} days old)`);
      } else {
        try {
          // Delete backup directory
          execSync(`rm -rf "${backup.path}"`);
          console.log(`  🗑️  Deleted old backup: ${backup.name} (${backup.age} days old)`);
          deleted++;
        } catch (error) {
          console.error(`  ❌ Error deleting ${backup.name}:`, error.message);
        }
      }
    }
  }
  
  if (deleted > 0) {
    console.log(`  Deleted ${deleted} old backups`);
  }
}

// Run backup
runBackup().catch(error => {
  console.error('❌ Backup failed:', error);
  process.exit(1);
});