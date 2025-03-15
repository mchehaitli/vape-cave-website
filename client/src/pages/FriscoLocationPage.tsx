import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import GoogleMapsIntegration from "@/components/GoogleMapsIntegration";
import DirectionsButton from "@/components/DirectionsButton";
import { getFriscoLocation, getFormattedLocationsForMap } from "@/data/storeInfo";
import { products } from "@/data/products";

/**
 * Dedicated page for the Frisco location with enhanced SEO
 * This page focuses on the Frisco store specifically to improve local search visibility
 */
const FriscoLocationPage: React.FC = () => {
  const location = getFriscoLocation();
  const friscoProducts = products.filter(p => p.featured).slice(0, 4); // Display featured products at Frisco location
  
  // Create enhanced structured data specifically for Frisco location
  const generateFriscoStructuredData = () => {
    // Parse postal code from address
    const zipCodeMatch = location.fullAddress.match(/\d{5}(?![\d-])/);
    const postalCode = zipCodeMatch ? zipCodeMatch[0] : "";
    
    // Format phone for structured data (remove non-digits and add country code)
    const formattedPhone = "+1" + location.phone.replace(/[^0-9]/g, '');
    
    // Enhanced schema specifically for Frisco with maximal detail
    return {
      "@context": "https://schema.org",
      "@type": "VapeShop",
      "@id": "https://vapecavetx.com/locations/frisco",
      "name": location.name,
      "alternateName": "Vape Cave Frisco - Premium Vape Shop",
      "url": "https://vapecavetx.com/locations/frisco",
      "logo": "https://vapecavetx.com/logo.png",
      "image": location.image,
      "telephone": formattedPhone,
      "email": location.email,
      "description": location.description,
      "areaServed": location.areaServed,
      "slogan": "Frisco's premier destination for quality vaping products and accessories",
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
        "longitude": location.coordinates.lng
      },
      "hasMap": [
        {
          "@type": "Map",
          "url": location.googlePlaceId ? `https://www.google.com/maps/place/?q=place_id:${location.googlePlaceId}` : ""
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
          "value": location.googlePlaceId || "ChIJxXjrR3wVkFQRcKK89i-aFDw"
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
        }
      ],
      "openingHoursSpecification": Object.entries(location.openingHours).map(([day, hours]) => {
        const parts = hours.split(' - ');
        return {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": day,
          "opens": parts[0],
          "closes": parts[1] === "Closed" ? "00:00" : parts[1]
        };
      }),
      "priceRange": location.priceRange,
      "paymentAccepted": location.acceptedPayments.join(", "),
      "currenciesAccepted": "USD",
      "publicAccess": true,
      "isAccessibleForFree": true,
      "smokingAllowed": true,
      "keywords": "vape shop frisco, delta 8 frisco, thc-a frisco, 552G+86, frisco vape shop, vape products frisco tx, vaping frisco, smoke shop frisco, vape accessories frisco, premium vape products frisco, cbd frisco tx",
      "amenityFeature": location.amenities.map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity,
        "value": true
      })),
      "department": location.services.map(service => ({
        "@type": "Department",
        "name": service
      })),
      "makesOffer": friscoProducts.map(product => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": product.name,
          "description": product.description,
          "image": product.image,
          "category": product.category,
          "offers": {
            "@type": "Offer",
            "price": product.price,
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
            "urlTemplate": "https://vapecavetx.com/locations/frisco"
          }
        },
        {
          "@type": "MapAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": location.googlePlaceId ? `https://www.google.com/maps/place/?q=place_id:${location.googlePlaceId}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.fullAddress)}`
          }
        },
        {
          "@type": "FindAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": location.googlePlaceId ? `https://www.google.com/maps/place/?q=place_id:${location.googlePlaceId}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.fullAddress)}`
          },
          "query-input": "required name=vape shop location"
        }
      ],
      "sameAs": [
        location.socialProfiles?.facebook,
        location.socialProfiles?.instagram,
        location.socialProfiles?.twitter,
        location.socialProfiles?.yelp
      ].filter(Boolean)
    };
  };

  // Local state for toggling sections
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [showProducts, setShowProducts] = useState<boolean>(true);
  
  return (
    <MainLayout
      title="Vape Cave Frisco | Vape Shop at 552G+86 | Premium Vaping Products & Delta 8"
      description="Visit Vape Cave in Frisco (Plus Code: 552G+86) at 6958 Main St #200. Offering premium vape products, Delta 8, THC-A, disposables & accessories. Open daily 10AM-12AM."
      canonical="https://vapecavetx.com/locations/frisco"
      ogImage="https://vapecavetx.com/storefront-frisco.jpg"
      structuredData={generateFriscoStructuredData()}
    >
      {/* Additional SEO metadata specific to Frisco location */}
      <Helmet>
        <title>Vape Cave Frisco | Vape Shop at 552G+86 | Premium Vaping Products & Delta 8</title>
        <meta name="description" content="Visit Vape Cave in Frisco (Plus Code: 552G+86) at 6958 Main St #200. Offering premium vape products, Delta 8, THC-A, disposables & accessories. Open daily 10AM-12AM." />
        <link rel="canonical" href="https://vapecavetx.com/locations/frisco" />
        
        {/* Open Graph & Twitter */}
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="business.business" />
        <meta property="og:title" content="Vape Cave Frisco | Plus Code: 552G+86 | Premium Vape Shop" />
        <meta property="og:description" content="Visit Vape Cave in Frisco (Plus Code: 552G+86). We offer premium vaping products, Delta 8, THC-A, and more. Find us easily with our Google Maps Plus Code!" />
        <meta property="og:url" content="https://vapecavetx.com/locations/frisco" />
        <meta property="og:site_name" content="Vape Cave" />
        <meta property="og:image" content="https://vapecavetx.com/storefront-frisco.jpg" />
        <meta property="business:contact_data:street_address" content="6958 Main St #200" />
        <meta property="business:contact_data:locality" content="Frisco" />
        <meta property="business:contact_data:region" content="TX" />
        <meta property="business:contact_data:postal_code" content="75033" />
        <meta property="business:contact_data:country_name" content="United States" />
        <meta property="business:contact_data:email" content="vapecavetex@gmail.com" />
        <meta property="business:contact_data:phone_number" content="+14692940061" />
        <meta property="business:hours:day" content="monday" />
        <meta property="business:hours:start" content="10:00" />
        <meta property="business:hours:end" content="24:00" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vape Cave Frisco | Vape Shop with Plus Code: 552G+86" />
        <meta name="twitter:description" content="Premium vape shop in Frisco offering Delta 8, THC-A & more. Find us using Plus Code: 552G+86" />
        <meta name="twitter:image" content="https://vapecavetx.com/storefront-frisco.jpg" />
        
        {/* Location-specific keywords */}
        <meta name="keywords" content="vape shop frisco tx, frisco vape store, 552G+86, vape cave frisco, vape near me frisco, delta 8 frisco, thc-a frisco, vape products frisco, disposable vapes frisco, cbd shop frisco, smoke shop frisco texas" />
        
        {/* Dublin Core Metadata */}
        <meta name="DC.title" content="Vape Cave Frisco | Premium Vape Shop" />
        <meta name="DC.description" content="Frisco's premium vape shop at 6958 Main St #200 (Plus Code: 552G+86). Offering high-quality vape products, Delta 8, THC-A, and accessories." />
        <meta name="DC.subject" content="Vape Shop, Frisco, Delta 8, THC-A, Disposable Vapes" />
        <meta name="DC.creator" content="Vape Cave" />
        <meta name="DC.type" content="LocalBusiness" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.language" content="en-US" />
        <meta name="DC.coverage" content="Frisco, Texas, United States" />
        <meta name="DC.rights" content="Copyright Vape Cave 2023" />
        <meta name="DC.identifier" content="https://vapecavetx.com/locations/frisco" />
        
        {/* Geo meta tags */}
        <meta name="geo.region" content="US-TX" />
        <meta name="geo.placename" content="Frisco" />
        <meta name="geo.position" content="33.150730;-96.822550" />
        <meta name="ICBM" content="33.150730, -96.822550" />
        
        {/* Alternative languages - helpful for international customers */}
        <link rel="alternate" href="https://vapecavetx.com/locations/frisco" hrefLang="en-us" />
        <link rel="alternate" href="https://vapecavetx.com/es/locations/frisco" hrefLang="es" />
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
            <span itemProp="name">Frisco</span>
            <meta itemProp="position" content="3" />
          </li>
        </ol>
      </nav>

      {/* Hero Banner */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={location.image} 
            alt="Vape Cave Frisco storefront" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">Vape Cave Frisco</h1>
          <p className="text-xl md:text-2xl max-w-xl drop-shadow-md">
            Frisco's premier destination for premium vaping products, Delta 8, THC-A, and more.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
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
              className="bg-white text-primary hover:bg-primary/10 font-medium py-2 px-6 rounded-md flex items-center shadow-sm"
            >
              <i className="fas fa-phone mr-2"></i>
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Location Information */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Store Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Store Information</h2>
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-primary hover:text-primary/80"
                  aria-expanded={showDetails}
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              
              {showDetails && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Address</h3>
                      <p className="text-gray-700 mb-1">{location.fullAddress}</p>
                      <p className="text-gray-700 mb-4">
                        <span className="font-medium">Google Place ID:</span> {location.googlePlaceId || "ChIJxXjrR3wVkFQRcKK89i-aFDw"}
                      </p>
                      
                      <h3 className="text-lg font-semibold mb-3">Contact</h3>
                      <p className="text-gray-700 mb-1">
                        <span className="font-medium">Phone:</span> {location.phone}
                      </p>
                      <p className="text-gray-700 mb-4">
                        <span className="font-medium">Email:</span> {location.email}
                      </p>
                      
                      <h3 className="text-lg font-semibold mb-3">Neighborhood</h3>
                      <p className="text-gray-700 mb-4">{location.neighborhoodInfo}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Hours of Operation</h3>
                      <div className="space-y-2">
                        {Object.entries(location.openingHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between py-1 border-b border-gray-200">
                            <span className="font-medium text-gray-800">{day}</span>
                            <span className="text-gray-600">{hours}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {location.amenities.map((amenity, index) => (
                            <span 
                              key={index} 
                              className="bg-primary/10 text-primary text-xs font-medium py-1 px-3 rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Area Served */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Areas We Serve</h3>
                <p className="text-gray-700 mb-3">
                  Conveniently located to serve customers in:
                </p>
                <div className="flex flex-wrap gap-2">
                  {location.areaServed.map((area, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-200 text-gray-800 text-sm py-1 px-3 rounded-full"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Products/Services */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">Products & Services</h2>
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
                        <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center">
                          <div className="bg-primary/20 text-primary rounded-full p-3 mr-4">
                            <i className="fas fa-check"></i>
                          </div>
                          <div>
                            <h4 className="font-medium">{service}</h4>
                            <p className="text-sm text-gray-600">Available in-store</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Featured Products at Frisco */}
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Featured Products at Frisco</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {friscoProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                          <div className="h-40 overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium mb-1">{product.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{product.category}</p>
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
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Location & Directions</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">Interactive Map</h3>
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
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Google Business:</strong> 
                  <a 
                    href={`https://www.google.com/maps/place/?q=place_id:${location.googlePlaceId}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline ml-2"
                    aria-label={`Find ${location.name} on Google Maps Business Page`}
                  >
                    Visit Our Google Business Page
                  </a>
                </p>
                
                <div className="space-y-4">
                  <DirectionsButton
                    address={location.fullAddress}
                    lat={location.coordinates.lat}
                    lng={location.coordinates.lng}
                    buttonText="Get Directions with Google Maps"
                    className="w-full"
                    variant="primary"
                    showIcon={true}
                    fullWidth={true}
                    googlePlaceId={location.googlePlaceId}
                    appleMapsLink={location.appleMapsLink}
                  />
                  
                  {location.publicTransit && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-1">Public Transit</h4>
                      <p className="text-blue-600 text-sm">{location.publicTransit}</p>
                    </div>
                  )}
                  
                  {location.parking && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-700 mb-1">Parking Information</h4>
                      <p className="text-green-600 text-sm">{location.parking}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Accepted Payment Methods</h3>
                <div className="flex flex-wrap gap-2">
                  {location.acceptedPayments.map((payment, index) => (
                    <span 
                      key={index} 
                      className="bg-white border border-gray-200 text-sm py-1 px-3 rounded-full"
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
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Frequently Asked Questions</h2>
          
          <div 
            className="max-w-3xl mx-auto divide-y"
            itemScope 
            itemType="https://schema.org/FAQPage"
          >
            {/* FAQ Item 1 */}
            <div className="py-5" itemScope itemType="https://schema.org/Question">
              <div className="flex justify-between cursor-pointer">
                <h3 className="text-lg font-medium text-gray-800" itemProp="name">What are your hours at the Frisco location?</h3>
              </div>
              <div className="mt-2" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p className="text-gray-600">
                    Our Frisco store is open from 10:00 AM to 12:00 AM Monday through Thursday and Sunday. 
                    On Friday and Saturday, we offer extended hours from 10:00 AM to 1:00 AM.
                  </p>
                </div>
              </div>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="py-5" itemScope itemType="https://schema.org/Question">
              <div className="flex justify-between cursor-pointer">
                <h3 className="text-lg font-medium text-gray-800" itemProp="name">What products do you carry at the Frisco location?</h3>
              </div>
              <div className="mt-2" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p className="text-gray-600">
                    Our Frisco location offers a full range of vaping products including disposable vapes, Delta 8, THC-A flower, 
                    Delta 9 edibles, pre-rolls, premium flower, vape pens, cartridges, accessories, and glass products. 
                    Our selection is updated regularly with the latest products.
                  </p>
                </div>
              </div>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="py-5" itemScope itemType="https://schema.org/Question">
              <div className="flex justify-between cursor-pointer">
                <h3 className="text-lg font-medium text-gray-800" itemProp="name">How do I find your Frisco store online?</h3>
              </div>
              <div className="mt-2" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p className="text-gray-600">
                    The easiest way to find our Frisco store is to visit our Google Business page by clicking the "Visit Our Google Business Page" 
                    link on our website. This will show you our exact location, hours, customer reviews, and photos of our store. For Apple 
                    device users, we also provide a direct Apple Maps link for easy navigation.
                  </p>
                </div>
              </div>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="py-5" itemScope itemType="https://schema.org/Question">
              <div className="flex justify-between cursor-pointer">
                <h3 className="text-lg font-medium text-gray-800" itemProp="name">Do you offer any special discounts at the Frisco location?</h3>
              </div>
              <div className="mt-2" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p className="text-gray-600">
                    Yes, our Frisco store offers several special discounts including military discounts, student discounts, 
                    and a rewards program for frequent customers. We also run weekly specials on select products. 
                    Visit our store or call us at {location.phone} to learn more about our current promotions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Visit Us CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Visit Our Frisco Location Today!</h2>
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
                className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-md shadow-md"
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

export default FriscoLocationPage;