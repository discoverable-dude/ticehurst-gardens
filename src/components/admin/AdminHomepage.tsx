'use client'
import { useState, useCallback, useEffect } from 'react'

type SectionData = Record<string, unknown>

const SECTIONS = [
  { key: 'hero', label: 'Hero Section', fields: ['tagline', 'subtitle', 'intro', 'badges'] },
  { key: 'stats', label: 'Stats Bar', fields: [] },
  { key: 'gardening_intro', label: 'Gardening Section Heading', fields: ['subtitle', 'heading', 'description'] },
  { key: 'cleaning_intro', label: 'Cleaning Section Heading', fields: ['subtitle', 'heading', 'description'] },
  { key: 'why_us', label: 'Why Ticehurst', fields: ['subtitle', 'heading', 'description', 'items'] },
  { key: 'process', label: 'How It Works', fields: ['subtitle', 'heading', 'steps'] },
  { key: 'faq', label: 'FAQs', fields: ['heading', 'items'] },
]

export default function AdminHomepage({ authHeaders }: { authHeaders: () => Record<string, string> }) {
  const [content, setContent] = useState<Record<string, SectionData>>({})
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/content?page=home', { headers: authHeaders() })
    if (res.ok) {
      const rows = await res.json()
      const map: Record<string, SectionData> = {}
      for (const row of rows) map[row.section] = row.content
      setContent(map)
    }
  }, [authHeaders])

  useEffect(() => { load() }, [load])

  const startEdit = (key: string) => {
    setEditingKey(key)
    setEditValue(JSON.stringify(content[key] ?? {}, null, 2))
    setError('')
  }

  const save = async () => {
    if (!editingKey) return
    let parsed: unknown
    try { parsed = JSON.parse(editValue) } catch { setError('Invalid JSON'); return }
    setLoading(true)
    const res = await fetch('/api/admin/content', {
      method: 'PUT', headers: authHeaders(),
      body: JSON.stringify({ page: 'home', section: editingKey, content: parsed }),
    })
    setLoading(false)
    if (res.ok) { setEditingKey(null); load() }
    else setError((await res.json()).error)
  }

  return (
    <div className="space-y-4">
      {editingKey && (
        <div className="bg-white rounded-lg shadow-md p-5 space-y-3">
          <h2 className="font-semibold text-lg">
            Edit: {SECTIONS.find(s => s.key === editingKey)?.label}
          </h2>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <p className="text-xs text-gray-500">Edit the JSON content directly. Structure must match what the frontend expects.</p>
          <textarea value={editValue} onChange={e => setEditValue(e.target.value)}
            rows={15} className="w-full border rounded px-3 py-2 font-mono text-sm" />
          <div className="flex gap-2">
            <button onClick={save} disabled={loading}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditingKey(null)} className="text-gray-600 px-4 py-2 hover:underline">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md divide-y">
        <h2 className="font-semibold text-lg p-5 pb-3">Homepage Sections</h2>
        {SECTIONS.map(s => (
          <div key={s.key} className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-sm">{s.label}</p>
              <p className="text-xs text-gray-500">
                {content[s.key] ? 'Customised' : 'Using default'}
              </p>
            </div>
            <button onClick={() => startEdit(s.key)} className="text-blue-600 text-sm hover:underline">Edit</button>
          </div>
        ))}
      </div>
    </div>
  )
}
