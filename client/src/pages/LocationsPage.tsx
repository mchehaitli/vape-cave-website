import MainLayout from "@/layouts/MainLayout";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import GoogleMapsIntegration from "@/components/GoogleMapsIntegration";
import DirectionsButton from "@/components/DirectionsButton";
import { storeLocations, getFormattedLocationsForMap } from "@/data/storeInfo";

const LocationsPage = () => {
  // Create enhanced structured data for SEO - more detailed for better search visibility
  const generateLocalBusinessSchema = (location: typeof storeLocations[0]) => {
    // Parse postal code from address (ZIP code is the last 5 digits in US addresses)
    const zipCodeMatch = location.fullAddress.match(/\d{5}(?![\d-])/);
    const postalCode = zipCodeMatch ? zipCodeMatch[0] : "";
    
    // Format phone for structured data (remove non-digits and add country code)
    const formattedPhone = "+1" + location.phone.replace(/[^0-9]/g, '');
    
    return {
      "@context": "https://schema.org",
      "@type": "Store",
      "@id": `https://vapecavetx.com/locations/${location.id}`,
      "name": location.name,
      "url": `https://vapecavetx.com/locations/${location.id}`,
      "logo": "https://vapecavetx.com/logo.png",
      "image": location.image,
      "telephone": formattedPhone,
      "email": location.email,
      "description": location.description,
      "areaServed": location.areaServed,
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
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "plusCode",
          "value": location.plusCode || ""
        },
        {
          "@type": "PropertyValue",
          "name": "yearEstablished",
          "value": location.yearEstablished
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
      "hasMap": location.mapEmbed,
      "publicAccess": true,
      "isAccessibleForFree": true,
      "smokingAllowed": true,
      "keywords": "vape shop, e-cigarettes, e-liquids, vaping accessories, " + 
        location.services.join(", ").toLowerCase(),
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
            "urlTemplate": `https://vapecavetx.com/locations/${location.id}`
          }
        },
        {
          "@type": "MapAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": location.plusCode 
              ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.plusCode)}`
              : `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`
          }
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

  // Set Frisco location (ID 1) as active by default for better SEO and user experience
  const [activeLocation, setActiveLocation] = useState<number | null>(1);
  
  // Get properly formatted locations for Google Maps
  const mapLocations = getFormattedLocationsForMap();

  return (
    <MainLayout
      title="Vape Cave Frisco Location | Vape Shop in Frisco, TX | Store Hours & Directions"
      description="Visit our Vape Cave Frisco location (Plus Code: 552G+86) at 6958 Main St #200, Frisco, TX 75033. Open daily 10AM-12AM with premium vaping products, Delta 8, THC-A, disposables, glass, and accessories."
    >
      {/* SEO Schema.org structured data */}
      <Helmet>
        <title>Vape Cave Frisco Location | Vape Shop in Frisco, TX | Store Hours & Directions</title>
        <meta name="description" content="Visit our Vape Cave Frisco location (Plus Code: 552G+86) at 6958 Main St #200, Frisco, TX 75033. Open daily 10AM-12AM with premium vaping products, Delta 8, THC-A, disposables, glass, and accessories." />
        <link rel="canonical" href="https://vapecavetx.com/locations" />
        <meta name="keywords" content="vape store frisco, vape shop frisco tx, vape cave frisco, 552G+86 frisco, frisco vape shop, delta 8 frisco, thc-a frisco, disposable vape frisco, e-liquid frisco, vape products frisco tx" />
        
        {/* Location schema data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Vape Cave",
            "url": "https://vapecavetx.com",
            "logo": "https://vapecavetx.com/logo.png",
            "description": "Vape Cave offers premium vaping products, e-liquids, and accessories at our convenient Frisco and Arlington, TX locations. We specialize in Disposable Vapes, Delta 8, THC-A, Delta 9, pre-rolls, flower, vape pens, and cartridges.",
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
                "areaServed": "US",
                "availableLanguage": "English"
              }
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US",
              "addressRegion": "TX"
            },
            "location": storeLocations.map(location => generateLocalBusinessSchema(location))
          })}
        </script>
      </Helmet>

      {/* Locations Header */}
      <section className="bg-gradient-to-r from-primary/80 to-primary/20 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-4">Our Locations</h1>
            <div className="h-1 w-24 bg-white mx-auto rounded-full mb-6"></div>
            <p className="text-white/90 max-w-2xl mx-auto text-lg">
              Visit us at one of our convenient locations for personalized service and expert advice on our premium selection of vaping products, disposables, Delta 8, THC-A, and more.
            </p>
          </div>
        </div>
      </section>
      
      {/* Locations Grid */}
      <section className="py-12 bg-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {storeLocations.map((location) => (
              <div 
                key={location.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden border ${
                  activeLocation === location.id ? 'border-primary' : 'border-gray-200'
                }`}
              >
                <div className="h-60 overflow-hidden relative">
                  <img 
                    src={location.image} 
                    alt={location.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
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
                    <h3 className="text-lg font-semibold font-['Poppins'] text-gray-800 mb-4">Store Information</h3>
                    
                    <div className="space-y-3">
                      <div className="flex">
                        <div className="text-primary mr-3">
                          <i className="fas fa-phone"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium text-gray-800">{location.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="text-primary mr-3">
                          <i className="fas fa-clock"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hours</p>
                          <p className="font-medium text-gray-800">{location.hours}</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="text-primary mr-3">
                          <i className="fas fa-envelope"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-800">{location.email}</p>
                        </div>
                      </div>
                      
                      {location.plusCode && (
                        <div className="flex">
                          <div className="text-primary mr-3">
                            <i className="fas fa-map-marker-alt"></i>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Plus Code</p>
                            <p className="font-medium text-gray-800">{location.plusCode}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Hours of Operation */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold font-['Poppins'] text-gray-800 mb-4" id="store-hours">Hours of Operation</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(location.openingHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between py-1 border-b border-gray-100">
                          <span className="font-medium text-gray-800">{day}</span>
                          <span className="text-gray-600">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Featured Products Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold font-['Poppins'] text-gray-800 mb-4">Featured Products</h3>
                    <div className="flex flex-wrap gap-2">
                      {location.services.slice(0, 6).map((service, index) => (
                        <span 
                          key={index} 
                          className="bg-primary/10 text-primary text-xs font-medium py-1 px-3 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Map */}
                  <div className="mb-6 h-72 rounded-lg overflow-hidden">
                    <GoogleMapsIntegration 
                      locations={[
                        {
                          id: location.id,
                          name: location.name,
                          address: location.fullAddress,
                          position: location.coordinates,
                          plusCode: location.plusCode
                        }
                      ]}
                      height="100%"
                      width="100%"
                    />
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
                      plusCode={location.plusCode}
                    />
                    
                    <button 
                      onClick={() => setActiveLocation(activeLocation === location.id ? null : location.id)}
                      className="flex-1 border border-primary text-primary hover:bg-primary/10 font-medium py-2 px-4 rounded-md flex items-center justify-center"
                    >
                      <i className="fas fa-info-circle mr-2"></i>
                      {activeLocation === location.id ? 'Hide Details' : 'More Details'}
                    </button>
                  </div>
                </div>
                
                {/* Expanded Details (show when active) */}
                {activeLocation === location.id && (
                  <div className="p-6 pt-0">
                    <div className="h-px bg-gray-200 my-6"></div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold font-['Poppins'] text-gray-800 mb-3">Get In Touch</h3>
                        <p className="text-gray-600 mb-4">
                          Have questions about our products or services? Contact us directly at this location for personalized assistance.
                        </p>
                        <a 
                          href={`tel:${location.phone.replace(/[^0-9]/g, '')}`} 
                          className="text-primary hover:underline font-medium flex items-center"
                        >
                          <i className="fas fa-phone-alt mr-2"></i>
                          Call Us Now
                        </a>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold font-['Poppins'] text-gray-800 mb-3">About This Location</h3>
                        <p className="text-gray-600">
                          {location.description}
                        </p>
                      </div>
                      
                      {location.neighborhoodInfo && (
                        <div>
                          <h3 className="text-lg font-semibold font-['Poppins'] text-gray-800 mb-3">Neighborhood Information</h3>
                          <p className="text-gray-600">
                            {location.neighborhoodInfo}
                          </p>
                        </div>
                      )}
                      
                      {location.parking && (
                        <div className="flex items-start">
                          <div className="bg-primary/20 p-2 rounded-full mr-3 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">Parking Available</h4>
                            <p className="text-gray-600">{location.parking}</p>
                          </div>
                        </div>
                      )}
                      
                      {location.publicTransit && (
                        <div className="flex items-start">
                          <div className="bg-primary/20 p-2 rounded-full mr-3 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">Public Transit</h4>
                            <p className="text-gray-600">{location.publicTransit}</p>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-lg font-semibold font-['Poppins'] text-gray-800 mb-3">Products We Offer</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {location.services.map((service, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-700">{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold font-['Poppins'] text-gray-800 mb-3">Payment Methods</h3>
                        <div className="flex flex-wrap gap-2">
                          {location.acceptedPayments.map((payment, index) => (
                            <span 
                              key={index} 
                              className="bg-gray-100 text-gray-700 text-xs font-medium py-1 px-3 rounded-full"
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
                        to={`/locations/${location.id}`} 
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
      
      {/* Full Map Section */}
      <section className="py-12 bg-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-['Poppins'] text-white mb-2">Find Us on the Map</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Explore our locations across the Dallas-Fort Worth area. We're conveniently located to serve customers from Frisco, Arlington, and surrounding communities.
            </p>
          </div>
          
          <div className="h-[600px] rounded-lg overflow-hidden shadow-xl">
            <GoogleMapsIntegration 
              locations={mapLocations}
              height="100%"
              width="100%"
              zoom={10}
            />
          </div>
        </div>
      </section>
      
      {/* Visit Us CTA */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-['Poppins'] text-gray-800 mb-4">Come Visit Us Today!</h2>
            <p className="text-gray-600 text-lg mb-8">
              Experience our friendly atmosphere, knowledgeable staff, and premium selection of vaping products, disposables, Delta 8, THC-A, Delta 9, and more at a location near you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#store-hours" 
                className="bg-primary hover:bg-primary/90 text-black font-bold py-3 px-8 rounded-md"
              >
                View Store Hours
              </a>
              <a 
                href="tel:4692940061" 
                className="bg-dark hover:bg-dark/90 text-white font-bold py-3 px-8 rounded-md"
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