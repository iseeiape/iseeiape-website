#!/bin/bash
# Wolf Pack Cron Jobs Monitor

LOGS_DIR="/home/matrix/.openclaw/workspace/iseeiape-website/logs"
SCRIPTS_DIR="/home/matrix/.openclaw/workspace/iseeiape-website/scripts"

echo "🐺 Wolf Pack Cron Jobs Monitor"
echo "================================"
echo ""

# Check if jobs are running
echo "📋 Checking cron jobs..."
crontab -l | grep -A1 "WOLF-PACK-AUTO"

echo ""
echo "📊 Log Files:"
echo "------------"

for job in wolf-pack-daily-content wolf-pack-performance-update website-health-check backup-performance-db; do
  log_file="${LOGS_DIR}/${job}.log"
  error_file="${LOGS_DIR}/${job}.error.log"
  
  if [ -f "$log_file" ]; then
    size=$(stat -c%s "$log_file")
    lines=$(wc -l < "$log_file")
    last_run=$(tail -1 "$log_file" 2>/dev/null | cut -c1-50)
    
    echo "• ${job}:"
    echo "  Size: ${size} bytes, Lines: ${lines}"
    echo "  Last: ${last_run}"
    
    if [ -f "$error_file" ] && [ $(stat -c%s "$error_file") -gt 0 ]; then
      errors=$(wc -l < "$error_file")
      echo "  ⚠️  Errors: ${errors} (check ${error_file})"
    else
      echo "  ✅ No errors"
    fi
  else
    echo "• ${job}: No log file yet"
  fi
  echo ""
done

# Show recent logs
echo "🔄 Recent Activity:"
echo "------------------"
tail -20 "${LOGS_DIR}/wolf-pack-performance-update.log" 2>/dev/null || echo "No performance updates yet"

echo ""
echo "💡 Commands:"
echo "  • View all logs: ls -la ${LOGS_DIR}/"
echo "  • Follow daily content: tail -f ${LOGS_DIR}/wolf-pack-daily-content.log"
echo "  • Check errors: grep -i error ${LOGS_DIR}/*.error.log"
echo "  • Run manually: cd /home/matrix/.openclaw/workspace/iseeiape-website && node scripts/content-automation.js"
