import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dwrpznnbcqrmgoqdnqpo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cnB6bm5iY3FybWdvcWRucXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTEyNTksImV4cCI6MjA2Nzc2NzI1OX0.epxb1h8fNOaP7JVDvtlm3jjsSqHnk3piU33Gn7AUZqM';

async function fixAndRestoreData() {
  console.log('🚀 Fixing API and restoring missing data immediately...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // First, verify what's currently in Supabase
  const [categoriesCheck, brandsCheck, productsCheck] = await Promise.all([
    supabase.from('brand_categories').select('*'),
    supabase.from('brands').select('*'),
    supabase.from('products').select('*')
  ]);
  
  console.log(`Current Supabase data: ${categoriesCheck.data?.length || 0} categories, ${brandsCheck.data?.length || 0} brands, ${productsCheck.data?.length || 0} products`);
  
  // Restore categories (essential for the API to work)
  const categories = [
    {id: 1, category: 'Disposables Nicotiene', bg_class: 'bg-gradient-to-br from-indigo-900 to-indigo-800', display_order: 1, interval_ms: 5000},
    {id: 2, category: 'Delta', bg_class: 'bg-gradient-to-br from-emerald-900 to-emerald-800', display_order: 2, interval_ms: 5000},
    {id: 3, category: 'E-Liquid/Salts', bg_class: 'bg-gradient-to-br from-amber-900 to-amber-800', display_order: 3, interval_ms: 5000},
    {id: 4, category: 'Vaporizer Devices', bg_class: 'bg-gradient-to-br from-blue-900 to-blue-800', display_order: 4, interval_ms: 5000},
    {id: 5, category: 'Hookah/Shisha', bg_class: 'bg-gradient-to-br from-rose-900 to-rose-800', display_order: 5, interval_ms: 5000},
    {id: 6, category: 'Glass', bg_class: 'bg-gradient-to-br from-purple-900 to-purple-800', display_order: 6, interval_ms: 5000}
  ];
  
  // Restore products
  const products = [
    {id: 1, name: 'SMOK Novo Pro', description: 'Compact pod system with adjustable wattage and long battery life.', price: '39.99', image: 'https://scontent-dfw5-1.xx.fbcdn.net/v/t39.30808-6/432760194_946922374107813_3292714966077840449_n.jpg', category: 'devices', stock: 25, featured: false, featured_label: 'Best Seller', hide_price: true, category_id: 1},
    {id: 2, name: 'Vaporesso XROS Pro', description: 'Ultra-portable pod system with auto-draw and button activation.', price: '29.99', image: 'https://cdn-ifkap.nitrocdn.com/hhsTjqigDlYlUXhxmhMDYtFLDhEnslCn/assets/images/optimized/rev-98c3f22/vaperite.co.za/wp-content/uploads/2024/02/vaporesso-xros-pro-pod-kit-specifications.png', category: 'devices', stock: 30, featured: false, featured_label: 'New Arrival', hide_price: true, category_id: 1},
    {id: 3, name: 'Uwell – Caliburn G3 Pro Pod system', description: 'Premium pod system with adjustable airflow and MTL capabilities.', price: '44.99', image: 'https://vapejuicedepot.com/cdn/shop/articles/Press-Release--UWELL-CALIBURN-G3-PRO.png?v=1725305699', category: 'devices', stock: 15, featured: false, hide_price: true, category_id: 1},
    {id: 4, name: 'Geek Vape Aegis Legend 3', description: 'Durable and waterproof mod with fast charging and long battery life.', price: '79.99', image: 'https://www.vaporfi.com/media/catalog/product/cache/95468fde19044ff554fbc48c9cafa79c/i/c/icons_05-21-2024_vb_geekvape_aegis3_productimage.webp', category: 'devices', stock: 12, featured: false, featured_label: 'Popular', hide_price: true, category_id: 1},
    {id: 5, name: 'Naked 100 Lava Flow', description: 'Tropical blend of strawberries, pineapple, and coconut.', price: '24.99', image: 'https://images.tokopedia.net/img/cache/700/hDjmkQ/2022/12/18/1df2b318-e516-469a-a61d-d967782a6703.jpg', category: 'e-liquids', stock: 40, featured: false, featured_label: 'Fan Favorite', hide_price: true, category_id: 2},
    {id: 6, name: 'Pachamama Mint Leaf', description: 'Refreshing blend of mint and fruits for a cool vaping experience.', price: '22.99', image: 'https://cdn.vapeo24.com/4e0223a3-dbac-4328-ca0b-0e4897ba8900/md', category: 'e-liquids', stock: 35, featured: false, hide_price: true, category_id: 2},
    {id: 7, name: 'Coastal Clouds Apple Peach Strawberry', description: 'Sweet and tangy fruit blend with balanced flavors.', price: '21.99', image: 'https://westcoastvapesupply.com/cdn/shop/products/CoastalCloudsApplePeachStrawberry.jpg?v=1646219589&width=700', category: 'e-liquids', stock: 28, featured: false, hide_price: true, category_id: 2},
    {id: 11, name: '18650 Battery Charger', description: 'Smart battery charger with multiple charging slots and safety features.', price: '29.99', image: 'https://www.e-cigarettecanada.ca/wp-content/uploads/2019/05/LG-HG2-INR-18650-3000mAh-Battery-kcmark-1.jpg', category: 'accessories', stock: 15, featured: false, featured_label: 'Essential', hide_price: true, category_id: 3}
  ];
  
  console.log('📂 Restoring categories...');
  for (const category of categories) {
    const { error } = await supabase.from('brand_categories').upsert(category);
    if (error) console.error('Category error:', error.message);
    else console.log(`✅ Category: ${category.category}`);
  }
  
  console.log('📦 Restoring products...');
  for (const product of products) {
    const { error } = await supabase.from('products').upsert(product);
    if (error) console.error('Product error:', error.message);
    else console.log(`✅ Product: ${product.name}`);
  }
  
  // Final verification
  const finalCheck = await Promise.all([
    supabase.from('brand_categories').select('*'),
    supabase.from('brands').select('*'),
    supabase.from('products').select('*')
  ]);
  
  console.log(`✅ Final data count: ${finalCheck[0].data?.length || 0} categories, ${finalCheck[1].data?.length || 0} brands, ${finalCheck[2].data?.length || 0} products`);
  console.log('🎉 Data restoration completed!');
}

fixAndRestoreData();