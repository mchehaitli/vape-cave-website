import { Link } from "wouter";
import { Helmet } from "react-helmet";
import MainLayout from "@/layouts/MainLayout";

const HomePage = () => {
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
      "https://vapecavetx.com/images/storefront.jpg",
      "https://vapecavetx.com/images/interior.jpg",
      "https://vapecavetx.com/images/products.jpg"
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
        <meta property="og:image" content="https://vapecavetx.com/og-image.jpg" />
        
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
          <div className="flex flex-col items-center">
            <div className="w-full max-w-5xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-['Poppins'] mb-4 leading-tight">
                Vape into the <span className="text-primary">Future</span>
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl mb-8 text-white/90 font-medium max-w-[1100px] mx-auto leading-relaxed">
                Your One Stop Vape Shop for <span className="text-primary font-semibold">Disposables</span> | <span className="text-primary font-semibold">E-Liquids</span> | <span className="text-primary font-semibold">Salts</span> | <span className="text-primary font-semibold">Delta</span> | <span className="text-primary font-semibold">THC - A</span> | <span className="text-primary font-semibold">Glass</span> | <span className="text-primary font-semibold">Tobacco</span> | <span className="text-primary font-semibold">Hookah / Shisha</span> | <span className="text-primary font-semibold">Vaporizers</span> | <span className="text-primary font-semibold">Mods</span> | and much more
              </h2>
              <p className="text-base md:text-lg mb-10 text-white/80 max-w-2xl mx-auto">
                We are a locally owned business specializing in Vaporizers, E-Liquid, Salt Nic, and many different types of disposable devices. We also carry a wide range of glass pipes and accessories as well as Novelties and Hookahs/Shisha. Basically we carry all your smoking needs!
              </p>
              <div className="flex flex-wrap justify-center gap-5 mt-8">
                <Link href="/products">
                  <div className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1">
                    Shop Now
                  </div>
                </Link>
                <Link href="/locations">
                  <div className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 cursor-pointer backdrop-blur-sm hover:shadow-lg hover:-translate-y-1">
                    Find Our Stores
                  </div>
                </Link>
                <Link href="/locations/frisco">
                  <div className="bg-primary/30 hover:bg-primary/40 border border-primary/50 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 cursor-pointer backdrop-blur-sm hover:shadow-lg hover:-translate-y-1">
                    Frisco Store
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Preview Section */}
      <section className="py-20 bg-dark text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Poppins'] mb-3">Our Locations</h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">Visit us at one of our convenient locations for personalized service and expert advice.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Frisco Location - Enhanced with SEO and structured data */}
            <div 
              className="bg-medium rounded-xl overflow-hidden shadow-lg border border-gray-700" 
              itemScope 
              itemType="https://schema.org/VapeShop"
              data-google-place-id="ChIJxXjrR3wVkFQRcKK89i-aFDw"
              data-location="frisco"
            >
              <div className="p-6">
                <h3 className="font-['Poppins'] font-semibold text-2xl mb-4 text-white" itemProp="name">Frisco Location</h3>
                <div className="space-y-3 mb-5">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                      <span className="text-gray-300 block">
                        <span itemProp="streetAddress">6958 Main St #200</span>, 
                        <span itemProp="addressLocality">Frisco</span>, 
                        <span itemProp="addressRegion">TX</span> 
                        <span itemProp="postalCode">75033</span>
                      </span>
                      <span className="text-gray-400 text-xs mt-1 block">
                        <a 
                          href="https://maps.app.goo.gl/jzbqUDyvvGHuwyXJ7" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                          itemProp="hasMap"
                        >
                          View on Google Maps
                        </a>
                        <a 
                          href="https://maps.apple.com/?address=6958%20Main%20St,%20Unit%20200,%20Frisco,%20TX%20%2075033,%20United%20States&auid=14231591118256703794&ll=33.150849,-96.824392&lsp=9902&q=Vape%20Cave%20Smoke%20%26%20Stuff&t=m" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors ml-2"
                        >
                          View on Apple Maps
                        </a>
                      </span>
                      <meta itemProp="identifier" content="ChIJxXjrR3wVkFQRcKK89i-aFDw" />
                      <meta itemProp="google-place-id" content="ChIJxXjrR3wVkFQRcKK89i-aFDw" />
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a 
                      href="tel:+14692940061" 
                      className="text-gray-300 hover:text-primary transition-colors"
                      itemProp="telephone"
                    >
                      (469) 294-0061
                    </a>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-gray-300">
                      <div>Mon-Thu, Sun: 10AM - 12AM</div>
                      <div>Fri-Sat: 10AM - 1AM</div>
                      <div className="text-primary/80 text-xs mt-1">Open 7 days a week</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex flex-wrap gap-2" itemProp="makesOffer" itemScope itemType="https://schema.org/Offer">
                      <span className="inline-block text-xs bg-primary/20 rounded-full px-2 py-1 text-primary">Delta 8</span>
                      <span className="inline-block text-xs bg-primary/20 rounded-full px-2 py-1 text-primary">THC-A</span>
                      <span className="inline-block text-xs bg-primary/20 rounded-full px-2 py-1 text-primary">Disposables</span>
                    </div>
                  </div>
                </div>
                
                <Link href="/locations/frisco">
                  <div className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md cursor-pointer">
                    View Frisco Store Details
                  </div>
                </Link>
                
                <a 
                  href="https://maps.app.goo.gl/jzbqUDyvvGHuwyXJ7" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-block bg-transparent border border-primary text-primary hover:bg-primary/10 font-bold py-2 px-6 rounded-lg transition-colors shadow-md cursor-pointer ml-2"
                >
                  Get Directions
                </a>
                
                <div className="mt-2 text-xs text-gray-500 italic">
                  Click any map link for directions to our store
                </div>
              </div>
            </div>
            
            {/* Location 2 */}
            <div className="bg-medium rounded-xl overflow-hidden shadow-lg border border-gray-700">
              <div className="p-6">
                <h3 className="font-['Poppins'] font-semibold text-2xl mb-4 text-white">Arlington Location</h3>
                <div className="space-y-3 mb-5">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <span className="text-gray-300 block">4100 S Cooper St, Unit 4108, Arlington, TX 76015</span>
                      <span className="text-gray-400 text-xs mt-1 block">
                        <a 
                          href="https://maps.app.goo.gl/7RRoEeD3uzANmdhZA" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          View on Google Maps
                        </a>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-300">(682) 270-0334</span>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300">10:00 AM - 11:00 PM (Open 7 days)</span>
                  </div>
                </div>
                
                <Link href="/locations">
                  <div className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md cursor-pointer">
                    View Details
                  </div>
                </Link>
                
                <a 
                  href="https://maps.app.goo.gl/7RRoEeD3uzANmdhZA" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-block bg-transparent border border-primary text-primary hover:bg-primary/10 font-bold py-2 px-6 rounded-lg transition-colors shadow-md cursor-pointer ml-2"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Frisco Location Section - Enhance SEO importance */}
      <section 
        className="py-14 bg-gradient-to-r from-primary/10 to-primary/5 text-white" 
        id="frisco-location" 
        itemScope 
        itemType="https://schema.org/VapeShop"
        itemProp="departments"
      >
        <meta itemProp="name" content="Vape Cave Frisco" />
        <meta itemProp="identifier" content="ChIJxXjrR3wVkFQRcKK89i-aFDw" />
        <meta itemProp="alternateName" content="Vape Cave Frisco Main Street" />
        <meta itemProp="description" content="Premier vape shop in Frisco, TX with a wide selection of vaping products, disposables, delta 8, and THC-A products. Conveniently located at 6958 Main St #200." />
        <meta itemProp="image" content="https://vapecavetx.com/frisco-location.jpg" />
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
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold font-['Poppins'] mb-3">
                Find Us Easily in Frisco
              </h2>
              <div className="h-1 w-24 bg-primary rounded-full mb-6"></div>
              <p className="text-gray-300 mb-6">
                Our Frisco location is conveniently accessible at <span className="text-primary font-semibold">6958 Main St #200, Frisco, TX 75033</span>.
                Use our direct Google Maps or Apple Maps links below to navigate to our store with ease.
              </p>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Why Visit Our Frisco Location?</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Convenient Main Street location with ample parking
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Expert staff providing personalized recommendations
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Extensive selection of premium products
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/locations/frisco">
                  <div className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md cursor-pointer">
                    Visit Our Frisco Store
                  </div>
                </Link>
                <a 
                  href="https://maps.app.goo.gl/jzbqUDyvvGHuwyXJ7" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md cursor-pointer"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Open in Maps
                  </span>
                </a>
              </div>
            </div>
            
            <div className="md:w-1/2 bg-black/30 p-6 rounded-xl border border-primary/20">
              <h3 className="text-xl font-semibold mb-4 text-center">Quick Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                  <h4 className="text-primary font-semibold mb-2">Location</h4>
                  <p className="text-gray-300 text-sm">6958 Main St #200, Frisco, TX 75033</p>
                  <p className="text-primary/80 text-xs mt-1">Main Street Shopping Area</p>
                </div>
                
                <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                  <h4 className="text-primary font-semibold mb-2">Hours</h4>
                  <p className="text-gray-300 text-sm">Mon-Thu, Sun: 10AM - 12AM</p>
                  <p className="text-gray-300 text-sm">Fri-Sat: 10AM - 1AM</p>
                  <p className="text-primary/80 text-xs mt-1">Open 7 days a week</p>
                </div>
                
                <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                  <h4 className="text-primary font-semibold mb-2">Contact</h4>
                  <p className="text-gray-300 text-sm">(469) 294-0061</p>
                  <p className="text-primary/80 text-xs mt-1">vapecavetx@gmail.com</p>
                </div>
                
                <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                  <h4 className="text-primary font-semibold mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    <span className="inline-block text-xs bg-primary/20 rounded-full px-2 py-1 text-primary">Delta 8</span>
                    <span className="inline-block text-xs bg-primary/20 rounded-full px-2 py-1 text-primary">THC-A</span>
                    <span className="inline-block text-xs bg-primary/20 rounded-full px-2 py-1 text-primary">Disposables</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Age Verification Notice */}
      <section className="py-14 bg-darker">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto bg-black p-8 rounded-xl shadow-lg border border-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold font-['Poppins'] mb-3 text-white">Age Verification Required</h2>
            <p className="text-gray-300 mb-4">Our products are intended for adult smokers aged 21 and over. Proof of age will be required upon purchase both online and in our physical stores.</p>
            <p className="text-gray-400 text-sm">We strictly adhere to all local, state, and federal regulations regarding the sale of vaping products.</p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
