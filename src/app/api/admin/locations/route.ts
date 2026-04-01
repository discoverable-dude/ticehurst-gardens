import { NextRequest, NextResponse } from 'next/server'
import { authorized, getServiceClient } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const { data, error } = await sb.from('cms_locations').select('*').order('sort_order')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const body = await req.json()
  const { slug } = body
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
  body.updated_at = new Date().toISOString()
  const { data, error } = await sb.from('cms_locations')
    .upsert(body, { onConflict: 'slug' })
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
