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
import { useFeaturedProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Dedicated page for the Frisco location with enhanced SEO
 * This page focuses on the Frisco store specifically to improve local search visibility
 */
const FriscoLocationPage: React.FC = () => {
  const { data: locationData, isLoading: locationLoading } = useFriscoLocation();
  const { data: formattedLocations } = useFormattedLocationsForMap();
  const { data: featuredProducts, isLoading: productsLoading } = useFeaturedProducts(4); // Fetch 4 featured products
  
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
      }
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
      {/* Hero Section with Location-Specific Content */}
      <section className="py-20 bg-gradient-to-b from-dark to-darker text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h1 className="text-4xl lg:text-5xl font-bold font-['Poppins'] mb-4">Vape Cave Frisco</h1>
            <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
              Premium vaping products and accessories in Frisco, TX
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <a 
                href={`tel:${location.phone.replace(/[^0-9]/g, '')}`}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {location.phone}
              </a>
              <DirectionsButton 
                address={location.fullAddress}
                lat={location.coordinates.lat}
                lng={location.coordinates.lng}
                buttonText="Get Directions"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-3 px-8 rounded-lg"
                showIcon={true}
                googlePlaceId={location.googlePlaceId}
                appleMapsLink={location.appleMapsLink}
              />
            </div>
            
            <div className="flex items-center justify-center gap-2 text-primary bg-black/30 rounded-lg py-3 px-6 max-w-max mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">{location.hours}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Location Details */}
      <section className="py-14 bg-darker text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold font-['Poppins'] mb-6">About Our Frisco Location</h2>
              
              <div className="bg-medium rounded-xl overflow-hidden shadow-lg border border-gray-700 mb-8">
                <img 
                  src={location.image || "https://vapecavetx.com/storefront-frisco.jpg"} 
                  alt={`Vape Cave ${location.city} Store Front`} 
                  className="w-full h-[300px] object-cover"
                />
                
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-3">Store Information</h3>
                      <div className="space-y-2 text-gray-300">
                        <p><strong>Address:</strong> {location.address}</p>
                        <p><strong>Phone:</strong> {location.phone}</p>
                        <p><strong>Email:</strong> {location.email}</p>
                        <p><strong>Established:</strong> {location.yearEstablished}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-3">Hours of Operation</h3>
                      <div className="space-y-1 text-gray-300">
                        {getOrderedOpeningHours(location.openingHours).map(({ day, hours }) => (
                          <div key={day} className="flex justify-between">
                            <span className="font-medium">{day}</span>
                            <span>{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div 
                      className="flex items-center justify-between cursor-pointer bg-black/30 rounded-lg p-3"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      <h3 className="text-lg font-semibold text-white">Store Details</h3>
                      <button className="text-primary focus:outline-none transition-transform">
                        {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                    
                    {showDetails && (
                      <div className="mt-4 p-4 bg-black/20 rounded-lg border border-gray-800">
                        <p className="text-gray-300 mb-4">{location.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-primary mb-2">Services</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-300">
                              {location.services.map((service, index) => (
                                <li key={index}>{service}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-primary mb-2">Amenities</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-300">
                              {location.amenities.map((amenity, index) => (
                                <li key={index}>{amenity}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        {location.neighborhoodInfo && (
                          <div className="mb-4">
                            <h4 className="font-medium text-primary mb-2">Neighborhood</h4>
                            <p className="text-gray-300">{location.neighborhoodInfo}</p>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-medium text-primary mb-2">Areas Served</h4>
                          <div className="flex flex-wrap gap-2">
                            {location.areaServed.map((area, index) => (
                              <span 
                                key={index} 
                                className="bg-black/30 text-gray-300 text-sm py-1 px-3 rounded-full border border-gray-800"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <div 
                      className="flex items-center justify-between cursor-pointer bg-black/30 rounded-lg p-3"
                      onClick={() => setShowProducts(!showProducts)}
                    >
                      <h3 className="text-lg font-semibold text-white">Featured Products</h3>
                      <button className="text-primary focus:outline-none transition-transform">
                        {showProducts ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                    
                    {showProducts && (
                      <div className="mt-4">
                        {/* Featured Products at Frisco */}
                        <h3 className="text-xl font-semibold mb-4 text-white">Featured Products at Frisco</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                          {productsLoading ? (
                            // Skeleton loading state
                            Array(4).fill(0).map((_, index) => (
                              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
                                <Skeleton className="w-full h-56" />
                                <div className="p-5">
                                  <Skeleton className="h-6 w-1/3 mb-2" />
                                  <Skeleton className="h-4 w-full mb-2" />
                                  <Skeleton className="h-4 w-5/6 mb-4" />
                                  <div className="flex justify-between items-center">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-10 w-28" />
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : featuredProducts && featuredProducts.length > 0 ? (
                            featuredProducts.map((product) => (
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
                                    <span className="font-bold text-lg">${parseFloat(product.price).toFixed(2)}</span>
                                    <Link href="/products">
                                      <button className="bg-primary hover:bg-primary/90 text-black font-medium py-2 px-4 rounded-md transition-colors">
                                        Add to Cart
                                      </button>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full text-center py-6 bg-white/10 rounded-lg">
                              <p className="text-white/70">No featured products available</p>
                            </div>
                          )}
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
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default FriscoLocationPage;