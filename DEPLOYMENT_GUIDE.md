# Vape Cave - Deployment Guide

## 🚀 Free Hosting Options

Your Vape Cave website is now ready for deployment! Here are the best free hosting options:

### 1. **Netlify** (Recommended for Full-Stack)
- **Free Tier**: 100GB bandwidth, 300 build minutes/month
- **Features**: Auto-deploy from Git, custom domains, edge functions
- **Perfect for**: Full-stack apps with API routes

**Steps to Deploy:**
1. Go to [netlify.com](https://netlify.com) and create account
2. Connect your GitHub repository
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
4. Add environment variables in Netlify dashboard:
   - `SUPABASE_URL`: `https://dwrpznnbcqrmgoqdnqpo.supabase.co`
   - `SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - `SUPABASE_DB_PASSWORD`: `VapeCave2024!`

### 2. **Vercel** (Great for React Apps)
- **Free Tier**: 100GB bandwidth, unlimited projects
- **Features**: Zero-config deployment, automatic SSL
- **Perfect for**: Frontend with serverless functions

**Steps to Deploy:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Follow prompts to link your project
4. Add environment variables in Vercel dashboard

### 3. **Railway** (Full-Stack Deployment)
- **Free Tier**: $5 credit monthly (usually enough for small apps)
- **Features**: PostgreSQL, Redis, automatic deployments
- **Perfect for**: Full-stack apps with database

### 4. **Render** (Simple Full-Stack)
- **Free Tier**: 750 hours/month, auto-sleep after 15min
- **Features**: Auto-deploy, PostgreSQL, custom domains
- **Perfect for**: Simple full-stack deployment

## 🔧 Build Configuration

Your project includes these deployment files:
- `netlify.toml` - Netlify configuration
- `vercel.json` - Vercel configuration  
- `railway.json` - Railway configuration
- `render.yaml` - Render configuration

## 📦 Build Process

1. **Frontend**: Built with Vite to `dist/public`
2. **Backend**: Compiled with esbuild to `dist/index.js`
3. **Database**: Connected to Supabase PostgreSQL
4. **Static Files**: Served from `dist/public`

## 🌍 Custom Domain Setup

After deployment, you can connect your custom domain:
1. Purchase domain from Namecheap, GoDaddy, etc.
2. Add DNS records pointing to your hosting provider
3. Configure SSL certificate (automatic on most platforms)

## 🔍 SEO Optimization Post-Deployment

Once deployed:
1. **Google Search Console**: Submit your sitemap
2. **Google Business Profile**: Update with your website URL
3. **Local Directories**: Update Yelp, Yellow Pages with new URL
4. **Social Media**: Update all social profiles with new URL

## 📊 Analytics Setup

Add these to your deployed site:
- Google Analytics 4
- Google Search Console
- Google Business Profile insights
- Local SEO tracking tools

## 🚨 Important Notes

- Your database is on Supabase's free tier (up to 50k rows)
- Static assets are served from your hosting provider's CDN
- All environment variables are configured for production
- SSL certificates are automatic on all recommended platforms

Choose the deployment option that best fits your needs. Netlify is recommended for most users due to its excellent full-stack support and generous free tier.