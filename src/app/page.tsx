import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Wave from '@/components/Wave'
import {
  Leaf, Sprout, TreePine, Trash2, Flower2, Fence,
  Square, Home as HomeIcon, Sun, Zap, Building2, Triangle,
  CheckCircle2, MapPin, Star, Mail, ChevronRight, ArrowRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ticehurst Grounds & Gardens | Gardeners & Exterior Cleaning in Kent & East Sussex',
  description: 'Professional garden maintenance and exterior cleaning across Kent & East Sussex. Free quotes.',
  alternates: { canonical: 'https://www.ticehurstgroundsandgardens.co.uk' },
}

const GARD = [
  { icon: Leaf,     title: 'Lawn Care',           desc: 'Mowing, aeration, scarification, seeding & seasonal treatments.',   href: '/services/lawn-care/' },
  { icon: Sprout,   title: 'Garden Maintenance',  desc: 'Weeding, pruning, planting & year-round upkeep.',                    href: '/services/garden-maintenance/' },
  { icon: TreePine, title: 'Hedge & Tree Care',   desc: 'Trimming, shaping, crown reduction & waste removal.',                href: '/services/hedge-tree-care/' },
  { icon: Trash2,   title: 'Garden Clearances',   desc: 'One-off or seasonal — brambles, shrubs, rubbish & full resets.',     href: '/services/garden-clearances/' },
  { icon: Flower2,  title: 'Border & Bed Design', desc: 'New planting schemes, seasonal colour & bed creation.',              href: '/services/borders-beds/' },
  { icon: Fence,    title: 'Fencing',             desc: 'Close-board, panel & post-rail installation plus repairs.',          href: '/services/fencing/' },
]
const CLEAN = [
  { icon: Square,    title: 'Window Cleaning',      desc: 'Residential & commercial, pure water reach-&-wash system.',       href: '/services/window-cleaning/' },
  { icon: HomeIcon,      title: 'Gutter Clearing',      desc: 'Clear blockages, flush downpipes, clean fascias & soffits.',      href: '/services/gutter-clearing/' },
  { icon: Sun,       title: 'Solar Panel Cleaning', desc: 'Restore up to 30% lost efficiency — pure water, no chemicals.',   href: '/services/solar-panel-cleaning/' },
  { icon: Zap,       title: 'Jet Washing',          desc: 'Patios, driveways, paths, decking & block paving.',               href: '/services/jet-washing/' },
  { icon: Building2, title: 'Building & Cladding',  desc: 'Weatherboard, render, brickwork & commercial buildings.',         href: '/services/building-cleaning/' },
  { icon: Triangle,  title: 'Conservatory Cleaning',desc: 'Roofs, frames, gutters & glass — full exterior clean.',           href: '/services/conservatory-cleaning/' },
]
const AREAS = [
  { n: 'Ashford',         c: 'Kent',        s: 'ashford' },
  { n: 'Tenterden',       c: 'Kent',        s: 'tenterden' },
  { n: 'Cranbrook',       c: 'Kent',        s: 'cranbrook' },
  { n: 'Headcorn',        c: 'Kent',        s: 'headcorn' },
  { n: 'Maidstone',       c: 'Kent',        s: 'maidstone' },
  { n: 'Folkestone',      c: 'Kent',        s: 'folkestone' },
  { n: 'Tonbridge',       c: 'Kent',        s: 'tonbridge' },
  { n: 'Tunbridge Wells', c: 'Kent',        s: 'tunbridge-wells' },
  { n: 'Rye',             c: 'East Sussex', s: 'rye' },
  { n: 'Battle',          c: 'East Sussex', s: 'battle' },
  { n: 'Hastings',        c: 'East Sussex', s: 'hastings' },
  { n: 'Bexhill',         c: 'East Sussex', s: 'bexhill' },
]
const REVIEWS = [
  { q: 'Andy and his team transformed our overgrown garden. Incredibly professional, reliable and great value.', name: 'Sarah M.',  loc: 'Ashford, Kent' },
  { q: 'Used Ticehurst for lawn maintenance for over a year. Always on time, always brilliant results.',          name: 'James T.',  loc: 'Tenterden, Kent' },
  { q: 'The exterior window and conservatory cleaning was outstanding. Would definitely recommend.',              name: 'Rachel B.', loc: 'Headcorn, Kent' },
  { q: 'Hedges cut, patio jet washed and gutters cleared in one visit. Excellent work at a fair price.',         name: 'Linda R.',  loc: 'Rye, East Sussex' },
  { q: 'Full garden clearance — completely overgrown and now it looks incredible. Fast, friendly and professional.',name:'David K.',  loc: 'Cranbrook, Kent' },
  { q: 'Reliable, hardworking, results speak for themselves. Our garden is always immaculate. Great team.',      name: 'Mark P.',   loc: 'Battle, East Sussex' },
]

function SvcCard({ icon: Icon, title, desc, href, dark=false }: { icon: React.ElementType, title: string, desc: string, href: string, dark?: boolean }) {
  return (
    <Link href={href} className={`group flex flex-col gap-3 p-5 rounded-xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${dark ? 'bg-white/[0.06] border-white/[0.12] hover:border-tlight/40' : 'bg-white border-pebble hover:border-tlight'}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${dark ? 'bg-sage/20 group-hover:bg-sage/35' : 'bg-foam group-hover:bg-mist'}`}>
        <Icon size={20} className={dark ? 'text-mid' : 'text-forest'} strokeWidth={1.8} />
      </div>
      <h3 className={`font-head font-black text-lg uppercase tracking-wide leading-tight ${dark ? 'text-white' : 'text-forest'}`}>{title}</h3>
      <p className={`text-[13.5px] leading-relaxed flex-1 ${dark ? 'text-tlight' : 'text-bark'}`}>{desc}</p>
      <span className={`inline-flex items-center gap-1.5 text-xs font-bold font-head uppercase tracking-wider transition-all group-hover:gap-2.5 ${dark ? 'text-mid' : 'text-sage group-hover:text-forest'}`}>
        Learn more <ChevronRight size={13} strokeWidth={2} />
      </span>
    </Link>
  )
}

function Stars() {
  return <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><Star key={i} size={13} className="fill-amber-400 text-amber-500" strokeWidth={0.5} />)}</div>
}


const LOCAL_BUSINESS_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Ticehurst Grounds & Gardens",
  "description": "Professional garden maintenance and exterior cleaning across Kent and East Sussex.",
  "url": "https://www.ticehurstgroundsandgardens.co.uk/",
  "telephone": "+447700000000",
  "email": "ticehurstgg@gmail.com",
  "priceRange": "££",
  "address": { "@type": "PostalAddress", "addressLocality": "Ticehurst", "addressRegion": "East Sussex", "addressCountry": "GB", "postalCode": "TN5" },
  "geo": { "@type": "GeoCoordinates", "latitude": 51.0366, "longitude": 0.3902 },
  "areaServed": [
    {"@type":"AdministrativeArea","name":"Kent"},{"@type":"AdministrativeArea","name":"East Sussex"},
    {"@type":"City","name":"Ashford"},{"@type":"City","name":"Tunbridge Wells"},{"@type":"City","name":"Maidstone"},{"@type":"City","name":"Tenterden"}
  ],
  "sameAs": ["https://www.instagram.com/ticehurstgg"],
  "openingHoursSpecification": [
    {"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"opens":"07:30","closes":"18:00"},
    {"@type":"OpeningHoursSpecification","dayOfWeek":"Saturday","opens":"08:00","closes":"16:00"}
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Garden & Exterior Cleaning Services",
    "itemListElement": [
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Lawn Care"}},
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Garden Maintenance"}},
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Window Cleaning"}},
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Gutter Clearing"}},
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Jet Washing"}},
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Solar Panel Cleaning"}}
    ]
  }
})

export default function Home() {
  return (
    <>
      <Nav />

      {/* ── HERO ── */}
      <header className="bg-forest overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(circle at 72% 28%,rgba(90,154,106,.14),transparent 55%)'}} />
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-0 relative z-10">
          {/* KEY FIX: grid-cols-1 on mobile, lg:grid-cols-2 on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start pb-14">

            {/* Copy — shows second on mobile (order-2 lg:order-1) */}
            <div className="order-2 lg:order-1 lg:pt-4">
              <div className="inline-flex items-center gap-2 bg-sage/15 border border-tlight/30 rounded-full px-3.5 py-1.5 text-[11px] font-bold font-head uppercase tracking-widest text-tlight mb-5">
                <MapPin size={11} className="text-mid" strokeWidth={2} />Kent &amp; East Sussex
              </div>
              <div className="font-head uppercase leading-[0.88] mb-5">
                <span className="block font-black text-white" style={{fontSize:'clamp(50px,7vw,84px)',letterSpacing:'-0.01em'}}>Ticehurst</span>
                <span className="block font-bold text-mid" style={{fontSize:'clamp(18px,2.8vw,32px)',letterSpacing:'0.13em'}}>Grounds &amp; Gardens</span>
              </div>
              <h1 className="sr-only">Professional Gardeners &amp; Exterior Cleaning in Kent &amp; East Sussex</h1>
              <p className="text-base text-tlight/80 leading-relaxed max-w-[440px] mb-6 font-light">
                A professional, friendly multi-team business specialising in garden maintenance and exterior cleaning across Kent &amp; East Sussex.
              </p>
              <div className="flex flex-wrap gap-2 mb-7">
                {['Free quotes','Multi-team','5★ rated','Fully insured'].map(b=>(
                  <span key={b} className="inline-flex items-center gap-1.5 bg-sage/15 border border-tlight/25 rounded-full px-3 py-1 text-xs font-semibold text-tlight">
                    <CheckCircle2 size={11} className="text-mid" strokeWidth={2} />{b}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/quote/" className="flex items-center gap-2 bg-sage text-white font-head font-black text-sm uppercase tracking-wider px-6 py-3 rounded-full hover:bg-moss transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  <Zap size={14} strokeWidth={2} />Get an instant estimate
                </Link>
                <Link href="https://wa.me/447700000000" className="flex items-center gap-2 bg-transparent text-white border-2 border-white/30 font-head font-black text-sm uppercase tracking-wider px-6 py-3 rounded-full hover:bg-white/10 transition-all">
                  <Mail size={14} strokeWidth={2} />WhatsApp Andy
                </Link>
              </div>
            </div>

            {/* Form card — shows first on mobile */}
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-2xl border-2 border-pebble p-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest to-sage" />
                <h2 className="font-head font-black text-xl uppercase tracking-wide text-forest mb-1">Get a Free Quote</h2>
                <p className="text-sm text-bark mb-4">No obligation — just friendly, professional advice.</p>
                <form className="space-y-3" action="/contact/thanks" method="POST">
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
                    <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Service needed</label>
                    <select name="service" className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors">
                      <option value="">Select a service…</option>
                      {['Lawn Care','Garden Maintenance','Hedge & Tree Care','Garden Clearance','Fencing','Window Cleaning','Gutter Clearing','Solar Panel Cleaning','Jet Washing','Conservatory Cleaning','Multiple services'].map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Your town</label>
                    <input name="town" placeholder="e.g. Ashford, Tenterden…" className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Tell us more</label>
                    <textarea name="message" rows={3} placeholder="Describe what you need help with…" className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors resize-none" />
                  </div>
                  <button type="submit" className="w-full bg-forest text-white font-head font-black text-sm uppercase tracking-wider py-3.5 rounded-full hover:bg-moss transition-all flex items-center justify-center gap-2">
                    <ArrowRight size={14} strokeWidth={2} />Send message
                  </button>
                  <p className="text-center text-[11px] text-stone">We&#39;ll reply within 24 hours. No spam, ever.</p>
                </form>
              </div>
              <p className="text-center mt-3">
                <Link href="/quote/" className="text-mid/80 hover:text-mid text-sm underline underline-offset-2 transition-colors">
                  Want a price estimate? Try our instant quote tool →
                </Link>
              </p>
            </div>
          </div>
        </div>
        <Wave fromColor="#1C3D2A" toColor="#2E6044" path="M0,0 C240,70 480,0 720,35 C960,70 1200,10 1440,40 L1440,70 L0,70 Z" />
      </header>

      {/* Stats */}
      <div className="bg-moss">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {[{n:'200+',l:'Gardens maintained'},{n:'6+',l:'Years in Kent'},{n:'5★',l:'Customer rating'},{n:'12',l:'Areas covered'}].map((s,i)=>(
              <div key={i} className="text-center py-7 px-5">
                <div className="font-head font-black text-4xl text-mid leading-none mb-1">{s.n}</div>
                <div className="text-sm text-tlight">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Wave fromColor="#2E6044" toColor="#F4F1EC" path="M0,20 C400,65 800,0 1200,45 C1330,60 1400,25 1440,20 L1440,65 L0,65 Z" height={65} />

      {/* Gardening */}
      <section id="gardening" className="bg-cream py-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="font-head font-bold text-sm uppercase tracking-[0.18em] text-sage mb-2">Gardening services</p>
          <h2 className="font-head font-black text-[clamp(28px,4vw,46px)] uppercase tracking-wide text-forest leading-none mb-4">Gardening &amp; Grounds Care</h2>
          <p className="text-bark text-[15px] leading-relaxed max-w-2xl mb-10">From weekly lawn care to full garden clearances — professional gardening across Kent &amp; East Sussex.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{GARD.map(s=><SvcCard key={s.href} {...s} />)}</div>
        </div>
      </section>

      <Wave fromColor="#F4F1EC" toColor="#1C3D2A" path="M0,30 C320,68 680,0 1040,50 C1220,65 1360,20 1440,30 L1440,68 L0,68 Z" height={68} />

      {/* Exterior cleaning */}
      <section id="cleaning" className="bg-forest py-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="font-head font-bold text-sm uppercase tracking-[0.18em] text-tlight mb-2">Exterior cleaning services</p>
          <h2 className="font-head font-black text-[clamp(28px,4vw,46px)] uppercase tracking-wide text-white leading-none mb-4">Exterior Cleaning</h2>
          <p className="text-tlight text-[15px] leading-relaxed max-w-2xl mb-10">Window cleaning, gutter clearing, solar panels, jet washing, building &amp; cladding — the complete exterior cleaning service.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{CLEAN.map(s=><SvcCard key={s.href} {...s} dark />)}</div>
        </div>
      </section>

      <Wave fromColor="#1C3D2A" toColor="#FFFFFF" path="M0,20 C400,68 800,0 1200,55 C1330,68 1400,28 1440,20 L1440,68 L0,68 Z" height={68} />

      {/* Why us */}
      <section id="about" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div>
            <p className="font-head font-bold text-sm uppercase tracking-[0.18em] text-sage mb-2">Why Ticehurst</p>
            <h2 className="font-head font-black text-[clamp(26px,3.5vw,42px)] uppercase tracking-wide text-forest leading-none mb-5">Your Local Kent &amp; East Sussex Experts</h2>
            <p className="text-bark text-[15px] leading-relaxed mb-7">A friendly, professional multi-team business covering both garden maintenance and exterior cleaning.</p>
            <div className="flex flex-col gap-4">
              {[{n:'01',t:'Genuinely local',d:'Based in Kent, working across Kent and East Sussex. We know local gardens, soils and conditions.'},
                {n:'02',t:'One team, two services',d:'Garden maintenance and exterior cleaning from the same trusted team.'},
                {n:'03',t:'Multi-person teams',d:'More hands, faster results — professional teams that deliver without cutting corners.'},
                {n:'04',t:'Honest pricing',d:'Free, no-obligation quotes. Clear, transparent pricing — no hidden costs, ever.'},
              ].map(w=>(
                <div key={w.n} className="flex gap-4 bg-cream border border-pebble rounded-xl p-4">
                  <div className="font-head font-black text-[28px] text-mist leading-none flex-shrink-0 min-w-[28px]">{w.n}</div>
                  <div><p className="font-head font-black text-base uppercase tracking-wide text-forest mb-1">{w.t}</p><p className="text-[13.5px] text-bark leading-relaxed">{w.d}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="bg-forest rounded-2xl aspect-[4/5] flex items-center justify-center relative overflow-hidden">
              <p className="text-tlight/60 font-head text-lg text-center px-10">Professional garden &amp; grounds care across Kent</p>
              <div className="absolute bottom-4 -right-2 bg-white rounded-xl p-4 flex gap-3 items-center shadow-2xl">
                <div className="w-10 h-10 bg-foam rounded-lg flex items-center justify-center"><Star size={18} className="fill-amber-400 text-amber-500" strokeWidth={0.5} /></div>
                <div><b className="block text-[15px] text-forest">5-star rated</b><span className="text-[11px] text-bark">Trusted across Kent</span></div>
              </div>
            </div>
            <div className="mt-5 bg-cream border border-pebble rounded-xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-head font-black text-base uppercase tracking-wide text-forest">Want a price estimate?</p>
                <p className="text-[13px] text-bark mt-0.5">Use our instant quote calculator — takes 2 minutes.</p>
              </div>
              <Link href="/quote/" className="flex-shrink-0 flex items-center gap-2 bg-sage text-white font-head font-black text-sm uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-moss transition-colors whitespace-nowrap">
                Get estimate <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-white pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="font-head font-bold text-sm uppercase tracking-[0.18em] text-sage mb-2">Customer reviews</p>
          <h2 className="font-head font-black text-[clamp(26px,3.5vw,42px)] uppercase tracking-wide text-forest leading-none mb-4">What Our Customers Say</h2>
          <p className="text-bark text-[15px] mb-9">Trusted by homeowners and businesses across Kent &amp; East Sussex.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REVIEWS.map((r,i)=>(
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

      <Wave fromColor="#FFFFFF" toColor="#EDF7EF" path="M0,35 C480,0 960,68 1440,25 L1440,68 L0,68 Z" height={68} />

      {/* Areas */}
      <section id="areas" className="bg-foam py-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="font-head font-bold text-sm uppercase tracking-[0.18em] text-sage mb-2">Where we work</p>
          <h2 className="font-head font-black text-[clamp(26px,3.5vw,42px)] uppercase tracking-wide text-forest leading-none mb-4">Areas Covered — Kent &amp; East Sussex</h2>
          <p className="text-bark text-[15px] leading-relaxed max-w-2xl mb-8">We serve 12 towns and their surrounding villages.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {AREAS.map(a=>(
              <Link key={a.s} href={`/areas/${a.s}/`} className="bg-white border border-pebble rounded-xl p-4 flex items-center gap-3 hover:border-sage hover:bg-foam transition-all hover:-translate-y-0.5 group">
                <MapPin size={13} className="text-sage flex-shrink-0" strokeWidth={2} />
                <div><div className="font-head font-bold uppercase tracking-wide text-forest text-[13px] group-hover:text-moss transition-colors">{a.n}</div><div className="text-[10px] text-bark">{a.c}</div></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Wave fromColor="#EDF7EF" toColor="#FFFFFF" path="M0,20 C360,58 720,0 1080,38 L1440,22 L1440,58 L0,58 Z" height={58} />

      {/* Process */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="font-head font-bold text-sm uppercase tracking-[0.18em] text-sage mb-2">Simple to get started</p>
          <h2 className="font-head font-black text-[clamp(26px,3.5vw,42px)] uppercase tracking-wide text-forest leading-none mb-10">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{n:1,t:'Get in touch',d:'WhatsApp Andy or message via Instagram.'},{n:2,t:'Free site visit',d:'We visit and give you a free, no-obligation quote.'},{n:3,t:'We get to work',d:'Professional team, fully equipped — exceptional results.'},{n:4,t:'Enjoy the result',d:'Beautiful garden, sparkling windows, clear gutters.'}].map(s=>(
              <div key={s.n} className="text-center">
                <div className="w-12 h-12 bg-white border-2 border-sage rounded-full flex items-center justify-center mx-auto mb-4 font-head font-black text-xl text-forest">{s.n}</div>
                <h3 className="font-head font-black text-base uppercase tracking-wide text-forest mb-2">{s.t}</h3>
                <p className="text-[13px] text-bark leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-head font-black text-[clamp(26px,3.5vw,42px)] uppercase tracking-wide text-forest leading-none mb-10 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {[
              {q:'What areas do you cover?',a:'Ashford, Tenterden, Cranbrook, Headcorn, Maidstone, Folkestone, Tonbridge and Tunbridge Wells in Kent, plus Rye, Battle, Hastings and Bexhill in East Sussex.'},
              {q:'Do you clean solar panels in Kent?',a:'Yes. Dirty panels lose 15–30% efficiency. We use a pure water system — no chemicals, streak-free results.'},
              {q:'Can you handle gardening and cleaning on the same visit?',a:'Absolutely. Our multi-team operation means we can tackle your lawn, hedges, gutters and windows in one visit.'},
              {q:'Do you offer regular contracts?',a:'Yes — weekly, fortnightly or monthly for both garden maintenance and exterior cleaning.'},
              {q:'Are your quotes free?',a:"Yes. All quotes are free and no-obligation. WhatsApp Andy or message via Instagram and we'll visit to provide an honest estimate."},
            ].map((f,i)=>(
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
      <section className="bg-forest py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-head font-bold text-sm uppercase tracking-[0.18em] text-tlight mb-2">Ready?</p>
            <h2 className="font-head font-black text-[clamp(26px,3.5vw,42px)] uppercase tracking-wide text-white leading-none mb-4">Get a Free, No-Obligation Quote</h2>
            <p className="text-tlight text-[15px] leading-relaxed mb-6">Contact Andy directly. Free, honest quotes with no pressure, ever.</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-[14px] text-tlight"><Mail size={15} className="text-mid flex-shrink-0" /><a href="https://wa.me/447700000000" className="text-mid font-semibold">ticehurstgg@gmail.com</a></div>
              <div className="flex items-center gap-3 text-[14px] text-tlight"><span className="text-mid">📷</span><a href="https://www.instagram.com/ticehurstgg" target="_blank" rel="noopener" className="text-mid font-semibold">@ticehurstgg</a></div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link href="/quote/" className="flex items-center justify-center gap-2 bg-sage text-white font-head font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-mid transition-all hover:-translate-y-0.5">
              <Zap size={15} strokeWidth={2} />Get an instant estimate
            </Link>
            <a href="https://wa.me/447700000000" className="flex items-center justify-center gap-2 bg-white text-forest font-head font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-mist transition-all hover:-translate-y-0.5">
              <Mail size={15} strokeWidth={2} />WhatsApp Andy now
            </a>
            <Link href="/contact/" className="flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white/30 font-head font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-white/10 transition-all">
              Use the quote form
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
