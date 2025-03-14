import { Link } from "wouter";
import MainLayout from "@/layouts/MainLayout";
import { products } from "@/data/products";
import { useState, useEffect } from "react";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [animateHero, setAnimateHero] = useState(false);
  
  // Trigger animation after component mounts
  useEffect(() => {
    setAnimateHero(true);
  }, []);
  
  // Filter products by category
  const filteredProducts = activeCategory === "all" 
    ? products.slice(0, 4) // Show only first 4 products on homepage
    : products.filter(product => product.category === activeCategory).slice(0, 4);
  
  return (
    <MainLayout
      title="Vape Cave - Premium Vaping Products"
      description="Welcome to Vape Cave - your one-stop shop for premium vaping products, e-liquids, and accessories. Visit our stores in Frisco and Arlington, TX."
    >
      {/* Hero Section */}
      <section className="hero-section min-h-screen flex items-center pt-20 pb-16 md:pt-24 md:pb-24">
        <div className="hero-pattern"></div>
        <div className="container mx-auto px-6 relative">
          <div className={`max-w-4xl transition-all duration-1000 ${animateHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-light-text">
              Premium <span className="text-orange">Vaping</span> Experience
            </h1>
            <div className="divider-orange ml-0"></div>
            <h2 className="text-xl md:text-2xl font-light mt-6 mb-8 text-light-gray max-w-2xl">
              Your one-stop destination for all your smoking needs: <span className="text-orange font-medium">Disposables</span>, <span className="text-orange font-medium">E-Liquids</span>, <span className="text-orange font-medium">Delta</span>, <span className="text-orange font-medium">Glass</span>, and much more.
            </h2>
            
            <div className="flex flex-wrap gap-5 mt-10">
              <Link href="/products">
                <a className="btn-primary px-8 py-3 rounded-md text-lg inline-block transform transition hover:-translate-y-1">
                  Explore Products
                </a>
              </Link>
              <Link href="/locations">
                <a className="btn-outline px-8 py-3 rounded-md text-lg inline-block transform transition hover:-translate-y-1">
                  Find Our Stores
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-dark-surface">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
          <p className="text-light-gray max-w-2xl mb-12">Discover our most popular products and new arrivals.</p>
          
          {/* Product Categories Navigation */}
          <div className="flex justify-start mb-12 overflow-x-auto pb-3 -mx-2">
            <div className="inline-flex border border-gray-700 rounded-md">
              <button 
                className={`px-5 py-2 rounded-md font-medium text-sm transition ${activeCategory === "all" ? "bg-orange text-dark-bg" : "text-light-text hover:text-orange"}`} 
                onClick={() => setActiveCategory("all")}
              >
                All
              </button>
              <button 
                className={`px-5 py-2 rounded-md font-medium text-sm transition ${activeCategory === "devices" ? "bg-orange text-dark-bg" : "text-light-text hover:text-orange"}`} 
                onClick={() => setActiveCategory("devices")}
              >
                Devices
              </button>
              <button 
                className={`px-5 py-2 rounded-md font-medium text-sm transition ${activeCategory === "e-liquids" ? "bg-orange text-dark-bg" : "text-light-text hover:text-orange"}`} 
                onClick={() => setActiveCategory("e-liquids")}
              >
                E-Liquids
              </button>
              <button 
                className={`px-5 py-2 rounded-md font-medium text-sm transition ${activeCategory === "accessories" ? "bg-orange text-dark-bg" : "text-light-text hover:text-orange"}`} 
                onClick={() => setActiveCategory("accessories")}
              >
                Accessories
              </button>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="product-card rounded-lg animate-fade-in"
              >
                <div className="relative overflow-hidden aspect-square">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {product.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-block bg-orange text-dark-bg text-xs font-semibold rounded-full px-3 py-1.5">
                        {product.featuredLabel}
                      </span>
                    </div>
                  )}
                </div>
                <div className="product-card-content">
                  <h3 className="font-medium text-lg mb-2 text-light-text">{product.name}</h3>
                  <p className="text-light-gray text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    <button className="btn-primary py-2 px-4 rounded-md text-sm inline-block">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-14">
            <Link href="/products">
              <a className="btn-outline px-8 py-3 rounded-md inline-block">
                View All Products
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Locations Preview Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-3xl md:text-4xl font-bold mb-2">Our Locations</h2>
          <p className="text-light-gray max-w-2xl mb-12">Visit us at one of our convenient stores for personalized service.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Location 1 */}
            <div className="location-card rounded-lg overflow-hidden animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="h-56 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Vape Cave Main Street Location" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-4 text-light-text">Frisco Location</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start text-light-gray">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>6958 Main St, Frisco, TX 75033</span>
                  </div>
                  <div className="flex items-start text-light-gray">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>(469) 294-0061</span>
                  </div>
                  <div className="flex items-start text-light-gray">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>10:00 AM - 12:00 AM (1:00 AM Fri-Sat)</span>
                  </div>
                </div>
                
                <Link href="/locations">
                  <a className="btn-primary py-2 px-6 rounded-md inline-block">
                    View Details
                  </a>
                </Link>
              </div>
            </div>
            
            {/* Location 2 */}
            <div className="location-card rounded-lg overflow-hidden animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="h-56 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Vape Cave Oak Avenue Location" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-4 text-light-text">Arlington Location</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start text-light-gray">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>4100 S Cooper St, Unit 4108, Arlington, TX 76015</span>
                  </div>
                  <div className="flex items-start text-light-gray">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>(682) 270-0334</span>
                  </div>
                  <div className="flex items-start text-light-gray">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>10:00 AM - 11:00 PM (Daily)</span>
                  </div>
                </div>
                
                <Link href="/locations">
                  <a className="btn-primary py-2 px-6 rounded-md inline-block">
                    View Details
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefit Cards Section */}
      <section className="py-20 bg-dark-surface">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-3xl md:text-4xl font-bold mb-2">Why Choose Us</h2>
          <p className="text-light-gray max-w-2xl mb-12">Experience the Vape Cave difference.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 rounded-lg animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 rounded-full bg-orange/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-light-text">Premium Quality</h3>
              <p className="text-light-gray">We carefully select only the highest quality products from trusted manufacturers for our inventory.</p>
            </div>
            
            <div className="card p-6 rounded-lg animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="w-12 h-12 rounded-full bg-orange/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-light-text">Competitive Prices</h3>
              <p className="text-light-gray">Enjoy the best products at affordable prices with regular deals and promotions.</p>
            </div>
            
            <div className="card p-6 rounded-lg animate-fade-in" style={{animationDelay: '0.5s'}}>
              <div className="w-12 h-12 rounded-full bg-orange/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-light-text">Expert Advice</h3>
              <p className="text-light-gray">Our knowledgeable staff can help you find the perfect products for your needs and preferences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Age Verification Notice */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto border border-orange/30 p-8 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-orange/20 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-light-text">Age Verification Required</h2>
            </div>
            <p className="text-light-gray mb-2">Our products are intended for adult smokers aged 21 and over. Proof of age will be required upon purchase both online and in our physical stores.</p>
            <p className="text-light-gray/80 text-sm">We strictly adhere to all local, state, and federal regulations regarding the sale of vaping products.</p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
