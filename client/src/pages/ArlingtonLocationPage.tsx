/**
 * Dedicated page for the Arlington location with enhanced SEO
 * This page focuses on the Arlington store specifically to improve local search visibility
 * Includes comprehensive structured data and rich metadata for improved search rankings
 */
import React, { useState } from 'react';
import { Link } from 'wouter';
import { Helmet } from "react-helmet";
import MainLayout from '@/layouts/MainLayout';
import { 
  getArlingtonLocation,
  getFormattedLocationsForMap
} from '@/data/storeInfo';
import { products } from '@/data/products';
import GoogleMapsIntegration from '@/components/GoogleMapsIntegration';
import DirectionsButton from '@/components/DirectionsButton';

const ArlingtonLocationPage: React.FC = () => {
  const location = getArlingtonLocation();
  
  // Create enhanced structured data specifically for Arlington location with maximum Google-recommended properties
  const generateArlingtonStructuredData = () => {
    // Parse postal code from address
    const zipCodeMatch = location.fullAddress.match(/\d{5}(?![\d-])/);
    const postalCode = zipCodeMatch ? zipCodeMatch[0] : "";
    
    // Format phone for structured data (remove non-digits and add country code)
    const formattedPhone = "+1" + location.phone.replace(/[^0-9]/g, '');
    
    // Format hours for structured data - convert to ISO 8601 format
    const formatOpeningHours = (hours: string) => {
      if (hours === "Closed") return null;
      
      // Convert time like "10:00 AM" to 24-hour format
      const timeRegex = /(\d+):(\d+)\s*(AM|PM)/i;
      const match = hours.match(timeRegex);
      
      if (!match) return hours;
      
      let hour = parseInt(match[1], 10);
      const minute = match[2];
      const period = match[3].toUpperCase();
      
      // Convert to 24-hour format
      if (period === "PM" && hour < 12) {
        hour += 12;
      } else if (period === "AM" && hour === 12) {
        hour = 0;
      }
      
      return `${hour.toString().padStart(2, '0')}:${minute}`;
    };
    
    // Filter Arlington-specific popular products
    const arlingtonFeaturedProducts = products.filter(p => p.featured || p.category === "Popular").slice(0, 6);
    
    // Enhanced schema specifically for Arlington with maximal detail
    // Using all recommended properties from Google for LocalBusiness entities
    return {
      "@context": "https://schema.org",
      "@type": "VapeShop",
      "@id": "https://vapecavetx.com/locations/arlington",
      "name": location.name,
      "alternateName": "Vape Cave Arlington - Premium Vape Shop",
      "url": "https://vapecavetx.com/locations/arlington",
      "logo": {
        "@type": "ImageObject",
        "url": "https://vapecavetx.com/logo.png",
        "width": "180",
        "height": "60"
      },
      "image": [
        location.image,
        "https://vapecavetx.com/storefront-arlington.jpg",
        "https://vapecavetx.com/interior-arlington.jpg"
      ],
      "telephone": formattedPhone,
      "email": location.email,
      "description": location.description,
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": location.coordinates.lat,
          "longitude": location.coordinates.lng
        },
        "geoRadius": "15000" // 15km radius around store
      },
      "slogan": "Arlington's premier destination for quality vaping products and accessories",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": location.address,
        "addressLocality": location.city,
        "addressRegion": "TX",
        "postalCode": postalCode,
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": location.coordinates.lat,
        "longitude": location.coordinates.lng,
        "name": "Vape Cave Arlington Location Coordinates"
      },
      "hasMap": [
        {
          "@type": "Map",
          "url": location.googlePlaceId ? 
            `https://www.google.com/maps/place/?q=place_id:${location.googlePlaceId}` : 
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.fullAddress)}`
        },
        {
          "@type": "Map",
          "url": location.mapEmbed
        },
        {
          "@type": "Map", 
          "url": location.appleMapsLink || ""
        }
      ],
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "yearEstablished",
          "value": location.yearEstablished
        },
        {
          "@type": "PropertyValue",
          "name": "googlePlaceId",
          "value": location.googlePlaceId || "ChIJ23422NdJSYYRVX94pdZlUGg"
        },
        {
          "@type": "PropertyValue",
          "name": "businessType",
          "value": "Vape and Smoke Shop"
        },
        {
          "@type": "PropertyValue",
          "name": "neighborhoodInfo",
          "value": location.neighborhoodInfo || ""
        },
        {
          "@type": "PropertyValue",
          "name": "parkingAvailability",
          "value": location.parking || ""
        },
        {
          "@type": "PropertyValue",
          "name": "publicTransportation",
          "value": location.publicTransit || ""
        },
        {
          "@type": "PropertyValue",
          "name": "storeCode",
          "value": location.storeCode || "VC-ARLINGTON"
        }
      ],
      "openingHoursSpecification": Object.entries(location.openingHours).map(([day, hours]) => {
        const parts = hours.split(' - ');
        const openTime = formatOpeningHours(parts[0]);
        const closeTime = formatOpeningHours(parts[1] === "Closed" ? "00:00" : parts[1]);
        
        return {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": `https://schema.org/${day}`,
          "opens": openTime,
          "closes": closeTime
        };
      }),
      "specialOpeningHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "validFrom": "2025-01-01",
        "validThrough": "2025-12-31",
        "dayOfWeek": "https://schema.org/PublicHolidays",
        "opens": "10:00",
        "closes": "20:00"
      },
      "priceRange": location.priceRange,
      "paymentAccepted": location.acceptedPayments.join(", "),
      "currenciesAccepted": "USD",
      "publicAccess": true,
      "isAccessibleForFree": true,
      "smokingAllowed": false,
      "keywords": "vape shop arlington, delta 8 arlington, thc-a arlington, premium vape arlington, arlington vape shop, vape products arlington tx, vaping arlington, smoke shop arlington, vape accessories arlington, premium vape products arlington, cbd arlington tx",
      "amenityFeature": location.amenities.map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity,
        "value": true
      })),
      "department": location.services.map(service => ({
        "@type": "Department",
        "name": service
      })),
      "makesOffer": arlingtonFeaturedProducts.map(product => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": product.name,
          "description": product.description,
          "image": product.image,
          "category": product.category,
          "brand": {
            "@type": "Brand",
            "name": product.name.includes("Elf Bar") ? "Elf Bar" : 
                    product.name.includes("Lost Mary") ? "Lost Mary" : 
                    product.name.includes("Geek") ? "GeekVape" : 
                    product.name.includes("Hyde") ? "Hyde" : 
                    product.name.includes("Caliburn") ? "Uwell Caliburn" : 
                    "Vape Cave"
          },
          "offers": {
            "@type": "Offer",
            "price": product.price.toFixed(2),
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "availabilityStarts": "2023-01-01T00:00:00-06:00",
            "priceValidUntil": "2025-12-31",
            "url": "https://vapecavetx.com/products",
            "availableAtOrFrom": {
              "@type": "VapeShop",
              "name": location.name,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": location.address,
                "addressLocality": location.city,
                "addressRegion": "TX",
                "postalCode": postalCode,
                "addressCountry": "US"
              }
            }
          },
          "sku": `VC-${product.id}`,
          "mpn": `VCC-${product.id}-${product.category.replace(/\s+/g, '-').toLowerCase()}`,
          "additionalProperty": [
            {
              "@type": "PropertyValue",
              "name": "Age Restriction",
              "value": "21+"
            },
            {
              "@type": "PropertyValue",
              "name": "Product Type",
              "value": product.category
            }
          ]
        }
      })),
      "potentialAction": [
        {
          "@type": "ViewAction", 
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://vapecavetx.com/locations/arlington"
          }
        },
        {
          "@type": "MapAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": location.googlePlaceId ? 
              `https://www.google.com/maps/place/?q=place_id:${location.googlePlaceId}` : 
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.fullAddress)}`
          }
        },
        {
          "@type": "FindAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": location.googlePlaceId ? 
              `https://www.google.com/maps/place/?q=place_id:${location.googlePlaceId}` : 
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.city)}+vape+shop`
          },
          "query-input": "required name=vape shop location"
        }
      ],
      "sameAs": [
        location.socialProfiles?.facebook,
        location.socialProfiles?.instagram,
        location.socialProfiles?.twitter,
        location.socialProfiles?.yelp
      ].filter(Boolean),
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "ratingCount": "98",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jessica L."
          },
          "datePublished": "2024-02-28",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
          },
          "reviewBody": "Great selection of Delta 8 products and incredibly helpful staff. The Arlington location is my go-to shop for all my vaping needs."
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Mark D."
          },
          "datePublished": "2024-01-15",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
          },
          "reviewBody": "The Arlington shop has an excellent selection and the staff is always friendly and knowledgeable. Highly recommend!"
        }
      ]
    };
  };
  
  // Toggle states for accordion-like sections
  const [showDetails, setShowDetails] = useState(true);
  const [showProducts, setShowProducts] = useState(true);
  
  // Filter products for Arlington location (example of location-specific products)
  const arlingtonProducts = products.filter(product => 
    product.featured || product.category === "Popular"
  ).slice(0, 6);
  
  // Additional SEO tags for Arlington location
  const canonicalUrl = "https://vapecavetx.com/locations/arlington";
  
  return (
    <MainLayout
      title={`Vape Cave Arlington, TX | Best Vape Shop near Cooper St | Premium Vaping Products`}
      description={`Visit Vape Cave at ${location.address} in Arlington, TX for premium vaping products, Elf Bar, Lost Mary, Geek Vape, Delta 8, THC-A & accessories. Open daily 10AM-11PM.`}
      canonical={canonicalUrl}
      ogImage="/vapecave-logo.png"
      structuredData={generateArlingtonStructuredData()}
    >
      <Helmet>
        <title>Vape Cave Arlington | #1 Vape Shop in Arlington TX | Premium Vaping Products, Elf Bar, Lost Mary & Delta 8</title>
        <meta name="description" content={`Looking for the best vape shop in Arlington? Visit Vape Cave at ${location.address}. Offering premium products including Elf Bar, Lost Mary, Geek Vape, Delta 8, THC-A, disposables & CBD. Open daily 10AM-11PM.`} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Additional meta tags specific to Arlington location */}
        <meta name="geo.position" content={`${location.coordinates.lat};${location.coordinates.lng}`} />
        <meta name="geo.placename" content={`Vape Cave ${location.city}`} />
        <meta name="geo.region" content="US-TX" />
        <meta name="ICBM" content={`${location.coordinates.lat}, ${location.coordinates.lng}`} />
        
        {/* Open Graph & Twitter tags */}
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="business.business" />
        <meta property="og:title" content={`Vape Cave Arlington TX | Best Vape Shop for Elf Bar, Lost Mary & Delta 8`} />
        <meta property="og:description" content={`Visit the #1 vape shop in Arlington at ${location.address}. We offer premium products including Elf Bar, Lost Mary, GeekVape, Delta 8, THC-A, and more at our convenient Cooper St location.`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Vape Cave" />
        <meta property="og:image" content="/vapecave-logo.png" />
        <meta property="business:contact_data:street_address" content={location.address} />
        <meta property="business:contact_data:locality" content={location.city} />
        <meta property="business:contact_data:region" content="TX" />
        <meta property="business:contact_data:postal_code" content="76015" />
        <meta property="business:contact_data:country_name" content="United States" />
        <meta property="business:contact_data:email" content={location.email || "vapecavetx@gmail.com"} />
        <meta property="business:contact_data:phone_number" content={`+1${location.phone.replace(/[^0-9]/g, '')}`} />
        <meta property="business:hours:day" content="monday" />
        <meta property="business:hours:start" content="10:00" />
        <meta property="business:hours:end" content="23:00" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Vape Cave Arlington | #1 Vape Shop in Arlington TX`} />
        <meta name="twitter:description" content={`Top-rated vape shop in Arlington offering Elf Bar, Lost Mary, GeekVape, Delta 8, THC-A & more at our Cooper St location. Convenient to Arlington, Fort Worth, and Grand Prairie.`} />
        <meta name="twitter:image" content="/vapecave-logo.png" />
        
        {/* Location-specific keywords */}
        <meta name="keywords" content="vape shop arlington tx, arlington vape store, vape cave arlington, vape near me arlington, delta 8 arlington, thc-a arlington, vape products arlington, disposable vapes arlington, cbd shop arlington, smoke shop arlington texas, premium vape arlington, vape shop google place id, geekvape arlington, elf bar arlington, lost mary arlington, hyde vape arlington, lost vape arlington, caliburn arlington, delta 10 arlington, hhc arlington, vape shop near me, smoke shop near me, best vape shop arlington" />
        
        {/* Dublin Core Metadata */}
        <meta name="DC.title" content="Vape Cave Arlington TX | #1 Vape Shop for Elf Bar, Lost Mary & Delta 8" />
        <meta name="DC.description" content={`Arlington's #1 vape shop at ${location.address}. Offering high-quality products including Elf Bar, Lost Mary, GeekVape, Delta 8, THC-A, and accessories.`} />
        <meta name="DC.subject" content="Vape Shop, Arlington, Elf Bar, Lost Mary, GeekVape, Delta 8, THC-A, Disposable Vapes" />
        <meta name="DC.creator" content="Vape Cave" />
        <meta name="DC.type" content="LocalBusiness" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.language" content="en-US" />
        <meta name="DC.coverage" content="Arlington, Texas, United States" />
        <meta name="DC.rights" content="Copyright Vape Cave 2023" />
        <meta name="DC.identifier" content={canonicalUrl} />
        
        {/* Alternative languages - helpful for international customers */}
        <link rel="alternate" href={canonicalUrl} hrefLang="en-us" />
        <link rel="alternate" href="https://vapecavetx.com/es/locations/arlington" hrefLang="es" />
        
        {/* Structured data for breadcrumb nav */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://vapecavetx.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Locations",
                "item": "https://vapecavetx.com/locations"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Arlington",
                "item": canonicalUrl
              }
            ]
          })}
        </script>
      </Helmet>
      
      {/* Hero Section with Specific Arlington Information */}
      <section className="relative h-72 md:h-96 overflow-hidden bg-gray-900 py-10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black"></div>
          <div className="absolute inset-0 bg-[url('/vapecave-logo.png')] bg-center bg-no-repeat bg-contain opacity-10"></div>
          <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg font-['Poppins']">Vape Cave Arlington</h1>
          <div className="h-1 w-24 bg-primary rounded-full mb-6"></div>
          <p className="text-xl md:text-2xl max-w-2xl drop-shadow-md">Your premier destination for premium vaping products in Arlington, Texas.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <DirectionsButton
              address={location.fullAddress}
              lat={location.coordinates.lat}
              lng={location.coordinates.lng}
              buttonText="Get Directions"
              variant="primary"
              size="lg"
              showIcon={true}
              googlePlaceId={location.googlePlaceId}
              appleMapsLink={location.appleMapsLink}
            />
            <a 
              href={`tel:${location.phone.replace(/[^0-9]/g, '')}`} 
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 backdrop-blur-sm hover:shadow-lg"
            >
              Call Us: {location.phone}
            </a>
          </div>
        </div>
      </section>
      
      {/* Main content with store information */}
      <section className="py-12 bg-dark text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Poppins'] mb-3">Store Information</h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">All the details you need about our Arlington location.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Store Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-['Poppins'] text-white">Location Details</h2>
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-primary hover:text-primary/80"
                  aria-expanded={showDetails}
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              
              {showDetails && (
                <div className="bg-medium rounded-xl overflow-hidden shadow-lg border border-gray-700 p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-white">About This Location</h3>
                      <p className="text-gray-300 mb-4">
                        {location.description}
                      </p>
                      <p className="text-gray-300 mb-4">
                        Established in {location.yearEstablished}, our Arlington store has been serving the local community with premium vaping products and exceptional service.
                      </p>
                      
                      {location.neighborhoodInfo && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2 text-white">Neighborhood</h4>
                          <p className="text-gray-300">{location.neighborhoodInfo}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-white">Store Features</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2 text-white">Amenities</h4>
                          <div className="flex flex-wrap gap-2">
                            {location.amenities.map((amenity, index) => (
                              <span 
                                key={index} 
                                className="bg-black/30 text-primary text-sm py-1 px-3 rounded-full border border-gray-800"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 text-white">Price Range</h4>
                          <span className="text-gray-300">{location.priceRange}</span>
                        </div>
                        
                        {location.socialProfiles && (
                          <div>
                            <h4 className="font-medium mb-2 text-white">Follow Us</h4>
                            <div className="flex space-x-4">
                              {location.socialProfiles.facebook && (
                                <a 
                                  href={location.socialProfiles.facebook}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-300 hover:text-primary transition-colors"
                                >
                                  <i className="fab fa-facebook fa-lg"></i>
                                </a>
                              )}
                              {location.socialProfiles.instagram && (
                                <a 
                                  href={location.socialProfiles.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-300 hover:text-primary transition-colors"
                                >
                                  <i className="fab fa-instagram fa-lg"></i>
                                </a>
                              )}
                              {location.socialProfiles.twitter && (
                                <a 
                                  href={location.socialProfiles.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-300 hover:text-primary transition-colors"
                                >
                                  <i className="fab fa-twitter fa-lg"></i>
                                </a>
                              )}
                              {location.socialProfiles.yelp && (
                                <a 
                                  href={location.socialProfiles.yelp}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-300 hover:text-primary transition-colors"
                                >
                                  <i className="fab fa-yelp fa-lg"></i>
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Area Served */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-white">Areas We Serve</h3>
                <p className="text-gray-300 mb-3">
                  Conveniently located to serve customers in:
                </p>
                <div className="flex flex-wrap gap-2">
                  {location.areaServed.map((area, index) => (
                    <span 
                      key={index} 
                      className="bg-black/30 text-primary text-sm py-1 px-3 rounded-full border border-gray-800"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Products/Services */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-['Poppins'] text-white">Products & Services</h2>
                  <button 
                    onClick={() => setShowProducts(!showProducts)}
                    className="text-primary hover:text-primary/80"
                    aria-expanded={showProducts}
                  >
                    {showProducts ? 'Hide Products' : 'Show Products'}
                  </button>
                </div>
                
                {showProducts && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {location.services.map((service, index) => (
                        <div key={index} className="bg-medium rounded-xl overflow-hidden shadow-lg border border-gray-700 p-4 flex items-center">
                          <div className="bg-black/40 text-primary rounded-full p-3 mr-4 border border-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{service}</h4>
                            <p className="text-sm text-gray-300">Available in-store</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Featured Products at Arlington */}
                    <h3 className="text-xl font-semibold mb-4 text-white">Featured Products at Arlington</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {arlingtonProducts.map((product) => (
                        <div key={product.id} className="bg-medium rounded-xl overflow-hidden shadow-lg border border-gray-700">
                          <div className="h-40 overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium mb-1 text-white">{product.name}</h4>
                            <p className="text-sm text-gray-300 mb-2">{product.category}</p>
                            <p className="font-bold text-primary">${product.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center">
                      <Link href="/products" className="text-primary hover:text-primary/80 font-medium">
                        View All Products →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          
            {/* Map & Directions */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold font-['Poppins'] mb-6 text-white">Location & Directions</h2>
              
              <div className="bg-medium rounded-xl overflow-hidden shadow-lg border border-gray-700 p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3 text-white">Interactive Map</h3>
                <div 
                  className="h-96 rounded-lg overflow-hidden mb-4"
                  itemProp="hasMap"
                  itemScope
                  itemType="https://schema.org/Map"
                >
                  <meta itemProp="url" content={location.googlePlaceId ? `https://www.google.com/maps/place/?q=place_id:${location.googlePlaceId}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.fullAddress)}`} />
                  {/* Using iframe for reliable map display for Arlington location */}
                  <iframe
                    src={location.mapEmbed}
                    width="100%"
                    height="100%"
                    title={`${location.name} Map`}
                    className="border-0 rounded-lg dark-map-light"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <h3 className="text-lg font-semibold mb-3 text-white">Get Directions</h3>
                <DirectionsButton 
                  address={location.fullAddress}
                  lat={location.coordinates.lat}
                  lng={location.coordinates.lng}
                  buttonText="Navigate to Store"
                  variant="primary"
                  fullWidth={true}
                  showIcon={true}
                  googlePlaceId={location.googlePlaceId}
                  appleMapsLink={location.appleMapsLink}
                />
                
                {location.publicTransit && (
                  <div className="mt-4 p-4 bg-black/30 rounded-lg border border-gray-800">
                    <h3 className="text-lg font-semibold mb-2 text-white">Public Transportation</h3>
                    <p className="text-gray-300 text-sm">{location.publicTransit}</p>
                  </div>
                )}
                
                {location.parking && (
                  <div className="mt-4 p-4 bg-black/30 rounded-lg border border-gray-800">
                    <h3 className="text-lg font-semibold mb-2 text-white">Parking Information</h3>
                    <p className="text-gray-300 text-sm">{location.parking}</p>
                  </div>
                )}
              </div>
              
              {/* Payment Methods */}
              <div className="bg-medium rounded-xl overflow-hidden shadow-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Accepted Payment Methods</h3>
                <div className="flex flex-wrap gap-2">
                  {location.acceptedPayments.map((payment, index) => (
                    <span 
                      key={index} 
                      className="bg-black/30 text-primary text-sm py-1 px-3 rounded-full border border-gray-800"
                    >
                      {payment}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section with FAQ Schema */}
      <section className="py-14 bg-darker text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Poppins'] mb-3">Frequently Asked Questions</h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">Find answers to the most common questions about our Arlington location.</p>
          </div>
          
          <div 
            className="max-w-3xl mx-auto divide-y divide-gray-700"
            itemScope 
            itemType="https://schema.org/FAQPage"
          >
            {/* FAQ Item 1 */}
            <div className="py-5" itemScope itemType="https://schema.org/Question">
              <div className="flex justify-between cursor-pointer">
                <h3 className="text-lg font-medium text-primary" itemProp="name">What are your hours at the Arlington location?</h3>
              </div>
              <div className="mt-2" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p className="text-gray-300">
                    Our Arlington store is open from 10:00 AM to 11:00 PM Monday through Sunday. 
                    We're ready to serve you every day of the week!
                  </p>
                </div>
              </div>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="py-5" itemScope itemType="https://schema.org/Question">
              <div className="flex justify-between cursor-pointer">
                <h3 className="text-lg font-medium text-primary" itemProp="name">What products do you carry at the Arlington location?</h3>
              </div>
              <div className="mt-2" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p className="text-gray-300">
                    Our Arlington store offers a wide range of vaping products including premium e-liquids, 
                    disposable vapes, mods, tanks, coils, Delta 8, THC-A products, and various accessories. 
                    We pride ourselves on carrying high-quality brands and products to meet all your vaping needs.
                  </p>
                </div>
              </div>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="py-5" itemScope itemType="https://schema.org/Question">
              <div className="flex justify-between cursor-pointer">
                <h3 className="text-lg font-medium text-primary" itemProp="name">Do you offer any discounts or loyalty programs?</h3>
              </div>
              <div className="mt-2" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p className="text-gray-300">
                    Yes! We have a customer loyalty program where you earn points with every purchase. 
                    We also offer military and student discounts with valid ID. Additionally, we run 
                    seasonal promotions and special deals that we announce on our social media channels.
                  </p>
                </div>
              </div>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="py-5" itemScope itemType="https://schema.org/Question">
              <div className="flex justify-between cursor-pointer">
                <h3 className="text-lg font-medium text-primary" itemProp="name">Is there parking available at your Arlington location?</h3>
              </div>
              <div className="mt-2" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p className="text-gray-300">
                    Yes, we have ample free parking available in the shopping center where our Arlington store is located. 
                    You'll find our store easily accessible from S Cooper St with convenient parking right out front.
                  </p>
                </div>
              </div>
            </div>
            
            {/* FAQ Item 5 */}
            <div className="py-5" itemScope itemType="https://schema.org/Question">
              <div className="flex justify-between cursor-pointer">
                <h3 className="text-lg font-medium text-primary" itemProp="name">Do you offer any expert advice for beginners?</h3>
              </div>
              <div className="mt-2" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p className="text-gray-300">
                    Absolutely! Our knowledgeable staff at the Arlington location is always ready to help beginners 
                    find the right products for their needs. We can provide guidance on getting started with vaping, 
                    product selection, and proper usage. Don't hesitate to ask our friendly team any questions you may have.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Visit Us CTA */}
      <section className="py-14 bg-darker">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-['Poppins'] mb-4 text-white">Visit Our Arlington Location Today!</h2>
            <p className="text-gray-300 text-lg mb-8">
              Experience our friendly atmosphere, knowledgeable staff, and premium selection of vaping products and accessories.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <DirectionsButton
                address={location.fullAddress}
                lat={location.coordinates.lat}
                lng={location.coordinates.lng}
                buttonText="Get Directions"
                variant="primary"
                showIcon={true}
                googlePlaceId={location.googlePlaceId}
                appleMapsLink={location.appleMapsLink}
              />
              <a 
                href={`tel:${location.phone.replace(/[^0-9]/g, '')}`} 
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 backdrop-blur-sm hover:shadow-lg"
              >
                Call Us: {location.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ArlingtonLocationPage;