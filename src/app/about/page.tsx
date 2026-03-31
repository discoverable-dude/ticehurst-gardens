import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Wave from '@/components/Wave'
import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'
import { GallerySection } from '@/components/Gallery'

export const metadata: Metadata = {
  title: 'About Us | Ticehurst Grounds & Gardens',
  description: '...',
  alternates: { canonical: 'https://www.ticehurstgroundsandgardens.co.uk/about/' },
}

export default function AboutPage() {
  return (
    <>
      <Nav />

      <header className="bg-forest overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-14">
          <nav className="flex items-center gap-2 text-xs text-mid font-medium mb-4">
            <a href="/" className="text-mid hover:text-tlight">Home</a>
            <span className="text-tlight/40">›</span>
            <span className="text-white">About</span>
          </nav>
          <h1 className="font-head font-black text-[clamp(30px,5vw,56px)] uppercase tracking-wide text-white leading-none mb-4">
            About<br /><span className="text-mid">Ticehurst G&amp;G</span>
          </h1>
          <p className="text-tlight text-[15px] leading-relaxed max-w-[480px]">
            A professional and friendly multi-team maintenance business based in Kent.
          </p>
        </div>
        <Wave fromColor="#1C3D2A" toColor="#F4F1EC" path="M0,20 C360,65 720,5 1080,45 C1260,60 1380,15 1440,20 L1440,65 L0,65 Z" height={65} />
      </header>

      <section className="bg-cream py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <p className="font-head font-bold text-sm uppercase tracking-[0.18em] text-sage mb-2">Our story</p>
              <h2 className="font-head font-black text-[clamp(24px,3vw,38px)] uppercase tracking-wide text-forest leading-none mb-6">
                Professional, Friendly &amp; Local
              </h2>
              <p className="text-bark text-[15px] leading-relaxed mb-4">
                Ticehurst Grounds &amp; Gardens is a professional multi-team maintenance business specialising in garden care and exterior cleaning across Kent and East Sussex. We were founded on a simple belief — that every customer deserves reliable, high-quality work at a fair price.
              </p>
              <p className="text-bark text-[15px] leading-relaxed mb-4">
                We&apos;re not a faceless national company. We&apos;re a local team that takes genuine pride in every garden we maintain and every building we clean. Our people are experienced, fully equipped and passionate about delivering results that exceed expectations.
              </p>
              <p className="text-bark text-[15px] leading-relaxed">
                One of our key advantages is our dual capability — we handle both garden maintenance and exterior cleaning. That means you only need one trusted team for everything outside your home.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { n: '200+', t: 'Gardens maintained',    d: 'Homes and businesses across Kent and East Sussex.' },
                { n: '6+',   t: 'Years trading in Kent', d: 'Building a trusted reputation since our founding.' },
                { n: '12',   t: 'Areas covered',         d: 'Serving towns and villages across both counties.' },
                { n: '5★',   t: 'Customer rating',       d: 'Consistently five-star reviews from our customers.' },
              ].map(s => (
                <div key={s.n} className="bg-white border border-pebble rounded-xl p-5">
                  <div className="font-head font-black text-[34px] text-sage leading-none mb-1">{s.n}</div>
                  <p className="font-head font-black text-[15px] uppercase tracking-wide text-forest mb-1">{s.t}</p>
                  <p className="text-[13px] text-bark">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Wave fromColor="#F4F1EC" toColor="#FFFFFF" />

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="font-head font-bold text-sm uppercase tracking-[0.18em] text-sage mb-2">What we offer</p>
          <h2 className="font-head font-black text-[clamp(24px,3vw,38px)] uppercase tracking-wide text-forest leading-none mb-4">
            Two Services, One Trusted Team
          </h2>
          <p className="text-bark text-[15px] leading-relaxed max-w-xl mb-10">
            Most exterior home care companies specialise in just one area. We cover both — less hassle and better value for you.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-cream border border-pebble rounded-2xl p-7">
              <p className="font-head font-bold text-sm uppercase tracking-[0.18em] text-sage mb-3">Gardening services</p>
              <h3 className="font-head font-black text-xl uppercase tracking-wide text-forest mb-4">Garden &amp; Grounds Care</h3>
              <ul className="flex flex-col gap-2 mb-6">
                {['Lawn Care','Garden Maintenance','Hedge & Tree Care','Garden Clearances','Border & Bed Design','Fencing'].map(s=>(
                  <li key={s} className="text-[13.5px] text-moss font-medium flex items-baseline gap-2">
                    <span className="w-1.5 h-1.5 bg-sage rounded-full flex-shrink-0 mt-1.5" />{s}
                  </li>
                ))}
              </ul>
              <Link href="/#gardening" className="inline-flex items-center gap-2 bg-forest text-white font-head font-black text-sm uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-moss transition-colors">
                View services <ArrowRight size={13} />
              </Link>
            </div>
            <div className="bg-forest rounded-2xl p-7">
              <p className="font-head font-bold text-sm uppercase tracking-[0.18em] text-tlight mb-3">Exterior cleaning services</p>
              <h3 className="font-head font-black text-xl uppercase tracking-wide text-white mb-4">Exterior Cleaning</h3>
              <ul className="flex flex-col gap-2 mb-6">
                {['Window Cleaning','Gutter Clearing','Solar Panel Cleaning','Jet Washing','Building & Cladding Cleaning','Conservatory Cleaning'].map(s=>(
                  <li key={s} className="text-[13.5px] text-mid font-medium flex items-baseline gap-2">
                    <span className="w-1.5 h-1.5 bg-sage rounded-full flex-shrink-0 mt-1.5" />{s}
                  </li>
                ))}
              </ul>
              <Link href="/#cleaning" className="inline-flex items-center gap-2 bg-transparent text-white border-2 border-white/30 font-head font-black text-sm uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors">
                View services <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Wave fromColor="#FFFFFF" toColor="#FFFFFF" />

      {/* Gallery */}
      <GallerySection
        subheading="Our work"
        heading="The Team in Action"
        description="Photos of our team at work across Kent & East Sussex — coming soon."
        count={6}
        columns={3}
        labels={[
          'Garden transformation',
          'Lawn maintenance',
          'Hedge trimming',
          'Jet washing results',
          'Window cleaning',
          'The team on site',
        ]}
      />

      <Footer />
    </>
  )
}
