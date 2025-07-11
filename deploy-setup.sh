#!/bin/bash

# Vape Cave Deployment Setup Script
echo "🚀 Setting up Vape Cave for deployment..."

# Build the application
echo "📦 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Files generated:"
    echo "   - Frontend: dist/public/"
    echo "   - Backend: dist/index.js"
    echo ""
    echo "🌐 Ready for deployment to:"
    echo "   - Netlify: Use netlify.toml configuration"
    echo "   - Vercel: Use vercel.json configuration"
    echo "   - Railway: Use railway.json configuration"
    echo "   - Render: Use render.yaml configuration"
    echo ""
    echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Test the build locally
echo "🧪 Testing production build..."
echo "Starting server on port 5000..."
echo "Visit: http://localhost:5000"
node dist/index.js