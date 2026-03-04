#!/bin/bash

# deploy-dashboard.sh - Deploy the new market dashboard
echo "🚀 Deploying Market Dashboard..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in iseeiape-website directory"
    exit 1
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "Dependencies already installed"
fi

# Test the dashboard components
echo "🧪 Testing dashboard components..."
node scripts/test-dashboard.js

# Check if Next.js is installed
echo "🔧 Checking Next.js setup..."
if ! command -v next &> /dev/null; then
    echo "Next.js not found globally, using npx..."
    NEXT_CMD="npx next"
else
    NEXT_CMD="next"
fi

# Build the project
echo "🏗️ Building project..."
$NEXT_CMD build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Create a deployment summary
    echo "📋 DEPLOYMENT SUMMARY"
    echo "===================="
    echo "🆕 New Features:"
    echo "   • Real-time Market Dashboard (/dashboard)"
    echo "   • API endpoint (/api/market-data)"
    echo "   • Automated data updates every 5 minutes"
    echo "   • Whale activity tracking"
    echo "   • Narrative scoring display"
    echo ""
    echo "📁 Files Created:"
    echo "   • components/MarketDashboard.js"
    echo "   • pages/dashboard.js"
    echo "   • pages/api/market-data.js"
    echo "   • scripts/test-dashboard.js"
    echo "   • scripts/deploy-dashboard.sh"
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Start dev server: npm run dev"
    echo "2. Visit: http://localhost:3000/dashboard"
    echo "3. Test API: http://localhost:3000/api/market-data"
    echo "4. Deploy to production"
    echo ""
    echo "🦎 Matrix Army Dashboard - Ready for launch!"
else
    echo "❌ Build failed. Check for errors above."
    exit 1
fi