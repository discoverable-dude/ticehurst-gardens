import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Wave from '@/components/Wave'
import Link from 'next/link'
import { SERVICES, getService } from '@/lib/services'
import { LOCATIONS } from '@/lib/locations'
import { CheckCircle2, ChevronRight, ArrowRight, MapPin } from 'lucide-react'

export async function generateStaticParams() {
  return SERVICES.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const svc = getService(params.slug)
  if (!svc) return {}
  return {
    title: svc.title,
    description: svc.meta,
    alternates: { canonical: `https://www.ticehurstgroundsandgardens.co.uk/services/${svc.slug}/` },
  }
}

const REVIEWS = [
  { q: 'Andy and his team transformed our overgrown garden. Incredibly professional, reliable and great value.', name: 'Sarah M.',  loc: 'Ashford, Kent' },
  { q: 'Used Ticehurst for lawn maintenance for over a year. Always on time, always brilliant results.',          name: 'James T.',  loc: 'Tenterden, Kent' },
  { q: 'The exterior window and conservatory cleaning was outstanding. Would definitely recommend.',              name: 'Rachel B.', loc: 'Headcorn, Kent' },
]

function Stars() {
  return <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><span key={i} className="text-amber-400 text-[13px]">★</span>)}</div>
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const svc = getService(params.slug)
  if (!svc) notFound()

  const related = SERVICES.filter(s => s.category === svc.category && s.slug !== svc.slug).slice(0, 3)
  const catLabel = svc.category === 'gardening' ? 'Gardening Service' : 'Exterior Cleaning'

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: svc.name,
        description: svc.intro,
        serviceType: svc.name,
        url: `https://www.ticehurstgroundsandgardens.co.uk/services/${svc.slug}/`,
        provider: { '@type': 'LocalBusiness', name: 'Ticehurst Grounds & Gardens', url: 'https://www.ticehurstgroundsandgardens.co.uk/', telephone: '+447700000000' },
        areaServed: [{ '@type': 'AdministrativeArea', name: 'Kent' }, { '@type': 'AdministrativeArea', name: 'East Sussex' }],
      },
      {
        '@type': 'FAQPage',
        mainEntity: svc.faqs.map(([q, a]: [string, string]) => ({
          '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://www.ticehurstgroundsandgardens.co.uk/' },
          { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.ticehurstgroundsandgardens.co.uk/services/' },
          { '@type': 'ListItem', position: 3, name: svc.name },
        ],
      },
    ],
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <Nav />

      {/* Hero */}
      <header className="bg-forest overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-0 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pb-14">
            <div>
              <nav className="flex items-center gap-2 text-xs text-mid font-medium mb-4">
                <a href="/" className="text-mid hover:text-tlight">Home</a>
                <span className="text-tlight/40">›</span>
                <span className="text-tlight">{catLabel}</span>
                <span className="text-tlight/40">›</span>
                <span className="text-white">{svc.name}</span>
              </nav>
              <h1 className="font-head font-black leading-[0.93] text-white mb-5" style={{fontSize:'clamp(30px,5vw,58px)'}}>
                {svc.h1a}<br /><span className="text-mid">{svc.h1b}</span>
              </h1>
              <p className="text-tlight text-[15px] leading-relaxed mb-8 max-w-[440px]">{svc.intro}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/quote/" className="flex items-center gap-2 bg-sage text-white font-head font-black text-sm uppercase tracking-wider px-6 py-3 rounded-full hover:bg-moss transition-all">
                  Get a free quote <ArrowRight size={13} />
                </Link>
                <a href="https://wa.me/447700000000" className="flex items-center gap-2 bg-transparent text-white border-2 border-white/30 font-head font-black text-sm uppercase tracking-wider px-6 py-3 rounded-full hover:bg-white/10 transition-all">
                  WhatsApp Andy
                </a>
              </div>
            </div>

            {/* What's included */}
            <div className="bg-white/[0.07] border border-white/[0.12] rounded-xl p-6">
              <h2 className="font-head font-bold text-[12px] uppercase tracking-[0.1em] text-mid mb-4">What&apos;s included</h2>
              <ul className="flex flex-col gap-3">
                {svc.includes.map(item => (
                  <li key={item} className="flex items-baseline gap-3 text-[14px] text-tlight">
                    <CheckCircle2 size={13} className="text-sage flex-shrink-0 mt-0.5" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <Wave fromColor="#1C3D2A" toColor="#F4F1EC" path="M0,20 C360,65 720,5 1080,45 C1260,60 1380,15 1440,20 L1440,65 L0,65 Z" height={65} />
      </header>

      {/* Detail + form */}
      <section className="bg-cream py-14">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="font-head font-bold text-sm uppercase tracking-[0.18em] text-sage mb-2">{catLabel}</p>
            <h2 className="font-head font-black text-[clamp(22px,3vw,36px)] uppercase tracking-wide text-forest leading-none mb-5">
              Professional {svc.name} in Kent &amp; East Sussex
            </h2>
            <p className="text-bark text-[15px] leading-relaxed mb-4">{svc.intro}</p>
            <p className="text-bark text-[15px] leading-relaxed mb-4">
              We cover all areas across Kent and East Sussex, including Ashford, Maidstone, Tunbridge Wells, Folkestone, Tenterden, Tonbridge, Hastings and Bexhill. Our professional multi-person teams deliver outstanding results at fair, transparent prices.
            </p>
            <p className="text-bark text-[15px] leading-relaxed">
              All work is carried out to the highest standard. We provide free, no-obligation quotes — get in touch with Andy to arrange a visit.
            </p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-pebble p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest to-sage" />
            <h2 className="font-head font-black text-lg uppercase tracking-wide text-forest mb-1">Get a Quote for {svc.name}</h2>
            <p className="text-sm text-bark mb-4">Free, no-obligation. We&apos;ll visit and give you a firm price.</p>
            <form className="space-y-3" action="/contact/thanks" method="POST">
              <input type="hidden" name="service" value={svc.name} />
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Name *</label>
                  <input name="name" required placeholder="Your name" className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Phone *</label>
                  <input name="phone" type="tel" required placeholder="07XXX XXXXXX" className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Your town</label>
                <input name="town" placeholder="e.g. Ashford, Tenterden…" className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Tell us about your project</label>
                <textarea name="message" rows={3} placeholder="Describe what you need help with…" className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors resize-none" />
              </div>
              <button type="submit" className="w-full bg-forest text-white font-head font-black text-sm uppercase tracking-wider py-3.5 rounded-full hover:bg-moss transition-all">
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Wave fromColor="#F4F1EC" toColor="#FFFFFF" />

      {/* FAQ */}
      <section className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-head font-black text-[clamp(22px,3vw,36px)] uppercase tracking-wide text-forest leading-none mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {svc.faqs.map(([q, a], i) => (
              <details key={i} className="bg-cream border border-pebble rounded-xl overflow-hidden group">
                <summary className="flex justify-between items-center px-5 py-4 cursor-pointer font-head font-bold text-[15px] tracking-wide text-forest hover:bg-foam transition-colors list-none">
                  {q}<ChevronRight size={16} className="text-sage flex-shrink-0 transition-transform group-open:rotate-90" strokeWidth={2} />
                </summary>
                <p className="px-5 pb-4 text-[14px] text-bark leading-relaxed border-t border-pebble pt-3">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Wave fromColor="#FFFFFF" toColor="#EDF7EF" path="M0,35 C480,0 960,68 1440,25 L1440,68 L0,68 Z" height={68} />

      {/* Areas */}
      <section className="bg-foam py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-head font-black text-[clamp(22px,3vw,36px)] uppercase tracking-wide text-forest leading-none mb-3">
            {svc.name} Across Kent &amp; East Sussex
          </h2>
          <p className="text-bark text-[15px] mb-8">We cover all major towns and villages across both counties.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {LOCATIONS.map(loc => (
              <Link key={loc.slug} href={`/areas/${loc.slug}/`}
                className="bg-white border border-pebble rounded-xl p-4 flex items-center gap-3 hover:border-sage hover:-translate-y-0.5 hover:shadow-md transition-all group">
                <MapPin size={13} className="text-sage flex-shrink-0" strokeWidth={2} />
                <div>
                  <div className="font-head font-bold uppercase tracking-wide text-forest text-[13px] group-hover:text-moss transition-colors">{loc.name}</div>
                  <div className="text-[10px] text-bark">{loc.county}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Wave fromColor="#EDF7EF" toColor="#FFFFFF" path="M0,20 C360,58 720,0 1080,38 L1440,22 L1440,58 L0,58 Z" height={58} />

      {/* Reviews */}
      <section className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-head font-black text-[clamp(22px,3vw,36px)] uppercase tracking-wide text-forest leading-none mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {REVIEWS.map((r,i) => (
              <article key={i} className="bg-cream border border-pebble rounded-xl p-5 flex flex-col gap-3 relative">
                <span className="absolute top-3 right-4 text-5xl text-mist font-serif leading-none select-none">&ldquo;</span>
                <Stars />
                <blockquote className="text-[14px] text-charcoal leading-relaxed italic flex-1">&ldquo;{r.q}&rdquo;</blockquote>
                <div><p className="font-head font-bold uppercase tracking-wide text-forest text-[13px]">{r.name}</p><p className="text-[12px] text-sage font-medium">{r.loc}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="bg-cream py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-head font-black text-[clamp(22px,3vw,36px)] uppercase tracking-wide text-forest leading-none mb-8">Related Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(r => (
              <Link key={r.slug} href={`/services/${r.slug}/`}
                className="group flex flex-col gap-3 p-5 bg-white rounded-xl border border-pebble hover:border-tlight hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                <h3 className="font-head font-black text-[16px] uppercase tracking-wide text-forest leading-tight group-hover:text-moss transition-colors">{r.name}</h3>
                <p className="text-[13px] text-bark leading-relaxed flex-1">{r.intro.slice(0,90)}…</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold font-head uppercase tracking-wider text-sage group-hover:gap-2.5 transition-all">
                  Learn more <ChevronRight size={12} strokeWidth={2} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <Wave fromColor="#F4F1EC" toColor="#1C3D2A" path="M0,30 C360,65 720,5 1080,45 C1260,60 1380,20 1440,30 L1440,65 L0,65 Z" height={65} />
      <section className="bg-forest py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-head font-black text-[clamp(26px,3.5vw,42px)] uppercase tracking-wide text-white leading-none mb-4">
              Get a Free Quote for {svc.name}
            </h2>
            <p className="text-tlight text-[15px] leading-relaxed">Free, honest quotes with no pressure. We cover all of Kent &amp; East Sussex.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/quote/" className="flex-1 flex items-center justify-center gap-2 bg-sage text-white font-head font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-moss transition-all">
              Get instant estimate
            </Link>
            <a href="https://wa.me/447700000000" className="flex-1 flex items-center justify-center gap-2 bg-white text-forest font-head font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-mist transition-all">
              WhatsApp Andy
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
