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
      // Format: latitude,longitude
      const coords = `${activeLocation.position.lat},${activeLocation.position.lng}`;
      // Use the standard Google Maps embed URL which doesn't require API key authorization
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3!2d${activeLocation.position.lng}!3d${activeLocation.position.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodeURIComponent(activeLocation.name)}!5e0!3m2!1sen!2sus!4v1614377926578!5m2!1sen!2sus`;
    } else if (locations.length > 0) {
      // If no active location, use the first one
      const coords = `${locations[0].position.lat},${locations[0].position.lng}`;
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3!2d${locations[0].position.lng}!3d${locations[0].position.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodeURIComponent(locations[0].name)}!5e0!3m2!1sen!2sus!4v1614377926578!5m2!1sen!2sus`;
    } else {
      // Fallback to a general map of the US (should never happen)
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12099650.91729461!2d-100.06597205976742!3d39.47451837101377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54eab584e432360b%3A0x1c3bb99243deb742!2sUnited%20States!5e0!3m2!1sen!2sus!4v1614378013849!5m2!1sen!2sus`;
    }
  };
  
  // Alternative: Use OpenStreetMap as a fallback option if Google Maps continues to have issues
  const generateOpenStreetMapUrl = (): string => {
    if (activeLocation) {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${activeLocation.position.lng-0.01}%2C${activeLocation.position.lat-0.01}%2C${activeLocation.position.lng+0.01}%2C${activeLocation.position.lat+0.01}&layer=mapnik&marker=${activeLocation.position.lat}%2C${activeLocation.position.lng}`;
    } else if (locations.length > 0) {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${locations[0].position.lng-0.01}%2C${locations[0].position.lat-0.01}%2C${locations[0].position.lng+0.01}%2C${locations[0].position.lat+0.01}&layer=mapnik&marker=${locations[0].position.lat}%2C${locations[0].position.lng}`;
    } else {
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