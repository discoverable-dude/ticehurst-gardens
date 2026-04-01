'use client'
import { useState, useCallback, useEffect } from 'react'

type Review = { id?: string; quote: string; name: string; location: string; service: string; rating: number; sort_order: number; active: boolean }

export default function AdminReviews({ authHeaders }: { authHeaders: () => Record<string, string> }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [editing, setEditing] = useState<Review | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/reviews', { headers: authHeaders() })
    if (res.ok) setReviews(await res.json())
  }, [authHeaders])

  useEffect(() => { load() }, [load])

  const blank: Review = { quote: '', name: '', location: '', service: '', rating: 5, sort_order: 0, active: true }

  const save = async () => {
    if (!editing) return
    setError('')
    setLoading(true)
    const method = editing.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/reviews', {
      method, headers: authHeaders(),
      body: JSON.stringify(editing),
    })
    setLoading(false)
    if (res.ok) { setEditing(null); load() }
    else setError((await res.json()).error)
  }

  const remove = async (id: string) => {
    await fetch('/api/admin/reviews', {
      method: 'DELETE', headers: authHeaders(),
      body: JSON.stringify({ id }),
    })
    load()
  }

  if (editing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5 space-y-3">
        <h2 className="font-semibold text-lg">{editing.id ? 'Edit Review' : 'Add Review'}</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <textarea placeholder="Quote" value={editing.quote} rows={3}
          onChange={e => setEditing({ ...editing, quote: e.target.value })}
          className="w-full border rounded px-3 py-2" />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Name" value={editing.name}
            onChange={e => setEditing({ ...editing, name: e.target.value })}
            className="border rounded px-3 py-2" />
          <input placeholder="Location (e.g. Ashford, Kent)" value={editing.location}
            onChange={e => setEditing({ ...editing, location: e.target.value })}
            className="border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Service (e.g. Lawn Care)" value={editing.service}
            onChange={e => setEditing({ ...editing, service: e.target.value })}
            className="border rounded px-3 py-2" />
          <input type="number" placeholder="Rating" value={editing.rating} min={1} max={5}
            onChange={e => setEditing({ ...editing, rating: Number(e.target.value) })}
            className="border rounded px-3 py-2" />
        </div>
        <div className="flex gap-2">
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
    <div className="space-y-4">
      <button onClick={() => setEditing(blank)}
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 text-sm font-medium">
        Add Review
      </button>

      <div className="bg-white rounded-lg shadow-md divide-y">
        {reviews.length === 0 ? (
          <p className="p-5 text-gray-500">No reviews in database. Hardcoded defaults will be used.</p>
        ) : reviews.map(r => (
          <div key={r.id} className="p-4 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm italic text-gray-700 mb-1">&ldquo;{r.quote}&rdquo;</p>
              <p className="text-xs text-gray-500">
                <strong>{r.name}</strong> &mdash; {r.location}
                {r.service && <span className="ml-2 bg-gray-100 px-1.5 py-0.5 rounded">{r.service}</span>}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(r)} className="text-blue-600 text-sm hover:underline">Edit</button>
              <button onClick={() => remove(r.id!)} className="text-red-600 text-sm hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
