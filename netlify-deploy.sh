#!/bin/bash

# Quick Netlify deployment script for Vape Cave

echo "🚀 Deploying Vape Cave to Netlify..."

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Build the project
echo "📦 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Netlify
    echo "🌐 Deploying to Netlify..."
    netlify deploy --prod --dir=dist/public --open
    
    echo "🎉 Deployment complete!"
    echo "Your website should open in your browser automatically."
    echo "If not, check the URL provided by Netlify CLI."
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi