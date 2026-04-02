import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Wave from '@/components/Wave'
import Link from 'next/link'
import { LOCATIONS } from '@/lib/locations'
import { getCmsLocation, getAllLocations } from '@/lib/cms'
import { MapPin, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import { GallerySection } from '@/components/Gallery'
import { getPhotosByCategory } from '@/lib/photos'

export const revalidate = 60

export async function generateStaticParams() {
  const locations = await getAllLocations()
  return locations.map(l => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const loc = await getCmsLocation(slug)
  if (!loc) return {}
  return {
    title: `Garden Maintenance & Exterior Cleaning in ${loc.name}, ${loc.county}`,
    description: `Professional gardening and exterior cleaning in ${loc.name}, ${loc.county}. Lawn care, window cleaning, gutter clearing, solar panels & more. Free quotes.`,
    alternates: { canonical: `https://www.ticehurstgroundsandgardens.co.uk/areas/${loc.slug}/` },
  }
}

const ALL_SERVICES = [
  { name: 'Lawn Care',                 href: '/services/lawn-care',            desc: 'Mowing, aeration, scarification & seasonal treatments.' },
  { name: 'Garden Maintenance',        href: '/services/garden-maintenance',    desc: 'Weeding, pruning, planting & year-round upkeep.' },
  { name: 'Hedge & Tree Care',         href: '/services/hedge-tree-care',       desc: 'Trimming, shaping, crown reduction & waste removal.' },
  { name: 'Garden Clearances',         href: '/services/garden-clearances',     desc: 'One-off or seasonal — brambles, shrubs & full resets.' },
  { name: 'Border & Bed Design',       href: '/services/borders-beds',          desc: 'New planting schemes, seasonal colour & bed creation.' },
  { name: 'Fencing',                   href: '/services/fencing',               desc: 'Close-board, panel & post-rail installation plus repairs.' },
  { name: 'Window Cleaning',           href: '/services/window-cleaning',       desc: 'Residential & commercial, pure water reach-&-wash system.' },
  { name: 'Gutter Clearing',           href: '/services/gutter-clearing',       desc: 'Clear blockages, flush downpipes, clean fascias & soffits.' },
  { name: 'Solar Panel Cleaning',      href: '/services/solar-panel-cleaning',  desc: 'Restore up to 30% lost efficiency — pure water, no chemicals.' },
  { name: 'Jet Washing',               href: '/services/jet-washing',           desc: 'Patios, driveways, paths, decking & block paving.' },
  { name: 'Building & Cladding',       href: '/services/building-cleaning',     desc: 'Weatherboard, render, brickwork & commercial buildings.' },
  { name: 'Conservatory Cleaning',     href: '/services/conservatory-cleaning', desc: 'Roofs, frames, gutters & glass — full exterior clean.' },
]

const REVIEWS = [
  { q: 'Andy and his team transformed our overgrown garden. Incredibly professional, reliable and great value.', name: 'Sarah M.',  loc: 'Ashford, Kent' },
  { q: 'Used Ticehurst for lawn maintenance for over a year. Always on time, always brilliant results.',          name: 'James T.',  loc: 'Tenterden, Kent' },
  { q: 'The exterior window and conservatory cleaning was outstanding. Would definitely recommend.',              name: 'Rachel B.', loc: 'Headcorn, Kent' },
]

function Stars() {
  return <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><span key={i} className="text-amber-400 text-[13px]">★</span>)}</div>
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const loc = await getCmsLocation(slug)
  if (!loc) notFound()

  const nearbyLocations = LOCATIONS.filter(l => loc.nearby.includes(l.slug))
  const heroPhotos = await getPhotosByCategory('hero')
  const heroPhoto = heroPhotos[0]

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        name: 'Ticehurst Grounds & Gardens',
        url: 'https://www.ticehurstgroundsandgardens.co.uk/',
        telephone: '+447989143717',
        email: 'ticehurstgg@gmail.com',
        areaServed: [{ '@type': 'City', name: loc.name, addressRegion: loc.county }],
        serviceType: ['Lawn Care','Garden Maintenance','Hedge and Tree Care','Window Cleaning','Gutter Clearing','Solar Panel Cleaning','Jet Washing','Fencing'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: `Do you provide gardening services in ${loc.name}?`, acceptedAnswer: { '@type': 'Answer', text: `Yes. We cover all of ${loc.name} and surrounding villages including ${loc.villages}.` } },
          { '@type': 'Question', name: `Do you offer window cleaning in ${loc.name}?`, acceptedAnswer: { '@type': 'Answer', text: `Yes. Residential and commercial window cleaning in ${loc.name} using a pure water reach-and-wash system.` } },
          { '@type': 'Question', name: `Can you clear gutters in ${loc.name}?`, acceptedAnswer: { '@type': 'Answer', text: `Yes. Full gutter clearing and downpipe flushing in ${loc.name} and across ${loc.county}.` } },
          { '@type': 'Question', name: `Are quotes free in ${loc.name}?`, acceptedAnswer: { '@type': 'Answer', text: 'Yes. All quotes are free and no-obligation. WhatsApp Andy and we will visit your property.' } },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',  item: 'https://www.ticehurstgroundsandgardens.co.uk/' },
          { '@type': 'ListItem', position: 2, name: 'Areas', item: 'https://www.ticehurstgroundsandgardens.co.uk/areas/' },
          { '@type': 'ListItem', position: 3, name: loc.name },
        ],
      },
    ],
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <Nav />

      {/* Hero */}
      <header className="bg-forest overflow-hidden relative">
        {heroPhoto && (
          <>
            <Image
              src={heroPhoto.url}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-forest/80" />
          </>
        )}
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-0 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start pb-14">
            <div>
              <nav className="flex items-center gap-2 text-xs text-mid font-medium mb-4 flex-wrap">
                <a href="/" className="text-mid hover:text-tlight">Home</a>
                <span className="text-tlight/40">›</span>
                <a href="/areas/" className="text-mid hover:text-tlight">Areas</a>
                <span className="text-tlight/40">›</span>
                <span className="text-tlight">{loc.county}</span>
                <span className="text-tlight/40">›</span>
                <span className="text-white">{loc.name}</span>
              </nav>
              <h1 className="font-head font-black text-[clamp(28px,4.5vw,52px)] uppercase tracking-wide leading-[0.93] text-white mb-5">
                Garden &amp; Grounds<br />
                <span className="text-mid">Services in {loc.name}</span>
              </h1>
              <p className="text-tlight text-[15px] leading-relaxed max-w-[440px] mb-6">
                {loc.desc} Also covering: {loc.villages}.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Free quotes','Gardening & cleaning','5★ rated'].map(b=>(
                  <span key={b} className="inline-flex items-center gap-1.5 bg-sage/15 border border-tlight/25 rounded-full px-3 py-1 text-xs font-semibold text-tlight">
                    <CheckCircle2 size={11} className="text-mid" strokeWidth={2} />{b}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/quote/" className="flex items-center gap-2 bg-sage text-white font-head font-black text-sm uppercase tracking-wider px-5 py-3 rounded-full hover:bg-moss transition-all">
                  Free quote in {loc.name} <ArrowRight size={13} />
                </Link>
                <a href="https://wa.me/447989143717" className="flex items-center gap-2 bg-transparent text-white border-2 border-white/30 font-head font-black text-sm uppercase tracking-wider px-5 py-3 rounded-full hover:bg-white/10 transition-all">
                  WhatsApp Andy
                </a>
              </div>
            </div>

            {/* Mini contact form */}
            <div className="bg-white rounded-2xl border-2 border-pebble p-6 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest to-sage" />
              <h2 className="font-head font-black text-lg uppercase tracking-wide text-forest mb-1">Free Quote in {loc.name}</h2>
              <p className="text-sm text-bark mb-4">No obligation — Andy visits to give you a fixed price.</p>
              <ContactForm town={loc.name} variant="area" />
            </div>
          </div>
        </div>
        <Wave fromColor="#1C3D2A" toColor="#F4F1EC" path="M0,20 C360,65 720,5 1080,45 C1260,60 1380,15 1440,20 L1440,65 L0,65 Z" height={65} />
      </header>

      {/* Intro */}
      <section className="bg-cream py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-head font-black text-[clamp(22px,3vw,36px)] uppercase tracking-wide text-forest leading-none mb-4">
            Professional Garden &amp; Exterior Cleaning in {loc.name}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-bark text-[15px] leading-relaxed mb-4">
                Ticehurst Grounds &amp; Gardens is a professional, friendly multi-team maintenance business serving {loc.name} and the surrounding {loc.county} area. We handle both garden maintenance and exterior cleaning — so you only need one trusted team for everything outside your home.
              </p>
              <p className="text-bark text-[15px] leading-relaxed">
                We serve {loc.name} town and the surrounding villages including {loc.villages}. Get in touch today for your free, no-obligation quote.
              </p>
            </div>
            <div className="bg-white border border-pebble rounded-xl p-5">
              <p className="font-head font-bold text-[11px] uppercase tracking-wider text-forest mb-3">Also covering nearby</p>
              <div className="flex flex-wrap gap-2">
                {nearbyLocations.map(n => (
                  <Link key={n.slug} href={`/areas/${n.slug}/`}
                    className="inline-flex items-center gap-1.5 bg-foam border border-pebble rounded-full px-3 py-1.5 text-[12px] font-semibold text-forest hover:border-sage transition-colors">
                    <MapPin size={11} className="text-sage" strokeWidth={2} />{n.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <GallerySection
        subheading={`Work in ${loc.name}`}
        heading={`Our Projects in ${loc.name}`}
        description={`Recent garden maintenance and exterior cleaning work in ${loc.name} — photos coming soon.`}
        count={4}
        columns={2}
        labels={[
          `Garden work in ${loc.name}`,
          `Exterior cleaning in ${loc.name}`,
          `Before & after`,
          `Finished result`,
        ]}
      />

      <Wave fromColor="#FFFFFF" toColor="#1C3D2A" path="M0,30 C320,68 680,0 1040,50 C1220,65 1360,20 1440,30 L1440,68 L0,68 Z" height={68} />

      {/* All services in this location */}
      <section className="bg-forest py-14">
        <div className="max-w-6xl mx-auto px-6">
          <p className="font-head font-bold text-sm uppercase tracking-[0.18em] text-tlight mb-2">All services in {loc.name}</p>
          <h2 className="font-head font-black text-[clamp(22px,3vw,36px)] uppercase tracking-wide text-white leading-none mb-10">
            What We Do in {loc.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_SERVICES.map(s => (
              <Link key={s.href} href={s.href.endsWith('/') ? s.href : s.href + '/'}
                className="group flex flex-col gap-3 p-5 rounded-xl bg-white/[0.06] border border-white/[0.12] hover:border-tlight/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
                <h3 className="font-head font-black text-[16px] uppercase tracking-wide text-white leading-tight">{s.name}</h3>
                <p className="text-[13px] text-tlight leading-relaxed flex-1">{s.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold font-head uppercase tracking-wider text-mid group-hover:gap-2.5 transition-all">
                  Learn more <ChevronRight size={12} strokeWidth={2} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Wave fromColor="#1C3D2A" toColor="#FFFFFF" path="M0,20 C400,68 800,0 1200,55 C1330,68 1400,28 1440,20 L1440,68 L0,68 Z" height={68} />

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

      {/* FAQ */}
      <section className="bg-cream py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-head font-black text-[clamp(22px,3vw,36px)] uppercase tracking-wide text-forest leading-none mb-8 text-center">
            Questions About {loc.name}
          </h2>
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {[
              { q: `Do you provide gardening services in ${loc.name}?`, a: `Yes. We provide a full range of garden maintenance and grounds care in ${loc.name} and the surrounding ${loc.county} villages including ${loc.villages}. Services include lawn care, hedge cutting, garden clearances, border design and fencing.` },
              { q: `Do you offer window cleaning in ${loc.name}?`, a: `Yes. Residential and commercial window cleaning in ${loc.name} using a reach-and-wash pure water system for streak-free results at every height.` },
              { q: `Can you clear gutters in ${loc.name}?`, a: `Yes. Full gutter clearing, downpipe flushing and fascia and soffit cleaning in ${loc.name} and across ${loc.county}. We recommend clearing at least once a year.` },
              { q: `Do you clean solar panels in ${loc.name}?`, a: `Yes. Solar panel cleaning in ${loc.name} and across ${loc.county}. Dirty panels lose up to 30% efficiency — regular cleaning keeps your installation performing at its best.` },
              { q: `Are quotes free in ${loc.name}?`, a: `Yes. All quotes are free and no-obligation. WhatsApp Andy or message via Instagram and we'll visit your property to provide an honest, transparent estimate.` },
            ].map((f,i) => (
              <details key={i} className="bg-white border border-pebble rounded-xl overflow-hidden group">
                <summary className="flex justify-between items-center px-5 py-4 cursor-pointer font-head font-bold text-[15px] tracking-wide text-forest hover:bg-foam transition-colors list-none">
                  {f.q}<ChevronRight size={16} className="text-sage flex-shrink-0 transition-transform group-open:rotate-90" strokeWidth={2} />
                </summary>
                <p className="px-5 pb-4 text-[14px] text-bark leading-relaxed border-t border-pebble pt-3">{f.a}</p>
              </details>
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
              Get a Free Quote in {loc.name}
            </h2>
            <p className="text-tlight text-[15px] leading-relaxed">Contact Andy directly. Free, honest quotes with no pressure.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/quote/" className="flex-1 flex items-center justify-center gap-2 bg-sage text-white font-head font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-moss transition-all">
              Get instant estimate
            </Link>
            <a href="https://wa.me/447989143717" className="flex-1 flex items-center justify-center gap-2 bg-white text-forest font-head font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-mist transition-all">
              WhatsApp Andy
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
