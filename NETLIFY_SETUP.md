# 🚀 Netlify Deployment Instructions

## After Your Code is on GitHub:

### 1. Go to Netlify Dashboard
- Visit [app.netlify.com](https://app.netlify.com)
- Click "Add new site" → "Import an existing project"

### 2. Connect GitHub Repository
- Choose "Deploy with Git"
- Select "GitHub"
- Find and select your `vape-cave-website` repository

### 3. Build Settings
**IMPORTANT:** Use these exact settings:

- **Build command**: `npm run build`
- **Publish directory**: `dist/public`
- **Base directory**: (leave empty)

### 4. Environment Variables
Click "Advanced build settings" → "Add environment variable"

Add these 3 variables:

**Variable 1:**
- Key: `SUPABASE_URL`
- Value: `https://dwrpznnbcqrmgoqdnqpo.supabase.co`

**Variable 2:**
- Key: `SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cnB6bm5iY3FybWdvcWRucXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTEyNTksImV4cCI6MjA2Nzc2NzI1OX0.epxb1h8fNOaP7JVDvtlm3jjsSqHnk3piU33Gn7AUZqM`

**Variable 3:**
- Key: `SUPABASE_DB_PASSWORD`
- Value: `VapeCave2024!`

### 5. Deploy
- Click "Deploy site"
- Wait 2-3 minutes for build to complete
- Your site will be live at: `https://random-name-123456.netlify.app`

### 6. Custom Domain (Optional)
- In Netlify dashboard → "Domain settings"
- Click "Add custom domain"
- Enter your domain name
- Follow DNS setup instructions

## 🎉 Success!
Your website will be live and fully functional with:
- ✅ All your content from Supabase database
- ✅ Contact forms working
- ✅ Admin panel accessible
- ✅ SEO optimized
- ✅ Mobile responsive

## Troubleshooting
If build fails:
1. Check build logs in Netlify dashboard
2. Verify environment variables are correct
3. Make sure build command is exactly: `npm run build`
4. Publish directory should be: `dist/public`