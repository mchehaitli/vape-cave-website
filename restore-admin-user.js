import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const supabaseUrl = 'https://dwrpznnbcqrmgoqdnqpo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cnB6bm5iY3FybWdvcWRucXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTEyNTksImV4cCI6MjA2Nzc2NzI1OX0.epxb1h8fNOaP7JVDvtlm3jjsSqHnk3piU33Gn7AUZqM';

async function restoreAdminUser() {
  console.log('🔑 Restoring admin user to Supabase...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  const replit = postgres(process.env.DATABASE_URL);
  
  try {
    // Get admin user from Replit database
    const [adminUser] = await replit`SELECT * FROM users WHERE username = 'admin'`;
    
    if (!adminUser) {
      console.log('❌ No admin user found in Replit database');
      
      // Create a new admin user with default password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const { error } = await supabase.from('users').upsert({
        id: 1,
        username: 'admin',
        password_hash: hashedPassword,
        role: 'admin'
      });
      
      if (error) {
        console.error('Error creating admin user:', error.message);
      } else {
        console.log('✅ Created new admin user (username: admin, password: admin123)');
      }
    } else {
      console.log('👤 Found admin user, migrating to Supabase...');
      
      const { error } = await supabase.from('users').upsert({
        id: adminUser.id,
        username: adminUser.username,
        password_hash: adminUser.passwordHash,
        role: adminUser.role
      });
      
      if (error) {
        console.error('Admin user migration error:', error.message);
      } else {
        console.log('✅ Admin user successfully migrated to Supabase');
      }
    }
    
    // Verify the admin user exists in Supabase
    const { data: users, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'admin');
    
    if (checkError) {
      console.error('Verification error:', checkError.message);
    } else {
      console.log(`✅ Verification: ${users?.length || 0} admin users found in Supabase`);
    }
    
  } catch (error) {
    console.error('❌ Admin user restoration failed:', error);
  } finally {
    await replit.end();
  }
}

restoreAdminUser();