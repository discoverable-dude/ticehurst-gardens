import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Wave from '@/components/Wave'
import Link from 'next/link'
import { Leaf, Sprout, TreePine, Trash2, Flower2, Fence, Square, Home as HomeIcon, Sun, Zap, Building2, Triangle, ArrowRight, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'All Services — Garden Maintenance & Exterior Cleaning Kent | Ticehurst Grounds & Gardens',
  description: 'Garden maintenance and exterior cleaning across Kent & East Sussex. Lawn care, window cleaning, gutter clearing, jet washing, solar panels & more. Free quotes.',
  alternates: { canonical: 'https://www.ticehurstgroundsandgardens.co.uk/services/' },
}

const schema = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://www.ticehurstgroundsandgardens.co.uk/' },
      { '@type': 'ListItem', position: 2, name: 'Services' },
    ]},
    { '@type': 'ItemList', name: 'Services offered by Ticehurst Grounds & Gardens',
      itemListElement: [
        { '@type':'ListItem', position:1,  name:'Lawn Care',                 url:'https://www.ticehurstgroundsandgardens.co.uk/services/lawn-care/' },
        { '@type':'ListItem', position:2,  name:'Garden Maintenance',        url:'https://www.ticehurstgroundsandgardens.co.uk/services/garden-maintenance/' },
        { '@type':'ListItem', position:3,  name:'Hedge & Tree Care',         url:'https://www.ticehurstgroundsandgardens.co.uk/services/hedge-tree-care/' },
        { '@type':'ListItem', position:4,  name:'Garden Clearances',         url:'https://www.ticehurstgroundsandgardens.co.uk/services/garden-clearances/' },
        { '@type':'ListItem', position:5,  name:'Window Cleaning',           url:'https://www.ticehurstgroundsandgardens.co.uk/services/window-cleaning/' },
        { '@type':'ListItem', position:6,  name:'Gutter Clearing',           url:'https://www.ticehurstgroundsandgardens.co.uk/services/gutter-clearing/' },
        { '@type':'ListItem', position:7,  name:'Solar Panel Cleaning',      url:'https://www.ticehurstgroundsandgardens.co.uk/services/solar-panel-cleaning/' },
        { '@type':'ListItem', position:8,  name:'Jet Washing',               url:'https://www.ticehurstgroundsandgardens.co.uk/services/jet-washing/' },
        { '@type':'ListItem', position:9,  name:'Fencing',                   url:'https://www.ticehurstgroundsandgardens.co.uk/services/fencing/' },
        { '@type':'ListItem', position:10, name:'Conservatory Cleaning',     url:'https://www.ticehurstgroundsandgardens.co.uk/services/conservatory-cleaning/' },
      ],
    },
  ],
})

const GARDENING = [
  { icon: Leaf,     slug: 'lawn-care',           name: 'Lawn Care',            desc: 'Mowing, aeration, scarification, seeding and seasonal treatments.' },
  { icon: Sprout,   slug: 'garden-maintenance',  name: 'Garden Maintenance',   desc: 'Weeding, pruning, planting and year-round garden upkeep.' },
  { icon: TreePine, slug: 'hedge-tree-care',     name: 'Hedge & Tree Care',    desc: 'Trimming, shaping, crown reduction and all green waste removed.' },
  { icon: Trash2,   slug: 'garden-clearances',   name: 'Garden Clearances',    desc: 'One-off or seasonal — brambles, shrubs, rubbish and full resets.' },
  { icon: Flower2,  slug: 'borders-beds',        name: 'Border & Bed Design',  desc: 'New planting schemes, seasonal colour and flower bed creation.' },
  { icon: Fence,    slug: 'fencing',             name: 'Fencing',              desc: 'Close-board, panel and post-rail installation plus repairs.' },
]
const CLEANING = [
  { icon: Square,    slug: 'window-cleaning',       name: 'Window Cleaning',          desc: 'Residential and commercial, pure water reach-and-wash system.' },
  { icon: HomeIcon,  slug: 'gutter-clearing',       name: 'Gutter Clearing',          desc: 'Clear blockages, flush downpipes, clean fascias and soffits.' },
  { icon: Sun,       slug: 'solar-panel-cleaning',  name: 'Solar Panel Cleaning',     desc: 'Restore up to 30% lost efficiency — pure water, no chemicals.' },
  { icon: Zap,       slug: 'jet-washing',           name: 'Jet Washing',              desc: 'Patios, driveways, paths, decking and block paving.' },
  { icon: Building2, slug: 'building-cleaning',     name: 'Building & Cladding',      desc: 'Weatherboard, render, brickwork and commercial buildings.' },
  { icon: Triangle,  slug: 'conservatory-cleaning', name: 'Conservatory Cleaning',    desc: 'Roofs, frames, gutters and glass — full exterior clean.' },
]

function SvcCard({ icon: Icon, slug, name, desc }: { icon: React.ElementType, slug: string, name: string, desc: string }) {
  return (
    <Link href={`/services/${slug}/`} className="group flex flex-col gap-3 p-5 bg-white rounded-xl border border-pebble hover:border-sage hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-foam group-hover:bg-mist transition-colors">
        <Icon size={20} className="text-forest" strokeWidth={1.8} />
      </div>
      <h2 className="font-head font-black text-[17px] uppercase tracking-wide text-forest leading-tight group-hover:text-moss transition-colors">{name}</h2>
      <p className="text-[13.5px] text-bark leading-relaxed flex-1">{desc}</p>
      <span className="inline-flex items-center gap-1.5 text-xs font-bold font-head uppercase tracking-wider text-sage group-hover:gap-2.5 transition-all">
        Learn more <ChevronRight size={13} strokeWidth={2} />
      </span>
    </Link>
  )
}

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <Nav />
      <header className="bg-forest overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-14">
          <nav className="flex items-center gap-2 text-xs text-mid font-medium mb-4">
            <a href="/" className="text-mid hover:text-tlight">Home</a>
            <span className="text-tlight/40">›</span>
            <span className="text-white">Services</span>
          </nav>
          <h1 className="font-head font-black text-[clamp(30px,5vw,56px)] uppercase tracking-wide text-white leading-none mb-4">
            Our Services<br /><span className="text-mid">Kent & East Sussex</span>
          </h1>
          <p className="text-tlight text-[15px] leading-relaxed max-w-[520px]">
            One company covering all your outdoor needs — garden maintenance and exterior cleaning. Free, no-obligation quotes on everything.
          </p>
        </div>
        <Wave fromColor="#1C3D2A" toColor="#F4F1EC" path="M0,20 C360,65 720,5 1080,45 C1260,60 1380,15 1440,20 L1440,65 L0,65 Z" height={65} />
      </header>
      <section className="bg-cream py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-baseline gap-3 mb-6"><p className="font-head font-bold text-[11px] uppercase tracking-[0.18em] text-sage">Gardening Services</p><div className="flex-1 h-px bg-pebble" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {GARDENING.map(s => <SvcCard key={s.slug} {...s} />)}
          </div>
          <div className="flex items-baseline gap-3 mb-6"><p className="font-head font-bold text-[11px] uppercase tracking-[0.18em] text-sage">Exterior Cleaning</p><div className="flex-1 h-px bg-pebble" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CLEANING.map(s => <SvcCard key={s.slug} {...s} />)}
          </div>
        </div>
      </section>
      <Wave fromColor="#F4F1EC" toColor="#1C3D2A" path="M0,30 C360,65 720,5 1080,45 C1260,60 1380,20 1440,30 L1440,65 L0,65 Z" height={65} />
      <section className="bg-forest py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-head font-black text-[clamp(26px,3.5vw,40px)] uppercase tracking-wide text-white leading-none mb-4">Free Quotes on All Services</h2>
            <p className="text-tlight text-[15px] leading-relaxed">Not sure what you need? WhatsApp Andy — he&apos;ll advise and visit to give a fixed, honest price with no obligation.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/quote/" className="flex-1 flex items-center justify-center gap-2 bg-sage text-white font-head font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-moss transition-all">Get instant estimate <ArrowRight size={14} /></Link>
            <a href="https://wa.me/447989143717" className="flex-1 flex items-center justify-center gap-2 bg-white text-forest font-head font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-mist transition-all">WhatsApp Andy</a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
