export interface StoreLocation {
  id: number;
  name: string;
  city: string;
  address: string;
  full_address: string;
  phone: string;
  hours: string;
  closed_days?: string;
  image: string;
  lat: number;
  lng: number;
  map_embed?: string;
  email?: string;
  store_code?: string;
  opening_hours?: Record<string, string>;
  description?: string;
  year_established?: number;
  price_range?: string;
  services?: string[];
  accepted_payments?: string[];
  area_served?: string[];
}