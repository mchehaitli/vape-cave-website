import MainLayout from "@/layouts/MainLayout";

const LocationsPage = () => {
  const locations = [
    {
      id: 1,
      city: "City A",
      address: "123 Main Street, City A",
      phone: "555-123-4567",
      hours: "10 AM - 8 PM (Monday - Saturday)",
      closed: "Sunday",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2408651289297!2d-74.00543852373156!3d40.7127779748643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a1983c178c5%3A0xf4f40d590e54a8b0!2sCity%20Hall%20Park!5e0!3m2!1sen!2sus!4v1693311756407!5m2!1sen!2sus"
    },
    {
      id: 2,
      city: "City B",
      address: "456 Oak Avenue, City B",
      phone: "555-987-6543",
      hours: "11 AM - 9 PM (Monday - Saturday)",
      closed: "Sunday",
      image: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.246781652386!2d-74.07673562373365!3d40.72932187145809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25cc32c6ee0c9%3A0x618d992cf4076d55!2sNewport%20Centre%20Mall!5e0!3m2!1sen!2sus!4v1693311805030!5m2!1sen!2sus"
    }
  ];

  return (
    <MainLayout
      title="Store Locations - Vape Cave"
      description="Visit our convenient Vape Cave locations in City A and City B. Find store hours, contact information, and directions."
    >
      {/* Locations Header */}
      <section className="bg-secondary py-10 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold font-['Poppins'] mb-2">Our Locations</h1>
          <p className="text-white/80 max-w-2xl">
            Visit us at one of our convenient locations for personalized service and expert advice from our knowledgeable staff.
          </p>
        </div>
      </section>
      
      {/* Locations Grid */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {locations.map((location) => (
              <div key={location.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={location.image} 
                    alt={`Vape Cave ${location.city} Location`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-['Poppins'] font-semibold text-xl mb-3">{location.city} Location</h3>
                  <div className="space-y-2 mb-5">
                    <div className="flex items-start">
                      <i className="fas fa-map-marker-alt text-primary mt-1 mr-3"></i>
                      <span>{location.address}</span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-phone-alt text-primary mt-1 mr-3"></i>
                      <span>{location.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-clock text-primary mt-1 mr-3"></i>
                      <span>{location.hours}</span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-ban text-primary mt-1 mr-3"></i>
                      <span>Closed: {location.closed}</span>
                    </div>
                  </div>
                  
                  {/* Google Maps Embed */}
                  <div className="h-64 bg-light rounded mb-5 overflow-hidden">
                    <iframe 
                      src={location.mapEmbed} 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map to ${location.city} Location`}
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  
                  <a 
                    href={`tel:${location.phone.replace(/[^0-9]/g, '')}`} 
                    className="inline-block bg-primary hover:bg-primary/90 text-black font-bold py-2 px-6 rounded-md transition-colors mr-3"
                  >
                    Call Now
                  </a>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="inline-block bg-secondary hover:bg-secondary/90 text-white font-bold py-2 px-6 rounded-md transition-colors"
                  >
                    Get Directions
                  </a>
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
      
      {/* Call to Action */}
      <section className="py-12 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-['Poppins'] mb-4">Ready to Visit Us?</h2>
          <p className="mb-8 max-w-2xl mx-auto">Come experience our premium selection of vaping products and receive expert advice from our friendly staff.</p>
          <a 
            href="#top" 
            className="inline-block bg-primary hover:bg-primary/90 text-black font-bold py-3 px-8 rounded-md transition-colors"
          >
            Find a Location Near You
          </a>
        </div>
      </section>
    </MainLayout>
  );
};

export default LocationsPage;
