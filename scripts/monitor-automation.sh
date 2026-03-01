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
