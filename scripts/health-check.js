#!/usr/bin/env node
/**
 * Website Health Check
 */

const https = require('https');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function checkWebsite() {
  console.log('🏥 Checking website health...');
  
  const checks = [
    { name: 'Main Site', url: 'https://iseeiape.com' },
    { name: 'API Health', url: 'https://iseeiape.com/api/health' },
    { name: 'Dashboard', url: 'https://iseeiape.com/dashboard-enhanced-v3' }
  ];
  
  for (const check of checks) {
    try {
      const response = await fetch(check.url);
      const status = response.status;
      
      if (status >= 200 && status < 300) {
        console.log(`  ✅ ${check.name}: HTTP ${status}`);
      } else {
        console.log(`  ⚠️  ${check.name}: HTTP ${status}`);
      }
    } catch (error) {
      console.log(`  ❌ ${check.name}: ${error.message}`);
    }
  }
  
  // Check disk space
  try {
    const { stdout } = await execAsync('df -h . | tail -1');
    console.log(`  💾 Disk: ${stdout.trim()}`);
  } catch (error) {
    console.log(`  ⚠️  Disk check failed: ${error.message}`);
  }
  
  console.log('✅ Health check completed');
}

checkWebsite().catch(console.error);
