import React from 'react';

interface Location {
  id: number;
  name: string;
  address: string;
  position: {
    lat: number;
    lng: number;
  };
}

interface GoogleMapsIntegrationProps {
  locations: Location[];
  apiKey: string;
  height?: string;
  width?: string;
  zoom?: number;
  activeLocationId?: number | null;
}

// Simplified GoogleMapsIntegration that just uses iframe embeds
// which are more reliable in a sandboxed environment
const GoogleMapsIntegration: React.FC<GoogleMapsIntegrationProps> = ({
  locations,
  apiKey,
  height = '500px',
  width = '100%',
  zoom = 12,
  activeLocationId = null
}) => {
  // Get the currently active location or the first one
  const activeLocation = locations.find(loc => loc.id === activeLocationId) || locations[0];
  
  // Generate the Google Maps embed URL
  const generateMapUrl = (): string => {
    // Base URL for Google Maps embed
    let url = `https://www.google.com/maps/embed/v1/place?key=${apiKey}`;
    
    // Add location
    if (activeLocation) {
      url += `&q=${activeLocation.position.lat},${activeLocation.position.lng}`;
      url += `&center=${activeLocation.position.lat},${activeLocation.position.lng}`;
    } else if (locations.length > 0) {
      url += `&q=${locations[0].position.lat},${locations[0].position.lng}`;
      url += `&center=${locations[0].position.lat},${locations[0].position.lng}`;
    } else {
      // Default fallback (should never happen)
      url += `&q=United+States`;
    }
    
    // Add zoom level
    url += `&zoom=${zoom}`;
    
    return url;
  };
  
  return (
    <div style={{ height, width }} className="rounded-lg overflow-hidden shadow-lg">
      <iframe
        title="Google Maps"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={generateMapUrl()}
      ></iframe>
    </div>
  );
};

export default GoogleMapsIntegration;