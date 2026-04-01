/**
 * Seed CMS tables from hardcoded data.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=xxx \
 *   npx tsx scripts/seed-cms.ts
 */

import { createClient } from '@supabase/supabase-js'
import { SERVICES } from '../src/lib/services'
import { LOCATIONS } from '../src/lib/locations'
import { DEFAULT_REVIEWS } from '../src/lib/defaults/reviews'
import { HOME_DEFAULTS, ABOUT_DEFAULTS, CONTACT_DEFAULTS } from '../src/lib/defaults/home'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const sb = createClient(url, key)

async function seedServices() {
  for (let i = 0; i < SERVICES.length; i++) {
    const s = SERVICES[i]
    await sb.from('cms_services').upsert({
      slug: s.slug,
      name: s.name,
      category: s.category,
      title: s.title,
      meta: s.meta,
      h1a: s.h1a,
      h1b: s.h1b,
      intro: s.intro,
      includes: s.includes,
      faqs: s.faqs.map(([q, a]) => ({ q, a })),
      kw_extra: s.kwExtra,
      sort_order: i,
      active: true,
    }, { onConflict: 'slug' })
  }
  console.log(`Seeded ${SERVICES.length} services`)
}

async function seedLocations() {
  for (let i = 0; i < LOCATIONS.length; i++) {
    const l = LOCATIONS[i]
    await sb.from('cms_locations').upsert({
      slug: l.slug,
      name: l.name,
      county: l.county,
      lat: l.lat,
      lng: l.lng,
      description: l.desc,
      villages: l.villages,
      nearby: l.nearby,
      kw_gardeners: l.kwGardeners,
      kw_window: l.kwWindow,
      kw_gutter: l.kwGutter,
      sort_order: i,
      active: true,
    }, { onConflict: 'slug' })
  }
  console.log(`Seeded ${LOCATIONS.length} locations`)
}

async function seedReviews() {
  for (let i = 0; i < DEFAULT_REVIEWS.length; i++) {
    const r = DEFAULT_REVIEWS[i]
    await sb.from('cms_reviews').insert({
      quote: r.quote,
      name: r.name,
      location: r.location,
      service: r.service || null,
      rating: r.rating ?? 5,
      sort_order: i,
      active: true,
    })
  }
  console.log(`Seeded ${DEFAULT_REVIEWS.length} reviews`)
}

async function seedContent() {
  const pages: Record<string, Record<string, unknown>> = {
    home: HOME_DEFAULTS,
    about: ABOUT_DEFAULTS,
    contact: CONTACT_DEFAULTS,
  }

  let count = 0
  for (const [page, sections] of Object.entries(pages)) {
    for (const [section, content] of Object.entries(sections)) {
      await sb.from('cms_content').upsert({
        page,
        section,
        content,
      }, { onConflict: 'page,section' })
      count++
    }
  }
  console.log(`Seeded ${count} content sections`)
}

async function main() {
  console.log('Seeding CMS tables...\n')
  await seedServices()
  await seedLocations()
  await seedReviews()
  await seedContent()
  console.log('\nDone!')
}

main().catch(console.error)
