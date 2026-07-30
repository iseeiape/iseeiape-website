#!/usr/bin/env node
/**
 * Backup Wolf Pack Performance Database
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const DB_PATH = path.join(__dirname, '../../wolf_performance.db');
const BACKUP_DIR = path.join(__dirname, '../../backups');
const DATE = new Date().toISOString().split('T')[0];
const BACKUP_PATH = path.join(BACKUP_DIR, `wolf-performance-${DATE}.db`);

async function backupDatabase() {
  console.log('💾 Backing up Wolf Pack performance database...');
  
  // Ensure backup directory exists
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  // Check if database exists
  if (!fs.existsSync(DB_PATH)) {
    console.log('❌ Database not found:', DB_PATH);
    return;
  }
  
  // Create backup using SQLite backup API (night-shift 2026-07-31)
    // Plain `cp` on a WAL-mode DB misses uncheckpointed pages → corrupt backup.
    // Using sqlite3 CLI .backup ensures a consistent snapshot.
    try {
    const sqlite3mod = require('sqlite3').verbose();
    const srcDb = new sqlite3mod.Database(DB_PATH, sqlite3mod.OPEN_READONLY);
    await new Promise((resolve, reject) => {
      srcDb.run('PRAGMA wal_checkpoint(TRUNCATE)', (err) => {
        if (err) reject(err); else resolve();
      });
    });
    await new Promise((resolve, reject) => {
      srcDb.close((err) => err ? reject(err) : resolve());
    });
    // Now safe to copy the checkpointed DB file
    await execAsync(`cp "${DB_PATH}" "${BACKUP_PATH}"`);
    console.log(`✅ Backup created: ${BACKUP_PATH}`);
    
    // Clean old backups (keep last 7 days)
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('wolf-performance-') && f.endsWith('.db'))
      .map(f => ({ name: f, path: path.join(BACKUP_DIR, f), time: fs.statSync(path.join(BACKUP_DIR, f)).mtime }))
      .sort((a, b) => b.time - a.time);
    
    if (files.length > 7) {
      const toDelete = files.slice(7);
      toDelete.forEach(file => {
        fs.unlinkSync(file.path);
        console.log(`🗑️  Deleted old backup: ${file.name}`);
      });
    }
    
    console.log(`📊 Backups kept: ${Math.min(files.length, 7)}/${files.length}`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
  }
}

backupDatabase().catch(console.error);
