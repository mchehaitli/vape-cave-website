import MainLayout from "@/layouts/MainLayout";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import GoogleMapsIntegration from "@/components/GoogleMapsIntegration";

// Define the structure for store locations with all needed information
interface StoreLocation {
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
  googlePlaceId?: string; // Optional Google Place ID for direct integration
  appleMapsLink?: string; // Optional direct Apple Maps link
  mapEmbed: string;
  email?: string;
  storeCode?: string;
  openingHours: {
    [key: string]: string;
  };
}

const LocationsPage = () => {
  // Store locations data - replace with your actual store information
  const locations: StoreLocation[] = [
    {
      id: 1,
      name: "Vape Cave Frisco",
      city: "Frisco",
      address: "6958 Main St",
      fullAddress: "6958 Main St, Frisco, TX 75033, United States",
      phone: "(469) 294-0061",
      hours: "10:00 AM - 12:00 AM / 1:00 AM (Extended hours on weekends)",
      closedDays: "",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      coordinates: {
        lat: 33.150730,
        lng: -96.822550
      },
      googlePlaceId: "ChIJxXjrR3wVkFQRcKK89i-aFDw", // This should be your actual Google Place ID
      appleMapsLink: "https://maps.apple.com/?address=6958%20Main%20St,%20Unit%20200,%20Frisco,%20TX%20%2075033,%20United%20States&auid=14231591118256703794&ll=33.150849,-96.824392&lsp=9902&q=Vape%20Cave%20Smoke%20%26%20Stuff&t=m",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3056.2408651289297!2d-96.8236!3d33.1562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a1983c178c5%3A0xf4f40d590e54a8b0!2s6958%20Main%20St%2C%20Frisco%2C%20TX%2075033!5e0!3m2!1sen!2sus!4v1693311756407!5m2!1sen!2sus",
      email: "vapecavetex@gmail.com",
      storeCode: "VC-FRISCO",
      openingHours: {
        "Monday": "10:00 AM - 12:00 AM",
        "Tuesday": "10:00 AM - 12:00 AM",
        "Wednesday": "10:00 AM - 12:00 AM",
        "Thursday": "10:00 AM - 12:00 AM",
        "Friday": "10:00 AM - 1:00 AM",
        "Saturday": "10:00 AM - 1:00 AM",
        "Sunday": "10:00 AM - 12:00 AM"
      }
    },
    {
      id: 2,
      name: "Vape Cave Arlington",
      city: "Arlington",
      address: "4100 S Cooper St, Unit 4108",
      fullAddress: "4100 S Cooper St, Unit 4108, Arlington, TX 76015, United States",
      phone: "(682) 270-0334",
      hours: "10:00 AM - 11:00 PM (7 days a week)",
      closedDays: "",
      image: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      coordinates: {
        lat: 32.683571,
        lng: -97.134650
      },
      googlePlaceId: "ChIJyersF8wXkFQRVQw-oKzhjYI", // This should be your actual Google Place ID
      appleMapsLink: "https://maps.app.goo.gl/7RRoEeD3uzANmdhZA",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.246781652386!2d-97.1365!3d32.6870!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25cc32c6ee0c9%3A0x618d992cf4076d55!2s4100%20S%20Cooper%20St,%20Unit%204108,%20Arlington,%20TX%2076015!5e0!3m2!1sen!2sus!4v1693311805030!5m2!1sen!2sus",
      email: "vapecavetx@gmail.com",
      storeCode: "VC-ARLINGTON",
      openingHours: {
        "Monday": "10:00 AM - 11:00 PM",
        "Tuesday": "10:00 AM - 11:00 PM",
        "Wednesday": "10:00 AM - 11:00 PM",
        "Thursday": "10:00 AM - 11:00 PM",
        "Friday": "10:00 AM - 11:00 PM",
        "Saturday": "10:00 AM - 11:00 PM",
        "Sunday": "10:00 AM - 11:00 PM"
      }
    }
  ];

  // Create structured data for SEO
  const generateLocalBusinessSchema = (location: StoreLocation) => {
    return {
      "@context": "https://schema.org",
      "@type": "VapeShop",
      "@id": `https://vapecave.com/locations/${location.id}`,
      "name": location.name,
      "url": `https://vapecave.com/locations/${location.id}`,
      "logo": "https://vapecave.com/logo.png",
      "image": location.image,
      "telephone": location.phone,
      "email": location.email,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": location.address,
        "addressLocality": location.city,
        "addressRegion": "State", // Replace with actual state
        "postalCode": "12345", // Replace with actual postal code
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": location.coordinates.lat,
        "longitude": location.coordinates.lng
      },
      "openingHoursSpecification": Object.entries(location.openingHours).map(([day, hours]) => {
        const parts = hours.split(' - ');
        return {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": day,
          "opens": parts[0],
          "closes": parts[1] === "Closed" ? "00:00" : parts[1]
        };
      }),
      "priceRange": "$$"
    };
  };

  const [activeLocation, setActiveLocation] = useState<number | null>(null);

  return (
    <MainLayout
      title="Store Locations - Vape Cave"
      description="Visit our convenient Vape Cave locations in Frisco and Arlington, TX. Find store hours, contact information, and directions."
    >
      {/* SEO Schema.org structured data */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Vape Cave",
            "url": "https://vapecave.com",
            "logo": "https://vapecave.com/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-555-123-4567",
              "contactType": "customer service"
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US"
            },
            "department": locations.map(location => generateLocalBusinessSchema(location))
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
              Visit us at one of our convenient locations for personalized service and expert advice from our knowledgeable staff.
            </p>
          </div>
        </div>
      </section>
      
      {/* Locations Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {locations.map((location) => (
              <div key={location.id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="h-72 overflow-hidden relative">
                  <img 
                    src={location.image} 
                    alt={`${location.name} - Vape Cave Location`} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h2 className="text-2xl font-bold mb-1">{location.name}</h2>
                    <p className="text-white/90">{location.fullAddress}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-['Poppins'] font-semibold text-lg mb-3 text-gray-800">Contact Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-700">{location.fullAddress}</span>
                        </div>
                        <div className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-700">{location.phone}</span>
                        </div>
                        {location.email && (
                          <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-700">{location.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-['Poppins'] font-semibold text-lg mb-3 text-gray-800">Business Hours</h3>
                      <div className="space-y-2">
                        {Object.entries(location.openingHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span className="font-medium">{day}</span>
                            <span className={hours === "Closed" ? "text-red-500" : "text-gray-700"}>
                              {hours}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Google Maps Integration */}
                  <div 
                    className="h-64 rounded-lg mb-6 overflow-hidden cursor-pointer"
                    onClick={() => setActiveLocation(activeLocation === location.id ? null : location.id)}
                  >
                    <GoogleMapsIntegration
                      locations={[{
                        id: location.id,
                        name: location.name,
                        address: location.fullAddress,
                        position: location.coordinates
                      }]}
                      apiKey="AIzaSyAmuEPaYfG1ketf_ZzVnpcjfSe1qdMa3t0"
                      height="100%"
                      width="100%"
                      zoom={15}
                      activeLocationId={location.id}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a 
                      href={`tel:${location.phone.replace(/[^0-9]/g, '')}`} 
                      className="inline-flex items-center bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow hover:shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Store
                    </a>
                    
                    {/* Google Maps Direction Link - Using geo URI format */}
                    <a 
                      href={location.id === 1 
                        ? "geo:33.150849,-96.824392?q=Vape+Cave+Smoke+%26+Stuff" 
                        : "geo:32.680717,-97.135062?q=Vape+Cave+Smoke+%26+Stuff"} 
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="inline-flex items-center bg-[#4285F4] hover:bg-[#4285F4]/90 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow hover:shadow-lg"
                    >
                      <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      Google Maps
                    </a>
                    
                    {/* Apple Maps Link */}
                    {location.appleMapsLink && (
                      <a 
                        href={location.appleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="inline-flex items-center bg-black hover:bg-black/90 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow hover:shadow-lg"
                        onClick={(e) => {
                          // Let the default href handle the navigation - this should work on most modern phones
                          // We won't try to be clever with URI schemes since they can be unreliable
                        }}
                      >
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                          <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                        </svg>
                        Apple Maps
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Store Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-['Poppins'] mb-3">Why Visit Our Stores?</h2>
            <p className="text-dark/70 max-w-2xl mx-auto">We offer personalized service and a unique shopping experience at all of our locations.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <i className="fas fa-user-friends text-2xl text-primary"></i>
              </div>
              <h3 className="font-['Poppins'] font-semibold text-xl mb-2">Expert Staff</h3>
              <p className="text-dark/70">Our knowledgeable team can help you find the perfect products for your needs and answer any questions.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <i className="fas fa-box-open text-2xl text-primary"></i>
              </div>
              <h3 className="font-['Poppins'] font-semibold text-xl mb-2">Product Testing</h3>
              <p className="text-dark/70">Try before you buy with our in-store product testing stations for e-liquids and devices.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <i className="fas fa-tags text-2xl text-primary"></i>
              </div>
              <h3 className="font-['Poppins'] font-semibold text-xl mb-2">Exclusive Offers</h3>
              <p className="text-dark/70">Visit our stores for special in-store promotions, loyalty rewards, and product bundles.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Poppins'] mb-3">Frequently Asked Questions</h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">Find answers to common questions about our store locations and services.</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Do I need to be 21+ to enter your stores?</h3>
                <p className="text-gray-700">Yes, all customers must be at least 21 years of age to enter our stores and purchase products. Valid ID is required.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Do your stores offer product testing?</h3>
                <p className="text-gray-700">Yes, we have designated testing stations for e-liquids and devices at all of our locations. Our staff can guide you through the testing process.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Is there parking available at your locations?</h3>
                <p className="text-gray-700">Yes, all of our stores have convenient parking options nearby. Our Frisco location has a dedicated parking lot, while our Arlington location offers street parking and is near a public parking garage.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Do you offer repairs or maintenance services for vaping devices?</h3>
                <p className="text-gray-700">Yes, our knowledgeable staff can assist with basic troubleshooting and maintenance. For more complex repairs, we offer a service program with quick turnaround times.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Are your stores wheelchair accessible?</h3>
                <p className="text-gray-700">Yes, all of our locations are wheelchair accessible with ramp entrances and spacious aisles to ensure all customers can shop comfortably.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Store Locator Map */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Poppins'] mb-3">Find Your Nearest Store</h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">Use the interactive map below to find the Vape Cave location nearest to you.</p>
          </div>
          
          <div className="relative rounded-xl overflow-hidden shadow-lg h-[500px] mb-8">
            <GoogleMapsIntegration
              locations={locations.map(location => ({
                id: location.id,
                name: location.name,
                address: location.fullAddress,
                position: location.coordinates
              }))}
              apiKey="AIzaSyAmuEPaYfG1ketf_ZzVnpcjfSe1qdMa3t0"
              height="100%"
              width="100%"
              zoom={11}
              activeLocationId={activeLocation}
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow z-10">
              <h3 className="font-semibold text-lg mb-2">All Vape Cave Locations</h3>
              <ul className="space-y-2">
                {locations.map(location => (
                  <li 
                    key={location.id} 
                    className="flex items-center cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setActiveLocation(activeLocation === location.id ? null : location.id)}
                  >
                    <div className={`h-3 w-3 rounded-full mr-3 ${activeLocation === location.id ? 'bg-blue-500' : 'bg-primary'}`}></div>
                    <span className={activeLocation === location.id ? 'font-medium' : ''}>{location.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-6">Need help finding us? Contact us directly for directions!</p>
            <Link href="/contact">
              <button className="inline-flex items-center bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary/80 to-primary/20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold font-['Poppins'] mb-4">Ready to Visit Us?</h2>
          <p className="mb-8 max-w-2xl mx-auto text-lg">Come experience our premium selection of vaping products and receive expert advice from our friendly staff.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="#top" 
              className="inline-flex items-center bg-white hover:bg-white/90 text-primary font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Find a Location
            </a>
            <Link href="/products">
              <button className="inline-flex items-center bg-black hover:bg-black/90 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Shop Products
              </button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default LocationsPage;
