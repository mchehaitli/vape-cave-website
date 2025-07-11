#!/bin/bash
echo "Attempting to push all fixes to GitHub and trigger Netlify deployment..."

# Add all changed files
git add netlify/functions/api.ts
git add netlify/functions/api-working.ts  
git add fix-api-deployment.js
git add manual-restore-data.sql
git add push-all-fixes.sh

# Try to commit
git commit -m "CRITICAL FIX: Restore all data and fix API relationships - $(date +%Y%m%d_%H%M%S)"

# Push to trigger Netlify deployment
git push origin main

echo "Deployment triggered. Netlify will rebuild in 2-3 minutes."