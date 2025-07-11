# Vape Cave - Full-Stack Web Application

## Overview

This is a full-stack web application for Vape Cave, a vape shop business with two locations in Frisco and Arlington, Texas. The application serves as both a business website and content management system, built with modern web technologies and optimized for local SEO.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system using CSS variables
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Animation**: Framer Motion for page transitions and UI animations
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based auth with express-session
- **Email**: Nodemailer for contact forms and newsletters
- **Build Tool**: Vite for frontend, esbuild for backend

### Development Setup
- **Build System**: Vite with React plugin and custom theme integration
- **Database Migrations**: Drizzle Kit for schema management
- **Development Server**: tsx for TypeScript execution
- **Package Manager**: npm with lockfile v3

## Key Components

### Database Schema
- **Users**: Authentication and admin access control
- **Brand Categories**: Organized product categories (Disposables, Delta, etc.)
- **Brands**: Individual brand information with images and descriptions
- **Store Locations**: Complete location data with coordinates and business hours
- **Blog Posts**: Content management for SEO blog articles
- **Newsletter Subscriptions**: Email capture for marketing
- **Products**: Product catalog with categories and pricing

### Frontend Pages
- **Homepage**: Hero section, featured brands carousel, location highlights
- **Locations**: Individual pages for Frisco and Arlington stores with maps
- **Products**: Product catalog with filtering and categories
- **Blog**: SEO-optimized blog with article management
- **Contact**: Contact forms with email integration
- **Admin**: Protected admin panel for content management

### API Endpoints
- `/api/auth/*`: User authentication and session management
- `/api/store-locations`: Store location data and management
- `/api/featured-brands`: Brand categories and carousel data
- `/api/blog-posts/*`: Blog content management
- `/api/products/*`: Product catalog endpoints
- `/api/newsletter/*`: Newsletter subscription handling
- `/api/contact`: Contact form submission

## Data Flow

### Client-Server Communication
1. Frontend makes API calls using TanStack Query
2. Express server handles requests with authentication middleware
3. Drizzle ORM manages database operations
4. Responses cached on client with intelligent invalidation

### Content Management
1. Admin users log in through protected routes
2. CRUD operations for brands, locations, products, and blog posts
3. Real-time updates reflected across the application
4. File uploads handled for brand logos and images

### User Interactions
1. Age verification modal on first visit
2. Newsletter popup with email capture and discount codes
3. Contact forms with email notifications
4. Interactive maps with directions integration

## External Dependencies

### Database & Hosting
- **PostgreSQL**: Primary database (configured for Neon serverless)
- **Deployment**: Configured for Node.js hosting with static file serving

### Third-Party Services
- **Google Maps**: Location display and directions
- **Email Service**: SMTP configuration for transactional emails
- **External APIs**: Ready for payment processing integration

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **React Helmet**: SEO meta tag management

## Deployment Strategy

### Production Build
- Frontend builds to `dist/public` using Vite
- Backend compiles to `dist/index.js` using esbuild
- Static files served by Express in production
- Environment variables for database and SMTP configuration

### Database Management
- Drizzle migrations in `migrations/` directory
- Schema defined in `shared/schema.ts`
- Push command for development: `npm run db:push`

### Development Workflow
- `npm run dev`: Starts development server with hot reload
- `npm run build`: Production build
- `npm run start`: Production server
- `npm run check`: TypeScript compilation check

### SEO Optimization
- Server-side rendering preparation
- Structured data for local business
- Sitemap and robots.txt configuration
- Meta tags and Open Graph optimization
- Local SEO focus on Frisco and Arlington locations

## Recent Changes: Latest modifications with dates

### Database Migration to Supabase (July 11, 2025)
- ✅ Successfully migrated all data from Replit PostgreSQL to Supabase
- ✅ Migrated 6 brand categories, 18 brands, 2 store locations, 6 blog posts, 8 products
- ✅ Switched application to use Supabase connection (postgres-js driver)
- ✅ Verified all API endpoints working correctly with Supabase data
- ✅ Created deployment configurations for Netlify, Vercel, Railway, Render
- ✅ Prepared production environment variables and build process

### Deployment Status
- Database: Fully migrated to Supabase (free tier)
- Application: Ready for production deployment
- Build Process: Configured for multiple hosting platforms
- Environment: Production variables configured
- Next Step: Deploy to chosen hosting platform