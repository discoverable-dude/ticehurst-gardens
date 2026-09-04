import { DEFAULT_REVIEWS, type Review } from '@/lib/defaults/reviews'
import { HOME_DEFAULTS, ABOUT_DEFAULTS, CONTACT_DEFAULTS } from '@/lib/defaults/home'
import { SERVICES as DEFAULT_SERVICES, type Service } from '@/lib/services'
import { LOCATIONS as DEFAULT_LOCATIONS, type Location } from '@/lib/locations'

async function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(url, key)
}

// ── Reviews ──────────────────────────────────────────────

export async function getReviews(): Promise<Review[]> {
  try {
    const sb = await getAnonClient()
    if (!sb) return DEFAULT_REVIEWS
    const { data } = await sb.from('cms_reviews').select('*').eq('active', true).order('sort_order')
    if (data && data.length > 0) {
      return data.map(r => ({ quote: r.quote, name: r.name, location: r.location, service: r.service, rating: r.rating }))
    }
  } catch { /* fall through */ }
  return DEFAULT_REVIEWS
}

// ── Page Content ─────────────────────────────────────────

const PAGE_DEFAULTS: Record<string, Record<string, unknown>> = {
  home: HOME_DEFAULTS,
  about: ABOUT_DEFAULTS,
  contact: CONTACT_DEFAULTS,
}

export async function getPageSection(page: string, section: string): Promise<unknown> {
  try {
    const sb = await getAnonClient()
    if (!sb) return PAGE_DEFAULTS[page]?.[section] ?? null
    const { data } = await sb.from('cms_content').select('content').eq('page', page).eq('section', section).single()
    if (data?.content) return data.content
  } catch { /* fall through */ }
  return PAGE_DEFAULTS[page]?.[section] ?? null
}

export async function getPageContent(page: string): Promise<Record<string, unknown>> {
  try {
    const sb = await getAnonClient()
    if (!sb) return PAGE_DEFAULTS[page] ?? {}
    const { data } = await sb.from('cms_content').select('section, content').eq('page', page)
    if (data && data.length > 0) {
      const result: Record<string, unknown> = { ...(PAGE_DEFAULTS[page] ?? {}) }
      for (const row of data) {
        result[row.section] = row.content
      }
      return result
    }
  } catch { /* fall through */ }
  return PAGE_DEFAULTS[page] ?? {}
}

// ── Services ─────────────────────────────────────────────

function mapDbService(row: Record<string, unknown>): Service {
  return {
    slug: row.slug as string,
    name: row.name as string,
    category: row.category as 'gardening' | 'cleaning',
    title: row.title as string,
    meta: row.meta as string,
    h1a: row.h1a as string,
    h1b: row.h1b as string,
    intro: row.intro as string,
    includes: row.includes as string[],
    faqs: (row.faqs as Array<{ q: string; a: string }>).map(f => [f.q, f.a] as [string, string]),
    kwExtra: (row.kw_extra as string) || '',
  }
}

export async function getAllServices(): Promise<Service[]> {
  try {
    const sb = await getAnonClient()
    if (!sb) return DEFAULT_SERVICES
    const { data } = await sb.from('cms_services').select('*').eq('active', true).order('sort_order')
    if (data && data.length > 0) return data.map(mapDbService)
  } catch { /* fall through */ }
  return DEFAULT_SERVICES
}

export async function getCmsService(slug: string): Promise<Service | undefined> {
  try {
    const sb = await getAnonClient()
    if (!sb) return DEFAULT_SERVICES.find(s => s.slug === slug)
    const { data } = await sb.from('cms_services').select('*').eq('slug', slug).eq('active', true).single()
    if (data) return mapDbService(data)
  } catch { /* fall through */ }
  return DEFAULT_SERVICES.find(s => s.slug === slug)
}

// ── Locations ────────────────────────────────────────────

function mapDbLocation(row: Record<string, unknown>): Location {
  return {
    slug: row.slug as string,
    name: row.name as string,
    county: row.county as string,
    lat: row.lat as number,
    lng: row.lng as number,
    desc: row.description as string,
    villages: row.villages as string,
    nearby: row.nearby as string[],
    kwGardeners: (row.kw_gardeners as string) || '',
    kwWindow: (row.kw_window as string) || '',
    kwGutter: (row.kw_gutter as string) || '',
  }
}

export async function getAllLocations(): Promise<Location[]> {
  try {
    const sb = await getAnonClient()
    if (!sb) return DEFAULT_LOCATIONS
    const { data } = await sb.from('cms_locations').select('*').eq('active', true).order('sort_order')
    if (data && data.length > 0) return data.map(mapDbLocation)
  } catch { /* fall through */ }
  return DEFAULT_LOCATIONS
}

export async function getCmsLocation(slug: string): Promise<Location | undefined> {
  try {
    const sb = await getAnonClient()
    if (!sb) return DEFAULT_LOCATIONS.find(l => l.slug === slug)
    const { data } = await sb.from('cms_locations').select('*').eq('slug', slug).eq('active', true).single()
    if (data) return mapDbLocation(data)
  } catch { /* fall through */ }
  return DEFAULT_LOCATIONS.find(l => l.slug === slug)
}
