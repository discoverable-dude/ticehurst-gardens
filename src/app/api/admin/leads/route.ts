import { NextRequest, NextResponse } from 'next/server'
import { authorized, getServiceClient } from '@/lib/admin-auth'

// Combined view of website leads: contact-form messages (`contacts`) and
// quote-tool submissions (`quotes`), normalised to one shape so the admin can
// show them in a single list.
export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })

  const [contacts, quotes] = await Promise.all([
    sb.from('contacts').select('*').order('created_at', { ascending: false }),
    sb.from('quotes').select('*').order('created_at', { ascending: false }),
  ])
  if (contacts.error) return NextResponse.json({ error: contacts.error.message }, { status: 500 })
  if (quotes.error) return NextResponse.json({ error: quotes.error.message }, { status: 500 })

  const leads = [
    ...(contacts.data ?? []).map((c) => ({
      type: 'contact' as const,
      id: c.id, created_at: c.created_at,
      name: c.name, phone: c.phone, email: c.email ?? null,
      service: c.service ?? null, town: c.town ?? null, message: c.message ?? null,
      status: c.status ?? 'new', notes: c.notes ?? null,
    })),
    ...(quotes.data ?? []).map((q) => ({
      type: 'quote' as const,
      id: q.id, created_at: q.created_at,
      name: q.name, phone: q.phone, email: q.email ?? null,
      service: q.service ?? null, town: q.town ?? null, message: q.message ?? null,
      status: q.status ?? 'new', notes: q.notes ?? null,
      estimate_low: q.estimate_low ?? null, estimate_high: q.estimate_high ?? null,
      source: q.source ?? null,
    })),
  ].sort((a, b) => (a.created_at < b.created_at ? 1 : -1))

  return NextResponse.json(leads)
}

// Update a single lead's follow-up status and/or notes. `contacted_at` /
// `booked_at` are stamped only where the column exists (contacts has no
// booked_at, so marking an enquiry "booked" changes status alone).
export async function PATCH(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })

  const { type, id, status, notes } = await req.json()
  if ((type !== 'contact' && type !== 'quote') || !id)
    return NextResponse.json({ error: 'type (contact|quote) and id required' }, { status: 400 })

  const table = type === 'contact' ? 'contacts' : 'quotes'
  const patch: Record<string, unknown> = {}
  if (typeof notes === 'string') patch.notes = notes
  if (typeof status === 'string') {
    patch.status = status
    if (status === 'contacted') patch.contacted_at = new Date().toISOString()
    if (status === 'booked' && type === 'quote') patch.booked_at = new Date().toISOString()
  }
  if (Object.keys(patch).length === 0)
    return NextResponse.json({ error: 'nothing to update' }, { status: 400 })

  const { data, error } = await sb.from(table).update(patch).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
