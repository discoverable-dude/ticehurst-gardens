'use client'
import { useState, useEffect, useCallback } from 'react'

type Lead = {
  type: 'contact' | 'quote'
  id: string; created_at: string
  name: string; phone: string; email: string | null
  service: string | null; town: string | null; message: string | null
  status: string; notes: string | null
  estimate_low?: number | null; estimate_high?: number | null; source?: string | null
}

const STATUSES = ['new', 'contacted', 'booked'] as const
const STATUS_STYLE: Record<string, string> = {
  new: 'bg-amber-100 text-amber-800',
  contacted: 'bg-blue-100 text-blue-800',
  booked: 'bg-green-100 text-green-800',
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export default function AdminLeads({ authHeaders }: { authHeaders: () => Record<string, string> }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [q, setQ] = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/leads', { headers: authHeaders() })
    if (res.ok) setLeads(await res.json())
  }, [authHeaders])
  useEffect(() => { load() }, [load])

  const patch = async (lead: Lead, body: { status?: string; notes?: string }) => {
    setLeads(prev => prev.map(l => (l.id === lead.id && l.type === lead.type ? { ...l, ...body } : l)))
    await fetch('/api/admin/leads', {
      method: 'PATCH', headers: authHeaders(),
      body: JSON.stringify({ type: lead.type, id: lead.id, ...body }),
    })
  }

  const newCount = leads.filter(l => l.status === 'new').length
  const shown = leads.filter(l =>
    (statusFilter === 'all' || l.status === statusFilter) &&
    (typeFilter === 'all' || l.type === typeFilter) &&
    (q === '' || [l.name, l.phone, l.town].filter(Boolean).join(' ').toLowerCase().includes(q.toLowerCase()))
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">Leads</span>
        {newCount > 0 && <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">{newCount} new</span>}
        <div className="flex-1" />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border rounded px-2 py-1 text-sm">
          <option value="all">All types</option>
          <option value="contact">Enquiries</option>
          <option value="quote">Quotes</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded px-2 py-1 text-sm">
          <option value="all">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{cap(s)}</option>)}
        </select>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, phone, town"
          className="border rounded px-2 py-1 text-sm" />
      </div>

      <p className="text-sm text-gray-500">Showing {shown.length} of {leads.length}</p>

      <div className="space-y-3">
        {shown.map(l => (
          <div key={`${l.type}-${l.id}`} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${l.type === 'quote' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                {l.type === 'quote' ? 'Quote' : 'Enquiry'}
              </span>
              <span className="font-semibold">{l.name}</span>
              <span className="text-gray-400 text-xs">{new Date(l.created_at).toLocaleString('en-GB')}</span>
              <div className="flex-1" />
              <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[l.status] ?? 'bg-gray-100'}`}>{l.status}</span>
            </div>
            <div className="text-sm text-gray-700 flex flex-wrap gap-x-4 gap-y-1">
              {l.phone && <a href={`tel:${l.phone}`} className="text-green-700 hover:underline">{l.phone}</a>}
              {l.email && <a href={`mailto:${l.email}`} className="text-green-700 hover:underline">{l.email}</a>}
              {l.service && <span>{l.service}</span>}
              {l.town && <span>{l.town}</span>}
              {l.type === 'quote' && (l.estimate_low != null || l.estimate_high != null) && (
                <span className="font-medium">Est. £{l.estimate_low ?? '?'}–£{l.estimate_high ?? '?'}</span>
              )}
            </div>
            {l.message && <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{l.message}</p>}

            <div className="flex flex-wrap items-center gap-2 mt-3">
              {STATUSES.map(s => (
                <button key={s} onClick={() => patch(l, { status: s })}
                  className={`text-xs px-3 py-1 rounded-full border ${l.status === s ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                  {cap(s)}
                </button>
              ))}
            </div>
            <textarea defaultValue={l.notes ?? ''} placeholder="Notes"
              onBlur={e => { if (e.target.value !== (l.notes ?? '')) patch(l, { notes: e.target.value }) }}
              rows={2} className="w-full border rounded px-2 py-1 text-sm mt-2" />
          </div>
        ))}
        {shown.length === 0 && <p className="text-gray-500 text-sm">No leads match these filters.</p>}
      </div>
    </div>
  )
}
