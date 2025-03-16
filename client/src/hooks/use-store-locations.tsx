import { useQuery } from "@tanstack/react-query";
import { StoreLocation } from "@/types/store-location";
import { getQueryFn } from "@/lib/queryClient";

/**
 * Hook to fetch all store locations
 */
export function useStoreLocations() {
  return useQuery({
    queryKey: ['/api/store-locations'],
    queryFn: getQueryFn<StoreLocation[]>({ on401: 'returnNull' })
  });
}

/**
 * Hook to fetch a store location by ID
 */
export function useStoreLocationById(id: number) {
  const { data: locations } = useStoreLocations();
  
  return {
    data: locations?.find(location => location.id === id),
    isLoading: !locations
  };
}

/**
 * Hook to fetch a store location by city
 */
export function useStoreLocationByCity(city: string) {
  const { data: locations } = useStoreLocations();
  
  return {
    data: locations?.find(location => 
      location.city.toLowerCase() === city.toLowerCase()
    ),
    isLoading: !locations
  };
}

/**
 * Helper to get formatted locations for Google Maps
 */
export function useFormattedLocationsForMap() {
  const { data: locations, isLoading } = useStoreLocations();
  
  const formattedLocations = locations?.map(loc => ({
    id: loc.id,
    name: loc.name,
    address: loc.full_address,
    position: {
      lat: typeof loc.lat === 'string' ? parseFloat(loc.lat) : loc.lat,
      lng: typeof loc.lng === 'string' ? parseFloat(loc.lng) : loc.lng
    },
    googlePlaceId: loc.google_place_id || undefined,
    appleMapsLink: loc.apple_maps_link || undefined,
    city: loc.city,
    email: loc.email,
    phone: loc.phone,
    image: loc.image
  })) || [];
  
  return {
    data: formattedLocations,
    isLoading
  };
}

/**
 * Hook to get the Frisco location
 */
export function useFriscoLocation() {
  return useStoreLocationById(1);
}

/**
 * Hook to get the Arlington location
 */
export function useArlingtonLocation() {
  return useStoreLocationById(2);
}