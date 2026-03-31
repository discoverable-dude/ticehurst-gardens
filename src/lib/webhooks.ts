/** Fire all active webhooks for a given event type */
export async function fireWebhooks(eventType: 'quote' | 'contact', payload: Record<string, unknown>) {
  // 1. Fire env-var webhook (backwards-compatible)
  const envUrl = process.env.WEBHOOK_URL
  if (envUrl) {
    fetch(envUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: eventType, ...payload, submitted_at: new Date().toISOString() }),
    }).catch(err => console.error('Env webhook error:', err))
  }

  // 2. Fire database webhooks
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supaUrl || !serviceKey) return

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(supaUrl, serviceKey)
    const { data: hooks } = await sb
      .from('webhooks')
      .select('url')
      .eq('active', true)
      .in('event', ['all', eventType])

    if (!hooks?.length) return

    const body = JSON.stringify({ type: eventType, ...payload, submitted_at: new Date().toISOString() })
    await Promise.allSettled(
      hooks.map(h =>
        fetch(h.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
      )
    )
  } catch (err) {
    console.error('DB webhook error:', err)
  }
}
