# Website Admin Improvements Implementation Plan

> **For agentic workers:** implement task-by-task. This repo has **no test runner** (scripts are
> dev/build/start/lint only), so each task ends with `npm run build` + `npm run lint` clean and, where
> the change is visible, a browser check of `/admin` against the live Supabase data. Steps use checkbox
> (`- [ ]`) syntax.

**Goal:** Make the Images admin filterable and placement-aware, and add a Leads tab so contact/quote
submissions are visible and trackable.

**Architecture:** Additive changes to the existing password-gated admin in `~/tgg` (branch
`design-upgrade`). Feature 1 is frontend-only (fetch all placements once, derive badges + filters).
Feature 2 adds one authed API route and one admin component, wired into the existing tab shell. No
database migration.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4, Supabase (service-role client in admin
routes), existing `authorized(req)` / `getServiceClient()` / `authHeaders()` helpers.

## Global Constraints
- Branch: `design-upgrade` in `~/tgg` (the real live-site source; GitHub `main` is a stale skeleton).
- Admin auth: every `/api/admin/*` route calls `authorized(req)` (`Authorization: Bearer ${ADMIN_PASSWORD}`);
  admin components receive `authHeaders(): () => Record<string,string>`.
- Supabase project `ebqdphcszdxtbhjptwcs` (shared with the invoicing app). No migration in this plan.
- Commits use `git -c user.email="272056003+discoverable-dude@users.noreply.github.com" -c user.name="discoverable-dude"`.
- No new-lead alerts. Leads = one combined list with a New/Contacted/Booked + notes tracker.

## File Structure
- Create `src/app/api/admin/leads/route.ts` — GET (merge contacts+quotes) + PATCH (status/notes).
- Create `src/components/admin/AdminLeads.tsx` — combined leads list + tracker + filters.
- Modify `src/app/admin/page.tsx` — add the Leads tab + new-count badge.
- Modify `src/components/admin/AdminImages.tsx` — placements map, card badges, filter bar, summary.

---

### Task 1: Leads API route

**Files:**
- Create: `src/app/api/admin/leads/route.ts`

**Interfaces:**
- Consumes: `authorized`, `getServiceClient` from `@/lib/admin-auth`.
- Produces: `GET /api/admin/leads` → `Lead[]`; `PATCH /api/admin/leads` with body
  `{ type: 'contact'|'quote', id: string, status?: string, notes?: string }` → updated row.
  `Lead = { type, id, created_at, name, phone, email, service, town, message, status, notes,
  estimate_low?, estimate_high?, source? }`.

- [ ] **Step 1: Write the route**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { authorized, getServiceClient } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })

  const [contacts, quotes] = await Promise.all([
    sb.from('contacts').select('*').order('created_at', { ascending: false }),
    sb.from('quotes').select('*').order('created_at', { ascending: false }),
  ])
  if (contacts.error) return NextResponse.json({ error: contacts.error.message }, { status: 500 })
  if (quotes.error) return NextResponse.json({ error: quotes.error.message }, { status: 500 })

  const leads = [
    ...(contacts.data ?? []).map((c) => ({
      type: 'contact' as const,
      id: c.id, created_at: c.created_at,
      name: c.name, phone: c.phone, email: c.email ?? null,
      service: c.service ?? null, town: c.town ?? null, message: c.message ?? null,
      status: c.status ?? 'new', notes: c.notes ?? null,
    })),
    ...(quotes.data ?? []).map((q) => ({
      type: 'quote' as const,
      id: q.id, created_at: q.created_at,
      name: q.name, phone: q.phone, email: q.email ?? null,
      service: q.service ?? null, town: q.town ?? null, message: q.message ?? null,
      status: q.status ?? 'new', notes: q.notes ?? null,
      estimate_low: q.estimate_low ?? null, estimate_high: q.estimate_high ?? null,
      source: q.source ?? null,
    })),
  ].sort((a, b) => (a.created_at < b.created_at ? 1 : -1))

  return NextResponse.json(leads)
}

export async function PATCH(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })

  const { type, id, status, notes } = await req.json()
  if ((type !== 'contact' && type !== 'quote') || !id)
    return NextResponse.json({ error: 'type (contact|quote) and id required' }, { status: 400 })

  const table = type === 'contact' ? 'contacts' : 'quotes'
  const patch: Record<string, unknown> = {}
  if (typeof notes === 'string') patch.notes = notes
  if (typeof status === 'string') {
    patch.status = status
    if (status === 'contacted') patch.contacted_at = new Date().toISOString()
    if (status === 'booked' && type === 'quote') patch.booked_at = new Date().toISOString()
  }
  if (Object.keys(patch).length === 0)
    return NextResponse.json({ error: 'nothing to update' }, { status: 400 })

  const { data, error } = await sb.from(table).update(patch).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
```

- [ ] **Step 2: Build + lint**

```bash
cd ~/tgg && npm run build && npm run lint
```
Expected: clean (the route compiles; no unused vars).

- [ ] **Step 3: Verify GET returns the existing rows** (needs `ADMIN_PASSWORD`; if `.env.local` has it,
  run `npm run dev` in the background, else verify against the deployed preview after Task 5).

```bash
curl -s -H "Authorization: Bearer $ADMIN_PASSWORD" http://localhost:3000/api/admin/leads | head -c 400
```
Expected: a JSON array containing the 1 contact and 1 quote, each with a `type` field.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/leads/route.ts
git commit -m "feat(admin): /api/admin/leads GET (merge contacts+quotes) + PATCH (status/notes)"
```

---

### Task 2: Leads admin tab + component

**Files:**
- Create: `src/components/admin/AdminLeads.tsx`
- Modify: `src/app/admin/page.tsx`

**Interfaces:**
- Consumes: `GET/PATCH /api/admin/leads` (Task 1); `authHeaders` prop (same shape as other admin tabs).
- Produces: `<AdminLeads authHeaders={authHeaders} />`; a `leads` entry in `TABS`.

- [ ] **Step 1: Write `AdminLeads.tsx`**

```tsx
'use client'
import { useState, useEffect, useCallback } from 'react'

type Lead = {
  type: 'contact' | 'quote'
  id: string; created_at: string
  name: string; phone: string; email: string | null
  service: string | null; town: string | null; message: string | null
  status: string; notes: string | null
  estimate_low?: number | null; estimate_high?: number | null; source?: string | null
}

const STATUSES = ['new', 'contacted', 'booked'] as const
const STATUS_STYLE: Record<string, string> = {
  new: 'bg-amber-100 text-amber-800',
  contacted: 'bg-blue-100 text-blue-800',
  booked: 'bg-green-100 text-green-800',
}

export default function AdminLeads({ authHeaders }: { authHeaders: () => Record<string, string> }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [q, setQ] = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/leads', { headers: authHeaders() })
    if (res.ok) setLeads(await res.json())
  }, [authHeaders])
  useEffect(() => { load() }, [load])

  const patch = async (lead: Lead, body: { status?: string; notes?: string }) => {
    setLeads(prev => prev.map(l => (l.id === lead.id && l.type === lead.type ? { ...l, ...body } : l)))
    await fetch('/api/admin/leads', {
      method: 'PATCH', headers: authHeaders(),
      body: JSON.stringify({ type: lead.type, id: lead.id, ...body }),
    })
  }

  const newCount = leads.filter(l => l.status === 'new').length
  const shown = leads.filter(l =>
    (statusFilter === 'all' || l.status === statusFilter) &&
    (typeFilter === 'all' || l.type === typeFilter) &&
    (q === '' || [l.name, l.phone, l.town].filter(Boolean).join(' ').toLowerCase().includes(q.toLowerCase()))
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">Leads</span>
        {newCount > 0 && <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">{newCount} new</span>}
        <div className="flex-1" />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border rounded px-2 py-1 text-sm">
          <option value="all">All types</option>
          <option value="contact">Enquiries</option>
          <option value="quote">Quotes</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded px-2 py-1 text-sm">
          <option value="all">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
        </select>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, phone, town"
          className="border rounded px-2 py-1 text-sm" />
      </div>

      <p className="text-sm text-gray-500">Showing {shown.length} of {leads.length}</p>

      <div className="space-y-3">
        {shown.map(l => (
          <div key={`${l.type}-${l.id}`} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${l.type === 'quote' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                {l.type === 'quote' ? 'Quote' : 'Enquiry'}
              </span>
              <span className="font-semibold">{l.name}</span>
              <span className="text-gray-400 text-xs">{new Date(l.created_at).toLocaleString('en-GB')}</span>
              <div className="flex-1" />
              <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[l.status] ?? 'bg-gray-100'}`}>{l.status}</span>
            </div>
            <div className="text-sm text-gray-700 flex flex-wrap gap-x-4 gap-y-1">
              {l.phone && <a href={`tel:${l.phone}`} className="text-green-700 hover:underline">{l.phone}</a>}
              {l.email && <a href={`mailto:${l.email}`} className="text-green-700 hover:underline">{l.email}</a>}
              {l.service && <span>{l.service}</span>}
              {l.town && <span>{l.town}</span>}
              {l.type === 'quote' && (l.estimate_low != null || l.estimate_high != null) && (
                <span className="font-medium">Est. £{l.estimate_low ?? '?'}–£{l.estimate_high ?? '?'}</span>
              )}
            </div>
            {l.message && <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{l.message}</p>}

            <div className="flex flex-wrap items-center gap-2 mt-3">
              {STATUSES.map(s => (
                <button key={s} onClick={() => patch(l, { status: s })}
                  className={`text-xs px-3 py-1 rounded-full border ${l.status === s ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                  {s[0].toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <textarea defaultValue={l.notes ?? ''} placeholder="Notes"
              onBlur={e => { if (e.target.value !== (l.notes ?? '')) patch(l, { notes: e.target.value }) }}
              rows={2} className="w-full border rounded px-2 py-1 text-sm mt-2" />
          </div>
        ))}
        {shown.length === 0 && <p className="text-gray-500 text-sm">No leads match these filters.</p>}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire the tab into `src/app/admin/page.tsx`**

Add the import next to the other admin imports:
```tsx
import AdminLeads from '@/components/admin/AdminLeads'
```
Add to the `TABS` array (after `images` so it is prominent):
```tsx
  { id: 'leads', label: 'Leads' },
```
Add the render line alongside the other `tab === ...` lines:
```tsx
        {tab === 'leads' && <AdminLeads authHeaders={authHeaders} />}
```
(The `Tab` union type is derived from `TABS`; if it is a hand-written union, add `'leads'` to it.)

- [ ] **Step 3: Build + lint**

```bash
cd ~/tgg && npm run build && npm run lint
```

- [ ] **Step 4: Browser check** (if runnable locally): open `/admin`, enter the password, click **Leads**,
  confirm the enquiry and quote both show, change a status and reload to confirm it persisted, type a note
  and blur, reload to confirm it saved.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/AdminLeads.tsx src/app/admin/page.tsx
git commit -m "feat(admin): Leads tab - combined enquiries+quotes with status/notes tracker"
```

---

### Task 3: Images — placement-aware cards

**Files:**
- Modify: `src/components/admin/AdminImages.tsx`

**Interfaces:**
- Consumes: `GET /api/admin/photos` (all photos), `GET /api/admin/placements` (all placements when no
  `photo_id`), existing `SERVICE_OPTIONS`.
- Produces: a `placementsByPhoto: Map<string, Placement[]>` and enhanced gallery cards. A
  `pageLabel(slug)` helper and the derived badges are reused by Task 4's filters.

- [ ] **Step 1: Load all placements on mount and index them**

In the component add state and a loader, and call it from the existing `useEffect` that calls
`loadExisting`:
```tsx
const [allPlacements, setAllPlacements] = useState<Placement[]>([])
const loadAllPlacements = useCallback(async () => {
  const res = await fetch('/api/admin/placements', { headers: authHeaders() })
  if (res.ok) setAllPlacements(await res.json())
}, [authHeaders])
useEffect(() => { loadExisting(); loadAllPlacements() }, [loadExisting, loadAllPlacements])
```
Add a derived index and a label helper (near the top of the component body):
```tsx
const placementsByPhoto = new Map<string, Placement[]>()
for (const pl of allPlacements) {
  const arr = placementsByPhoto.get(pl.photo_id) ?? []
  arr.push(pl); placementsByPhoto.set(pl.photo_id, arr)
}
const pageLabel = (slug: string | null) =>
  slug ? (SERVICE_OPTIONS.find(o => o.value === slug)?.label ?? slug) : 'Global'
```
After any placement add/remove (`addPlacement`, `removePlacement`) also call `loadAllPlacements()` so
badges stay in sync.

- [ ] **Step 2: Show badges on each "All Images" card**

Replace the existing card body in the "Existing Gallery" map (the `<div className="p-2">…` block) with
placement-aware content:
```tsx
                <div className="p-2 space-y-1">
                  <p className="text-xs text-gray-600 truncate">{p.alt || 'No alt text'}</p>
                  <div className="flex flex-wrap gap-1">
                    {(() => {
                      const pls = placementsByPhoto.get(p.id) ?? []
                      if (pls.length === 0)
                        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Unplaced</span>
                      const paired = pls.some(x => x.pair_id || x.category === 'before' || x.category === 'after')
                      return (
                        <>
                          {pls.map(x => (
                            <span key={x.id} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                              {pageLabel(x.service_slug)} · {x.category}
                            </span>
                          ))}
                          {paired && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Paired</span>}
                        </>
                      )
                    })()}
                    {p.active === false && <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-600">Hidden</span>}
                  </div>
                </div>
```
Note: `Photo` type currently lacks `active`; add `active?: boolean` to the `Photo` type at the top of the
file so `p.active` type-checks.

- [ ] **Step 3: Build + lint**

```bash
cd ~/tgg && npm run build && npm run lint
```

- [ ] **Step 4: Browser check** (if runnable): `/admin` → Images. Each card now shows its page/category
  badges, a "Paired" chip where relevant, and "Unplaced" on orphans, without hovering.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/AdminImages.tsx
git commit -m "feat(admin): show placement/pair/hidden badges on every image card"
```

---

### Task 4: Images — filter bar + summary

**Files:**
- Modify: `src/components/admin/AdminImages.tsx`

**Interfaces:**
- Consumes: `placementsByPhoto`, `pageLabel`, `SERVICE_OPTIONS`, `existing` (from Task 3).
- Produces: filtered gallery driven by `filtered` list + a summary line.

- [ ] **Step 1: Add filter state and derive the filtered list**

Add near the other `useState` hooks:
```tsx
const [pageF, setPageF] = useState('any')      // 'any' | service slug | 'global'
const [catF, setCatF] = useState('any')        // 'any' | category
const [unplacedOnly, setUnplacedOnly] = useState(false)
const [pairedOnly, setPairedOnly] = useState(false)
const [imgQuery, setImgQuery] = useState('')
```
Derive the list to render (place above the return):
```tsx
const filtered = existing.filter(p => {
  const pls = placementsByPhoto.get(p.id) ?? []
  if (unplacedOnly && pls.length > 0) return false
  if (pairedOnly && !pls.some(x => x.pair_id || x.category === 'before' || x.category === 'after')) return false
  if (pageF !== 'any') {
    const match = pageF === 'global'
      ? pls.some(x => !x.service_slug)
      : pls.some(x => x.service_slug === pageF)
    if (!match) return false
  }
  if (catF !== 'any' && !pls.some(x => x.category === catF)) return false
  if (imgQuery && !(p.alt ?? '').toLowerCase().includes(imgQuery.toLowerCase())) return false
  return true
})
const placedCount = existing.filter(p => (placementsByPhoto.get(p.id) ?? []).length > 0).length
const pairCount = new Set(allPlacements.filter(x => x.pair_id).map(x => x.pair_id)).size
```

- [ ] **Step 2: Render the summary + filter bar and use `filtered`**

Replace the "All Images" header block and the `existing.map(...)` grid so the header shows the summary,
a filter bar renders, and the grid maps `filtered` instead of `existing`:
```tsx
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-5 pb-3 space-y-3">
          <h2 className="font-semibold text-lg">
            All Images <span className="text-gray-400 font-normal">({existing.length})</span>
          </h2>
          <p className="text-xs text-gray-500">
            {placedCount} placed · {existing.length - placedCount} unplaced · {pairCount} pair{pairCount === 1 ? '' : 's'}
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            <select value={pageF} onChange={e => setPageF(e.target.value)} className="border rounded px-2 py-1 text-sm">
              <option value="any">Any page</option>
              <option value="global">Global (hero/about)</option>
              {SERVICE_OPTIONS.filter(o => o.value).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={catF} onChange={e => setCatF(e.target.value)} className="border rounded px-2 py-1 text-sm">
              <option value="any">Any category</option>
              {['work', 'before', 'after', 'hero', 'about'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label className="text-sm flex items-center gap-1"><input type="checkbox" checked={unplacedOnly} onChange={e => setUnplacedOnly(e.target.checked)} /> Unplaced only</label>
            <label className="text-sm flex items-center gap-1"><input type="checkbox" checked={pairedOnly} onChange={e => setPairedOnly(e.target.checked)} /> Paired only</label>
            <input value={imgQuery} onChange={e => setImgQuery(e.target.value)} placeholder="Search alt text" className="border rounded px-2 py-1 text-sm" />
            <span className="text-xs text-gray-500">Showing {filtered.length} of {existing.length}</span>
          </div>
        </div>
        {filtered.length === 0 ? (
          <p className="px-5 pb-5 text-gray-500">No images match these filters.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-5 pt-0">
            {filtered.map(p => (
              // ...unchanged card markup from Task 3 (image + badges + hover actions)...
            ))}
          </div>
        )}
      </div>
```
Keep the exact card markup from Task 3 inside the `filtered.map`; only the source list and header change.

- [ ] **Step 3: Build + lint**

```bash
cd ~/tgg && npm run build && npm run lint
```

- [ ] **Step 4: Browser check** (if runnable): filter by a service page, toggle "Unplaced only" to find
  orphans, toggle "Paired only", search alt text; confirm the count updates and the grid narrows.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/AdminImages.tsx
git commit -m "feat(admin): image library filters (page, category, unplaced, paired, search) + summary"
```

---

## Self-Review
- **Spec coverage:** Leads endpoint (T1) ✓; Leads tab + combined list + status/notes tracker + filters +
  new count (T2) ✓; image card placement/pair/hidden badges (T3) ✓; image filters by page/category/
  unplaced/paired + search + summary (T4) ✓. No new-lead alert (correctly absent). No migration
  (correctly absent).
- **Placeholder scan:** none — every step has concrete code. The one "unchanged card markup" reference in
  T4 explicitly points back to the exact block written in T3, not a vague gesture.
- **Type consistency:** `Placement`/`Photo` types already exist in `AdminImages.tsx`; T3 adds
  `active?: boolean` to `Photo`. `Lead` shape is identical between the T1 route and the T2 component.
  `authHeaders` prop signature matches sibling admin components. `pageLabel`/`placementsByPhoto` defined
  in T3 are the exact names used in T4.
- **Verification realism:** no test runner, so build+lint+browser is the gate; local browser checks depend
  on `ADMIN_PASSWORD` in `.env.local` (fall back to the deployed preview if absent).
