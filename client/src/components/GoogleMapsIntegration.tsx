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

interface MapIntegrationProps {
  locations: Location[];
  apiKey?: string; // Keeping this for backward compatibility, not used
  height?: string;
  width?: string;
  zoom?: number;
  activeLocationId?: number | null;
}

// Renamed to MapIntegration since we're now using OpenStreetMap exclusively
const GoogleMapsIntegration: React.FC<MapIntegrationProps> = ({
  locations,
  height = '500px',
  width = '100%',
  zoom = 14,
  activeLocationId = null
}) => {
  // Get the currently active location or the first one
  const activeLocation = locations.find(loc => loc.id === activeLocationId) || locations[0];
  
  // Generate the OpenStreetMap URL with appropriate zoom level
  const generateMapUrl = (): string => {
    if (activeLocation) {
      // The zoom level is controlled by the size of the bounding box
      // Smaller values (like 0.003) = more zoomed in
      // Larger values (like 0.01) = more zoomed out
      return `https://www.openstreetmap.org/export/embed.html?bbox=${activeLocation.position.lng-0.003}%2C${activeLocation.position.lat-0.003}%2C${activeLocation.position.lng+0.003}%2C${activeLocation.position.lat+0.003}&layer=mapnik&marker=${activeLocation.position.lat}%2C${activeLocation.position.lng}`;
    } else if (locations.length > 0) {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${locations[0].position.lng-0.003}%2C${locations[0].position.lat-0.003}%2C${locations[0].position.lng+0.003}%2C${locations[0].position.lat+0.003}&layer=mapnik&marker=${locations[0].position.lat}%2C${locations[0].position.lng}`;
    } else {
      // Default US map with reasonable zoom
      return 'https://www.openstreetmap.org/export/embed.html?bbox=-130.78125%2C21.616579336740603%2C-62.75390625%2C50.90303283111257&layer=mapnik';
    }
  };
  
  return (
    <div style={{ height, width }} className="rounded-lg overflow-hidden shadow-lg">
      <iframe
        title="Location Map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={generateMapUrl()}
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      
      {/* Attribution link for OpenStreetMap (required by their usage policy) */}
      <div className="bg-white/80 text-xs p-1 absolute bottom-0 right-0">
        <a 
          href={`https://www.openstreetmap.org/#map=16/${activeLocation?.position.lat || locations[0]?.position.lat || 39.8}/${activeLocation?.position.lng || locations[0]?.position.lng || -98.5}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-700 hover:underline"
        >
          View Larger Map
        </a>
      </div>
    </div>
  );
};

export default GoogleMapsIntegration;