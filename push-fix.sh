#!/bin/bash
echo "🚀 Pushing emergency fixes to restore data..."

# Copy working API function
cp netlify/functions/api-working.ts netlify/functions/api.ts

# Force add and commit changes
git add -f netlify/functions/api.ts netlify/functions/api-working.ts fix-api-deployment.js manual-restore-data.sql

# Commit with timestamp
git commit -m "EMERGENCY: Restore all data - $(date)"

# Push to main branch
git push origin main

echo "✅ Emergency fixes pushed to Netlify"