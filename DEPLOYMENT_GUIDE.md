# Deployment Guide - Moving from Replit to Free Hosting

## Recommended Free Hosting Services

### 1. Vercel (Recommended for your stack)
- **Best for**: React/Next.js applications with serverless backend
- **Database**: Works with Neon PostgreSQL (your current setup)
- **Pros**: Excellent performance, automatic deployments, built-in CDN
- **Limits**: 100GB bandwidth/month, 1000 serverless function invocations/day
- **Setup**: Connect GitHub repo, auto-deploys on push

### 2. Netlify
- **Best for**: Static sites and JAMstack applications
- **Database**: Works with external databases like Neon
- **Pros**: Great for frontend, excellent build pipeline
- **Limits**: 100GB bandwidth/month, 300 build minutes/month
- **Setup**: Connect GitHub repo, configure build settings

### 3. Railway
- **Best for**: Full-stack applications with databases
- **Database**: Can host PostgreSQL or connect to external
- **Pros**: Easy Docker deployment, supports many languages
- **Limits**: $5 trial credit only, then paid ($0.000463/GB-hour)
- **Setup**: Connect GitHub repo, automatic deployment
- **Note**: No longer free after trial period

### 4. Render
- **Best for**: Full-stack applications
- **Database**: Free PostgreSQL tier available
- **Pros**: Similar to Heroku, easy setup
- **Limits**: Apps sleep after 15 min of inactivity, 750 hours/month
- **Setup**: Connect GitHub repo, configure services

## Migration Steps

### Step 1: Prepare Your Repository
1. Create a GitHub repository
2. Push your code to GitHub
3. Ensure all environment variables are documented

### Step 2: Database Migration
- Your Neon PostgreSQL database can remain the same
- Update DATABASE_URL in new hosting environment
- Run database migrations if needed

### Step 3: Environment Variables
- Set up these variables in your hosting service:
  - DATABASE_URL
  - SESSION_SECRET
  - EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
  - Any other API keys

### Step 4: Build Configuration
- Most services auto-detect Node.js projects
- Build command: `npm run build`
- Start command: `npm start`
- Node version: 18 or 20

## Files You'll Need to Create/Modify

### package.json scripts
```json
{
  "scripts": {
    "build": "vite build && tsc server/index.ts --outDir dist --target es2020 --module commonjs",
    "start": "node dist/index.js",
    "dev": "tsx server/index.ts"
  }
}
```

### Dockerfile (for Railway/Render)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## Next Steps
1. Choose your preferred hosting service
2. Create a GitHub repository
3. Follow the specific setup guide for your chosen platform