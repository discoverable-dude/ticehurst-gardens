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

async function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(url, key)
}

/** Fetch photos for a service slug via placements (falls back to direct photos table) */
export async function getServicePhotos(slug: string): Promise<Photo[]> {
  const sb = await getAnonClient()
  if (!sb) return []

  // Try placements first
  const { data: placements } = await sb
    .from('photo_placements')
    .select('category, pair_id, sort_order, photo_id, photos(id, url, alt, active)')
    .eq('service_slug', slug)
    .order('sort_order')

  if (placements && placements.length > 0) {
    return placements
      .filter((p: Record<string, unknown>) => {
        const raw = p.photos as unknown
        const photo = (Array.isArray(raw) ? raw[0] : raw) as Record<string, unknown> | null
        return photo && photo.active !== false
      })
      .map((p: Record<string, unknown>) => {
        const raw = p.photos as unknown
        const photo = (Array.isArray(raw) ? raw[0] : raw) as Record<string, unknown>
        return {
          id: photo.id as string,
          created_at: '',
          url: photo.url as string,
          alt: (photo.alt as string) || '',
          service_slug: slug,
          category: p.category as Photo['category'],
          pair_id: (p.pair_id as string) || null,
          sort_order: p.sort_order as number,
          active: true,
        }
      })
  }

  // Fallback to direct photos table (backward compatible)
  const { data } = await sb
    .from('photos')
    .select('*')
    .eq('service_slug', slug)
    .eq('active', true)
    .order('sort_order')
  return (data ?? []) as Photo[]
}

/** Fetch photos placed on a location/area page via placements (location_slug) */
export async function getLocationPhotos(slug: string): Promise<Photo[]> {
  const sb = await getAnonClient()
  if (!sb) return []
  const { data: placements } = await sb
    .from('photo_placements')
    .select('category, pair_id, sort_order, photo_id, photos(id, url, alt, active)')
    .eq('location_slug', slug)
    .order('sort_order')
  if (!placements) return []
  return placements
    .filter((p: Record<string, unknown>) => {
      const raw = p.photos as unknown
      const photo = (Array.isArray(raw) ? raw[0] : raw) as Record<string, unknown> | null
      return photo && photo.active !== false
    })
    .map((p: Record<string, unknown>) => {
      const raw = p.photos as unknown
      const photo = (Array.isArray(raw) ? raw[0] : raw) as Record<string, unknown>
      return {
        id: photo.id as string,
        created_at: '',
        url: photo.url as string,
        alt: (photo.alt as string) || '',
        service_slug: null,
        category: p.category as Photo['category'],
        pair_id: (p.pair_id as string) || null,
        sort_order: p.sort_order as number,
        active: true,
      }
    })
}

/** Fetch photos by category (e.g. 'hero', 'about') via placements */
export async function getPhotosByCategory(category: string): Promise<Photo[]> {
  const sb = await getAnonClient()
  if (!sb) return []

  // Try placements first
  const { data: placements } = await sb
    .from('photo_placements')
    .select('category, pair_id, sort_order, photo_id, photos(id, url, alt, active)')
    .eq('category', category)
    .is('service_slug', null)
    .order('sort_order')

  if (placements && placements.length > 0) {
    return placements
      .filter((p: Record<string, unknown>) => {
        const raw = p.photos as unknown
        const photo = (Array.isArray(raw) ? raw[0] : raw) as Record<string, unknown> | null
        return photo && photo.active !== false
      })
      .map((p: Record<string, unknown>) => {
        const raw = p.photos as unknown
        const photo = (Array.isArray(raw) ? raw[0] : raw) as Record<string, unknown>
        return {
          id: photo.id as string,
          created_at: '',
          url: photo.url as string,
          alt: (photo.alt as string) || '',
          service_slug: null,
          category: p.category as Photo['category'],
          pair_id: (p.pair_id as string) || null,
          sort_order: p.sort_order as number,
          active: true,
        }
      })
  }

  // Fallback
  const { data } = await sb
    .from('photos')
    .select('*')
    .eq('category', category)
    .eq('active', true)
    .order('sort_order')
  return (data ?? []) as Photo[]
}

/** Fetch a general portfolio of work photos across all services (for about/reviews pages) */
export async function getPortfolioPhotos(limit = 9): Promise<Photo[]> {
  const sb = await getAnonClient()
  if (!sb) return []

  // Try placements — get work photos from different services for variety
  const { data: placements } = await sb
    .from('photo_placements')
    .select('category, service_slug, sort_order, photo_id, photos(id, url, alt, active)')
    .eq('category', 'work')
    .not('service_slug', 'is', null)
    .order('sort_order')
    .limit(limit * 3) // fetch extra to dedupe

  if (placements && placements.length > 0) {
    // Dedupe by photo_id, pick variety across services
    const seen = new Set<string>()
    const result: Photo[] = []
    for (const p of placements) {
      const raw = p.photos as unknown
      const photo = (Array.isArray(raw) ? raw[0] : raw) as Record<string, unknown> | null
      if (!photo || photo.active === false) continue
      const photoId = photo.id as string
      if (seen.has(photoId)) continue
      seen.add(photoId)
      result.push({
        id: photoId,
        created_at: '',
        url: photo.url as string,
        alt: (photo.alt as string) || '',
        service_slug: p.service_slug,
        category: 'work',
        pair_id: null,
        sort_order: p.sort_order as number,
        active: true,
      })
      if (result.length >= limit) break
    }
    if (result.length > 0) return result
  }

  // Fallback — get work photos directly
  const { data } = await sb
    .from('photos')
    .select('*')
    .eq('category', 'work')
    .eq('active', true)
    .order('sort_order')
    .limit(limit)
  return (data ?? []) as Photo[]
}
