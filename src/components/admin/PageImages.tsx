'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

type Svc = { slug: string; name: string }
type Loc = { slug: string; name: string }
type LibPhoto = { id: string; url: string; alt: string }
type Placement = {
  id: string; photo_id: string
  service_slug: string | null; location_slug: string | null
  category: string; sort_order: number
}
type Item = Placement & { photo: LibPhoto }
type Sel = { kind: 'service' | 'location'; slug: string; name: string }

const CATEGORIES = ['work', 'before', 'after', 'hero']

export default function PageImages({ authHeaders }: { authHeaders: () => Record<string, string> }) {
  const [services, setServices] = useState<Svc[]>([])
  const [locations, setLocations] = useState<Loc[]>([])
  const [photos, setPhotos] = useState<LibPhoto[]>([])
  const [sel, setSel] = useState<Sel | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [showLibrary, setShowLibrary] = useState(false)
  const [librarySearch, setLibrarySearch] = useState('')
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const loadLists = useCallback(async () => {
    const [s, l, p] = await Promise.all([
      fetch('/api/admin/services', { headers: authHeaders() }),
      fetch('/api/admin/locations', { headers: authHeaders() }),
      fetch('/api/admin/photos', { headers: authHeaders() }),
    ])
    if (s.ok) setServices(await s.json())
    if (l.ok) setLocations(await l.json())
    if (p.ok) setPhotos(await p.json())
  }, [authHeaders])
  useEffect(() => { loadLists() }, [loadLists])

  const pageKey = useCallback(
    (s: Sel) => (s.kind === 'service' ? { service_slug: s.slug } : { location_slug: s.slug }),
    []
  )

  const loadItems = useCallback(async (s: Sel | null) => {
    if (!s) { setItems([]); return }
    const param = s.kind === 'service' ? `service_slug=${s.slug}` : `location_slug=${s.slug}`
    const res = await fetch(`/api/admin/placements?${param}`, { headers: authHeaders() })
    if (!res.ok) { setItems([]); return }
    const placements: Placement[] = await res.json()
    const byId = new Map(photos.map(p => [p.id, p]))
    const joined = placements
      .map(pl => ({ ...pl, photo: byId.get(pl.photo_id) }))
      .filter((x): x is Item => !!x.photo)
      .sort((a, b) => a.sort_order - b.sort_order)
    setItems(joined)
  }, [authHeaders, photos])

  useEffect(() => { loadItems(sel) }, [sel, loadItems])

  const setCategory = async (item: Item, category: string) => {
    setItems(prev => prev.map(i => (i.id === item.id ? { ...i, category } : i)))
    await fetch('/api/admin/placements', {
      method: 'PATCH', headers: authHeaders(),
      body: JSON.stringify({ id: item.id, category }),
    })
  }

  const move = async (index: number, dir: -1 | 1) => {
    const j = index + dir
    if (j < 0 || j >= items.length) return
    const reordered = [...items]
    ;[reordered[index], reordered[j]] = [reordered[j], reordered[index]]
    setItems(reordered)
    await Promise.all(
      reordered
        .map((it, i) => (it.sort_order !== i
          ? fetch('/api/admin/placements', {
              method: 'PATCH', headers: authHeaders(),
              body: JSON.stringify({ id: it.id, sort_order: i }),
            })
          : null))
        .filter(Boolean) as Promise<Response>[]
    )
    loadItems(sel)
  }

  const remove = async (item: Item) => {
    setItems(prev => prev.filter(i => i.id !== item.id))
    await fetch('/api/admin/placements', {
      method: 'DELETE', headers: authHeaders(),
      body: JSON.stringify({ id: item.id }),
    })
  }

  const addPicked = async () => {
    if (!sel || picked.size === 0) return
    const base = items.length
    const ids = [...picked]
    await Promise.all(ids.map((photo_id, k) =>
      fetch('/api/admin/placements', {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ photo_id, ...pageKey(sel), category: 'work', sort_order: base + k }),
      })
    ))
    setPicked(new Set())
    setShowLibrary(false)
    loadItems(sel)
  }

  const uploadAndAdd = async (files: FileList | File[]) => {
    if (!sel) return
    const list = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (list.length === 0) return
    setUploading(true)
    const form = new FormData()
    list.forEach((f, i) => form.append(`file_${i}`, f))
    const res = await fetch('/api/admin/photos', {
      method: 'POST',
      headers: { Authorization: authHeaders().Authorization },
      body: form,
    })
    if (res.ok) {
      const results = await res.json()
      const created = (results as LibPhoto[]).filter(r => r.id)
      const base = items.length
      await Promise.all(created.map((p, k) =>
        fetch('/api/admin/placements', {
          method: 'POST', headers: authHeaders(),
          body: JSON.stringify({ photo_id: p.id, ...pageKey(sel), category: 'work', sort_order: base + k }),
        })
      ))
      await loadLists()
      loadItems(sel)
    }
    setUploading(false)
  }

  const onSelectPage = (value: string) => {
    if (!value) { setSel(null); return }
    const [kind, slug] = value.split(':')
    if (kind === 'service') {
      const s = services.find(x => x.slug === slug)
      if (s) setSel({ kind: 'service', slug, name: s.name })
    } else {
      const l = locations.find(x => x.slug === slug)
      if (l) setSel({ kind: 'location', slug, name: l.name })
    }
  }

  const libraryFiltered = photos.filter(p =>
    librarySearch === '' || (p.alt ?? '').toLowerCase().includes(librarySearch.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Page picker */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="font-semibold">Page</label>
        <select
          value={sel ? `${sel.kind}:${sel.slug}` : ''}
          onChange={e => onSelectPage(e.target.value)}
          className="border rounded px-2 py-1.5 text-sm min-w-64"
        >
          <option value="">Choose a page…</option>
          <optgroup label="Services">
            {services.map(s => <option key={s.slug} value={`service:${s.slug}`}>{s.name}</option>)}
          </optgroup>
          <optgroup label="Areas">
            {locations.map(l => <option key={l.slug} value={`location:${l.slug}`}>{l.name}</option>)}
          </optgroup>
        </select>
        {sel && <span className="text-xs text-gray-500">{items.length} image{items.length === 1 ? '' : 's'} on /{sel.kind === 'service' ? 'services' : 'areas'}/{sel.slug}/</span>}
      </div>

      {!sel && <p className="text-gray-500 text-sm">Pick a service or area page to manage its images.</p>}

      {sel && (
        <>
          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setPicked(new Set()); setShowLibrary(true) }}
              className="bg-green-700 text-white px-4 py-1.5 rounded text-sm hover:bg-green-800">
              Add from library
            </button>
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="border px-4 py-1.5 rounded text-sm hover:bg-gray-50 disabled:opacity-50">
              {uploading ? 'Uploading…' : 'Upload & add'}
            </button>
            <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
              onChange={e => { if (e.target.files) uploadAndAdd(e.target.files); e.target.value = '' }} />
          </div>

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center text-sm transition-colors ${dragOver ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); uploadAndAdd(e.dataTransfer.files) }}
          >
            {dragOver ? 'Drop to upload onto this page' : 'or drag images here to upload straight onto this page'}
          </div>

          {/* Current images, ordered */}
          {items.length === 0 ? (
            <p className="text-gray-500 text-sm">No images on this page yet. Add from the library or upload above.</p>
          ) : (
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={item.id} className="bg-white border rounded-lg p-2 flex items-center gap-3">
                  <span className="text-gray-400 text-xs w-5 text-center">{i + 1}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.photo.url} alt={item.photo.alt} className="w-20 h-16 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 truncate">{item.photo.alt || 'No alt text'}</p>
                    <select value={item.category} onChange={e => setCategory(item, e.target.value)}
                      className="border rounded px-2 py-1 text-xs mt-1">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => move(i, -1)} disabled={i === 0}
                      className="text-xs px-2 py-0.5 border rounded disabled:opacity-30 hover:bg-gray-50">↑</button>
                    <button onClick={() => move(i, 1)} disabled={i === items.length - 1}
                      className="text-xs px-2 py-0.5 border rounded disabled:opacity-30 hover:bg-gray-50">↓</button>
                  </div>
                  <button onClick={() => remove(item)} className="text-red-600 text-xs hover:underline">Remove</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add-from-library modal */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowLibrary(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center gap-3">
              <h3 className="font-semibold">Add from library</h3>
              <input value={librarySearch} onChange={e => setLibrarySearch(e.target.value)} placeholder="Search alt text"
                className="border rounded px-2 py-1 text-sm flex-1" />
              <span className="text-xs text-gray-500">{picked.size} selected</span>
            </div>
            <div className="p-4 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-2">
              {libraryFiltered.map(p => {
                const on = picked.has(p.id)
                return (
                  <button key={p.id} type="button"
                    onClick={() => setPicked(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n })}
                    className={`relative rounded overflow-hidden border-2 ${on ? 'border-green-600' : 'border-transparent'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={p.alt} className="w-full aspect-square object-cover" />
                    {on && <span className="absolute top-1 right-1 bg-green-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">✓</span>}
                  </button>
                )
              })}
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button onClick={() => setShowLibrary(false)} className="border px-4 py-1.5 rounded text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={addPicked} disabled={picked.size === 0}
                className="bg-green-700 text-white px-4 py-1.5 rounded text-sm hover:bg-green-800 disabled:opacity-50">
                Add {picked.size > 0 ? picked.size : ''} to page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
