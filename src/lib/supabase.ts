import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_client) return _client
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) throw new Error('Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to Vercel env vars.')
  _client = createClient(url, anon)
  return _client
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = new Proxy({} as SupabaseClient, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(_target, prop): any { return (getSupabase() as any)[prop] },
})

export type ServiceCategory = 'gardening' | 'cleaning'
export type QuoteSubmission = {
  id?: string; created_at?: string; service: string; category: ServiceCategory
  garden_size?: string; frequency?: string; town: string; postcode?: string
  name: string; phone: string; email?: string; message?: string
  estimate_low?: number; estimate_high?: number
  status: 'new' | 'contacted' | 'quoted' | 'booked' | 'declined'; source?: string
}
export type ContactSubmission = {
  id?: string; created_at?: string; name: string; phone: string
  email?: string; service?: string; town?: string; message?: string
  status: 'new' | 'contacted' | 'closed'
}
