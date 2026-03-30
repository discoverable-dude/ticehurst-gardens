import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Wave from '@/components/Wave'
import { Mail, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: 'Contact Us — Free Quotes | Ticehurst Grounds & Gardens',
  description: '...',
  alternates: { canonical: 'https://www.ticehurstgroundsandgardens.co.uk/contact/' },
}

export default function ContactPage() {
  return (
    <>
      <Nav />

      <header className="bg-forest overflow-hidden relative">
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-14 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-mid font-medium mb-4">
            <a href="/" className="text-mid hover:text-tlight transition-colors">Home</a>
            <span className="text-tlight/40">›</span>
            <span className="text-white">Contact</span>
          </nav>
          <h1 className="font-head font-black text-[clamp(32px,5vw,58px)] uppercase tracking-wide text-white leading-none mb-4">
            Get a Free<br /><span className="text-mid">No-Obligation Quote</span>
          </h1>
          <p className="text-tlight text-[15px] leading-relaxed max-w-[480px]">
            Contact Andy directly. Free, honest quotes with no pressure, ever.
          </p>
        </div>
        <Wave fromColor="#1C3D2A" toColor="#F4F1EC" path="M0,20 C360,65 720,5 1080,45 C1260,60 1380,15 1440,20 L1440,65 L0,65 Z" height={65} />
      </header>

      <section className="bg-cream py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left — contact info */}
            <div>
              <h2 className="font-head font-black text-[clamp(24px,3vw,36px)] uppercase tracking-wide text-forest leading-none mb-6">
                Contact Andy
              </h2>
              <p className="text-bark text-[15px] leading-relaxed mb-8">
                Fill in the form or use the contact details below. We aim to respond within 24 hours and arrange a free site visit at a time that suits you.
              </p>

              <div className="flex flex-col gap-4 mb-10">
                {[
                  {
                    icon: Mail,
                    label: 'Email',
                    value: 'ticehurstgg@gmail.com',
                    href: 'mailto:ticehurstgg@gmail.com',
                  },
                  {
                    icon: ExternalLink,
                    label: 'Instagram',
                    value: '@ticehurstgg',
                    href: 'https://www.instagram.com/ticehurstgg',
                    external: true,
                  },
                ].map(({ icon: Icon, label, value, href, external }) => (
                  <a
                    key={label}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 bg-white border border-pebble rounded-xl px-5 py-4 hover:border-sage transition-colors group"
                  >
                    <div className="w-10 h-10 bg-foam rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-mist transition-colors">
                      <Icon size={18} className="text-forest" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="font-head font-bold text-[11px] uppercase tracking-wider text-forest mb-0.5">{label}</p>
                      <p className="text-[15px] font-semibold text-sage">{value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="bg-foam border border-pebble rounded-xl p-5">
                <p className="font-head font-bold text-[11px] uppercase tracking-wider text-forest mb-2">Areas we cover</p>
                <p className="text-[13px] text-bark leading-relaxed">
                  Ashford · Tenterden · Cranbrook · Headcorn · Maidstone · Folkestone · Tonbridge · Tunbridge Wells · Rye · Battle · Hastings · Bexhill
                </p>
              </div>
            </div>

            {/* Right — form */}
            <div className="bg-white rounded-2xl border-2 border-pebble p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest to-sage" />
              <h2 className="font-head font-black text-xl uppercase tracking-wide text-forest mb-1">Send a Message</h2>
              <p className="text-sm text-bark mb-6">We&apos;ll get back to you within 24 hours.</p>
              <form className="space-y-4" action="/contact/thanks" method="POST">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Your name *</label>
                    <input name="name" required placeholder="Your name" className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Phone *</label>
                    <input name="phone" type="tel" required placeholder="07XXX XXXXXX" className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Email</label>
                  <input name="email" type="email" placeholder="you@email.com" className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Service needed</label>
                  <select name="service" className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors">
                    <option value="">Select a service…</option>
                    <optgroup label="Gardening">
                      {['Lawn Care','Garden Maintenance','Hedge & Tree Care','Garden Clearance','Border & Bed Design','Fencing'].map(o=><option key={o}>{o}</option>)}
                    </optgroup>
                    <optgroup label="Exterior Cleaning">
                      {['Window Cleaning','Gutter Clearing','Solar Panel Cleaning','Jet Washing','Building & Cladding Cleaning','Conservatory Cleaning'].map(o=><option key={o}>{o}</option>)}
                    </optgroup>
                    <option>Multiple services</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Your town / area</label>
                  <input name="town" placeholder="e.g. Ashford, Tenterden…" className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-forest uppercase tracking-wider">Tell us about your project</label>
                  <textarea name="message" rows={4} placeholder="Describe what you need help with…" className="px-3 py-2.5 border-[1.5px] border-pebble rounded-lg text-sm bg-cream focus:border-sage focus:bg-white outline-none transition-colors resize-none" />
                </div>
                <button type="submit" className="w-full bg-forest text-white font-head font-black text-sm uppercase tracking-wider py-4 rounded-full hover:bg-moss transition-all flex items-center justify-center gap-2">
                  <Mail size={15} strokeWidth={2} />
                  Send message
                </button>
                <p className="text-center text-[11px] text-stone">We&apos;ll get back to you within 24 hours. No spam, ever.</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
