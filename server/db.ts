import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Use environment variables from Netlify/production or fallback to hardcoded values
const supabaseUrl = process.env.SUPABASE_URL || 'https://dwrpznnbcqrmgoqdnqpo.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cnB6bm5iY3FybWdvcWRucXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTEyNTksImV4cCI6MjA2Nzc2NzI1OX0.epxb1h8fNOaP7JVDvtlm3jjsSqHnk3piU33Gn7AUZqM';
const dbPassword = process.env.SUPABASE_DB_PASSWORD || 'VapeCave2024!';

const connectionString = `postgresql://postgres.dwrpznnbcqrmgoqdnqpo:${dbPassword}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

console.log('Connecting to database with URL:', supabaseUrl);
console.log('Using connection string:', connectionString.replace(dbPassword, '[HIDDEN]'));

const client = postgres(connectionString, {
  max: 1, // Limit connections for serverless
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

// Also export Supabase client for direct operations if needed
export const supabase = createClient(supabaseUrl, supabaseKey);
