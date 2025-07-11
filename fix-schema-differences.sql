-- Fix schema differences for Supabase migration
-- Run this in Supabase SQL Editor to match your current database

-- Add missing columns to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Add missing columns to brand_categories table  
ALTER TABLE public.brand_categories ADD COLUMN IF NOT EXISTS bg_class VARCHAR(100);
ALTER TABLE public.brand_categories ADD COLUMN IF NOT EXISTS category VARCHAR(255);

-- Increase varchar limits for brands table
ALTER TABLE public.brands ALTER COLUMN image TYPE TEXT;
ALTER TABLE public.brands ALTER COLUMN slug DROP NOT NULL;

-- Add missing columns to blog_posts table
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS category_id INTEGER;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Add missing columns to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category VARCHAR(255);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add missing columns to newsletter_subscriptions table
ALTER TABLE public.newsletter_subscriptions ADD COLUMN IF NOT EXISTS ip_address INET;
ALTER TABLE public.newsletter_subscriptions ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';