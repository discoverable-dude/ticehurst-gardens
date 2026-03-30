import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        name:    body.name,
        phone:   body.phone,
        email:   body.email   ?? null,
        service: body.service ?? null,
        town:    body.town    ?? null,
        message: body.message ?? null,
        status:  'new',
      }])
      .select()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, id: data?.[0]?.id })
  } catch {
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
