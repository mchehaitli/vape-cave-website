-- Add the last missing columns
ALTER TABLE public.brand_categories ALTER COLUMN slug DROP NOT NULL;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';