import React, { useEffect, useRef, useState } from 'react';

interface Location {
  id: number;
  name: string;
  address: string;
  position: {
    lat: number;
    lng: number;
  };
  plusCode?: string; // Add optional Plus Code field
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
  const apiKey = propApiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  console.log("API Key available:", !!apiKey);
  
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
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="max-width: 200px; font-family: Arial, sans-serif;">
            <h3 style="margin: 8px 0; color: #f97316; font-weight: bold;">${location.name}</h3>
            <p style="margin: 6px 0; font-size: 0.9em;">${location.address}</p>
            ${showDirectionsLink ? `
              <div style="margin-top: 8px;">
                <a href="https://www.google.com/maps/dir/?api=1&destination=${location.position.lat},${location.position.lng}" 
                   target="_blank" style="color: #f97316; text-decoration: none; font-weight: bold;">
                  Get Directions
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
  
  return (
    <div style={{ height, width }} className="rounded-lg overflow-hidden shadow-lg relative">
      {apiKey ? (
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      ) : (
        renderFallbackMap()
      )}
      
      {showDirectionsLink && activeLocation && (
        <div className="bg-white/80 text-xs p-2 absolute bottom-0 right-0 rounded-tl-lg shadow-md z-10">
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${activeLocation.position.lat},${activeLocation.position.lng}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-primary font-semibold hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
            </svg>
            Get Directions
          </a>
        </div>
      )}
    </div>
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