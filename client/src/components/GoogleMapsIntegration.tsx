import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Location {
  id: number;
  name: string;
  address: string;
  position: {
    lat: number;
    lng: number;
  };
  phone?: string;
  hours?: string;
}

interface GoogleMapsIntegrationProps {
  locations: Location[];
  apiKey: string;
  height?: string;
  width?: string;
  zoom?: number;
  center?: { lat: number; lng: number } | null;
  activeLocationId?: number | null;
  onMarkerClick?: (locationId: number) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMapsIntegration = ({
  locations,
  apiKey,
  height = '500px',
  width = '100%',
  zoom = 12,
  center = null,
  activeLocationId = null,
  onMarkerClick = () => {}
}: GoogleMapsIntegrationProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const googleScriptLoaded = useRef(false);

  // Create the map instance with memoized callback
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      setError('Google Maps API not loaded correctly');
      setLoading(false);
      return;
    }

    try {
      // Create map
      const mapOptions = {
        zoom,
        center: center || { lat: locations[0]?.position.lat || 37.7749, lng: locations[0]?.position.lng || -122.4194 },
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
      };
      
      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      
      // Add markers
      const newMarkers = locations.map(location => {
        const marker = new window.google.maps.Marker({
          position: location.position,
          map: newMap,
          title: location.name,
          animation: window.google.maps.Animation.DROP,
          icon: location.id === activeLocationId ? 
            { url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' } :
            { url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }
        });
        
        // Add info window
        const infoContent = `
          <div style="max-width: 200px; padding: 10px;">
            <h3 style="margin: 0 0 10px; font-weight: bold;">${location.name}</h3>
            <p style="margin: 0 0 5px;">${location.address}</p>
            ${location.phone ? `<p style="margin: 0 0 5px;"><strong>Phone:</strong> ${location.phone}</p>` : ''}
            ${location.hours ? `<p style="margin: 0 0 5px;"><strong>Hours:</strong> ${location.hours}</p>` : ''}
            <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}" 
              target="_blank" rel="noopener noreferrer" 
              style="color: #ff6b00; text-decoration: none; font-weight: bold;">
              Get Directions
            </a>
          </div>
        `;
        
        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent
        });
        
        marker.addListener('click', () => {
          markers.forEach(m => m.infoWindow && m.infoWindow.close());
          infoWindow.open(newMap, marker);
          onMarkerClick(location.id);
        });
        
        return { marker, infoWindow };
      });
      
      setMarkers(newMarkers);
      
      // If there's an active location, center on it
      if (activeLocationId) {
        const activeLocation = locations.find(loc => loc.id === activeLocationId);
        if (activeLocation) {
          newMap.setCenter(activeLocation.position);
          newMap.setZoom(zoom + 2);
          
          const activeMarkerIndex = locations.findIndex(loc => loc.id === activeLocationId);
          if (activeMarkerIndex >= 0 && newMarkers[activeMarkerIndex]) {
            newMarkers[activeMarkerIndex].infoWindow.open(
              newMap, 
              newMarkers[activeMarkerIndex].marker
            );
          }
        }
      } else if (locations.length > 1) {
        // Fit bounds to show all markers
        const bounds = new window.google.maps.LatLngBounds();
        locations.forEach(location => {
          bounds.extend(new window.google.maps.LatLng(
            location.position.lat,
            location.position.lng
          ));
        });
        newMap.fitBounds(bounds);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Error initializing map. Please try refreshing the page.');
      setLoading(false);
    }
  }, [locations, center, zoom, activeLocationId, onMarkerClick]);

  // Load Google Maps API
  useEffect(() => {
    // Skip if already loaded
    if (window.google && window.google.maps) {
      if (!googleScriptLoaded.current) {
        googleScriptLoaded.current = true;
        initializeMap();
      }
      return;
    }

    // Create callback on window
    window.initMap = () => {
      googleScriptLoaded.current = true;
      initializeMap();
    };
    
    // Load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.id = 'google-maps-script';
    script.onerror = () => {
      setError('Failed to load Google Maps API. Please check your connection.');
      setLoading(false);
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Clean up
      window.initMap = () => {};
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [apiKey, initializeMap]);

  // Update markers when activeLocationId changes
  useEffect(() => {
    if (!map || !window.google || !window.google.maps || markers.length === 0) return;
    
    markers.forEach((marker, index) => {
      if (!marker || !marker.marker || !marker.infoWindow) return;
      
      const location = locations[index];
      if (!location) return;
      
      // Update marker icon
      marker.marker.setIcon(
        location.id === activeLocationId
          ? { url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }
          : { url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }
      );
      
      // Open or close info window
      if (location.id === activeLocationId) {
        map.setCenter(location.position);
        map.setZoom(zoom + 2);
        marker.infoWindow.open(map, marker.marker);
      } else {
        marker.infoWindow.close();
      }
    });
  }, [activeLocationId, map, markers, locations, zoom]);

  return (
    <div style={{ height, width, position: 'relative' }}>
      {loading && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1
        }}>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      )}
      
      {error && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(255,107,0,0.05)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1,
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">Map Loading Error</h3>
            <p className="text-gray-800">{error}</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        className="rounded-lg shadow-lg"
      ></div>
    </div>
  );
};

export default GoogleMapsIntegration;