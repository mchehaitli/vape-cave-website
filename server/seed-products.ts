import { storage } from './storage';
import { InsertProduct } from '@shared/schema';
import { products as staticProducts } from '../client/src/data/products';

/**
 * Seed script to populate the database with initial product data
 * This script takes the product data defined in client/src/data/products.ts
 * and inserts them into the database
 */
async function seedProducts() {
  console.log("Seeding products...");

  // Get all products from database first
  const existingProducts = await storage.getAllProducts();
  
  if (existingProducts.length > 0) {
    console.log(`Found ${existingProducts.length} existing products. Skipping seed.`);
    return;
  }

  // Convert the static products to the format expected by the database
  const productsToInsert: InsertProduct[] = staticProducts.map(product => ({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    image: product.image,
    category: product.category,
    featured: product.featured || false,
    featuredLabel: product.featuredLabel || ""
  }));

  // Insert products one by one
  for (const product of productsToInsert) {
    await storage.createProduct(product);
    console.log(`Inserted product: ${product.name}`);
  }

  console.log(`Seeded ${productsToInsert.length} products successfully`);
}

export { seedProducts };