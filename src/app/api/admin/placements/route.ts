import { NextRequest, NextResponse } from 'next/server'
import { authorized, getServiceClient } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const photoId = req.nextUrl.searchParams.get('photo_id')
  const serviceSlug = req.nextUrl.searchParams.get('service_slug')
  const locationSlug = req.nextUrl.searchParams.get('location_slug')
  let query = sb.from('photo_placements').select('*').order('sort_order')
  if (photoId) query = query.eq('photo_id', photoId)
  if (serviceSlug !== null) query = query.eq('service_slug', serviceSlug)
  if (locationSlug !== null) query = query.eq('location_slug', locationSlug)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const body = await req.json()
  const { photo_id, service_slug, location_slug, category, pair_id, sort_order } = body
  if (!photo_id) return NextResponse.json({ error: 'photo_id required' }, { status: 400 })
  const { data, error } = await sb.from('photo_placements').insert([{
    photo_id,
    service_slug: service_slug || null,
    location_slug: location_slug || null,
    category: category || 'work',
    pair_id: pair_id || null,
    sort_order: typeof sort_order === 'number' ? sort_order : 0,
  }]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const { id, sort_order, category } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const patch: Record<string, unknown> = {}
  if (typeof sort_order === 'number') patch.sort_order = sort_order
  if (typeof category === 'string') patch.category = category
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'nothing to update' }, { status: 400 })
  const { data, error } = await sb.from('photo_placements').update(patch).eq('id', id).select().single()
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
