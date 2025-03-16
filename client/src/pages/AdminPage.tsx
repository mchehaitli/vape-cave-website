import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBrandCategories, useFeaturedBrands } from "@/hooks/use-brands";
import BrandsCarousel from "@/components/BrandsCarousel";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/lib/queryClient";
import { Trash2, Edit, Plus, RefreshCcw, Info, Calendar, Eye, MessageCircle, Download, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Brand schema for forms
const brandSchema = z.object({
  categoryId: z.coerce.number({
    required_error: "Category is required",
  }),
  name: z.string({
    required_error: "Brand name is required",
  }),
  image: z.string({
    required_error: "Image URL is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  displayOrder: z.coerce.number().default(0),
  imageSize: z.string().default("medium"),
});

// Category schema for forms
const categorySchema = z.object({
  category: z.string({
    required_error: "Category name is required",
  }),
  bgClass: z.string().optional(),
  displayOrder: z.coerce.number().default(0),
  intervalMs: z.coerce.number().default(5000),
});

// User schema for forms
const userSchema = z.object({
  username: z.string({
    required_error: "Username is required",
  }),
  password: z.string({
    required_error: "Password is required",
  }),
  isAdmin: z.boolean().default(false),
});

// Blog category schema for forms
const blogCategorySchema = z.object({
  name: z.string({
    required_error: "Category name is required"
  }),
  slug: z.string({
    required_error: "Slug is required"
  }),
  description: z.string().optional(),
  displayOrder: z.coerce.number().default(0)
});

// Blog post schema for forms
const blogPostSchema = z.object({
  categoryId: z.coerce.number({
    required_error: "Category is required"
  }),
  title: z.string({
    required_error: "Title is required"
  }),
  slug: z.string({
    required_error: "Slug is required"
  }),
  summary: z.string({
    required_error: "Summary is required"
  }),
  content: z.string({
    required_error: "Content is required"
  }),
  imageUrl: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional()
});

// Store location schema for forms
const storeLocationSchema = z.object({
  name: z.string({
    required_error: "Store name is required"
  }),
  city: z.string({
    required_error: "City is required"
  }),
  address: z.string({
    required_error: "Address is required"
  }),
  full_address: z.string({
    required_error: "Full address is required"
  }),
  phone: z.string({
    required_error: "Phone number is required"
  }),
  hours: z.string({
    required_error: "Store hours summary is required"
  }),
  closed_days: z.string().optional(),
  image: z.string({
    required_error: "Store image URL is required"
  }),
  lat: z.string({
    required_error: "Latitude is required"
  }),
  lng: z.string({
    required_error: "Longitude is required"
  }),
  google_place_id: z.string().optional(),
  apple_maps_link: z.string().optional(),
  map_embed: z.string({
    required_error: "Map embed code is required"
  }),
  email: z.string().optional(),
  store_code: z.string().optional(),
  opening_hours: z.record(z.string()).default({}),
  services: z.array(z.string()).default([]),
  accepted_payments: z.array(z.string()).default([]),
  area_served: z.array(z.string()).default([]),
  public_transit: z.string().optional(),
  parking: z.string().optional(),
  year_established: z.coerce.number({
    required_error: "Year established is required"
  }),
  price_range: z.string({
    required_error: "Price range is required"
  }),
  social_profiles: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    yelp: z.string().optional()
  }).optional(),
  description: z.string({
    required_error: "Description is required"
  }),
  neighborhood_info: z.string().optional(),
  amenities: z.array(z.string()).default([])
});

// Type definitions based on schemas
type BrandFormValues = z.infer<typeof brandSchema>;
type CategoryFormValues = z.infer<typeof categorySchema>;
type UserFormValues = z.infer<typeof userSchema>;
type BlogCategoryFormValues = z.infer<typeof blogCategorySchema>;
type BlogPostFormValues = z.infer<typeof blogPostSchema>;
type StoreLocationFormValues = z.infer<typeof storeLocationSchema>;

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { data: categories, isLoading: isCategoriesLoading } = useBrandCategories();
  const { data: featuredBrands, isLoading: isFeaturedBrandsLoading } = useFeaturedBrands();
  
  // Query for blog categories
  const { data: blogCategories = [], isLoading: isBlogCategoriesLoading } = useQuery<any[]>({
    queryKey: ['/api/blog-categories'],
    staleTime: 60000,
  });

  // Query for blog posts
  const { data: blogPosts = [], isLoading: isBlogPostsLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/blog-posts'],
    staleTime: 30000,
  });
  
  // Query for store locations
  const { data: storeLocations = [], isLoading: isStoreLocationsLoading } = useQuery<any[]>({
    queryKey: ['/api/store-locations'],
    staleTime: 60000,
  });
  
  // State for brand management
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [deletingBrandId, setDeletingBrandId] = useState<number | null>(null);
  
  // State for category management
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  
  // State for user management
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  
  // State for blog management
  const [blogCategoryDialogOpen, setBlogCategoryDialogOpen] = useState(false);
  const [editingBlogCategory, setEditingBlogCategory] = useState<any>(null);
  const [deletingBlogCategoryId, setDeletingBlogCategoryId] = useState<number | null>(null);
  
  const [blogPostDialogOpen, setBlogPostDialogOpen] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<any>(null);
  const [deletingBlogPostId, setDeletingBlogPostId] = useState<number | null>(null);
  
  // State for store location management
  const [storeLocationDialogOpen, setStoreLocationDialogOpen] = useState(false);
  const [storeHoursDialogOpen, setStoreHoursDialogOpen] = useState(false);
  const [editingStoreLocation, setEditingStoreLocation] = useState<any>(null);
  const [deletingStoreLocationId, setDeletingStoreLocationId] = useState<number | null>(null);
  
  // State for store hours management
  const [temporaryHours, setTemporaryHours] = useState<Record<string, string>>({});
  const [closedDays, setClosedDays] = useState<string>("");
  const [hoursSummary, setHoursSummary] = useState<string>("");

  useEffect(() => {
    // Check if user is authenticated and is admin
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (!data.authenticated || !data.user.isAdmin) {
          toast({
            title: "Unauthorized",
            description: "Please login with admin credentials",
            variant: "destructive",
          });
          navigate('/admin/login');
          return;
        }
        
        setAdminData(data.user);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "Error",
          description: "Failed to verify authentication",
          variant: "destructive",
        });
        navigate('/admin/login');
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      navigate('/admin/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };
  
  // Brand form setup
  const brandForm = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      categoryId: 0,
      name: "",
      image: "",
      description: "",
      displayOrder: 0,
      imageSize: "medium",
    }
  });
  
  // Category form setup
  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      category: "",
      bgClass: "bg-gradient-to-br from-gray-900 to-gray-800",
      displayOrder: 0,
      intervalMs: 5000,
    }
  });
  
  // User form setup
  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
      isAdmin: true,
    }
  });
  
  // Blog category form setup
  const blogCategoryForm = useForm<BlogCategoryFormValues>({
    resolver: zodResolver(blogCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      displayOrder: 0
    }
  });
  
  // Blog post form setup
  const blogPostForm = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      categoryId: 0,
      title: "",
      slug: "",
      summary: "",
      content: "",
      imageUrl: "",
      published: false,
      featured: false,
      metaTitle: "",
      metaDescription: ""
    }
  });
  
  // Store location form setup
  const storeLocationForm = useForm<StoreLocationFormValues>({
    resolver: zodResolver(storeLocationSchema),
    defaultValues: {
      name: "",
      city: "",
      address: "",
      full_address: "",
      phone: "",
      hours: "",
      closed_days: "",
      image: "",
      lat: "",
      lng: "",
      google_place_id: "",
      apple_maps_link: "",
      map_embed: "",
      email: "",
      store_code: "",
      opening_hours: {},
      services: [],
      accepted_payments: [],
      area_served: [],
      public_transit: "",
      parking: "",
      year_established: new Date().getFullYear(),
      price_range: "$",
      social_profiles: {
        facebook: "",
        instagram: "",
        twitter: "",
        yelp: ""
      },
      description: "",
      neighborhood_info: "",
      amenities: []
    }
  });
  
  // Reset forms when dialog is opened/closed
  useEffect(() => {
    if (brandDialogOpen && editingBrand) {
      brandForm.reset({
        categoryId: editingBrand.categoryId,
        name: editingBrand.name,
        image: editingBrand.image,
        description: editingBrand.description,
        displayOrder: editingBrand.displayOrder || 0,
        imageSize: editingBrand.imageSize || "medium",
      });
    } else if (brandDialogOpen) {
      brandForm.reset({
        categoryId: categories?.[0]?.id || 0,
        name: "",
        image: "",
        description: "",
        displayOrder: 0,
        imageSize: "medium",
      });
    }
  }, [brandDialogOpen, editingBrand, brandForm, categories]);
  
  useEffect(() => {
    if (categoryDialogOpen && editingCategory) {
      categoryForm.reset({
        category: editingCategory.category,
        bgClass: editingCategory.bgClass || "bg-gradient-to-br from-gray-900 to-gray-800",
        displayOrder: editingCategory.displayOrder || 0,
        intervalMs: editingCategory.intervalMs || 5000,
      });
    } else if (categoryDialogOpen) {
      categoryForm.reset({
        category: "",
        bgClass: "bg-gradient-to-br from-gray-900 to-gray-800",
        displayOrder: 0,
        intervalMs: 5000,
      });
    }
  }, [categoryDialogOpen, editingCategory, categoryForm]);
  
  // Reset blog category form when dialog is opened/closed
  useEffect(() => {
    if (blogCategoryDialogOpen && editingBlogCategory) {
      blogCategoryForm.reset({
        name: editingBlogCategory.name,
        slug: editingBlogCategory.slug,
        description: editingBlogCategory.description || "",
        displayOrder: editingBlogCategory.displayOrder || 0
      });
    } else if (blogCategoryDialogOpen) {
      blogCategoryForm.reset({
        name: "",
        slug: "",
        description: "",
        displayOrder: 0
      });
    }
  }, [blogCategoryDialogOpen, editingBlogCategory, blogCategoryForm]);
  
  // Reset blog post form when dialog is opened/closed
  useEffect(() => {
    if (blogPostDialogOpen && editingBlogPost) {
      blogPostForm.reset({
        categoryId: editingBlogPost.categoryId,
        title: editingBlogPost.title,
        slug: editingBlogPost.slug,
        summary: editingBlogPost.summary,
        content: editingBlogPost.content,
        imageUrl: editingBlogPost.imageUrl || "",
        published: editingBlogPost.published || false,
        featured: editingBlogPost.featured || false,
        metaTitle: editingBlogPost.metaTitle || "",
        metaDescription: editingBlogPost.metaDescription || ""
      });
    } else if (blogPostDialogOpen) {
      blogPostForm.reset({
        categoryId: blogCategories?.[0]?.id || 0,
        title: "",
        slug: "",
        summary: "",
        content: "",
        imageUrl: "",
        published: false,
        featured: false,
        metaTitle: "",
        metaDescription: ""
      });
    }
  }, [blogPostDialogOpen, editingBlogPost, blogPostForm, blogCategories]);
  
  // Reset store location form when dialog is opened/closed
  useEffect(() => {
    if (storeLocationDialogOpen && editingStoreLocation) {
      storeLocationForm.reset({
        name: editingStoreLocation.name,
        city: editingStoreLocation.city,
        address: editingStoreLocation.address,
        full_address: editingStoreLocation.full_address,
        phone: editingStoreLocation.phone,
        hours: editingStoreLocation.hours,
        closed_days: editingStoreLocation.closed_days || "",
        image: editingStoreLocation.image,
        lat: editingStoreLocation.lat,
        lng: editingStoreLocation.lng,
        google_place_id: editingStoreLocation.google_place_id || "",
        apple_maps_link: editingStoreLocation.apple_maps_link || "",
        map_embed: editingStoreLocation.map_embed,
        email: editingStoreLocation.email || "",
        store_code: editingStoreLocation.store_code || "",
        opening_hours: editingStoreLocation.opening_hours || {},
        services: editingStoreLocation.services || [],
        accepted_payments: editingStoreLocation.accepted_payments || [],
        area_served: editingStoreLocation.area_served || [],
        public_transit: editingStoreLocation.public_transit || "",
        parking: editingStoreLocation.parking || "",
        year_established: editingStoreLocation.year_established,
        price_range: editingStoreLocation.price_range,
        social_profiles: editingStoreLocation.social_profiles || {
          facebook: "",
          instagram: "",
          twitter: "",
          yelp: ""
        },
        description: editingStoreLocation.description,
        neighborhood_info: editingStoreLocation.neighborhood_info || "",
        amenities: editingStoreLocation.amenities || []
      });
    } else if (storeLocationDialogOpen) {
      storeLocationForm.reset({
        name: "",
        city: "",
        address: "",
        full_address: "",
        phone: "",
        hours: "",
        closed_days: "",
        image: "",
        lat: "",
        lng: "",
        google_place_id: "",
        apple_maps_link: "",
        map_embed: "",
        email: "",
        store_code: "",
        opening_hours: {},
        services: [],
        accepted_payments: [],
        area_served: [],
        public_transit: "",
        parking: "",
        year_established: new Date().getFullYear(),
        price_range: "$",
        social_profiles: {
          facebook: "",
          instagram: "",
          twitter: "",
          yelp: ""
        },
        description: "",
        neighborhood_info: "",
        amenities: []
      });
    }
  }, [storeLocationDialogOpen, editingStoreLocation, storeLocationForm]);
  
  // Initialize store hours form when dialog opens
  useEffect(() => {
    if (storeHoursDialogOpen && editingStoreLocation) {
      // Initialize temporary hours from the location's opening_hours
      setTemporaryHours(editingStoreLocation.opening_hours || {});
      setClosedDays(editingStoreLocation.closed_days || "");
      setHoursSummary(editingStoreLocation.hours || "");
    }
  }, [storeHoursDialogOpen, editingStoreLocation]);
  
  // Helper functions for store hours management
  const getOpeningHour = (day: string): string => {
    const hours = temporaryHours[day] || "";
    if (!hours) return "";
    
    // If format is "10:00 AM - 7:00 PM", extract the opening time
    const match = hours.match(/^([^-]+)/);
    return match ? match[1].trim() : "";
  };
  
  const getClosingHour = (day: string): string => {
    const hours = temporaryHours[day] || "";
    if (!hours) return "";
    
    // If format is "10:00 AM - 7:00 PM", extract the closing time
    const match = hours.match(/\s*-\s*(.+)$/);
    return match ? match[1].trim() : "";
  };
  
  const handleHourChange = (day: string, type: 'open' | 'close', value: string) => {
    const currentHours = temporaryHours[day] || "";
    let newHours = "";
    
    if (type === 'open') {
      const closingTime = getClosingHour(day);
      newHours = closingTime ? `${value} - ${closingTime}` : value;
    } else {
      const openingTime = getOpeningHour(day);
      newHours = openingTime ? `${openingTime} - ${value}` : `- ${value}`;
    }
    
    setTemporaryHours(prev => ({
      ...prev,
      [day]: newHours
    }));
  };
  
  const handleCopyHours = (fromDay: string) => {
    const hoursValue = temporaryHours[fromDay] || "";
    
    // Display a toast to indicate what is happening
    toast({
      title: "Copy Hours",
      description: `Click on another day to copy "${hoursValue}" to that day`,
    });
    
    // Set a listener for the next day selection
    const handleDayClick = (event: MouseEvent) => {
      // Find if the click was on a day input
      const target = event.target as HTMLElement;
      const dayRow = target.closest('[data-day]');
      
      if (dayRow) {
        const toDay = dayRow.getAttribute('data-day');
        if (toDay && toDay !== fromDay) {
          setTemporaryHours(prev => ({
            ...prev,
            [toDay]: hoursValue
          }));
          
          toast({
            title: "Hours Copied",
            description: `Hours from ${fromDay} copied to ${toDay}`,
          });
        }
      }
      
      // Remove the event listener after one use
      document.removeEventListener('click', handleDayClick);
    };
    
    // Add the listener
    document.addEventListener('click', handleDayClick);
  };
  
  const handleSaveStoreHours = async () => {
    if (!editingStoreLocation) return;
    
    try {
      // Prepare the update data
      const updateData = {
        opening_hours: temporaryHours,
        closed_days: closedDays,
        hours: hoursSummary
      };
      
      // Update the store location
      await apiRequest('PUT', `/api/admin/store-locations/${editingStoreLocation.id}/hours`, updateData);
      
      // Success notification
      toast({
        title: "Hours Updated",
        description: `Store hours for ${editingStoreLocation.name} have been updated successfully`,
      });
      
      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/store-locations'] });
      
      // Close the dialog
      setStoreHoursDialogOpen(false);
      setEditingStoreLocation(null);
    } catch (error) {
      console.error("Update store hours error:", error);
      toast({
        title: "Error",
        description: "Failed to update store hours",
        variant: "destructive",
      });
    }
  };
  
  // Brand CRUD operations
  const handleAddBrand = () => {
    setEditingBrand(null);
    setBrandDialogOpen(true);
  };
  
  const handleEditBrand = (brand: any) => {
    setEditingBrand(brand);
    setBrandDialogOpen(true);
  };
  
  const handleDeleteBrand = (id: number) => {
    setDeletingBrandId(id);
  };
  
  const confirmDeleteBrand = async () => {
    if (!deletingBrandId) return;
    
    try {
      await apiRequest('DELETE', `/api/admin/brands/${deletingBrandId}`);
      
      queryClient.invalidateQueries({ queryKey: ['/api/featured-brands'] });
      
      toast({
        title: "Brand Deleted",
        description: "The brand has been successfully deleted",
      });
    } catch (error) {
      console.error("Delete brand error:", error);
      toast({
        title: "Error",
        description: "Failed to delete brand",
        variant: "destructive",
      });
    } finally {
      setDeletingBrandId(null);
    }
  };
  
  const onBrandSubmit = async (data: BrandFormValues) => {
    try {
      if (editingBrand) {
        // Update existing brand
        await apiRequest('PUT', `/api/admin/brands/${editingBrand.id}`, data);
        
        toast({
          title: "Brand Updated",
          description: "The brand has been successfully updated",
        });
      } else {
        // Create new brand
        await apiRequest('POST', '/api/admin/brands', data);
        
        toast({
          title: "Brand Created",
          description: "The brand has been successfully created",
        });
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/featured-brands'] });
      
      // Close dialog
      setBrandDialogOpen(false);
      setEditingBrand(null);
    } catch (error) {
      console.error("Brand submit error:", error);
      toast({
        title: "Error",
        description: "Failed to save brand",
        variant: "destructive",
      });
    }
  };
  
  // Category CRUD operations
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryDialogOpen(true);
  };
  
  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };
  
  const handleDeleteCategory = (id: number) => {
    setDeletingCategoryId(id);
  };
  
  const confirmDeleteCategory = async () => {
    if (!deletingCategoryId) return;
    
    try {
      await apiRequest('DELETE', `/api/admin/brand-categories/${deletingCategoryId}`);
      
      queryClient.invalidateQueries({ queryKey: ['/api/brand-categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/featured-brands'] });
      
      toast({
        title: "Category Deleted",
        description: "The category has been successfully deleted",
      });
    } catch (error) {
      console.error("Delete category error:", error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setDeletingCategoryId(null);
    }
  };
  
  const onCategorySubmit = async (data: CategoryFormValues) => {
    try {
      if (editingCategory) {
        // Update existing category
        await apiRequest('PUT', `/api/admin/brand-categories/${editingCategory.id}`, data);
        
        toast({
          title: "Category Updated",
          description: "The category has been successfully updated",
        });
      } else {
        // Create new category
        await apiRequest('POST', '/api/admin/brand-categories', data);
        
        toast({
          title: "Category Created",
          description: "The category has been successfully created",
        });
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/brand-categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/featured-brands'] });
      
      // Close dialog
      setCategoryDialogOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Category submit error:", error);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    }
  };
  
  // User CRUD operations
  const handleAddUser = () => {
    setEditingUser(null);
    setUserDialogOpen(true);
  };
  
  const onUserSubmit = async (data: UserFormValues) => {
    try {
      await apiRequest('POST', '/api/admin/users', data);
      
      toast({
        title: "User Created",
        description: "The user has been successfully created",
      });
      
      // Close dialog
      setUserDialogOpen(false);
    } catch (error) {
      console.error("User submit error:", error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };
  
  // Blog Category CRUD operations
  const onBlogCategorySubmit = async (data: BlogCategoryFormValues) => {
    try {
      if (editingBlogCategory) {
        // Update existing blog category
        await apiRequest('PUT', `/api/admin/blog-categories/${editingBlogCategory.id}`, data);
        
        toast({
          title: "Blog Category Updated",
          description: "The blog category has been successfully updated",
        });
      } else {
        // Create new blog category
        await apiRequest('POST', '/api/admin/blog-categories', data);
        
        toast({
          title: "Blog Category Created",
          description: "The blog category has been successfully created",
        });
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/blog-categories'] });
      
      // Close dialog
      setBlogCategoryDialogOpen(false);
      setEditingBlogCategory(null);
    } catch (error) {
      console.error("Blog category submit error:", error);
      toast({
        title: "Error",
        description: "Failed to save blog category",
        variant: "destructive",
      });
    }
  };
  
  const confirmDeleteBlogCategory = async () => {
    if (!deletingBlogCategoryId) return;
    
    try {
      await apiRequest('DELETE', `/api/admin/blog-categories/${deletingBlogCategoryId}`);
      
      queryClient.invalidateQueries({ queryKey: ['/api/blog-categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      
      toast({
        title: "Blog Category Deleted",
        description: "The blog category has been successfully deleted",
      });
    } catch (error) {
      console.error("Delete blog category error:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog category",
        variant: "destructive",
      });
    } finally {
      setDeletingBlogCategoryId(null);
    }
  };
  
  // Blog Post CRUD operations
  const onBlogPostSubmit = async (data: BlogPostFormValues) => {
    try {
      if (editingBlogPost) {
        // Update existing blog post
        await apiRequest('PUT', `/api/admin/blog-posts/${editingBlogPost.id}`, data);
        
        toast({
          title: "Blog Post Updated",
          description: "The blog post has been successfully updated",
        });
      } else {
        // Create new blog post
        await apiRequest('POST', '/api/admin/blog-posts', data);
        
        toast({
          title: "Blog Post Created",
          description: "The blog post has been successfully created",
        });
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      
      // Close dialog
      setBlogPostDialogOpen(false);
      setEditingBlogPost(null);
    } catch (error) {
      console.error("Blog post submit error:", error);
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive",
      });
    }
  };
  
  const confirmDeleteBlogPost = async () => {
    if (!deletingBlogPostId) return;
    
    try {
      await apiRequest('DELETE', `/api/admin/blog-posts/${deletingBlogPostId}`);
      
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      
      toast({
        title: "Blog Post Deleted",
        description: "The blog post has been successfully deleted",
      });
    } catch (error) {
      console.error("Delete blog post error:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    } finally {
      setDeletingBlogPostId(null);
    }
  };
  
  // Store Location CRUD operations
  const onStoreLocationSubmit = async (data: StoreLocationFormValues) => {
    try {
      if (editingStoreLocation) {
        // Update existing store location
        await apiRequest('PUT', `/api/admin/store-locations/${editingStoreLocation.id}`, data);
        
        toast({
          title: "Store Location Updated",
          description: "The store location has been successfully updated",
        });
      } else {
        // Create new store location
        await apiRequest('POST', '/api/admin/store-locations', data);
        
        toast({
          title: "Store Location Created",
          description: "The store location has been successfully created",
        });
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/store-locations'] });
      
      // Close dialog
      setStoreLocationDialogOpen(false);
      setEditingStoreLocation(null);
    } catch (error) {
      console.error("Store location submit error:", error);
      toast({
        title: "Error",
        description: "Failed to save store location",
        variant: "destructive",
      });
    }
  };
  
  const confirmDeleteStoreLocation = async () => {
    if (!deletingStoreLocationId) return;
    
    try {
      await apiRequest('DELETE', `/api/admin/store-locations/${deletingStoreLocationId}`);
      
      queryClient.invalidateQueries({ queryKey: ['/api/store-locations'] });
      
      toast({
        title: "Store Location Deleted",
        description: "The store location has been successfully deleted",
      });
    } catch (error) {
      console.error("Delete store location error:", error);
      toast({
        title: "Error",
        description: "Failed to delete store location",
        variant: "destructive",
      });
    } finally {
      setDeletingStoreLocationId(null);
    }
  };

  if (isLoading) {
    return (
      <MainLayout
        title="Admin Dashboard | Vape Cave"
        description="Admin dashboard for Vape Cave website management."
      >
        <div className="min-h-screen bg-gray-900 text-white p-4">
          <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-36 bg-gray-700 rounded mb-4"></div>
              <div className="h-8 w-64 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Admin Dashboard | Vape Cave"
      description="Admin dashboard for Vape Cave website management."
    >
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="container mx-auto pt-4 pb-16">
          <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 mt-1">Welcome back, {adminData?.username}</p>
            </div>
            <Button 
              variant="outline" 
              className="border-gray-600 hover:bg-gray-800"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </header>

          <Tabs defaultValue="brands" className="space-y-4">
            <div className="overflow-x-auto -mx-4 px-4">
              <TabsList className="bg-gray-800 border border-gray-700 w-full md:w-auto mb-2">
                <TabsTrigger className="flex-1 md:flex-none whitespace-nowrap text-xs md:text-sm" value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger className="flex-1 md:flex-none whitespace-nowrap text-xs md:text-sm" value="brands">Brands</TabsTrigger>
                <TabsTrigger className="flex-1 md:flex-none whitespace-nowrap text-xs md:text-sm" value="categories">Categories</TabsTrigger>
                <TabsTrigger className="flex-1 md:flex-none whitespace-nowrap text-xs md:text-sm" value="store-hours">Store Hours</TabsTrigger>
                <TabsTrigger className="flex-1 md:flex-none whitespace-nowrap text-xs md:text-sm" value="blog">Blog</TabsTrigger>
                <TabsTrigger className="flex-1 md:flex-none whitespace-nowrap text-xs md:text-sm" value="settings">Settings</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="dashboard" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle>Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{categories?.length || 0}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle>Brands</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {isFeaturedBrandsLoading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        featuredBrands?.reduce((acc, cat) => acc + cat.brands.length, 0) || 0
                      )}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle>Website Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <p>Online</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="brands" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Manage Brands</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    This section allows you to add, edit, and delete brands across all categories.
                  </p>
                  <div className="flex justify-end mb-4">
                    <Button 
                      onClick={handleAddBrand}
                      className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add New Brand
                    </Button>
                  </div>
                  
                  {isFeaturedBrandsLoading ? (
                    <div className="animate-pulse space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  ) : featuredBrands && featuredBrands.length > 0 ? (
                    <div className="rounded-md border border-gray-700 overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-gray-800">
                          <TableRow className="hover:bg-gray-700/50 border-gray-700">
                            <TableHead className="text-gray-400 whitespace-nowrap">Brand</TableHead>
                            <TableHead className="text-gray-400 hidden md:table-cell">Category</TableHead>
                            <TableHead className="text-gray-400 hidden md:table-cell">Description</TableHead>
                            <TableHead className="text-gray-400 text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {featuredBrands.map(category => (
                            category.brands.map(brand => (
                              <TableRow key={brand.id} className="hover:bg-gray-700/50 border-gray-700">
                                <TableCell className="font-medium flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded bg-gray-700 overflow-hidden border border-gray-600 hover:bg-gray-600 transition-all duration-300 cursor-pointer" 
                                    title="Click to see larger preview"
                                    onClick={() => {
                                      toast({
                                        title: "Brand Preview",
                                        description: (
                                          <div className="mt-2">
                                            <div className="relative w-full max-w-md mx-auto">
                                              <BrandsCarousel 
                                                category={category.category}
                                                brands={[{ 
                                                  id: brand.id,
                                                  categoryId: brand.categoryId,
                                                  name: brand.name, 
                                                  image: brand.image, 
                                                  description: brand.description,
                                                  displayOrder: brand.displayOrder,
                                                  createdAt: brand.createdAt
                                                }]}
                                                debug={true}
                                              />
                                              <div className="mt-2 text-sm text-gray-400 text-center">
                                                Debug mode enabled - showing auto-sizing metrics
                                              </div>
                                            </div>
                                          </div>
                                        ),
                                        duration: 10000,
                                      });
                                    }}
                                  >
                                    <img 
                                      src={brand.image} 
                                      alt={brand.name} 
                                      className="w-full h-full object-contain" 
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Error';
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <div>{brand.name}</div>
                                    <div className="text-xs text-gray-400 md:hidden mt-1">
                                      <span className="font-medium">{category.category}</span>
                                      {brand.description && (
                                        <span className="block mt-1 line-clamp-2">{brand.description}</span>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{category.category}</TableCell>
                                <TableCell className="hidden md:table-cell max-w-xs truncate">{brand.description}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                                      onClick={() => handleEditBrand({...brand, categoryId: category.id})}
                                    >
                                      <span className="sr-only">Edit</span>
                                      <Edit size={16} />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-gray-700"
                                      onClick={() => handleDeleteBrand(brand.id)}
                                    >
                                      <span className="sr-only">Delete</span>
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No brands found. Click "Add New Brand" to create your first brand.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Brand Dialog */}
              <Dialog open={brandDialogOpen} onOpenChange={setBrandDialogOpen}>
                <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-xl max-h-[90vh] overflow-y-auto mx-4 w-[calc(100%-2rem)]">
                  <DialogHeader>
                    <DialogTitle>{editingBrand ? "Edit Brand" : "Add New Brand"}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {editingBrand 
                        ? "Edit brand details below and save your changes." 
                        : "Fill in the brand details to add it to your store."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...brandForm}>
                    <form onSubmit={brandForm.handleSubmit(onBrandSubmit)} className="space-y-4">
                      <FormField
                        control={brandForm.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              defaultValue={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                {categories?.map(category => (
                                  <SelectItem 
                                    key={category.id} 
                                    value={category.id.toString()}
                                    className="hover:bg-gray-800 focus:bg-gray-800"
                                  >
                                    {category.category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={brandForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand Name</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-900 border-gray-700 text-white" 
                                placeholder="Enter brand name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={brandForm.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand Image</FormLabel>
                            <div className="space-y-3">
                              <FormControl>
                                <Input
                                  className="bg-gray-900 border-gray-700 text-white" 
                                  placeholder="https://example.com/image.jpg or upload below"
                                  {...field}
                                />
                              </FormControl>
                              
                              <div className="mt-2">
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2">
                                    <Label htmlFor="image-upload" className="text-sm text-gray-400">
                                      Or upload from your computer:
                                    </Label>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-600 bg-gray-800 cursor-help">
                                          <Info className="h-3.5 w-3.5 text-gray-400" />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent side="right" className="max-w-xs bg-black text-white border-gray-700">
                                        <p className="font-semibold">Optimal Image Dimensions:</p>
                                        <p className="text-xs mt-1">700px width × 530px height</p>
                                        <p className="text-xs mt-1 text-gray-300">
                                          This size ensures your brand images fill available space with minimal distortion.
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                  <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*,.png,.jpg,.jpeg,.webp,.gif,.bmp,.tiff,.svg"
                                    className="bg-gray-900 border-gray-700 text-white cursor-pointer file:cursor-pointer file:border-0 file:bg-gray-800 file:text-white file:px-4 file:py-2 file:mr-4 file:hover:bg-gray-700"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        // Simple base64 encoding
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                          if (event.target?.result) {
                                            field.onChange(event.target.result as string);
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                              
                              {field.value && (
                                <div className="mt-2 border border-gray-700 rounded p-2 bg-gray-800">
                                  <p className="text-xs text-gray-400 mb-2">Image Preview:</p>
                                  <div className="w-32 h-32 bg-gray-900 rounded flex items-center justify-center overflow-hidden">
                                    <img 
                                      src={field.value} 
                                      alt="Brand preview" 
                                      className="max-w-full max-h-full object-contain"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Invalid+Image';
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <FormDescription className="text-gray-500 text-xs">
                              You can provide a URL or upload various image formats (PNG, JPG, JPEG, WEBP, GIF, BMP, TIFF, SVG).
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={brandForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                className="bg-gray-900 border-gray-700 text-white min-h-[100px]" 
                                placeholder="Enter brand description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={brandForm.control}
                        name="displayOrder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Order</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-900 border-gray-700 text-white" 
                                type="number"
                                min={0}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-gray-500 text-xs">
                              Lower numbers display first in the carousel. Default is 0.
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter className="gap-2 sm:gap-0 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="border-gray-600 hover:bg-gray-700 text-gray-300"
                          onClick={() => setBrandDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-primary hover:bg-primary/90"
                          disabled={brandForm.formState.isSubmitting}
                        >
                          {brandForm.formState.isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <RefreshCcw size={16} className="animate-spin" />
                              Saving...
                            </div>
                          ) : editingBrand ? "Update Brand" : "Create Brand"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              
              {/* Delete Brand Confirmation */}
              <AlertDialog open={deletingBrandId !== null} onOpenChange={() => setDeletingBrandId(null)}>
                <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      This will permanently delete this brand. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={confirmDeleteBrand}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>
            
            <TabsContent value="categories" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Brand Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    Manage brand categories and their display settings.
                  </p>
                  <div className="flex justify-end mb-4">
                    <Button 
                      onClick={handleAddCategory}
                      className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add New Category
                    </Button>
                  </div>
                  
                  {isCategoriesLoading ? (
                    <div className="animate-pulse space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  ) : categories && categories.length > 0 ? (
                    <div className="rounded-md border border-gray-700">
                      <Table>
                        <TableHeader className="bg-gray-800">
                          <TableRow className="hover:bg-gray-700/50 border-gray-700">
                            <TableHead className="text-gray-400">Category Name</TableHead>
                            <TableHead className="text-gray-400">Display Order</TableHead>
                            <TableHead className="text-gray-400">Brand Count</TableHead>
                            <TableHead className="text-gray-400 text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categories.map(category => {
                            // Find matching category in featuredBrands to get brand count
                            const brandCount = featuredBrands?.find(fb => fb.id === category.id)?.brands.length || 0;
                            
                            return (
                              <TableRow key={category.id} className="hover:bg-gray-700/50 border-gray-700">
                                <TableCell className="font-medium">{category.category}</TableCell>
                                <TableCell>{category.displayOrder || 0}</TableCell>
                                <TableCell>{brandCount}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                                      onClick={() => handleEditCategory(category)}
                                    >
                                      <span className="sr-only">Edit</span>
                                      <Edit size={16} />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-gray-700"
                                      onClick={() => handleDeleteCategory(category.id)}
                                      disabled={brandCount > 0}
                                      title={brandCount > 0 ? "Cannot delete category with brands" : ""}
                                    >
                                      <span className="sr-only">Delete</span>
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No categories found. Click "Add New Category" to create your first category.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Category Dialog */}
              <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-xl">
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {editingCategory 
                        ? "Edit category details below and save your changes." 
                        : "Fill in the category details to add it to your store."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...categoryForm}>
                    <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
                      <FormField
                        control={categoryForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-900 border-gray-700 text-white" 
                                placeholder="Enter category name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={categoryForm.control}
                        name="bgClass"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background Class</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-900 border-gray-700 text-white" 
                                placeholder="bg-gradient-to-br from-gray-900 to-gray-800"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-gray-500 text-xs">
                              Tailwind CSS class for the background of this category in carousels.
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={categoryForm.control}
                        name="displayOrder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Order</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-900 border-gray-700 text-white" 
                                type="number"
                                min={0}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-gray-500 text-xs">
                              Lower numbers display first on the homepage.
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={categoryForm.control}
                        name="intervalMs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Carousel Interval (ms)</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-900 border-gray-700 text-white" 
                                type="number"
                                min={1000}
                                step={500}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-gray-500 text-xs">
                              Time in milliseconds between slides in the carousel (1000 = 1 second).
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter className="gap-2 sm:gap-0 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="border-gray-600 hover:bg-gray-700 text-gray-300"
                          onClick={() => setCategoryDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-primary hover:bg-primary/90"
                          disabled={categoryForm.formState.isSubmitting}
                        >
                          {categoryForm.formState.isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <RefreshCcw size={16} className="animate-spin" />
                              Saving...
                            </div>
                          ) : editingCategory ? "Update Category" : "Create Category"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              
              {/* Delete Category Confirmation */}
              <AlertDialog open={deletingCategoryId !== null} onOpenChange={() => setDeletingCategoryId(null)}>
                <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      This will permanently delete this category. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={confirmDeleteCategory}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>
            
            <TabsContent value="store-hours" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Manage Store Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    Update the operating hours for each of your store locations.
                  </p>
                  
                  {isStoreLocationsLoading ? (
                    <div className="animate-pulse space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-14 bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  ) : storeLocations && storeLocations.length > 0 ? (
                    <div className="space-y-8">
                      {storeLocations.map(location => (
                        <div key={location.id} className="rounded-lg border border-gray-700 overflow-hidden">
                          <div className="bg-gray-800 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded bg-gray-700 overflow-hidden border border-gray-600">
                                <img 
                                  src={location.image} 
                                  alt={location.name} 
                                  className="w-full h-full object-cover" 
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Store';
                                  }}
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-lg">{location.name}</h3>
                                <p className="text-sm text-gray-400">{location.city} - {location.phone}</p>
                              </div>
                            </div>
                            <Button 
                              onClick={() => {
                                // Set up the store hours editing
                                setEditingStoreLocation(location);
                                setStoreHoursDialogOpen(true);
                              }}
                              className="bg-primary hover:bg-primary/90 flex items-center gap-2 text-sm"
                              size="sm"
                            >
                              <Clock size={14} />
                              Edit Hours
                            </Button>
                          </div>
                          
                          <div className="p-4 bg-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Regular Hours</h4>
                                <div className="space-y-1">
                                  {location.opening_hours && Object.entries(location.opening_hours).map(([day, hours]) => (
                                    <div key={day} className="flex justify-between text-sm">
                                      <span className="text-gray-400 font-medium w-28">{day}</span>
                                      <span>{hours}</span>
                                    </div>
                                  ))}
                                  {(!location.opening_hours || Object.keys(location.opening_hours).length === 0) && (
                                    <div className="text-sm text-gray-400 italic">
                                      No regular hours set.
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-2">Special Hours & Closures</h4>
                                {location.closed_days ? (
                                  <div className="space-y-1">
                                    <div className="text-sm text-gray-300">
                                      {location.closed_days}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-400 italic">
                                    No special hours or holiday closures set.
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No store locations found. Please add store locations first to manage their hours.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Store Location Dialog */}
              <Dialog open={storeLocationDialogOpen} onOpenChange={setStoreLocationDialogOpen}>
                <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-4 w-[calc(100%-2rem)]">
                  <DialogHeader>
                    <DialogTitle>{editingStoreLocation ? "Edit Store Location" : "Add New Store Location"}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {editingStoreLocation 
                        ? "Edit store location details below and save your changes." 
                        : "Fill in the store location details to add it to your system."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...storeLocationForm}>
                    <form onSubmit={storeLocationForm.handleSubmit(onStoreLocationSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={storeLocationForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Store Name</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-gray-900 border-gray-700 text-white" 
                                  placeholder="Vape Cave"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={storeLocationForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-gray-900 border-gray-700 text-white" 
                                  placeholder="Arlington"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={storeLocationForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-gray-900 border-gray-700 text-white" 
                                  placeholder="123 Main St"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={storeLocationForm.control}
                          name="full_address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Address</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-gray-900 border-gray-700 text-white" 
                                  placeholder="123 Main St, Arlington, TX 76010"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={storeLocationForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-gray-900 border-gray-700 text-white" 
                                  placeholder="(123) 456-7890"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={storeLocationForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-gray-900 border-gray-700 text-white" 
                                  placeholder="store@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="border-t border-gray-700 pt-4">
                        <h3 className="font-medium mb-2">Location Map Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={storeLocationForm.control}
                            name="lat"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Latitude</FormLabel>
                                <FormControl>
                                  <Input
                                    className="bg-gray-900 border-gray-700 text-white" 
                                    placeholder="32.735687"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={storeLocationForm.control}
                            name="lng"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Longitude</FormLabel>
                                <FormControl>
                                  <Input
                                    className="bg-gray-900 border-gray-700 text-white" 
                                    placeholder="-97.108066"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-700 pt-4">
                        <h3 className="font-medium mb-2">More Information</h3>
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={storeLocationForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Store Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    className="bg-gray-900 border-gray-700 text-white min-h-[100px]" 
                                    placeholder="Enter a detailed description of this store location..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <DialogFooter className="pt-4">
                        <Button 
                          type="submit" 
                          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                          disabled={storeLocationForm.formState.isSubmitting}
                        >
                          {storeLocationForm.formState.isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <RefreshCcw size={16} className="animate-spin" />
                              Saving...
                            </div>
                          ) : (
                            "Save Store Location"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              
              {/* Store Location Delete Confirmation */}
              <AlertDialog open={!!deletingStoreLocationId} onOpenChange={() => setDeletingStoreLocationId(null)}>
                <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      This action cannot be undone. This will permanently delete the
                      store location and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:bg-gray-700 hover:text-white border-gray-600">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={confirmDeleteStoreLocation}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>
            
            <TabsContent value="blog" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle>Blog Categories</CardTitle>
                    <Button 
                      onClick={() => {
                        setEditingBlogCategory(null);
                        setBlogCategoryDialogOpen(true);
                      }}
                      className="bg-primary hover:bg-primary/90 flex items-center gap-1 h-8 px-3"
                      size="sm"
                    >
                      <Plus size={14} />
                      <span className="hidden sm:inline">Add Category</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 mb-4 text-sm">
                      Manage your blog categories for organizing blog posts.
                    </p>
                    
                    {isBlogCategoriesLoading ? (
                      <div className="animate-pulse space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-14 bg-gray-700 rounded"></div>
                        ))}
                      </div>
                    ) : blogCategories && blogCategories.length > 0 ? (
                      <div className="rounded-md border border-gray-700">
                        <Table>
                          <TableHeader className="bg-gray-800">
                            <TableRow className="hover:bg-gray-700/50 border-gray-700">
                              <TableHead className="text-gray-400">Name</TableHead>
                              <TableHead className="text-gray-400">Slug</TableHead>
                              <TableHead className="text-gray-400">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {blogCategories.map((category: any) => (
                              <TableRow key={category.id} className="hover:bg-gray-700/50 border-gray-700">
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                                      onClick={() => {
                                        setEditingBlogCategory(category);
                                        setBlogCategoryDialogOpen(true);
                                      }}
                                    >
                                      <span className="sr-only">Edit</span>
                                      <Edit size={16} />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-gray-700"
                                      onClick={() => setDeletingBlogCategoryId(category.id)}
                                    >
                                      <span className="sr-only">Delete</span>
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <p>No blog categories found. Click "Add New Category" to create your first category.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle>Recent Blog Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 mb-4">
                      Quick summary of recent blog posts and their status.
                    </p>
                    {isBlogPostsLoading ? (
                      <div className="animate-pulse space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-14 bg-gray-700 rounded"></div>
                        ))}
                      </div>
                    ) : blogPosts && blogPosts.length > 0 ? (
                      <div className="space-y-3">
                        {blogPosts.slice(0, 5).map((post: any) => (
                          <div key={post.id} className="flex items-center gap-3 p-3 border border-gray-700 rounded-md">
                            <div className="flex-1">
                              <div className="font-medium">{post.title}</div>
                              <div className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {post.published ? (
                                <div className="flex items-center text-sm text-green-500">
                                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                                  Published
                                </div>
                              ) : (
                                <div className="flex items-center text-sm text-yellow-500">
                                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                                  Draft
                                </div>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                                onClick={() => {
                                  setEditingBlogPost(post);
                                  setBlogPostDialogOpen(true);
                                }}
                              >
                                <span className="sr-only">Edit</span>
                                <Edit size={16} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <p>No blog posts found. Add a blog category first, then create your first post.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle>Blog Posts</CardTitle>
                  <Button 
                    onClick={() => {
                      setEditingBlogPost(null);
                      setBlogPostDialogOpen(true);
                    }}
                    className="bg-primary hover:bg-primary/90 flex items-center gap-1 h-9 px-3"
                    size="sm"
                    disabled={!blogCategories || blogCategories.length === 0}
                  >
                    <Plus size={14} />
                    <span className="hidden sm:inline">Add New Post</span>
                    <span className="sm:hidden">Add Post</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    Manage all your blog content from this section. Create, edit and publish articles.
                  </p>
                  
                  {isBlogPostsLoading ? (
                    <div className="animate-pulse space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  ) : blogPosts && blogPosts.length > 0 ? (
                    <div className="rounded-md border border-gray-700 overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-gray-800">
                          <TableRow className="hover:bg-gray-700/50 border-gray-700">
                            <TableHead className="text-gray-400">Title</TableHead>
                            <TableHead className="text-gray-400 hidden md:table-cell">Category</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-gray-400 hidden md:table-cell">Date</TableHead>
                            <TableHead className="text-gray-400 text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {blogPosts.map((post: any) => {
                            const category = blogCategories?.find((c: any) => c.id === post.categoryId);
                            return (
                              <TableRow key={post.id} className="hover:bg-gray-700/50 border-gray-700">
                                <TableCell className="font-medium">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <div className="flex items-center gap-2">
                                      {post.featured && (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div className="text-yellow-500">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                              </svg>
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent side="top" className="bg-black text-white border-gray-700">
                                            Featured Post
                                          </TooltipContent>
                                        </Tooltip>
                                      )}
                                      {post.title}
                                    </div>
                                    <div className="text-xs text-gray-400 md:hidden">
                                      {category?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{category?.name || 'Unknown'}</TableCell>
                                <TableCell>
                                  {post.published ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                      Published
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                      Draft
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                                      onClick={() => {
                                        setEditingBlogPost(post);
                                        setBlogPostDialogOpen(true);
                                      }}
                                    >
                                      <span className="sr-only">Edit</span>
                                      <Edit size={16} />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-gray-700"
                                      onClick={() => setDeletingBlogPostId(post.id)}
                                    >
                                      <span className="sr-only">Delete</span>
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No blog posts found. Click "Add New Post" to create your first article.</p>
                      {(!blogCategories || blogCategories.length === 0) && (
                        <p className="mt-2 text-sm text-yellow-500">You need to create a blog category first before adding posts.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Blog Category Dialog */}
              <Dialog open={blogCategoryDialogOpen} onOpenChange={setBlogCategoryDialogOpen}>
                <DialogContent className="bg-gray-800 text-white border-gray-700 max-h-[90vh] overflow-y-auto mx-4 w-[calc(100%-2rem)]">
                  <DialogHeader>
                    <DialogTitle>{editingBlogCategory ? "Edit Blog Category" : "Add New Blog Category"}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {editingBlogCategory 
                        ? "Edit blog category details below and save your changes." 
                        : "Fill in the category details to organize your blog content."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...blogCategoryForm}>
                    <form onSubmit={blogCategoryForm.handleSubmit(onBlogCategorySubmit)} className="space-y-4">
                      <FormField
                        control={blogCategoryForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-900 border-gray-700 text-white" 
                                placeholder="Enter category name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={blogCategoryForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL Slug</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-900 border-gray-700 text-white" 
                                placeholder="Enter URL slug (e.g., vaping-tips)"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-gray-500">
                              This will be used in the URL for this category (only lowercase letters, numbers, and hyphens)
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={blogCategoryForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                className="bg-gray-900 border-gray-700 text-white" 
                                placeholder="Enter category description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={blogCategoryForm.control}
                        name="displayOrder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Order</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-900 border-gray-700 text-white" 
                                type="number"
                                placeholder="Enter display order (lower numbers appear first)"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-gray-500">
                              Categories will be sorted by this number, lower numbers appear first
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    
                      <DialogFooter className="pt-4">
                        <Button 
                          type="submit" 
                          className="bg-primary hover:bg-primary/90"
                        >
                          {editingBlogCategory ? "Save Changes" : "Create Category"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              
              {/* Blog Post Dialog */}
              <Dialog open={blogPostDialogOpen} onOpenChange={setBlogPostDialogOpen}>
                <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-3xl max-h-[90vh] overflow-y-auto mx-4 w-[calc(100%-2rem)]">
                  <DialogHeader>
                    <DialogTitle>{editingBlogPost ? "Edit Blog Post" : "Add New Blog Post"}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {editingBlogPost 
                        ? "Edit blog post details below and save your changes." 
                        : "Create a new blog post with the details below."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...blogPostForm}>
                    <form onSubmit={blogPostForm.handleSubmit(onBlogPostSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={blogPostForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Post Title</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-gray-900 border-gray-700 text-white" 
                                  placeholder="Enter post title"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={blogPostForm.control}
                          name="slug"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL Slug</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-gray-900 border-gray-700 text-white" 
                                  placeholder="Enter URL slug (e.g., benefits-of-vaping)"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={blogPostForm.control}
                          name="categoryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select 
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                defaultValue={field.value ? field.value.toString() : undefined}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                  {blogCategories?.map((category: any) => (
                                    <SelectItem 
                                      key={category.id} 
                                      value={category.id.toString()}
                                      className="hover:bg-gray-800 focus:bg-gray-800"
                                    >
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={blogPostForm.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Featured Image URL</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-gray-900 border-gray-700 text-white" 
                                  placeholder="Enter image URL"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={blogPostForm.control}
                        name="summary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Summary</FormLabel>
                            <FormControl>
                              <Textarea
                                className="bg-gray-900 border-gray-700 text-white" 
                                placeholder="Enter post summary (appears in previews and snippets)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={blogPostForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Post Content</FormLabel>
                            <FormControl>
                              <Textarea
                                className="bg-gray-900 border-gray-700 text-white min-h-[200px]" 
                                placeholder="Enter post content (markdown supported)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={blogPostForm.control}
                          name="published"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Published
                                </FormLabel>
                                <FormDescription className="text-gray-500">
                                  Make this post visible to the public
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-primary"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={blogPostForm.control}
                          name="featured"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Featured Post
                                </FormLabel>
                                <FormDescription className="text-gray-500">
                                  Highlight this post in featured sections
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-primary"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-3 pt-3 border-t border-gray-700">
                        <h4 className="text-sm font-medium text-gray-300">SEO Settings</h4>
                        
                        <FormField
                          control={blogPostForm.control}
                          name="metaTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meta Title</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-gray-900 border-gray-700 text-white" 
                                  placeholder="Enter SEO title (leave empty to use post title)"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={blogPostForm.control}
                          name="metaDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meta Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  className="bg-gray-900 border-gray-700 text-white" 
                                  placeholder="Enter SEO description (leave empty to use post summary)"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      </div>
                    
                      <DialogFooter className="pt-4">
                        <Button 
                          type="submit" 
                          className="bg-primary hover:bg-primary/90"
                        >
                          {editingBlogPost ? "Save Changes" : "Create Post"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              
              {/* Delete Blog Category Confirmation Dialog */}
              <AlertDialog open={!!deletingBlogCategoryId} onOpenChange={(open) => !open && setDeletingBlogCategoryId(null)}>
                <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this category?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      This will permanently delete the blog category and all of its associated posts.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                      onClick={confirmDeleteBlogCategory}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              {/* Delete Blog Post Confirmation Dialog */}
              <AlertDialog open={!!deletingBlogPostId} onOpenChange={(open) => !open && setDeletingBlogPostId(null)}>
                <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      This will permanently delete the blog post.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                      onClick={confirmDeleteBlogPost}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Website Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* User Management Section */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">User Management</h3>
                    <p className="text-gray-400 mb-4">
                      Add additional admin users who can access the dashboard.
                    </p>
                    <div className="flex justify-end mb-4">
                      <Button 
                        onClick={handleAddUser}
                        className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Add New Admin User
                      </Button>
                    </div>
                    
                    {/* User Management Dialog */}
                    <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                      <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Create Admin User</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Add a new administrator who can access all dashboard features.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...userForm}>
                          <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                            <FormField
                              control={userForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input
                                      className="bg-gray-900 border-gray-700 text-white" 
                                      placeholder="Enter username"
                                      autoComplete="off"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={userForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input
                                      className="bg-gray-900 border-gray-700 text-white" 
                                      type="password"
                                      placeholder="Enter password"
                                      autoComplete="new-password"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription className="text-gray-500 text-xs">
                                    Password must be at least 6 characters.
                                  </FormDescription>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={userForm.control}
                              name="isAdmin"
                              render={({ field }) => (
                                <FormItem className="hidden">
                                  <FormControl>
                                    <input type="hidden" {...field} value="true" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <DialogFooter className="gap-2 sm:gap-0 pt-4">
                              <Button
                                type="button"
                                variant="outline"
                                className="border-gray-600 hover:bg-gray-700 text-gray-300"
                                onClick={() => setUserDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                type="submit"
                                className="bg-primary hover:bg-primary/90"
                                disabled={userForm.formState.isSubmitting}
                              >
                                {userForm.formState.isSubmitting ? (
                                  <div className="flex items-center gap-2">
                                    <RefreshCcw size={16} className="animate-spin" />
                                    Creating...
                                  </div>
                                ) : "Create Admin User"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {/* Store Information Section */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">About the Admin Dashboard</h3>
                    <div className="space-y-4 text-gray-300">
                      <p>This admin dashboard allows you to manage your vape shop's content:</p>
                      <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>
                          <strong>Brands Management:</strong> Add, edit, and delete product brands. 
                          Each brand requires a name, image URL, and description.
                        </li>
                        <li>
                          <strong>Categories Management:</strong> Create and manage brand categories.
                          Categories are used to organize brands in the carousel display.
                        </li>
                        <li>
                          <strong>User Management:</strong> Add additional admin users who can access the dashboard.
                        </li>
                      </ul>
                      
                      <div className="p-4 bg-gray-700/50 rounded-md mt-4">
                        <h4 className="font-semibold mb-2">Tips:</h4>
                        <ul className="list-disc list-inside space-y-1 pl-4 text-sm">
                          <li>Use high-quality, consistent brand images for the best appearance</li>
                          <li>Set display order to control the sequence of categories and brands</li>
                          <li>Carousel interval controls how fast the brand slides change</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}