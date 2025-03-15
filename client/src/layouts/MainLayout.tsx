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
    "alternateName": ["Vape Cave Frisco", "Vape Cave Smoke & Stuff", "Premium Vape Shop Frisco"],
    "url": "https://vapecavetx.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://vapecavetx.com/logo.png",
      "width": 180,
      "height": 60
    },
    "description": "Premium vaping products and accessories at Vape Cave Frisco. Visit our convenient locations in Frisco and Arlington, TX or shop online.",
    "slogan": "Your Premier Destination for Premium Vaping Products in Frisco, TX",
    "keywords": "vape shop frisco, premium vaping products frisco, frisco vape shop, delta 8 frisco, thc-a frisco, disposable vape frisco, vape products frisco tx, vape cave frisco",
    "founder": {
      "@type": "Person",
      "name": "Vape Cave Founder",
      "jobTitle": "CEO"
    },
    "foundingDate": "2019",
    "sameAs": [
      "https://facebook.com/vapecavetx",
      "https://instagram.com/vapecavetx",
      "https://twitter.com/vapecavetx",
      "https://yelp.com/biz/vape-cave-frisco"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+14692940061",
        "contactType": "customer service",
        "areaServed": ["Frisco", "Allen", "Plano", "McKinney", "Dallas", "North Texas"],
        "availableLanguage": "English",
        "contactOption": "TollFree",
        "hoursAvailable": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
            "opens": "10:00",
            "closes": "24:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Friday", "Saturday"],
            "opens": "10:00",
            "closes": "01:00"
          }
        ]
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
    "location": [
      {
        "@type": "VapeShop",
        "name": "Vape Cave Frisco",
        "url": "https://vapecavetx.com/locations/frisco",
        "image": "https://vapecavetx.com/storefront-frisco.jpg",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "6958 Main St #200",
          "addressLocality": "Frisco",
          "addressRegion": "TX",
          "postalCode": "75033",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 33.150730,
          "longitude": -96.822550
        },
        "telephone": "+14692940061",
        "email": "vapecavetex@gmail.com",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
            "opens": "10:00",
            "closes": "24:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Friday", "Saturday"],
            "opens": "10:00",
            "closes": "01:00"
          }
        ],
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "googlePlaceId",
            "value": "ChIJxXjrR3wVkFQRcKK89i-aFDw"
          },
          {
            "@type": "PropertyValue",
            "name": "yearEstablished",
            "value": "2019"
          }
        ],
        "hasMap": [
          {
            "@type": "Map",
            "url": "https://www.google.com/maps/place/?q=place_id:ChIJxXjrR3wVkFQRcKK89i-aFDw"
          },
          {
            "@type": "Map",
            "url": "https://www.google.com/maps/search/?api=1&query=Vape+Cave+Frisco+TX"
          }
        ],
        "areaServed": ["Frisco", "Allen", "Plano", "McKinney", "North Texas"],
        "amenityFeature": [
          {
            "@type": "LocationFeatureSpecification",
            "name": "Expert Staff",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Free Parking",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "ADA Accessible",
            "value": true
          }
        ],
        "specialOpeningHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "validFrom": "2023-12-24",
          "validThrough": "2023-12-24",
          "opens": "10:00",
          "closes": "18:00"
        }
      }
    ],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl,
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", "h2", ".speakable"]
      }
    },
    "potentialAction": [
      {
        "@type": "FindAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://vapecavetx.com/locations",
          "inLanguage": "en-US",
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/IOSPlatform",
            "http://schema.org/AndroidPlatform"
          ]
        },
        "query-input": "required name=search_term_string"
      },
      {
        "@type": "ViewAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://vapecavetx.com/locations/frisco"
        },
        "name": "View Frisco Store Details"
      },
      {
        "@type": "MapAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.google.com/maps/place/?q=place_id:ChIJxXjrR3wVkFQRcKK89i-aFDw"
        },
        "name": "Get Directions to Frisco Store"
      }
    ],
    "brand": {
      "@type": "Brand",
      "name": "Vape Cave",
      "logo": "https://vapecavetx.com/logo.png",
      "slogan": "Premium Vaping Products & Accessories"
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
        <meta name="geo.position" content="33.150730;-96.822550" />
        <meta name="geo.placename" content="Vape Cave Frisco" />
        <meta name="geo.region" content="US-TX" />
        <meta name="ICBM" content="33.150730, -96.822550" />
        
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
