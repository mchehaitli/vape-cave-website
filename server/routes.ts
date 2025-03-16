import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBrandCategorySchema, insertBrandSchema, insertBlogPostSchema, insertStoreLocationSchema } from "@shared/schema";
import { seedStoreLocations } from "./seed-store-locations";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Add userId to session
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

dotenv.config();

// Authentication middleware
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// Admin access middleware
async function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await storage.getUser(req.session.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }
    next();
  } catch (error) {
    console.error("Error in admin middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Check if a user is an admin (for use in routes)
async function isAdminUser(userId: number): Promise<boolean> {
  try {
    const user = await storage.getUser(userId);
    return !!user?.isAdmin;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session with PostgreSQL
  const PgSession = connectPgSimple(session);
  
  app.use(cookieParser());
  app.use(session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: 'sessions'
    }),
    secret: process.env.SESSION_SECRET || 'vapecave-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === 'production'
    }
  }));

  // Authentication routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      
      const user = await storage.validateUser(username, password);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Save user session
      req.session.userId = user.id;
      
      // Return user info without password
      const { password: _, ...userInfo } = user;
      res.json(userInfo);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get('/api/auth/status', async (req, res) => {
    if (req.session && req.session.userId) {
      try {
        const user = await storage.getUser(req.session.userId);
        if (user) {
          const { password: _, ...userInfo } = user;
          return res.json({ authenticated: true, user: userInfo });
        }
      } catch (error) {
        console.error("Auth status error:", error);
      }
    }
    
    res.json({ authenticated: false });
  });

  // Admin user management
  app.post('/api/admin/users', isAdmin, async (req, res) => {
    try {
      const userResult = insertUserSchema.safeParse(req.body);
      
      if (!userResult.success) {
        return res.status(400).json({ error: userResult.error.format() });
      }
      
      const user = await storage.createUser(userResult.data);
      const { password: _, ...userInfo } = user;
      
      res.status(201).json(userInfo);
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Brand category endpoints
  app.get('/api/brand-categories', async (req, res) => {
    try {
      const categories = await storage.getAllBrandCategories();
      res.json(categories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ error: "Failed to fetch brand categories" });
    }
  });

  app.get('/api/brand-categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      
      const category = await storage.getBrandCategory(id);
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Get category error:", error);
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  app.post('/api/admin/brand-categories', isAdmin, async (req, res) => {
    try {
      const categoryResult = insertBrandCategorySchema.safeParse(req.body);
      
      if (!categoryResult.success) {
        return res.status(400).json({ error: categoryResult.error.format() });
      }
      
      const category = await storage.createBrandCategory(categoryResult.data);
      res.status(201).json(category);
    } catch (error) {
      console.error("Create category error:", error);
      res.status(500).json({ error: "Failed to create brand category" });
    }
  });

  app.put('/api/admin/brand-categories/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      
      // Only validate the fields present in the request
      const updatedData: Record<string, any> = {};
      
      if (req.body.category !== undefined) updatedData.category = req.body.category;
      if (req.body.bgClass !== undefined) updatedData.bgClass = req.body.bgClass;
      if (req.body.displayOrder !== undefined) updatedData.displayOrder = req.body.displayOrder;
      if (req.body.intervalMs !== undefined) updatedData.intervalMs = req.body.intervalMs;
      
      const category = await storage.updateBrandCategory(id, updatedData);
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Update category error:", error);
      res.status(500).json({ error: "Failed to update brand category" });
    }
  });

  app.delete('/api/admin/brand-categories/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      
      const success = await storage.deleteBrandCategory(id);
      
      if (!success) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({ error: "Failed to delete brand category" });
    }
  });

  // Brand endpoints
  app.get('/api/brands', async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      let brands;
      if (categoryId && !isNaN(categoryId)) {
        brands = await storage.getBrandsByCategory(categoryId);
      } else {
        brands = await storage.getAllBrands();
      }
      
      res.json(brands);
    } catch (error) {
      console.error("Get brands error:", error);
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });

  app.get('/api/brands/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid brand ID" });
      }
      
      const brand = await storage.getBrand(id);
      
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      
      res.json(brand);
    } catch (error) {
      console.error("Get brand error:", error);
      res.status(500).json({ error: "Failed to fetch brand" });
    }
  });

  app.post('/api/admin/brands', isAdmin, async (req, res) => {
    try {
      const brandResult = insertBrandSchema.safeParse(req.body);
      
      if (!brandResult.success) {
        return res.status(400).json({ error: brandResult.error.format() });
      }
      
      const brand = await storage.createBrand(brandResult.data);
      res.status(201).json(brand);
    } catch (error) {
      console.error("Create brand error:", error);
      res.status(500).json({ error: "Failed to create brand" });
    }
  });

  app.put('/api/admin/brands/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid brand ID" });
      }
      
      // Only validate the fields present in the request
      const updatedData: Record<string, any> = {};
      
      if (req.body.categoryId !== undefined) updatedData.categoryId = req.body.categoryId;
      if (req.body.name !== undefined) updatedData.name = req.body.name;
      if (req.body.image !== undefined) updatedData.image = req.body.image;
      if (req.body.description !== undefined) updatedData.description = req.body.description;
      if (req.body.displayOrder !== undefined) updatedData.displayOrder = req.body.displayOrder;
      if (req.body.imageSize !== undefined) updatedData.imageSize = req.body.imageSize;
      
      const brand = await storage.updateBrand(id, updatedData);
      
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      
      res.json(brand);
    } catch (error) {
      console.error("Update brand error:", error);
      res.status(500).json({ error: "Failed to update brand" });
    }
  });

  app.delete('/api/admin/brands/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid brand ID" });
      }
      
      const success = await storage.deleteBrand(id);
      
      if (!success) {
        return res.status(404).json({ error: "Brand not found" });
      }
      
      res.json({ message: "Brand deleted successfully" });
    } catch (error) {
      console.error("Delete brand error:", error);
      res.status(500).json({ error: "Failed to delete brand" });
    }
  });

  // Public API to get all visible brand categories with their brands
  app.get('/api/featured-brands', async (req, res) => {
    try {
      const categories = await storage.getAllBrandCategories();
      
      // Get brands for each category and map them together
      const results = await Promise.all(
        categories.map(async (category) => {
          const brands = await storage.getBrandsByCategory(category.id);
          return {
            ...category,
            brands
          };
        })
      );
      
      res.json(results);
    } catch (error) {
      console.error("Get featured brands error:", error);
      res.status(500).json({ error: "Failed to fetch featured brands" });
    }
  });
  
  // No blog category endpoints - using simplified blog structure
  
  // Blog posts endpoints
  app.get('/api/blog-posts', async (req, res) => {
    try {
      // Admin users can see unpublished posts if they specify includeUnpublished=true
      const userIsAdmin = req.session?.userId ? await isAdminUser(req.session.userId) : false;
      const includeUnpublished = userIsAdmin && req.query.includeUnpublished === 'true';
      
      const posts = await storage.getAllBlogPosts(includeUnpublished);
      res.json(posts);
    } catch (error) {
      console.error("Get blog posts error:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });
  
  app.get('/api/blog-posts/featured', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const posts = await storage.getFeaturedBlogPosts(limit);
      res.json(posts);
    } catch (error) {
      console.error("Get featured blog posts error:", error);
      res.status(500).json({ error: "Failed to fetch featured blog posts" });
    }
  });
  
  // Category-based blog post routes have been removed
  
  app.get('/api/blog-posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid blog post ID" });
      }
      
      const post = await storage.getBlogPost(id);
      
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      // Increment view count (don't await this, let it happen in the background)
      storage.incrementBlogPostViewCount(id).catch(err => {
        console.error("Error incrementing view count:", err);
      });
      
      res.json(post);
    } catch (error) {
      console.error("Get blog post error:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });
  
  app.get('/api/blog-posts/slug/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      // Increment view count (don't await this, let it happen in the background)
      storage.incrementBlogPostViewCount(post.id).catch(err => {
        console.error("Error incrementing view count:", err);
      });
      
      res.json(post);
    } catch (error) {
      console.error("Get blog post by slug error:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });
  
  app.post('/api/admin/blog-posts', isAdmin, async (req, res) => {
    try {
      const postResult = insertBlogPostSchema.safeParse(req.body);
      
      if (!postResult.success) {
        return res.status(400).json({ error: postResult.error.format() });
      }
      
      const post = await storage.createBlogPost(postResult.data);
      res.status(201).json(post);
    } catch (error) {
      console.error("Create blog post error:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });
  
  app.put('/api/admin/blog-posts/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid blog post ID" });
      }
      
      // Only validate the fields present in the request
      const updatedData: Record<string, any> = {};
      
      if (req.body.title !== undefined) updatedData.title = req.body.title;
      if (req.body.slug !== undefined) updatedData.slug = req.body.slug;
      if (req.body.summary !== undefined) updatedData.summary = req.body.summary;
      if (req.body.content !== undefined) updatedData.content = req.body.content;
      if (req.body.featured_image !== undefined) updatedData.featured_image = req.body.featured_image;
      if (req.body.meta_title !== undefined) updatedData.meta_title = req.body.meta_title;
      if (req.body.meta_description !== undefined) updatedData.meta_description = req.body.meta_description;
      if (req.body.is_featured !== undefined) updatedData.is_featured = req.body.is_featured;
      if (req.body.is_published !== undefined) updatedData.is_published = req.body.is_published;
      
      const post = await storage.updateBlogPost(id, updatedData);
      
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Update blog post error:", error);
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });
  
  app.delete('/api/admin/blog-posts/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid blog post ID" });
      }
      
      const success = await storage.deleteBlogPost(id);
      
      if (!success) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Delete blog post error:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // Store location endpoints
  app.get('/api/store-locations', async (req, res) => {
    try {
      const locations = await storage.getAllStoreLocations();
      res.json(locations);
    } catch (error) {
      console.error("Get store locations error:", error);
      res.status(500).json({ error: "Failed to fetch store locations" });
    }
  });

  app.get('/api/store-locations/city/:city', async (req, res) => {
    try {
      const { city } = req.params;
      
      const location = await storage.getStoreLocationByCity(city);
      
      if (!location) {
        return res.status(404).json({ error: "Store location not found" });
      }
      
      res.json(location);
    } catch (error) {
      console.error("Get store location by city error:", error);
      res.status(500).json({ error: "Failed to fetch store location" });
    }
  });
  
  app.get('/api/store-locations/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid store location ID" });
      }
      
      const location = await storage.getStoreLocation(id);
      
      if (!location) {
        return res.status(404).json({ error: "Store location not found" });
      }
      
      res.json(location);
    } catch (error) {
      console.error("Get store location error:", error);
      res.status(500).json({ error: "Failed to fetch store location" });
    }
  });

  app.post('/api/admin/store-locations', isAdmin, async (req, res) => {
    try {
      const locationResult = insertStoreLocationSchema.safeParse(req.body);
      
      if (!locationResult.success) {
        return res.status(400).json({ error: locationResult.error.format() });
      }
      
      const location = await storage.createStoreLocation(locationResult.data);
      res.status(201).json(location);
    } catch (error) {
      console.error("Create store location error:", error);
      res.status(500).json({ error: "Failed to create store location" });
    }
  });

  app.put('/api/admin/store-locations/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid store location ID" });
      }
      
      // Create a clean update object with only the fields that are in the request
      const updatedData: Record<string, any> = {};
      
      // Map all properties from the request body to the updatedData object
      Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined) {
          updatedData[key] = req.body[key];
        }
      });
      
      const location = await storage.updateStoreLocation(id, updatedData);
      
      if (!location) {
        return res.status(404).json({ error: "Store location not found" });
      }
      
      res.json(location);
    } catch (error) {
      console.error("Update store location error:", error);
      res.status(500).json({ error: "Failed to update store location" });
    }
  });
  
  // Dedicated endpoint for updating store hours
  app.put('/api/admin/store-locations/:id/hours', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid store location ID" });
      }
      
      // Extract hours-related data from request
      const { opening_hours, closed_days, hours } = req.body;
      
      // Validate the hours data
      if (!opening_hours || typeof opening_hours !== 'object') {
        return res.status(400).json({ error: "Invalid opening hours data" });
      }
      
      // Create update object with only hours-related fields
      const updatedData = {
        opening_hours,
        closed_days: closed_days || null,
        hours: hours || ""
      };
      
      const location = await storage.updateStoreLocation(id, updatedData);
      
      if (!location) {
        return res.status(404).json({ error: "Store location not found" });
      }
      
      res.json(location);
    } catch (error) {
      console.error("Update store hours error:", error);
      res.status(500).json({ error: "Failed to update store hours" });
    }
  });

  app.delete('/api/admin/store-locations/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid store location ID" });
      }
      
      const success = await storage.deleteStoreLocation(id);
      
      if (!success) {
        return res.status(404).json({ error: "Store location not found" });
      }
      
      res.json({ message: "Store location deleted successfully" });
    } catch (error) {
      console.error("Delete store location error:", error);
      res.status(500).json({ error: "Failed to delete store location" });
    }
  });
  
  // Special endpoint to seed store locations from frontend data
  app.post('/api/admin/seed-store-locations', isAdmin, async (req, res) => {
    try {
      await seedStoreLocations();
      res.json({ message: "Store locations seeded successfully" });
    } catch (error) {
      console.error("Seed store locations error:", error);
      res.status(500).json({ error: "Failed to seed store locations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
