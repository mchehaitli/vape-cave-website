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
        console.error('Supabase error:', error);
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

    // Handle featured brands endpoint
    if (event.path.includes('/featured-brands')) {
      const { data: categories, error: catError } = await supabase
        .from('brand_categories')
        .select('*')
        .order('id');

      if (catError) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Database error', details: catError.message }),
        };
      }

      const { data: brands, error: brandError } = await supabase
        .from('brands')
        .select('*')
        .order('id');

      if (brandError) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Database error', details: brandError.message }),
        };
      }

      const result = (categories || []).map(category => ({
        ...category,
        brands: (brands || []).filter(brand => brand.categoryId === category.id)
      }));

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

    if (event.path.includes('/auth/login')) {
      const body = JSON.parse(event.body || '{}');
      
      if (body.username === 'admin' && body.password === 'VapeCave2024!') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            user: { id: 1, username: 'admin', role: 'admin' }
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