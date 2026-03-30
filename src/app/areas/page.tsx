import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Wave from '@/components/Wave'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Areas We Cover — Kent & East Sussex | Ticehurst Grounds & Gardens',
  description: '...',
  alternates: { canonical: 'https://www.ticehurstgroundsandgardens.co.uk/areas/' },
}

const AREAS = [
  { slug: 'ashford',         name: 'Ashford',         county: 'Kent',         desc: 'Garden maintenance & exterior cleaning across Ashford and surrounding villages.' },
  { slug: 'tenterden',       name: 'Tenterden',       county: 'Kent',         desc: 'Serving Tenterden town and the surrounding Weald villages.' },
  { slug: 'cranbrook',       name: 'Cranbrook',       county: 'Kent',         desc: 'Covering Cranbrook, Goudhurst, Sissinghurst and the High Weald.' },
  { slug: 'headcorn',        name: 'Headcorn',        county: 'Kent',         desc: 'Headcorn and Mid-Kent villages including Sutton Valence and Ulcombe.' },
  { slug: 'maidstone',       name: 'Maidstone',       county: 'Kent',         desc: 'Full garden and cleaning services across Maidstone and surrounding areas.' },
  { slug: 'folkestone',      name: 'Folkestone',      county: 'Kent',         desc: 'Folkestone, Hythe, Cheriton, Hawkinge and the surrounding coastal areas.' },
  { slug: 'tonbridge',       name: 'Tonbridge',       county: 'Kent',         desc: 'Tonbridge, Hadlow, Hildenborough and surrounding Mid-Kent villages.' },
  { slug: 'tunbridge-wells', name: 'Tunbridge Wells', county: 'Kent',         desc: 'Tunbridge Wells, Southborough, Pembury, Rusthall and Speldhurst.' },
  { slug: 'rye',             name: 'Rye',             county: 'East Sussex',  desc: 'Rye, Winchelsea, Camber, Iden, Northiam and surrounding villages.' },
  { slug: 'battle',          name: 'Battle',          county: 'East Sussex',  desc: 'Battle, Sedlescombe, Netherfield, Catsfield and surrounding areas.' },
  { slug: 'hastings',        name: 'Hastings',        county: 'East Sussex',  desc: 'Hastings and St Leonards-on-Sea.' },
  { slug: 'bexhill',         name: 'Bexhill-on-Sea',  county: 'East Sussex',  desc: 'Bexhill, Cooden, Little Common and the surrounding coastal area.' },
]

export default function AreasPage() {
  return (
    <>
      <Nav />

      <header className="bg-forest overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-14">
          <h1 className="font-head font-black text-[clamp(30px,5vw,56px)] uppercase tracking-wide text-white leading-none mb-4">
            Areas<br /><span className="text-mid">We Cover</span>
          </h1>
          <p className="text-tlight text-[15px] leading-relaxed max-w-[520px]">
            Professional garden maintenance and exterior cleaning across 12 areas of Kent and East Sussex. Select your location for localised services and a free quote.
          </p>
        </div>
        <Wave fromColor="#1C3D2A" toColor="#F4F1EC" path="M0,20 C360,65 720,5 1080,45 C1260,60 1380,15 1440,20 L1440,65 L0,65 Z" height={65} />
      </header>

      <section className="bg-cream py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AREAS.map(a => (
              <Link
                key={a.slug}
                href={`/areas/${a.slug}`}
                className="group bg-white border border-pebble rounded-xl p-5 flex flex-col gap-3 hover:border-sage hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-foam rounded-lg flex items-center justify-center group-hover:bg-mist transition-colors flex-shrink-0">
                    <MapPin size={16} className="text-forest" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h2 className="font-head font-black text-[16px] uppercase tracking-wide text-forest leading-tight group-hover:text-moss transition-colors">{a.name}</h2>
                    <p className="text-[10px] text-stone uppercase tracking-wider font-semibold">{a.county}</p>
                  </div>
                </div>
                <p className="text-[13px] text-bark leading-relaxed flex-1">{a.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold font-head uppercase tracking-wider text-sage group-hover:text-forest group-hover:gap-2.5 transition-all">
                  View services <ArrowRight size={12} strokeWidth={2} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
