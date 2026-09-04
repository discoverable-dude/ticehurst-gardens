import { NextRequest, NextResponse } from 'next/server'
import { authorized, getServiceClient } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const page = req.nextUrl.searchParams.get('page')
  let query = sb.from('cms_content').select('*').order('sort_order')
  if (page) query = query.eq('page', page)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const body = await req.json()
  const { page, section, content } = body
  if (!page || !section) return NextResponse.json({ error: 'page and section required' }, { status: 400 })
  const { data, error } = await sb.from('cms_content')
    .upsert({ page, section, content, updated_at: new Date().toISOString() }, { onConflict: 'page,section' })
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
