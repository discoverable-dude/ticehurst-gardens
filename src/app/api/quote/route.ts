import { NextRequest, NextResponse } from 'next/server'
import { fireWebhooks } from '@/lib/webhooks'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (url && key) {
      const { createClient } = await import('@supabase/supabase-js')
      const sb = createClient(url, key)
      const { error } = await sb.from('quotes').insert([{ service: body.service ?? null, town: body.town ?? null, name: body.name ?? null, phone: body.phone ?? null, email: body.email ?? null, estimate_low: body.estimate_low ?? null, estimate_high: body.estimate_high ?? null, status: 'new', source: 'quote_tool' }])
      if (error) console.error('Supabase error:', error.message)
    } else {
      console.log('QUOTE SUBMISSION (no DB):', JSON.stringify(body))
    }
    await fireWebhooks('quote', body)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Quote route error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
