#!/bin/bash
# Quick deploy script for iseeiape
# Run this on your local machine

echo "🚀 iseeiape Vercel Deploy Script"
echo "================================="
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Go to project
cd ~/iseeiape-website

echo "🔑 Logging in with API token..."
vercel login --token=vck_0XUNuYivaugC6pcSr9gwEJWQu4ggu51K9p6uadumSppnA7i81J4fqnZb

echo ""
echo "🚀 Deploying to production..."
vercel --prod --yes

echo ""
echo "✅ Done! Check your Vercel dashboard for the URL."
