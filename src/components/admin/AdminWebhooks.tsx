'use client'
import { useState, useCallback, useEffect } from 'react'

type Webhook = { id: string; url: string; label: string | null; event: string; active: boolean }

export default function AdminWebhooks({ authHeaders }: { authHeaders: () => Record<string, string> }) {
  const [hooks, setHooks] = useState<Webhook[]>([])
  const [url, setUrl] = useState('')
  const [label, setLabel] = useState('')
  const [event, setEvent] = useState('all')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/webhooks', { headers: authHeaders() })
    if (res.ok) setHooks(await res.json())
  }, [authHeaders])

  useEffect(() => { load() }, [load])

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    setLoading(true)
    const res = await fetch('/api/admin/webhooks', {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ url, label, event }),
    })
    setLoading(false)
    if (res.ok) { setUrl(''); setLabel(''); load() }
    else setError((await res.json()).error)
  }

  const remove = async (id: string) => {
    await fetch('/api/admin/webhooks', {
      method: 'DELETE', headers: authHeaders(),
      body: JSON.stringify({ id }),
    })
    load()
  }

  return (
    <>
      <form onSubmit={add} className="bg-white p-5 rounded-lg shadow-md mb-6 space-y-3">
        <h2 className="font-semibold text-lg">Add Webhook</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input type="url" placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} required
          className="w-full border rounded px-3 py-2" />
        <input type="text" placeholder="Label (optional)" value={label} onChange={e => setLabel(e.target.value)}
          className="w-full border rounded px-3 py-2" />
        <select value={event} onChange={e => setEvent(e.target.value)} className="w-full border rounded px-3 py-2">
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
                <button onClick={() => remove(h.id)} className="text-red-600 text-sm hover:underline shrink-0">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
