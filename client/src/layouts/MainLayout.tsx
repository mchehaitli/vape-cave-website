import React from "react";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = "Vape Cave - Premium Vaping Products & Accessories",
  description = "Premium vaping products and accessories at Vape Cave. Visit our two convenient locations in Frisco and Arlington, TX or shop online.",
  canonical = "",
  ogImage = "/images/vape-cave-share-image.jpg",
  structuredData
}) => {
  // Determine canonical URL
  const baseUrl = "https://vapecavetx.com";
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : baseUrl;
  
  // Enhanced structured data with emphasis on Frisco location
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://vapecavetx.com/#organization",
    "name": "Vape Cave",
    "url": "https://vapecavetx.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://vapecavetx.com/logo.png",
      "width": 180,
      "height": 60
    },
    "description": "Premium vaping products and accessories at Vape Cave Frisco (Plus Code: 552G+86). Visit our convenient locations in Frisco and Arlington, TX or shop online.",
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
        "availableLanguage": "English",
        "contactOption": "TollFree"
      }
    ],
    "address": [
      {
        "@type": "PostalAddress",
        "streetAddress": "6958 Main St #200",
        "addressLocality": "Frisco",
        "addressRegion": "TX",
        "postalCode": "75033",
        "addressCountry": "US"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "4100 S Cooper St #4108",
        "addressLocality": "Arlington",
        "addressRegion": "TX",
        "postalCode": "76015",
        "addressCountry": "US"
      }
    ],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  const schemaData = structuredData || defaultStructuredData;

  return (
    <div className="flex flex-col min-h-screen font-['Open_Sans'] text-dark bg-light">
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="vape shop frisco, 552G+86 frisco, frisco vape shop, delta 8 frisco, thc-a frisco, disposable vape frisco, vape products frisco tx, vaping frisco, frisco vaporizer shop, vape cave frisco" />
        <meta name="author" content="Vape Cave" />
        <meta name="robots" content="index, follow" />
        
        {/* Canonical Tag */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${baseUrl}${ogImage}`} />
        <meta property="og:site_name" content="Vape Cave" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Helmet>
      
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
