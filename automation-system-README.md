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
