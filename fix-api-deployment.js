#!/usr/bin/env node

// Quick fix script to update the Netlify API function with correct column names
const fs = require('fs');
const path = require('path');

const apiFilePath = path.join(__dirname, 'netlify', 'functions', 'api.ts');

try {
  let content = fs.readFileSync(apiFilePath, 'utf8');
  
  // Fix the brand-category relationship query
  content = content.replace(
    'brand.categoryId === category.id',
    'brand.category_id === category.id'
  );
  
  fs.writeFileSync(apiFilePath, content);
  console.log('✅ Fixed API function - corrected column name from categoryId to category_id');
  
} catch (error) {
  console.error('❌ Error fixing API function:', error);
  process.exit(1);
}