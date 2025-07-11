import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  hidePrice?: boolean; // New field to hide price completely
  category: string;
  featured?: boolean;
  featuredLabel?: string;
  stock?: number;
  created_at?: string;
  updated_at?: string;
}

// Custom hook to fetch products
function useProducts(category?: string) {
  return useQuery({
    queryKey: category && category !== "all" 
      ? ["/api/products/category", category]
      : ["/api/products"],
    queryFn: async () => {
      const url = category && category !== "all"
        ? `/api/products/category/${category}`
        : `/api/products`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      
      return response.json() as Promise<Product[]>;
    }
  });
}

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: products, isLoading, error } = useProducts(activeCategory);
  
  const categories = [
    { id: "all", name: "All Products" },
    { id: "devices", name: "Vaping Devices" },
    { id: "e-liquids", name: "E-Liquids" },
    { id: "accessories", name: "Accessories" }
  ];
  
  return (
    <MainLayout
      title="Products - Vape Cave"
      description="Browse our extensive collection of premium vaping devices, e-liquids, and accessories at Vape Cave."
    >
      {/* Products Header */}
      <section className="bg-secondary py-10 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold font-['Poppins'] mb-2">Our Products</h1>
          <p className="text-white/80 max-w-2xl">
            Explore our wide selection of high-quality vaping products. We source from top manufacturers to bring you the best vaping experience.
          </p>
        </div>
      </section>
      
      {/* Product Categories */}
      <section className="bg-zinc-800 py-8 border-b border-zinc-700 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-['Poppins'] font-medium text-white">Filter by:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeCategory === category.id 
                      ? "bg-primary text-black shadow-lg" 
                      : "bg-zinc-700 text-white hover:bg-primary/70 hover:text-black"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Grid */}
      <section className="py-12 bg-zinc-900">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden shadow-md">
                  <Skeleton className="w-full h-56 bg-zinc-700" />
                  <div className="p-5">
                    <Skeleton className="h-6 w-3/4 mb-2 bg-zinc-700" />
                    <Skeleton className="h-4 w-full mb-1 bg-zinc-700" />
                    <Skeleton className="h-4 w-5/6 mb-4 bg-zinc-700" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-16 bg-zinc-700" />
                      <Skeleton className="h-10 w-28 bg-zinc-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <p className="text-xl font-medium text-red-500">
                Error loading products. Please try again later.
              </p>
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                    {product.featured && (
                      <span className="absolute top-3 right-3 bg-primary text-black text-xs font-bold rounded-full px-3 py-1">
                        {product.featuredLabel || "Featured"}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-['Poppins'] font-semibold text-lg mb-2 text-white">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      {!product.hidePrice ? (
                        <span className="font-bold text-lg text-primary">
                          {product.price ? `$${Number(product.price).toFixed(2)}` : 'Call for price'}
                        </span>
                      ) : (
                        <span className="font-bold text-lg text-primary">
                          Call for price
                        </span>
                      )}
                      <button className="bg-primary hover:bg-primary/90 text-black font-medium py-2 px-4 rounded-md transition-colors">
                        {product.hidePrice ? 'Inquire' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-white">
              <p className="text-xl font-medium">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Age Verification Notice */}
      <section className="py-10 bg-secondary/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <AlertCircle className="mx-auto h-8 w-8 text-white mb-3" />
            <h2 className="text-xl font-bold font-['Poppins'] mb-2">Age Verification Required</h2>
            <p className="text-white/90">Our products are intended for adult smokers aged 21 and over. Proof of age will be required upon purchase.</p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ProductsPage;
