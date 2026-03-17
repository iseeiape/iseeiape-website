# 🚀 iseeiape Automation System - Deployment Guide

## Overview

The iseeiape automation system consists of:
1. **Cron Job Manager** - Scheduled tasks for data updates, content generation, cleanup, and backups
2. **Neo Crypto Engine** - Real-time market data and analysis
3. **Wolf Pack Integration** - Alert system integration
4. **Content Generator** - Automated insight article creation

## Prerequisites

### System Requirements
- Node.js 18+ and npm
- Python 3.8+ (for Wolf Pack integration)
- Git
- 2GB RAM minimum, 4GB recommended
- 10GB disk space

### Dependencies
```bash
# Node.js dependencies
cd /home/matrix/.openclaw/workspace/iseeiape-website
npm install

# Python dependencies (for Wolf Pack)
pip3 install requests python-dotenv
```

## Deployment Options

### Option 1: PM2 (Recommended for Development)

PM2 provides process management, monitoring, and auto-restart.

#### Installation
```bash
# Install PM2 globally
npm install -g pm2

# Start automation system
cd /home/matrix/.openclaw/workspace/iseeiape-website
pm2 start deployment/ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup
```

#### PM2 Commands
```bash
# View status
pm2 status
pm2 logs iseeiape-automation

# Monitor
pm2 monit

# Restart
pm2 restart iseeiape-automation

# Stop
pm2 stop iseeiape-automation

# Delete from PM2
pm2 delete iseeiape-automation
```

### Option 2: systemd (Recommended for Production)

systemd provides better integration with Linux systems and automatic startup.

#### Installation
```bash
# Copy service file
sudo cp deployment/iseeiape-automation.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable auto-start
sudo systemctl enable iseeiape-automation.service

# Start service
sudo systemctl start iseeiape-automation.service
```

#### systemd Commands
```bash
# View status
sudo systemctl status iseeiape-automation.service

# View logs
sudo journalctl -u iseeiape-automation.service -f

# Restart
sudo systemctl restart iseeiape-automation.service

# Stop
sudo systemctl stop iseeiape-automation.service

# Disable auto-start
sudo systemctl disable iseeiape-automation.service
```

## Configuration

### Environment Variables

Create `.env` file in project root:
```bash
NODE_ENV=production
PORT=3000
DEXSCREENER_API_KEY=your_key_here
COINGECKO_API_KEY=your_key_here
WOLF_PACK_PATH=/home/matrix/.openclaw/workspace/wolf_pack_v8_complete.py
```

### Neo Crypto Engine Configuration

Edit `neo-crypto/config/neo-config.json`:
```json
{
  "apiKeys": {
    "dexscreener": "your_key",
    "coingecko": "your_key"
  },
  "trackedTokens": ["SOL", "WIF", "JUP", "BONK", "POPCAT"],
  "updateInterval": 1800000,
  "contentGeneration": {
    "enabled": true,
    "schedule": "0 */6 * * *",
    "maxArticles": 2
  }
}
```

## Cron Jobs

The system manages these automated tasks:

### Active Jobs
| Job | Schedule | Description | Status |
|-----|----------|-------------|--------|
| `data-update` | Every 30 minutes | Updates market data and whale tracking | ✅ Enabled |
| `content-generation` | Every 6 hours | Generates new insight articles | ✅ Enabled |
| `cleanup` | Daily at midnight | Cleans logs and temporary files | ✅ Enabled |
| `backup` | Daily at 2 AM | Backups critical data | ✅ Enabled |

### Disabled Jobs
| Job | Schedule | Description | Status |
|-----|----------|-------------|--------|
| `social-media` | Every 4 hours | Creates social media posts | ❌ Disabled |

### Manual Job Control
```bash
# List jobs
node scripts/cron-manager.js list

# Run specific job
node scripts/cron-manager.js run data-update

# Test job (dry run)
node scripts/cleanup.js --dry-run
node scripts/backup.js --dry-run

# Check job status
node scripts/cron-manager.js status
```

## Monitoring

### Log Files
- `neo-crypto/logs/` - Cron job logs
- `logs/` - Application logs (if using PM2)
- Journal logs (if using systemd)

### Health Checks
```bash
# Check if automation is running
curl http://localhost:3000/api/health

# Check data freshness
curl http://localhost:3000/api/enhanced/data-v2

# View recent alerts
cat neo-crypto/data/wolf-pack-summary.json | jq .
```

### Performance Monitoring
```bash
# Check memory usage
pm2 monit
# or
top -p $(pgrep -f "cron-manager")

# Check disk space
df -h /home/matrix/.openclaw/workspace

# Check log sizes
du -sh neo-crypto/logs/
```

## Backup and Recovery

### Automated Backups
- Location: `backups/` directory
- Schedule: Daily at 2 AM
- Retention: 7 days daily, 4 weeks weekly, 12 months monthly
- Latest backup: `backups/latest` symlink

### Manual Backup
```bash
node scripts/backup.js --destination /path/to/backup
```

### Restore from Backup
```bash
# Find backup
ls -la backups/

# Restore specific backup
cp -r backups/backup_2026-03-16_full/neo-crypto-data/* neo-crypto/data/
cp -r backups/backup_2026-03-16_full/neo-crypto-config/* neo-crypto/config/
```

## Troubleshooting

### Common Issues

#### 1. Cron Jobs Not Running
```bash
# Check if manager is running
ps aux | grep cron-manager

# Check logs
tail -f neo-crypto/logs/cron-manager.log

# Test manual execution
node scripts/cron-manager.js run data-update
```

#### 2. API Connection Issues
```bash
# Test DexScreener API
curl "https://api.dexscreener.com/latest/dex/search?q=So11111111111111111111111111111111111111112"

# Check API keys
cat neo-crypto/config/neo-config.json | jq '.apiKeys'
```

#### 3. Disk Space Issues
```bash
# Clean up old files
node scripts/cleanup.js

# Check backup retention
node scripts/backup.js --dry-run
```

#### 4. Process Crashes
```bash
# Check PM2/systemd status
pm2 status
# or
sudo systemctl status iseeiape-automation.service

# View error logs
pm2 logs iseeiape-automation --err
# or
sudo journalctl -u iseeiape-automation.service -n 100
```

### Debug Mode
```bash
# Run with debug logging
DEBUG=* node scripts/cron-manager.js start

# Test specific component
DEBUG=neo-crypto node scripts/enhanced-api.js
```

## Security

### File Permissions
```bash
# Set correct permissions
chmod 750 scripts/*.js
chmod 640 neo-crypto/config/*.json
chmod 750 neo-crypto/scripts/*.js

# Protect sensitive files
chmod 600 .env
```

### Network Security
- Run behind firewall
- Use HTTPS for web interface
- Restrict API access with API keys
- Regular security updates

### Backup Security
- Encrypt sensitive backup data
- Store backups in secure location
- Regular backup testing

## Updates and Maintenance

### Regular Maintenance Tasks
1. **Daily**: Check logs for errors
2. **Weekly**: Review backup integrity
3. **Monthly**: Update dependencies
4. **Quarterly**: Security audit

### Updating the System
```bash
# Pull latest code
git pull origin main

# Update dependencies
npm install

# Restart services
pm2 restart all
# or
sudo systemctl restart iseeiape-automation.service
```

### Version Compatibility
- Node.js: 18.x - 20.x
- npm: 8.x - 10.x
- Python: 3.8 - 3.11

## Support

### Getting Help
1. Check logs: `neo-crypto/logs/`
2. Review documentation: `deployment/DEPLOYMENT.md`
3. Check GitHub issues: [iseeiape/iseeiape-website](https://github.com/iseeiape/iseeiape-website)

### Emergency Procedures
1. **System crash**: Restart with `pm2 restart all` or `sudo systemctl restart iseeiape-automation`
2. **Data corruption**: Restore from latest backup
3. **Security breach**: Stop services, investigate logs, rotate API keys

---

**Last Updated:** 2026-03-17  
**Version:** 1.0.0  
**Maintainer:** Neo (Machine 2 - Matrix Army)