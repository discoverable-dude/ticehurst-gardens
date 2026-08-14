'use client'
import { useState, useCallback, useRef, useEffect } from 'react'

type Photo = { id: string; url: string; alt: string; service_slug: string | null; category: string; pair_id: string | null; active?: boolean }
type Placement = { id: string; photo_id: string; service_slug: string | null; category: string; pair_id: string | null; sort_order: number }

const SERVICE_OPTIONS = [
  { value: '', label: 'None (hero/about)' },
  { value: 'lawn-care', label: 'Lawn Care' },
  { value: 'garden-maintenance', label: 'Garden Maintenance' },
  { value: 'hedge-tree-care', label: 'Hedge & Tree Care' },
  { value: 'garden-clearances', label: 'Garden Clearances' },
  { value: 'borders-beds', label: 'Border & Bed Design' },
  { value: 'fencing', label: 'Fencing' },
  { value: 'window-cleaning', label: 'Window Cleaning' },
  { value: 'gutter-clearing', label: 'Gutter Clearing' },
  { value: 'solar-panel-cleaning', label: 'Solar Panel Cleaning' },
  { value: 'jet-washing', label: 'Jet Washing' },
  { value: 'building-cleaning', label: 'Building & Cladding' },
  { value: 'conservatory-cleaning', label: 'Conservatory Cleaning' },
]

type PendingFile = { file: File; preview: string }
type UploadedPhoto = Photo & { dirty?: boolean }

export default function AdminImages({ authHeaders }: { authHeaders: () => Record<string, string> }) {
  const [pending, setPending] = useState<PendingFile[]>([])
  const [uploaded, setUploaded] = useState<UploadedPhoto[]>([])
  const [existing, setExisting] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  // Placement management
  const [placementsFor, setPlacementsFor] = useState<Photo | null>(null)
  const [placements, setPlacements] = useState<Placement[]>([])
  const [newPlacement, setNewPlacement] = useState({ service_slug: '', category: 'work', pair_id: '' })

  const [allPlacements, setAllPlacements] = useState<Placement[]>([])

  const loadExisting = useCallback(async () => {
    const res = await fetch('/api/admin/photos', { headers: authHeaders() })
    if (res.ok) setExisting(await res.json())
  }, [authHeaders])

  // All placements across every photo (no photo_id param returns them all), so
  // the gallery can show where each image is used without opening each one.
  const loadAllPlacements = useCallback(async () => {
    const res = await fetch('/api/admin/placements', { headers: authHeaders() })
    if (res.ok) setAllPlacements(await res.json())
  }, [authHeaders])

  useEffect(() => { loadExisting(); loadAllPlacements() }, [loadExisting, loadAllPlacements])

  const loadPlacements = useCallback(async (photoId: string) => {
    const res = await fetch(`/api/admin/placements?photo_id=${photoId}`, { headers: authHeaders() })
    if (res.ok) setPlacements(await res.json())
  }, [authHeaders])

  const openPlacements = (photo: Photo) => {
    setPlacementsFor(photo)
    loadPlacements(photo.id)
    setNewPlacement({ service_slug: '', category: 'work', pair_id: '' })
  }

  const addPlacement = async () => {
    if (!placementsFor) return
    const res = await fetch('/api/admin/placements', {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({
        photo_id: placementsFor.id,
        service_slug: newPlacement.service_slug || null,
        category: newPlacement.category,
        pair_id: newPlacement.pair_id || null,
      }),
    })
    if (res.ok) {
      loadPlacements(placementsFor.id)
      loadAllPlacements()
      setNewPlacement({ service_slug: '', category: 'work', pair_id: '' })
    }
  }

  const removePlacement = async (id: string) => {
    await fetch('/api/admin/placements', {
      method: 'DELETE', headers: authHeaders(),
      body: JSON.stringify({ id }),
    })
    if (placementsFor) loadPlacements(placementsFor.id)
    loadAllPlacements()
  }

  const addFiles = (files: FileList | File[]) => {
    const newPending = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map(file => ({ file, preview: URL.createObjectURL(file) }))
    setPending(prev => [...prev, ...newPending])
  }

  const removePending = (idx: number) => {
    setPending(prev => {
      URL.revokeObjectURL(prev[idx].preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const uploadAll = async () => {
    if (pending.length === 0) return
    setUploading(true)
    setError('')
    setUploadProgress(`Uploading ${pending.length} files...`)

    const form = new FormData()
    pending.forEach((p, i) => form.append(`file_${i}`, p.file))

    const res = await fetch('/api/admin/photos', {
      method: 'POST',
      headers: { Authorization: authHeaders().Authorization },
      body: form,
    })

    setUploading(false)
    setUploadProgress('')

    if (res.ok) {
      const results = await res.json()
      pending.forEach(p => URL.revokeObjectURL(p.preview))
      setPending([])
      const photos = results.filter((r: Record<string, unknown>) => r.id) as UploadedPhoto[]
      setUploaded(photos)
      loadExisting()
    } else {
      const body = await res.json().catch(() => null)
      setError(body?.error || 'Upload failed')
    }
  }

  const updatePhotoField = (id: string, field: string, value: string) => {
    setUploaded(prev => prev.map(p =>
      p.id === id ? { ...p, [field]: value || null, dirty: true } : p
    ))
  }

  const savePhoto = async (photo: UploadedPhoto) => {
    // Save metadata on the photo
    await fetch('/api/admin/photos', {
      method: 'PATCH', headers: authHeaders(),
      body: JSON.stringify({ id: photo.id, alt: photo.alt }),
    })
    // Create a placement for the chosen service/category
    if (photo.service_slug || photo.category !== 'work') {
      await fetch('/api/admin/placements', {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({
          photo_id: photo.id,
          service_slug: photo.service_slug,
          category: photo.category,
          pair_id: photo.pair_id,
        }),
      })
    }
    setUploaded(prev => prev.map(p => p.id === photo.id ? { ...p, dirty: false } : p))
  }

  const saveAll = async () => {
    const dirty = uploaded.filter(p => p.dirty)
    await Promise.all(dirty.map(savePhoto))
  }

  const deletePhoto = async (id: string) => {
    await fetch('/api/admin/photos', {
      method: 'DELETE', headers: authHeaders(),
      body: JSON.stringify({ id }),
    })
    setExisting(prev => prev.filter(p => p.id !== id))
    setUploaded(prev => prev.filter(p => p.id !== id))
    if (placementsFor?.id === id) setPlacementsFor(null)
  }

  // Index placements by photo, and a friendly page label, for the gallery badges.
  const placementsByPhoto = new Map<string, Placement[]>()
  for (const pl of allPlacements) {
    const arr = placementsByPhoto.get(pl.photo_id) ?? []
    arr.push(pl); placementsByPhoto.set(pl.photo_id, arr)
  }
  const pageLabel = (slug: string | null) =>
    slug ? (SERVICE_OPTIONS.find(o => o.value === slug)?.label ?? slug) : 'Global'

  // Placement management modal
  if (placementsFor) {
    return (
      <div className="space-y-4">
        <button onClick={() => setPlacementsFor(null)} className="text-gray-600 text-sm hover:underline">&larr; Back to all images</button>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex gap-4 items-start mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={placementsFor.url} alt={placementsFor.alt} className="w-32 h-24 object-cover rounded" />
            <div>
              <h2 className="font-semibold text-lg">Manage Placements</h2>
              <p className="text-sm text-gray-500">{placementsFor.alt || 'No alt text'}</p>
              <p className="text-xs text-gray-400 mt-1">This image can appear in multiple places across the site.</p>
            </div>
          </div>

          {/* Existing placements */}
          <h3 className="font-medium text-sm mb-2">Current placements ({placements.length})</h3>
          {placements.length === 0 ? (
            <p className="text-gray-500 text-sm mb-4">No placements yet — this image isn&apos;t shown anywhere on the site.</p>
          ) : (
            <ul className="divide-y mb-4">
              {placements.map(p => (
                <li key={p.id} className="py-2 flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">{p.category}</span>
                    {p.service_slug && <span className="ml-2 text-gray-600">{p.service_slug}</span>}
                    {!p.service_slug && <span className="ml-2 text-gray-400">global</span>}
                    {p.pair_id && <span className="ml-2 text-blue-600 text-xs">pair: {p.pair_id}</span>}
                  </div>
                  <button onClick={() => removePlacement(p.id)} className="text-red-600 text-xs hover:underline">Remove</button>
                </li>
              ))}
            </ul>
          )}

          {/* Add new placement */}
          <h3 className="font-medium text-sm mb-2">Add placement</h3>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select value={newPlacement.service_slug}
              onChange={e => setNewPlacement({ ...newPlacement, service_slug: e.target.value })}
              className="border rounded px-2 py-1.5 text-sm">
              {SERVICE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={newPlacement.category}
              onChange={e => setNewPlacement({ ...newPlacement, category: e.target.value })}
              className="border rounded px-2 py-1.5 text-sm">
              <option value="work">Work photo</option>
              <option value="before">Before</option>
              <option value="after">After</option>
              <option value="hero">Hero background</option>
              <option value="about">About section</option>
            </select>
          </div>
          {(newPlacement.category === 'before' || newPlacement.category === 'after') && (
            <input type="text" placeholder="Pair ID (e.g. lawn-1)" value={newPlacement.pair_id}
              onChange={e => setNewPlacement({ ...newPlacement, pair_id: e.target.value })}
              className="w-full border rounded px-2 py-1.5 text-sm mb-2" />
          )}
          <button onClick={addPlacement}
            className="bg-green-700 text-white px-4 py-1.5 rounded text-sm hover:bg-green-800">
            Add Placement
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragOver ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = '' }}
        />
        <p className="text-gray-600 font-medium">
          {dragOver ? 'Drop images here' : 'Drag & drop images here, or click to browse'}
        </p>
        <p className="text-gray-400 text-sm mt-1">Supports JPG, PNG, WebP</p>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Pending Files */}
      {pending.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">{pending.length} file{pending.length > 1 ? 's' : ''} ready</h2>
            <button onClick={uploadAll} disabled={uploading}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-50 text-sm font-medium">
              {uploading ? uploadProgress : 'Upload All'}
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {pending.map((p, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt="" className="w-full aspect-square object-cover rounded" />
                <button onClick={() => removePending(i)}
                  className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Uploaded — Tag Each */}
      {uploaded.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Tag your uploads</h2>
            <button onClick={saveAll}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 text-sm font-medium">
              Save All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {uploaded.map(photo => (
              <div key={photo.id} className={`border rounded-lg overflow-hidden ${photo.dirty ? 'border-amber-400' : 'border-gray-200'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.alt} className="w-full aspect-[4/3] object-cover" />
                <div className="p-3 space-y-2">
                  <input type="text" placeholder="Alt text" value={photo.alt}
                    onChange={e => updatePhotoField(photo.id, 'alt', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm" />
                  <select value={photo.service_slug || ''}
                    onChange={e => updatePhotoField(photo.id, 'service_slug', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm">
                    {SERVICE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <select value={photo.category}
                    onChange={e => updatePhotoField(photo.id, 'category', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm">
                    <option value="work">Work photo</option>
                    <option value="before">Before</option>
                    <option value="after">After</option>
                    <option value="hero">Hero background</option>
                    <option value="about">About section</option>
                  </select>
                  {(photo.category === 'before' || photo.category === 'after') && (
                    <input type="text" placeholder="Pair ID (e.g. lawn-1)" value={photo.pair_id || ''}
                      onChange={e => updatePhotoField(photo.id, 'pair_id', e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm" />
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => savePhoto(photo)}
                      className="bg-green-700 text-white px-3 py-1 rounded text-xs hover:bg-green-800">Save</button>
                    <button onClick={() => deletePhoto(photo.id)}
                      className="text-red-600 text-xs hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Gallery */}
      <div className="bg-white rounded-lg shadow-md">
        <h2 className="font-semibold text-lg p-5 pb-3">
          All Images <span className="text-gray-400 font-normal">({existing.length})</span>
        </h2>
        {existing.length === 0 ? (
          <p className="px-5 pb-5 text-gray-500">No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-5 pt-0">
            {existing.map(p => (
              <div key={p.id} className="border rounded-lg overflow-hidden group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.alt} className="w-full aspect-[4/3] object-cover" />
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
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openPlacements(p)}
                    className="bg-white text-gray-800 text-xs px-3 py-1.5 rounded font-medium hover:bg-gray-100">
                    Placements
                  </button>
                  <button onClick={() => deletePhoto(p.id)}
                    className="bg-red-600 text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
