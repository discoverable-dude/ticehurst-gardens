import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { data, error } = await supabase
      .from('quotes')
      .insert([{
        service:        body.service,
        category:       body.category,
        garden_size:    body.garden_size    ?? null,
        property_size:  body.property_size  ?? null,
        num_windows:    body.num_windows    ?? null,
        num_panels:     body.num_panels     ?? null,
        frequency:      body.frequency      ?? null,
        extras:         body.extras         ?? [],
        town:           body.town,
        postcode:       body.postcode       ?? null,
        name:           body.name,
        phone:          body.phone,
        email:          body.email          ?? null,
        message:        body.message        ?? null,
        estimate_low:   body.estimate_low   ?? null,
        estimate_high:  body.estimate_high  ?? null,
        status:         'new',
        source:         'quote_tool',
      }])
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: data?.[0]?.id })
  } catch (e) {
    console.error('Quote API error:', e)
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  // Simple admin endpoint — in production add auth middleware
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, quotes: data })
}
