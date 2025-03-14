import { Link } from "wouter";
import MainLayout from "@/layouts/MainLayout";
import { products } from "@/data/products";
import { useState } from "react";
import vapeLounge from "../assets/images/vape-lounge.jpg";

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
      <section id="home" className="bg-gray-900 py-16 md:py-28 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/30 mix-blend-multiply"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
            <div className="md:w-1/2 mt-6 md:mt-0 flex items-center justify-center">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/40 max-w-[650px] w-full h-auto">
                <img 
                  src={vapeLounge} 
                  alt="Vape Cave Lounge" 
                  className="w-full h-full object-cover max-h-[380px]"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-6 leading-tight">Premium Vaping Experience</h2>
              <p className="text-lg mb-8 text-white/90">Discover our wide selection of high-quality vape products, e-liquids, and accessories at Vape Cave - your ultimate destination for all vaping needs.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <div className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg cursor-pointer">
                    Shop Now
                  </div>
                </Link>
                <Link href="/locations">
                  <div className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-3 px-8 rounded-lg transition-colors cursor-pointer backdrop-blur-sm">
                    Find Our Stores
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Poppins'] mb-3">Featured Products</h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">Check out our most popular items and latest additions to our collection.</p>
          </div>
          
          {/* Product Categories Navigation */}
          <div className="flex justify-center mb-12 overflow-x-auto pb-2">
            <div className="inline-flex bg-gray-100 rounded-lg p-1.5">
              <button 
                className={`px-5 py-2 rounded-md font-medium text-sm md:text-base transition-all duration-200 ${activeCategory === "all" ? "bg-primary text-white shadow-md" : "text-gray-700 hover:text-primary"}`} 
                onClick={() => setActiveCategory("all")}
              >
                All
              </button>
              <button 
                className={`px-5 py-2 rounded-md font-medium text-sm md:text-base transition-all duration-200 ${activeCategory === "devices" ? "bg-primary text-white shadow-md" : "text-gray-700 hover:text-primary"}`} 
                onClick={() => setActiveCategory("devices")}
              >
                Devices
              </button>
              <button 
                className={`px-5 py-2 rounded-md font-medium text-sm md:text-base transition-all duration-200 ${activeCategory === "e-liquids" ? "bg-primary text-white shadow-md" : "text-gray-700 hover:text-primary"}`} 
                onClick={() => setActiveCategory("e-liquids")}
              >
                E-Liquids
              </button>
              <button 
                className={`px-5 py-2 rounded-md font-medium text-sm md:text-base transition-all duration-200 ${activeCategory === "accessories" ? "bg-primary text-white shadow-md" : "text-gray-700 hover:text-primary"}`} 
                onClick={() => setActiveCategory("accessories")}
              >
                Accessories
              </button>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative overflow-hidden h-56">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {product.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-block bg-primary text-white text-xs font-semibold rounded-full px-3 py-1.5">
                        {product.featuredLabel}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-['Poppins'] font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    <button className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-14">
            <Link href="/products">
              <div className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md cursor-pointer">
                View All Products
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Locations Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Poppins'] mb-3">Our Locations</h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">Visit us at one of our convenient locations for personalized service and expert advice.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Location 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Vape Cave Main Street Location" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-['Poppins'] font-semibold text-xl mb-3">City A Location</h3>
                <div className="space-y-3 mb-5">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">123 Main Street, City A</span>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">555-123-4567</span>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">10 AM - 8 PM (Monday - Saturday)</span>
                  </div>
                </div>
                
                <Link href="/locations">
                  <div className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md cursor-pointer">
                    View Details
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Location 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Vape Cave Oak Avenue Location" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-['Poppins'] font-semibold text-xl mb-3">City B Location</h3>
                <div className="space-y-3 mb-5">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">456 Oak Avenue, City B</span>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">555-987-6543</span>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">11 AM - 9 PM (Monday - Saturday)</span>
                  </div>
                </div>
                
                <Link href="/locations">
                  <div className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md cursor-pointer">
                    View Details
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Age Verification Notice */}
      <section className="py-14 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold font-['Poppins'] mb-3">Age Verification Required</h2>
            <p className="text-gray-700 mb-4">Our products are intended for adult smokers aged 21 and over. Proof of age will be required upon purchase both online and in our physical stores.</p>
            <p className="text-gray-500 text-sm">We strictly adhere to all local, state, and federal regulations regarding the sale of vaping products.</p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
