'use client'
import { useState, useCallback } from 'react'
import AdminImages from '@/components/admin/AdminImages'
import AdminReviews from '@/components/admin/AdminReviews'
import AdminServices from '@/components/admin/AdminServices'
import AdminLocations from '@/components/admin/AdminLocations'
import AdminHomepage from '@/components/admin/AdminHomepage'
import AdminPages from '@/components/admin/AdminPages'
import AdminWebhooks from '@/components/admin/AdminWebhooks'

const TABS = [
  { id: 'images', label: 'Images' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'services', label: 'Services' },
  { id: 'locations', label: 'Locations' },
  { id: 'homepage', label: 'Homepage' },
  { id: 'pages', label: 'Pages' },
  { id: 'webhooks', label: 'Webhooks' },
] as const

type Tab = typeof TABS[number]['id']

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<Tab>('images')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${password}`,
  }), [password])

  const login = async () => {
    setError('')
    setLoading(true)
    const res = await fetch('/api/admin/webhooks', { headers: authHeaders() })
    setLoading(false)
    if (res.ok) {
      setAuthed(true)
    } else {
      const body = await res.json().catch(() => null)
      setError(res.status === 401 ? 'Invalid password' : body?.error || `Error ${res.status}`)
    }
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 bg-white rounded-lg shadow-sm p-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'images' && <AdminImages authHeaders={authHeaders} />}
        {tab === 'reviews' && <AdminReviews authHeaders={authHeaders} />}
        {tab === 'services' && <AdminServices authHeaders={authHeaders} />}
        {tab === 'locations' && <AdminLocations authHeaders={authHeaders} />}
        {tab === 'homepage' && <AdminHomepage authHeaders={authHeaders} />}
        {tab === 'pages' && <AdminPages authHeaders={authHeaders} />}
        {tab === 'webhooks' && <AdminWebhooks authHeaders={authHeaders} />}
      </div>
    </div>
  )
}
