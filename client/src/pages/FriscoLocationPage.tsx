import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Helmet } from "react-helmet";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";
import GoogleMapsIntegration from "@/components/GoogleMapsIntegration";
import DirectionsButton from "@/components/DirectionsButton";
import { 
  useFriscoLocation, 
  useFormattedLocationsForMap,
  getOrderedOpeningHours 
} from "@/hooks/use-store-locations";
import { products } from "@/data/products";

/**
 * Dedicated page for the Frisco location with enhanced SEO
 * This page focuses on the Frisco store specifically to improve local search visibility
 */
const FriscoLocationPage: React.FC = () => {
  const { data: locationData, isLoading } = useFriscoLocation();
  const { data: formattedLocations } = useFormattedLocationsForMap();
  const friscoProducts = products.filter(p => p.featured).slice(0, 4); // Display featured products at Frisco location
  
  // If location data is still loading, show a simplified version with loading indicators
  const location = locationData ? {
    // Map API fields to match the expected structure
    id: locationData.id,
    name: locationData.name,
    city: locationData.city,
    address: locationData.address,
    fullAddress: locationData.full_address,
    phone: locationData.phone,
    hours: locationData.hours,
    closedDays: locationData.closed_days || "",
    image: locationData.image,
    coordinates: {
      lat: parseFloat(locationData.lat as string),
      lng: parseFloat(locationData.lng as string)
    },
    googlePlaceId: locationData.google_place_id,
    appleMapsLink: locationData.apple_maps_link,
    mapEmbed: locationData.map_embed,
    email: locationData.email,
    storeCode: locationData.store_code,
    openingHours: locationData.opening_hours || {},
    services: locationData.services || [],
    acceptedPayments: locationData.accepted_payments || [],
    areaServed: locationData.area_served || [],
    publicTransit: locationData.public_transit,
    parking: locationData.parking,
    yearEstablished: locationData.year_established || 2020,
    priceRange: locationData.price_range || "$$",
    socialProfiles: locationData.social_profiles || {},
    description: locationData.description,
    neighborhoodInfo: locationData.neighborhood_info,
    amenities: locationData.amenities || []
  } : {
    // Fallback data structure while loading
    id: 1,
    name: "Vape Cave Frisco",
    city: "Frisco",
    address: "Loading...",
    fullAddress: "Loading address...",
    phone: "Loading...",
    hours: "Loading hours...",
    closedDays: "",
    image: "",
    coordinates: { lat: 0, lng: 0 },
    googlePlaceId: "",
    appleMapsLink: "",
    mapEmbed: "",
    email: "",
    storeCode: "",
    openingHours: {},
    services: [],
    acceptedPayments: [],
    areaServed: [],
    publicTransit: "",
    parking: "",
    yearEstablished: 2020,
    priceRange: "$$",
    socialProfiles: {},
    description: "Loading description...",
    neighborhoodInfo: "",
    amenities: []
  };
  
  // Create enhanced structured data specifically for Frisco location with maximum Google-recommended properties
  const generateFriscoStructuredData = () => {
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
    
    // Enhanced schema specifically for Frisco with maximal detail
    // Using all recommended properties from Google for LocalBusiness entities
    return {
      "@context": "https://schema.org",
      "@type": "VapeShop",
      "@id": "https://vapecavetx.com/locations/frisco",
      "name": location.name,
      "alternateName": "Vape Cave Frisco - Premium Vape Shop",
      "url": "https://vapecavetx.com/locations/frisco",
      "logo": {
        "@type": "ImageObject",
        "url": "https://vapecavetx.com/logo.png",
        "width": "180",
        "height": "60"
      },
      "image": [
        location.image,
        "https://vapecavetx.com/storefront-frisco.jpg",
        "https://vapecavetx.com/interior-frisco.jpg"
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
        "longitude": location.coordinates.lng,
        "name": "Vape Cave Frisco Location Coordinates"
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
          "value": location.googlePlaceId || "ChIJxXjrR3wVkFQRcKK89i-aFDw"
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
          "value": location.storeCode || "VC-FRISCO"
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
      "keywords": "vape shop frisco, delta 8 frisco, thc-a frisco, premium vape frisco, frisco vape shop, vape products frisco tx, vaping frisco, smoke shop frisco, vape accessories frisco, premium vape products frisco, cbd frisco tx",
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
            "urlTemplate": "https://vapecavetx.com/locations/frisco"
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
        "ratingValue": "4.8",
        "ratingCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Michael R."
          },
          "datePublished": "2024-02-15",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
          },
          "reviewBody": "Best vape shop in Frisco! Amazing selection of Delta 8 products and the staff really know their products."
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Sarah T."
          },
          "datePublished": "2024-01-22",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
          },
          "reviewBody": "Convenient location on Main Street with friendly staff and competitive prices."
        }
      ]
    };
  };

  // Local state for toggling sections
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [showProducts, setShowProducts] = useState<boolean>(true);
  
  // State for collapsible FAQ items
  const [openFAQs, setOpenFAQs] = useState<Record<number, boolean>>({});
  
  // Function to toggle FAQ item open/closed
  const toggleFAQ = (faqId: number) => {
    setOpenFAQs(prev => ({
      ...prev,
      [faqId]: !prev[faqId]
    }));
  };
  
  return (
    <MainLayout
      title="Vape Cave Frisco TX | Best Vape Shop near Main St | Premium Vaping Products"
      description="Visit Vape Cave at 6958 Main St #200 in Frisco, TX for premium vaping products, Elf Bar, Lost Mary, Geek Vape, Delta 8, THC-A & accessories. Open daily 10AM-12AM."
      canonical="https://vapecavetx.com/locations/frisco"
      ogImage="https://vapecavetx.com/storefront-frisco.jpg"
      structuredData={generateFriscoStructuredData()}
    >
      {/* Additional SEO metadata specific to Frisco location */}
      <Helmet>
        <title>Vape Cave Frisco | #1 Vape Shop in Frisco TX | Premium Vaping Products, Elf Bar, Lost Mary & Delta 8</title>
        <meta name="description" content="Looking for the best vape shop in Frisco? Visit Vape Cave at 6958 Main St #200. Offering premium products including Elf Bar, Lost Mary, Geek Vape, Delta 8, THC-A, disposables & CBD. Open daily 10AM-12AM." />
        <link rel="canonical" href="https://vapecavetx.com/locations/frisco" />
        
        {/* Open Graph & Twitter */}
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="business.business" />
        <meta property="og:title" content="Vape Cave Frisco TX | Best Vape Shop for Elf Bar, Lost Mary & Delta 8" />
        <meta property="og:description" content="Visit the #1 vape shop in Frisco at 6958 Main St #200. We offer premium products including Elf Bar, Lost Mary, GeekVape, Delta 8, THC-A, and more at our convenient Main St location." />
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
        <meta name="twitter:title" content="Vape Cave Frisco | #1 Vape Shop in Frisco TX" />
        <meta name="twitter:description" content="Top-rated vape shop in Frisco offering Elf Bar, Lost Mary, GeekVape, Delta 8, THC-A & more at our Main St location. Convenient to Frisco, Allen, and Plano." />
        <meta name="twitter:image" content="https://vapecavetx.com/storefront-frisco.jpg" />
        
        {/* Location-specific keywords */}
        <meta name="keywords" content="vape shop frisco tx, frisco vape store, vape cave frisco, vape near me frisco, delta 8 frisco, thc-a frisco, vape products frisco, disposable vapes frisco, cbd shop frisco, smoke shop frisco texas, premium vape frisco, vape shop google place id, geekvape frisco, elf bar frisco, lost mary frisco, hyde vape frisco, lost vape frisco, caliburn frisco, delta 10 frisco, hhc frisco, vape shop near me, smoke shop near me, best vape shop frisco" />
        
        {/* Dublin Core Metadata */}
        <meta name="DC.title" content="Vape Cave Frisco TX | #1 Vape Shop for Elf Bar, Lost Mary & Delta 8" />
        <meta name="DC.description" content="Frisco's #1 vape shop at 6958 Main St #200. Offering high-quality products including Elf Bar, Lost Mary, GeekVape, Delta 8, THC-A, and accessories." />
        <meta name="DC.subject" content="Vape Shop, Frisco, Elf Bar, Lost Mary, GeekVape, Delta 8, THC-A, Disposable Vapes" />
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



      {/* Hero Banner */}
      <section className="relative h-72 md:h-96 overflow-hidden bg-gray-900 py-10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black"></div>
          <div className="absolute inset-0 bg-[url('/vapecave-logo.png')] bg-center bg-no-repeat bg-contain opacity-10"></div>
          <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg font-['Poppins']">
            Vape Cave <span className="text-primary">Frisco</span>
          </h1>
          <h2 
            className="text-xl md:text-2xl lg:text-3xl mb-8 text-white/90 font-medium max-w-[1100px] leading-relaxed"
          >
            Your One Stop Vape Shop for <span className="text-primary font-semibold">Disposables</span> | <span className="text-primary font-semibold">E-Liquids</span> | <span className="text-primary font-semibold">Salts</span> | <span className="text-primary font-semibold">Delta</span> | <span className="text-primary font-semibold">THC - A</span> | <span className="text-primary font-semibold">Glass</span> | <span className="text-primary font-semibold">Tobacco</span> | <span className="text-primary font-semibold">Hookah / Shisha</span> | <span className="text-primary font-semibold">Vaporizers</span> | <span className="text-primary font-semibold">Mods</span> | and much more
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <a 
              href="https://maps.app.goo.gl/jzbqUDyvvGHuwyXJ7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Google Maps
            </a>
            <a 
              href="https://maps.apple.com/?address=6958%20Main%20St,%20Unit%20200,%20Frisco,%20TX%20%2075033,%20United%20States&auid=14231591118256703794&ll=33.150849,-96.824392&lsp=9902&q=Vape%20Cave%20Smoke%20%26%20Stuff&t=m" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2 rounded-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Apple Maps
            </a>
            <a 
              href={`tel:${location.phone.replace(/[^0-9]/g, '')}`} 
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 flex items-center backdrop-blur-sm hover:shadow-lg"
            >
              <i className="fas fa-phone mr-2"></i>
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Location Information */}
      <section className="py-12 bg-dark text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Poppins'] mb-3">Store Information</h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">All the details you need about our Frisco location.</p>
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
                        <span className="font-medium">Google Place ID:</span> {location.googlePlaceId || "ChIJxXjrR3wVkFQRcKK89i-aFDw"}
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
                        {getOrderedOpeningHours(location.openingHours).map(({day, hours}) => (
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
                              className="bg-black/30 text-primary text-xs font-medium py-1 px-3 rounded-full border border-gray-800"
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
                    
                    {/* Featured Products at Frisco */}
                    <h3 className="text-xl font-semibold mb-4 text-white">Featured Products at Frisco</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                      {friscoProducts.map((product) => (
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
                                {product.featuredLabel || "Featured"}
                              </span>
                            )}
                            <h3 className="font-['Poppins'] font-semibold text-lg mb-2">{product.name}</h3>
                            <p className="text-dark/70 text-sm mb-4">{product.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                              <Link href="/products">
                                <button className="bg-primary hover:bg-primary/90 text-black font-medium py-2 px-4 rounded-md transition-colors">
                                  Add to Cart
                                </button>
                              </Link>
                            </div>
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
                  {/* Using iframe for consistent map display across all location pages */}
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
                <p className="text-sm text-gray-300 mb-3">
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
                  <a 
                    href="https://maps.app.goo.gl/jzbqUDyvvGHuwyXJ7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors mb-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Google Maps Directions
                  </a>
                  <a 
                    href="https://maps.apple.com/?address=6958%20Main%20St,%20Unit%20200,%20Frisco,%20TX%20%2075033,%20United%20States&auid=14231591118256703794&ll=33.150849,-96.824392&lsp=9902&q=Vape%20Cave%20Smoke%20%26%20Stuff&t=m" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Apple Maps Directions
                  </a>
                  
                  {location.publicTransit && (
                    <div className="p-4 bg-black/30 rounded-lg border border-gray-800">
                      <h4 className="font-medium text-white mb-1">Public Transit</h4>
                      <p className="text-gray-300 text-sm">{location.publicTransit}</p>
                    </div>
                  )}
                  
                  {location.parking && (
                    <div className="p-4 bg-black/30 rounded-lg border border-gray-800">
                      <h4 className="font-medium text-white mb-1">Parking Information</h4>
                      <p className="text-gray-300 text-sm">{location.parking}</p>
                    </div>
                  )}
                </div>
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
            <p className="text-gray-300 max-w-2xl mx-auto">Find answers to the most common questions about our Frisco location.</p>
          </div>
          
          <div 
            className="max-w-3xl mx-auto divide-y divide-gray-700"
            itemScope 
            itemType="https://schema.org/FAQPage"
          >
            {/* FAQ Item 1 */}
            <div className="py-5" itemScope itemType="https://schema.org/Question">
              <div 
                className="flex justify-between cursor-pointer" 
                onClick={() => toggleFAQ(1)}
              >
                <h3 className="text-lg font-medium text-primary" itemProp="name">What are your hours at the Frisco location?</h3>
                <button className="text-primary focus:outline-none transition-transform">
                  {openFAQs[1] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              {openFAQs[1] && (
                <div className="mt-2" itemScope itemType="https://schema.org/Answer">
                  <div itemProp="text">
                    <p className="text-gray-300">
                      Our Frisco store is open from 10:00 AM to 12:00 AM Monday through Thursday and Sunday. 
                      On Friday and Saturday, we offer extended hours from 10:00 AM to 1:00 AM.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* FAQ Item 2 */}
            <div className="py-5" itemScope itemType="https://schema.org/Question">
              <div 
                className="flex justify-between cursor-pointer"
                onClick={() => toggleFAQ(2)}
              >
                <h3 className="text-lg font-medium text-primary" itemProp="name">What products do you carry at the Frisco location?</h3>
                <button className="text-primary focus:outline-none transition-transform">
                  {openFAQs[2] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              {openFAQs[2] && (
                <div className="mt-2" itemScope itemType="https://schema.org/Answer">
                  <div itemProp="text">
                    <p className="text-gray-300">
                      Our Frisco location offers a full range of vaping products including disposable vapes, Delta 8, THC-A flower, 
                      Delta 9 edibles, pre-rolls, premium flower, vape pens, cartridges, accessories, and glass products. 
                      Our selection is updated regularly with the latest products.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* FAQ Item 3 */}
            <div className="py-5" itemScope itemType="https://schema.org/Question">
              <div 
                className="flex justify-between cursor-pointer"
                onClick={() => toggleFAQ(3)}
              >
                <h3 className="text-lg font-medium text-primary" itemProp="name">How do I find your Frisco store online?</h3>
                <button className="text-primary focus:outline-none transition-transform">
                  {openFAQs[3] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              {openFAQs[3] && (
                <div className="mt-2" itemScope itemType="https://schema.org/Answer">
                  <div itemProp="text">
                    <p className="text-gray-300">
                      The easiest way to find our Frisco store is to visit our Google Business page by clicking the "Visit Our Google Business Page" 
                      link on our website. This will show you our exact location, hours, customer reviews, and photos of our store. For Apple 
                      device users, we also provide a direct Apple Maps link for easy navigation.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* FAQ Item 4 */}
            <div className="py-5" itemScope itemType="https://schema.org/Question">
              <div 
                className="flex justify-between cursor-pointer"
                onClick={() => toggleFAQ(4)}
              >
                <h3 className="text-lg font-medium text-primary" itemProp="name">Do you offer any special discounts at the Frisco location?</h3>
                <button className="text-primary focus:outline-none transition-transform">
                  {openFAQs[4] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              {openFAQs[4] && (
                <div className="mt-2" itemScope itemType="https://schema.org/Answer">
                  <div itemProp="text">
                    <p className="text-gray-300">
                      Yes, our Frisco store offers several special discounts including military discounts, student discounts, 
                      and a rewards program for frequent customers. We also run weekly specials on select products. 
                      Visit our store or call us at {location.phone} to learn more about our current promotions.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Visit Us CTA */}
      <section className="py-14 bg-darker">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-['Poppins'] mb-4 text-white">Visit Our Frisco Location Today!</h2>
            <p className="text-gray-300 text-lg mb-8">
              Experience our friendly atmosphere, knowledgeable staff, and premium selection of vaping products and accessories.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://maps.app.goo.gl/jzbqUDyvvGHuwyXJ7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Google Maps
              </a>
              <a 
                href="https://maps.apple.com/?address=6958%20Main%20St,%20Unit%20200,%20Frisco,%20TX%20%2075033,%20United%20States&auid=14231591118256703794&ll=33.150849,-96.824392&lsp=9902&q=Vape%20Cave%20Smoke%20%26%20Stuff&t=m" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-3 px-8 rounded-lg transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Apple Maps
              </a>
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

export default FriscoLocationPage;