import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';

const supabaseUrl = 'https://dwrpznnbcqrmgoqdnqpo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cnB6bm5iY3FybWdvcWRucXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTEyNTksImV4cCI6MjA2Nzc2NzI1OX0.epxb1h8fNOaP7JVDvtlm3jjsSqHnk3piU33Gn7AUZqM';
const dbPassword = 'VapeCave2024!';

async function migrateCompleteData() {
  console.log('🚀 Starting complete data migration from Replit PostgreSQL to Supabase...');
  
  // Connect to both databases
  const supabase = createClient(supabaseUrl, supabaseKey);
  const replit = postgres(process.env.DATABASE_URL);
  
  try {
    // Get all data from Replit PostgreSQL
    console.log('📊 Fetching data from Replit PostgreSQL...');
    const categories = await replit`SELECT * FROM brand_categories ORDER BY id`;
    const brands = await replit`SELECT * FROM brands ORDER BY id`;
    const products = await replit`SELECT * FROM products ORDER BY id`;
    
    console.log(`Found ${categories.length} categories, ${brands.length} brands, ${products.length} products`);
    
    // Clear existing data in Supabase
    console.log('🗑️ Clearing existing Supabase data...');
    await supabase.from('brands').delete().neq('id', 0);
    await supabase.from('brand_categories').delete().neq('id', 0);
    await supabase.from('products').delete().neq('id', 0);
    
    // Insert categories
    console.log('📂 Migrating brand categories...');
    for (const category of categories) {
      const { error } = await supabase.from('brand_categories').insert({
        id: category.id,
        category: category.category,
        bg_class: category.bg_class,
        display_order: category.display_order,
        interval_ms: category.interval_ms
      });
      if (error) console.error('Category error:', error);
    }
    
    // Insert brands
    console.log('🏷️ Migrating brands...');
    for (const brand of brands) {
      const { error } = await supabase.from('brands').insert({
        id: brand.id,
        category_id: brand.categoryId,
        name: brand.name,
        image: brand.image,
        description: brand.description,
        display_order: brand.displayOrder
      });
      if (error) console.error('Brand error:', error);
    }
    
    // Insert products
    console.log('📦 Migrating products...');
    for (const product of products) {
      const { error } = await supabase.from('products').insert({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock
      });
      if (error) console.error('Product error:', error);
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Verify migration
    const { data: newCategories } = await supabase.from('brand_categories').select('*');
    const { data: newBrands } = await supabase.from('brands').select('*');
    const { data: newProducts } = await supabase.from('products').select('*');
    
    console.log(`✅ Verified: ${newCategories?.length || 0} categories, ${newBrands?.length || 0} brands, ${newProducts?.length || 0} products in Supabase`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await replit.end();
  }
}

migrateCompleteData();