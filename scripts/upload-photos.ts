/**
 * Bulk upload photos from "Tice photos copy" folder with placements.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=xxx \
 *   npx tsx scripts/upload-photos.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
if (!url || !key) { console.error('Set env vars'); process.exit(1) }

const sb = createClient(url, key)
const PHOTO_DIR = path.resolve(__dirname, '../../Tice photos copy')

// ── Image placement mapping ──
// Each entry: filename, alt text, and placements array
// Placements: { service, category, pair_id? }

type Placement = { service: string | null; category: string; pair_id?: string }

const IMAGES: { file: string; alt: string; placements: Placement[] }[] = [
  // ═══ HERO / ABOUT (best showcase images) ═══
  { file: 'striped-lawn-and-decking-garden-view.jpg', alt: 'Striped lawn viewed from decking area',
    placements: [
      { service: null, category: 'hero' },
      { service: 'lawn-care', category: 'work' },
    ]},
  { file: 'formal-topiary-garden-view-one.jpg', alt: 'Formal topiary garden with symmetrical clipped evergreens',
    placements: [
      { service: null, category: 'about' },
      { service: 'garden-maintenance', category: 'work' },
      { service: 'hedge-tree-care', category: 'work' },
    ]},

  // ═══ LAWN CARE ═══
  { file: 'large-garden-lawn-installation-before-ground-prep.jpg', alt: 'Garden cleared and levelled before lawn installation',
    placements: [
      { service: 'lawn-care', category: 'before', pair_id: 'lawn-install-1' },
    ]},
  { file: 'new-build-lawn-installation-after-striped-turf.jpg', alt: 'Freshly laid striped lawn in large rear garden',
    placements: [
      { service: 'lawn-care', category: 'after', pair_id: 'lawn-install-1' },
    ]},
  { file: 'residential-lawn-before-maintenance.jpg', alt: 'Lawn before maintenance showing uneven cut',
    placements: [
      { service: 'lawn-care', category: 'before', pair_id: 'lawn-maint-1' },
    ]},
  { file: 'residential-lawn-after-maintenance.jpg', alt: 'Lawn after maintenance with visible stripes',
    placements: [
      { service: 'lawn-care', category: 'after', pair_id: 'lawn-maint-1' },
    ]},
  { file: 'striped-lawn-maintenance-finish.jpg', alt: 'Professionally cut lawn with defined stripes',
    placements: [{ service: 'lawn-care', category: 'work' }] },
  { file: 'striped-front-lawn-maintenance-finish.jpg', alt: 'Front lawn with crisp stripes',
    placements: [{ service: 'lawn-care', category: 'work' }] },
  { file: 'large-country-lawn-curved-stripe-pattern.jpg', alt: 'Large lawn with curved mowing stripes',
    placements: [{ service: 'lawn-care', category: 'work' }] },
  { file: 'spring-lawn-with-blossom-tree-feature.jpg', alt: 'Spring lawn with flowering tree feature',
    placements: [{ service: 'lawn-care', category: 'work' }] },
  { file: 'striped-lawn-garden-border-wide-view.jpg', alt: 'Wide lawn view with clean mowing lines and borders',
    placements: [{ service: 'lawn-care', category: 'work' }, { service: 'garden-maintenance', category: 'work' }] },

  // ═══ GARDEN MAINTENANCE ═══
  { file: 'hedge-and-lawn-before-tidy.jpg', alt: 'Garden with uneven hedge and lawn before maintenance',
    placements: [
      { service: 'garden-maintenance', category: 'before', pair_id: 'garden-tidy-1' },
    ]},
  { file: 'hedge-and-lawn-after-tidy.jpg', alt: 'Neatened garden with trimmed hedges and defined lawn',
    placements: [
      { service: 'garden-maintenance', category: 'after', pair_id: 'garden-tidy-1' },
    ]},
  { file: 'front-garden-before-tidy-up-driveway-border.jpg', alt: 'Front garden overgrown before tidy-up',
    placements: [
      { service: 'garden-maintenance', category: 'before', pair_id: 'front-tidy-1' },
    ]},
  { file: 'front-garden-after-tidy-up-driveway-border.jpg', alt: 'Refreshed front garden after tidy-up',
    placements: [
      { service: 'garden-maintenance', category: 'after', pair_id: 'front-tidy-1' },
    ]},
  { file: 'formal-topiary-garden-view-two.jpg', alt: 'Formal topiary garden alternative view',
    placements: [{ service: 'garden-maintenance', category: 'work' }] },
  { file: 'house-and-terrace-maintenance-view-one.jpg', alt: 'Rear terrace and garden during maintenance',
    placements: [{ service: 'garden-maintenance', category: 'work' }] },
  { file: 'house-and-terrace-maintenance-view-two.jpg', alt: 'Property and grounds during maintenance visit',
    placements: [{ service: 'garden-maintenance', category: 'work' }] },
  { file: 'commercial-lawn-and-border-maintenance.jpg', alt: 'Commercial lawn and border maintenance',
    placements: [{ service: 'garden-maintenance', category: 'work' }] },

  // ═══ HEDGE & TREE CARE ═══
  { file: 'overgrown-hedge-before-trimming.jpg', alt: 'Dense overgrown hedge before trimming',
    placements: [
      { service: 'hedge-tree-care', category: 'before', pair_id: 'hedge-trim-1' },
    ]},
  { file: 'hedge-after-trimming-straight-edge.jpg', alt: 'Neatly trimmed hedge with clean edge',
    placements: [
      { service: 'hedge-tree-care', category: 'after', pair_id: 'hedge-trim-1' },
    ]},
  { file: 'hedge-gateway-before-pruning.jpg', alt: 'Overgrown hedge arch before shaping',
    placements: [
      { service: 'hedge-tree-care', category: 'before', pair_id: 'hedge-gate-1' },
    ]},
  { file: 'hedge-gateway-after-pruning.jpg', alt: 'Cleanly shaped hedge arch framing garden gate',
    placements: [
      { service: 'hedge-tree-care', category: 'after', pair_id: 'hedge-gate-1' },
    ]},
  { file: 'field-boundary-hedge-before-reduction.jpg', alt: 'Overgrown boundary hedge before reduction',
    placements: [
      { service: 'hedge-tree-care', category: 'before', pair_id: 'hedge-field-1' },
    ]},
  { file: 'field-boundary-hedge-after-reduction.jpg', alt: 'Boundary hedge after reduction and clearance',
    placements: [
      { service: 'hedge-tree-care', category: 'after', pair_id: 'hedge-field-1' },
    ]},
  { file: 'field-boundary-hedge-before-cutting.jpg', alt: 'Overgrown boundary hedge before cutting',
    placements: [
      { service: 'hedge-tree-care', category: 'before', pair_id: 'hedge-field-2' },
    ]},
  { file: 'field-boundary-hedge-after-cutting.jpg', alt: 'Boundary hedge trimmed to uniform height',
    placements: [
      { service: 'hedge-tree-care', category: 'after', pair_id: 'hedge-field-2' },
    ]},
  { file: 'evergreen-shrub-before-shaping.jpg', alt: 'Evergreen shrub before pruning',
    placements: [
      { service: 'hedge-tree-care', category: 'before', pair_id: 'topiary-1' },
    ]},
  { file: 'evergreen-topiary-after-shaping.jpg', alt: 'Shaped topiary shrub after pruning',
    placements: [
      { service: 'hedge-tree-care', category: 'after', pair_id: 'topiary-1' },
    ]},
  { file: 'paired-topiary-shrubs-before-shaping.jpg', alt: 'Paired shrubs before shaping',
    placements: [
      { service: 'hedge-tree-care', category: 'before', pair_id: 'topiary-2' },
    ]},
  { file: 'paired-topiary-shrubs-after-shaping.jpg', alt: 'Matching shrubs shaped into clean rounded forms',
    placements: [
      { service: 'hedge-tree-care', category: 'after', pair_id: 'topiary-2' },
    ]},
  { file: 'overgrown-conifer-hedge-before-trimming.jpg', alt: 'Tall conifer hedge before shaping',
    placements: [{ service: 'hedge-tree-care', category: 'before', pair_id: 'conifer-1' }] },
  { file: 'formal-evergreen-hedge-trimming-in-progress.jpg', alt: 'Formal hedge being professionally cut',
    placements: [{ service: 'hedge-tree-care', category: 'work' }] },
  { file: 'garden-tree-pruning-before-shaping.jpg', alt: 'Large garden tree before crown shaping',
    placements: [{ service: 'hedge-tree-care', category: 'work' }] },
  { file: 'rear-garden-hedge-trimming-before-wide-view.jpg', alt: 'Rear garden hedges before trimming',
    placements: [{ service: 'hedge-tree-care', category: 'work' }] },
  { file: 'rear-garden-hedge-trimming-during-work.jpg', alt: 'Hedge trimming in progress',
    placements: [{ service: 'hedge-tree-care', category: 'work' }] },
  { file: 'driveway-laurel-hedge-maintenance-view.jpg', alt: 'Laurel hedge along driveway after maintenance',
    placements: [{ service: 'hedge-tree-care', category: 'work' }] },
  { file: 'driveway-entrance-hedge-and-gate-detail.jpg', alt: 'Trimmed hedge framing driveway entrance with gate',
    placements: [{ service: 'hedge-tree-care', category: 'work' }, { service: 'fencing', category: 'work' }] },
  { file: 'espalier-fruit-tree-border-pruning-view-one.jpg', alt: 'Pruned espalier fruit trees along border',
    placements: [{ service: 'hedge-tree-care', category: 'work' }] },
  { file: 'espalier-fruit-tree-border-pruning-view-two.jpg', alt: 'Espalier fruit trees showing improved shape',
    placements: [{ service: 'hedge-tree-care', category: 'work' }] },
  { file: 'orchard-row-winter-pruning-view-one.jpg', alt: 'Orchard fruit trees after winter pruning',
    placements: [{ service: 'hedge-tree-care', category: 'work' }] },
  { file: 'orchard-row-winter-pruning-view-two.jpg', alt: 'Wider orchard view after pruning',
    placements: [{ service: 'hedge-tree-care', category: 'work' }] },

  // ═══ GARDEN CLEARANCES ═══
  { file: 'boundary-overgrowth-before-clearance.jpg', alt: 'Dense brambles blocking garden boundary before clearance',
    placements: [
      { service: 'garden-clearances', category: 'before', pair_id: 'boundary-1' },
    ]},
  { file: 'boundary-overgrowth-after-clearance.jpg', alt: 'Boundary cleared to restore access',
    placements: [
      { service: 'garden-clearances', category: 'after', pair_id: 'boundary-1' },
    ]},
  { file: 'boundary-path-clearance-before.jpg', alt: 'Overgrown boundary path before clearance',
    placements: [
      { service: 'garden-clearances', category: 'before', pair_id: 'path-1' },
    ]},
  { file: 'boundary-path-clearance-after.jpg', alt: 'Cleared boundary path restoring access',
    placements: [
      { service: 'garden-clearances', category: 'after', pair_id: 'path-1' },
    ]},
  { file: 'front-garden-before-conifer-removal.jpg', alt: 'Front garden with oversized conifer before removal',
    placements: [
      { service: 'garden-clearances', category: 'before', pair_id: 'conifer-remove-1' },
    ]},
  { file: 'front-garden-after-conifer-removal.jpg', alt: 'Front garden opened up after conifer removal',
    placements: [
      { service: 'garden-clearances', category: 'after', pair_id: 'conifer-remove-1' },
    ]},
  { file: 'front-garden-before-landscape-clearance.jpg', alt: 'Front garden before clearance with patchy lawn',
    placements: [
      { service: 'garden-clearances', category: 'before', pair_id: 'front-clear-1' },
    ]},
  { file: 'front-garden-after-ground-preparation.jpg', alt: 'Front garden cleared and levelled',
    placements: [
      { service: 'garden-clearances', category: 'after', pair_id: 'front-clear-1' },
    ]},
  { file: 'garden-clearance-before-levelling-period-property.jpg', alt: 'Period property garden before clearance',
    placements: [{ service: 'garden-clearances', category: 'work' }] },

  // ═══ BORDERS & BEDS ═══
  { file: 'planting-bed-clearance-before-replanting.jpg', alt: 'Planting bed cleared ready for redesign',
    placements: [
      { service: 'borders-beds', category: 'before', pair_id: 'bed-1' },
    ]},
  { file: 'driveway-border-replanting-early-growth.jpg', alt: 'Replanted border with early growth',
    placements: [
      { service: 'borders-beds', category: 'after', pair_id: 'bed-1' },
    ]},
  { file: 'patio-border-gravel-area-before-removal.jpg', alt: 'Patchy grass beside patio before gravel border',
    placements: [
      { service: 'borders-beds', category: 'before', pair_id: 'gravel-1' },
    ]},
  { file: 'patio-border-white-gravel-after-installation.jpg', alt: 'White gravel border creating clean patio edge',
    placements: [
      { service: 'borders-beds', category: 'after', pair_id: 'gravel-1' },
    ]},
  { file: 'cottage-garden-border-planting-showcase.jpg', alt: 'Cottage garden border with layered planting',
    placements: [{ service: 'borders-beds', category: 'work' }] },
  { file: 'dahlia-flower-bed-vibrant-summer-planting.jpg', alt: 'Deep pink dahlias in full summer bloom',
    placements: [{ service: 'borders-beds', category: 'work' }] },
  { file: 'mixed-wildflower-border-naturalistic-planting.jpg', alt: 'Mixed wildflower border with naturalistic planting',
    placements: [{ service: 'borders-beds', category: 'work' }] },
  { file: 'mixed-wildflower-border-naturalistic-planting-alt.jpg', alt: 'Wildflower border wider view showing depth',
    placements: [{ service: 'borders-beds', category: 'work' }] },
  { file: 'wildflower-border-with-striped-lawn-island.jpg', alt: 'Wildflower border surrounding striped lawn',
    placements: [{ service: 'borders-beds', category: 'work' }, { service: 'lawn-care', category: 'work' }] },
  { file: 'front-garden-circular-bed-planting-design.jpg', alt: 'Circular planting bed with seasonal flowers',
    placements: [{ service: 'borders-beds', category: 'work' }] },
  { file: 'hibiscus-flowering-shrub-close-up.jpg', alt: 'Flowering hibiscus shrub close-up',
    placements: [{ service: 'borders-beds', category: 'work' }] },
  { file: 'planting-bed-prepared-soil-edging-detail.jpg', alt: 'Prepared soil with clean lawn edge for planting',
    placements: [{ service: 'borders-beds', category: 'work' }] },
  { file: 'driveway-border-replanting-wide-view.jpg', alt: 'Wide view of replanted driveway border',
    placements: [{ service: 'borders-beds', category: 'work' }] },
  { file: 'decorative-white-gravel-tree-border-install.jpg', alt: 'White gravel around tree bases',
    placements: [{ service: 'borders-beds', category: 'work' }] },
  { file: 'front-garden-white-gravel-driveway-finish.jpg', alt: 'Front garden with white gravel finish',
    placements: [{ service: 'borders-beds', category: 'work' }, { service: 'garden-clearances', category: 'work' }] },

  // ═══ WINDOW / EXTERIOR CLEANING ═══
  { file: 'exterior-window-frame-before-cleaning.jpg', alt: 'Window frame with dirt and algae before cleaning',
    placements: [{ service: 'window-cleaning', category: 'before', pair_id: 'window-1' }] },
  { file: 'exterior-window-frame-upvc-before-cleaning.jpg', alt: 'UPVC window frame with dirt buildup before cleaning',
    placements: [{ service: 'window-cleaning', category: 'before', pair_id: 'window-2' }] },

  // ═══ JET WASHING ═══
  { file: 'mossy-driveway-before-clean-up.jpg', alt: 'Mossy driveway before cleaning',
    placements: [{ service: 'jet-washing', category: 'before', pair_id: 'drive-1' }] },

  // ═══ COMMERCIAL ═══
  { file: 'commercial-landscape-maintenance-signage.jpg', alt: 'Commercial frontage with trimmed hedging',
    placements: [{ service: 'garden-maintenance', category: 'work' }, { service: 'hedge-tree-care', category: 'work' }] },
  { file: 'commercial-landscape-signage-hedge-maintenance.jpg', alt: 'Commercial signage with maintained hedging',
    placements: [{ service: 'garden-maintenance', category: 'work' }] },

  // ═══ LANDSCAPING / MULTI-SERVICE ═══
  { file: 'modern-patio-artificial-lawn-install.jpg', alt: 'Modern patio with artificial lawn installation',
    placements: [{ service: 'lawn-care', category: 'work' }, { service: 'borders-beds', category: 'work' }] },
  { file: 'patio-border-gravel-area-during-excavation.jpg', alt: 'Patio border during excavation',
    placements: [{ service: 'borders-beds', category: 'work' }] },
  { file: 'patio-border-gravel-area-membrane-installation.jpg', alt: 'Weed membrane fitted for gravel border',
    placements: [{ service: 'borders-beds', category: 'work' }] },
  { file: 'large-garden-lawn-installation-before-layout.jpg', alt: 'Garden prepared with membrane before turf',
    placements: [{ service: 'lawn-care', category: 'work' }] },
  { file: 'garden-bed-preparation-soil-rows.jpg', alt: 'Freshly prepared planting rows',
    placements: [{ service: 'borders-beds', category: 'work' }] },
  { file: 'front-garden-weed-membrane-ground-prep.jpg', alt: 'Front garden with weed membrane before gravel',
    placements: [{ service: 'garden-clearances', category: 'work' }] },
  { file: 'driveway-edge-and-hedge-line-before-maintenance.jpg', alt: 'Driveway with hedging before maintenance',
    placements: [{ service: 'garden-maintenance', category: 'work' }] },

  // ═══ SKIP (not suitable for site) ═══
  // indoor-children-playing-lifestyle-shot.jpg — not relevant
]

async function main() {
  console.log(`Uploading ${IMAGES.length} images...\n`)

  let uploaded = 0
  let placementCount = 0

  for (const img of IMAGES) {
    const filePath = path.join(PHOTO_DIR, img.file)
    if (!fs.existsSync(filePath)) {
      console.log(`SKIP (not found): ${img.file}`)
      continue
    }

    // Upload to storage
    const buf = fs.readFileSync(filePath)
    const storagePath = `gallery/${img.file}`

    const { error: uploadErr } = await sb.storage
      .from('photos')
      .upload(storagePath, buf, { contentType: 'image/jpeg', upsert: true })

    if (uploadErr && !uploadErr.message.includes('already exists')) {
      console.log(`UPLOAD ERROR: ${img.file} — ${uploadErr.message}`)
      continue
    }

    const { data: urlData } = sb.storage.from('photos').getPublicUrl(storagePath)

    // Insert photo record
    const { data: photo, error: insertErr } = await sb.from('photos').upsert({
      url: urlData.publicUrl,
      alt: img.alt,
      service_slug: img.placements[0]?.service || null,
      category: img.placements[0]?.category || 'work',
      pair_id: img.placements[0]?.pair_id || null,
      sort_order: uploaded,
      active: true,
    }, { onConflict: 'url' }).select().single()

    if (insertErr) {
      // URL not unique-constrained, try insert
      const { data: photo2, error: insertErr2 } = await sb.from('photos').insert({
        url: urlData.publicUrl,
        alt: img.alt,
        service_slug: img.placements[0]?.service || null,
        category: img.placements[0]?.category || 'work',
        pair_id: img.placements[0]?.pair_id || null,
        sort_order: uploaded,
        active: true,
      }).select().single()
      if (insertErr2) {
        console.log(`DB ERROR: ${img.file} — ${insertErr2.message}`)
        continue
      }
      if (!photo2) continue

      // Create placements
      for (const pl of img.placements) {
        await sb.from('photo_placements').insert({
          photo_id: photo2.id,
          service_slug: pl.service,
          category: pl.category,
          pair_id: pl.pair_id || null,
          sort_order: placementCount,
        })
        placementCount++
      }
    } else if (photo) {
      // Create placements
      for (const pl of img.placements) {
        await sb.from('photo_placements').insert({
          photo_id: photo.id,
          service_slug: pl.service,
          category: pl.category,
          pair_id: pl.pair_id || null,
          sort_order: placementCount,
        })
        placementCount++
      }
    }

    uploaded++
    console.log(`✓ ${img.file} (${img.placements.length} placements)`)
  }

  console.log(`\nDone! Uploaded ${uploaded} images, created ${placementCount} placements.`)
}

main().catch(console.error)
