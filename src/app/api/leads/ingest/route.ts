import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/admin-auth'
import { notifyNewLead } from '@/lib/notify'

// Secured ingest endpoint for external lead sources (Meta lead ads via Zapier).
// Zapier POSTs a mapped lead here with ?token=LEAD_INGEST_SECRET. The row lands
// in `contacts`, which fires the notify-lead trigger (push + email) like any
// other lead.
export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') || req.headers.get('x-ingest-token')
  if (!process.env.LEAD_INGEST_SECRET || token !== process.env.LEAD_INGEST_SECRET)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })

  const b = await req.json().catch(() => null)
  if (!b || !b.name || !b.phone)
    return NextResponse.json({ error: 'name and phone required' }, { status: 400 })

  const { data, error } = await sb.from('contacts').insert([{
    name: b.name,
    phone: b.phone,
    email: b.email ?? null,
    service: b.service ?? null,
    town: b.town ?? null,
    message: b.message ?? null,
    status: 'new',
    source: b.source ?? 'meta_lead_ad',
  }]).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  await notifyNewLead({ name: b.name, service: b.service, town: b.town, source: b.source ?? 'meta_lead_ad' })
  return NextResponse.json({ ok: true, id: data.id })
}
