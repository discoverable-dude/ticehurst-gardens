'use client'
import { useState, useEffect, useCallback } from 'react'

type Webhook = { id: string; url: string; label: string | null; event: string; active: boolean; created_at: string }
type Photo = { id: string; url: string; alt: string; service_slug: string | null; category: string; pair_id: string | null; created_at: string }

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

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<'webhooks' | 'images'>('webhooks')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Webhook state
  const [hooks, setHooks] = useState<Webhook[]>([])
  const [hookUrl, setHookUrl] = useState('')
  const [hookLabel, setHookLabel] = useState('')
  const [hookEvent, setHookEvent] = useState('all')

  // Photo state
  const [photos, setPhotos] = useState<Photo[]>([])
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoAlt, setPhotoAlt] = useState('')
  const [photoService, setPhotoService] = useState('')
  const [photoCategory, setPhotoCategory] = useState('work')
  const [photoPairId, setPhotoPairId] = useState('')

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${password}`,
  }), [password])

  const authHeadersRaw = useCallback(() => ({
    Authorization: `Bearer ${password}`,
  }), [password])

  // Load functions
  const loadHooks = useCallback(async () => {
    const res = await fetch('/api/admin/webhooks', { headers: authHeaders() })
    if (!res.ok) { setAuthed(false); setError('Session expired'); return }
    setHooks(await res.json())
  }, [authHeaders])

  const loadPhotos = useCallback(async () => {
    const res = await fetch('/api/admin/photos', { headers: authHeaders() })
    if (res.ok) setPhotos(await res.json())
  }, [authHeaders])

  // Login
  const login = async () => {
    setError('')
    setLoading(true)
    const res = await fetch('/api/admin/webhooks', { headers: authHeaders() })
    setLoading(false)
    if (res.ok) {
      setAuthed(true)
      setHooks(await res.json())
    } else {
      const body = await res.json().catch(() => null)
      setError(res.status === 401 ? 'Invalid password' : body?.error || `Error ${res.status}`)
    }
  }

  useEffect(() => {
    if (authed) { loadHooks(); loadPhotos() }
  }, [authed, loadHooks, loadPhotos])

  // Webhook actions
  const addHook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hookUrl) return
    setLoading(true)
    const res = await fetch('/api/admin/webhooks', {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ url: hookUrl, label: hookLabel, event: hookEvent }),
    })
    setLoading(false)
    if (res.ok) { setHookUrl(''); setHookLabel(''); loadHooks() }
    else setError((await res.json()).error)
  }

  const removeHook = async (id: string) => {
    await fetch('/api/admin/webhooks', {
      method: 'DELETE', headers: authHeaders(),
      body: JSON.stringify({ id }),
    })
    loadHooks()
  }

  // Photo actions
  const uploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!photoFile) return
    setError('')
    setLoading(true)
    const form = new FormData()
    form.append('file', photoFile)
    form.append('alt', photoAlt)
    form.append('service_slug', photoService)
    form.append('category', photoCategory)
    if (photoPairId) form.append('pair_id', photoPairId)
    const res = await fetch('/api/admin/photos', {
      method: 'POST',
      headers: authHeadersRaw(),
      body: form,
    })
    setLoading(false)
    if (res.ok) {
      setPhotoFile(null)
      setPhotoAlt('')
      setPhotoPairId('')
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      loadPhotos()
    } else {
      const body = await res.json().catch(() => null)
      setError(body?.error || 'Upload failed')
    }
  }

  const removePhoto = async (id: string) => {
    await fetch('/api/admin/photos', {
      method: 'DELETE', headers: authHeaders(),
      body: JSON.stringify({ id }),
    })
    loadPhotos()
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-xl font-bold mb-4">Admin Login</h1>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <input
            type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="w-full border rounded px-3 py-2 mb-3"
          />
          <button onClick={login} disabled={loading}
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 disabled:opacity-50">
            {loading ? 'Checking...' : 'Log in'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-lg shadow-sm p-1 w-fit">
          {(['webhooks', 'images'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === t ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {t === 'webhooks' ? 'Webhooks' : 'Images'}
            </button>
          ))}
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* ── Webhooks Tab ── */}
        {tab === 'webhooks' && (
          <>
            <form onSubmit={addHook} className="bg-white p-5 rounded-lg shadow-md mb-6 space-y-3">
              <h2 className="font-semibold text-lg">Add Webhook</h2>
              <input type="url" placeholder="https://..." value={hookUrl} onChange={e => setHookUrl(e.target.value)} required
                className="w-full border rounded px-3 py-2" />
              <input type="text" placeholder="Label (optional)" value={hookLabel} onChange={e => setHookLabel(e.target.value)}
                className="w-full border rounded px-3 py-2" />
              <select value={hookEvent} onChange={e => setHookEvent(e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="all">All events</option>
                <option value="quote">Quotes only</option>
                <option value="contact">Contacts only</option>
              </select>
              <button type="submit" disabled={loading}
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-50">
                {loading ? 'Adding...' : 'Add Webhook'}
              </button>
            </form>

            <div className="bg-white rounded-lg shadow-md">
              <h2 className="font-semibold text-lg p-5 pb-3">Active Webhooks</h2>
              {hooks.length === 0 ? (
                <p className="px-5 pb-5 text-gray-500">No webhooks configured yet.</p>
              ) : (
                <ul className="divide-y">
                  {hooks.map(h => (
                    <li key={h.id} className="px-5 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-sm truncate">{h.url}</p>
                        <p className="text-xs text-gray-500">
                          {h.label && <span className="mr-2">{h.label}</span>}
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded">{h.event}</span>
                        </p>
                      </div>
                      <button onClick={() => removeHook(h.id)}
                        className="text-red-600 text-sm hover:underline shrink-0">Remove</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {/* ── Images Tab ── */}
        {tab === 'images' && (
          <>
            <form onSubmit={uploadPhoto} className="bg-white p-5 rounded-lg shadow-md mb-6 space-y-3">
              <h2 className="font-semibold text-lg">Upload Image</h2>
              <input
                type="file" accept="image/*"
                onChange={e => setPhotoFile(e.target.files?.[0] ?? null)}
                className="w-full border rounded px-3 py-2"
              />
              <input type="text" placeholder="Alt text (describe the image)" value={photoAlt}
                onChange={e => setPhotoAlt(e.target.value)}
                className="w-full border rounded px-3 py-2" />
              <select value={photoService} onChange={e => setPhotoService(e.target.value)}
                className="w-full border rounded px-3 py-2">
                {SERVICE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <select value={photoCategory} onChange={e => setPhotoCategory(e.target.value)}
                className="w-full border rounded px-3 py-2">
                <option value="work">Work photo</option>
                <option value="before">Before</option>
                <option value="after">After</option>
                <option value="hero">Hero background</option>
                <option value="about">About section</option>
              </select>
              {(photoCategory === 'before' || photoCategory === 'after') && (
                <input type="text" placeholder="Pair ID (match before & after, e.g. 'lawn-1')"
                  value={photoPairId} onChange={e => setPhotoPairId(e.target.value)}
                  className="w-full border rounded px-3 py-2" />
              )}
              <button type="submit" disabled={loading || !photoFile}
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-50">
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </form>

            <div className="bg-white rounded-lg shadow-md">
              <h2 className="font-semibold text-lg p-5 pb-3">
                Uploaded Images <span className="text-gray-400 font-normal">({photos.length})</span>
              </h2>
              {photos.length === 0 ? (
                <p className="px-5 pb-5 text-gray-500">No images uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-5 pt-0">
                  {photos.map(p => (
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
                      <button onClick={() => removePhoto(p.id)}
                        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
