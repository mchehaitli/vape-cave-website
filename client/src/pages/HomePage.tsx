import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import BrandsCarousel from "@/components/BrandsCarousel";
import { useFeaturedBrands } from "@/hooks/use-brands";
import { 
  useFriscoLocation, 
  useArlingtonLocation,
  getOrderedOpeningHours
} from "@/hooks/use-store-locations";
// Keeping this for fallback
import { featuredBrands } from "@/data/brands";

const HomePage = () => {
  // State for scroll-to-top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Fetch featured brands from API
  const { data: apiBrands, isLoading, error } = useFeaturedBrands();
  
  // Fetch location data from API
  const { data: friscoLocation, isLoading: friscoLoading } = useFriscoLocation();
  const { data: arlingtonLocation, isLoading: arlingtonLoading } = useArlingtonLocation();
  
  // Effect to handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down 300px
      setShowScrollTop(window.scrollY > 300);
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Enhanced home page structured data with focus on Frisco location & Google Maps integration using latest schema.org standards
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://vapecavetx.com/#organization",
    "name": "Vape Cave",
    "url": "https://vapecavetx.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://vapecavetx.com/logo.png",
      "width": 180,
      "height": 60
    },
    "image": [
      "https://vapecavetx.com/vapecave-logo.png",
      "https://vapecavetx.com/vapecave-logo.svg"
    ],
    "description": "Vape Cave offers premium vaping products, e-liquids, disposables, Delta 8, THC-A, and accessories at our convenient Frisco and Arlington, TX locations. We provide expert advice and a wide selection for all your vaping needs.",
    "keywords": "vape shop, vape products, delta 8, thc-a, vape frisco tx, vape accessories, vape store near me",
    "sameAs": [
      "https://facebook.com/vapecavetx",
      "https://instagram.com/vapecavetx",
      "https://twitter.com/vapecavetx",
      "https://yelp.com/biz/vape-cave-frisco"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+14692940061",
        "contactType": "customer service",
        "areaServed": ["Frisco", "Allen", "Plano", "McKinney", "Dallas", "North Texas"],
        "availableLanguage": "English",
        "contactOption": "TollFree"
      }
    ],
    "location": [
      {
        "@type": "VapeShop",
        "@id": "https://vapecavetx.com/locations/frisco",
        "name": "Vape Cave Frisco",
        "url": "https://vapecavetx.com/locations",
        "telephone": "+14692940061",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "6958 Main St #200",
          "addressLocality": "Frisco",
          "addressRegion": "TX",
          "postalCode": "75033",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 33.150730,
          "longitude": -96.822550
        },
        "hasMap": [
          {
            "@type": "Map",
            "name": "Google Maps",
            "url": "https://maps.app.goo.gl/jzbqUDyvvGHuwyXJ7",
            "description": "Find our Frisco vape shop using Google Maps"
          },
          {
            "@type": "Map",
            "name": "Apple Maps",
            "url": "https://maps.apple.com/?address=6958%20Main%20St,%20Unit%20200,%20Frisco,%20TX%20%2075033,%20United%20States&auid=14231591118256703794&ll=33.150849,-96.824392&lsp=9902&q=Vape%20Cave%20Smoke%20%26%20Stuff&t=m",
            "description": "Find our Frisco vape shop on Apple Maps"
          }
        ],
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "googlePlaceId",
            "value": "ChIJxXjrR3wVkFQRcKK89i-aFDw"
          }
        ],
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
            "opens": "10:00",
            "closes": "24:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Friday", "Saturday"],
            "opens": "10:00",
            "closes": "01:00"
          }
        ]
      },
      {
        "@type": "VapeShop",
        "@id": "https://vapecavetx.com/locations/arlington",
        "name": "Vape Cave Arlington",
        "url": "https://vapecavetx.com/locations",
        "telephone": "+16822700334",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "4100 S Cooper St #4108",
          "addressLocality": "Arlington",
          "addressRegion": "TX",
          "postalCode": "76015",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 32.687070,
          "longitude": -97.134800
        },
        "hasMap": [
          {
            "@type": "Map",
            "url": "https://maps.app.goo.gl/7RRoEeD3uzANmdhZA"
          },
          {
            "@type": "Map", 
            "url": "https://maps.apple.com/?address=4100%20S%20Cooper%20St%20%234108,%20Arlington,%20TX%20%2076015,%20United%20States&ll=32.687070,-97.134800&q=Vape%20Cave%20Smoke%20%26%20Stuff&t=m"
          }
        ],
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "googlePlaceId",
            "value": "ChIJ23422NdJSYYRVX94pdZlUGg"
          }
        ],
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "10:00",
            "closes": "23:00"
          }
        ]
      }
    ],
    "potentialAction": [
      {
        "@type": "FindAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://maps.app.goo.gl/jzbqUDyvvGHuwyXJ7"
        },
        "description": "Find directions to our Frisco store using Google Maps",
        "query-input": "required name=location"
      },
      {
        "@type": "FindAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://maps.apple.com/?address=6958%20Main%20St,%20Unit%20200,%20Frisco,%20TX%20%2075033,%20United%20States&auid=14231591118256703794&ll=33.150849,-96.824392&lsp=9902&q=Vape%20Cave%20Smoke%20%26%20Stuff&t=m"
        },
        "description": "Find our Frisco location using Apple Maps",
        "query-input": "required name=location"
      },
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://vapecavetx.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    ],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://vapecavetx.com/"
    }
  };

  return (
    <MainLayout
      title="Vape Cave | Premium Vaping Products & Accessories | Frisco & Arlington TX"
      description="Welcome to Vape Cave - your one-stop shop for premium vaping products, e-liquids, and accessories. Visit our conveniently located stores in Frisco and Arlington, TX."
      canonical="/"
    >
      <Helmet>
        <title>Vape Cave | Premium Vape Shop in Frisco TX | Disposables, Delta 8, THC-A</title>
        <meta name="description" content="Visit Vape Cave in Frisco TX for premium vaping products, disposables, Delta 8, THC-A, and accessories. Located at 6958 Main St #200. Open daily with expert staff and competitive prices." />
        <meta name="keywords" content="vape shop frisco, frisco vape shop, delta 8 frisco, thc-a frisco, disposable vape frisco, vape products frisco tx, vaping frisco, frisco vaporizer shop, vape cave frisco" />
        <link rel="canonical" href="https://vapecavetx.com/" />
        <meta name="geo.position" content="33.150730;-96.822550" />
        <meta name="geo.placename" content="Vape Cave Frisco" />
        <meta name="geo.region" content="US-TX" />
        <meta name="ICBM" content="33.150730, -96.822550" />
        <meta name="google-place-id" content="ChIJxXjrR3wVkFQRcKK89i-aFDw" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vapecavetx.com/" />
        <meta property="og:title" content="Vape Cave Frisco | Premium Vape Shop on Main Street" />
        <meta property="og:description" content="Visit Vape Cave in Frisco at 6958 Main St #200 for premium vaping products, expert advice, and a wide selection for all your vaping needs." />
        <meta property="og:image" content="https://vapecavetx.com/vapecave-logo.png" />
        
        {/* Structured data for search engines */}
        <script type="application/ld+json">
          {JSON.stringify(homePageSchema)}
        </script>
      </Helmet>
      
      {/* Hero Section */}
      <section id="home" className="bg-gray-900 py-20 md:py-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div 
              className="w-full max-w-5xl mx-auto text-center"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold font-['Poppins'] mb-4 leading-tight"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
              >
                Vape into the <span className="text-primary">Future</span>
              </motion.h1>
              <motion.h2 
                className="text-xl md:text-2xl lg:text-3xl mb-8 text-white/90 font-medium max-w-[1100px] mx-auto leading-relaxed"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1, ease: "easeOut" } }
                }}
              >
                Your One Stop Vape Shop for <span className="text-primary font-semibold">Disposables</span> | <span className="text-primary font-semibold">E-Liquids</span> | <span className="text-primary font-semibold">Salts</span> | <span className="text-primary font-semibold">Delta</span> | <span className="text-primary font-semibold">THC - A</span> | <span className="text-primary font-semibold">Glass</span> | <span className="text-primary font-semibold">Tobacco</span> | <span className="text-primary font-semibold">Hookah / Shisha</span> | <span className="text-primary font-semibold">Vaporizers</span> | <span className="text-primary font-semibold">Mods</span> | and much more
              </motion.h2>
              <motion.p 
                className="text-base md:text-lg mb-10 text-white/80 max-w-2xl mx-auto"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2, ease: "easeOut" } }
                }}
              >
                We are a locally owned business specializing in Vaporizers, E-Liquid, Salt Nic, and many different types of disposable devices. We also carry a wide range of glass pipes and accessories as well as Novelties and Hookahs/Shisha. Basically we carry all your smoking needs!
              </motion.p>
              <motion.div 
                className="flex flex-wrap justify-center gap-5 mt-8"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { 
                      duration: 0.4, 
                      delay: 0.3, 
                      ease: "easeOut",
                      staggerChildren: 0.1
                    } 
                  }
                }}
              >
                <motion.div variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 }
                }}>
                  <Link href="/products">
                    <div className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1">
                      Shop Now
                    </div>
                  </Link>
                </motion.div>
                <motion.div variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 }
                }}>
                  <Link href="/locations">
                    <div className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 cursor-pointer backdrop-blur-sm hover:shadow-lg hover:-translate-y-1">
                      Find Our Stores
                    </div>
                  </Link>
                </motion.div>
                <motion.div variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 }
                }}>
                  <Link href="/locations/frisco">
                    <div className="bg-primary/30 hover:bg-primary/40 border border-primary/50 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 cursor-pointer backdrop-blur-sm hover:shadow-lg hover:-translate-y-1">
                      Frisco Store
                    </div>
                  </Link>
                </motion.div>
                <motion.div variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 }
                }}>
                  <Link href="/locations/arlington">
                    <div className="bg-primary/30 hover:bg-primary/40 border border-primary/50 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 cursor-pointer backdrop-blur-sm hover:shadow-lg hover:-translate-y-1">
                      Arlington Store
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Brands Section with rotating categories */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black" id="featured-brands">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Featured <span className="text-primary">Brands</span>
            </motion.h2>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, staggerChildren: 0.1 }}
          >
            {isLoading ? (
              // Loading state
              Array(6).fill(0).map((_, index) => (
                <motion.div
                  key={index}
                  className="rounded-xl shadow-lg bg-gray-800 h-64 animate-pulse"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="p-5 h-16 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700"></div>
                  <div className="p-4 flex-grow flex flex-col items-center justify-center">
                    <div className="h-16 w-full bg-gray-700 rounded mb-2"></div>
                    <div className="h-6 w-32 bg-gray-700 rounded mb-1"></div>
                    <div className="h-4 w-48 bg-gray-700 rounded"></div>
                  </div>
                </motion.div>
              ))
            ) : error ? (
              // Error state - show the fallback data
              featuredBrands.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <BrandsCarousel 
                    category={category.category} 
                    brands={category.brands}
                    intervalMs={5000}
                    bgClass={category.bgClass}
                  />
                </motion.div>
              ))
            ) : (
              // Loaded successfully - show API data
              apiBrands?.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <BrandsCarousel 
                    category={category.category} 
                    brands={category.brands.map(brand => ({
                      ...brand,
                      // Use placeholder image if brand has no image
                      image: brand.image || `/brand-logos/placeholder.svg`
                    }))}
                    intervalMs={category.intervalMs || 5000}
                    bgClass={category.bgClass || "bg-gray-800"}
                  />
                </motion.div>
              ))
            )}
          </motion.div>
          
          <div className="text-center mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/products">
                <div className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  View All Products
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Frisco Location Section - Enhance SEO importance */}
      <section 
        className="py-14 bg-gradient-to-r from-black to-gray-900 text-white" 
        id="frisco-location" 
        itemScope 
        itemType="https://schema.org/VapeShop"
        itemProp="departments"
      >
        <meta itemProp="name" content="Vape Cave Frisco" />
        <meta itemProp="identifier" content="ChIJxXjrR3wVkFQRcKK89i-aFDw" />
        <meta itemProp="alternateName" content="Vape Cave Frisco Main Street" />
        <meta itemProp="description" content="Premier vape shop in Frisco, TX with a wide selection of vaping products, disposables, delta 8, and THC-A products. Conveniently located at 6958 Main St #200." />
        <meta itemProp="image" content="https://vapecavetx.com/vapecave-logo.png" />
        <meta itemProp="url" content="https://vapecavetx.com/locations/frisco" />
        <meta itemProp="priceRange" content="$$" />
        <meta itemProp="telephone" content="+14692940061" />
        <meta itemProp="email" content="vapecavetx@gmail.com" />
        <div 
          itemProp="address" 
          itemScope 
          itemType="https://schema.org/PostalAddress"
        >
          <meta itemProp="streetAddress" content="6958 Main St #200" />
          <meta itemProp="addressLocality" content="Frisco" />
          <meta itemProp="addressRegion" content="TX" />
          <meta itemProp="postalCode" content="75033" />
          <meta itemProp="addressCountry" content="US" />
        </div>
        <div 
          itemProp="geo" 
          itemScope 
          itemType="https://schema.org/GeoCoordinates"
        >
          <meta itemProp="latitude" content="33.150730" />
          <meta itemProp="longitude" content="-96.822550" />
        </div>
        <motion.div 
          className="container mx-auto px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div 
              className="md:w-1/2 order-2 md:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <motion.h2 
                className="text-3xl font-bold font-['Poppins'] mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Visit Us in Downtown Frisco
              </motion.h2>
              <motion.div 
                className="h-1 w-24 bg-primary rounded-full mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              ></motion.div>
              <motion.p 
                className="text-gray-300 mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Our Frisco location is conveniently located at <span className="text-primary font-semibold">6958 Main St #200, Frisco, TX 75033</span>. 
                Use our direct Google Maps or Apple Maps links below to navigate to our store with ease.
              </motion.p>
              
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h3 className="text-xl font-semibold mb-3">Why Visit Our Frisco Location?</h3>
                <motion.ul 
                  className="space-y-2 text-gray-300"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.12
                      }
                    }
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <motion.li 
                    className="flex items-start"
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      show: { opacity: 1, x: 0 }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Located in the heart of downtown Frisco
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      show: { opacity: 1, x: 0 }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Knowledgeable staff to guide your selections
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      show: { opacity: 1, x: 0 }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Latest products always in stock
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      show: { opacity: 1, x: 0 }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {friscoLocation?.openingHours
                      ? `Extended hours on Friday and Saturday (${getOrderedOpeningHours(friscoLocation.openingHours)
                          .filter(({day}) => day === 'Friday' || day === 'Saturday')
                          .map(({day, hours}) => hours)
                          .join(' & ')})` 
                      : 'Extended hours on Friday and Saturday'}
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      show: { opacity: 1, x: 0 }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ample parking available
                  </motion.li>
                </motion.ul>
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap gap-3"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <motion.a 
                  href="https://maps.app.goo.gl/jzbqUDyvvGHuwyXJ7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded transition-colors"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Google Maps
                </motion.a>
                <motion.a 
                  href="https://maps.apple.com/?address=6958%20Main%20St,%20Unit%20200,%20Frisco,%20TX%20%2075033,%20United%20States&auid=14231591118256703794&ll=33.150849,-96.824392&lsp=9902&q=Vape%20Cave%20Smoke%20%26%20Stuff&t=m" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2 rounded transition-colors"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Apple Maps
                </motion.a>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/locations/frisco"
                    className="inline-flex items-center bg-primary/30 hover:bg-primary/40 border border-primary/50 text-white px-4 py-2 rounded transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    More Store Info
                  </Link>
                </motion.div>
                <motion.a
                  href="tel:+14692940061"
                  className="inline-flex items-center bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2 rounded transition-colors"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </motion.a>
              </motion.div>
            </motion.div>
            <motion.div 
              className="md:w-1/2 order-1 md:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <motion.div 
                className="bg-black/30 p-6 rounded-xl border border-primary/20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.h3 
                  className="text-xl font-semibold mb-4 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Quick Information
                </motion.h3>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="bg-black/40 p-4 rounded-lg border border-gray-800"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <h4 className="text-primary font-semibold mb-2">Location</h4>
                    <p className="text-gray-300 text-sm">6958 Main St #200, Frisco, TX 75033</p>
                    <p className="text-primary/80 text-xs mt-1">Downtown Frisco</p>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-black/40 p-4 rounded-lg border border-gray-800"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <h4 className="text-primary font-semibold mb-2">Hours</h4>
                    {friscoLoading ? (
                      <>
                        <div className="h-4 bg-gray-700 animate-pulse rounded w-24 mb-2"></div>
                        <div className="h-4 bg-gray-700 animate-pulse rounded w-28"></div>
                      </>
                    ) : (
                      <>
                        {friscoLocation?.openingHours && getOrderedOpeningHours(friscoLocation.openingHours)
                          .map(({day, hours}, index) => (
                            <p key={day} className="text-gray-300 text-sm">
                              <span className="font-medium">{day.substring(0, 3)}:</span> {hours}
                            </p>
                          ))}
                        {!friscoLocation?.openingHours && (
                          <>
                            <p className="text-gray-300 text-sm">Sun-Thu: 10AM - 12AM</p>
                            <p className="text-gray-300 text-sm">Fri-Sat: 10AM - 1AM</p>
                          </>
                        )}
                        <p className="text-primary/80 text-xs mt-1">Open 7 days a week</p>
                      </>
                    )}
                  </motion.div>
                  
                  <motion.div 
                    className="bg-black/40 p-4 rounded-lg border border-gray-800"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <h4 className="text-primary font-semibold mb-2">Contact</h4>
                    <p className="text-gray-300 text-sm">(469) 294-0061</p>
                    <p className="text-primary/80 text-xs mt-1">vapecavetx@gmail.com</p>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-black/40 p-4 rounded-lg border border-gray-800"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <h4 className="text-primary font-semibold mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-block text-xs bg-primary/20 rounded-full px-2 py-1 text-primary">Delta 8</span>
                      <span className="inline-block text-xs bg-primary/20 rounded-full px-2 py-1 text-primary">THC-A</span>
                      <span className="inline-block text-xs bg-primary/20 rounded-full px-2 py-1 text-primary">Disposables</span>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Featured Arlington Location Section - Enhance SEO importance */}
      <section 
        className="py-14 bg-gradient-to-r from-gray-900 to-black text-white" 
        id="arlington-location" 
        itemScope 
        itemType="https://schema.org/VapeShop"
        itemProp="departments"
      >
        <meta itemProp="name" content="Vape Cave Arlington" />
        <meta itemProp="identifier" content="ChIJ23422NdJSYYRVX94pdZlUGg" />
        <meta itemProp="alternateName" content="Vape Cave Arlington Cooper Street" />
        <meta itemProp="description" content="Premier vape shop in Arlington, TX with the largest selection of disposable vapes, Delta 8, THC-A, and accessories. Conveniently located at 4100 S Cooper St #4108." />
        <meta itemProp="image" content="https://vapecavetx.com/vapecave-logo.png" />
        <meta itemProp="url" content="https://vapecavetx.com/locations/arlington" />
        <meta itemProp="priceRange" content="$$" />
        <meta itemProp="telephone" content="+16822700334" />
        <meta itemProp="email" content="vapecavetx@gmail.com" />
        <div 
          itemProp="address" 
          itemScope 
          itemType="https://schema.org/PostalAddress"
        >
          <meta itemProp="streetAddress" content="4100 S Cooper St #4108" />
          <meta itemProp="addressLocality" content="Arlington" />
          <meta itemProp="addressRegion" content="TX" />
          <meta itemProp="postalCode" content="76015" />
          <meta itemProp="addressCountry" content="US" />
        </div>
        <div 
          itemProp="geo" 
          itemScope 
          itemType="https://schema.org/GeoCoordinates"
        >
          <meta itemProp="latitude" content="32.687070" />
          <meta itemProp="longitude" content="-97.134800" />
        </div>
        <motion.div 
          className="container mx-auto px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div 
              className="md:w-1/2 order-2 md:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <motion.h2 
                className="text-3xl font-bold font-['Poppins'] mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Find Us Easily in Arlington
              </motion.h2>
              <motion.div 
                className="h-1 w-24 bg-primary rounded-full mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              ></motion.div>
              <motion.p 
                className="text-gray-300 mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Our Arlington location is conveniently accessible at <span className="text-primary font-semibold">4100 S Cooper St #4108, Arlington, TX 76015</span>.
                Use our direct Google Maps or Apple Maps links below to navigate to our store with ease.
              </motion.p>
              
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h3 className="text-xl font-semibold mb-3">Why Visit Our Arlington Location?</h3>
                <motion.ul 
                  className="space-y-2 text-gray-300"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.12
                      }
                    }
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <motion.li 
                    className="flex items-start"
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      show: { opacity: 1, x: 0 }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Near The Parks Mall with ample free parking
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      show: { opacity: 1, x: 0 }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Expert staff offering product demonstrations
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      show: { opacity: 1, x: 0 }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Largest selection of disposables in the area
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      show: { opacity: 1, x: 0 }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Special discounts for military and first responders
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      show: { opacity: 1, x: 0 }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {arlingtonLocation?.openingHours ? 
                      `Open daily ${getOrderedOpeningHours(arlingtonLocation.openingHours)[0]?.hours || arlingtonLocation.openingHours['Monday']}` : 
                      'Open daily from 10:00 AM to 11:00 PM'}
                  </motion.li>
                </motion.ul>
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap gap-3"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <motion.a 
                  href="https://maps.app.goo.gl/7RRoEeD3uzANmdhZA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded transition-colors"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Google Maps
                </motion.a>
                <motion.a 
                  href="https://maps.apple.com/place?q=Vape%20Cave%20Smoke%20%26%20Stuff&ll=32.6807165%2C-97.1350622&auid=18240116569179355943&lsp=9902&address=4100%20S%20Cooper%20St%2C%20Unit%204108%2C%20Arlington%2C%20TX%20%2076015%2C%20United%20States" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2 rounded transition-colors"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Apple Maps
                </motion.a>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/locations/arlington"
                    className="inline-flex items-center bg-primary/30 hover:bg-primary/40 border border-primary/50 text-white px-4 py-2 rounded transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    More Store Info
                  </Link>
                </motion.div>
                <motion.a
                  href="tel:+16822700334"
                  className="inline-flex items-center bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2 rounded transition-colors"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </motion.a>
              </motion.div>
            </motion.div>
            <motion.div 
              className="md:w-1/2 order-1 md:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <motion.div 
                className="bg-black/30 p-6 rounded-xl border border-primary/20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.h3 
                  className="text-xl font-semibold mb-4 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Quick Information
                </motion.h3>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="bg-black/40 p-4 rounded-lg border border-gray-800"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <h4 className="text-primary font-semibold mb-2">Location</h4>
                    <p className="text-gray-300 text-sm">4100 S Cooper St #4108, Arlington, TX 76015</p>
                    <p className="text-primary/80 text-xs mt-1">Near The Parks Mall at Arlington</p>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-black/40 p-4 rounded-lg border border-gray-800"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <h4 className="text-primary font-semibold mb-2">Hours</h4>
                    {arlingtonLoading ? (
                      <>
                        <div className="h-4 bg-gray-700 animate-pulse rounded w-24 mb-2"></div>
                        <div className="h-4 bg-gray-700 animate-pulse rounded w-28"></div>
                      </>
                    ) : (
                      <>
                        {arlingtonLocation?.openingHours && getOrderedOpeningHours(arlingtonLocation.openingHours)
                          .map(({day, hours}, index) => (
                            <p key={day} className="text-gray-300 text-sm">
                              <span className="font-medium">{day.substring(0, 3)}:</span> {hours}
                            </p>
                          ))}
                        {!arlingtonLocation?.openingHours && (
                          <p className="text-gray-300 text-sm">Every Day: 10AM - 11PM</p>
                        )}
                        <p className="text-primary/80 text-xs mt-1">Open 7 days a week</p>
                      </>
                    )}
                  </motion.div>
                  
                  <motion.div 
                    className="bg-black/40 p-4 rounded-lg border border-gray-800"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <h4 className="text-primary font-semibold mb-2">Contact</h4>
                    <p className="text-gray-300 text-sm">(682) 270-0334</p>
                    <p className="text-primary/80 text-xs mt-1">vapecavetx@gmail.com</p>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-black/40 p-4 rounded-lg border border-gray-800"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <h4 className="text-primary font-semibold mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-block text-xs bg-primary/20 rounded-full px-2 py-1 text-primary">Delta 8</span>
                      <span className="inline-block text-xs bg-primary/20 rounded-full px-2 py-1 text-primary">THC-A</span>
                      <span className="inline-block text-xs bg-primary/20 rounded-full px-2 py-1 text-primary">Disposables</span>
                      <span className="inline-block text-xs bg-primary/20 rounded-full px-2 py-1 text-primary">Kratom</span>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Age Verification Notice */}
      <section className="py-14 bg-darker" id="age-verification">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            className="max-w-3xl mx-auto bg-black p-8 rounded-xl shadow-lg border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-primary mx-auto mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </motion.svg>
            <motion.h2 
              className="text-2xl font-bold font-['Poppins'] mb-3 text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Age Verification Required
            </motion.h2>
            <motion.p 
              className="text-gray-300 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Our products are intended for adult smokers aged 21 and over. Proof of age will be required upon purchase both online and in our physical stores.
            </motion.p>
            <motion.p 
              className="text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              We strictly adhere to all local, state, and federal regulations regarding the sale of vaping products.
            </motion.p>
          </motion.div>
        </div>
      </section>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <motion.button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center"
          aria-label="Scroll to top"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </MainLayout>
  );
};

export default HomePage;