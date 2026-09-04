import { NextRequest, NextResponse } from 'next/server'
import { authorized, getServiceClient } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const { data, error } = await sb.from('webhooks').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const body = await req.json()
  const { url, label, event } = body
  if (!url) return NextResponse.json({ error: 'url is required' }, { status: 400 })
  const { data, error } = await sb.from('webhooks').insert([{ url, label: label || null, event: event || 'all' }]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
  const { error } = await sb.from('webhooks').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
