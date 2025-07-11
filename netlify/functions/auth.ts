import type { Handler } from '@netlify/functions';

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

  console.log('Auth endpoint called:', event.path, event.httpMethod);

  // Handle login specifically
  if (event.path.includes('/login') && event.httpMethod === 'POST') {
    console.log('Processing login request');
    try {
      const { username, password } = JSON.parse(event.body || '{}');
      console.log('Login attempt for username:', username);
      
      // Hardcoded admin credentials for immediate access
      if (username === 'admin' && password === 'admin123') {
        console.log('Login successful');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            user: { id: 1, username: 'admin', role: 'admin' }
          }),
        };
      }
      
      console.log('Invalid credentials');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: 'Invalid credentials' }),
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Invalid request body' }),
      };
    }
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Not found' }),
  };
};