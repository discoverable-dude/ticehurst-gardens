'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Mail, Loader2 } from 'lucide-react'

export default function ContactForm({
  service,
  town,
  variant = 'default',
}: {
  service?: string
  town?: string
  variant?: 'default' | 'hero' | 'service' | 'area' | 'contact'
}) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const showEmail = variant === 'contact'
  const rows = variant === 'contact' ? 4 : variant === 'area' ? 2 : 3
  const buttonIcon = variant === 'contact' ? <Mail size={15} strokeWidth={2} /> : <ArrowRight size={14} strokeWidth={2} />
  const buttonText = variant === 'contact' ? 'Send message' : 'Send message'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)

    const fd = new FormData(e.currentTarget)
    const data: Record<string, string> = {}
    fd.forEach((v, k) => { data[k] = v.toString() })

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch {
      // still redirect on failure — we don't want to block the user
    }

    router.push('/contact/thanks')
  }

  const inputClass = 'px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-all focus:shadow-[0_0_0_3px_rgba(90,154,106,0.1)]'

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {service && <input type="hidden" name="service" value={service} />}
      {town && <input type="hidden" name="town" value={town} />}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Name *</label>
          <input name="name" required placeholder="Your name" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Phone *</label>
          <input name="phone" type="tel" required placeholder="07XXX XXXXXX" className={inputClass} />
        </div>
      </div>

      {showEmail && (
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Email</label>
          <input name="email" type="email" placeholder="you@email.com" className={inputClass} />
        </div>
      )}

      {!service && (
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Service needed</label>
          <select name="service" className={inputClass}>
            <option value="">Select a service…</option>
            {variant === 'contact' ? (
              <>
                <optgroup label="Gardening">
                  {['Lawn Care','Garden Maintenance','Hedge & Tree Care','Garden Clearance','Border & Bed Design','Fencing'].map(o=><option key={o}>{o}</option>)}
                </optgroup>
                <optgroup label="Exterior Cleaning">
                  {['Window Cleaning','Gutter Clearing','Solar Panel Cleaning','Jet Washing','Building & Cladding Cleaning','Conservatory Cleaning'].map(o=><option key={o}>{o}</option>)}
                </optgroup>
              </>
            ) : (
              <>
                {['Lawn Care','Garden Maintenance','Hedge & Tree Care','Garden Clearance','Fencing','Window Cleaning','Gutter Clearing','Solar Panel Cleaning','Jet Washing','Conservatory Cleaning','Multiple services'].map(o=><option key={o}>{o}</option>)}
              </>
            )}
            <option>Multiple services</option>
          </select>
        </div>
      )}

      {!town && (
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-forest uppercase tracking-wider">{variant === 'contact' ? 'Your town / area' : 'Your town'}</label>
          <input name="town" placeholder="e.g. Ashford, Tenterden…" className={inputClass} />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-bold text-forest uppercase tracking-wider">
          {variant === 'service' ? 'Tell us about your project' : 'Tell us more'}
        </label>
        <textarea name="message" rows={rows} placeholder="Describe what you need help with…" className={`${inputClass} resize-none`} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-forest text-white font-head font-black text-sm uppercase tracking-wider py-3.5 rounded-full hover:bg-moss transition-all flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {submitting ? <Loader2 size={14} className="animate-spin" /> : buttonIcon}
        {submitting ? 'Sending…' : buttonText}
      </button>
      <p className="text-center text-[11px] text-stone">We&#39;ll reply within 24 hours. No spam, ever.</p>
    </form>
  )
}
