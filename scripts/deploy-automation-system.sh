#!/bin/bash

# Deployment script for iseeiape Content Automation System
# Run this script to set up the enhanced automation system

set -e

echo "🚀 Deploying iseeiape Content Automation System"
echo "================================================"

# Check Node.js version
echo "📦 Checking Node.js version..."
node --version
npm --version

# Install dependencies
echo "📦 Installing dependencies..."
cd /home/matrix/.openclaw/workspace/iseeiape-website/neo-crypto
npm install axios

echo "✅ Dependencies installed"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p /home/matrix/.openclaw/workspace/iseeiape-website/content/automation/output
mkdir -p /home/matrix/.openclaw/workspace/iseeiape-website/content/automation/archive
mkdir -p /home/matrix/.openclaw/workspace/iseeiape-website/content/automation/logs
mkdir -p /home/matrix/.openclaw/workspace/iseeiape-website/content/automation/test-output
mkdir -p /home/matrix/.openclaw/workspace/iseeiape-website/neo-crypto/data/backups
mkdir -p /home/matrix/.openclaw/workspace/iseeiape-website/content/generated-articles

echo "✅ Directories created"

# Test the system
echo "🧪 Running integration tests..."
cd /home/matrix/.openclaw/workspace/iseeiape-website
node content/automation/test-enhanced-system.js

if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Tests failed. Please check the errors above."
    exit 1
fi

# Create cron jobs
echo "⏰ Setting up cron jobs..."
CRON_FILE="/tmp/iseeiape-cron"

cat > $CRON_FILE << 'EOF'
# iseeiape Content Automation System
# Updated: $(date)

# Real-time data updates (every 5 minutes)
*/5 * * * * cd /home/matrix/.openclaw/workspace/iseeiape-website && node neo-crypto/scripts/real-time-data-fetcher.js once >> /home/matrix/.openclaw/workspace/iseeiape-website/content/automation/logs/data-fetcher.log 2>&1

# Content generation (every hour)
0 * * * * cd /home/matrix/.openclaw/workspace/iseeiape-website && node content/automation/enhanced-content-scheduler.js >> /home/matrix/.openclaw/workspace/iseeiape-website/content/automation/logs/content-scheduler.log 2>&1

# Article generation (daily at 2 AM)
0 2 * * * cd /home/matrix/.openclaw/workspace/iseeiape-website && node content/automation/article-generator.js >> /home/matrix/.openclaw/workspace/iseeiape-website/content/automation/logs/article-generator.log 2>&1

# Cleanup old backups (daily at 3 AM)
0 3 * * * find /home/matrix/.openclaw/workspace/iseeiape-website/neo-crypto/data/backups -name "*.json" -mtime +7 -delete
0 3 * * * find /home/matrix/.openclaw/workspace/iseeiape-website/content/automation/archive -name "*.json" -mtime +30 -delete
0 3 * * * find /home/matrix/.openclaw/workspace/iseeiape-website/content/automation/logs -name "*.log" -mtime +30 -delete

# System health check (every 6 hours)
0 */6 * * * cd /home/matrix/.openclaw/workspace/iseeiape-website && node content/automation/test-enhanced-system.js >> /home/matrix/.openclaw/workspace/iseeiape-website/content/automation/logs/health-check.log 2>&1
EOF

echo "📋 Cron jobs configuration:"
echo "=========================="
cat $CRON_FILE
echo "=========================="

echo ""
echo "📝 To install these cron jobs, run:"
echo "crontab $CRON_FILE"
echo ""
echo "📝 To view current cron jobs:"
echo "crontab -l"
echo ""
echo "📝 To edit cron jobs manually:"
echo "crontab -e"

# Create monitoring script
echo "📊 Creating monitoring script..."
MONITOR_SCRIPT="/home/matrix/.openclaw/workspace/iseeiape-website/scripts/monitor-automation.sh"

cat > $MONITOR_SCRIPT << 'EOF'
#!/bin/bash

# Monitoring script for iseeiape Content Automation System

echo "📊 iseeiape Automation System Monitor"
echo "====================================="
echo "Last updated: $(date)"
echo ""

# Check if processes are running
echo "🔍 Process Status:"
echo "-----------------"

# Check data fetcher logs
DATA_LOG="/home/matrix/.openclaw/workspace/iseeiape-website/content/automation/logs/data-fetcher.log"
if [ -f "$DATA_LOG" ]; then
    DATA_LAST=$(tail -1 "$DATA_LOG" 2>/dev/null | grep -o "Last updated:.*" || echo "No recent updates")
    echo "📡 Data Fetcher: $DATA_LAST"
else
    echo "📡 Data Fetcher: No log file found"
fi

# Check content scheduler logs
CONTENT_LOG="/home/matrix/.openclaw/workspace/iseeiape-website/content/automation/logs/content-scheduler.log"
if [ -f "$CONTENT_LOG" ]; then
    CONTENT_LAST=$(tail -5 "$CONTENT_LOG" 2>/dev/null | grep -E "generated|scheduled|completed" | tail -1 || echo "No recent activity")
    echo "📝 Content Scheduler: $CONTENT_LAST"
else
    echo "📝 Content Scheduler: No log file found"
fi

# Check data file
DATA_FILE="/home/matrix/.openclaw/workspace/iseeiape-website/neo-crypto/data/enhanced-live-data.json"
if [ -f "$DATA_FILE" ]; then
    DATA_AGE=$(stat -c %Y "$DATA_FILE" 2>/dev/null || stat -f %m "$DATA_FILE")
    NOW=$(date +%s)
    AGE_MINUTES=$(( (NOW - DATA_AGE) / 60 ))
    
    if [ $AGE_MINUTES -lt 10 ]; then
        echo "✅ Data file: Updated $AGE_MINUTES minutes ago"
        
        # Show data summary
        TOKENS=$(jq '.tokens | length' "$DATA_FILE" 2>/dev/null || echo "0")
        NARRATIVES=$(jq '.narratives | length' "$DATA_FILE" 2>/dev/null || echo "0")
        SENTIMENT=$(jq -r '.market.sentiment' "$DATA_FILE" 2>/dev/null || echo "unknown")
        
        echo "   📊 Stats: $TOKENS tokens, $NARRATIVES narratives, sentiment: $SENTIMENT"
    else
        echo "⚠️ Data file: Last updated $AGE_MINUTES minutes ago (may be stale)"
    fi
else
    echo "❌ Data file: Not found"
fi

# Check scheduled content
SCHEDULE_DIR="/home/matrix/.openclaw/workspace/iseeiape-website/content/automation/output"
if [ -d "$SCHEDULE_DIR" ]; then
    SCHEDULE_COUNT=$(find "$SCHEDULE_DIR" -name "*.json" -type f | wc -l)
    LATEST_SCHEDULE=$(find "$SCHEDULE_DIR" -name "*.json" -type f -exec stat -c %Y {} \; | sort -rn | head -1)
    
    if [ "$LATEST_SCHEDULE" ]; then
        NOW=$(date +%s)
        AGE_HOURS=$(( (NOW - LATEST_SCHEDULE) / 3600 ))
        
        if [ $AGE_HOURS -lt 24 ]; then
            echo "✅ Scheduled content: $SCHEDULE_COUNT files, latest $AGE_HOURS hours ago"
        else
            echo "⚠️ Scheduled content: $SCHEDULE_COUNT files, latest $AGE_HOURS hours ago (may be stale)"
        fi
    else
        echo "⚠️ Scheduled content: No schedule files found"
    fi
else
    echo "❌ Schedule directory: Not found"
fi

# Check generated articles
ARTICLES_DIR="/home/matrix/.openclaw/workspace/iseeiape-website/content/generated-articles"
if [ -d "$ARTICLES_DIR" ]; then
    ARTICLE_COUNT=$(find "$ARTICLES_DIR" -name "*.md" -type f | wc -l)
    echo "📚 Generated articles: $ARTICLE_COUNT files"
    
    if [ $ARTICLE_COUNT -gt 0 ]; then
        LATEST_ARTICLE=$(find "$ARTICLES_DIR" -name "*.md" -type f -exec stat -c %Y {} \; | sort -rn | head -1)
        NOW=$(date +%s)
        AGE_DAYS=$(( (NOW - LATEST_ARTICLE) / 86400 ))
        echo "   📅 Latest article: $AGE_DAYS days ago"
    fi
else
    echo "❌ Articles directory: Not found"
fi

echo ""
echo "🔧 System Health:"
echo "----------------"

# Check disk space
DISK_USAGE=$(df -h /home/matrix/.openclaw/workspace | tail -1 | awk '{print $5}')
echo "💾 Disk usage: $DISK_USAGE"

# Check memory
MEM_USAGE=$(free -m | awk 'NR==2{printf "%.1f%%", $3*100/$2}')
echo "🧠 Memory usage: $MEM_USAGE"

# Check Node.js
NODE_VERSION=$(node --version 2>/dev/null || echo "Not found")
echo "🟢 Node.js: $NODE_VERSION"

echo ""
echo "📈 Quick Actions:"
echo "----------------"
echo "1. View data: cat $DATA_FILE | jq ."
echo "2. View logs: tail -f $CONTENT_LOG"
echo "3. Run test: node content/automation/test-enhanced-system.js"
echo "4. Force update: node neo-crypto/scripts/real-time-data-fetcher.js once"
echo "5. Generate content: node content/automation/enhanced-content-scheduler.js"

echo ""
echo "====================================="
echo "🦎 Matrix Army Automation System - Operational"
EOF

chmod +x $MONITOR_SCRIPT
echo "✅ Monitoring script created: $MONITOR_SCRIPT"

# Create README
echo "📖 Creating documentation..."
README_FILE="/home/matrix/.openclaw/workspace/iseeiape-website/automation-system-README.md"

cat > $README_FILE << 'EOF'
# iseeiape Content Automation System v2.0

Enhanced content automation system for iseeiape website with real-time data integration.

## 🚀 Features

### Real-Time Data Fetcher
- Fetches live market data from DexScreener API
- Integrates CoinGecko data
- Calculates narrative scores based on market performance
- Updates data every 5 minutes
- Backup system for data preservation

### Enhanced Content Scheduler
- Generates 6 content types:
  1. Whale Alerts (immediate posting)
  2. Trend Alerts (scheduled)
  3. Market Updates (scheduled)
  4. Educational content
  5. Technical Analysis
  6. Sentiment Reports
- Advanced quality scoring (0-100)
- Archive system for all generated content
- Schedule management

### Article Generator
- Creates SEO-optimized articles
- Multiple article types: case studies, guides, insights
- Automatic file organization
- Word count tracking

## 📁 Directory Structure

```
iseeiape-website/
├── neo-crypto/
│   ├── scripts/
│   │   └── real-time-data-fetcher.js    # Real-time data fetching
│   └── data/
│       ├── enhanced-live-data.json      # Current market data
│       └── backups/                     # Data backups
├── content/
│   └── automation/
│       ├── enhanced-content-scheduler.js # Main scheduler
│       ├── article-generator.js         # Article generation
│       ├── test-enhanced-system.js      # Integration tests
│       ├── output/                      # Scheduled content
│       ├── archive/                     # Content archives
│       └── logs/                        # System logs
└── scripts/
    ├── deploy-automation-system.sh      # Deployment script
    └── monitor-automation.sh            # Monitoring script
```

## ⚙️ Installation

1. **Install dependencies:**
   ```bash
   cd neo-crypto
   npm install axios
   ```

2. **Run tests:**
   ```bash
   node content/automation/test-enhanced-system.js
   ```

3. **Set up cron jobs:**
   ```bash
   bash scripts/deploy-automation-system.sh
   ```

## 🕐 Cron Job Schedule

- **Data updates:** Every 5 minutes
- **Content generation:** Every hour
- **Article generation:** Daily at 2 AM
- **Cleanup:** Daily at 3 AM
- **Health checks:** Every 6 hours

## 📊 Monitoring

Run the monitoring script to check system status:
```bash
bash scripts/monitor-automation.sh
```

## 🔧 Troubleshooting

### Common Issues:

1. **API rate limits:** The system includes rate limiting. If you hit limits, increase the delay in `real-time-data-fetcher.js`.

2. **Data not updating:** Check logs in `content/automation/logs/data-fetcher.log`

3. **Content not generating:** Check `content/automation/logs/content-scheduler.log`

4. **Low quality scores:** Adjust the scoring thresholds in `enhanced-content-scheduler.js`

### Log Files:
- `data-fetcher.log` - Real-time data updates
- `content-scheduler.log` - Content generation
- `article-generator.log` - Article creation
- `health-check.log` - System health checks

## 🎯 Next Steps

1. **Integrate with X/Twitter API** for automatic posting
2. **Add Telegram/Discord integration** for multi-platform posting
3. **Implement A/B testing** for content optimization
4. **Add performance tracking** to measure engagement
5. **Create dashboard** for system monitoring

## 📞 Support

For issues or questions:
1. Check the logs in `content/automation/logs/`
2. Run the test suite: `node content/automation/test-enhanced-system.js`
3. Check system status: `bash scripts/monitor-automation.sh`

---

**🦎 Matrix Army Content Machine - Ready for deployment!**

*Last updated: $(date)*
EOF

echo "✅ Documentation created: $README_FILE"

echo ""
echo "================================================"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "================================================"
echo ""
echo "✅ System components:"
echo "   - Real-time data fetcher"
echo "   - Enhanced content scheduler"
echo "   - Article generator"
echo "   - Test suite"
echo "   - Monitoring script"
echo "   - Documentation"
echo ""
echo "🚀 Next steps:"
echo "   1. Review cron job configuration"
echo "   2. Install cron jobs: crontab /tmp/iseeiape-cron"
echo "   3. Run monitoring: bash scripts/monitor-automation.sh"
echo "   4. Check system status regularly"
echo ""
echo "🦎 Matrix Army Automation System - Ready for action!"