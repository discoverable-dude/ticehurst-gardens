import { NextRequest, NextResponse } from 'next/server'

function authorized(req: NextRequest): boolean {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw) return false
  return req.headers.get('authorization') === `Bearer ${pw}`
}

async function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(url, key)
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const { data, error } = await sb.from('photos').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })

  const form = await req.formData()
  const file = form.get('file') as File | null
  const alt = (form.get('alt') as string) || ''
  const service_slug = (form.get('service_slug') as string) || null
  const category = (form.get('category') as string) || 'work'
  const pair_id = (form.get('pair_id') as string) || null

  if (!file) return NextResponse.json({ error: 'file is required' }, { status: 400 })

  // Build storage path
  const ext = file.name.split('.').pop() || 'jpg'
  const folder = service_slug
    ? `${category === 'hero' || category === 'about' ? category : (service_slug)}/${Date.now()}.${ext}`
    : `${category}/${Date.now()}.${ext}`

  // Upload to Supabase Storage
  const buf = Buffer.from(await file.arrayBuffer())
  const { error: uploadErr } = await sb.storage
    .from('photos')
    .upload(folder, buf, { contentType: file.type, upsert: false })
  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 })

  // Get public URL
  const { data: urlData } = sb.storage.from('photos').getPublicUrl(folder)
  const url = urlData.publicUrl

  // Insert metadata row
  const { data, error } = await sb.from('photos').insert([{
    url, alt, service_slug, category, pair_id, sort_order: 0, active: true,
  }]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  // Get the photo to find storage path
  const { data: photo } = await sb.from('photos').select('url').eq('id', id).single()
  if (photo?.url) {
    // Extract path from URL (everything after /object/public/photos/)
    const match = photo.url.match(/\/object\/public\/photos\/(.+)$/)
    if (match) {
      await sb.storage.from('photos').remove([match[1]])
    }
  }

  const { error } = await sb.from('photos').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
