# 🔧 Fix Netlify Environment Variables

## The Issue
Your website is live but the products page shows "Error loading products" because Netlify needs the Supabase environment variables to connect to your database.

## Quick Fix (2 minutes):

### Step 1: Add Environment Variables in Netlify
1. Go to your Netlify dashboard: [app.netlify.com](https://app.netlify.com)
2. Click on your "vape-cave-website" site
3. Go to **Site settings** → **Environment variables**
4. Click **"Add a variable"** and add these 3:

**Variable 1:**
- Key: `SUPABASE_URL`
- Value: `https://dwrpznnbcqrmgoqdnqpo.supabase.co`

**Variable 2:**
- Key: `SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cnB6bm5iY3FybWdvcWRucXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTEyNTksImV4cCI6MjA2Nzc2NzI1OX0.epxb1h8fNOaP7JVDvtlm3jjsSqHnk3piU33Gn7AUZqM`

**Variable 3:**
- Key: `SUPABASE_DB_PASSWORD`
- Value: `VapeCave2024!`

### Step 2: Redeploy
1. After adding variables, click **"Deploys"** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait 2-3 minutes for build to complete

### Step 3: Test
Visit: `https://vape-cave-website.netlify.app/products`
You should now see all 8 products with their images!

## What This Fixes:
- ✅ Products page will load all 8 products
- ✅ Product images will display correctly
- ✅ Product filtering will work
- ✅ Contact forms will function
- ✅ Admin panel will connect to database

## Expected Products:
1. SMOK Novo Pro - $39.99
2. Vaporesso XROS Pro - $29.99  
3. Uwell Caliburn G3 Pro - $44.99
4. Geek Vape Aegis Legend 3 - $79.99
5. Naked 100 Lava Flow - $24.99
6. Pachamama Mint Leaf - $22.99
7. Coastal Clouds Apple Peach Strawberry - $21.99
8. 18650 Battery Charger - $29.99

All with working external images from manufacturer websites.