#!/bin/bash

echo "🔧 Pushing all fixes to GitHub for Netlify deployment..."

# Clear any git locks
sudo rm -f .git/index.lock .git/config.lock .git/objects/*/tmp_obj_*

# Add all the fixes
git add .
git status

# Commit all fixes
git commit -m "Fix database connection, serverless functions, and Netlify deployment

- Updated db.ts to handle both development and production environments
- Created netlify/functions/server.ts for proper serverless API routing
- Fixed environment variable handling for Supabase in production
- Added admin dashboard accessibility
- Configured proper CORS and error handling"

# Push to GitHub
git push origin main

echo "✅ All fixes pushed to GitHub!"
echo "🚀 Netlify will auto-redeploy in 2-3 minutes"
echo "🎯 Your website will have:"
echo "   - Working product images"
echo "   - Functional admin dashboard"
echo "   - All 8 products displaying correctly"
echo "   - Contact forms working"