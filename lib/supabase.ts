import { createClient } from '@supabase/supabase-js'

// These will be provided when you create your Supabase project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types (will be auto-generated after migration)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          username: string
          password_hash: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          username: string
          password_hash: string
          role?: string
        }
        Update: {
          username?: string
          password_hash?: string
          role?: string
        }
      }
      store_locations: {
        Row: {
          id: number
          name: string
          image: string
          description: string
          city: string
          address: string
          full_address: string
          phone: string
          hours: string
          closed_days: string | null
          lat: string
          lng: string
          google_place_id: string
          apple_maps_link: string
          map_embed: string
          email: string
          store_code: string
          opening_hours: Record<string, string>
          services: string[]
          accepted_payments: string[]
          area_served: string[]
          public_transit: string
          parking: string
          year_established: number
          price_range: string
          social_profiles: Record<string, string>
          neighborhood_info: string
          amenities: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          image: string
          description: string
          city: string
          address: string
          full_address: string
          phone: string
          hours: string
          closed_days?: string | null
          lat: string
          lng: string
          google_place_id: string
          apple_maps_link: string
          map_embed: string
          email: string
          store_code: string
          opening_hours: Record<string, string>
          services: string[]
          accepted_payments: string[]
          area_served: string[]
          public_transit?: string
          parking?: string
          year_established: number
          price_range: string
          social_profiles: Record<string, string>
          neighborhood_info?: string
          amenities: string[]
        }
        Update: {
          name?: string
          image?: string
          description?: string
          city?: string
          address?: string
          full_address?: string
          phone?: string
          hours?: string
          closed_days?: string | null
          lat?: string
          lng?: string
          google_place_id?: string
          apple_maps_link?: string
          map_embed?: string
          email?: string
          store_code?: string
          opening_hours?: Record<string, string>
          services?: string[]
          accepted_payments?: string[]
          area_served?: string[]
          public_transit?: string
          parking?: string
          year_established?: number
          price_range?: string
          social_profiles?: Record<string, string>
          neighborhood_info?: string
          amenities?: string[]
        }
      }
      // Add other table types as needed...
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}