import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const handler: Handler = async (event, context) => {
  console.log('API function called:', { 
    path: event.path, 
    method: event.httpMethod
  });

  // Handle CORS
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
    // Initialize Supabase client with environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Missing environment variables',
          supabaseUrl: !!supabaseUrl,
          supabaseKey: !!supabaseKey
        }),
      };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle products endpoint
    if (event.path.includes('/products')) {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('id');

      if (error) {
        console.error('Supabase products error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Database error', details: error.message }),
        };
      }

      console.log(`Products query returned ${products?.length || 0} items`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products || []),
      };
    }

    // Handle featured brands endpoint with proper relationship
    if (event.path.includes('/featured-brands')) {
      // Get all categories
      const { data: categories, error: catError } = await supabase
        .from('brand_categories')
        .select('*')
        .order('id');

      if (catError) {
        console.error('Categories error:', catError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Database error', details: catError.message }),
        };
      }

      // Get all brands
      const { data: brands, error: brandError } = await supabase
        .from('brands')
        .select('*')
        .order('id');

      if (brandError) {
        console.error('Brands error:', brandError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Database error', details: brandError.message }),
        };
      }

      console.log(`Found ${categories?.length || 0} categories and ${brands?.length || 0} brands`);

      // Build the relationship correctly
      const result = (categories || []).map(category => {
        const categoryBrands = (brands || []).filter(brand => brand.category_id === category.id);
        console.log(`Category ${category.id} (${category.category}): ${categoryBrands.length} brands`);
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

    // Handle store locations endpoint
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

    // Authentication endpoints
    if (event.path.includes('/auth/login')) {
      const body = JSON.parse(event.body || '{}');
      
      if (body.username === 'admin' && body.password === 'VapeCave2024!') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            isAdmin: true,
            user: { id: 1, username: 'admin', role: 'admin', isAdmin: true }
          }),
        };
      } else {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid credentials' }),
        };
      }
    }

    if (event.path.includes('/auth/status')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          authenticated: true,
          user: { id: 1, username: 'admin', role: 'admin', isAdmin: true }
        }),
      };
    }

    if (event.path.includes('/auth/logout')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found', path: event.path }),
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: String(error) }),
    };
  }
};