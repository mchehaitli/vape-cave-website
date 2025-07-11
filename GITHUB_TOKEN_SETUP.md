# 🔑 GitHub Token Setup for Push

## The Issue
GitHub requires a Personal Access Token instead of your password for authentication.

## Quick Fix - Create GitHub Token:

### Step 1: Create Token
1. Go to GitHub.com → Click your profile picture → Settings
2. Scroll down to "Developer settings" (left sidebar)
3. Click "Personal access tokens" → "Tokens (classic)"
4. Click "Generate new token" → "Generate new token (classic)"
5. Give it a name: "Netlify Deployment"
6. Set expiration: "90 days" (or longer)
7. **Check these permissions:**
   - ✅ repo (full repository access)
   - ✅ workflow (if you want GitHub Actions)
8. Click "Generate token"
9. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Push with Token
In your Replit Shell, run:

```bash
# Remove the old remote
git remote remove origin

# Add remote with your username and token
git remote add origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/mchehaitli/vape-cave-website.git

# Push to GitHub
git push -u origin main
```

Replace:
- `YOUR_USERNAME` with: `mchehaitli`
- `YOUR_TOKEN` with the token you just created

## Alternative: Use SSH (More Secure)
If you prefer SSH keys, follow GitHub's SSH setup guide instead.

## After Success
Your code will appear in GitHub and you can continue with Netlify deployment!