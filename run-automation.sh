#!/bin/bash

# iseeiape Automation System Runner
# This script runs the full automation pipeline
# Can be scheduled via cron or systemd

set -e

# Configuration
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$BASE_DIR/content/automation/logs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_DIR/automation_$TIMESTAMP.log"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log function
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✓${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}✗${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1" | tee -a "$LOG_FILE"
}

# Start execution
log "🦎 Starting iseeiape Automation System"
log "📁 Base directory: $BASE_DIR"
log "📝 Log file: $LOG_FILE"

cd "$BASE_DIR"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    error "Not in iseeiape-website directory. Exiting."
    exit 1
fi

# Run the cron scheduler
log "🚀 Starting automation pipeline..."
node content/automation/cron-scheduler.js 2>&1 | tee -a "$LOG_FILE"

EXIT_CODE=${PIPESTATUS[0]}

if [ $EXIT_CODE -eq 0 ]; then
    success "✅ Automation pipeline completed successfully"
else
    error "❌ Automation pipeline failed with exit code $EXIT_CODE"
fi

log "📊 Pipeline execution complete"
log "📁 Log saved to: $LOG_FILE"

exit $EXIT_CODE