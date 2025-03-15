/**
 * Dedicated page for the Arlington location with enhanced SEO
 * This page focuses on the Arlington store specifically to improve local search visibility
 */
import React, { useState } from 'react';
import { Link } from 'wouter';
import { Helmet } from "react-helmet";
import MainLayout from '@/layouts/MainLayout';
import { 
  getArlingtonLocation, 
  generateStructuredDataForLocation 
} from '@/data/storeInfo';
import { products } from '@/data/products';
import GoogleMapsIntegration from '@/components/GoogleMapsIntegration';
import DirectionsButton from '@/components/DirectionsButton';

const ArlingtonLocationPage: React.FC = () => {
  const location = getArlingtonLocation();
  const structuredData = generateStructuredDataForLocation(location);
  
  // Toggle states for accordion-like sections
  const [showDetails, setShowDetails] = useState(true);
  const [showProducts, setShowProducts] = useState(true);
  
  // Filter products for Arlington location (example of location-specific products)
  const arlingtonProducts = products.filter(product => 
    product.featured || product.category === "Popular"
  ).slice(0, 6);
  
  // Additional SEO tags for Arlington location
  const canonicalUrl = "https://vapecave.com/locations/arlington";
  
  return (
    <MainLayout
      title={`Vape Cave Arlington, TX - Premium Vape Shop in ${location.city}`}
      description={`Visit Vape Cave in Arlington, TX for premium vaping products, accessories, and expert advice. Located at ${location.address}, we offer the best selection in ${location.city}.`}
      canonical={canonicalUrl}
      ogImage="/vapecave-logo.png"
      structuredData={structuredData}
    >
      <Helmet>
        {/* Additional meta tags specific to Arlington location */}
        <meta name="geo.position" content={`${location.coordinates.lat};${location.coordinates.lng}`} />
        <meta name="geo.placename" content={`Vape Cave ${location.city}`} />
        <meta name="geo.region" content="US-TX" />
        <meta name="ICBM" content={`${location.coordinates.lat}, ${location.coordinates.lng}`} />
        
        {/* Open Graph tags */}
        <meta property="og:type" content="business.business" />
        <meta property="og:title" content={`Vape Cave Arlington - Premium Vape Shop in ${location.city}, TX`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="/vapecave-logo.png" />
        <meta property="og:description" content={`Visit our Arlington vape shop for premium products and expert advice. Located at ${location.address}.`} />
        <meta property="og:site_name" content="Vape Cave" />
        <meta property="business:contact_data:street_address" content={location.address} />
        <meta property="business:contact_data:locality" content={location.city} />
        <meta property="business:contact_data:region" content="TX" />
        <meta property="business:contact_data:postal_code" content="76013" />
        <meta property="business:contact_data:country_name" content="USA" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Vape Cave Arlington - Premium Vape Shop in ${location.city}`} />
        <meta name="twitter:description" content={`Visit our Arlington vape shop for premium products and expert advice. Located at ${location.address}.`} />
        <meta name="twitter:image" content="/vapecave-logo.png" />
      </Helmet>
      
      {/* Hero Section with Specific Arlington Information */}
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
                                className="bg-primary/10 text-white text-sm py-1 px-3 rounded-full border border-gray-700"
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
                      className="bg-primary/20 text-gray-700 text-sm py-1 px-3 rounded-full border border-gray-300"
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
                          <div className="bg-primary/20 text-gray-700 rounded-full p-3 mr-4 border border-gray-300">
                            <i className="fas fa-check"></i>
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