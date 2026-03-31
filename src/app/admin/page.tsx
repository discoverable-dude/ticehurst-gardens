'use client'
import { useState, useEffect, useCallback } from 'react'

type Webhook = { id: string; url: string; label: string | null; event: string; active: boolean; created_at: string }

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [hooks, setHooks] = useState<Webhook[]>([])
  const [url, setUrl] = useState('')
  const [label, setLabel] = useState('')
  const [event, setEvent] = useState('all')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${password}`,
  }), [password])

  const loadHooks = useCallback(async () => {
    const res = await fetch('/api/admin/webhooks', { headers: headers() })
    if (!res.ok) { setAuthed(false); setError('Session expired'); return }
    setHooks(await res.json())
  }, [headers])

  const login = async () => {
    setError('')
    setLoading(true)
    const res = await fetch('/api/admin/webhooks', { headers: headers() })
    setLoading(false)
    if (res.ok) {
      setAuthed(true)
      setHooks(await res.json())
    } else {
      setError('Invalid password')
    }
  }

  useEffect(() => { if (authed) loadHooks() }, [authed, loadHooks])

  const addHook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    setLoading(true)
    const res = await fetch('/api/admin/webhooks', {
      method: 'POST', headers: headers(),
      body: JSON.stringify({ url, label, event }),
    })
    setLoading(false)
    if (res.ok) { setUrl(''); setLabel(''); loadHooks() }
    else setError((await res.json()).error)
  }

  const removeHook = async (id: string) => {
    await fetch('/api/admin/webhooks', {
      method: 'DELETE', headers: headers(),
      body: JSON.stringify({ id }),
    })
    loadHooks()
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Webhook Management</h1>

        <form onSubmit={addHook} className="bg-white p-5 rounded-lg shadow-md mb-6 space-y-3">
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
                  <button onClick={() => removeHook(h.id)}
                    className="text-red-600 text-sm hover:underline shrink-0">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
