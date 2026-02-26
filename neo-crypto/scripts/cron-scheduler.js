#!/usr/bin/env node

/**
 * 🦎 NEO CRYPTO CRON SCHEDULER
 * 
 * Manages scheduled content generation for optimal engagement times.
 * Creates cron jobs that run the alpha generator at specific times.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG_PATH = path.join(__dirname, '../config/neo-config.json');
const CRON_DIR = path.join(__dirname, '../cron');
const LOG_DIR = path.join(__dirname, '../logs');

// Ensure directories exist
[CRON_DIR, LOG_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Optimal posting times (UTC) for crypto Twitter
// Based on engagement data: 8-10 AM, 12-2 PM, 8-10 PM UTC
const OPTIMAL_TIMES = [
  { hour: 8, minute: 30, type: 'daily_alpha' },    // Morning market update
  { hour: 12, minute: 0, type: 'whale_alert' },    // Midday whale alert
  { hour: 14, minute: 30, type: 'trend_alert' },   // Afternoon trend
  { hour: 20, minute: 0, type: 'thread' },         // Evening educational thread
  { hour: 22, minute: 0, type: 'whale_alert' }     // Late night alert
];

// Generate cron job entries
function generateCronJobs() {
  const jobs = [];
  
  OPTIMAL_TIMES.forEach((time, index) => {
    const jobId = `neo_crypto_${time.type}_${index}`;
    const logFile = path.join(LOG_DIR, `${jobId}.log`);
    const errorLog = path.join(LOG_DIR, `${jobId}.error.log`);
    
    // Command to run the alpha generator with specific type
    const command = `cd "${__dirname}/.." && node scripts/alpha-generator.js --type ${time.type} >> "${logFile}" 2>> "${errorLog}"`;
    
    // Cron format: minute hour * * * command
    const cronLine = `${time.minute} ${time.hour} * * * ${command}`;
    
    jobs.push({
      id: jobId,
      time: `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')} UTC`,
      type: time.type,
      cron: cronLine,
      logFile,
      errorLog
    });
  });
  
  return jobs;
}

// Generate installation script
function generateInstallScript(jobs) {
  const script = `#!/bin/bash

# 🦎 NEO CRYPTO CRON INSTALLER
# Generated: ${new Date().toISOString()}

echo "Installing Neo Crypto cron jobs..."

# Backup existing crontab
BACKUP_FILE="crontab_backup_$(date +%Y%m%d_%H%M%S)"
crontab -l > "$BACKUP_FILE" 2>/dev/null || true
echo "✓ Crontab backed up to: $BACKUP_FILE"

# Remove any existing Neo Crypto jobs
echo "Removing existing Neo Crypto jobs..."
crontab -l | grep -v "neo_crypto_" | crontab -

# Add new jobs
echo "Adding new cron jobs..."
cat << 'EOF' | crontab -
${jobs.map(job => job.cron).join('\n')}

# Neo Crypto maintenance - daily cleanup at 3 AM
0 3 * * * find "${LOG_DIR}" -name "*.log" -mtime +7 -delete
EOF

echo ""
echo "✅ Cron jobs installed successfully!"
echo ""
echo "Scheduled jobs:"
${jobs.map(job => `echo "  • ${job.time} UTC - ${job.type} (${job.id})"`).join('\n')}
echo ""
echo "Log files will be saved to: ${LOG_DIR}"
echo "To view logs: tail -f ${LOG_DIR}/neo_crypto_*.log"
echo ""
echo "To remove all Neo Crypto jobs:"
echo "  crontab -l | grep -v 'neo_crypto_' | crontab -"
`;
  
  return script;
}

// Generate systemd service file (for Linux systems)
function generateSystemdService() {
  return `[Unit]
Description=Neo Crypto Content Generator
After=network.target

[Service]
Type=oneshot
User=${process.env.USER || 'matrix'}
WorkingDirectory=${path.join(__dirname, '..')}
ExecStart=/usr/bin/node scripts/alpha-generator.js --type daily_alpha
StandardOutput=append:${LOG_DIR}/systemd.log
StandardError=append:${LOG_DIR}/systemd.error.log

[Install]
WantedBy=multi-user.target
`;
}

// Main execution
function main() {
  console.log('🦎 Generating Neo Crypto scheduling system...\n');
  
  // Generate cron jobs
  const jobs = generateCronJobs();
  
  // Save job definitions
  const jobsFile = path.join(CRON_DIR, 'job-definitions.json');
  fs.writeFileSync(jobsFile, JSON.stringify(jobs, null, 2));
  console.log(`✓ Job definitions saved to: ${jobsFile}`);
  
  // Generate install script
  const installScript = generateInstallScript(jobs);
  const installScriptPath = path.join(CRON_DIR, 'install-cron.sh');
  fs.writeFileSync(installScriptPath, installScript);
  fs.chmodSync(installScriptPath, '755');
  console.log(`✓ Install script saved to: ${installScriptPath}`);
  
  // Generate systemd service file
  const systemdService = generateSystemdService();
  const systemdPath = path.join(CRON_DIR, 'neo-crypto.service');
  fs.writeFileSync(systemdPath, systemdService);
  console.log(`✓ Systemd service file saved to: ${systemdPath}`);
  
  // Generate test script
  const testScript = `#!/bin/bash
# Test script for Neo Crypto cron jobs
echo "Testing Neo Crypto content generation..."
cd "${path.join(__dirname, '..')}"
node scripts/alpha-generator.js --type daily_alpha
echo "✓ Test complete!"
`;
  
  const testScriptPath = path.join(CRON_DIR, 'test-cron.sh');
  fs.writeFileSync(testScriptPath, testScript);
  fs.chmodSync(testScriptPath, '755');
  console.log(`✓ Test script saved to: ${testScriptPath}`);
  
  console.log('\n📋 Installation Instructions:');
  console.log('1. Review the cron jobs:');
  console.log(`   cat ${jobsFile}`);
  console.log('\n2. Install cron jobs:');
  console.log(`   bash ${installScriptPath}`);
  console.log('\n3. Test the system:');
  console.log(`   bash ${testScriptPath}`);
  console.log('\n4. Monitor logs:');
  console.log(`   tail -f ${LOG_DIR}/neo_crypto_*.log`);
  
  console.log('\n🎯 Optimal Posting Schedule:');
  jobs.forEach(job => {
    console.log(`   ${job.time} UTC - ${job.type}`);
  });
  
  console.log('\n✅ Scheduling system generated successfully!');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateCronJobs, generateInstallScript };