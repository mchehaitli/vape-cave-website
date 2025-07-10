# Supabase Migration Guide for Vape Cave

## Phase 1: Create Supabase Project (30 minutes)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub account (free)
3. Create new project: "vape-cave-website"
4. Choose region: "US Central" (closest to Texas)
5. Set a strong database password
6. Wait 2-3 minutes for project setup

### Step 2: Get Your Project Credentials
1. Go to Settings > API in your Supabase dashboard
2. Copy these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 3: Update Environment Variables
Copy the values to your `.env` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Phase 2: Database Migration (45 minutes)

### Step 1: Database Backup (Complete ✅)
Your database has been backed up to `vape_cave_backup.sql`

### Step 2: Import to Supabase
1. Go to Settings > Database in Supabase dashboard
2. Get your connection string (looks like):
   ```
   postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
   ```
3. Import your data:
   ```bash
   psql "postgresql://postgres:password@db.your-project.supabase.co:5432/postgres" < vape_cave_backup.sql
   ```

### Step 3: Verify Migration
Check that all tables and data transferred correctly in Supabase Table Editor.

## Phase 3: Code Migration (2 hours)

### Step 1: Update Database Client
Replace your current database connection with Supabase client (files already prepared).

### Step 2: Convert API Routes
Transform Express.js routes into Supabase Edge Functions:

- `/api/store-locations` → Edge Function
- `/api/featured-brands` → Edge Function  
- `/api/blog-posts` → Edge Function
- `/api/products` → Edge Function
- `/api/contact` → Edge Function

### Step 3: Deploy Frontend
Upload your React build to Supabase hosting.

## Migration Status

### Completed ✅
- [x] Database backup created
- [x] Supabase packages installed
- [x] Environment template created
- [x] Supabase client configuration ready

### Next Steps (Manual)
1. **Create Supabase project** (5 minutes)
2. **Get API credentials** (2 minutes)
3. **Import database** (15 minutes)
4. **Test connection** (10 minutes)

## Ready to Start!

**What you need to do:**
1. Create your free Supabase account at supabase.com
2. Create new project called "vape-cave-website"
3. Share your Project URL and API keys with me
4. I'll handle the complete migration

**Benefits after migration:**
- Zero hosting costs
- Automatic backups
- Built-in admin panel
- Real-time features
- Better performance
- Easier maintenance

The migration preserves all your data, SEO optimizations, and functionality while moving to a more reliable platform.