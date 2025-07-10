# Step-by-Step Migration Guide

## Before You Start
1. **Download all your files** from Replit (use Git or download as ZIP)
2. **Note your current environment variables** (especially DATABASE_URL)
3. **Test that your database (Neon) is accessible** from outside Replit

## Option 1: Vercel (Recommended - Best for Performance)

### Step 1: Prepare Repository
```bash
# Create GitHub repository and push your code
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/vape-cave.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "New Project" and import your GitHub repository
3. Configure these settings:
   - **Framework**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm ci`

### Step 3: Set Environment Variables
In Vercel dashboard → Settings → Environment Variables, add:
```
DATABASE_URL=your_neon_database_url
SESSION_SECRET=your_session_secret
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

### Step 4: Deploy
- Vercel will automatically deploy
- Your site will be available at `https://your-project.vercel.app`

## Option 2: Railway (Easiest Full-Stack Option)

### Step 1: Deploy to Railway
1. Go to [railway.app](https://railway.app) and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect it's a Node.js project

### Step 2: Configure Environment Variables
In Railway dashboard → Variables tab, add all your environment variables

### Step 3: Custom Domain (Optional)
- Railway provides a free subdomain: `your-app.up.railway.app`
- You can add a custom domain in Settings → Domains

## Option 3: Render (Heroku Alternative)

### Step 1: Create Web Service
1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: vape-cave
   - **Environment**: Node
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`

### Step 2: Environment Variables
Add all your environment variables in the Environment tab

## Option 4: Netlify (Best for Static Sites)

### Step 1: Deploy Site
1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag your project folder to Netlify dashboard OR connect GitHub
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`

### Step 2: Functions Setup
- Netlify will automatically handle serverless functions
- Your API routes will work as Netlify Functions

## Post-Migration Checklist

### ✅ Test Everything
- [ ] Homepage loads correctly
- [ ] All pages are accessible
- [ ] Database connections work
- [ ] Contact forms send emails
- [ ] Admin panel functions
- [ ] Google Analytics tracking
- [ ] SEO meta tags are present

### ✅ Update DNS (If Using Custom Domain)
1. Purchase domain from provider (GoDaddy, Namecheap, etc.)
2. Point DNS to your hosting service:
   - **Vercel**: Add CNAME record pointing to `cname.vercel-dns.com`
   - **Railway**: Add CNAME record pointing to your Railway URL
   - **Render**: Add CNAME record pointing to your Render URL
   - **Netlify**: Add CNAME record pointing to your Netlify URL

### ✅ Update Google Search Console
1. Add new domain to Google Search Console
2. Update sitemap URL: `https://your-new-domain.com/sitemap.xml`
3. Submit for indexing

### ✅ Update Google Analytics
- Verify tracking is working on new domain
- Update any domain filters in GA4

## Cost Breakdown (Free Tiers)

| Service | Bandwidth | Functions | Database | Custom Domain |
|---------|-----------|-----------|----------|---------------|
| Vercel  | 100GB/mo  | 1000/day  | External | ✅ Free        |
| Railway | 500GB/mo  | Always-on | External | ✅ Free        |
| Render  | 100GB/mo  | Always-on | 90 days  | ✅ Free        |
| Netlify | 100GB/mo  | 125k/mo   | External | ✅ Free        |

## Recommended Choice

**For Vape Cave, I recommend Railway** because:
- ✅ Full-stack support (frontend + backend)
- ✅ Always-on (no cold starts)
- ✅ Easy database integration
- ✅ Generous free tier
- ✅ Simple deployment process
- ✅ Great performance

Would you like me to help you with any specific platform setup?