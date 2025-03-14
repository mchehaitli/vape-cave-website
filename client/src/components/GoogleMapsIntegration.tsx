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
  apiKey?: string; // Made optional since we're not using it for the direct embedding
  height?: string;
  width?: string;
  zoom?: number;
  activeLocationId?: number | null;
}

// Using a simpler approach with direct Google Maps URL embedding
// which doesn't require API key authorization for iframe embedding
const GoogleMapsIntegration: React.FC<GoogleMapsIntegrationProps> = ({
  locations,
  height = '500px',
  width = '100%',
  zoom = 14,
  activeLocationId = null
}) => {
  // Get the currently active location or the first one
  const activeLocation = locations.find(loc => loc.id === activeLocationId) || locations[0];
  
  // Generate the Google Maps URL for public embedding without using API key
  const generateMapUrl = (): string => {
    if (activeLocation) {
      // Use a place-based embedding which provides better zoom control
      const query = encodeURIComponent(activeLocation.name + ' ' + activeLocation.address);
      // Use the simplest and most stable Maps embed format with an appropriate zoom level
      return `https://www.google.com/maps/embed/v1/place?q=${query}&zoom=15`;
    } else if (locations.length > 0) {
      // If no active location, use the first one
      const query = encodeURIComponent(locations[0].name + ' ' + locations[0].address);
      return `https://www.google.com/maps/embed/v1/place?q=${query}&zoom=15`;
    } else {
      // Fallback to a general map of the US (should never happen)
      return `https://www.google.com/maps/embed/v1/place?q=United+States&zoom=4`;
    }
  };
  
  // Alternative: Use OpenStreetMap as a fallback option if Google Maps continues to have issues
  const generateOpenStreetMapUrl = (): string => {
    if (activeLocation) {
      // Using a better zoom level (adjust the bounding box size for better visibility)
      // A smaller difference (e.g., ±0.005) gives a more zoomed-in view
      return `https://www.openstreetmap.org/export/embed.html?bbox=${activeLocation.position.lng-0.005}%2C${activeLocation.position.lat-0.005}%2C${activeLocation.position.lng+0.005}%2C${activeLocation.position.lat+0.005}&layer=mapnik&marker=${activeLocation.position.lat}%2C${activeLocation.position.lng}`;
    } else if (locations.length > 0) {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${locations[0].position.lng-0.005}%2C${locations[0].position.lat-0.005}%2C${locations[0].position.lng+0.005}%2C${locations[0].position.lat+0.005}&layer=mapnik&marker=${locations[0].position.lat}%2C${locations[0].position.lng}`;
    } else {
      // Use a more reasonable default zoom for the US
      return 'https://www.openstreetmap.org/export/embed.html?bbox=-130.78125%2C21.616579336740603%2C-62.75390625%2C50.90303283111257&layer=mapnik';
    }
  };
  
  return (
    <div style={{ height, width }} className="rounded-lg overflow-hidden shadow-lg">
      {/* Try Google Maps iframe first */}
      <iframe
        title="Location Map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={generateMapUrl()}
        onError={(e) => {
          // If Google Maps fails, fallback to OpenStreetMap
          (e.target as HTMLIFrameElement).src = generateOpenStreetMapUrl();
        }}
      ></iframe>
    </div>
  );
};

export default GoogleMapsIntegration;