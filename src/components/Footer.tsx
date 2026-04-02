import Link from 'next/link'
import Image from 'next/image'
import Wave from './Wave'

const GARDENING: [string, string][] = [
  ['Lawn Care',           '/services/lawn-care/'],
  ['Garden Maintenance',  '/services/garden-maintenance/'],
  ['Hedge & Tree Care',   '/services/hedge-tree-care/'],
  ['Garden Clearances',   '/services/garden-clearances/'],
  ['Border & Bed Design', '/services/borders-beds/'],
  ['Fencing',             '/services/fencing/'],
]
const CLEANING: [string, string][] = [
  ['Window Cleaning',       '/services/window-cleaning/'],
  ['Gutter Clearing',       '/services/gutter-clearing/'],
  ['Solar Panel Cleaning',  '/services/solar-panel-cleaning/'],
  ['Jet Washing',           '/services/jet-washing/'],
  ['Building & Cladding',   '/services/building-cleaning/'],
  ['Conservatory Cleaning', '/services/conservatory-cleaning/'],
]
const AREAS: [string, string][] = [
  ['Ashford',        '/areas/ashford/'],
  ['Tenterden',      '/areas/tenterden/'],
  ['Maidstone',      '/areas/maidstone/'],
  ['Tunbridge Wells','/areas/tunbridge-wells/'],
  ['Folkestone',     '/areas/folkestone/'],
  ['Tonbridge',      '/areas/tonbridge/'],
  ['Hastings',       '/areas/hastings/'],
  ['Bexhill',        '/areas/bexhill/'],
]

export default function Footer() {
  return (
    <>
      <Wave fromColor="#1C3D2A" toColor="#1A2218" path="M0,20 C480,55 960,0 1440,30 L1440,55 L0,55 Z" height={55} />
      <footer className="bg-charcoal pt-14 pb-7" role="contentinfo">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-2.5 mb-3">
                <Image
                  src="/logo-icon.png"
                  alt=""
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain brightness-0 invert"
                />
                <div>
                  <div className="font-head font-black text-xl uppercase tracking-wider text-white leading-none">Ticehurst</div>
                  <div className="font-head font-bold text-[11px] uppercase tracking-[0.14em] text-sage">Grounds &amp; Gardens</div>
                </div>
              </Link>
              <p className="text-sm text-tlight/50 leading-relaxed mb-5">Professional garden maintenance and exterior cleaning across Kent &amp; East Sussex.</p>
              <div className="flex flex-col gap-2 text-[12.5px]">
                <a href="https://wa.me/447989143717" className="text-mid hover:text-tlight transition-colors">💬 WhatsApp Andy</a>
                <a href="mailto:ticehurstgg@gmail.com" className="text-tlight/50 hover:text-tlight transition-colors">✉ ticehurstgg@gmail.com</a>
                <a href="https://www.instagram.com/ticehurstgg" target="_blank" rel="noopener noreferrer" className="text-tlight/50 hover:text-tlight transition-colors">📷 @ticehurstgg</a>
              </div>
            </div>
            <div>
              <p className="font-head font-bold text-[11px] uppercase tracking-[0.12em] text-sage mb-3">Gardening</p>
              <nav aria-label="Gardening services"><ul className="flex flex-col gap-2">
                {GARDENING.map(([label, href]) => <li key={href}><Link href={href} className="text-[12.5px] text-tlight/50 hover:text-tlight transition-colors">{label}</Link></li>)}
              </ul></nav>
            </div>
            <div>
              <p className="font-head font-bold text-[11px] uppercase tracking-[0.12em] text-sage mb-3">Exterior Cleaning</p>
              <nav aria-label="Exterior cleaning services"><ul className="flex flex-col gap-2">
                {CLEANING.map(([label, href]) => <li key={href}><Link href={href} className="text-[12.5px] text-tlight/50 hover:text-tlight transition-colors">{label}</Link></li>)}
              </ul></nav>
            </div>
            <div>
              <p className="font-head font-bold text-[11px] uppercase tracking-[0.12em] text-sage mb-3">Areas We Cover</p>
              <nav aria-label="Service areas"><ul className="flex flex-col gap-2">
                {AREAS.map(([label, href]) => <li key={href}><Link href={href} className="text-[12.5px] text-tlight/50 hover:text-tlight transition-colors">{label}</Link></li>)}
                <li><Link href="/areas/" className="text-[12.5px] text-sage/70 hover:text-sage transition-colors">View all areas →</Link></li>
              </ul></nav>
              <p className="font-head font-bold text-[11px] uppercase tracking-[0.12em] text-sage mb-3 mt-6">Company</p>
              <nav aria-label="Company links"><ul className="flex flex-col gap-2">
                <li><Link href="/reviews/" className="text-[12.5px] text-tlight/50 hover:text-tlight transition-colors">Customer Reviews</Link></li>
                <li><Link href="/about/" className="text-[12.5px] text-tlight/50 hover:text-tlight transition-colors">About Us</Link></li>
                <li><Link href="/contact/" className="text-[12.5px] text-tlight/50 hover:text-tlight transition-colors">Contact</Link></li>
              </ul></nav>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-5 flex flex-wrap justify-between gap-3 text-[11.5px] text-tlight/30">
            <span>&copy; {new Date().getFullYear()} Ticehurst Grounds &amp; Gardens. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href="/privacy/" className="hover:text-tlight/50 transition-colors">Privacy Policy</Link>
              <span>Garden maintenance &amp; exterior cleaning — Kent &amp; East Sussex</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
