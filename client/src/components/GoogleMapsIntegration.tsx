import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';

interface Location {
  id: number;
  name: string;
  address: string;
  position: {
    lat: number;
    lng: number;
  };
  googlePlaceId?: string; // Google Place ID for direct linking
  appleMapsLink?: string; // Direct Apple Maps link
  city?: string; // Add optional city for better location context
}

// Define MapTypeId enum since we can't access google.maps before it's loaded
enum MapTypeId {
  ROADMAP = 'roadmap',
  SATELLITE = 'satellite',
  HYBRID = 'hybrid',
  TERRAIN = 'terrain'
}

interface GoogleMapsIntegrationProps {
  locations: Location[];
  height?: string;
  width?: string;
  zoom?: number;
  activeLocationId?: number | null;
  showDirectionsLink?: boolean;
  mapType?: string; // Changed to string type to avoid direct dependency on google.maps
  apiKey?: string; // Allow direct passing of API key
}

// Using Google Maps API for enhanced maps functionality
const GoogleMapsIntegration: React.FC<GoogleMapsIntegrationProps> = ({
  locations,
  height = '500px',
  width = '100%',
  zoom = 14,
  activeLocationId = null,
  showDirectionsLink = true,
  mapType = MapTypeId.ROADMAP,
  apiKey: propApiKey // Get API key from props
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  
  // Use API key from props if provided, otherwise from environment variables
  // Using import.meta.env for client-side environment variables in Vite
  const apiKey = propApiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  // Add structured data for maps integration using react-helmet
  useEffect(() => {
    // Create structured data focusing on the Frisco location if it exists
    const friscoLocation = locations.find(loc => loc.id === 1) || locations[0];
    
    // Extract city name from address (assuming format like "address, City, State ZIP")
    const cityMatch = friscoLocation.address.match(/,\s*([^,]+),\s*[A-Z]{2}/);
    const locationCity = friscoLocation.city || (cityMatch ? cityMatch[1].trim() : "Frisco");
    
    // Create a more precise hasMap URL with Google Place ID or Address for better discoverability
    const hasMapUrl = friscoLocation.googlePlaceId 
      ? `https://www.google.com/maps/place/?q=place_id:${friscoLocation.googlePlaceId}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(friscoLocation.address)}`;
      
    // Split address into components for more structured markup
    const addressParts = friscoLocation.address.split(',').map(part => part.trim());
    const streetAddress = addressParts[0];
    
    // Create more comprehensive structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "VapeShop",
      "name": "Vape Cave Frisco",
      "description": "Premium vape shop in Frisco, TX offering a wide selection of vapes, e-liquids, THC-A, Delta 8, and smoking accessories.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": streetAddress,
        "addressLocality": "Frisco",
        "addressRegion": "TX",
        "postalCode": "75033",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": friscoLocation.position.lat,
        "longitude": friscoLocation.position.lng
      },
      "telephone": "(469) 294-0061",
      "hasMap": hasMapUrl,
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
      "url": "https://vapecavetx.com/locations/frisco",
      "sameAs": [
        "https://www.facebook.com/vapecavetx",
        "https://www.instagram.com/vapecavetx/"
      ],
      "areaServed": ["Frisco", "Allen", "Plano", "McKinney", "North Texas"],
      "priceRange": "$$",
      "paymentAccepted": "Cash, Credit Card",
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Google Place ID",
          "value": friscoLocation.googlePlaceId || "ChIJxXjrR3wVkFQRcKK89i-aFDw"
        },
        {
          "@type": "PropertyValue",
          "name": "Year Established",
          "value": "2019"
        }
      ],
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "Free Parking",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Wheelchair Accessible",
          "value": true
        }
      ],
      "publicAccess": true,
      "smokingAllowed": false,
      "isAccessibleForFree": true,
      "maximumAttendeeCapacity": 25,
      "specialOpeningHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "validFrom": "2025-01-01",
        "validThrough": "2025-12-31",
        "dayOfWeek": "http://schema.org/PublicHolidays",
        "opens": "10:00",
        "closes": "20:00"
      }
    };
    
    // Using Helmet for structured data instead of direct DOM manipulation
    // This is better for React and avoids potential memory leaks
    document.querySelectorAll('script[type="application/ld+json"]').forEach(el => {
      if (el.textContent?.includes('"@type":"VapeShop"')) {
        document.head.removeChild(el);
      }
    });
  }, [locations]);
  
  // Log the URL for debugging domain restriction issues
  useEffect(() => {
    console.log("Current page URL:", window.location.href);
    console.log("Current hostname:", window.location.hostname);
  }, []);
  
  // Get the currently active location or the first one
  const activeLocation = locations.find(loc => loc.id === activeLocationId) || locations[0];
  
  // Initialize Google Maps when the component mounts
  useEffect(() => {
    // Check if the Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }
    
    // Check if the script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      // If script is already loading, we just need to wait for it
      window.initGoogleMaps = () => {
        setMapLoaded(true);
      };
      return;
    }
    
    // Load the Google Maps API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    
    // Define the callback function to initialize the map
    window.initGoogleMaps = () => {
      console.log("Google Maps API loaded successfully");
      setMapLoaded(true);
    };
    
    // Add error handling
    script.onerror = (error) => {
      console.error("Error loading Google Maps API:", error);
      console.log("Attempted to load with URL:", script.src);
      console.log("API key provided:", apiKey ? "Yes (length: " + apiKey.length + ")" : "No");
    };
    
    document.head.appendChild(script);
    
    // Cleanup function to remove the script
    return () => {
      // Only remove the script and callback if this component added it
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      // TypeScript-friendly way to remove an optional property
      if ('initGoogleMaps' in window) {
        delete (window as any).initGoogleMaps;
      }
    };
  }, [apiKey]);
  
  // Initialize the map when the API is loaded
  useEffect(() => {
    if (mapLoaded && window.google && window.google.maps) {
      initializeMap();
    }
  }, [mapLoaded]);
  
  // Update the map when the active location changes
  useEffect(() => {
    if (map && activeLocation && window.google && window.google.maps) {
      map.setCenter(activeLocation.position);
      
      // Highlight the active marker
      markers.forEach(marker => {
        const locationId = Number(marker.get('locationId'));
        if (locationId === activeLocation.id) {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(() => {
            marker.setAnimation(null);
          }, 1500);
        }
      });
    }
  }, [activeLocation, map, markers]);
  
  // Initialize the map
  const initializeMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) return;
    
    const google = window.google;
    
    // Create the map
    const newMap = new google.maps.Map(mapRef.current, {
      center: activeLocation ? activeLocation.position : { lat: 39.8, lng: -98.5 },
      zoom,
      mapTypeId: mapType,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ]
    });
    
    setMap(newMap);
    
    // Add markers for each location
    const newMarkers = locations.map(location => {
      // Create a custom marker icon with Vape Cave branding
      const marker = new google.maps.Marker({
        position: location.position,
        map: newMap,
        title: location.name,
        animation: google.maps.Animation.DROP,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png', // Use orange for branding
          scaledSize: new google.maps.Size(36, 36)
        }
      });
      
      // Store the location ID with the marker
      marker.set('locationId', location.id);
      
      // Create an info window for the marker
      // Generate directions URL using Google Place ID if available for better geocoding accuracy
      const getDirectionsUrl = () => {
        if (location.googlePlaceId) {
          // Use Google Place ID for more precise location - better for SEO and user experience
          return `https://www.google.com/maps/place/?q=place_id:${location.googlePlaceId}`;
        }
        // Fallback to standard coordinates
        return `https://www.google.com/maps/dir/?api=1&destination=${location.position.lat},${location.position.lng}`;
      };
      
      // Generate additional maps URLs based on device/platform
      const getAppleMapsUrl = () => {
        // Use pre-configured Apple Maps link if available
        if (location.appleMapsLink) {
          return location.appleMapsLink;
        }
        // Otherwise build from components
        return `https://maps.apple.com/?address=${encodeURIComponent(location.address)}&ll=${location.position.lat},${location.position.lng}&q=${encodeURIComponent(location.name)}`;
      };
      
      // Create an enhanced info window with Google Maps and Apple Maps integration
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="max-width: 200px; font-family: Arial, sans-serif;">
            <h3 style="margin: 8px 0; color: #f97316; font-weight: bold;">${location.name}</h3>
            <p style="margin: 6px 0; font-size: 0.9em;">${location.address}</p>
            ${showDirectionsLink ? `
              <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 4px;">
                <a href="${getDirectionsUrl()}" 
                   target="_blank" style="color: #f97316; text-decoration: none; font-weight: bold; display: flex; align-items: center;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                    <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4"></path>
                  </svg>
                  Google Maps
                </a>
                <a href="${getAppleMapsUrl()}" 
                   target="_blank" style="color: #4b5563; text-decoration: none; font-size: 0.85em; display: flex; align-items: center;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  Apple Maps
                </a>
              </div>
            ` : ''}
          </div>
        `
      });
      // Add a click listener to open the info window
      marker.addListener('click', () => {
        infoWindow.open(newMap, marker);
      });
      
      return marker;
    });
    
    setMarkers(newMarkers);
    
    // Fit the map to show all markers if there are multiple locations
    if (locations.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach(location => {
        bounds.extend(location.position);
      });
      newMap.fitBounds(bounds);
      
      // Adjust zoom if it's too zoomed in (for locations that are very close)
      google.maps.event.addListenerOnce(newMap, 'idle', () => {
        if (newMap.getZoom() && newMap.getZoom() > 16) {
          newMap.setZoom(16);
        }
      });
    }
  };
  
  // Fallback to iframe embed if Google Maps API isn't available
  const renderFallbackMap = () => {
    const embedUrl = activeLocation?.position 
      ? `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3056.2408651289297!2d${activeLocation.position.lng}!3d${activeLocation.position.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDA5JzAyLjYiTiA5NsKwNDknMjYuMiJX!5e0!3m2!1sen!2sus!4v1693311756407!5m2!1sen!2sus`
      : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3056.2408651289297!2d-96.8236!3d33.1562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a1983c178c5%3A0xf4f40d590e54a8b0!2s6958%20Main%20St%2C%20Frisco%2C%20TX%2075033!5e0!3m2!1sen!2sus!4v1693311756407!5m2!1sen!2sus';
    
    return (
      <div className="relative">
        <iframe
          title="Location Map"
          width="100%"
          height="100%"
          style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
          loading="lazy"
          allowFullScreen
          src={embedUrl}
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    );
  };
  
  // Create structured data focusing on the Frisco location if it exists
  const friscoLocation = locations.find(loc => loc.id === 1) || locations[0];
  
  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "VapeShop",
              "@id": "https://vapecavetx.com/locations/frisco/#vapeshop",
              "name": "Vape Cave Frisco",
              "alternateName": ["Vape Cave Smoke & Stuff", "Vape Shop Frisco", "Frisco Vape Store"],
              "description": "Premium vape shop in Frisco, TX offering a wide selection of vapes, e-liquids, THC-A, Delta 8, disposables, and smoking accessories. Located on Main Street with convenient parking.",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://vapecavetx.com/locations/frisco/"
              },
              "url": "https://vapecavetx.com/locations/frisco",
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
                "latitude": ${friscoLocation.position.lat},
                "longitude": ${friscoLocation.position.lng},
                "name": "Vape Cave Frisco Coordinates"
              },
              "telephone": "+14692940061",
              "email": "info@vapecavetx.com",
              "image": "https://vapecavetx.com/images/vape-cave-frisco-storefront.jpg",
              "logo": "https://vapecavetx.com/logo.png",
              "photo": {
                "@type": "ImageObject",
                "contentUrl": "https://vapecavetx.com/images/vape-cave-frisco-interior.jpg",
                "description": "Interior of Vape Cave Frisco store"
              },
              "currenciesAccepted": "USD",
              "paymentAccepted": "Cash, Credit Card, Debit Card, Apple Pay, Google Pay",
              "isAccessibleForFree": true,
              "hasMap": [
                {
                  "@type": "Map",
                  "name": "Google Maps Navigation",
                  "url": "https://www.google.com/maps/place/?q=place_id:${friscoLocation.googlePlaceId || "ChIJxXjrR3wVkFQRcKK89i-aFDw"}",
                  "description": "Find our Frisco vape shop using Google Maps"
                },
                {
                  "@type": "Map",
                  "name": "Apple Maps Navigation",
                  "url": "https://maps.apple.com/?address=${encodeURIComponent("6958 Main St #200, Frisco, TX 75033")}&ll=${friscoLocation.position.lat},${friscoLocation.position.lng}",
                  "description": "Navigate to Vape Cave Frisco using Apple Maps"
                }
              ],
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
              "sameAs": [
                "https://www.facebook.com/vapecavetx",
                "https://www.instagram.com/vapecavetx/"
              ],
              "areaServed": ["Frisco", "Allen", "Plano", "McKinney", "North Texas"],
              "priceRange": "$$",
              "additionalProperty": [
                {
                  "@type": "PropertyValue",
                  "name": "Google Place ID",
                  "value": "ChIJxXjrR3wVkFQRcKK89i-aFDw"
                },
                {
                  "@type": "PropertyValue",
                  "name": "Year Established",
                  "value": "2019"
                }
              ],
              "specialOpeningHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "validFrom": "2025-01-01",
                "validThrough": "2025-12-31",
                "dayOfWeek": "http://schema.org/PublicHolidays",
                "opens": "10:00",
                "closes": "20:00"
              },
              "publicAccess": true,
              "smokingAllowed": false,
              "amenityFeature": [
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Free Parking",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification", 
                  "name": "Wheelchair Accessible",
                  "value": true
                }
              ]
            }
          `}
        </script>
        {/* Standard geo meta tags */}
        <meta name="geo.position" content={`${friscoLocation.position.lat};${friscoLocation.position.lng}`} />
        <meta name="geo.placename" content="Vape Cave Frisco" />
        <meta name="geo.region" content="US-TX" />
        <meta name="ICBM" content={`${friscoLocation.position.lat}, ${friscoLocation.position.lng}`} />
        
        {/* Location-specific metadata */}
        <meta name="location-city" content="Frisco" />
        <meta name="location-state" content="Texas" />
        <meta name="location-zipcode" content="75033" />
        <meta name="google-place-id" content={friscoLocation.googlePlaceId || "ChIJxXjrR3wVkFQRcKK89i-aFDw"} />
        
        {/* Store information */}
        <meta name="business-name" content="Vape Cave Frisco" />
        <meta name="business-type" content="Vape Shop" />
        <meta name="business-phone" content="+14692940061" />
        <meta name="business-email" content="info@vapecavetx.com" />
        
        {/* Product categories */}
        <meta name="product-category" content="Vapes, E-Liquids, Disposables, Delta 8, THC-A, Smoking Accessories" />
        
        {/* Local business schema support */}
        <meta name="DC.title" content="Vape Cave Frisco - Premium Vape Shop" />
        <meta name="DC.description" content="Visit Vape Cave in Frisco, TX for premium vaping products, disposables, Delta 8, THC-A and smoking accessories." />
        <meta name="DC.publisher" content="Vape Cave" />
        <meta name="DC.contributor" content="Frisco Chamber of Commerce" />
        <meta name="DC.coverage" content="Frisco, Plano, Allen, McKinney, North Texas" />
      </Helmet>
      
      <div style={{ height, width }} className="rounded-lg overflow-hidden shadow-lg relative">
        {apiKey ? (
          <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
        ) : (
          renderFallbackMap()
        )}
        
        {showDirectionsLink && activeLocation && (
          <div className="bg-white/80 text-xs p-2 absolute bottom-0 right-0 rounded-tl-lg shadow-md z-10">
            <a 
              href={activeLocation.googlePlaceId 
                ? `https://www.google.com/maps/place/?q=place_id:${activeLocation.googlePlaceId}`
                : `https://www.google.com/maps/dir/?api=1&destination=${activeLocation.position.lat},${activeLocation.position.lng}`
              }
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary font-semibold hover:underline"
              title="Get directions to this location"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
              </svg>
              Get Directions
            </a>
          </div>
        )}
      </div>
    </>
  );
};

// Add typings to the global window object
declare global {
  interface Window {
    initGoogleMaps?: () => void;
    google?: any;
  }
}

export default GoogleMapsIntegration;