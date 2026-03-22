#!/bin/bash

# Install Automation Cron Jobs for iseeiape Website
# This script installs the missing cron jobs for the automation system

echo "🦎 Installing Automation Cron Jobs for iseeiape Website"
echo "======================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from iseeiape-website directory"
    exit 1
fi

# Backup current crontab
BACKUP_FILE="/tmp/crontab-backup-$(date +%Y%m%d-%H%M%S)"
echo "📋 Backing up current crontab to $BACKUP_FILE"
crontab -l > "$BACKUP_FILE" 2>/dev/null || echo "No existing crontab"

# Check if automation cron jobs are already installed
if crontab -l 2>/dev/null | grep -q "iseeiape-website"; then
    echo "⚠️  Some iseeiape cron jobs already installed"
    echo "   Will add missing jobs only"
fi

# Create temporary crontab file
TEMP_CRON="/tmp/iseeiape-cron-$(date +%s)"

# Start with existing crontab (if any)
crontab -l 2>/dev/null > "$TEMP_CRON" || echo "# iseeiape Automation Cron Jobs" > "$TEMP_CRON"

# Add separator
echo "" >> "$TEMP_CRON"
echo "# ===========================================" >> "$TEMP_CRON"
echo "# iseeiape Website Automation System" >> "$TEMP_CRON"
echo "# Installed: $(date)" >> "$TEMP_CRON"
echo "# ===========================================" >> "$TEMP_CRON"
echo "" >> "$TEMP_CRON"

# Add automation cron jobs from automation-cron.conf
echo "# Market Data Refresh - Run every hour" >> "$TEMP_CRON"
echo "# Updates market data for accurate content" >> "$TEMP_CRON"
echo "30 * * * * cd /home/matrix/.openclaw/workspace/iseeiape-website && node content/automation/cron-scheduler-v2.js --step data >> /tmp/iseeiape-data.log 2>&1" >> "$TEMP_CRON"
echo "" >> "$TEMP_CRON"

echo "# Content Generation - Run every 4 hours" >> "$TEMP_CRON"
echo "# Generates fresh content based on latest market data" >> "$TEMP_CRON"
echo "0 */4 * * * cd /home/matrix/.openclaw/workspace/iseeiape-website && node content/automation/cron-scheduler-v2.js --step content >> /tmp/iseeiape-content.log 2>&1" >> "$TEMP_CRON"
echo "" >> "$TEMP_CRON"

echo "# Twitter Posting - Run every 30 minutes" >> "$TEMP_CRON"
echo "# Checks for scheduled posts and posts them" >> "$TEMP_CRON"
echo "*/30 * * * * cd /home/matrix/.openclaw/workspace/iseeiape-website && node content/automation/cron-scheduler-v2.js --step twitter >> /tmp/iseeiape-twitter.log 2>&1" >> "$TEMP_CRON"
echo "" >> "$TEMP_CRON"

echo "# Article Generation - Run once per day at 3 AM UTC" >> "$TEMP_CRON"
echo "# Generates long-form articles for the website" >> "$TEMP_CRON"
echo "0 3 * * * cd /home/matrix/.openclaw/workspace/iseeiape-website && node content/automation/cron-scheduler-v2.js --step articles >> /tmp/iseeiape-articles.log 2>&1" >> "$TEMP_CRON"
echo "" >> "$TEMP_CRON"

echo "# System Health Check - Run daily at 2 AM UTC and every 6 hours" >> "$TEMP_CRON"
echo "# Checks system status and sends notifications if needed" >> "$TEMP_CRON"
echo "0 2 * * * cd /home/matrix/.openclaw/workspace/iseeiape-website && node content/automation/cron-scheduler-v2.js --step health >> /tmp/iseeiape-health.log 2>&1" >> "$TEMP_CRON"
echo "0 */6 * * * cd /home/matrix/.openclaw/workspace/iseeiape-website && node content/automation/cron-scheduler-v2.js --step health >> /tmp/iseeiape-health.log 2>&1" >> "$TEMP_CRON"
echo "" >> "$TEMP_CRON"

echo "# Enhanced Trading Signal Generator - Run every 2 hours" >> "$TEMP_CRON"
echo "# Generates trading signals with real price data" >> "$TEMP_CRON"
echo "0 */2 * * * cd /home/matrix/.openclaw/workspace/iseeiape-website && node neo-crypto/scripts/trading-signal-generator-enhanced.js >> /tmp/iseeiape-signals.log 2>&1" >> "$TEMP_CRON"
echo "" >> "$TEMP_CRON"

echo "# Log Rotation - Run weekly on Sunday at 1 AM UTC" >> "$TEMP_CRON"
echo "# Compresses old logs to save space" >> "$TEMP_CRON"
echo "0 1 * * 0 find /tmp/iseeiape-*.log -mtime +7 -exec gzip {} \; 2>/dev/null || true" >> "$TEMP_CRON"
echo "" >> "$TEMP_CRON"

# Install the new crontab
echo "📋 Installing new crontab..."
crontab "$TEMP_CRON"

# Verify installation
echo "✅ Cron jobs installed successfully!"
echo ""
echo "📊 Installed Jobs Summary:"
echo "--------------------------"
echo "1. Market Data Refresh - Every hour at :30"
echo "2. Content Generation - Every 4 hours"
echo "3. Twitter Posting - Every 30 minutes"
echo "4. Article Generation - Daily at 3 AM UTC"
echo "5. Health Checks - Daily at 2 AM + every 6 hours"
echo "6. Trading Signals - Every 2 hours (enhanced version)"
echo "7. Log Rotation - Weekly on Sunday at 1 AM"
echo ""
echo "📁 Log files will be saved to /tmp/iseeiape-*.log"
echo "🔧 Backup saved to: $BACKUP_FILE"
echo ""
echo "To view installed cron jobs:"
echo "  crontab -l | grep -A2 -B2 iseeiape"
echo ""
echo "To remove these jobs:"
echo "  crontab -e  # Then delete the iseeiape section"
echo ""
echo "🦎 Matrix Army Automation - Ready for action!"