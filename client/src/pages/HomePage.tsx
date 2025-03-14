import { Link } from "wouter";
import { Helmet } from "react-helmet";
import MainLayout from "@/layouts/MainLayout";

const HomePage = () => {
  // Home page structured data
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vape Cave",
    "url": "https://vapecave.com",
    "logo": "https://vapecave.com/logo.png",
    "description": "Vape Cave offers premium vaping products, e-liquids, and accessories at our convenient Frisco and Arlington, TX locations. We provide expert advice and a wide selection for all your vaping needs.",
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
    "address": [
      {
        "@type": "PostalAddress",
        "streetAddress": "6958 Main St",
        "addressLocality": "Frisco",
        "addressRegion": "TX",
        "postalCode": "75033",
        "addressCountry": "US"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "4100 S Cooper St, Unit 4108",
        "addressLocality": "Arlington",
        "addressRegion": "TX",
        "postalCode": "76015",
        "addressCountry": "US"
      }
    ]
  };

  return (
    <MainLayout
      title="Vape Cave | Premium Vaping Products & Accessories | Frisco & Arlington TX"
      description="Welcome to Vape Cave - your one-stop shop for premium vaping products, e-liquids, and accessories. Visit our conveniently located stores in Frisco and Arlington, TX."
      canonical="/"
    >
      <Helmet>
        <meta name="keywords" content="vape shop, vaping products, e-liquids, vape accessories, frisco vape shop, arlington vape store, premium vapes" />
        <script type="application/ld+json">
          {JSON.stringify(homePageSchema)}
        </script>
      </Helmet>
      {/* Hero Section */}
      <section id="home" className="bg-gray-900 py-20 md:py-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-5xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-['Poppins'] mb-4 leading-tight">
                Vape into the <span className="text-primary">Future</span>
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl mb-8 text-white/90 font-medium max-w-[1100px] mx-auto leading-relaxed">
                Your One Stop Vape Shop for <span className="text-primary font-semibold">Disposables</span> | <span className="text-primary font-semibold">E-Liquids</span> | <span className="text-primary font-semibold">Salts</span> | <span className="text-primary font-semibold">Delta</span> | <span className="text-primary font-semibold">THC - A</span> | <span className="text-primary font-semibold">Glass</span> | <span className="text-primary font-semibold">Tobacco</span> | <span className="text-primary font-semibold">Hookah / Shisha</span> | <span className="text-primary font-semibold">Vaporizers</span> | <span className="text-primary font-semibold">Mods</span> | and much more
              </h2>
              <p className="text-base md:text-lg mb-10 text-white/80 max-w-2xl mx-auto">
                We are a locally owned business specializing in Vaporizers, E-Liquid, Salt Nic, and many different types of disposable devices. We also carry a wide range of glass pipes and accessories as well as Novelties and Hookahs/Shisha. Basically we carry all your smoking needs!
              </p>
              <div className="flex flex-wrap justify-center gap-5 mt-8">
                <Link href="/products">
                  <div className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1">
                    Shop Now
                  </div>
                </Link>
                <Link href="/locations">
                  <div className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 cursor-pointer backdrop-blur-sm hover:shadow-lg hover:-translate-y-1">
                    Find Our Stores
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Preview Section */}
      <section className="py-20 bg-dark text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Poppins'] mb-3">Our Locations</h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">Visit us at one of our convenient locations for personalized service and expert advice.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Location 1 */}
            <div className="bg-medium rounded-xl overflow-hidden shadow-lg border border-gray-700">
              <div className="p-6">
                <h3 className="font-['Poppins'] font-semibold text-2xl mb-4 text-white">Frisco Location</h3>
                <div className="space-y-3 mb-5">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-300">6958 Main St, Frisco, TX 75033</span>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-300">(469) 294-0061</span>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300">10:00 AM - 12:00 AM (Open 7 days)</span>
                  </div>
                </div>
                
                <Link href="/locations">
                  <div className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md cursor-pointer">
                    View Details
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Location 2 */}
            <div className="bg-medium rounded-xl overflow-hidden shadow-lg border border-gray-700">
              <div className="p-6">
                <h3 className="font-['Poppins'] font-semibold text-2xl mb-4 text-white">Arlington Location</h3>
                <div className="space-y-3 mb-5">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-300">4100 S Cooper St, Unit 4108, Arlington, TX 76015</span>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-300">(682) 270-0334</span>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300">10:00 AM - 11:00 PM (Open 7 days)</span>
                  </div>
                </div>
                
                <Link href="/locations">
                  <div className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md cursor-pointer">
                    View Details
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Age Verification Notice */}
      <section className="py-14 bg-darker">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto bg-black p-8 rounded-xl shadow-lg border border-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold font-['Poppins'] mb-3 text-white">Age Verification Required</h2>
            <p className="text-gray-300 mb-4">Our products are intended for adult smokers aged 21 and over. Proof of age will be required upon purchase both online and in our physical stores.</p>
            <p className="text-gray-400 text-sm">We strictly adhere to all local, state, and federal regulations regarding the sale of vaping products.</p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
