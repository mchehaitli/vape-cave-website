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

    // Featured brands endpoint - only essential fields
    if (event.path.includes('/featured-brands')) {
      const { data: categories, error: catError } = await supabase
        .from('brand_categories')
        .select('id, category, bg_class, display_order, interval_ms')
        .order('display_order');

      if (catError) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Categories error', details: catError.message }),
        };
      }

      const { data: brands, error: brandError } = await supabase
        .from('brands')
        .select('id, name, image, description, category_id, display_order')
        .order('display_order');

      if (brandError) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Brands error', details: brandError.message }),
        };
      }

      // Group brands by category
      const result = (categories || []).map(category => ({
        ...category,
        brands: (brands || []).filter(brand => brand.category_id === category.id)
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result),
      };
    }

    // Products endpoint - essential fields only
    if (event.path.includes('/products')) {
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, category, image, description, price, hide_price, featured, featured_label')
        .order('id');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products || []),
      };
    }

    // Store locations endpoint
    if (event.path.includes('/store-locations')) {
      const { data: locations, error } = await supabase
        .from('store_locations')
        .select('id, name, city, address, phone, hours, lat, lng, image')
        .order('id');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(locations || []),
      };
    }

    // Blog posts endpoint
    if (event.path.includes('/blog-posts')) {
      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, summary, image_url, published, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(posts || []),
      };
    }

    // Admin authentication endpoint
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
    console.error('API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: String(error) }),
    };
  }
};
