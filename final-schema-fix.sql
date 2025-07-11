-- Final comprehensive schema fix for Supabase migration
-- Run this in Supabase SQL Editor to complete the migration

-- Fix users table column name mismatch
ALTER TABLE public.users RENAME COLUMN password TO password_hash;

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