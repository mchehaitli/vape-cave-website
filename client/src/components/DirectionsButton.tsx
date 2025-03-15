import React from 'react';
import { Helmet } from 'react-helmet';

interface DirectionsButtonProps {
  address: string;
  lat: number;
  lng: number;
  buttonText?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  fullWidth?: boolean;
  plusCode?: string;
  googlePlaceId?: string; // Add Google Place ID as an optional prop
}

/**
 * A button component that provides directions to a location
 * Intelligently handles different device types and platforms
 */
const DirectionsButton: React.FC<DirectionsButtonProps> = ({
  address,
  lat,
  lng,
  buttonText = 'Get Directions',
  className = '',
  variant = 'primary',
  size = 'md',
  showIcon = true,
  fullWidth = false,
  plusCode,
  googlePlaceId
}) => {
  // Detect if the user is on a mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // Detect iOS devices to use Apple Maps
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  // Create URL for different platforms with enhanced SEO and Plus Code integration
  const getDirectionsUrl = () => {
    // Get encoded versions of address and plus code
    const encodedAddress = encodeURIComponent(address);
    const encodedPlusCode = plusCode ? encodeURIComponent(plusCode) : null;
    
    // Extract city from address for better SEO context
    // Assume city is typically between a comma and the state abbreviation
    const cityMatch = address.match(/,\s*([^,]+),\s*[A-Z]{2}/);
    const city = cityMatch ? cityMatch[1].trim() : "Frisco"; // Default to Frisco for SEO focus
    
    // Create a more precise query with the location name appended for SEO
    // Include "vape shop" keywords and Plus Code for better local SEO
    const enhancedQuery = plusCode 
      ? `${plusCode} Vape Cave ${city}, Texas - Premium Vape Shop` 
      : `Vape Cave ${address} - Premium Vape Shop in ${city}`;
    const encodedEnhancedQuery = encodeURIComponent(enhancedQuery);
    
    // Use provided Google Place ID or default for Frisco location
    const defaultFriscoPlaceId = "ChIJxXjrR3wVkFQRcKK89i-aFDw";
    const isFriscoLocation = city === "Frisco" || address.includes("Frisco") || address.includes("75033");
    const placeId = googlePlaceId || (isFriscoLocation ? defaultFriscoPlaceId : undefined);
    const placeIdParam = placeId ? `&place_id=${placeId}` : "";
    
    // New approach with enhanced URL parameters for better search indexing
    if (isIOS && isMobile) {
      // Enhanced URL scheme for Apple Maps on iOS devices
      // Using specific format with multiple location identifiers for better iOS 16+ support
      
      if (encodedPlusCode) {
        // For Plus Code locations, combine multiple location identifiers
        // This creates a more robust Apple Maps link with redundant location data
        return `https://maps.apple.com/?q=${encodedPlusCode} ${city}&ll=${lat},${lng}&address=${encodedAddress}&t=m&sll=${lat},${lng}`;
      } else {
        // Use address + coordinates for maximum compatibility
        return `https://maps.apple.com/?address=${encodedAddress}&ll=${lat},${lng}&t=m`;
      }
    } else if (isMobile) {
      // Enhanced URL scheme for Google Maps app on Android with SEO fields
      if (encodedPlusCode) {
        // Use Plus Code as the primary identifier with enhanced query parameters
        // Add semantic markup in the query for better search visibility
        return `https://www.google.com/maps/search/?api=1&query=${encodedEnhancedQuery}${placeIdParam}`;
      } else {
        // Include both destination and query parameters with travelmode
        return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&query=${encodedEnhancedQuery}&travelmode=driving${placeIdParam}`;
      }
    } else {
      // Enhanced URL scheme for desktop browsers with maximum indexable parameters
      if (encodedPlusCode) {
        // Create a search URL with Plus Code that's optimized for maximum search visibility
        // This format is highly indexable and includes all necessary location identifiers
        const enhancedUrl = `https://www.google.com/maps/search/?api=1&query=${encodedEnhancedQuery}${placeIdParam}`;
        
        // For desktop users, log the Plus Code usage for analytics
        console.log(`Plus Code directions requested: ${plusCode} for ${city} location`);
        
        return enhancedUrl;
      } else {
        // Create a directions URL with enhanced metadata
        return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&destination_place_id=${placeId || ""}&travelmode=driving`;
      }
    }
  };
  
  // Determine button variant styles
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-white hover:bg-primary/90';
      case 'secondary':
        return 'bg-secondary text-white hover:bg-secondary/90';
      case 'outline':
        return 'bg-transparent border border-primary text-primary hover:bg-primary/10';
      case 'text':
        return 'bg-transparent text-primary hover:underline';
      default:
        return 'bg-primary text-white hover:bg-primary/90';
    }
  };
  
  // Determine button size styles
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs py-1 px-3';
      case 'md':
        return 'text-sm py-2 px-4';
      case 'lg':
        return 'text-base py-3 px-6';
      default:
        return 'text-sm py-2 px-4';
    }
  };
  
  // Extract city from address for structured data 
  const cityMatch = address.match(/,\s*([^,]+),\s*[A-Z]{2}/);
  const locationCity = cityMatch ? cityMatch[1].trim() : "Frisco"; // Default to Frisco for SEO focus
  
  const isFrisco = locationCity === "Frisco" || address.includes("Frisco") || address.includes("75033");
  
  return (
    <>
      {isFrisco && plusCode && (
        <Helmet>
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "VapeShop",
                "name": "Vape Cave Frisco",
                "alternateName": ["Vape Cave Smoke & Stuff", "Vape Shop Frisco 552G+86"],
                "description": "Premium vape shop in Frisco, TX offering a wide selection of vapes, e-liquids, THC-A, Delta 8, and smoking accessories. Located at Plus Code: ${plusCode}.",
                "url": "https://vapecavetx.com/locations/frisco",
                "telephone": "+14692940061",
                "email": "info@vapecavetx.com",
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
                "priceRange": "$$",
                "paymentAccepted": "Cash, Credit Card, Debit Card",
                "areaServed": ["Frisco", "Allen", "Plano", "McKinney", "North Texas"],
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "${address.split(',')[0]}",
                  "addressLocality": "Frisco",
                  "addressRegion": "TX",
                  "postalCode": "75033",
                  "addressCountry": "US"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": ${lat},
                  "longitude": ${lng}
                },
                "hasMap": [
                  {
                    "@type": "Map",
                    "name": "Google Maps with Plus Code",
                    "url": "https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plusCode)}",
                    "description": "Find our Frisco vape shop using Google Maps with Plus Code ${plusCode}"
                  },
                  {
                    "@type": "Map",
                    "name": "Plus Codes Direct",
                    "url": "https://plus.codes/${plusCode.replace(/\\s+/g, '')}",
                    "description": "Direct link to our location using Plus Code navigation"
                  }
                ],
                "identifier": [
                  {
                    "@type": "PropertyValue",
                    "name": "Plus Code",
                    "value": "${plusCode}"
                  },
                  {
                    "@type": "PropertyValue",
                    "name": "Google Place ID",
                    "value": "ChIJxXjrR3wVkFQRcKK89i-aFDw"
                  }
                ]
              }
            `}
          </script>
        </Helmet>
      )}
      
      <a
        href={getDirectionsUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          ${getVariantClasses()}
          ${getSizeClasses()}
          ${fullWidth ? 'w-full' : ''}
          inline-flex items-center justify-center rounded-md font-medium transition-colors
          focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2
          ${className}
        `}
        aria-label={`Get directions to ${address}${plusCode ? ` (Plus Code: ${plusCode})` : ''}`}
        data-location={locationCity}
        data-plus-code={plusCode || ""}
        data-google-place-id={googlePlaceId || "ChIJxXjrR3wVkFQRcKK89i-aFDw"}
        itemScope
        itemType="https://schema.org/VapeShop"
        itemProp="hasMap"
      >
        {showIcon && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} mr-2`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        )}
        {buttonText}
      </a>
    </>
  );
};

export default DirectionsButton;