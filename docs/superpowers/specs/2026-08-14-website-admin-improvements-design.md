# Website Admin Improvements — Design Spec

**Date:** 2026-08-14
**Repo:** `~/tgg` (branch `design-upgrade`) — the real source of the live marketing site
(`ticehurstgardens.co.uk`). Next.js 16, admin at `/admin`, password-gated, shared Supabase project
`ebqdphcszdxtbhjptwcs`.
**Status:** Design approved (decisions captured below), pending spec review.

## Goal
1. Make the **Images** admin usable at a glance: see where each image is placed, whether it is paired,
   and filter the 83-image library down to what you care about.
2. Add a **Leads** tab so contact-form and quote-tool submissions are visible and trackable, instead of
   sitting invisibly in the database.

## Non-goals
- No redesign of the public marketing pages.
- No new-lead email/alert (explicitly declined; Webhooks tab already exists if wanted later).
- No auth overhaul; reuse the existing admin password gate.

## Approved decisions
- Leads: **one combined list** (contacts + quotes) with a type badge and a type filter.
- Leads: **mini follow-up tracker** — New / Contacted / Booked status plus a note, using columns that
  already exist. Not read-only.
- New-lead alert: **none**.

---

## Current state (verified)
- **Admin shell:** `src/app/admin/page.tsx` holds a `TABS` array and conditionally renders each admin
  component, passing an `authHeaders()` function. Auth is a password prompt; `authHeaders()` returns
  `{ Authorization: 'Bearer <password>' }`.
- **Auth helper:** `src/lib/admin-auth.ts` — `authorized(req)` compares the `Authorization` header to
  `Bearer ${ADMIN_PASSWORD}`; `getServiceClient()` returns a Supabase service-role client.
- **Images:** `src/components/admin/AdminImages.tsx` (377 lines) uploads, tags, and manages placements.
  The "All Images" gallery shows only the picture and truncated alt text; to see where an image is used
  you hover and open a per-image Placements panel. No filtering. 83 photos, 94 placements.
- **Data model** (existing, no changes):
  - `photos(id, created_at, url, alt, service_slug, category, pair_id, sort_order, active)`
  - `photo_placements(id, photo_id, service_slug, category, pair_id, sort_order)` — the source of truth
    for where an image appears.
  - `contacts(id, created_at, name, phone, email, service, town, message, status, notes, contacted_at)`
  - `quotes(id, created_at, service, category, garden_size, property_size, num_windows, num_panels,
    conserv_size, frequency, town, postcode, name, phone, email, message, estimate_low, estimate_high,
    status, source, notes, contacted_at, booked_at)`
- **Endpoints:** `/api/admin/photos` (GET all / POST upload / PATCH / DELETE) and
  `/api/admin/placements` (GET — returns **all** placements when no `photo_id` is passed, or one photo's
  when it is / POST / DELETE). Leads are captured by public `/api/contact` and `/api/quote`, but there is
  **no** admin view for them.

---

## Feature 1 — Images admin improvements (frontend only, no backend change)

On mount, in addition to `/api/admin/photos`, fetch **all** placements once via `/api/admin/placements`
(no `photo_id` param) and build a `Map<photo_id, Placement[]>`. Everything below is derived from that.

**Gallery card, enhanced.** Each card in "All Images" shows, without hovering:
- **Placement badges:** one chip per placement showing a friendly page label (map `service_slug` through
  the existing `SERVICE_OPTIONS`; null slug renders as "Global") plus its category. If the photo has zero
  placements, show a single amber **"Unplaced"** badge.
- **Pair marker:** if any placement has a `pair_id` (or category `before`/`after`), show a **"Pair: <id>"**
  chip.
- **Hidden marker:** if `photos.active === false`, show a grey **"Hidden"** badge.
- Existing hover actions (Placements, Delete) stay.

**Filter + search bar** above the gallery:
- **Page filter:** dropdown of `SERVICE_OPTIONS` + "Global" + "Any page" — shows images with a placement
  on that page.
- **Category filter:** work / before / after / hero / about / Any.
- **Toggles:** "Unplaced only" and "Paired only".
- **Search:** text match on alt.
- **Live count:** "Showing X of 83".

**Summary line** above the bar: total images, how many are placed, how many are unplaced (orphans), and
number of distinct pairs.

**Pairs:** surfaced via the pair chip and the "Paired only" toggle. Not a separate view (YAGNI).

**Refactoring:** `AdminImages.tsx` is already long. Extract the gallery into a `PhotoCard` subcomponent
and a `PhotoFilters` bar (same file or split into `AdminImages/` — pick during planning), so the added
logic does not push the file toward unmaintainable. Upload/tag/placement-modal behaviour is unchanged.

---

## Feature 2 — Leads tab (new component + one new endpoint)

**New endpoint `src/app/api/admin/leads/route.ts`** (mirrors the existing admin routes: `authorized(req)`
guard, `getServiceClient()`):
- **GET:** fetch `contacts` and `quotes`, normalise each to a common shape and merge, newest first:
  `{ type: 'contact' | 'quote', id, created_at, name, phone, email, service, town, message, status,
  notes, estimate_low?, estimate_high?, source? }`. Return the merged array.
- **PATCH:** body `{ type, id, status?, notes? }`. Update the matching table (`contacts` for
  `type='contact'`, `quotes` for `type='quote'`). When `status` becomes `contacted`, set `contacted_at =
  now()` if null; when `status` becomes `booked` (quotes only), set `booked_at = now()`. Return the
  updated row. Reject unknown `type`.

**New component `src/components/admin/AdminLeads.tsx`** (takes `authHeaders`, same as siblings):
- Combined **newest-first list**. Each row: a **type badge** (Enquiry / Quote), name, **tap-to-call**
  phone (`tel:`), email (`mailto:`), service, town, and date. The message is shown (expand/clamp if long).
  Quote rows additionally show the **estimate range** (`estimate_low`–`estimate_high`) and `source`.
- **Status control** per lead: segmented **New / Contacted / Booked** buttons (all three shown for both
  types, for simplicity) that PATCH on click. `contacted_at`/`booked_at` are timestamp side effects only
  where the column exists: `contacts` has `contacted_at` but no `booked_at`, so marking an enquiry
  "Booked" updates `status` alone; `quotes` stamps both. **Notes** textarea saved on blur via PATCH.
- **Filters:** status (All / New / Contacted / Booked), type (All / Enquiries / Quotes), and a text search
  on name / phone / town.
- **Header:** count of leads currently `New`.

**Admin shell change** (`src/app/admin/page.tsx`): add `{ id: 'leads', label: 'Leads' }` to `TABS`,
import and render `<AdminLeads authHeaders={authHeaders} />`, and show a small **new-count badge** on the
Leads tab label. Keep `images` as the default tab.

---

## Security / auth
Reuse the existing password gate. The new `/api/admin/leads` route is guarded by `authorized(req)` exactly
like the other admin routes. No RLS changes: the public insert paths (`/api/contact`, `/api/quote`)
already work, and admin reads go through the service-role client.

## Deploy footprint
- Frontend: `AdminImages` enhancements, new `AdminLeads`, one line in the admin shell.
- Backend: one new route `/api/admin/leads`. **No database migration.**
- Target: the marketing site's Vercel project `prj_n22dyzUPghFpoZqORefq4bfrBl0W` (org
  `team_wYBm3k7d1OIYHJLTiZg03mGr`), branch `design-upgrade`.
- Verification: `npm run build` + lint; run locally with `ADMIN_PASSWORD` set and check `/admin` — the
  Images filters/badges against the real 83 photos, and the Leads list against the existing rows
  (safe to exercise a status change on the one test lead). If `ADMIN_PASSWORD` is not available locally,
  verify on the deployed preview.

## Risks / notes
- **Canonical source drift:** GitHub `main` is a stale skeleton; the live site is branch `design-upgrade`
  in `~/tgg`, deployed via Vercel. Work on `design-upgrade`; confirm the exact deploy trigger (git push
  vs CLI) during planning so the change actually reaches production.
- **`estimate_low/high` and `source`** exist only on quotes; the normaliser leaves them undefined for
  contacts, and the UI only renders them for quote rows.
