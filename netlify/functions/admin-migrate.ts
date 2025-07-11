import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST' || !event.path.includes('/admin-migrate')) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const dbPassword = process.env.SUPABASE_DB_PASSWORD || 'VapeCave2024!';
    
    if (!supabaseUrl || !supabaseKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Missing environment variables' }),
      };
    }

    // Connect to both databases
    const supabase = createClient(supabaseUrl, supabaseKey);
    const replitDb = postgres(process.env.DATABASE_URL);
    
    console.log('Starting emergency data migration...');
    
    // Get all data from Replit
    const [categories, brands, products, blogPosts, subscriptions] = await Promise.all([
      replitDb`SELECT * FROM brand_categories ORDER BY id`,
      replitDb`SELECT * FROM brands ORDER BY id`,
      replitDb`SELECT * FROM products ORDER BY id`,
      replitDb`SELECT * FROM blog_posts ORDER BY id`,
      replitDb`SELECT * FROM newsletter_subscriptions ORDER BY id`
    ]);
    
    let migrationResults = {
      categories: 0,
      brands: 0,
      products: 0,
      blogPosts: 0,
      subscriptions: 0,
      errors: []
    };
    
    // Insert data with upsert to avoid conflicts
    console.log('Migrating categories...');
    for (const category of categories) {
      const { error } = await supabase.from('brand_categories').upsert({
        id: category.id,
        category: category.category,
        bg_class: category.bg_class || 'bg-gradient-to-br from-gray-900 to-gray-800',
        display_order: category.display_order || 0,
        interval_ms: category.interval_ms || 5000
      });
      if (!error) migrationResults.categories++;
      else migrationResults.errors.push(`Category ${category.id}: ${error.message}`);
    }
    
    console.log('Migrating brands...');
    for (const brand of brands) {
      const { error } = await supabase.from('brands').upsert({
        id: brand.id,
        category_id: brand.categoryId,
        name: brand.name,
        image: brand.image,
        description: brand.description,
        display_order: brand.displayOrder || 0
      });
      if (!error) migrationResults.brands++;
      else migrationResults.errors.push(`Brand ${brand.id}: ${error.message}`);
    }
    
    console.log('Migrating products...');
    for (const product of products) {
      const { error } = await supabase.from('products').upsert({
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
      if (!error) migrationResults.products++;
      else migrationResults.errors.push(`Product ${product.id}: ${error.message}`);
    }
    
    await replitDb.end();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Migration completed',
        results: migrationResults
      }),
    };
    
  } catch (error) {
    console.error('Migration error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Migration failed', 
        details: String(error) 
      }),
    };
  }
};