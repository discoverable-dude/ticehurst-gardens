import { NextRequest } from 'next/server'

export function authorized(req: NextRequest): boolean {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw) return false
  return req.headers.get('authorization') === `Bearer ${pw}`
}

export async function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(url, key)
}
