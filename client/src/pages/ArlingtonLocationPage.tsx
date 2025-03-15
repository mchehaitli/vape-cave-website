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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column: Store information */}
            <div>
              <h2 className="text-2xl font-bold font-['Poppins'] mb-6 text-white">About Our Arlington Store</h2>
              <div className="rounded-lg overflow-hidden shadow-lg mb-6">
                <img 
                  src={location.image} 
                  alt={`${location.name} storefront in ${location.city}, TX`} 
                  className="w-full h-auto object-cover"
                width="800"
                height="600"
              />
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Store Details</h2>
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-primary hover:text-primary/80"
                  aria-expanded={showDetails}
                >
                  {showDetails ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showDetails && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Address</h3>
                    <p className="text-gray-600">{location.address}</p>
                    <p className="text-gray-600">{location.city}, TX 76015</p>
                    <div className="mt-2">
                      <DirectionsButton 
                        address={location.fullAddress}
                        lat={location.coordinates.lat}
                        lng={location.coordinates.lng}
                        googlePlaceId={location.googlePlaceId}
                        appleMapsLink={location.appleMapsLink}
                        buttonText="Get Directions"
                        variant="primary"
                        showIcon={true}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Contact</h3>
                    <p className="text-gray-600">Phone: <a href={`tel:${location.phone}`} className="text-primary hover:underline">{location.phone}</a></p>
                    <p className="text-gray-600">Email: <a href={`mailto:${location.email}`} className="text-primary hover:underline">{location.email}</a></p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Hours of Operation</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(location.openingHours).map(([day, hours]) => (
                        <div key={day} className="text-gray-600">
                          <span className="font-medium">{day}:</span> {hours}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Payments Accepted</h3>
                    <p className="text-gray-600">{location.acceptedPayments.join(", ")}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Parking</h3>
                    <p className="text-gray-600">{location.parking}</p>
                  </div>
                  
                  {location.publicTransit && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">Public Transportation</h3>
                      <p className="text-gray-600">{location.publicTransit}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">ADA Accessibility</h3>
                    <p className="text-gray-600">Our store is fully ADA accessible.</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Featured Products Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
                <button 
                  onClick={() => setShowProducts(!showProducts)}
                  className="text-primary hover:text-primary/80"
                  aria-expanded={showProducts}
                >
                  {showProducts ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showProducts && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {arlingtonProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gray-100 rounded-md mb-2 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="font-medium text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                      <p className="mt-1 font-bold text-primary">${product.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right column: Map, services */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Store Location</h2>
              <div className="h-[400px] mb-4 rounded-md overflow-hidden">
                <GoogleMapsIntegration 
                  locations={getFormattedLocationsForMap()}
                  activeLocationId={2}
                  zoom={15}
                  showDirectionsLink={true}
                  height="400px"
                />
              </div>
              <p className="text-gray-600 mb-4">
                {location.neighborhoodInfo}
              </p>
              <DirectionsButton 
                address={location.fullAddress}
                lat={location.coordinates.lat}
                lng={location.coordinates.lng}
                googlePlaceId={location.googlePlaceId}
                appleMapsLink={location.appleMapsLink}
                buttonText="Get Directions"
                variant="outline"
                showIcon={true}
                fullWidth={true}
              />
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Services</h2>
              <div className="grid grid-cols-2 gap-2">
                {location.services.map((service, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-primary mr-2">✓</span>
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About Vape Cave Arlington</h2>
              <p className="text-gray-600 mb-4">
                {location.description}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Established:</span> {location.yearEstablished}
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Store Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {location.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-primary mr-2">✓</span>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Close the right column div */}
        </div>
        {/* Close the grid container div */}
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Areas We Serve</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {location.areaServed.map((area, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
      </section>
    </MainLayout>
  );
};

export default ArlingtonLocationPage;