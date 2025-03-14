import React from 'react';

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
  plusCode
}) => {
  // Detect if the user is on a mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // Detect iOS devices to use Apple Maps
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  // Create URL for different platforms
  const getDirectionsUrl = () => {
    // Get encoded versions of address and plus code
    const encodedAddress = encodeURIComponent(address);
    const encodedPlusCode = plusCode ? encodeURIComponent(plusCode) : null;
    
    // Extract city from address for better SEO context
    // Assume city is typically between a comma and the state abbreviation
    const cityMatch = address.match(/,\s*([^,]+),\s*[A-Z]{2}/);
    const city = cityMatch ? cityMatch[1].trim() : "Frisco"; // Default to Frisco for SEO focus
    
    // Create a more precise query with the location name appended for SEO
    // Include "vape shop" keywords for better local SEO
    const enhancedQuery = plusCode 
      ? `${plusCode} Vape Cave ${city}, Texas` 
      : `Vape Cave ${address}`;
    const encodedEnhancedQuery = encodeURIComponent(enhancedQuery);
    
    if (isIOS && isMobile) {
      // Enhanced URL scheme for Apple Maps on iOS devices
      // Using specific format for better Plus Code support on iOS 16+
      
      if (encodedPlusCode) {
        // For Plus Code locations, use a format that promotes the Plus Code
        // This URL includes both the Plus Code in the query and coordinates for precision
        return `https://maps.apple.com/?q=${encodedPlusCode} ${city}&ll=${lat},${lng}&address=${encodedAddress}`;
      } else {
        // Fall back to standard coordinates
        return `https://maps.apple.com/?address=${encodedAddress}&ll=${lat},${lng}`;
      }
    } else if (isMobile) {
      // Enhanced URL scheme for Google Maps app on Android
      if (encodedPlusCode) {
        // Use Plus Code as the primary search query for better precision
        // Google Maps on Android has excellent Plus Code support
        return `https://www.google.com/maps/search/?api=1&query=${encodedEnhancedQuery}`;
      } else {
        // Include both destination and query parameters for better results
        return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&query=${encodedAddress}&travelmode=driving`;
      }
    } else {
      // Enhanced URL scheme for Google Maps web on desktop
      if (encodedPlusCode) {
        // Use Plus Code with enhanced SEO query for more accurate location on desktop
        // This format is more search-friendly and preserves the Plus Code precision
        return `https://www.google.com/maps/search/?api=1&query=${encodedEnhancedQuery}`;
      } else {
        // Include both destination and query parameters for better desktop results
        return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&travelmode=driving`;
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
  
  return (
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
  );
};

export default DirectionsButton;