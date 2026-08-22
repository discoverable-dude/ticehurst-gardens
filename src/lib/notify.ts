import webpush from 'web-push'
import { getServiceClient } from '@/lib/admin-auth'

// Notify the team when a new lead arrives, from any source (website form, quote
// tool, or Meta lead ad via the ingest endpoint). Sends a Web Push to every
// subscribed device (Andy's installed PWA) and an email backup via Resend.
const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:hello@ticehurstgardens.co.uk'
const RESEND_API_KEY = process.env.RESEND_API_KEY
const NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || 'hello@ticehurstgardens.co.uk'

export type LeadSummary = {
  name?: string | null
  service?: string | null
  town?: string | null
  source?: string | null
}

const sourceLabel = (s?: string | null) =>
  s === 'meta_lead_ad' ? 'Facebook or Instagram ad' : s === 'quote_tool' ? 'quote tool' : 'website form'

export async function notifyNewLead(lead: LeadSummary) {
  const summary = [lead.name, lead.service, lead.town].filter(Boolean).join(' · ') || 'New lead'
  // Push and email run in parallel; a failure in either must not break the request.
  await Promise.allSettled([sendPush(lead, summary), sendEmail(lead, summary)])
}

async function sendPush(lead: LeadSummary, summary: string) {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) return
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE)
  const sb = await getServiceClient()
  if (!sb) return
  const { data: subs } = await sb.from('push_subscriptions').select('*')
  const payload = JSON.stringify({ title: 'New lead', body: summary, url: '/' })
  await Promise.allSettled((subs ?? []).map(async (s) => {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        payload
      )
    } catch (e: unknown) {
      const code = (e as { statusCode?: number })?.statusCode
      if (code === 404 || code === 410) await sb.from('push_subscriptions').delete().eq('id', s.id)
    }
  }))
}

async function sendEmail(lead: LeadSummary, summary: string) {
  if (!RESEND_API_KEY) return
  const html = `<p>New lead from the ${sourceLabel(lead.source)}:</p>
<p><strong>${lead.name || 'Unknown'}</strong><br>${[lead.service, lead.town].filter(Boolean).join(' · ')}</p>
<p>Open your leads: <a href="https://ticehurstgardens.co.uk/admin">ticehurstgardens.co.uk/admin</a></p>`
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Ticehurst Leads <hello@ticehurstgardens.co.uk>',
      to: [NOTIFY_EMAIL],
      subject: `New lead: ${lead.name || summary}`,
      html,
    }),
  }).catch(() => { /* email backup best-effort */ })
}
