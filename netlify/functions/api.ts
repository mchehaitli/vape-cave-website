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
    // Use direct Supabase credentials to ensure connection works
    const supabaseUrl = 'https://dwrpznnbcqrmgoqdnqpo.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cnB6bm5iY3FybWdvcWRucXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTEyNTksImV4cCI6MjA2Nzc2NzI1OX0.epxb1h8fNOaP7JVDvtlm3jjsSqHnk3piU33Gn7AUZqM';
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Products endpoint
    if (event.path.includes('/products')) {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('id');

      if (error) {
        console.error('Products error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Database error', details: error.message }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products || []),
      };
    }

    // Featured brands endpoint - corrected version
    if (event.path.includes('/featured-brands')) {
      console.log('Fetching categories and brands...');
      
      const { data: categories, error: catError } = await supabase
        .from('brand_categories')
        .select('*')
        .order('display_order');

      if (catError) {
        console.error('Categories error:', catError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Categories error', details: catError.message }),
        };
      }

      const { data: brands, error: brandError } = await supabase
        .from('brands')
        .select('*')
        .order('display_order');

      if (brandError) {
        console.error('Brands error:', brandError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Brands error', details: brandError.message }),
        };
      }

      console.log(`Found ${categories?.length || 0} categories and ${brands?.length || 0} brands`);

      // Build the relationship correctly using category_id
      const result = (categories || []).map(category => {
        const categoryBrands = (brands || []).filter(brand => brand.category_id === category.id);
        return {
          ...category,
          brands: categoryBrands
        };
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result),
      };
    }

    // Store locations endpoint
    if (event.path.includes('/store-locations')) {
      const { data: locations, error } = await supabase
        .from('store_locations')
        .select('*')
        .order('id');

      if (error) {
        console.error('Store locations error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Database error', details: error.message }),
        };
      }

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
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Blog posts error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Database error', details: error.message }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(posts || []),
      };
    }

    // Admin authentication endpoint
    if (event.path.includes('/auth/login') && event.httpMethod === 'POST') {
      console.log('Admin login attempt received');
      try {
        const { username, password } = JSON.parse(event.body || '{}');
        console.log('Login attempt for username:', username);
        
        // For now, use hardcoded admin credentials since Supabase user migration has RLS issues
        if (username === 'admin' && password === 'admin123') {
          console.log('Admin login successful');
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
              success: true, 
              user: { id: 1, username: 'admin', role: 'admin' }
            }),
          };
        }
        
        console.log('Invalid credentials provided');
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, error: 'Invalid credentials' }),
        };
      } catch (error) {
        console.error('Login parsing error:', error);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Invalid request body' }),
        };
      }
    }
    
    // Test endpoint for debugging
    if (event.path.includes('/test')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'API is working', 
          path: event.path,
          method: event.httpMethod,
          timestamp: new Date().toISOString()
        }),
      };
    }

    // Default response
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