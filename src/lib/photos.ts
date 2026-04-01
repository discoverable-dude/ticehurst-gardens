export type Photo = {
  id: string
  created_at: string
  url: string
  alt: string
  service_slug: string | null
  category: 'hero' | 'about' | 'work' | 'before' | 'after'
  pair_id: string | null
  sort_order: number
  active: boolean
}

/** Fetch photos for a service slug (public, uses anon key) */
export async function getServicePhotos(slug: string): Promise<Photo[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []
  const { createClient } = await import('@supabase/supabase-js')
  const sb = createClient(url, key)
  const { data } = await sb
    .from('photos')
    .select('*')
    .eq('service_slug', slug)
    .eq('active', true)
    .order('sort_order')
  return (data ?? []) as Photo[]
}

/** Fetch photos by category (e.g. 'hero', 'about') */
export async function getPhotosByCategory(category: string): Promise<Photo[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []
  const { createClient } = await import('@supabase/supabase-js')
  const sb = createClient(url, key)
  const { data } = await sb
    .from('photos')
    .select('*')
    .eq('category', category)
    .eq('active', true)
    .order('sort_order')
  return (data ?? []) as Photo[]
}
