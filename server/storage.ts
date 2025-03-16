import { 
  users, type User, type InsertUser,
  brands, type Brand, type InsertBrand, 
  brandCategories, type BrandCategory, type InsertBrandCategory
} from "@shared/schema";
import { eq, and, asc } from "drizzle-orm";
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
}

// Fallback to MemStorage if database connection fails
export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private brandCategoriesMap: Map<number, BrandCategory>;
  private brandsMap: Map<number, Brand>;
  
  private userCurrentId: number;
  private categoryCurrentId: number;
  private brandCurrentId: number;

  constructor() {
    this.usersMap = new Map();
    this.brandCategoriesMap = new Map();
    this.brandsMap = new Map();
    
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.brandCurrentId = 1;
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
