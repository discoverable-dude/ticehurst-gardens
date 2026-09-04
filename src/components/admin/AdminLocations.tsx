'use client'
import { useState, useCallback, useEffect } from 'react'

type Location = {
  id?: string; slug: string; name: string; county: string; lat: number; lng: number
  description: string; villages: string; nearby: string[]
  kw_gardeners: string; kw_window: string; kw_gutter: string
  sort_order: number; active: boolean
}

export default function AdminLocations({ authHeaders }: { authHeaders: () => Record<string, string> }) {
  const [locations, setLocations] = useState<Location[]>([])
  const [editing, setEditing] = useState<Location | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/locations', { headers: authHeaders() })
    if (res.ok) setLocations(await res.json())
  }, [authHeaders])

  useEffect(() => { load() }, [load])

  const save = async () => {
    if (!editing) return
    setError('')
    setLoading(true)
    const res = await fetch('/api/admin/locations', {
      method: 'PUT', headers: authHeaders(),
      body: JSON.stringify(editing),
    })
    setLoading(false)
    if (res.ok) { setEditing(null); load() }
    else setError((await res.json()).error)
  }

  if (editing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5 space-y-3">
        <h2 className="font-semibold text-lg">Edit: {editing.name}</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 font-medium">Name</label>
            <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
              className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">County</label>
            <input value={editing.county} onChange={e => setEditing({ ...editing, county: e.target.value })}
              className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium">Description</label>
          <textarea value={editing.description} rows={3} onChange={e => setEditing({ ...editing, description: e.target.value })}
            className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium">Villages</label>
          <input value={editing.villages} onChange={e => setEditing({ ...editing, villages: e.target.value })}
            className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium">Nearby (comma-separated slugs)</label>
          <input value={editing.nearby.join(', ')}
            onChange={e => setEditing({ ...editing, nearby: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
            className="w-full border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-500 font-medium">KW Gardeners</label>
            <input value={editing.kw_gardeners} onChange={e => setEditing({ ...editing, kw_gardeners: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">KW Window</label>
            <input value={editing.kw_window} onChange={e => setEditing({ ...editing, kw_window: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">KW Gutter</label>
            <input value={editing.kw_gutter} onChange={e => setEditing({ ...editing, kw_gutter: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={save} disabled={loading}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={() => setEditing(null)} className="text-gray-600 px-4 py-2 hover:underline">Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md divide-y">
      <h2 className="font-semibold text-lg p-5 pb-3">
        Locations <span className="text-gray-400 font-normal">({locations.length})</span>
      </h2>
      {locations.length === 0 ? (
        <p className="p-5 text-gray-500">No locations in database. Run the seed script to populate.</p>
      ) : locations.map(l => (
        <div key={l.slug} className="p-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-medium text-sm">{l.name}</p>
            <p className="text-xs text-gray-500">/areas/{l.slug}/ &middot; {l.county}</p>
          </div>
          <button onClick={() => setEditing(l)} className="text-blue-600 text-sm hover:underline">Edit</button>
        </div>
      ))}
    </div>
  )
}
