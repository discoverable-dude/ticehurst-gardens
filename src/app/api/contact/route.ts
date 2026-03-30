import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (url && key) {
      const { createClient } = await import('@supabase/supabase-js')
      const sb = createClient(url, key)
      const { error } = await sb.from('contacts').insert([{ name: body.name ?? null, phone: body.phone ?? null, email: body.email ?? null, service: body.service ?? null, town: body.town ?? null, message: body.message ?? null, status: 'new' }])
      if (error) console.error('Supabase error:', error.message)
    } else {
      console.log('CONTACT SUBMISSION (no DB):', JSON.stringify(body))
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
