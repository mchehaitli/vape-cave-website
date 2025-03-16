import { pgTable, text, serial, integer, boolean, varchar, timestamp } from "drizzle-orm/pg-core";
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

// Blog categories table
export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").default(""),
  displayOrder: integer("display_order").default(0),
});

export const insertBlogCategorySchema = createInsertSchema(blogCategories).pick({
  name: true,
  slug: true,
  description: true,
  displayOrder: true,
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image").notNull(),
  authorId: integer("author_id").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  metaTitle: text("meta_title").default(""),
  metaDescription: text("meta_description").default(""),
  isFeatured: boolean("is_featured").default(false),
  isPublished: boolean("is_published").default(true),
  viewCount: integer("view_count").default(0),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  categoryId: true,
  title: true,
  slug: true,
  summary: true,
  content: true,
  featuredImage: true,
  authorId: true,
  metaTitle: true,
  metaDescription: true,
  isFeatured: true,
  isPublished: true,
});

// Type exports for blog
export type InsertBlogCategory = z.infer<typeof insertBlogCategorySchema>;
export type BlogCategory = typeof blogCategories.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
