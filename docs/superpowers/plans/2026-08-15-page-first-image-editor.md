# Page-First Image Editor Implementation Plan

> **For agentic workers:** no test runner in this repo — each task ends with `npm run build` green
> (deploy gate) and, where relevant, a live Supabase check. Steps use checkbox (`- [ ]`) syntax.

**Goal:** A "Page Images" admin tab to curate a service/location page's images (add from library or
upload, remove, reorder, set category), plus per-location galleries on the public area pages.

**Architecture:** Add `photo_placements.location_slug`; extend the placements API (filters + PATCH +
location_slug on POST); add `getLocationPhotos`; render the gallery on area pages; new `PageImages`
admin component wired into the tab shell. Reuses existing auth + endpoints.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, Supabase service-role admin client.

## Global Constraints
- Branch off `design-upgrade` in `~/tgg`; deploy target `craigs-projects-413dc045/ticehurst-gardens`.
- Admin auth: `authorized(req)` + `authHeaders()`. Supabase project `ebqdphcszdxtbhjptwcs`.
- Keep `/api/admin/placements` GET shape flat (AdminImages depends on it) — only add filters + PATCH.
- Commits: `git -c user.email="272056003+discoverable-dude@users.noreply.github.com" -c user.name="discoverable-dude"`.
- `~/tgg/AGENTS.md`: Next 16 has breaking changes — mirror existing patterns, keep build green, no new deps.

---

### Task 1: Migration — placement location dimension

**Files:** Create `supabase/migrations/006_placement_location.sql`

- [ ] **Step 1: Write the migration**
```sql
alter table photo_placements add column if not exists location_slug text;
create index if not exists photo_placements_location_idx on photo_placements(location_slug);
```
- [ ] **Step 2: Apply live** via the Supabase Management API (project `ebqdphcszdxtbhjptwcs`).
- [ ] **Step 3: Verify**: `select column_name from information_schema.columns where table_name='photo_placements' and column_name='location_slug';` → 1 row.
- [ ] **Step 4: Commit** `git add supabase/migrations/006_placement_location.sql && git commit -m "feat(db): photo_placements.location_slug for per-location image galleries"`

---

### Task 2: Backend — placements filters/PATCH + getLocationPhotos

**Files:** Modify `src/app/api/admin/placements/route.ts`, `src/lib/photos.ts`

**Interfaces:**
- Produces: `GET /api/admin/placements?service_slug=|location_slug=|photo_id=` (flat rows);
  `PATCH /api/admin/placements {id, sort_order?, category?}`; `POST` accepts `location_slug`, `sort_order`.
  `getLocationPhotos(slug): Promise<Photo[]>`.

- [ ] **Step 1: Extend GET filters** — after the existing `photoId` handling, also read
  `service_slug`/`location_slug` and apply `.eq(...)` when present:
```ts
  const serviceSlug = req.nextUrl.searchParams.get('service_slug')
  const locationSlug = req.nextUrl.searchParams.get('location_slug')
  if (photoId) query = query.eq('photo_id', photoId)
  if (serviceSlug !== null) query = query.eq('service_slug', serviceSlug)
  if (locationSlug !== null) query = query.eq('location_slug', locationSlug)
```
- [ ] **Step 2: Accept location_slug + sort_order in POST** — extend the insert body:
```ts
  const { photo_id, service_slug, location_slug, category, pair_id, sort_order } = body
  // ...insert:
  //   location_slug: location_slug || null,
  //   sort_order: typeof sort_order === 'number' ? sort_order : 0,
```
- [ ] **Step 3: Add PATCH** to the route:
```ts
export async function PATCH(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const { id, sort_order, category } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const patch: Record<string, unknown> = {}
  if (typeof sort_order === 'number') patch.sort_order = sort_order
  if (typeof category === 'string') patch.category = category
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'nothing to update' }, { status: 400 })
  const { data, error } = await sb.from('photo_placements').update(patch).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
```
- [ ] **Step 4: Add `getLocationPhotos`** to `src/lib/photos.ts` (mirror `getServicePhotos`, swap
  `.eq('service_slug', slug)` for `.eq('location_slug', slug)`; keep the placements-join + active filter +
  `order('sort_order')`; no fallback needed since locations had no direct-photo path):
```ts
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
        id: photo.id as string, created_at: '', url: photo.url as string,
        alt: (photo.alt as string) || '', service_slug: null,
        category: p.category as Photo['category'], pair_id: (p.pair_id as string) || null,
        sort_order: p.sort_order as number, active: true,
      }
    })
}
```
- [ ] **Step 5: Build** `npm run build` → green.
- [ ] **Step 6: Verify PATCH/filter logic against live data** — insert a temp location placement via
  Management API, confirm a `location_slug` filter query returns it, then delete it.
- [ ] **Step 7: Commit** `git add src/app/api/admin/placements/route.ts src/lib/photos.ts && git commit -m "feat(admin): placements filters + PATCH + getLocationPhotos"`

---

### Task 3: Public area page renders its gallery

**Files:** Modify `src/app/areas/[slug]/page.tsx`

**Interfaces:** Consumes `getLocationPhotos` (Task 2); the `Gallery` component already used by
`services/[slug]/page.tsx` (confirm its import + prop name by reading that file first).

- [ ] **Step 1: Read `services/[slug]/page.tsx`** to copy the exact gallery import and `images=` prop usage.
- [ ] **Step 2: In the area page**, fetch `const locationPhotos = await getLocationPhotos(slug)` and:
  - if `locationPhotos.length`, prefer `locationPhotos.find(p => p.category === 'work') || locationPhotos[0]`
    as the hero (fall back to the existing shared hero when empty);
  - render the same `Gallery` with `images={locationPhotos}` in place of the "photos coming soon" block
    when `locationPhotos.length > 0`, else keep the current "photos coming soon" copy.
- [ ] **Step 3: Build** `npm run build` → green (area routes still prerender).
- [ ] **Step 4: Commit** `git add src/app/areas/[slug]/page.tsx && git commit -m "feat: area pages render their own image gallery when placed"`

---

### Task 4: PageImages admin component + tab

**Files:** Create `src/components/admin/PageImages.tsx`; Modify `src/app/admin/page.tsx`

**Interfaces:** Consumes `/api/admin/services`, `/api/admin/locations`, `/api/admin/photos`,
`/api/admin/placements` (GET filters + POST + PATCH + DELETE from Task 2); `authHeaders` prop.

- [ ] **Step 1: Write `PageImages.tsx`** with:
  - state: `services`, `locations`, `photos` (library), `sel` (`{kind,slug,name}|null`), `items`
    (placements for sel joined to photos, sorted by sort_order), `showLibrary`, `librarySearch`.
  - loaders (useCallback + effect, matching sibling pattern): fetch services/locations/photos on mount;
    `loadItems(sel)` fetches `?service_slug=`/`?location_slug=` placements and joins to `photos` by id.
  - page picker `<select>` with `<optgroup label="Services">` and `<optgroup label="Areas">`.
  - item card: thumbnail; category `<select>` → `PATCH {id, category}` then update local; ↑/↓ → swap
    `sort_order` with neighbour via two `PATCH` calls then `loadItems`; Remove → `DELETE {id}` then
    `loadItems`.
  - "Add from library" button → modal grid of `photos` filtered by `librarySearch`, click to toggle a
    selection set; Confirm → for each selected, `POST {photo_id, [service_slug|location_slug], category:'work', sort_order: base+i}` then `loadItems`.
  - "Upload & add" drop zone → `POST /api/admin/photos` (FormData `file_0..n`, Authorization only) →
    for each returned photo `POST` a placement onto this page → refresh `photos` + `loadItems`.
  - the placement key for the current page: `sel.kind === 'service' ? { service_slug: sel.slug } : { location_slug: sel.slug }`.
  - empty state when `sel` set but `items` empty.
- [ ] **Step 2: Wire the tab** in `src/app/admin/page.tsx`: `import PageImages from '@/components/admin/PageImages'`;
  add `{ id: 'pageimages', label: 'Page Images' }` after the `images` entry; add
  `{tab === 'pageimages' && <PageImages authHeaders={authHeaders} />}`.
- [ ] **Step 3: Build + lint** `npm run build` green; lint adds only the same `set-state-in-effect`
  pattern as siblings, no build errors.
- [ ] **Step 4: Commit** `git add src/components/admin/PageImages.tsx src/app/admin/page.tsx && git commit -m "feat(admin): Page Images tab - page-first image curation (add/upload/remove/reorder)"`

---

### Task 5: Deploy preview + verify
- [ ] Deploy a preview to `ticehurst-gardens` (`vercel deploy --scope craigs-projects-413dc045`).
- [ ] Confirm the preview builds Ready and `/admin` serves; hand the owner the URL to click through Page
  Images (pick Fencing → add from library → reorder; pick an Area → upload → confirm it renders on the
  public area page in the preview). Promote to production on approval.

## Self-Review
- **Spec coverage:** location_slug (T1) ✓; filters/PATCH/getLocationPhotos (T2) ✓; area gallery (T3) ✓;
  Page Images editor with library+upload+remove+reorder+category (T4) ✓; deploy/verify (T5) ✓.
- **Placeholder scan:** none — every code step is concrete; T3 step 1 / T4 rely on reading the exact
  `Gallery` prop first, which is a read, not a vague gesture.
- **Type consistency:** `location_slug` name consistent across migration/route/photos/component; PATCH
  body `{id, sort_order?, category?}` identical in route + component; `getLocationPhotos` returns the same
  `Photo` type the pages already consume.
