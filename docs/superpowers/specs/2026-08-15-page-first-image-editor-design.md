# Page-First Image Editor — Design Spec

**Date:** 2026-08-15
**Repo:** `~/tgg` (branch off `design-upgrade`). Next.js 16, admin at `/admin`, shared Supabase
`ebqdphcszdxtbhjptwcs`. Migrations tracked in `supabase/migrations/`.
**Status:** Design approved (decisions below), pending spec review.

## Goal
Make it fast to curate the images on a **service** or **location** page: pick the page, see its images in
order, add them (from the library or by uploading), remove, reorder, and set each one's role — instead of
today's photo-first slog of opening each of 83 photos' placement panels one at a time.

## Non-goals
- No change to how service pages *render* images (that already works via placements).
- No redesign of the existing Images tab (it stays for library-wide upload/tagging).
- No drag-drop dependency (reorder is up/down arrows).

## Approved decisions
- **Locations: both** — add real per-location galleries **and** keep the shared hero manageable.
- **Adding images: both** — pick from the existing library (multi-select) **and** upload new images
  straight onto the page.

## Current state (verified)
- A service page (`app/services/[slug]/page.tsx`) shows images via `getServicePhotos(slug)`
  (`lib/photos.ts`), which reads `photo_placements` where `service_slug = slug`, joined to `photos`,
  ordered by `sort_order`.
- Area pages (`app/areas/[slug]/page.tsx`) only show one shared hero (`getPhotosByCategory('hero')`) and
  render "photos coming soon" — there is **no** per-location gallery. `photo_placements` has no location
  dimension.
- Placement counts are lopsided: Hedge&Tree 26, Borders&Beds 19, Garden Clearances 15, Lawn 13, Garden
  Maintenance 13, Window Cleaning 2, Fencing 1, Jet Washing 1; Solar/Gutter/Conservatory/Building = 0.
- Admin: `AdminImages` manages placements photo-first (per-photo modal). `AdminServices`/`AdminLocations`
  manage text only, reading `cms_services`/`cms_locations` via `/api/admin/services|locations` GET.
- `photo_placements(id, photo_id, service_slug, category, pair_id, sort_order)`. Endpoints:
  `/api/admin/placements` GET (all, or by `photo_id`) / POST (photo_id, service_slug, category, pair_id) /
  DELETE. `/api/admin/photos` GET (all) / POST (multipart upload, returns rows with `id`).

## Data model change
Add a location dimension to placements so one placement targets a service page, a location page, or a
global slot:
- `supabase/migrations/006_placement_location.sql`:
  `alter table photo_placements add column if not exists location_slug text;`
  `create index if not exists photo_placements_location_idx on photo_placements(location_slug);`
- Applied live to `ebqdphcszdxtbhjptwcs` (shared project). Nullable, so existing service/global
  placements are unaffected.

## Backend
- **`/api/admin/placements` GET:** also accept `?service_slug=` and `?location_slug=` filters (still
  returns flat placement rows — do **not** change the shape, so `AdminImages` keeps working). The new
  editor joins to photos client-side using `/api/admin/photos`.
- **`/api/admin/placements` PATCH (new):** body `{ id, sort_order?, category? }` → update that placement.
- **`/api/admin/placements` POST:** also accept `location_slug` (default null), and accept an optional
  `sort_order` (default 0) so new items append at the end.
- **`lib/photos.ts`:** add `getLocationPhotos(slug)` mirroring `getServicePhotos` but filtering
  `photo_placements.location_slug = slug` (joined to photos, active only, ordered by `sort_order`).

## Public page (the one live-facing render change, additive)
- `app/areas/[slug]/page.tsx`: fetch `getLocationPhotos(slug)`; if it returns images, render them in the
  same gallery the service page uses (the `Gallery`/`images=` component at `services/[slug]/page.tsx`),
  and use the first as the hero in preference to the shared hero. If empty, keep today's shared hero +
  "photos coming soon". Nothing shows until images are placed, so this cannot regress current pages.

## Admin — new "Page Images" tab
- Add `{ id: 'pageimages', label: 'Page Images' }` to `TABS` in `app/admin/page.tsx` (after `images`),
  import and render `<PageImages authHeaders={authHeaders} />`.
- **`src/components/admin/PageImages.tsx`:**
  - On mount, fetch the page lists: `/api/admin/services` (→ Services) and `/api/admin/locations`
    (→ Areas), plus `/api/admin/photos` (the library).
  - **Page picker:** a `<select>` grouped into Services and Areas; selection = `{ kind: 'service'|'location', slug, name }`.
  - On selection, fetch that page's placements (`?service_slug=` or `?location_slug=`), join to the photo
    library by `photo_id`, sort by `sort_order`, and render **ordered cards**: thumbnail, a category
    `<select>` (hero/work/before/after → PATCH on change), **↑/↓** buttons (swap `sort_order` with the
    neighbour via two PATCH calls, then reload), and **Remove** (DELETE the placement).
  - **Add from library:** a modal showing the library as a searchable grid (search on alt), multi-select;
    on confirm, POST one placement per selected photo for this page (`service_slug` or `location_slug`
    set, `category: 'work'`, `sort_order` = current max + 1…).
  - **Upload & add:** a drop zone that POSTs new files to `/api/admin/photos`, then POSTs a placement for
    each returned photo onto this page.
  - Empty state when a page has no images yet, prompting to add or upload.

## Security / auth
Reuse the existing `authorized(req)` gate on all `/api/admin/*` routes and the `authHeaders()` prop. No
RLS change: public reads use the anon client via `lib/photos.ts` (area gallery), which already reads
`photo_placements`/`photos` on service pages.

## Verification
- `npm run build` green (the deploy gate); lint has the repo's pre-existing `set-state-in-effect`
  baseline — match sibling patterns, add no build errors.
- Apply the migration live and confirm `getLocationPhotos` returns rows for a test location placement
  (verify via Supabase directly, since local run lacks admin/Supabase env).
- Deploy a **preview** on `craigs-projects-413dc045/ticehurst-gardens`; the owner clicks through Page
  Images (pick a thin service like Fencing, add from library, reorder; pick an Area, upload, confirm it
  appears on the public area page in the preview). Promote to production on approval.

## Risks / notes
- Keep `/api/admin/placements` GET shape flat so `AdminImages` is unaffected; only add filters + PATCH.
- Reordering by swapping neighbour `sort_order` is simple and avoids a full reindex; ties (equal
  sort_order) are fine because the join is stable-sorted client-side.
- Area gallery reuses the existing service `Gallery` component; confirm its prop shape during planning.
- Deploy target is `ticehurst-gardens` (craigs-projects team); the `.vercel` link in `~/tgg` was fixed to
  point there. Production is 134 days behind `design-upgrade`; promoting ships that backlog too (already
  flagged and accepted by the owner).
