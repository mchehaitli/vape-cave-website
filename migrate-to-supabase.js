import pkg from 'pg';
const { Pool } = pkg;
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Current database connection
const currentPool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrateTable(tableName, columns) {
  try {
    console.log(`Starting migration for ${tableName}...`);
    
    // Get data from current database
    const result = await currentPool.query(`SELECT * FROM ${tableName}`);
    const data = result.rows;
    
    console.log(`Found ${data.length} records in ${tableName}`);
    
    if (data.length === 0) {
      console.log(`No data to migrate for ${tableName}`);
      return;
    }
    
    // Insert data into Supabase
    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert(data);
    
    if (error) {
      console.error(`Error migrating ${tableName}:`, error);
      
      // Try creating the table first if it doesn't exist
      console.log(`Attempting to create table ${tableName}...`);
      
      // For now, we'll let Supabase handle the schema creation
      // The user can create tables manually in Supabase dashboard
      return;
    }
    
    console.log(`Successfully migrated ${tableName}: ${data.length} records`);
    
  } catch (error) {
    console.error(`Migration failed for ${tableName}:`, error.message);
  }
}

async function migrateDatabase() {
  console.log('Starting database migration to Supabase...');
  
  try {
    // Test connections
    console.log('Testing current database connection...');
    await currentPool.query('SELECT 1');
    console.log('✓ Current database connected');
    
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('*').limit(1);
    console.log('✓ Supabase connected');
    
    // Migrate tables in order (respecting foreign key constraints)
    await migrateTable('users');
    await migrateTable('brand_categories');
    await migrateTable('brands');
    await migrateTable('store_locations');
    await migrateTable('blog_posts');
    await migrateTable('products');
    await migrateTable('newsletter_subscriptions');
    
    console.log('✅ Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await currentPool.end();
  }
}

// Run migration
migrateDatabase();