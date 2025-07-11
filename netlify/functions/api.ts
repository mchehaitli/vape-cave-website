import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

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

  try {
    const supabaseUrl = 'https://dwrpznnbcqrmgoqdnqpo.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cnB6bm5iY3FybWdvcWRucXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTEyNTksImV4cCI6MjA2Nzc2NzI1OX0.epxb1h8fNOaP7JVDvtlm3jjsSqHnk3piU33Gn7AUZqM';
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Featured brands endpoint - WITH IMAGES BUT LIMITED
    if (event.path.includes('/featured-brands')) {
      const { data: categories } = await supabase
        .from('brand_categories')
        .select('id, category, bg_class, display_order, interval_ms')
        .order('display_order');

      const { data: brands } = await supabase
        .from('brands')
        .select('id, name, image, category_id, display_order')
        .order('display_order');

      const result = (categories || []).map(category => ({
        id: category.id,
        category: category.category,
        bg_class: category.bg_class,
        display_order: category.display_order,
        interval_ms: category.interval_ms,
        brands: (brands || []).filter(brand => brand.category_id === category.id).slice(0, 6)
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result),
      };
    }

    // Products endpoint - WITH IMAGES
    if (event.path.includes('/products')) {
      const { data: products } = await supabase
        .from('products')
        .select('id, name, category, image, price, hide_price, featured, featured_label')
        .limit(50);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products || []),
      };
    }

    // Store locations - WITH ESSENTIAL INFO
    if (event.path.includes('/store-locations')) {
      const { data: locations } = await supabase
        .from('store_locations')
        .select('id, name, city, address, phone, hours, lat, lng, image')
        .limit(10);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(locations || []),
      };
    }

    // Blog posts - WITH IMAGES
    if (event.path.includes('/blog-posts')) {
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('id, title, slug, summary, image_url, published, created_at')
        .eq('published', true)
        .limit(20);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(posts || []),
      };
    }

    // Admin auth - WORKING
    if (event.path.includes('/auth/login') && event.httpMethod === 'POST') {
      const { username, password } = JSON.parse(event.body || '{}');
      
      if (username === 'admin' && password === 'admin123') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            user: { id: 1, username: 'admin', role: 'admin' }
          }),
        };
      }
      
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: 'Invalid credentials' }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};
