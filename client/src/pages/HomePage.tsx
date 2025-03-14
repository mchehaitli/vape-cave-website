import { Link } from "wouter";
import MainLayout from "@/layouts/MainLayout";
import { products } from "@/data/products";
import { useState } from "react";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Filter products by category
  const filteredProducts = activeCategory === "all" 
    ? products.slice(0, 4) // Show only first 4 products on homepage
    : products.filter(product => product.category === activeCategory).slice(0, 4);
  
  return (
    <MainLayout
      title="Vape Cave - Premium Vaping Products"
      description="Welcome to Vape Cave - your one-stop shop for premium vaping products, e-liquids, and accessories. Visit our stores in City A and City B."
    >
      {/* Hero Section */}
      <section id="home" className="bg-secondary py-16 md:py-24 text-white relative">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1562766179-629c3df11035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-4">Premium Vaping Experience</h2>
            <p className="text-lg mb-8">Discover our wide selection of high-quality vape products, e-liquids, and accessories at Vape Cave - your ultimate destination for all vaping needs.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <a className="bg-primary hover:bg-primary/90 text-black font-bold py-3 px-6 rounded-md transition-colors">Shop Now</a>
              </Link>
              <Link href="/locations">
                <a className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-3 px-6 rounded-md transition-colors">Find Our Stores</a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Poppins'] mb-3">Featured Products</h2>
            <p className="text-dark/70 max-w-2xl mx-auto">Check out our most popular items and latest additions to our collection.</p>
          </div>
          
          {/* Product Categories Navigation */}
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            <div className="inline-flex bg-light rounded-lg p-1">
              <button 
                className={`px-4 py-2 rounded-md font-medium text-sm md:text-base ${activeCategory === "all" ? "bg-primary text-black" : ""}`} 
                onClick={() => setActiveCategory("all")}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 rounded-md font-medium text-sm md:text-base ${activeCategory === "devices" ? "bg-primary text-black" : ""}`} 
                onClick={() => setActiveCategory("devices")}
              >
                Devices
              </button>
              <button 
                className={`px-4 py-2 rounded-md font-medium text-sm md:text-base ${activeCategory === "e-liquids" ? "bg-primary text-black" : ""}`} 
                onClick={() => setActiveCategory("e-liquids")}
              >
                E-Liquids
              </button>
              <button 
                className={`px-4 py-2 rounded-md font-medium text-sm md:text-base ${activeCategory === "accessories" ? "bg-primary text-black" : ""}`} 
                onClick={() => setActiveCategory("accessories")}
              >
                Accessories
              </button>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-56 object-cover"
                />
                <div className="p-5">
                  {product.featured && (
                    <span className="inline-block bg-primary/10 text-primary text-xs font-semibold rounded-full px-3 py-1 mb-2">
                      {product.featuredLabel}
                    </span>
                  )}
                  <h3 className="font-['Poppins'] font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-dark/70 text-sm mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    <button className="bg-primary hover:bg-primary/90 text-black font-medium py-2 px-4 rounded-md transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products">
              <a className="inline-block bg-secondary hover:bg-dark text-white font-bold py-3 px-8 rounded-md transition-colors">
                View All Products
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Locations Preview Section */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Poppins'] mb-3">Our Locations</h2>
            <p className="text-dark/70 max-w-2xl mx-auto">Visit us at one of our convenient locations for personalized service and expert advice.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Location 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Vape Cave Main Street Location" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-['Poppins'] font-semibold text-xl mb-3">City A Location</h3>
                <div className="space-y-2 mb-5">
                  <div className="flex items-start">
                    <i className="fas fa-map-marker-alt text-primary mt-1 mr-3"></i>
                    <span>123 Main Street, City A</span>
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-phone-alt text-primary mt-1 mr-3"></i>
                    <span>555-123-4567</span>
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-clock text-primary mt-1 mr-3"></i>
                    <span>10 AM - 8 PM (Monday - Saturday)</span>
                  </div>
                </div>
                
                <Link href="/locations">
                  <a className="inline-block bg-primary hover:bg-primary/90 text-black font-bold py-2 px-6 rounded-md transition-colors">
                    View Details
                  </a>
                </Link>
              </div>
            </div>
            
            {/* Location 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Vape Cave Oak Avenue Location" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-['Poppins'] font-semibold text-xl mb-3">City B Location</h3>
                <div className="space-y-2 mb-5">
                  <div className="flex items-start">
                    <i className="fas fa-map-marker-alt text-primary mt-1 mr-3"></i>
                    <span>456 Oak Avenue, City B</span>
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-phone-alt text-primary mt-1 mr-3"></i>
                    <span>555-987-6543</span>
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-clock text-primary mt-1 mr-3"></i>
                    <span>11 AM - 9 PM (Monday - Saturday)</span>
                  </div>
                </div>
                
                <Link href="/locations">
                  <a className="inline-block bg-primary hover:bg-primary/90 text-black font-bold py-2 px-6 rounded-md transition-colors">
                    View Details
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Age Verification Notice */}
      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <i className="fas fa-exclamation-circle text-4xl text-primary mb-4"></i>
            <h2 className="text-2xl font-bold font-['Poppins'] mb-3">Age Verification Required</h2>
            <p className="text-dark mb-4">Our products are intended for adult smokers aged 21 and over. Proof of age will be required upon purchase both online and in our physical stores.</p>
            <p className="text-dark/70 text-sm">We strictly adhere to all local, state, and federal regulations regarding the sale of vaping products.</p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
