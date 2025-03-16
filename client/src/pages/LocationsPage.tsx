import MainLayout from "@/layouts/MainLayout";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import DirectionsButton from "@/components/DirectionsButton";
import GoogleMapsIntegration from "@/components/GoogleMapsIntegration";
import { useStoreLocations, useFormattedLocationsForMap, getOrderedOpeningHours } from "@/hooks/use-store-locations";

const LocationsPage = () => {
  // Use API data instead of static data and get formatted locations for backward compatibility 
  const { data: locations, isLoading } = useStoreLocations();
  const { data: formattedLocations } = useFormattedLocationsForMap();
  
  // Type-safe approach
  type MappedLocation = {
    id: number;
    name: string;
    city: string;
    address: string;
    fullAddress: string;
    phone: string;
    hours: string;
    closedDays: string;
    image: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    openingHours: Record<string, string>;
    mapEmbed: string;
    email?: string;
    googlePlaceId?: string;
    appleMapsLink?: string;
    storeCode?: string;
    services: string[];
    acceptedPayments: string[];
    areaServed: string[];
    publicTransit?: string;
    parking?: string;
    yearEstablished: number;
    priceRange: string;
    socialProfiles?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      yelp?: string;
    };
    description: string;
    neighborhoodInfo?: string;
    amenities: string[];
  };
  
  // Create enhanced structured data for SEO - more detailed for better search visibility
  const generateLocalBusinessSchema = (location: any) => {
    // Parse postal code from address (ZIP code is the last 5 digits in US addresses)
    const zipCodeMatch = location.fullAddress.match(/\d{5}(?![\d-])/);
    const postalCode = zipCodeMatch ? zipCodeMatch[0] : "";
    
    // Format phone for structured data (remove non-digits and add country code)
    const formattedPhone = "+1" + location.phone.replace(/[^0-9]/g, '');
    
    // Enhanced schema for each location with equal treatment
    const locationName = location.city.toLowerCase();
    
    const schema = {
      "@context": "https://schema.org",
      "@type": "VapeShop", // More specific type for better SEO
      "@id": `https://vapecavetx.com/locations/${locationName}`,
      "name": location.name,
      "alternateName": `Vape Cave ${location.city} - Premium Vape Shop`,
      "url": `https://vapecavetx.com/locations/${locationName}`,
      "logo": "https://vapecavetx.com/logo.png",
      "image": location.image,
      "telephone": formattedPhone,
      "email": location.email,
      "description": location.description,
      "areaServed": location.areaServed,
      "slogan": `${location.city}'s premier destination for quality vaping products and accessories`,
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
          "url": location.googlePlaceId 
            ? `https://www.google.com/maps/place/?q=place_id:${location.googlePlaceId}`
            : `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`
        },
        {
          "@type": "Map",
          "url": location.mapEmbed
        },
        {
          "@type": "Map", 
          "url": location.appleMapsLink || `https://maps.apple.com/?q=${location.fullAddress}`
        }
      ],
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "yearEstablished",
          "value": location.yearEstablished
        },
        // Removed Plus Code reference for enhanced SEO with direct map links
        {
          "@type": "PropertyValue",
          "name": "googlePlaceId",
          "value": location.googlePlaceId || ""
        }
      ].filter(Boolean),
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
      "keywords": `vape shop ${location.city.toLowerCase()}, delta 8 ${location.city.toLowerCase()}, thc-a ${location.city.toLowerCase()}, ${location.city.toLowerCase()} vape shop, vape products ${location.city.toLowerCase()} tx, vaping ${location.city.toLowerCase()}, smoke shop ${location.city.toLowerCase()}, vape accessories ${location.city.toLowerCase()}`,
      "amenityFeature": location.amenities.map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity,
        "value": true
      })),
      "department": location.services.map(service => ({
        "@type": "Department",
        "name": service
      })),
      "potentialAction": [
        {
          "@type": "ViewAction", 
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `https://vapecavetx.com/locations/${location.city.toLowerCase()}`
          }
        },
        {
          "@type": "MapAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": location.googlePlaceId 
              ? `https://www.google.com/maps/place/?q=place_id:${location.googlePlaceId}`
              : `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`
          }
        },
        {
          "@type": "FindAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": location.googlePlaceId 
              ? `https://www.google.com/maps/place/?q=place_id:${location.googlePlaceId}`
              : `https://www.google.com/maps/search/?api=1&query=${location.city}+vape+shop`
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
    
    return schema;
  };

  // Don't set any location as active by default to avoid favoring one location over another
  const [activeLocation, setActiveLocation] = useState<number | null>(null);
  
  // Show loading state if data is not yet available
  if (isLoading || !locations || !formattedLocations) {
    return (
      <MainLayout title="Loading..." description="Loading location data...">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="w-full h-64 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Vape Cave Store Locations | Premium Vape Shops in Frisco & Arlington, TX | Store Hours & Directions"
      description="Visit our Vape Cave locations in Frisco and Arlington, TX. Both stores offer premium vaping products, Delta 8, THC-A, disposables, glass, and accessories. Find directions and store hours for both locations."
    >
      {/* SEO Schema.org structured data */}
      <Helmet>
        <title>Vape Cave Store Locations | Premium Vape Shops in Frisco & Arlington, TX | Store Hours & Directions</title>
        <meta name="description" content="Visit our Vape Cave locations in Frisco (6958 Main St #200) and Arlington (4100 S Cooper St #4108). Both stores offer premium vaping products, Delta 8, THC-A, disposables, and accessories." />
        <link rel="canonical" href="https://vapecavetx.com/locations" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="business.business" />
        <meta property="og:title" content="Vape Cave Store Locations | Premium Vape Shops in DFW" />
        <meta property="og:description" content="Find our Vape Cave locations in Frisco and Arlington, TX. Both stores offer premium vapes, Delta 8, THC-A, and more at our convenient Dallas-Fort Worth locations." />
        <meta property="og:url" content="https://vapecavetx.com/locations" />
        <meta property="og:site_name" content="Vape Cave" />
        <meta property="og:image" content="https://vapecavetx.com/vapecave-logo.png" />
        <meta property="business:contact_data:country_name" content="United States" />
        <meta property="business:contact_data:email" content="vapecavetx@gmail.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vape Cave Store Locations | Find Us in Frisco & Arlington" />
        <meta name="twitter:description" content="Visit our Vape Cave locations in Frisco and Arlington, TX. Premium vapes, Delta 8, THC-A, and more at our convenient DFW stores." />
        <meta name="twitter:image" content="https://vapecavetx.com/vapecave-logo.png" />
        
        {/* Keywords for both locations */}
        <meta name="keywords" content="vape shop frisco, vape shop arlington, vape cave frisco, vape cave arlington, delta 8 frisco, delta 8 arlington, thc-a frisco, thc-a arlington, premium vape shop dallas-fort worth, vape stores dfw" />
        
        {/* Dublin Core Metadata */}
        <meta name="DC.title" content="Vape Cave Store Locations | Premium Vape Shops in Dallas-Fort Worth" />
        <meta name="DC.description" content="Visit our premium vape shops in Frisco and Arlington. Both locations offer high-quality vape products, Delta 8, THC-A, and accessories." />
        <meta name="DC.subject" content="Vape Shop, Frisco, Arlington, Delta 8, THC-A, Disposable Vapes" />
        <meta name="DC.creator" content="Vape Cave" />
        <meta name="DC.type" content="LocalBusiness" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.language" content="en-US" />
        <meta name="DC.coverage" content="Dallas-Fort Worth, Texas, United States" />
        <meta name="DC.rights" content="Copyright Vape Cave 2023" />
        
        {/* Geo meta tags - Using central DFW coordinates */}
        <meta name="geo.region" content="US-TX" />
        <meta name="geo.placename" content="Dallas-Fort Worth" />
        <meta name="geo.position" content="32.7767;-96.7970" />
        <meta name="ICBM" content="32.7767, -96.7970" />
        
        {/* Alternative languages - helpful for international customers */}
        <link rel="alternate" href="https://vapecavetx.com/locations" hrefLang="en-us" />
        <link rel="alternate" href="https://vapecavetx.com/es/locations" hrefLang="es" />
        
        {/* Location schema data - enhanced and nested with OrganizationAndPlaces pattern */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://vapecavetx.com/#organization",
            "name": "Vape Cave",
            "url": "https://vapecavetx.com",
            "logo": "https://vapecavetx.com/logo.png",
            "description": "Vape Cave offers premium vaping products, e-liquids, and accessories at our convenient Frisco and Arlington, TX locations. We specialize in Disposable Vapes, Delta 8, THC-A, Delta 9, pre-rolls, flower, vape pens, and cartridges.",
            "keywords": "vape shop frisco, vape shop arlington, premium vape frisco, premium vape arlington, frisco vape shop, arlington vape shop, delta 8 frisco, delta 8 arlington, thc-a frisco, thc-a arlington, vape dallas fort worth, vape shop dfw",
            "sameAs": [
              "https://facebook.com/vapecavetx",
              "https://instagram.com/vapecavetx",
              "https://twitter.com/vapecavetx"
            ],
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+14692940061",
                "contactType": "customer service",
                "areaServed": ["Frisco", "Allen", "Plano", "McKinney", "Dallas", "North Texas"],
                "availableLanguage": "English"
              },
              {
                "@type": "ContactPoint",
                "telephone": "+16822700334",
                "contactType": "customer service",
                "areaServed": ["Arlington", "Fort Worth", "Grand Prairie", "Mansfield", "Dallas", "North Texas"],
                "availableLanguage": "English"
              }
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US",
              "addressRegion": "TX"
            },
            "subOrganization": [
              {
                "@type": "VapeShop", 
                "@id": "https://vapecavetx.com/locations/frisco/#shop",
                "name": "Vape Cave Frisco",
                "url": "https://vapecavetx.com/locations/frisco",
                "mainEntityOfPage": "https://vapecavetx.com/locations/frisco"
              },
              {
                "@type": "VapeShop", 
                "@id": "https://vapecavetx.com/locations/arlington/#shop",
                "name": "Vape Cave Arlington",
                "url": "https://vapecavetx.com/locations/arlington",
                "mainEntityOfPage": "https://vapecavetx.com/locations/arlington"
              }
            ],
            "location": formattedLocations.map(location => generateLocalBusinessSchema(location))
          })}
        </script>
        
        {/* BreadcrumbList schema for SEO */}
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
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Locations Header */}
      <section className="relative h-72 overflow-hidden bg-gray-900 py-16 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-900 mix-blend-multiply"></div>
          <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-4">Our Locations</h1>
            <div className="h-1 w-24 bg-orange-500 mx-auto rounded-full mb-6"></div>
            <p className="text-white/90 max-w-2xl mx-auto text-lg">
              Visit us at one of our convenient locations for personalized service and expert advice on our premium selection of vaping products, disposables, Delta 8, THC-A, and more.
            </p>
          </div>
        </div>
      </section>
      
      {/* Locations Grid */}
      <section className="py-12 bg-gradient-to-r from-black to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {formattedLocations.map((location) => (
              <div 
                key={location.id}
                className={`bg-gray-800 rounded-lg shadow-md overflow-hidden border ${
                  activeLocation === location.id ? 'border-orange-500' : 'border-gray-700'
                }`}
              >
                <div className="h-60 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>
                  <div className="absolute inset-0 bg-[url('/vapecave-logo.png')] bg-center bg-no-repeat bg-contain opacity-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6">
                      <h2 className="text-2xl text-white font-bold font-['Poppins'] mb-1">{location.name}</h2>
                      <p className="text-white/90 text-sm">{location.fullAddress}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Store Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold font-['Poppins'] text-white mb-4">Store Information</h3>
                    
                    <div className="space-y-3">
                      <div className="flex">
                        <div className="text-orange-500 mr-3">
                          <i className="fas fa-phone"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Phone</p>
                          <p className="font-medium text-gray-200">{location.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="text-orange-500 mr-3">
                          <i className="fas fa-clock"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Hours</p>
                          <p className="font-medium text-gray-200">{location.hours}</p>
                          {location.openingHours && (
                            <div className="text-sm mt-1 opacity-80">
                              {getOrderedOpeningHours(location.openingHours)
                                .slice(0, 3) // Show first 3 days only in compact view
                                .map(({day, hours}, index) => (
                                  <div key={day} className="flex justify-between">
                                    <span className="mr-2">{day.substring(0, 3)}</span>
                                    <span>{hours}</span>
                                  </div>
                              ))}
                              {Object.keys(location.openingHours).length > 3 && (
                                <button 
                                  onClick={() => setActiveLocation(location.id)}
                                  className="text-orange-500 text-xs mt-1 hover:underline"
                                >
                                  See all hours →
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="text-orange-500 mr-3">
                          <i className="fas fa-envelope"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="font-medium text-gray-200">{location.email}</p>
                        </div>
                      </div>
                      
                      {location.googlePlaceId && (
                        <div className="flex">
                          <div className="text-orange-500 mr-3">
                            <i className="fas fa-map-marker-alt"></i>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Google Place ID</p>
                            <p className="font-medium text-gray-200">{location.googlePlaceId}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Hours of Operation */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold font-['Poppins'] text-white mb-4" id="store-hours">Hours of Operation</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {getOrderedOpeningHours(location.openingHours).map(({day, hours}) => (
                        <div key={day} className="flex justify-between py-1 border-b border-gray-700">
                          <span className="font-medium text-gray-200">{day}</span>
                          <span className="text-gray-400">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Featured Products Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold font-['Poppins'] text-white mb-4">Featured Products</h3>
                    <div className="flex flex-wrap gap-2">
                      {location.services.slice(0, 6).map((service, index) => (
                        <span 
                          key={index} 
                          className="bg-orange-500/20 text-orange-500 text-xs font-medium py-1 px-3 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Map */}
                  <div className="mb-6 h-72 rounded-lg overflow-hidden relative">
                    {/* Both locations now use iframe for consistent reliability and dark theme */}
                    <iframe
                      src={location.mapEmbed}
                      width="100%"
                      height="100%"
                      title={`${location.name} Google Maps`}
                      className="absolute inset-0 border-0 dark-map-light"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <DirectionsButton
                      address={location.fullAddress}
                      lat={location.coordinates.lat}
                      lng={location.coordinates.lng}
                      className="flex-1"
                      buttonText="Get Directions"
                      variant="primary"
                      googlePlaceId={location.googlePlaceId}
                      appleMapsLink={location.appleMapsLink}
                    />
                    
                    {location.id === 1 && (
                      <Link href="/locations/frisco" className="flex-1 bg-primary text-black hover:bg-primary/80 font-medium py-2 px-4 rounded-md flex items-center justify-center">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        View Frisco Details
                      </Link>
                    )}
                    
                    {location.id === 2 && (
                      <Link href="/locations/arlington" className="flex-1 bg-primary text-black hover:bg-primary/80 font-medium py-2 px-4 rounded-md flex items-center justify-center">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        View Arlington Details
                      </Link>
                    )}
                    
                    <button 
                      onClick={() => setActiveLocation(activeLocation === location.id ? null : location.id)}
                      className="flex-1 border border-orange-500 text-orange-500 hover:bg-orange-500/10 font-medium py-2 px-4 rounded-md flex items-center justify-center"
                    >
                      <i className="fas fa-info-circle mr-2"></i>
                      {activeLocation === location.id ? 'Hide Details' : 'More Details'}
                    </button>
                  </div>
                </div>
                
                {/* Expanded Details (show when active) */}
                {activeLocation === location.id && (
                  <div className="p-6 pt-0">
                    <div className="h-px bg-gray-700 my-6"></div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold font-['Poppins'] text-white mb-3">Get In Touch</h3>
                        <p className="text-gray-400 mb-4">
                          Have questions about our products or services? Contact us directly at this location for personalized assistance.
                        </p>
                        <a 
                          href={`tel:${location.phone.replace(/[^0-9]/g, '')}`} 
                          className="text-orange-500 hover:underline font-medium flex items-center"
                        >
                          <i className="fas fa-phone-alt mr-2"></i>
                          Call Us Now
                        </a>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold font-['Poppins'] text-white mb-3">About This Location</h3>
                        <p className="text-gray-400">
                          {location.description}
                        </p>
                      </div>
                      
                      {location.neighborhoodInfo && (
                        <div>
                          <h3 className="text-lg font-semibold font-['Poppins'] text-white mb-3">Neighborhood Information</h3>
                          <p className="text-gray-400">
                            {location.neighborhoodInfo}
                          </p>
                        </div>
                      )}
                      
                      {location.parking && (
                        <div className="flex items-start">
                          <div className="bg-orange-500/20 p-2 rounded-full mr-3 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-white mb-1">Parking Available</h4>
                            <p className="text-gray-400">{location.parking}</p>
                          </div>
                        </div>
                      )}
                      
                      {location.publicTransit && (
                        <div className="flex items-start">
                          <div className="bg-orange-500/20 p-2 rounded-full mr-3 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-white mb-1">Public Transit</h4>
                            <p className="text-gray-400">{location.publicTransit}</p>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-lg font-semibold font-['Poppins'] text-white mb-3">Products We Offer</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {location.services.map((service, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-300">{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold font-['Poppins'] text-white mb-3">Payment Methods</h3>
                        <div className="flex flex-wrap gap-2">
                          {location.acceptedPayments.map((payment, index) => (
                            <span 
                              key={index} 
                              className="bg-gray-700 text-gray-300 text-xs font-medium py-1 px-3 rounded-full"
                            >
                              {payment}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Call-to-Action Button */}
                    <div className="mt-6">
                      <Link 
                        href={`/locations/${location.city.toLowerCase()}`} 
                        className="w-full bg-dark hover:bg-dark/90 text-white font-medium py-3 px-4 rounded-md flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        View Full Location Details
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Full Map Section - Interactive Map showing both locations */}
      <section className="py-12 bg-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-['Poppins'] text-white mb-2">Find Us on the Map</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Explore our locations across the Dallas-Fort Worth area. We're conveniently located to serve customers from Frisco, Arlington, and surrounding communities.
            </p>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-xl">
            {/* Interactive Google Maps component showing both locations */}
            <div className="h-[500px] relative" id="locations-map">
              <div className="absolute inset-0 dark-map-light">
                <GoogleMapsIntegration 
                  locations={formattedLocations || []}
                  height="100%"
                  width="100%"
                  zoom={9}
                  showDirectionsLink={true}
                  mapType="roadmap"
                />
              </div>
            </div>
            
            {/* Location Links Below Map */}
            <div className="bg-black p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-bold mb-2 text-white">Frisco Location</h3>
                <p className="text-gray-300 mb-4">6958 Main St #200, Frisco, TX 75033</p>
                <a 
                  href="/locations/frisco" 
                  className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-4 rounded-md"
                >
                  View Frisco Location
                </a>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-bold mb-2 text-white">Arlington Location</h3>
                <p className="text-gray-300 mb-4">4100 S Cooper St #4108, Arlington, TX 76015</p>
                <a 
                  href="/locations/arlington" 
                  className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-4 rounded-md"
                >
                  View Arlington Location
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Visit Us CTA */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-['Poppins'] text-white mb-4">Come Visit Us Today!</h2>
            <p className="text-gray-400 text-lg mb-8">
              Experience our friendly atmosphere, knowledgeable staff, and premium selection of vaping products, disposables, Delta 8, THC-A, Delta 9, and more at a location near you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#store-hours" 
                className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 px-8 rounded-md"
              >
                View Store Hours
              </a>
              <a 
                href="tel:4692940061" 
                className="bg-gray-800 hover:bg-gray-700 border border-orange-500 text-white font-bold py-3 px-8 rounded-md"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default LocationsPage;