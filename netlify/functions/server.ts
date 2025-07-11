import type { Handler } from '@netlify/functions';
import { db } from '../../server/db';
import { products, brands, brandCategories, storeLocations, blogPosts, newsletterSubscriptions } from '../../shared/schema';

export const handler: Handler = async (event, context) => {
  const path = event.path.replace('/.netlify/functions/server', '');
  const method = event.httpMethod;
  
  console.log('Function called with path:', path, 'method:', method);

  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Route: GET /api/products
    if (path === '/api/products' && method === 'GET') {
      const allProducts = await db.select().from(products);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(allProducts),
      };
    }

    // Route: GET /api/featured-brands
    if (path === '/api/featured-brands' && method === 'GET') {
      const categories = await db.select().from(brandCategories);
      const allBrands = await db.select().from(brands);
      
      const result = categories.map(category => ({
        ...category,
        brands: allBrands.filter(brand => brand.categoryId === category.id)
      }));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result),
      };
    }

    // Route: GET /api/store-locations
    if (path === '/api/store-locations' && method === 'GET') {
      const locations = await db.select().from(storeLocations);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(locations),
      };
    }

    // Route: GET /api/blog-posts
    if (path === '/api/blog-posts' && method === 'GET') {
      const posts = await db.select().from(blogPosts);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(posts),
      };
    }

    // Handle authentication routes for admin
    if (path === '/api/auth/login' && method === 'POST') {
      const { username, password } = JSON.parse(event.body || '{}');
      
      // Simple hardcoded admin check for now
      if (username === 'admin' && password === 'VapeCave2024!') {
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

    // Default 404
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ 
        error: 'Not found', 
        path: path, 
        method: method,
        available: ['/api/products', '/api/featured-brands', '/api/store-locations', '/api/blog-posts', '/api/auth/login']
      }),
    };

  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};