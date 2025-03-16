import { storeLocations } from '../client/src/data/storeInfo';
import { storage } from './storage';

/**
 * Seed script to populate the database with store locations from the frontend data
 * This script takes the store locations defined in client/src/data/storeInfo.ts
 * and inserts them into the database
 */
async function seedStoreLocations() {
  console.log("Starting to seed store locations...");
  
  try {
    // Get all existing store locations from the database
    const existingLocations = await storage.getAllStoreLocations();
    console.log(`Found ${existingLocations.length} existing store locations in the database`);
    
    // Keep track of locations we've processed
    const processedLocations: number[] = [];
    
    // Process each location from the frontend data
    for (const location of storeLocations) {
      console.log(`Processing location: ${location.name}`);
      
      // Check if this location already exists by city name
      const existingLocation = await storage.getStoreLocationByCity(location.city);
      
      if (existingLocation) {
        console.log(`Location for ${location.city} already exists with ID ${existingLocation.id}, updating...`);
        
        // Convert frontend social profiles to expected format if it exists
        const socialProfilesJson = location.socialProfiles 
          ? JSON.stringify({
              facebook: location.socialProfiles.facebook || null,
              instagram: location.socialProfiles.instagram || null,
              twitter: location.socialProfiles.twitter || null,
              yelp: location.socialProfiles.yelp || null
            })
          : null;
        
        // Map frontend data structure to database structure
        await storage.updateStoreLocation(existingLocation.id, {
          name: location.name,
          city: location.city,
          address: location.address,
          full_address: location.fullAddress,
          phone: location.phone,
          hours: location.hours,
          closed_days: location.closedDays || null,
          image: location.image,
          lat: location.coordinates.lat.toString(),
          lng: location.coordinates.lng.toString(),
          google_place_id: location.googlePlaceId || null,
          apple_maps_link: location.appleMapsLink || null,
          map_embed: location.mapEmbed,
          email: location.email || null,
          store_code: location.storeCode || null,
          description: location.description,
          neighborhood_info: location.neighborhoodInfo || null,
          year_established: location.yearEstablished,
          price_range: location.priceRange
        });
        
        processedLocations.push(existingLocation.id);
      } else {
        console.log(`Creating new location for ${location.city}...`);
        
        // Convert frontend social profiles to expected format if it exists
        const socialProfilesJson = location.socialProfiles 
          ? JSON.stringify({
              facebook: location.socialProfiles.facebook || null,
              instagram: location.socialProfiles.instagram || null,
              twitter: location.socialProfiles.twitter || null,
              yelp: location.socialProfiles.yelp || null
            })
          : null;
          
        // Map frontend data structure to database structure
        const newLocation = await storage.createStoreLocation({
          name: location.name,
          city: location.city,
          address: location.address,
          full_address: location.fullAddress,
          phone: location.phone,
          hours: location.hours,
          closed_days: location.closedDays || null,
          image: location.image,
          lat: location.coordinates.lat.toString(),
          lng: location.coordinates.lng.toString(),
          google_place_id: location.googlePlaceId || null,
          apple_maps_link: location.appleMapsLink || null,
          map_embed: location.mapEmbed,
          email: location.email || null,
          store_code: location.storeCode || null,
          description: location.description,
          neighborhood_info: location.neighborhoodInfo || null,
          year_established: location.yearEstablished,
          price_range: location.priceRange
        });
        
        console.log(`Created new location with ID ${newLocation.id}`);
        processedLocations.push(newLocation.id);
      }
    }
    
    console.log(`Successfully processed ${processedLocations.length} store locations`);
    console.log("Store location seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding store locations:", error);
  }
}

// We'll call this function directly from the API endpoint
// No need for direct script execution

export { seedStoreLocations };