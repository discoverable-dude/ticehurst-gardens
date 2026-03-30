'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Gardening',        href: '/#gardening' },
  { label: 'Exterior Cleaning',href: '/#cleaning'  },
  { label: 'Areas',            href: '/areas/'      },
  { label: 'Get a Quote',      href: '/quote/'      },
  { label: 'About',            href: '/about/'      },
  { label: 'Contact',          href: '/contact/'    },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Topbar */}
      <div className="bg-charcoal text-center py-2 px-4 text-sm text-tlight relative z-50">
        <strong className="text-white">Free, no-obligation quotes</strong>
        {' '}— Garden &amp; exterior cleaning across Kent &amp; East Sussex &nbsp;·&nbsp;
        <a href="https://wa.me/447700000000" className="text-mid underline underline-offset-2">WhatsApp Andy</a>
      </div>

      {/* Nav */}
      <nav
        className={`bg-white border-b border-pebble sticky top-0 z-40 transition-shadow duration-200 ${
          scrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none gap-px">
            <span className="font-head font-black text-2xl uppercase tracking-wide text-charcoal">
              Ticehurst
            </span>
            <span className="font-head font-bold text-[11px] uppercase tracking-[0.14em] text-sage">
              Grounds &amp; Gardens
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[13.5px] font-medium text-bark px-3 py-2 rounded-lg hover:text-forest hover:bg-foam transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="mailto:ticehurstgg@gmail.com"
              className="ml-2 flex items-center gap-2 bg-forest text-white font-head font-bold text-sm uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-moss transition-colors"
            >
              <MessageCircle size={13} />
              Free Quote
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-forest"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden bg-white border-t border-pebble px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-bark py-2.5 px-3 rounded-lg hover:text-forest hover:bg-foam transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="mailto:ticehurstgg@gmail.com"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 bg-forest text-white font-head font-bold text-sm uppercase tracking-wider px-5 py-3 rounded-full hover:bg-moss transition-colors"
            >
              <MessageCircle size={13} />
              Get a Free Quote
            </Link>
          </div>
        )}
      </nav>
    </>
  )
}
