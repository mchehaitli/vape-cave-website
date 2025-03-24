import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  featured: boolean;
  featuredLabel?: string;
  created_at: string;
  updated_at: string;
};

/**
 * Hook to fetch all products
 */
export function useProducts() {
  return useQuery({
    queryKey: ['/api/products'],
    queryFn: () => apiRequest('/api/products') as Promise<Product[]>,
  });
}

/**
 * Hook to fetch featured products
 * @param limit Optional limit for number of products to fetch
 */
export function useFeaturedProducts(limit?: number) {
  const queryParams = limit ? `?limit=${limit}` : '';
  
  return useQuery({
    queryKey: ['/api/products/featured', limit],
    queryFn: () => apiRequest(`/api/products/featured${queryParams}`) as Promise<Product[]>,
  });
}

/**
 * Hook to fetch products by category
 * @param category The category to filter products by
 */
export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: ['/api/products/category', category],
    queryFn: () => apiRequest(`/api/products/category/${encodeURIComponent(category)}`) as Promise<Product[]>,
    enabled: !!category && category !== 'all',
  });
}

/**
 * Hook to fetch a product by ID
 * @param id The product ID
 */
export function useProductById(id: number) {
  return useQuery({
    queryKey: ['/api/products', id],
    queryFn: () => apiRequest(`/api/products/${id}`) as Promise<Product>,
    enabled: !!id,
  });
}