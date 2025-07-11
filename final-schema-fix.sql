-- Final comprehensive schema fix for Supabase migration
-- Run this in Supabase SQL Editor to complete the migration

-- Handle password/password_hash column conflict safely
DO $$
DECLARE
    password_exists BOOLEAN;
    password_hash_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password'
    ) INTO password_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password_hash'
    ) INTO password_hash_exists;
    
    -- Only rename if password exists and password_hash doesn't
    IF password_exists AND NOT password_hash_exists THEN
        EXECUTE 'ALTER TABLE public.users RENAME COLUMN password TO password_hash;';
    -- If both exist, drop the extra password column
    ELSIF password_exists AND password_hash_exists THEN
        EXECUTE 'ALTER TABLE public.users DROP COLUMN password;';
        RAISE NOTICE 'Dropped duplicate password column, keeping password_hash.';
    -- If only password_hash exists, nothing to do
    ELSIF NOT password_exists AND password_hash_exists THEN
        RAISE NOTICE 'Column password_hash already exists. No action needed.';
    -- If neither exists, that's a different problem
    ELSE
        RAISE NOTICE 'Neither password nor password_hash column exists.';
    END IF;
END $$;

-- Add missing columns to brand_categories table
ALTER TABLE public.brand_categories ADD COLUMN IF NOT EXISTS interval_ms INTEGER;

-- Add missing columns to blog_posts table
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Add missing columns to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS featured_label VARCHAR(255);

-- Add missing columns to newsletter_subscriptions table
ALTER TABLE public.newsletter_subscriptions ADD COLUMN IF NOT EXISTS subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';