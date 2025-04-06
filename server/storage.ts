import { 
  users, type User, type InsertUser,
  brands, type Brand, type InsertBrand, 
  brandCategories, type BrandCategory, type InsertBrandCategory,
  blogPosts, type BlogPost, type InsertBlogPost,
  storeLocations, type StoreLocation, type InsertStoreLocation,
  products, type Product, type InsertProduct,
  productCategories, type ProductCategory, type InsertProductCategory,
  newsletterSubscriptions, type NewsletterSubscription, type InsertNewsletterSubscription
} from "@shared/schema";
import { eq, and, asc, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

// Create a PostgreSQL connection pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize drizzle with the pool
const db = drizzle(pool);

// Storage interface defining all database operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(username: string, password: string): Promise<User | null>;

  // Brand category operations
  getAllBrandCategories(): Promise<BrandCategory[]>;
  getBrandCategory(id: number): Promise<BrandCategory | undefined>;
  createBrandCategory(category: InsertBrandCategory): Promise<BrandCategory>;
  updateBrandCategory(id: number, category: Partial<InsertBrandCategory>): Promise<BrandCategory | undefined>;
  deleteBrandCategory(id: number): Promise<boolean>;

  // Brand operations
  getAllBrands(): Promise<Brand[]>;
  getBrandsByCategory(categoryId: number): Promise<Brand[]>;
  getBrand(id: number): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: number, brand: Partial<InsertBrand>): Promise<Brand | undefined>;
  deleteBrand(id: number): Promise<boolean>;
  
  // Blog post operations (uncategorized)
  getAllBlogPosts(includeUnpublished?: boolean): Promise<BlogPost[]>;
  getFeaturedBlogPosts(limit?: number): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  incrementBlogPostViewCount(id: number): Promise<void>;

  // Store location operations
  getAllStoreLocations(): Promise<StoreLocation[]>;
  getStoreLocation(id: number): Promise<StoreLocation | undefined>;
  getStoreLocationByCity(city: string): Promise<StoreLocation | undefined>;
  createStoreLocation(location: InsertStoreLocation): Promise<StoreLocation>;
  updateStoreLocation(id: number, location: Partial<InsertStoreLocation>): Promise<StoreLocation | undefined>;
  deleteStoreLocation(id: number): Promise<boolean>;
  
  // Product category operations
  getAllProductCategories(): Promise<ProductCategory[]>;
  getProductCategory(id: number): Promise<ProductCategory | undefined>;
  getProductCategoryBySlug(slug: string): Promise<ProductCategory | undefined>;
  createProductCategory(category: InsertProductCategory): Promise<ProductCategory>;
  updateProductCategory(id: number, category: Partial<InsertProductCategory>): Promise<ProductCategory | undefined>;
  deleteProductCategory(id: number): Promise<boolean>;
  
  // Product operations
  getAllProducts(): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Newsletter subscription operations
  getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;
  getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined>;
  createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
  updateNewsletterSubscription(id: number, subscription: Partial<InsertNewsletterSubscription>): Promise<NewsletterSubscription | undefined>;
  toggleNewsletterSubscriptionStatus(id: number, isActive: boolean): Promise<NewsletterSubscription | undefined>;
  deleteNewsletterSubscription(id: number): Promise<boolean>;
}

// Database implementation of the storage interface
export class DbStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    const result = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword
    }).returning();
    
    return result[0];
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    
    if (!user) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }
    
    return user;
  }

  // Brand category operations
  async getAllBrandCategories(): Promise<BrandCategory[]> {
    return db.select().from(brandCategories).orderBy(asc(brandCategories.displayOrder));
  }

  async getBrandCategory(id: number): Promise<BrandCategory | undefined> {
    const result = await db.select().from(brandCategories).where(eq(brandCategories.id, id));
    return result[0];
  }

  async createBrandCategory(category: InsertBrandCategory): Promise<BrandCategory> {
    const result = await db.insert(brandCategories).values(category).returning();
    return result[0];
  }

  async updateBrandCategory(id: number, category: Partial<InsertBrandCategory>): Promise<BrandCategory | undefined> {
    const result = await db
      .update(brandCategories)
      .set(category)
      .where(eq(brandCategories.id, id))
      .returning();
    
    return result[0];
  }

  async deleteBrandCategory(id: number): Promise<boolean> {
    const result = await db
      .delete(brandCategories)
      .where(eq(brandCategories.id, id))
      .returning();
    
    return result.length > 0;
  }

  // Brand operations
  async getAllBrands(): Promise<Brand[]> {
    // Select only existing columns from the database
    const rows = await db.select({
      id: brands.id,
      categoryId: brands.categoryId,
      name: brands.name,
      image: brands.image,
      description: brands.description,
      displayOrder: brands.displayOrder,
    })
    .from(brands)
    .orderBy(asc(brands.displayOrder));
    
    // Add the imageSize field with a default value
    return rows.map(row => {
      const brandWithSize = row as Brand;
      brandWithSize.imageSize = "medium";
      return brandWithSize;
    });
  }

  async getBrandsByCategory(categoryId: number): Promise<Brand[]> {
    // Select only existing columns from the database
    const rows = await db
      .select({
        id: brands.id,
        categoryId: brands.categoryId,
        name: brands.name,
        image: brands.image,
        description: brands.description,
        displayOrder: brands.displayOrder,
      })
      .from(brands)
      .where(eq(brands.categoryId, categoryId))
      .orderBy(asc(brands.displayOrder));
    
    // Add the imageSize field with a default value
    return rows.map(row => {
      const brandWithSize = row as Brand;
      brandWithSize.imageSize = "medium";
      return brandWithSize;
    });
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    // Select only existing columns from the database
    const result = await db
      .select({
        id: brands.id,
        categoryId: brands.categoryId,
        name: brands.name,
        image: brands.image,
        description: brands.description,
        displayOrder: brands.displayOrder,
      })
      .from(brands)
      .where(eq(brands.id, id));
    
    if (result.length === 0) {
      return undefined;
    }
    
    // Add imageSize field with default value
    const brandWithSize = result[0] as Brand;
    brandWithSize.imageSize = "medium";
    return brandWithSize;
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    // Extract imageSize from the input but don't include it in DB operation
    const { imageSize, ...dbFields } = brand;
    
    // Insert the brand without the imageSize field
    const result = await db
      .insert(brands)
      .values({
        categoryId: dbFields.categoryId,
        name: dbFields.name,
        image: dbFields.image,
        description: dbFields.description,
        displayOrder: dbFields.displayOrder || 0
      })
      .returning({
        id: brands.id,
        categoryId: brands.categoryId,
        name: brands.name,
        image: brands.image,
        description: brands.description,
        displayOrder: brands.displayOrder
      });
    
    // Return the result with the imageSize field added
    const brandWithSize = result[0] as Brand;
    brandWithSize.imageSize = imageSize || "medium";
    return brandWithSize;
  }

  async updateBrand(id: number, brand: Partial<InsertBrand>): Promise<Brand | undefined> {
    // Extract imageSize from the input but don't include it in DB operation
    const { imageSize, ...updateProps } = brand;
    
    // Create a new object with just the fields we need to update
    const updateFields: {
      categoryId?: number;
      name?: string;
      image?: string;
      description?: string;
      displayOrder?: number;
    } = {};
    
    // Only add fields that are defined
    if (updateProps.categoryId !== undefined) updateFields.categoryId = updateProps.categoryId;
    if (updateProps.name !== undefined) updateFields.name = updateProps.name;
    if (updateProps.image !== undefined) updateFields.image = updateProps.image;
    if (updateProps.description !== undefined) updateFields.description = updateProps.description;
    if (updateProps.displayOrder !== undefined) {
      // Handle the null vs undefined case - convert null to undefined
      updateFields.displayOrder = updateProps.displayOrder === null ? undefined : updateProps.displayOrder;
    }
    
    // Only include fields that are actually in the database
    const result = await db
      .update(brands)
      .set(updateFields)
      .where(eq(brands.id, id))
      .returning({
        id: brands.id,
        categoryId: brands.categoryId,
        name: brands.name,
        image: brands.image,
        description: brands.description,
        displayOrder: brands.displayOrder,
      });
    
    if (result.length === 0) {
      return undefined;
    }
    
    // Return the result with the imageSize field added
    const brandWithSize = result[0] as Brand;
    brandWithSize.imageSize = imageSize || "medium";
    return brandWithSize;
  }

  async deleteBrand(id: number): Promise<boolean> {
    const result = await db
      .delete(brands)
      .where(eq(brands.id, id))
      .returning();
    
    return result.length > 0;
  }
  
  // Blog category operations have been removed

  // Blog post operations
  async getAllBlogPosts(includeUnpublished: boolean = false): Promise<BlogPost[]> {
    if (includeUnpublished) {
      return db.select().from(blogPosts).orderBy(desc(blogPosts.created_at));
    } else {
      return db.select()
        .from(blogPosts)
        .where(eq(blogPosts.is_published, true))
        .orderBy(desc(blogPosts.created_at));
    }
  }

  async getFeaturedBlogPosts(limit: number = 5): Promise<BlogPost[]> {
    return db
      .select()
      .from(blogPosts)
      .where(and(
        eq(blogPosts.is_featured, true),
        eq(blogPosts.is_published, true)
      ))
      .orderBy(desc(blogPosts.created_at))
      .limit(limit);
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return result[0];
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return result[0];
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values(post).returning();
    return result[0];
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    // Create a clean update object with only fields that exist in the schema
    const updateData: Partial<Omit<BlogPost, 'id'>> = {};
    
    // Explicitly map allowed fields from post to updateData using snake_case property names
    if (post.title !== undefined) updateData.title = post.title;
    if (post.slug !== undefined) updateData.slug = post.slug;
    if (post.summary !== undefined) updateData.summary = post.summary;
    if (post.content !== undefined) updateData.content = post.content;
    if (post.featured_image !== undefined) updateData.featured_image = post.featured_image;
    if (post.meta_title !== undefined) updateData.meta_title = post.meta_title;
    if (post.meta_description !== undefined) updateData.meta_description = post.meta_description;
    if (post.is_featured !== undefined) updateData.is_featured = post.is_featured;
    if (post.is_published !== undefined) updateData.is_published = post.is_published;
    
    // Always update the updated_at field
    updateData.updated_at = new Date();
    
    const result = await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();
    
    return result[0];
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning();
    
    return result.length > 0;
  }
  
  async incrementBlogPostViewCount(id: number): Promise<void> {
    await db
      .update(blogPosts)
      .set({
        view_count: sql`${blogPosts.view_count} + 1`
      })
      .where(eq(blogPosts.id, id));
  }

  // Store location operations
  async getAllStoreLocations(): Promise<StoreLocation[]> {
    return db.select().from(storeLocations);
  }

  async getStoreLocation(id: number): Promise<StoreLocation | undefined> {
    const result = await db.select().from(storeLocations).where(eq(storeLocations.id, id));
    return result[0];
  }

  async getStoreLocationByCity(city: string): Promise<StoreLocation | undefined> {
    const result = await db.select().from(storeLocations).where(eq(storeLocations.city, city));
    return result[0];
  }

  async createStoreLocation(location: InsertStoreLocation): Promise<StoreLocation> {
    const result = await db.insert(storeLocations).values(location).returning();
    return result[0];
  }

  async updateStoreLocation(id: number, location: Partial<InsertStoreLocation>): Promise<StoreLocation | undefined> {
    // Create a clean update object
    const updateData: Partial<Omit<StoreLocation, 'id'>> = {};
    
    // Map fields to the update data object
    Object.keys(location).forEach(key => {
      if (location[key as keyof InsertStoreLocation] !== undefined) {
        updateData[key as keyof Omit<StoreLocation, 'id'>] = location[key as keyof InsertStoreLocation];
      }
    });
    
    // Always update the updated_at field
    updateData.updated_at = new Date();
    
    const result = await db
      .update(storeLocations)
      .set(updateData)
      .where(eq(storeLocations.id, id))
      .returning();
    
    return result[0];
  }

  async deleteStoreLocation(id: number): Promise<boolean> {
    const result = await db
      .delete(storeLocations)
      .where(eq(storeLocations.id, id))
      .returning();
    
    return result.length > 0;
  }
  
  // Product category operations
  async getAllProductCategories(): Promise<ProductCategory[]> {
    return db.select().from(productCategories).orderBy(asc(productCategories.display_order));
  }
  
  async getProductCategory(id: number): Promise<ProductCategory | undefined> {
    const result = await db.select().from(productCategories).where(eq(productCategories.id, id));
    return result[0];
  }
  
  async getProductCategoryBySlug(slug: string): Promise<ProductCategory | undefined> {
    const result = await db.select().from(productCategories).where(eq(productCategories.slug, slug));
    return result[0];
  }
  
  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    const result = await db.insert(productCategories).values(category).returning();
    return result[0];
  }
  
  async updateProductCategory(id: number, category: Partial<InsertProductCategory>): Promise<ProductCategory | undefined> {
    // Create a clean update object
    const updateData: Partial<Omit<ProductCategory, 'id'>> = {};
    
    // Map fields from category to updateData
    if (category.name !== undefined) updateData.name = category.name;
    if (category.slug !== undefined) updateData.slug = category.slug;
    if (category.description !== undefined) updateData.description = category.description;
    if (category.display_order !== undefined) updateData.display_order = category.display_order;
    
    // Always update the updated_at field
    updateData.updated_at = new Date();
    
    const result = await db
      .update(productCategories)
      .set(updateData)
      .where(eq(productCategories.id, id))
      .returning();
    
    return result[0];
  }
  
  async deleteProductCategory(id: number): Promise<boolean> {
    const result = await db
      .delete(productCategories)
      .where(eq(productCategories.id, id))
      .returning();
    
    return result.length > 0;
  }
  
  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return db.select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      hidePrice: products.hidePrice,
      image: products.image,
      category: products.category,
      categoryId: products.categoryId,
      featured: products.featured,
      featuredLabel: products.featuredLabel,
      stock: products.stock,
      created_at: products.created_at,
      updated_at: products.updated_at
    }).from(products).orderBy(asc(products.name));
  }
  
  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    return db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        hidePrice: products.hidePrice,
        image: products.image,
        category: products.category,
        categoryId: products.categoryId,
        featured: products.featured,
        featuredLabel: products.featuredLabel,
        stock: products.stock,
        created_at: products.created_at,
        updated_at: products.updated_at
      })
      .from(products)
      .where(eq(products.featured, true))
      .orderBy(asc(products.name))
      .limit(limit);
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    // First check if the category input is actually a numeric ID
    const categoryId = !isNaN(parseInt(category)) ? parseInt(category) : null;
    
    if (categoryId) {
      // If it's a valid category ID, filter by categoryId
      return db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          hidePrice: products.hidePrice,
          image: products.image,
          category: products.category,
          categoryId: products.categoryId,
          featured: products.featured,
          featuredLabel: products.featuredLabel,
          stock: products.stock,
          created_at: products.created_at,
          updated_at: products.updated_at
        })
        .from(products)
        .where(eq(products.categoryId, categoryId))
        .orderBy(asc(products.name));
    } else {
      // Otherwise filter by category slug
      return db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          hidePrice: products.hidePrice,
          image: products.image,
          category: products.category,
          categoryId: products.categoryId,
          featured: products.featured,
          featuredLabel: products.featuredLabel,
          stock: products.stock,
          created_at: products.created_at,
          updated_at: products.updated_at
        })
        .from(products)
        .where(eq(products.category, category))
        .orderBy(asc(products.name));
    }
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db.select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      hidePrice: products.hidePrice,
      image: products.image,
      category: products.category,
      categoryId: products.categoryId,
      featured: products.featured,
      featuredLabel: products.featuredLabel,
      stock: products.stock,
      created_at: products.created_at,
      updated_at: products.updated_at
    }).from(products).where(eq(products.id, id));
    return result[0];
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    // Create a product object with all fields from the form
    const productData: any = { ...product };
    
    // If no category ID provided but we have a category slug, try to find the category ID
    if (!productData.categoryId && productData.category) {
      try {
        const category = await this.getProductCategoryBySlug(productData.category);
        if (category) {
          productData.categoryId = category.id;
        }
      } catch (error) {
        console.error("Error finding category ID for slug:", error);
      }
    }
    
    const result = await db.insert(products).values(productData).returning();
    return result[0];
  }
  
  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    // Create a clean update object
    const updateData: Partial<Omit<Product, 'id'>> = {};
    
    // Make a copy of the product data
    const productData = { ...product };
    
    // If category has changed, try to update categoryId to match
    if (productData.category && !productData.categoryId) {
      try {
        const category = await this.getProductCategoryBySlug(productData.category);
        if (category) {
          productData.categoryId = category.id;
        }
      } catch (error) {
        console.error("Error finding category ID for slug:", error);
      }
    }
    
    // Map fields to the update data object
    Object.keys(productData).forEach(key => {
      if (productData[key as keyof InsertProduct] !== undefined) {
        updateData[key as keyof Omit<Product, 'id'>] = productData[key as keyof InsertProduct];
      }
    });
    
    // Always update the updated_at field
    updateData.updated_at = new Date();
    
    const result = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    
    return result[0];
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    
    return result.length > 0;
  }
  
  // Newsletter subscription operations
  async getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return db.select().from(newsletterSubscriptions).orderBy(desc(newsletterSubscriptions.subscribed_at));
  }
  
  async getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined> {
    const result = await db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.email, email));
    return result[0];
  }
  
  async createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    // Check if the email already exists
    const existing = await this.getNewsletterSubscriptionByEmail(subscription.email);
    
    if (existing) {
      // If it exists but is inactive, reactivate it
      if (!existing.is_active) {
        const updated = await this.toggleNewsletterSubscriptionStatus(existing.id, true);
        if (updated) {
          return updated;
        }
      }
      // Otherwise just return the existing one
      return existing;
    }
    
    // Create new subscription if it doesn't exist
    const result = await db.insert(newsletterSubscriptions).values({
      ...subscription,
      subscribed_at: new Date(),
      last_updated: new Date()
    }).returning();
    
    return result[0];
  }
  
  async updateNewsletterSubscription(id: number, subscription: Partial<InsertNewsletterSubscription>): Promise<NewsletterSubscription | undefined> {
    // Create update data object
    const updateData: Partial<NewsletterSubscription> = {
      ...subscription,
      last_updated: new Date()
    };
    
    const result = await db
      .update(newsletterSubscriptions)
      .set(updateData)
      .where(eq(newsletterSubscriptions.id, id))
      .returning();
    
    return result[0];
  }
  
  async toggleNewsletterSubscriptionStatus(id: number, isActive: boolean): Promise<NewsletterSubscription | undefined> {
    const result = await db
      .update(newsletterSubscriptions)
      .set({ 
        is_active: isActive,
        last_updated: new Date()
      })
      .where(eq(newsletterSubscriptions.id, id))
      .returning();
    
    return result[0];
  }
  
  async deleteNewsletterSubscription(id: number): Promise<boolean> {
    const result = await db
      .delete(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.id, id))
      .returning();
    
    return result.length > 0;
  }
}

// Fallback to MemStorage if database connection fails
export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private brandCategoriesMap: Map<number, BrandCategory>;
  private brandsMap: Map<number, Brand>;
  private blogPostsMap: Map<number, BlogPost>;
  private storeLocationsMap: Map<number, StoreLocation>;
  private productCategoriesMap: Map<number, ProductCategory>;
  private productsMap: Map<number, Product>;
  private newsletterSubscriptionsMap: Map<number, NewsletterSubscription>;
  
  private userCurrentId: number;
  private categoryCurrentId: number;
  private brandCurrentId: number;
  private blogPostCurrentId: number;
  private storeLocationCurrentId: number;
  private productCategoryCurrentId: number;
  private productCurrentId: number;
  private newsletterSubscriptionCurrentId: number;

  constructor() {
    this.usersMap = new Map();
    this.brandCategoriesMap = new Map();
    this.brandsMap = new Map();
    this.blogPostsMap = new Map();
    this.storeLocationsMap = new Map();
    this.productCategoriesMap = new Map();
    this.productsMap = new Map();
    this.newsletterSubscriptionsMap = new Map();
    
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.brandCurrentId = 1;
    this.blogPostCurrentId = 1;
    this.storeLocationCurrentId = 1;
    this.productCategoryCurrentId = 1;
    this.productCurrentId = 1;
    this.newsletterSubscriptionCurrentId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    
    // For memory storage, we'll hash the password too
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    const user: User = { 
      ...insertUser, 
      id, 
      password: hashedPassword,
      isAdmin: insertUser.isAdmin || false
    };
    
    this.usersMap.set(id, user);
    return user;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    
    if (!user) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }
    
    return user;
  }

  // Brand category operations
  async getAllBrandCategories(): Promise<BrandCategory[]> {
    return Array.from(this.brandCategoriesMap.values())
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getBrandCategory(id: number): Promise<BrandCategory | undefined> {
    return this.brandCategoriesMap.get(id);
  }

  async createBrandCategory(category: InsertBrandCategory): Promise<BrandCategory> {
    const id = this.categoryCurrentId++;
    const newCategory: BrandCategory = { 
      ...category, 
      id,
      bgClass: category.bgClass ?? "bg-gradient-to-br from-gray-900 to-gray-800",
      displayOrder: category.displayOrder ?? 0,
      intervalMs: category.intervalMs ?? 5000
    };
    this.brandCategoriesMap.set(id, newCategory);
    return newCategory;
  }

  async updateBrandCategory(id: number, category: Partial<InsertBrandCategory>): Promise<BrandCategory | undefined> {
    const existingCategory = this.brandCategoriesMap.get(id);
    
    if (!existingCategory) {
      return undefined;
    }
    
    const updatedCategory: BrandCategory = { ...existingCategory, ...category };
    this.brandCategoriesMap.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteBrandCategory(id: number): Promise<boolean> {
    return this.brandCategoriesMap.delete(id);
  }

  // Brand operations
  async getAllBrands(): Promise<Brand[]> {
    return Array.from(this.brandsMap.values())
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getBrandsByCategory(categoryId: number): Promise<Brand[]> {
    return Array.from(this.brandsMap.values())
      .filter(brand => brand.categoryId === categoryId)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    return this.brandsMap.get(id);
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const id = this.brandCurrentId++;
    const newBrand: Brand = { 
      ...brand, 
      id,
      displayOrder: brand.displayOrder ?? 0,
      imageSize: brand.imageSize ?? "medium"
    };
    this.brandsMap.set(id, newBrand);
    return newBrand;
  }

  async updateBrand(id: number, brand: Partial<InsertBrand>): Promise<Brand | undefined> {
    const existingBrand = this.brandsMap.get(id);
    
    if (!existingBrand) {
      return undefined;
    }
    
    const updatedBrand: Brand = { ...existingBrand, ...brand };
    this.brandsMap.set(id, updatedBrand);
    return updatedBrand;
  }

  async deleteBrand(id: number): Promise<boolean> {
    return this.brandsMap.delete(id);
  }
  
  // Blog category operations have been removed

  // Blog post operations
  async getAllBlogPosts(includeUnpublished: boolean = false): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPostsMap.values());
    
    if (!includeUnpublished) {
      posts = posts.filter(post => post.is_published);
    }
    
    return posts.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA; // Sort by most recent first
    });
  }

  async getFeaturedBlogPosts(limit: number = 5): Promise<BlogPost[]> {
    const posts = Array.from(this.blogPostsMap.values())
      .filter(post => post.is_featured && post.is_published)
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA; // Sort by most recent first
      });
    
    return posts.slice(0, limit);
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPostsMap.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPostsMap.values()).find(
      (post) => post.slug === slug
    );
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostCurrentId++;
    const now = new Date();
    
    // Create a properly typed BlogPost with all required fields
    const newPost: BlogPost = {
      id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      featured_image: post.featured_image || null,
      is_featured: post.is_featured || false,
      is_published: post.is_published || true,
      meta_title: post.meta_title || null,
      meta_description: post.meta_description || null,
      view_count: 0,
      created_at: now,
      updated_at: now
    };
    
    this.blogPostsMap.set(id, newPost);
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existingPost = this.blogPostsMap.get(id);
    
    if (!existingPost) {
      return undefined;
    }
    
    // Create a properly typed updated post
    const updatedPost: BlogPost = { ...existingPost };
    
    // Explicitly update only the fields that are provided
    if (post.title !== undefined) updatedPost.title = post.title;
    if (post.slug !== undefined) updatedPost.slug = post.slug;
    if (post.summary !== undefined) updatedPost.summary = post.summary;
    if (post.content !== undefined) updatedPost.content = post.content;
    if (post.featured_image !== undefined) updatedPost.featured_image = post.featured_image;
    if (post.meta_title !== undefined) updatedPost.meta_title = post.meta_title;
    if (post.meta_description !== undefined) updatedPost.meta_description = post.meta_description;
    if (post.is_featured !== undefined) updatedPost.is_featured = post.is_featured;
    if (post.is_published !== undefined) updatedPost.is_published = post.is_published;
    
    // Always update the updated_at timestamp
    updatedPost.updated_at = new Date();
    
    this.blogPostsMap.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPostsMap.delete(id);
  }
  
  async incrementBlogPostViewCount(id: number): Promise<void> {
    const post = this.blogPostsMap.get(id);
    
    if (post) {
      post.view_count = (post.view_count || 0) + 1;
      this.blogPostsMap.set(id, post);
    }
  }

  // Store location operations
  async getAllStoreLocations(): Promise<StoreLocation[]> {
    return Array.from(this.storeLocationsMap.values());
  }

  async getStoreLocation(id: number): Promise<StoreLocation | undefined> {
    return this.storeLocationsMap.get(id);
  }

  async getStoreLocationByCity(city: string): Promise<StoreLocation | undefined> {
    return Array.from(this.storeLocationsMap.values()).find(
      (location) => location.city.toLowerCase() === city.toLowerCase()
    );
  }

  async createStoreLocation(location: InsertStoreLocation): Promise<StoreLocation> {
    const id = this.storeLocationCurrentId++;
    const now = new Date();
    
    const newLocation: StoreLocation = {
      ...location,
      id,
      created_at: now,
      updated_at: now
    };
    
    this.storeLocationsMap.set(id, newLocation);
    return newLocation;
  }

  async updateStoreLocation(id: number, location: Partial<InsertStoreLocation>): Promise<StoreLocation | undefined> {
    const existingLocation = this.storeLocationsMap.get(id);
    
    if (!existingLocation) {
      return undefined;
    }
    
    // Create an updated store location object
    const updatedLocation: StoreLocation = { 
      ...existingLocation,
      ...location,
      updated_at: new Date()
    };
    
    this.storeLocationsMap.set(id, updatedLocation);
    return updatedLocation;
  }

  async deleteStoreLocation(id: number): Promise<boolean> {
    return this.storeLocationsMap.delete(id);
  }
  
  // Product category operations
  async getAllProductCategories(): Promise<ProductCategory[]> {
    return Array.from(this.productCategoriesMap.values())
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }
  
  async getProductCategory(id: number): Promise<ProductCategory | undefined> {
    return this.productCategoriesMap.get(id);
  }
  
  async getProductCategoryBySlug(slug: string): Promise<ProductCategory | undefined> {
    return Array.from(this.productCategoriesMap.values()).find(
      (category) => category.slug === slug
    );
  }
  
  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    const id = this.productCategoryCurrentId++;
    const now = new Date();
    
    const newCategory: ProductCategory = {
      ...category,
      id,
      created_at: now,
      updated_at: now
    };
    
    this.productCategoriesMap.set(id, newCategory);
    return newCategory;
  }
  
  async updateProductCategory(id: number, category: Partial<InsertProductCategory>): Promise<ProductCategory | undefined> {
    const existingCategory = this.productCategoriesMap.get(id);
    
    if (!existingCategory) {
      return undefined;
    }
    
    // Create a properly typed updated category
    const updatedCategory: ProductCategory = { 
      ...existingCategory,
      ...category,
      updated_at: new Date()
    };
    
    this.productCategoriesMap.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteProductCategory(id: number): Promise<boolean> {
    return this.productCategoriesMap.delete(id);
  }
  
  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.productsMap.values());
  }
  
  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    const products = Array.from(this.productsMap.values())
      .filter(product => product.featured)
      .sort((a, b) => a.name.localeCompare(b.name));
    
    return products.slice(0, limit);
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    // First check if the category input is actually a numeric ID
    const categoryId = !isNaN(parseInt(category)) ? parseInt(category) : null;
    
    if (categoryId) {
      // If it's a valid category ID, filter by categoryId
      return Array.from(this.productsMap.values())
        .filter(product => product.categoryId === categoryId)
        .sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Otherwise filter by category slug
      return Array.from(this.productsMap.values())
        .filter(product => product.category === category)
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.productsMap.get(id);
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productCurrentId++;
    const now = new Date();
    
    // Create a product object with all fields from the form
    const productData: any = { ...product };
    
    // If no category ID provided but we have a category slug, try to find the category ID
    if (!productData.categoryId && productData.category) {
      try {
        const category = await this.getProductCategoryBySlug(productData.category);
        if (category) {
          productData.categoryId = category.id;
        }
      } catch (error) {
        console.error("Error finding category ID for slug:", error);
      }
    }
    
    const newProduct: Product = {
      ...productData,
      id,
      created_at: now,
      updated_at: now
    };
    
    this.productsMap.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.productsMap.get(id);
    
    if (!existingProduct) {
      return undefined;
    }
    
    // Make a copy of the product data
    const productData = { ...product };
    
    // If category has changed, try to update categoryId to match
    if (productData.category && !productData.categoryId) {
      try {
        const category = await this.getProductCategoryBySlug(productData.category);
        if (category) {
          productData.categoryId = category.id;
        }
      } catch (error) {
        console.error("Error finding category ID for slug:", error);
      }
    }
    
    const updatedProduct: Product = {
      ...existingProduct,
      ...productData,
      updated_at: new Date()
    };
    
    this.productsMap.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.productsMap.delete(id);
  }
  
  // Newsletter subscription operations
  async getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return Array.from(this.newsletterSubscriptionsMap.values())
      .sort((a, b) => {
        const dateA = a.subscribed_at ? new Date(a.subscribed_at).getTime() : 0;
        const dateB = b.subscribed_at ? new Date(b.subscribed_at).getTime() : 0;
        return dateB - dateA; // Sort by most recent first
      });
  }
  
  async getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined> {
    return Array.from(this.newsletterSubscriptionsMap.values()).find(
      (subscription) => subscription.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    // Check if the email already exists
    const existing = await this.getNewsletterSubscriptionByEmail(subscription.email);
    
    if (existing) {
      // If it exists but is inactive, reactivate it
      if (!existing.is_active) {
        const updated = await this.toggleNewsletterSubscriptionStatus(existing.id, true);
        if (updated) {
          return updated;
        }
      }
      // Otherwise just return the existing one
      return existing;
    }
    
    const id = this.newsletterSubscriptionCurrentId++;
    const now = new Date();
    
    const newSubscription: NewsletterSubscription = {
      id,
      email: subscription.email,
      source: subscription.source || "website",
      ip_address: subscription.ip_address || "",
      subscribed_at: now,
      is_active: true,
      last_updated: now
    };
    
    this.newsletterSubscriptionsMap.set(id, newSubscription);
    return newSubscription;
  }
  
  async updateNewsletterSubscription(id: number, subscription: Partial<InsertNewsletterSubscription>): Promise<NewsletterSubscription | undefined> {
    const existingSubscription = this.newsletterSubscriptionsMap.get(id);
    
    if (!existingSubscription) {
      return undefined;
    }
    
    const updatedSubscription: NewsletterSubscription = {
      ...existingSubscription,
      ...subscription,
      last_updated: new Date()
    };
    
    this.newsletterSubscriptionsMap.set(id, updatedSubscription);
    return updatedSubscription;
  }
  
  async toggleNewsletterSubscriptionStatus(id: number, isActive: boolean): Promise<NewsletterSubscription | undefined> {
    const subscription = this.newsletterSubscriptionsMap.get(id);
    
    if (!subscription) {
      return undefined;
    }
    
    const updatedSubscription: NewsletterSubscription = {
      ...subscription,
      is_active: isActive,
      last_updated: new Date()
    };
    
    this.newsletterSubscriptionsMap.set(id, updatedSubscription);
    return updatedSubscription;
  }
  
  async deleteNewsletterSubscription(id: number): Promise<boolean> {
    return this.newsletterSubscriptionsMap.delete(id);
  }
}

// Try to use the database implementation, fall back to memory if it fails
let storage: IStorage;

try {
  storage = new DbStorage();
  console.log("Using database storage");
} catch (error) {
  console.error("Failed to initialize database storage, falling back to memory storage", error);
  storage = new MemStorage();
}

export { storage };
