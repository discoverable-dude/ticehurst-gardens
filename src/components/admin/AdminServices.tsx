'use client'
import { useState, useCallback, useEffect } from 'react'

type FAQ = { q: string; a: string }
type Service = {
  id?: string; slug: string; name: string; category: string; title: string; meta: string
  h1a: string; h1b: string; intro: string; includes: string[]; faqs: FAQ[]
  kw_extra: string; sort_order: number; active: boolean
}

export default function AdminServices({ authHeaders }: { authHeaders: () => Record<string, string> }) {
  const [services, setServices] = useState<Service[]>([])
  const [editing, setEditing] = useState<Service | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/services', { headers: authHeaders() })
    if (res.ok) setServices(await res.json())
  }, [authHeaders])

  useEffect(() => { load() }, [load])

  const save = async () => {
    if (!editing) return
    setError('')
    setLoading(true)
    const res = await fetch('/api/admin/services', {
      method: 'PUT', headers: authHeaders(),
      body: JSON.stringify(editing),
    })
    setLoading(false)
    if (res.ok) { setEditing(null); load() }
    else setError((await res.json()).error)
  }

  const updateInclude = (idx: number, val: string) => {
    if (!editing) return
    const includes = [...editing.includes]
    includes[idx] = val
    setEditing({ ...editing, includes })
  }

  const updateFaq = (idx: number, field: 'q' | 'a', val: string) => {
    if (!editing) return
    const faqs = [...editing.faqs]
    faqs[idx] = { ...faqs[idx], [field]: val }
    setEditing({ ...editing, faqs })
  }

  if (editing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5 space-y-3 max-h-[80vh] overflow-y-auto">
        <h2 className="font-semibold text-lg">Edit: {editing.name}</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 font-medium">Name</label>
            <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
              className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Category</label>
            <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}
              className="w-full border rounded px-3 py-2">
              <option value="gardening">Gardening</option>
              <option value="cleaning">Cleaning</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 font-medium">Page Title (SEO)</label>
          <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })}
            className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium">Meta Description</label>
          <textarea value={editing.meta} rows={2} onChange={e => setEditing({ ...editing, meta: e.target.value })}
            className="w-full border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 font-medium">H1 Line 1</label>
            <input value={editing.h1a} onChange={e => setEditing({ ...editing, h1a: e.target.value })}
              className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">H1 Line 2</label>
            <input value={editing.h1b} onChange={e => setEditing({ ...editing, h1b: e.target.value })}
              className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium">Intro</label>
          <textarea value={editing.intro} rows={3} onChange={e => setEditing({ ...editing, intro: e.target.value })}
            className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="text-xs text-gray-500 font-medium">What&apos;s Included</label>
          {editing.includes.map((inc, i) => (
            <input key={i} value={inc} onChange={e => updateInclude(i, e.target.value)}
              className="w-full border rounded px-3 py-1.5 text-sm mb-1" />
          ))}
          <button onClick={() => setEditing({ ...editing, includes: [...editing.includes, ''] })}
            className="text-xs text-green-700 hover:underline mt-1">+ Add item</button>
        </div>

        <div>
          <label className="text-xs text-gray-500 font-medium">FAQs</label>
          {editing.faqs.map((faq, i) => (
            <div key={i} className="border rounded p-2 mb-2 space-y-1">
              <input placeholder="Question" value={faq.q} onChange={e => updateFaq(i, 'q', e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm" />
              <textarea placeholder="Answer" value={faq.a} rows={2} onChange={e => updateFaq(i, 'a', e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm" />
            </div>
          ))}
          <button onClick={() => setEditing({ ...editing, faqs: [...editing.faqs, { q: '', a: '' }] })}
            className="text-xs text-green-700 hover:underline">+ Add FAQ</button>
        </div>

        <div>
          <label className="text-xs text-gray-500 font-medium">Extra Keywords</label>
          <input value={editing.kw_extra} onChange={e => setEditing({ ...editing, kw_extra: e.target.value })}
            className="w-full border rounded px-3 py-2" />
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
        Services <span className="text-gray-400 font-normal">({services.length})</span>
      </h2>
      {services.length === 0 ? (
        <p className="p-5 text-gray-500">No services in database. Run the seed script to populate from hardcoded data.</p>
      ) : services.map(s => (
        <div key={s.slug} className="p-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-medium text-sm">{s.name}</p>
            <p className="text-xs text-gray-500">/services/{s.slug}/ &middot; {s.category}</p>
          </div>
          <button onClick={() => setEditing(s)} className="text-blue-600 text-sm hover:underline">Edit</button>
        </div>
      ))}
    </div>
  )
}
