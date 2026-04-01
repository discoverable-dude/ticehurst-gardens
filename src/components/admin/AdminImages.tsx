'use client'
import { useState, useCallback, useRef } from 'react'

type Photo = { id: string; url: string; alt: string; service_slug: string | null; category: string; pair_id: string | null }

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

  const loadExisting = useCallback(async () => {
    const res = await fetch('/api/admin/photos', { headers: authHeaders() })
    if (res.ok) setExisting(await res.json())
  }, [authHeaders])

  // Load on mount
  useState(() => { loadExisting() })

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
      // Clean up blob URLs
      pending.forEach(p => URL.revokeObjectURL(p.preview))
      setPending([])
      // Show uploaded photos for tagging
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
    await fetch('/api/admin/photos', {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({
        id: photo.id,
        alt: photo.alt,
        service_slug: photo.service_slug,
        category: photo.category,
        pair_id: photo.pair_id,
      }),
    })
    setUploaded(prev => prev.map(p => p.id === photo.id ? { ...p, dirty: false } : p))
  }

  const saveAll = async () => {
    const dirty = uploaded.filter(p => p.dirty)
    await Promise.all(dirty.map(savePhoto))
  }

  const deletePhoto = async (id: string) => {
    await fetch('/api/admin/photos', {
      method: 'DELETE',
      headers: authHeaders(),
      body: JSON.stringify({ id }),
    })
    setExisting(prev => prev.filter(p => p.id !== id))
    setUploaded(prev => prev.filter(p => p.id !== id))
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
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">{p.alt || 'No alt text'}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {p.service_slug || p.category}
                    {p.pair_id && <span className="ml-1 bg-blue-50 px-1 rounded">{p.pair_id}</span>}
                  </p>
                </div>
                <button onClick={() => deletePhoto(p.id)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
