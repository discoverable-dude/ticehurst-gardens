'use client'
import { useState, useCallback, useEffect } from 'react'

type ContentRow = { page: string; section: string; content: unknown }

const PAGES = [
  {
    page: 'about',
    label: 'About Page',
    sections: [
      { key: 'story', label: 'Our Story' },
      { key: 'stats', label: 'Stats' },
    ],
  },
  {
    page: 'contact',
    label: 'Contact Page',
    sections: [
      { key: 'info', label: 'Contact Info' },
    ],
  },
]

export default function AdminPages({ authHeaders }: { authHeaders: () => Record<string, string> }) {
  const [content, setContent] = useState<Record<string, Record<string, unknown>>>({})
  const [editingPage, setEditingPage] = useState<string | null>(null)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/content', { headers: authHeaders() })
    if (res.ok) {
      const rows: ContentRow[] = await res.json()
      const map: Record<string, Record<string, unknown>> = {}
      for (const row of rows) {
        if (!map[row.page]) map[row.page] = {}
        map[row.page][row.section] = row.content
      }
      setContent(map)
    }
  }, [authHeaders])

  useEffect(() => { load() }, [load])

  const startEdit = (page: string, section: string) => {
    setEditingPage(page)
    setEditingSection(section)
    setEditValue(JSON.stringify(content[page]?.[section] ?? {}, null, 2))
    setError('')
  }

  const save = async () => {
    if (!editingPage || !editingSection) return
    let parsed: unknown
    try { parsed = JSON.parse(editValue) } catch { setError('Invalid JSON'); return }
    setLoading(true)
    const res = await fetch('/api/admin/content', {
      method: 'PUT', headers: authHeaders(),
      body: JSON.stringify({ page: editingPage, section: editingSection, content: parsed }),
    })
    setLoading(false)
    if (res.ok) { setEditingPage(null); setEditingSection(null); load() }
    else setError((await res.json()).error)
  }

  return (
    <div className="space-y-4">
      {editingPage && editingSection && (
        <div className="bg-white rounded-lg shadow-md p-5 space-y-3">
          <h2 className="font-semibold text-lg">
            Edit: {PAGES.find(p => p.page === editingPage)?.label} &mdash; {editingSection}
          </h2>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <textarea value={editValue} onChange={e => setEditValue(e.target.value)}
            rows={12} className="w-full border rounded px-3 py-2 font-mono text-sm" />
          <div className="flex gap-2">
            <button onClick={save} disabled={loading}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditingPage(null); setEditingSection(null) }}
              className="text-gray-600 px-4 py-2 hover:underline">Cancel</button>
          </div>
        </div>
      )}

      {PAGES.map(p => (
        <div key={p.page} className="bg-white rounded-lg shadow-md divide-y">
          <h2 className="font-semibold text-lg p-5 pb-3">{p.label}</h2>
          {p.sections.map(s => (
            <div key={s.key} className="p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-sm">{s.label}</p>
                <p className="text-xs text-gray-500">
                  {content[p.page]?.[s.key] ? 'Customised' : 'Using default'}
                </p>
              </div>
              <button onClick={() => startEdit(p.page, s.key)} className="text-blue-600 text-sm hover:underline">Edit</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
