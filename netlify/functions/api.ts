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
    const supabase = createClient(
      'https://dwrpznnbcqrmgoqdnqpo.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cnB6bm5iY3FybWdvcWRucXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTEyNTksImV4cCI6MjA2Nzc2NzI1OX0.epxb1h8fNOaP7JVDvtlm3jjsSqHnk3piU33Gn7AUZqM'
    );

    if (event.path.includes('/featured-brands')) {
      const { data: categories } = await supabase
        .from('brand_categories')
        .select('id, category, bg_class')
        .order('display_order')
        .limit(6);

      const { data: brands } = await supabase
        .from('brands')
        .select('id, name, category_id')
        .order('display_order')
        .limit(18);

      const result = (categories || []).map(cat => ({
        id: cat.id,
        category: cat.category,
        bg_class: cat.bg_class,
        brands: (brands || []).filter(b => b.category_id === cat.id).slice(0, 3)
      }));

      return { statusCode: 200, headers, body: JSON.stringify(result) };
    }

    if ((event.path === '/api/products' || event.path.endsWith('/products')) && event.httpMethod === 'GET') {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('id');
      return { statusCode: 200, headers, body: JSON.stringify(data || []) };
    }

    if (event.path === '/api/store-locations' || event.path.endsWith('/store-locations')) {
      const { data } = await supabase
        .from('store_locations')
        .select('*')
        .order('id');
      return { statusCode: 200, headers, body: JSON.stringify(data || []) };
    }

    if ((event.path === '/api/blog-posts' || event.path.endsWith('/blog-posts')) && event.httpMethod === 'GET') {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      return { statusCode: 200, headers, body: JSON.stringify(data || []) };
    }

    // Admin data endpoints - specific paths first
    if (event.path === '/api/brand-categories' || event.path.endsWith('/brand-categories')) {
      const { data } = await supabase.from('brand_categories').select('*').order('display_order');
      return { statusCode: 200, headers, body: JSON.stringify(data || []) };
    }

    if (event.path === '/api/brands' || (event.path.endsWith('/brands') && event.httpMethod === 'GET')) {
      const { data } = await supabase.from('brands').select('*').order('display_order');
      return { statusCode: 200, headers, body: JSON.stringify(data || []) };
    }

    if (event.path === '/api/newsletter-subscriptions' || event.path.endsWith('/newsletter-subscriptions')) {
      const { data } = await supabase.from('newsletter_subscriptions').select('*').order('created_at', { ascending: false });
      return { statusCode: 200, headers, body: JSON.stringify(data || []) };
    }

    // Admin auth
    if (event.path.includes('/auth/login') && event.httpMethod === 'POST') {
      const { username, password } = JSON.parse(event.body || '{}');
      if (username === 'admin' && password === 'admin123') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, user: { id: 1, username: 'admin', role: 'admin' } })
        };
      }
      return { statusCode: 401, headers, body: JSON.stringify({ success: false, error: 'Invalid credentials' }) };
    }

    // Create/Update endpoints for admin
    if (event.httpMethod === 'POST' && event.path.includes('/brands') && !event.path.includes('/featured-brands')) {
      const brandData = JSON.parse(event.body || '{}');
      const { data, error } = await supabase.from('brands').insert(brandData).select();
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 201, headers, body: JSON.stringify(data[0]) };
    }

    if (event.httpMethod === 'PUT' && event.path.includes('/brands/')) {
      const id = event.path.split('/').pop();
      const brandData = JSON.parse(event.body || '{}');
      const { data, error } = await supabase.from('brands').update(brandData).eq('id', id).select();
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify(data[0]) };
    }

    if (event.httpMethod === 'DELETE' && event.path.includes('/brands/')) {
      const id = event.path.split('/').pop();
      const { error } = await supabase.from('brands').delete().eq('id', id);
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 204, headers, body: '' };
    }

    // Product CRUD
    if (event.httpMethod === 'POST' && event.path.includes('/products') && !event.path.includes('/blog-posts')) {
      const productData = JSON.parse(event.body || '{}');
      const { data, error } = await supabase.from('products').insert(productData).select();
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 201, headers, body: JSON.stringify(data[0]) };
    }

    if (event.httpMethod === 'PUT' && event.path.includes('/products/')) {
      const id = event.path.split('/').pop();
      const productData = JSON.parse(event.body || '{}');
      const { data, error } = await supabase.from('products').update(productData).eq('id', id).select();
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify(data[0]) };
    }

    if (event.httpMethod === 'DELETE' && event.path.includes('/products/')) {
      const id = event.path.split('/').pop();
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 204, headers, body: '' };
    }

    // Blog posts CRUD
    if (event.httpMethod === 'POST' && event.path.includes('/blog-posts')) {
      const postData = JSON.parse(event.body || '{}');
      const { data, error } = await supabase.from('blog_posts').insert(postData).select();
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 201, headers, body: JSON.stringify(data[0]) };
    }

    if (event.httpMethod === 'PUT' && event.path.includes('/blog-posts/')) {
      const id = event.path.split('/').pop();
      const postData = JSON.parse(event.body || '{}');
      const { data, error } = await supabase.from('blog_posts').update(postData).eq('id', id).select();
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify(data[0]) };
    }

    if (event.httpMethod === 'DELETE' && event.path.includes('/blog-posts/')) {
      const id = event.path.split('/').pop();
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 204, headers, body: '' };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };

  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
  }
};
