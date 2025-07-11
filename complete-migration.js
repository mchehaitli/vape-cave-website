import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';

const supabaseUrl = 'https://dwrpznnbcqrmgoqdnqpo.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cnB6bm5iY3FybWdvcWRucXBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE5MTI1OSwiZXhwIjoyMDY3NzY3MjU5fQ.jrRHF1Vp1gHu09tY_O1oGO8UXCfSe8KLHcYnRN8iHu4'; // Service role key

async function completeDataMigration() {
  console.log('🚀 Starting complete data migration to Supabase with service role...');
  
  // Connect with service role to bypass RLS
  const supabase = createClient(supabaseUrl, serviceKey);
  const replit = postgres(process.env.DATABASE_URL);
  
  try {
    console.log('📊 Fetching all data from Replit PostgreSQL...');
    
    // Get all data
    const [categories, brands, products, blogPosts, subscriptions] = await Promise.all([
      replit`SELECT * FROM brand_categories ORDER BY id`,
      replit`SELECT * FROM brands ORDER BY id`,
      replit`SELECT * FROM products ORDER BY id`,
      replit`SELECT * FROM blog_posts ORDER BY id`,
      replit`SELECT * FROM newsletter_subscriptions ORDER BY id`
    ]);
    
    console.log(`Found: ${categories.length} categories, ${brands.length} brands, ${products.length} products, ${blogPosts.length} blog posts, ${subscriptions.length} subscriptions`);
    
    // Clear and migrate brand_categories
    console.log('📂 Migrating brand categories...');
    await supabase.from('brand_categories').delete().neq('id', 0);
    
    for (const category of categories) {
      const { error } = await supabase.from('brand_categories').insert({
        id: category.id,
        category: category.category,
        bg_class: category.bg_class,
        display_order: category.display_order,
        interval_ms: category.interval_ms
      });
      if (error) console.error('Category error:', error.message);
    }
    
    // Clear and migrate brands  
    console.log('🏷️ Migrating brands...');
    await supabase.from('brands').delete().neq('id', 0);
    
    for (const brand of brands) {
      const { error } = await supabase.from('brands').insert({
        id: brand.id,
        category_id: brand.categoryId,
        name: brand.name,
        image: brand.image,
        description: brand.description,
        display_order: brand.displayOrder
      });
      if (error) console.error('Brand error:', error.message);
    }
    
    // Clear and migrate products
    console.log('📦 Migrating products...');
    await supabase.from('products').delete().neq('id', 0);
    
    for (const product of products) {
      const { error } = await supabase.from('products').insert({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        featured: product.featured || false,
        featured_label: product.featuredLabel,
        hide_price: product.hidePrice || false,
        category_id: product.categoryId || 1
      });
      if (error) console.error('Product error:', error.message);
    }
    
    // Clear and migrate blog posts
    console.log('📝 Migrating blog posts...');
    await supabase.from('blog_posts').delete().neq('id', 0);
    
    for (const post of blogPosts) {
      const { error } = await supabase.from('blog_posts').insert({
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        content: post.content,
        image_url: post.imageUrl,
        published: post.published || false,
        featured: post.featured || false,
        meta_title: post.metaTitle,
        meta_description: post.metaDescription,
        category_id: post.categoryId || 1
      });
      if (error) console.error('Blog post error:', error.message);
    }
    
    // Clear and migrate newsletter subscriptions
    console.log('📧 Migrating newsletter subscriptions...');
    await supabase.from('newsletter_subscriptions').delete().neq('id', 0);
    
    for (const subscription of subscriptions) {
      const { error } = await supabase.from('newsletter_subscriptions').insert({
        id: subscription.id,
        email: subscription.email,
        created_at: subscription.createdAt
      });
      if (error) console.error('Subscription error:', error.message);
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Verify all data
    const verification = await Promise.all([
      supabase.from('brand_categories').select('*'),
      supabase.from('brands').select('*'),
      supabase.from('products').select('*'),
      supabase.from('blog_posts').select('*'),
      supabase.from('newsletter_subscriptions').select('*')
    ]);
    
    console.log(`✅ Verified migration:`);
    console.log(`   Categories: ${verification[0].data?.length || 0}`);
    console.log(`   Brands: ${verification[1].data?.length || 0}`);
    console.log(`   Products: ${verification[2].data?.length || 0}`);
    console.log(`   Blog Posts: ${verification[3].data?.length || 0}`);
    console.log(`   Subscriptions: ${verification[4].data?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await replit.end();
  }
}

completeDataMigration();