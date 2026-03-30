'use client'

import { useState } from 'react'
import { CheckCircle2, ChevronLeft, ChevronRight, Leaf, Home, Zap, ArrowRight, Phone } from 'lucide-react'
import {
  calculateEstimate,
  GARDEN_SIZES,
  CLEAN_SIZES,
  FREQUENCIES,
  SERVICE_CATEGORIES,
  type GardenSize,
  type CleanSize,
  type Frequency,
} from '@/lib/pricing'

// ── Step tracking ─────────────────────────────────────────────
type Step =
  | 'category'
  | 'service'
  | 'size'
  | 'frequency'
  | 'panels'
  | 'fencing_panels'
  | 'conserv_size'
  | 'location'
  | 'contact'
  | 'estimate'

type FormState = {
  category:       'gardening' | 'cleaning' | null
  service:        string
  gardenSize:     GardenSize | null
  cleanSize:      CleanSize | null
  frequency:      Frequency | null
  numPanels:      number
  numFencePanels: number
  conservSize:    string
  town:           string
  postcode:       string
  name:           string
  phone:          string
  email:          string
  message:        string
}

const INITIAL: FormState = {
  category: null, service: '', gardenSize: null, cleanSize: null,
  frequency: null, numPanels: 12, numFencePanels: 10,
  conservSize: 'medium', town: '', postcode: '',
  name: '', phone: '', email: '', message: '',
}

// Which services show a frequency step?
const RECURRING_SERVICES = ['Lawn Care', 'Garden Maintenance', 'Window Cleaning', 'Solar Panel Cleaning']
// Which need panels count?
const PANEL_SERVICES = ['Solar Panel Cleaning']
// Which need fence panel count?
const FENCE_SERVICES = ['Fencing']
// Which need conservatory size?
const CONSERV_SERVICES = ['Conservatory Cleaning']

function nextStep(step: Step, form: FormState): Step {
  if (step === 'category')  return 'service'
  if (step === 'service') {
    // Gardening always needs garden size; cleaning needs property size
    return 'size'
  }
  if (step === 'size') {
    if (RECURRING_SERVICES.includes(form.service)) return 'frequency'
    if (PANEL_SERVICES.includes(form.service))      return 'panels'
    if (FENCE_SERVICES.includes(form.service))      return 'fencing_panels'
    if (CONSERV_SERVICES.includes(form.service))    return 'conserv_size'
    return 'location'
  }
  if (step === 'frequency') return 'location'
  if (step === 'panels')    return 'location'
  if (step === 'fencing_panels') return 'location'
  if (step === 'conserv_size')   return 'location'
  if (step === 'location')  return 'contact'
  if (step === 'contact')   return 'estimate'
  return 'estimate'
}

function prevStep(step: Step, form: FormState): Step {
  if (step === 'service')   return 'category'
  if (step === 'size')      return 'service'
  if (step === 'frequency') return 'size'
  if (step === 'panels')    return 'size'
  if (step === 'fencing_panels') return 'size'
  if (step === 'conserv_size')   return 'size'
  if (step === 'location') {
    if (RECURRING_SERVICES.includes(form.service)) return 'frequency'
    if (PANEL_SERVICES.includes(form.service))      return 'panels'
    if (FENCE_SERVICES.includes(form.service))      return 'fencing_panels'
    if (CONSERV_SERVICES.includes(form.service))    return 'conserv_size'
    return 'size'
  }
  if (step === 'contact')   return 'location'
  if (step === 'estimate')  return 'contact'
  return 'category'
}

const STEP_LABELS: Record<Step, string> = {
  category: 'Service type', service: 'Choose service',
  size: 'Property size', frequency: 'How often',
  panels: 'Number of panels', fencing_panels: 'Number of panels',
  conserv_size: 'Conservatory size',
  location: 'Your location', contact: 'Your details', estimate: 'Your estimate',
}
const STEP_ORDER: Step[] = ['category','service','size','frequency','location','contact','estimate']

function ProgressBar({ current }: { current: Step }) {
  const idx = STEP_ORDER.indexOf(current)
  const pct = idx < 0 ? 0 : Math.round((idx / (STEP_ORDER.length - 1)) * 100)
  return (
    <div className="mb-8">
      <div className="flex justify-between text-[11px] text-bark mb-2">
        <span className="font-semibold text-sage">{STEP_LABELS[current]}</span>
        <span>Step {Math.max(idx, 0) + 1} of {STEP_ORDER.length}</span>
      </div>
      <div className="h-1.5 bg-pebble rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-forest to-sage rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function OptionCard({
  selected, onClick, children, className = '',
}: { selected: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 ${
        selected
          ? 'border-sage bg-foam shadow-sm'
          : 'border-pebble bg-white hover:border-tlight hover:bg-foam/50'
      } ${className}`}
    >
      {children}
    </button>
  )
}

export default function QuoteTool() {
  const [step, setStep]       = useState<Step>('category')
  const [form, setForm]       = useState<FormState>(INITIAL)
  const [submitting, setSub]  = useState(false)
  const [submitted, setSub2]  = useState(false)
  const [error, setError]     = useState('')

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(p => ({ ...p, [key]: val }))
  }

  function canAdvance(): boolean {
    if (step === 'category')       return !!form.category
    if (step === 'service')        return !!form.service
    if (step === 'size')           return !!(form.gardenSize || form.cleanSize)
    if (step === 'frequency')      return !!form.frequency
    if (step === 'panels')         return form.numPanels > 0
    if (step === 'fencing_panels') return form.numFencePanels > 0
    if (step === 'conserv_size')   return !!form.conservSize
    if (step === 'location')       return form.town.trim().length > 1
    if (step === 'contact')        return form.name.trim().length > 1 && form.phone.trim().length > 6
    return true
  }

  function advance() {
    if (!canAdvance()) return
    setStep(s => nextStep(s, form))
  }
  function back() {
    setStep(s => prevStep(s, form))
  }

  // Compute estimate from current form state
  const estimate = form.service ? calculateEstimate({
    service:      form.service,
    gardenSize:   form.gardenSize ?? undefined,
    cleanSize:    form.cleanSize  ?? undefined,
    frequency:    form.frequency  ?? 'one_off',
    numPanels:    form.numPanels,
    numPanels_fencing: form.numFencePanels,
    conservSize:  form.conservSize,
  }) : null

  async function submitQuote() {
    setSub(true)
    setError('')
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service:        form.service,
          category:       form.category,
          garden_size:    form.gardenSize,
          property_size:  form.cleanSize,
          num_panels:     form.service === 'Solar Panel Cleaning' ? form.numPanels : null,
          frequency:      form.frequency,
          town:           form.town,
          postcode:       form.postcode,
          name:           form.name,
          phone:          form.phone,
          email:          form.email,
          message:        form.message,
          estimate_low:   estimate?.low,
          estimate_high:  estimate?.high,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setSub2(true)
      } else {
        setError('Something went wrong — please call or email Andy directly.')
      }
    } catch {
      setError('Something went wrong — please call or email Andy directly.')
    } finally {
      setSub(false)
    }
  }

  // ── Render steps ─────────────────────────────────────────────

  return (
    <div className="bg-white rounded-2xl border-2 border-pebble overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-forest px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-sage/25 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-mid" strokeWidth={2} />
          </div>
          <h2 className="font-head font-black text-xl uppercase tracking-wide text-white">Instant Price Estimate</h2>
        </div>
        <p className="text-tlight text-sm">Answer a few quick questions for a realistic price guide.</p>
      </div>
      <div className="px-6 pt-5 pb-6">
        <ProgressBar current={step} />

        {/* ── STEP: category ── */}
        {step === 'category' && (
          <div>
            <h3 className="font-head font-black text-lg uppercase tracking-wide text-forest mb-4">What do you need?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <OptionCard selected={form.category === 'gardening'} onClick={() => set('category', 'gardening')}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-foam rounded-lg flex items-center justify-center">
                    <Leaf size={18} className="text-forest" strokeWidth={1.8} />
                  </div>
                  <span className="font-head font-black text-base uppercase tracking-wide text-forest">Gardening</span>
                </div>
                <p className="text-[12.5px] text-bark">Lawn care, maintenance, clearances, hedges, fencing & planting</p>
              </OptionCard>
              <OptionCard selected={form.category === 'cleaning'} onClick={() => set('category', 'cleaning')}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-foam rounded-lg flex items-center justify-center">
                    <Home size={18} className="text-forest" strokeWidth={1.8} />
                  </div>
                  <span className="font-head font-black text-base uppercase tracking-wide text-forest">Exterior Cleaning</span>
                </div>
                <p className="text-[12.5px] text-bark">Windows, gutters, solar panels, jet washing, cladding & conservatories</p>
              </OptionCard>
            </div>
          </div>
        )}

        {/* ── STEP: service ── */}
        {step === 'service' && form.category && (
          <div>
            <h3 className="font-head font-black text-lg uppercase tracking-wide text-forest mb-4">Which service?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SERVICE_CATEGORIES[form.category].map(svc => (
                <OptionCard
                  key={svc}
                  selected={form.service === svc}
                  onClick={() => set('service', svc)}
                >
                  <span className="font-semibold text-[14px] text-charcoal">{svc}</span>
                </OptionCard>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: size ── */}
        {step === 'size' && (
          <div>
            <h3 className="font-head font-black text-lg uppercase tracking-wide text-forest mb-4">
              {form.category === 'gardening' ? 'How big is your garden?' : 'What type of property?'}
            </h3>
            <div className="flex flex-col gap-2">
              {form.category === 'gardening'
                ? GARDEN_SIZES.map(s => (
                    <OptionCard key={s.value} selected={form.gardenSize === s.value} onClick={() => set('gardenSize', s.value)}>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-[14px] text-charcoal">{s.label}</span>
                          <p className="text-[12px] text-bark mt-0.5">{s.desc}</p>
                        </div>
                        {form.gardenSize === s.value && <CheckCircle2 size={18} className="text-sage flex-shrink-0" />}
                      </div>
                    </OptionCard>
                  ))
                : CLEAN_SIZES.map(s => (
                    <OptionCard key={s.value} selected={form.cleanSize === s.value} onClick={() => set('cleanSize', s.value)}>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-[14px] text-charcoal">{s.label}</span>
                          <p className="text-[12px] text-bark mt-0.5">{s.desc}</p>
                        </div>
                        {form.cleanSize === s.value && <CheckCircle2 size={18} className="text-sage flex-shrink-0" />}
                      </div>
                    </OptionCard>
                  ))
              }
            </div>
          </div>
        )}

        {/* ── STEP: frequency ── */}
        {step === 'frequency' && (
          <div>
            <h3 className="font-head font-black text-lg uppercase tracking-wide text-forest mb-2">How often?</h3>
            <p className="text-[13px] text-bark mb-4">Regular customers get better rates. Choose what works for you.</p>
            <div className="flex flex-col gap-2">
              {FREQUENCIES.map(f => (
                <OptionCard key={f.value} selected={form.frequency === f.value} onClick={() => set('frequency', f.value)}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[14px] text-charcoal">{f.label}</span>
                    {f.value !== 'one_off' && (
                      <span className="text-[11px] bg-mist text-moss font-semibold px-2 py-0.5 rounded-full">
                        {f.value === 'weekly' ? 'Best value' : f.value === 'fortnightly' ? 'Popular' : ''}
                      </span>
                    )}
                  </div>
                </OptionCard>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: panels (solar) ── */}
        {step === 'panels' && (
          <div>
            <h3 className="font-head font-black text-lg uppercase tracking-wide text-forest mb-2">How many solar panels?</h3>
            <p className="text-[13px] text-bark mb-5">Check your installer paperwork or count from outside. Typical home has 8–16.</p>
            <div className="flex items-center gap-4 justify-center">
              <button type="button" onClick={() => set('numPanels', Math.max(1, form.numPanels - 1))}
                className="w-12 h-12 rounded-full border-2 border-pebble bg-white hover:border-sage hover:bg-foam text-xl font-bold text-forest transition-colors">−</button>
              <div className="text-center">
                <div className="font-head font-black text-5xl text-forest">{form.numPanels}</div>
                <div className="text-sm text-bark mt-1">panels</div>
              </div>
              <button type="button" onClick={() => set('numPanels', form.numPanels + 1)}
                className="w-12 h-12 rounded-full border-2 border-pebble bg-white hover:border-sage hover:bg-foam text-xl font-bold text-forest transition-colors">+</button>
            </div>
          </div>
        )}

        {/* ── STEP: fencing panels ── */}
        {step === 'fencing_panels' && (
          <div>
            <h3 className="font-head font-black text-lg uppercase tracking-wide text-forest mb-2">How many fence panels?</h3>
            <p className="text-[13px] text-bark mb-5">A typical garden boundary has 10–20 panels. Not sure? we&apos;ll measure up on the free site visit.</p>
            <div className="flex items-center gap-4 justify-center">
              <button type="button" onClick={() => set('numFencePanels', Math.max(1, form.numFencePanels - 1))}
                className="w-12 h-12 rounded-full border-2 border-pebble bg-white hover:border-sage hover:bg-foam text-xl font-bold text-forest transition-colors">−</button>
              <div className="text-center">
                <div className="font-head font-black text-5xl text-forest">{form.numFencePanels}</div>
                <div className="text-sm text-bark mt-1">panels</div>
              </div>
              <button type="button" onClick={() => set('numFencePanels', form.numFencePanels + 1)}
                className="w-12 h-12 rounded-full border-2 border-pebble bg-white hover:border-sage hover:bg-foam text-xl font-bold text-forest transition-colors">+</button>
            </div>
          </div>
        )}

        {/* ── STEP: conservatory size ── */}
        {step === 'conserv_size' && (
          <div>
            <h3 className="font-head font-black text-lg uppercase tracking-wide text-forest mb-4">What size conservatory?</h3>
            <div className="flex flex-col gap-2">
              {[{v:'small',l:'Small',d:'Up to 10m² footprint'},
                {v:'medium',l:'Medium',d:'10–20m² footprint'},
                {v:'large',l:'Large',d:'20m²+ footprint, large roof area'},
              ].map(o => (
                <OptionCard key={o.v} selected={form.conservSize === o.v} onClick={() => set('conservSize', o.v)}>
                  <div className="flex items-center justify-between">
                    <div><span className="font-semibold text-[14px] text-charcoal">{o.l}</span><p className="text-[12px] text-bark mt-0.5">{o.d}</p></div>
                    {form.conservSize === o.v && <CheckCircle2 size={18} className="text-sage flex-shrink-0" />}
                  </div>
                </OptionCard>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: location ── */}
        {step === 'location' && (
          <div>
            <h3 className="font-head font-black text-lg uppercase tracking-wide text-forest mb-2">Where are you?</h3>
            <p className="text-[13px] text-bark mb-5">We cover Kent &amp; East Sussex. We confirm coverage when Andy visits.</p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Town / village *</label>
                <input
                  value={form.town}
                  onChange={e => set('town', e.target.value)}
                  placeholder="e.g. Ashford, Tenterden, Maidstone…"
                  className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Postcode (optional)</label>
                <input
                  value={form.postcode}
                  onChange={e => set('postcode', e.target.value)}
                  placeholder="TN26 3AB"
                  className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP: contact ── */}
        {step === 'contact' && (
          <div>
            <h3 className="font-head font-black text-lg uppercase tracking-wide text-forest mb-2">Your details</h3>
            <p className="text-[13px] text-bark mb-4">Andy will WhatsApp you to confirm availability and arrange a free site visit.</p>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Name *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name"
                    className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Phone *</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} type="tel" placeholder="07XXX XXXXXX"
                    className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Email (optional)</label>
                <input value={form.email} onChange={e => set('email', e.target.value)} type="email" placeholder="you@email.com"
                  className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Anything else? (optional)</label>
                <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={2} placeholder="Any extra details…"
                  className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors resize-none" />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP: estimate ── */}
        {step === 'estimate' && (
          <div>
            {!submitted ? (
              <>
                {/* Estimate display */}
                <div className="bg-gradient-to-br from-forest to-moss rounded-xl p-6 mb-5 text-center">
                  <p className="text-tlight text-sm mb-1">Estimated price for <strong className="text-white">{form.service}</strong></p>
                  {estimate && estimate.low > 0 ? (
                    <>
                      <div className="font-head font-black text-white text-center leading-none mb-1">
                        <span style={{fontSize:'clamp(32px,5vw,52px)'}}>£{estimate.low} – £{estimate.high}</span>
                      </div>
                      <p className="text-tlight text-sm">{estimate.label}</p>
                    </>
                  ) : (
                    <div className="font-head font-black text-white text-2xl">Contact for a quote</div>
                  )}
                </div>

                {/* Summary */}
                <div className="bg-foam border border-pebble rounded-xl p-4 mb-5">
                  <p className="text-[11px] font-bold text-forest uppercase tracking-wider mb-2">Your summary</p>
                  <div className="flex flex-col gap-1.5 text-[13px]">
                    {[
                      ['Service',   form.service],
                      ['Size',      form.gardenSize ? GARDEN_SIZES.find(s=>s.value===form.gardenSize)?.label : CLEAN_SIZES.find(s=>s.value===form.cleanSize)?.label],
                      ['Frequency', form.frequency ? FREQUENCIES.find(f=>f.value===form.frequency)?.label : null],
                      ['Location',  form.town || null],
                    ].filter(r => r[1]).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <span className="text-bark">{k}</span>
                        <span className="font-medium text-charcoal text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">
                  <p className="text-[12px] text-amber-800 leading-relaxed">
                    <strong>This is a guide price only.</strong> Your final quote depends on the exact condition and scope of work. Andy will confirm a fixed price on a free site visit — no obligation.
                  </p>
                </div>

                {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

                <button
                  onClick={submitQuote}
                  disabled={submitting}
                  className="w-full bg-sage text-white font-head font-black text-sm uppercase tracking-wider py-4 rounded-full hover:bg-moss transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Phone size={15} strokeWidth={2} />
                      Request a free site visit to confirm this quote
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-stone mt-2">Andy will WhatsApp you within 1 working day. No spam, no pressure.</p>
              </>
            ) : (
              /* SUCCESS STATE */
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-foam border-2 border-sage rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-sage" strokeWidth={1.5} />
                </div>
                <h3 className="font-head font-black text-xl uppercase tracking-wide text-forest mb-2">Request received!</h3>
                <p className="text-bark text-[14px] leading-relaxed mb-4">
                  Thanks <strong>{form.name}</strong> — Andy will WhatsApp you you on <strong>{form.phone}</strong> within 1 working day to arrange your free site visit in {form.town}.
                </p>
                <div className="bg-foam border border-pebble rounded-xl p-4 text-left mb-5">
                  <p className="text-[12px] text-bark mb-1">Your price guide for reference:</p>
                  {estimate && estimate.low > 0 ? (
                    <p className="font-head font-black text-xl text-forest">£{estimate.low} – £{estimate.high} <span className="text-sm font-body font-normal text-bark">{estimate.label}</span></p>
                  ) : (
                    <p className="font-head font-black text-xl text-forest">Andy will advise on the site visit</p>
                  )}
                </div>
                <a href="https://wa.me/447700000000" className="inline-flex items-center gap-2 text-sage text-sm underline underline-offset-2">
                  Or email Andy directly →
                </a>
              </div>
            )}
          </div>
        )}

        {/* ── Nav buttons ── */}
        {step !== 'estimate' && (
          <div className="flex gap-3 mt-6">
            {step !== 'category' && (
              <button type="button" onClick={back}
                className="flex items-center gap-1.5 px-4 py-2.5 border-[1.5px] border-pebble rounded-full text-bark font-semibold text-sm hover:border-sage hover:text-forest transition-colors">
                <ChevronLeft size={15} strokeWidth={2} />Back
              </button>
            )}
            <button
              type="button"
              onClick={step === 'contact' ? advance : advance}
              disabled={!canAdvance()}
              className="flex-1 flex items-center justify-center gap-2 bg-forest text-white font-head font-black text-sm uppercase tracking-wider py-3 rounded-full hover:bg-moss transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === 'contact' ? (
                <>See my estimate <Zap size={14} strokeWidth={2} /></>
              ) : (
                <>Continue <ChevronRight size={14} strokeWidth={2} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
