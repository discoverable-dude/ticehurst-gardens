import { NextRequest, NextResponse } from 'next/server'
import { authorized, getServiceClient } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const photoId = req.nextUrl.searchParams.get('photo_id')
  let query = sb.from('photo_placements').select('*').order('sort_order')
  if (photoId) query = query.eq('photo_id', photoId)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const body = await req.json()
  const { photo_id, service_slug, category, pair_id } = body
  if (!photo_id) return NextResponse.json({ error: 'photo_id required' }, { status: 400 })
  const { data, error } = await sb.from('photo_placements').insert([{
    photo_id,
    service_slug: service_slug || null,
    category: category || 'work',
    pair_id: pair_id || null,
    sort_order: 0,
  }]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const { error } = await sb.from('photo_placements').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
