import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, anon)

// ── Types ──────────────────────────────────────────────────────
export type ServiceCategory = 'gardening' | 'cleaning'

export type QuoteSubmission = {
  id?:              string
  created_at?:      string
  // Service
  service:          string
  category:         ServiceCategory
  // Sizing
  garden_size?:     string   // 'small' | 'medium' | 'large' | 'extra_large'
  property_size?:   string   // for cleaning services
  num_windows?:     number
  num_panels?:      number
  // Frequency
  frequency?:       string   // 'one_off' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly'
  // Extras
  extras?:          string[]
  // Location
  town:             string
  postcode?:        string
  // Contact
  name:             string
  phone:            string
  email?:           string
  message?:         string
  // Estimate
  estimate_low?:    number
  estimate_high?:   number
  // Status
  status:           'new' | 'contacted' | 'quoted' | 'booked' | 'declined'
  source?:          string   // 'quote_tool' | 'contact_form'
}

export type ContactSubmission = {
  id?:         string
  created_at?: string
  name:        string
  phone:       string
  email?:      string
  service?:    string
  town?:       string
  message?:    string
  status:      'new' | 'contacted' | 'closed'
}
