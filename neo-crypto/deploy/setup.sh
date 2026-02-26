#!/bin/bash

# 🦎 NEO CRYPTO DEPLOYMENT SCRIPT
# One-command setup for the Neo Crypto content generation system

set -e  # Exit on error

echo "🦎 NEO CRYPTO DEPLOYMENT"
echo "=".repeat(50)

# Configuration
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_DIR="$ROOT_DIR/deploy"
SCRIPTS_DIR="$ROOT_DIR/scripts"
CRON_DIR="$ROOT_DIR/cron"
LOG_DIR="$ROOT_DIR/logs"
DATA_DIR="$ROOT_DIR/data"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Checking dependencies..."
    
    local missing_deps=()
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        missing_deps+=("Node.js")
    else
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        log_info "Node.js $NODE_VERSION detected"
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    else
        NPM_VERSION=$(npm --version)
        log_info "npm $NPM_VERSION detected"
    fi
    
    # Check Python 3 (for whale tracker)
    if ! command -v python3 &> /dev/null; then
        missing_deps+=("Python 3")
    else
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        log_info "Python $PYTHON_VERSION detected"
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        log_error "Missing dependencies: ${missing_deps[*]}"
        log_error "Please install them before continuing."
        exit 1
    fi
    
    log_info "All dependencies satisfied ✓"
}

install_node_dependencies() {
    log_info "Installing Node.js dependencies..."
    
    cd "$ROOT_DIR"
    
    if [ -f "package.json" ]; then
        npm install
        if [ $? -eq 0 ]; then
            log_info "Node.js dependencies installed ✓"
        else
            log_error "Failed to install Node.js dependencies"
            exit 1
        fi
    else
        log_warn "No package.json found, skipping npm install"
    fi
}

setup_directories() {
    log_info "Setting up directories..."
    
    local dirs=("$CRON_DIR" "$LOG_DIR" "$DATA_DIR" "$ROOT_DIR/outputs")
    
    for dir in "${dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            log_info "Created directory: $dir"
        else
            log_info "Directory exists: $dir"
        fi
    done
    
    # Set permissions
    chmod 755 "$SCRIPTS_DIR"/*.js 2>/dev/null || true
}

setup_configuration() {
    log_info "Setting up configuration..."
    
    local config_example="$ROOT_DIR/config/neo-config.example.json"
    local config_file="$ROOT_DIR/config/neo-config.json"
    
    if [ ! -f "$config_file" ] && [ -f "$config_example" ]; then
        cp "$config_example" "$config_file"
        log_info "Created configuration file: $config_file"
        log_warn "Please edit $config_file with your API keys"
    elif [ -f "$config_file" ]; then
        log_info "Configuration file exists: $config_file"
    else
        log_warn "No configuration template found"
    fi
    
    # Create environment file template
    local env_file="$ROOT_DIR/.env.example"
    if [ ! -f "$env_file" ]; then
        cat > "$env_file" << EOF
# Neo Crypto Environment Variables
# Copy to .env and fill in your keys

# Cielo Finance API (wallet tracking)
CIELO_API_KEY=your_cielo_api_key_here

# Birdeye API (token analytics)
BIRDEYE_API_KEY=your_birdeye_api_key_here

# X/Twitter API (posting)
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_SECRET=your_twitter_access_secret_here

# Telegram (alerts)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
EOF
        log_info "Created environment template: $env_file"
    fi
}

setup_cron_jobs() {
    log_info "Setting up cron jobs..."
    
    if [ ! -f "$SCRIPTS_DIR/cron-scheduler.js" ]; then
        log_warn "Cron scheduler not found, skipping cron setup"
        return
    fi
    
    # Generate cron jobs
    cd "$ROOT_DIR"
    node "$SCRIPTS_DIR/cron-scheduler.js"
    
    local install_script="$CRON_DIR/install-cron.sh"
    if [ -f "$install_script" ]; then
        log_info "Cron installation script generated: $install_script"
        log_warn "Review the cron jobs before installing:"
        echo ""
        cat "$CRON_DIR/job-definitions.json" | python3 -m json.tool | head -20
        echo ""
        
        read -p "Install cron jobs? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            bash "$install_script"
            log_info "Cron jobs installed ✓"
        else
            log_info "Skipping cron installation"
            log_info "You can install later with: bash $install_script"
        fi
    else
        log_error "Failed to generate cron installation script"
    fi
}

run_tests() {
    log_info "Running tests..."
    
    cd "$ROOT_DIR"
    
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        npm test
        if [ $? -eq 0 ]; then
            log_info "All tests passed ✓"
        else
            log_warn "Some tests failed, but continuing with setup"
        fi
    else
        log_warn "No test script found in package.json"
    fi
}

generate_sample_content() {
    log_info "Generating sample content..."
    
    cd "$ROOT_DIR"
    
    if [ -f "$SCRIPTS_DIR/alpha-generator.js" ]; then
        node "$SCRIPTS_DIR/alpha-generator.js" --type whale_alert --count 1 --dry-run
        log_info "Sample content generated (dry run) ✓"
        
        # Show what would be generated
        log_info "To generate real content:"
        log_info "  node scripts/alpha-generator.js --type whale_alert --count 3"
        log_info "  node scripts/alpha-generator.js --type daily_alpha"
    else
        log_error "Alpha generator not found"
    fi
}

show_next_steps() {
    echo ""
    echo "=".repeat(50)
    echo "🎯 DEPLOYMENT COMPLETE - NEXT STEPS"
    echo "=".repeat(50)
    echo ""
    echo "1. Configure API keys:"
    echo "   • Edit: $ROOT_DIR/config/neo-config.json"
    echo "   • Or create: $ROOT_DIR/.env"
    echo ""
    echo "2. Add whale wallets to track:"
    echo "   • Edit: $ROOT_DIR/data/tracked-wallets.json"
    echo "   • Or use the whale finder script"
    echo ""
    echo "3. Test the system:"
    echo "   • Generate content: npm run generate"
    echo "   • Test APIs: npm run test:api"
    echo "   • Run all tests: npm test"
    echo ""
    echo "4. Schedule automatic posting:"
    echo "   • Install cron jobs: npm run cron:setup"
    echo "   • Or run manually at optimal times"
    echo ""
    echo "5. Monitor and optimize:"
    echo "   • Check logs: $LOG_DIR/"
    echo "   • Review generated content: $ROOT_DIR/outputs/"
    echo "   • Update templates as needed"
    echo ""
    echo "Quick commands:"
    echo "  cd $ROOT_DIR"
    echo "  npm run generate          # Generate content"
    echo "  npm run api:update        # Update live data"
    echo "  npm run cron:setup        # Setup cron jobs"
    echo ""
    echo "Need help? Check SKILL.md for documentation"
    echo ""
    echo "🦎 Happy alpha hunting!"
}

# Main deployment process
main() {
    echo "Starting Neo Crypto deployment..."
    echo "Root directory: $ROOT_DIR"
    echo ""
    
    check_dependencies
    echo ""
    
    setup_directories
    echo ""
    
    install_node_dependencies
    echo ""
    
    setup_configuration
    echo ""
    
    run_tests
    echo ""
    
    setup_cron_jobs
    echo ""
    
    generate_sample_content
    echo ""
    
    show_next_steps
}

# Run main function
main "$@"