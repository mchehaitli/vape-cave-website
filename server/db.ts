import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Use Supabase connection
const supabaseUrl = 'https://dwrpznnbcqrmgoqdnqpo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cnB6bm5iY3FybWdvcWRucXBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE5MTI1OSwiZXhwIjoyMDY3NzY3MjU5fQ.WmJHIJvXJ5WPNJbMJqhVJ6TFU9KIjuBF5jgUfAHOhBI';

const connectionString = `postgresql://postgres.dwrpznnbcqrmgoqdnqpo:${process.env.SUPABASE_DB_PASSWORD || 'VapeCave2024!'}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Also export Supabase client for direct operations if needed
export const supabase = createClient(supabaseUrl, supabaseKey);
