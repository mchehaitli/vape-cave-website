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

    const path = event.path || '';
    const method = event.httpMethod || 'GET';

    // Store Locations - WORKING
    if (path.includes('/store-locations') && method === 'GET') {
      const { data } = await supabase.from('store_locations').select('*').order('id');
      return { statusCode: 200, headers, body: JSON.stringify(data || []) };
    }

    // Brand Categories - WORKING
    if (path.includes('/brand-categories') && method === 'GET') {
      const { data } = await supabase.from('brand_categories').select('*').order('display_order');
      return { statusCode: 200, headers, body: JSON.stringify(data || []) };
    }

    // Brands - WORKING
    if (path.includes('/brands') && !path.includes('featured') && method === 'GET') {
      const { data } = await supabase.from('brands').select('*').order('display_order');
      return { statusCode: 200, headers, body: JSON.stringify(data || []) };
    }

    // Products - FIX THIS
    if (path.includes('/products') && method === 'GET') {
      try {
        const { data, error } = await supabase.from('products').select('*').order('id');
        if (error) {
          console.error('Products error:', error);
          return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
        }
        return { statusCode: 200, headers, body: JSON.stringify(data || []) };
      } catch (err) {
        console.error('Products catch:', err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Products query failed' }) };
      }
    }

    // Blog Posts - FIX THIS
    if (path.includes('/blog-posts') && method === 'GET') {
      try {
        const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        if (error) {
          console.error('Blog posts error:', error);
          return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
        }
        return { statusCode: 200, headers, body: JSON.stringify(data || []) };
      } catch (err) {
        console.error('Blog posts catch:', err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Blog posts query failed' }) };
      }
    }

    // Newsletter Subscriptions - FIX THIS
    if (path.includes('/newsletter-subscriptions') && method === 'GET') {
      try {
        const { data, error } = await supabase.from('newsletter_subscriptions').select('*').order('created_at', { ascending: false });
        if (error) {
          console.error('Newsletter error:', error);
          return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
        }
        return { statusCode: 200, headers, body: JSON.stringify(data || []) };
      } catch (err) {
        console.error('Newsletter catch:', err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Newsletter query failed' }) };
      }
    }

    // Featured brands for homepage
    if (path.includes('/featured-brands')) {
      const { data: categories } = await supabase
        .from('brand_categories')
        .select('id, category, bg_class, display_order, interval_ms')
        .order('display_order');

      const { data: brands } = await supabase
        .from('brands')
        .select('id, name, category_id, display_order')
        .order('display_order');

      const result = (categories || []).map(cat => ({
        id: cat.id,
        category: cat.category,
        bg_class: cat.bg_class,
        display_order: cat.display_order,
        interval_ms: cat.interval_ms,
        brands: (brands || []).filter(b => b.category_id === cat.id).slice(0, 4)
      }));

      return { statusCode: 200, headers, body: JSON.stringify(result) };
    }

    // CRUD Operations
    if (method === 'POST' && path.includes('/brands') && !path.includes('featured')) {
      const brandData = JSON.parse(event.body || '{}');
      const { data, error } = await supabase.from('brands').insert(brandData).select();
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 201, headers, body: JSON.stringify(data[0]) };
    }

    if (method === 'PUT' && path.includes('/brands/')) {
      const id = path.split('/').pop();
      const brandData = JSON.parse(event.body || '{}');
      const { data, error } = await supabase.from('brands').update(brandData).eq('id', id).select();
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify(data[0]) };
    }

    if (method === 'DELETE' && path.includes('/brands/')) {
      const id = path.split('/').pop();
      const { error } = await supabase.from('brands').delete().eq('id', id);
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 204, headers, body: '' };
    }

    if (method === 'POST' && path.includes('/products')) {
      const productData = JSON.parse(event.body || '{}');
      const { data, error } = await supabase.from('products').insert(productData).select();
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 201, headers, body: JSON.stringify(data[0]) };
    }

    if (method === 'PUT' && path.includes('/products/')) {
      const id = path.split('/').pop();
      const productData = JSON.parse(event.body || '{}');
      const { data, error } = await supabase.from('products').update(productData).eq('id', id).select();
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify(data[0]) };
    }

    if (method === 'DELETE' && path.includes('/products/')) {
      const id = path.split('/').pop();
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 204, headers, body: '' };
    }

    if (method === 'POST' && path.includes('/blog-posts')) {
      const postData = JSON.parse(event.body || '{}');
      const { data, error } = await supabase.from('blog_posts').insert(postData).select();
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 201, headers, body: JSON.stringify(data[0]) };
    }

    if (method === 'PUT' && path.includes('/blog-posts/')) {
      const id = path.split('/').pop();
      const postData = JSON.parse(event.body || '{}');
      const { data, error } = await supabase.from('blog_posts').update(postData).eq('id', id).select();
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify(data[0]) };
    }

    if (method === 'DELETE' && path.includes('/blog-posts/')) {
      const id = path.split('/').pop();
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 204, headers, body: '' };
    }

    if (method === 'POST' && path.includes('/newsletter-subscriptions')) {
      const emailData = JSON.parse(event.body || '{}');
      const { data, error } = await supabase.from('newsletter_subscriptions').insert(emailData).select();
      if (error) return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 201, headers, body: JSON.stringify(data[0]) };
    }

    if (path.includes('/contact') && method === 'POST') {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Message sent successfully' }) };
    }

    // Admin Authentication
    if (path.includes('/auth/login') && method === 'POST') {
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

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Endpoint not found' }) };

  } catch (error) {
    console.error('Handler error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
