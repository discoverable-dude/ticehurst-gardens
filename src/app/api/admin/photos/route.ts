import { NextRequest, NextResponse } from 'next/server'
import { authorized, getServiceClient } from '@/lib/admin-auth'

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

  // Collect all files (supports file_0, file_1, ... or single "file")
  const files: File[] = []
  const singleFile = form.get('file') as File | null
  if (singleFile?.name) {
    files.push(singleFile)
  }
  for (let i = 0; ; i++) {
    const f = form.get(`file_${i}`) as File | null
    if (!f?.name) break
    files.push(f)
  }

  if (files.length === 0) return NextResponse.json({ error: 'No files provided' }, { status: 400 })

  const results = []
  for (const file of files) {
    const ext = file.name.split('.').pop() || 'jpg'
    const folder = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const buf = Buffer.from(await file.arrayBuffer())
    const { error: uploadErr } = await sb.storage
      .from('photos')
      .upload(folder, buf, { contentType: file.type, upsert: false })
    if (uploadErr) {
      results.push({ error: uploadErr.message, filename: file.name })
      continue
    }

    const { data: urlData } = sb.storage.from('photos').getPublicUrl(folder)

    const { data, error } = await sb.from('photos').insert([{
      url: urlData.publicUrl,
      alt: '',
      service_slug: null,
      category: 'work',
      pair_id: null,
      sort_order: 0,
      active: true,
    }]).select().single()

    if (error) results.push({ error: error.message, filename: file.name })
    else results.push(data)
  }

  return NextResponse.json(results)
}

export async function PATCH(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const body = await req.json()
  const { id, ...fields } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const { data, error } = await sb.from('photos').update(fields).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = await getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const { data: photo } = await sb.from('photos').select('url').eq('id', id).single()
  if (photo?.url) {
    const match = photo.url.match(/\/object\/public\/photos\/(.+)$/)
    if (match) await sb.storage.from('photos').remove([match[1]])
  }
  const { error } = await sb.from('photos').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
