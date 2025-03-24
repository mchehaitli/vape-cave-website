import { pgTable, text, serial, integer, boolean, varchar, timestamp, json, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User authentication table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

// Brand categories table
export const brandCategories = pgTable("brand_categories", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  bgClass: text("bg_class").default("bg-gradient-to-br from-gray-900 to-gray-800"),
  displayOrder: integer("display_order").default(0),
  intervalMs: integer("interval_ms").default(5000),
});

export const insertBrandCategorySchema = createInsertSchema(brandCategories).pick({
  category: true,
  bgClass: true,
  displayOrder: true,
  intervalMs: true,
});

// Brands table
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  displayOrder: integer("display_order").default(0),
  // Note: imageSize field is handled in memory only
});

// Add imageSize to the insert schema even though it's not in the database
// We'll handle it in memory in the storage implementation
export const insertBrandSchema = createInsertSchema(brands)
  .pick({
    categoryId: true,
    name: true,
    image: true,
    description: true,
    displayOrder: true,
  })
  .extend({
    imageSize: z.string().optional(),
  });

// Define session table
export const sessions = pgTable("sessions", {
  sid: varchar("sid", { length: 255 }).primaryKey(),
  sess: text("sess").notNull(),
  expire: integer("expire").notNull(),
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBrandCategory = z.infer<typeof insertBrandCategorySchema>;
export type BrandCategory = typeof brandCategories.$inferSelect;

export type InsertBrand = z.infer<typeof insertBrandSchema>;
// Extend the Brand type to include imageSize which is handled in memory
export type Brand = typeof brands.$inferSelect & {
  imageSize?: string;
};

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  featured_image: text("featured_image").default(""),
  is_published: boolean("is_published").default(true),
  is_featured: boolean("is_featured").default(false),
  meta_title: text("meta_title").default(""),
  meta_description: text("meta_description").default(""),
  view_count: integer("view_count").default(0),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  summary: true,
  content: true,
  featured_image: true,
  is_published: true,
  is_featured: true,
  meta_title: true,
  meta_description: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Store locations table
export const storeLocations = pgTable("store_locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  full_address: text("full_address").notNull(),
  phone: text("phone").notNull(),
  hours: text("hours").notNull(),
  closed_days: text("closed_days").default(""),
  image: text("image").notNull(),
  lat: text("lat").notNull(),
  lng: text("lng").notNull(),
  google_place_id: text("google_place_id").default(""),
  apple_maps_link: text("apple_maps_link").default(""),
  map_embed: text("map_embed").notNull(),
  email: text("email").default(""),
  store_code: text("store_code").default(""),
  opening_hours: json("opening_hours").notNull().$type<Record<string, string>>(),
  services: json("services").notNull().$type<string[]>(),
  accepted_payments: json("accepted_payments").notNull().$type<string[]>(),
  area_served: json("area_served").notNull().$type<string[]>(),
  public_transit: text("public_transit").default(""),
  parking: text("parking").default(""),
  year_established: integer("year_established").notNull(),
  price_range: text("price_range").notNull(),
  social_profiles: json("social_profiles").$type<{
    facebook?: string;
    instagram?: string;
    twitter?: string;
    yelp?: string;
  }>(),
  description: text("description").notNull(),
  neighborhood_info: text("neighborhood_info").default(""),
  amenities: json("amenities").notNull().$type<string[]>(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const insertStoreLocationSchema = createInsertSchema(storeLocations)
  .pick({
    name: true,
    city: true,
    address: true,
    full_address: true,
    phone: true,
    hours: true,
    closed_days: true,
    image: true,
    lat: true,
    lng: true,
    google_place_id: true,
    apple_maps_link: true,
    map_embed: true,
    email: true,
    store_code: true,
    opening_hours: true,
    services: true,
    accepted_payments: true,
    area_served: true,
    public_transit: true,
    parking: true,
    year_established: true,
    price_range: true,
    social_profiles: true,
    description: true,
    neighborhood_info: true,
    amenities: true,
  });

export type InsertStoreLocation = z.infer<typeof insertStoreLocationSchema>;
export type StoreLocation = typeof storeLocations.$inferSelect;

// Product categories table
export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").default(""),
  display_order: integer("display_order").default(0),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProductCategorySchema = createInsertSchema(productCategories).pick({
  name: true,
  slug: true,
  description: true,
  display_order: true,
});

export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;
export type ProductCategory = typeof productCategories.$inferSelect;

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price"), // Now optional
  image: text("image").notNull(),
  category: text("category").notNull(), // This is the slug of the category for backward compatibility
  categoryId: integer("category_id"), // New field to link to product_categories table
  featured: boolean("featured").default(false),
  featuredLabel: text("featured_label").default(""),
  stock: integer("stock").default(0),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(products)
  .pick({
    name: true,
    description: true,
    image: true,
    category: true,
    featured: true,
    featuredLabel: true,
    stock: true,
  })
  .extend({
    price: z.string().optional(), // Make price optional in the schema
    categoryId: z.number().optional(), // Make categoryId available for form handling
  });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
