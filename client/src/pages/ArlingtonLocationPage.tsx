import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import GoogleMapsIntegration from "@/components/GoogleMapsIntegration";
import DirectionsButton from "@/components/DirectionsButton";
import { getArlingtonLocation, getFormattedLocationsForMap } from "@/data/storeInfo";
import { products } from "@/data/products";

/**
 * Dedicated page for the Arlington location with enhanced SEO
 * This page focuses on the Arlington store specifically to improve local search visibility
 */
const ArlingtonLocationPage: React.FC = () => {
  const location = getArlingtonLocation();
  const arlingtonProducts = products.filter(p => p.featured).slice(0, 4); // Display featured products at Arlington location
  
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
      "makesOffer": arlingtonProducts.map(product => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": product.name,
          "description": product.description,
          "image": product.image,
          "category": product.category,
          "offers": {
            "@type": "Offer",
            "price": product.price.toFixed(2),
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "availableAtOrFrom": {
              "@type": "VapeShop",
              "name": location.name,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": location.address,
                "addressLocality": location.city,
                "addressRegion": "TX"
              }
            }
          }
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
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.fullAddress)}`
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
            "name": "David T."
          },
          "datePublished": "2024-01-28",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
          },
          "reviewBody": "Best vape shop in Arlington! Great selection of Delta 8 products and the staff are very knowledgeable."
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jessica K."
          },
          "datePublished": "2023-12-15",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "4",
            "bestRating": "5",
            "worstRating": "1"
          },
          "reviewBody": "Good location in the shopping center with friendly staff and competitive prices. Would recommend."
        }
      ]
    };
  };

  // Local state for toggling sections
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [showProducts, setShowProducts] = useState<boolean>(true);
  
  return (
    <MainLayout
      title="Vape Cave Arlington | Premium Vape Shop in Arlington | Premium Vaping Products & Delta 8"
      description="Visit Vape Cave in Arlington at 4100 S Cooper St #4108. Offering premium vape products, Delta 8, THC-A, disposables & accessories. Open daily 10AM-11PM."
      canonical="https://vapecavetx.com/locations/arlington"
      ogImage="https://vapecavetx.com/storefront-arlington.jpg"
      structuredData={generateArlingtonStructuredData()}
    >
      {/* Additional SEO metadata specific to Arlington location */}
      <Helmet>
        <title>Vape Cave Arlington | Premium Vape Shop in Arlington | Premium Vaping Products & Delta 8</title>
        <meta name="description" content="Visit Vape Cave in Arlington at 4100 S Cooper St #4108. Offering premium vape products, Delta 8, THC-A, disposables & accessories. Open daily 10AM-11PM." />
        <link rel="canonical" href="https://vapecavetx.com/locations/arlington" />
        
        {/* Open Graph & Twitter */}
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="business.business" />
        <meta property="og:title" content="Vape Cave Arlington | Premium Vape Shop in Arlington" />
        <meta property="og:description" content="Visit Vape Cave in Arlington. We offer premium vaping products, Delta 8, THC-A, and more at our convenient 4100 S Cooper St location." />
        <meta property="og:url" content="https://vapecavetx.com/locations/arlington" />
        <meta property="og:site_name" content="Vape Cave" />
        <meta property="og:image" content="https://vapecavetx.com/storefront-arlington.jpg" />
        <meta property="business:contact_data:street_address" content="4100 S Cooper St #4108" />
        <meta property="business:contact_data:locality" content="Arlington" />
        <meta property="business:contact_data:region" content="TX" />
        <meta property="business:contact_data:postal_code" content="76015" />
        <meta property="business:contact_data:country_name" content="United States" />
        <meta property="business:contact_data:email" content="vapecavetx@gmail.com" />
        <meta property="business:contact_data:phone_number" content="+16822700334" />
        <meta property="business:hours:day" content="monday" />
        <meta property="business:hours:start" content="10:00" />
        <meta property="business:hours:end" content="23:00" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vape Cave Arlington | Premium Vape Shop in Arlington" />
        <meta name="twitter:description" content="Premium vape shop in Arlington offering Delta 8, THC-A & more at our Cooper St location. Convenient to Arlington, Grand Prairie, and Mansfield." />
        <meta name="twitter:image" content="https://vapecavetx.com/storefront-arlington.jpg" />
        
        {/* Location-specific keywords */}
        <meta name="keywords" content="vape shop arlington tx, arlington vape store, vape cave arlington, vape near me arlington, delta 8 arlington, thc-a arlington, vape products arlington, disposable vapes arlington, cbd shop arlington, smoke shop arlington texas, premium vape arlington, vape shop google place id" />
        
        {/* Dublin Core Metadata */}
        <meta name="DC.title" content="Vape Cave Arlington | Premium Vape Shop" />
        <meta name="DC.description" content="Arlington's premium vape shop at 4100 S Cooper St #4108. Offering high-quality vape products, Delta 8, THC-A, and accessories." />
        <meta name="DC.subject" content="Vape Shop, Arlington, Delta 8, THC-A, Disposable Vapes" />
        <meta name="DC.creator" content="Vape Cave" />
        <meta name="DC.type" content="LocalBusiness" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.language" content="en-US" />
        <meta name="DC.coverage" content="Arlington, Texas, United States" />
        <meta name="DC.rights" content="Copyright Vape Cave 2023" />
        <meta name="DC.identifier" content="https://vapecavetx.com/locations/arlington" />
        
        {/* Geo meta tags */}
        <meta name="geo.region" content="US-TX" />
        <meta name="geo.placename" content="Arlington" />
        <meta name="geo.position" content="32.687070;-97.134800" />
        <meta name="ICBM" content="32.687070, -97.134800" />
        
        {/* Alternative languages - helpful for international customers */}
        <link rel="alternate" href="https://vapecavetx.com/locations/arlington" hrefLang="en-us" />
        <link rel="alternate" href="https://vapecavetx.com/es/locations/arlington" hrefLang="es" />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-100 py-2 px-4" aria-label="Breadcrumb">
        <ol className="flex text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
          <li className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/" className="text-primary hover:text-primary/80">
              <span itemProp="name">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/locations" className="text-primary hover:text-primary/80">
              <span itemProp="name">Locations</span>
            </Link>
            <meta itemProp="position" content="2" />
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-600" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name">Arlington</span>
            <meta itemProp="position" content="3" />
          </li>
        </ol>
      </nav>
      
      {/* Hero Banner */}
      <section className="relative h-72 md:h-96 overflow-hidden bg-gray-900 py-10">
        <div className="absolute inset-0">
          <img 
            src={location.image} 
            alt="Vape Cave Arlington storefront" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20 mix-blend-multiply"></div>
          <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg font-['Poppins']">Vape Cave Arlington</h1>
          <p className="text-xl md:text-2xl max-w-xl drop-shadow-md text-white/90">
            Arlington's premier destination for premium vaping products, Delta 8, THC-A, and more.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <DirectionsButton
              address={location.fullAddress}
              lat={location.coordinates.lat}
              lng={location.coordinates.lng}
              buttonText="Get Directions"
              className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300"
              googlePlaceId={location.googlePlaceId}
            />
            <a 
              href={`tel:${location.phone.replace(/[^0-9]/g, '')}`} 
              className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 backdrop-blur-sm"
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
                      <h3 className="text-lg font-semibold mb-3 text-white">Address</h3>
                      <p className="text-gray-300 mb-1">{location.fullAddress}</p>
                      <p className="text-gray-300 mb-4">
                        <span className="font-medium">Google Place ID:</span> {location.googlePlaceId || "ChIJ23422NdJSYYRVX94pdZlUGg"}
                      </p>
                      
                      <h3 className="text-lg font-semibold mb-3 text-white">Contact</h3>
                      <p className="text-gray-300 mb-1">
                        <span className="font-medium">Phone:</span> {location.phone}
                      </p>
                      <p className="text-gray-300 mb-4">
                        <span className="font-medium">Email:</span> {location.email}
                      </p>
                      
                      <h3 className="text-lg font-semibold mb-3 text-white">Neighborhood</h3>
                      <p className="text-gray-300 mb-4">{location.neighborhoodInfo}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-white">Hours of Operation</h3>
                      <div className="space-y-2">
                        {Object.entries(location.openingHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between py-1 border-b border-gray-700">
                            <span className="font-medium text-white">{day}</span>
                            <span className="text-gray-300">{hours}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3 text-white">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {location.amenities.map((amenity, index) => (
                            <span 
                              key={index} 
                              className="bg-primary/20 text-white text-sm py-1 px-3 rounded-full border border-gray-700"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="text-lg font-semibold mb-3 text-white">Services Offered</h3>
                    <div className="flex flex-wrap gap-2">
                      {location.services.map((service, index) => (
                        <span 
                          key={index} 
                          className="bg-primary/20 text-white text-sm py-1 px-3 rounded-full border border-gray-700"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-medium rounded-xl overflow-hidden shadow-lg border border-gray-700 p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Popular Products</h3>
                <button 
                  onClick={() => setShowProducts(!showProducts)}
                  className="text-primary hover:text-primary/80"
                  aria-expanded={showProducts}
                >
                  {showProducts ? 'Hide Products' : 'Show Products'}
                </button>
              </div>
              
              {showProducts && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {arlingtonProducts.map((product) => (
                    <div key={product.id} className="bg-medium/50 rounded-lg p-3 hover:bg-medium/80 transition-all border border-gray-700">
                      <div className="aspect-square bg-gray-900 rounded-md mb-2 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="font-medium text-white">{product.name}</h3>
                      <p className="text-sm text-gray-300 line-clamp-2">{product.description}</p>
                      <p className="mt-1 font-bold text-primary">${product.price.toFixed(2)}</p>
                      {product.featured && (
                        <span className="inline-block mt-2 bg-primary/20 text-primary-foreground text-xs py-1 px-2 rounded-full border border-primary/30">
                          {product.featuredLabel || "Popular"}
                        </span>
                      )}
                    </div>
                  ))}
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
                <GoogleMapsIntegration 
                  locations={[{
                    id: location.id,
                    name: location.name,
                    address: location.fullAddress,
                    position: location.coordinates,
                    googlePlaceId: location.googlePlaceId,
                    appleMapsLink: location.appleMapsLink,
                    city: location.city
                  }]}
                  height="100%"
                  width="100%"
                  zoom={15}
                  activeLocationId={location.id}
                  showDirectionsLink={true}
                  apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                  mapType="roadmap"
                />
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
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">Public Transportation</h3>
                  <p className="text-gray-300 text-sm">{location.publicTransit}</p>
                </div>
              )}
              
              {location.parking && (
                <div className="mt-4">
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
                    className="bg-primary/10 text-white text-sm py-1 px-3 rounded-full border border-gray-700"
                  >
                    {payment}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Areas We Serve</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {location.areaServed.map((area, index) => (
              <span key={index} className="bg-primary/10 text-white px-3 py-1 rounded-full border border-gray-700">
                {area}
              </span>
            ))}
          </div>
        </div>
        
        {/* Products & Services Section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Poppins'] mb-3">Products & Services</h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">Discover our premium selection of vaping products and accessories at our Arlington location.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {arlingtonProducts.map((product) => (
              <div key={product.id} className="bg-medium/50 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:bg-medium/80 transition-all">
                <div className="aspect-square bg-gray-900 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white text-lg mb-1">{product.name}</h3>
                  <p className="text-gray-300 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-primary font-bold">${product.price.toFixed(2)}</p>
                    {product.featured && (
                      <span className="bg-primary/20 text-white text-xs py-1 px-2 rounded-full border border-primary/30">
                        {product.featuredLabel || "Popular"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Services */}
            <div className="bg-medium rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Our Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {location.services.map((service, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-primary mr-2 text-lg">✓</span>
                    <span className="text-gray-300">{service}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Amenities */}
            <div className="bg-medium rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Store Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {location.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-primary mr-2 text-lg">✓</span>
                    <span className="text-gray-300">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section with FAQ Schema */}
      <section className="py-14 bg-gradient-to-r from-primary/10 to-primary/5 text-white">
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
                <h3 className="text-lg font-medium text-white" itemProp="name">What are your hours at the Arlington location?</h3>
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
                <h3 className="text-lg font-medium text-white" itemProp="name">What products do you carry at the Arlington location?</h3>
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
                <h3 className="text-lg font-medium text-white" itemProp="name">Do you offer any discounts or loyalty programs?</h3>
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
                <h3 className="text-lg font-medium text-white" itemProp="name">Is there parking available at your Arlington location?</h3>
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
                <h3 className="text-lg font-medium text-white" itemProp="name">Do you offer any expert advice for beginners?</h3>
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