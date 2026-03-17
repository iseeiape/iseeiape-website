# 🦎 NEO CRYPTO - QUICK START GUIDE

Get your crypto content generation system running in 5 minutes.

## 🚀 One-Command Setup

```bash
# Make the setup script executable
chmod +x deploy/setup.sh

# Run the setup
./deploy/setup.sh
```

The setup script will:
1. Check dependencies (Node.js, npm, Python)
2. Install required packages
3. Create necessary directories
4. Set up configuration files
5. Run tests
6. Generate sample content
7. Show next steps

## 📋 Manual Setup

### 1. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Make scripts executable
chmod +x scripts/*.js
```

### 2. Configure API Keys
```bash
# Copy the example config
cp config/neo-config.example.json config/neo-config.json

# Edit with your API keys
nano config/neo-config.json
```

Or use environment variables:
```bash
# Create .env file
cp .env.example .env
# Edit .env with your keys
```

### 3. Generate Your First Content
```bash
# Generate a whale alert
node scripts/alpha-generator.js --type whale_alert

# Generate daily market update
node scripts/alpha-generator.js --type daily_alpha

# Generate all content types
node scripts/alpha-generator.js --type all
```

### 4. Schedule Automatic Posting
```bash
# Generate cron jobs
node scripts/cron-scheduler.js

# Install cron jobs (review first!)
bash cron/install-cron.sh
```

## 🎯 What Gets Installed

### Core Scripts
- `alpha-generator.js` - Content generation engine
- `cron-scheduler.js` - Automatic scheduling
- `api-integration.js` - Real API integration
- `test-suite.js` - Comprehensive testing

### Directory Structure
```
neo-crypto/
├── scripts/           # Core scripts
├── templates/         # Content templates
├── config/           # Configuration
├── data/             # Data storage
├── outputs/          # Generated content
├── logs/             # System logs
├── cron/             # Cron job files
├── test/             # Test suite
└── deploy/           # Deployment scripts
```

### Scheduled Content (Optimal Times)
- **8:30 AM UTC** - Daily market update
- **12:00 PM UTC** - Whale alert
- **2:30 PM UTC** - Trend alert
- **8:00 PM UTC** - Educational thread
- **10:00 PM UTC** - Late whale alert

## 🔧 Configuration Options

### API Keys Needed
1. **Cielo Finance** - Wallet tracking (optional)
2. **Birdeye** - Token analytics (optional)
3. **X/Twitter** - Auto-posting (future)
4. **Telegram** - Alerts (future)

### Content Types
- `whale_alert` - Large wallet movements
- `trend_alert` - Emerging narratives
- `daily_alpha` - Market snapshot
- `thread` - Educational content
- `all` - Generate one of each

## 🧪 Testing

```bash
# Run all tests
npm test

# Quick test
npm run test:quick

# Test API connectivity
npm run test:api

# Test content generation (dry run)
node scripts/alpha-generator.js --dry-run
```

## 📈 Monitoring

### Log Files
- Check `logs/` directory for output
- Cron jobs log to `logs/neo_crypto_*.log`
- Errors go to `logs/neo_crypto_*.error.log`

### Generated Content
- Content saved to `outputs/scheduled-posts/`
- Metadata in `outputs/scheduled-posts/metadata_*.json`
- History in `data/content-history.json`

## 🚨 Troubleshooting

### Common Issues

**"Command not found"**
```bash
# Make scripts executable
chmod +x scripts/*.js
```

**"Module not found"**
```bash
# Install dependencies
npm install
```

**"API key not configured"**
```bash
# Set up configuration
cp config/neo-config.example.json config/neo-config.json
# Edit with your keys
```

**Cron jobs not running**
```bash
# Check cron service
systemctl status cron

# Check your crontab
crontab -l

# Reinstall cron jobs
bash cron/install-cron.sh
```

### Getting Help
1. Check `SKILL.md` for detailed documentation
2. Review test results in `outputs/test-results/`
3. Check logs in `logs/` directory
4. Run `npm test` to identify issues

## 🎉 Next Steps After Setup

1. **Add real whale wallets** to `data/tracked-wallets.json`
2. **Configure API keys** for live data
3. **Customize templates** in `templates/` directory
4. **Schedule posting** with cron jobs
5. **Monitor engagement** and optimize content

## 📞 Support

- **Documentation**: `SKILL.md`
- **Test suite**: `npm test`
- **Deployment**: `./deploy/setup.sh`
- **Quick test**: `npm run test:quick`

---

**🦎 Happy alpha hunting!**  
*The crypto markets never sleep, and now neither does your content engine.*