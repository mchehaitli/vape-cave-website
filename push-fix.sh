#!/bin/bash

echo "🔧 Pushing database connection fix to GitHub..."

# Clear any git locks
sudo rm -f .git/index.lock .git/config.lock .git/objects/*/tmp_obj_*

# Add the fix
git add server/storage.ts

# Commit the fix
git commit -m "Fix production database connection for Netlify deployment"

# Push to GitHub
git push origin main

echo "✅ Fix pushed to GitHub!"
echo "🚀 Netlify will automatically redeploy in 2-3 minutes"
echo "🎯 After deployment, your products page will work correctly"