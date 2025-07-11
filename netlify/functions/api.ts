import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  console.log('API function called:', { 
    path: event.path, 
    method: event.httpMethod,
    headers: event.headers 
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
    // Simple hardcoded responses for testing
    if (event.path.includes('/products')) {
      const products = [
        {
          id: 1,
          name: "SMOK Novo Pro",
          description: "Compact pod system with adjustable wattage and long battery life.",
          price: "39.99",
          image: "https://scontent-dfw5-1.xx.fbcdn.net/v/t39.30808-6/432760194_946922374107813_3292714966077840449_n.jpg",
          category: "devices",
          stock: 25
        },
        {
          id: 2,
          name: "Vaporesso XROS Pro",
          description: "Ultra-portable pod system with auto-draw and button activation.",
          price: "29.99",
          image: "https://cdn-ifkap.nitrocdn.com/hhsTjqigDlYlUXhxmhMDYtFLDhEnslCn/assets/images/optimized/rev-98c3f22/vaperite.co.za/wp-content/uploads/2024/02/vaporesso-xros-pro-pod-kit-specifications.png",
          category: "devices",
          stock: 30
        }
      ];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products),
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