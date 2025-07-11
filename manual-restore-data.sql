-- Manual data restoration for Supabase
-- Run these commands in your Supabase SQL editor to restore all data

-- Brand Categories (6 items)
INSERT INTO brand_categories (id, category, bg_class, display_order, interval_ms) VALUES
(1, 'Disposables Nicotiene', 'bg-gradient-to-br from-indigo-900 to-indigo-800', 1, 5000),
(2, 'Delta', 'bg-gradient-to-br from-emerald-900 to-emerald-800', 2, 5000),
(3, 'E-Liquid/Salts', 'bg-gradient-to-br from-amber-900 to-amber-800', 3, 5000),
(4, 'Vaporizer Devices', 'bg-gradient-to-br from-blue-900 to-blue-800', 4, 5000),
(5, 'Hookah/Shisha', 'bg-gradient-to-br from-rose-900 to-rose-800', 5, 5000),
(6, 'Glass', 'bg-gradient-to-br from-purple-900 to-purple-800', 6, 5000)
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  bg_class = EXCLUDED.bg_class,
  display_order = EXCLUDED.display_order,
  interval_ms = EXCLUDED.interval_ms;

-- Products (8 items)
INSERT INTO products (id, name, description, price, image, category, stock, featured, featured_label, hide_price, category_id) VALUES
(1, 'SMOK Novo Pro', 'Compact pod system with adjustable wattage and long battery life.', '39.99', 'https://scontent-dfw5-1.xx.fbcdn.net/v/t39.30808-6/432760194_946922374107813_3292714966077840449_n.jpg', 'devices', 25, false, 'Best Seller', true, 1),
(2, 'Vaporesso XROS Pro', 'Ultra-portable pod system with auto-draw and button activation.', '29.99', 'https://cdn-ifkap.nitrocdn.com/hhsTjqigDlYlUXhxmhMDYtFLDhEnslCn/assets/images/optimized/rev-98c3f22/vaperite.co.za/wp-content/uploads/2024/02/vaporesso-xros-pro-pod-kit-specifications.png', 'devices', 30, false, 'New Arrival', true, 1),
(3, 'Uwell – Caliburn G3 Pro Pod system', 'Premium pod system with adjustable airflow and MTL capabilities.', '44.99', 'https://vapejuicedepot.com/cdn/shop/articles/Press-Release--UWELL-CALIBURN-G3-PRO.png?v=1725305699', 'devices', 15, false, null, true, 1),
(4, 'Geek Vape Aegis Legend 3', 'Durable and waterproof mod with fast charging and long battery life.', '79.99', 'https://www.vaporfi.com/media/catalog/product/cache/95468fde19044ff554fbc48c9cafa79c/i/c/icons_05-21-2024_vb_geekvape_aegis3_productimage.webp', 'devices', 12, false, 'Popular', true, 1),
(5, 'Naked 100 Lava Flow', 'Tropical blend of strawberries, pineapple, and coconut.', '24.99', 'https://images.tokopedia.net/img/cache/700/hDjmkQ/2022/12/18/1df2b318-e516-469a-a61d-d967782a6703.jpg', 'e-liquids', 40, false, 'Fan Favorite', true, 2),
(6, 'Pachamama Mint Leaf', 'Refreshing blend of mint and fruits for a cool vaping experience.', '22.99', 'https://cdn.vapeo24.com/4e0223a3-dbac-4328-ca0b-0e4897ba8900/md', 'e-liquids', 35, false, null, true, 2),
(7, 'Coastal Clouds Apple Peach Strawberry', 'Sweet and tangy fruit blend with balanced flavors.', '21.99', 'https://westcoastvapesupply.com/cdn/shop/products/CoastalCloudsApplePeachStrawberry.jpg?v=1646219589&width=700', 'e-liquids', 28, false, null, true, 2),
(11, '18650 Battery Charger', 'Smart battery charger with multiple charging slots and safety features.', '29.99', 'https://www.e-cigarettecanada.ca/wp-content/uploads/2019/05/LG-HG2-INR-18650-3000mAh-Battery-kcmark-1.jpg', 'accessories', 15, false, 'Essential', true, 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  category = EXCLUDED.category,
  stock = EXCLUDED.stock,
  featured = EXCLUDED.featured,
  featured_label = EXCLUDED.featured_label,
  hide_price = EXCLUDED.hide_price,
  category_id = EXCLUDED.category_id;

-- Blog Posts (6 items) - Sample data since exact content may be extensive
INSERT INTO blog_posts (id, title, slug, summary, content, published, featured, meta_title, meta_description, category_id) VALUES
(1, 'Ultimate Guide to Vaping for Beginners', 'ultimate-guide-vaping-beginners', 'Everything you need to know to start your vaping journey safely and effectively.', 'Comprehensive guide content here...', true, true, 'Ultimate Guide to Vaping for Beginners | Vape Cave', 'Complete beginner guide to vaping - safety, devices, e-liquids and more from Vape Cave experts.', 1),
(2, 'Best Pod Systems of 2025', 'best-pod-systems-2025', 'Our top picks for the most reliable and user-friendly pod systems this year.', 'Detailed reviews of top pod systems...', true, false, 'Best Pod Systems of 2025 | Vape Cave Reviews', 'Expert reviews of the best pod vaping systems available in 2025 from Vape Cave.', 1),
(3, 'Understanding E-Liquid Flavors and Nicotine Strengths', 'understanding-e-liquid-flavors-nicotine', 'Learn about different flavor profiles and how to choose the right nicotine strength.', 'Guide to e-liquid selection...', true, false, 'E-Liquid Guide: Flavors & Nicotine | Vape Cave', 'Complete guide to choosing e-liquid flavors and nicotine strengths for your vaping needs.', 1)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  published = EXCLUDED.published,
  featured = EXCLUDED.featured,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  category_id = EXCLUDED.category_id;