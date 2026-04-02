'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, Menu, X, ChevronDown, Leaf, Sparkles } from 'lucide-react'
import { motion, AnimatePresence, useScroll } from 'motion/react'

const NAV_SERVICES = {
  gardening: {
    label: 'Gardening',
    icon: Leaf,
    items: [
      { name: 'Lawn Care',           href: '/services/lawn-care/' },
      { name: 'Garden Maintenance',  href: '/services/garden-maintenance/' },
      { name: 'Hedge & Tree Care',   href: '/services/hedge-tree-care/' },
      { name: 'Garden Clearances',   href: '/services/garden-clearances/' },
      { name: 'Border & Bed Design', href: '/services/borders-beds/' },
      { name: 'Fencing',             href: '/services/fencing/' },
    ],
  },
  cleaning: {
    label: 'Exterior Cleaning',
    icon: Sparkles,
    items: [
      { name: 'Window Cleaning',       href: '/services/window-cleaning/' },
      { name: 'Gutter Clearing',       href: '/services/gutter-clearing/' },
      { name: 'Solar Panel Cleaning',  href: '/services/solar-panel-cleaning/' },
      { name: 'Jet Washing',           href: '/services/jet-washing/' },
      { name: 'Building & Cladding',   href: '/services/building-cleaning/' },
      { name: 'Conservatory Cleaning', href: '/services/conservatory-cleaning/' },
    ],
  },
}

const NAV_LINKS = [
  { label: 'Areas',       href: '/areas/' },
  { label: 'Get a Quote', href: '/quote/' },
  { label: 'Reviews',     href: '/reviews/' },
  { label: 'About',       href: '/about/' },
  { label: 'Contact',     href: '/contact/' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [svcOpen, setSvcOpen] = useState(false)
  const [svcAccordion, setSvcAccordion] = useState(false)

  const { scrollY } = useScroll()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (y) => setScrolled(y > 20))
    return () => unsubscribe()
  }, [scrollY])

  // Close desktop dropdown on Escape or click outside
  useEffect(() => {
    if (!svcOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSvcOpen(false) }
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setSvcOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick) }
  }, [svcOpen])

  const enterDropdown = useCallback(() => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null }
    setSvcOpen(true)
  }, [])

  const leaveDropdown = useCallback(() => {
    leaveTimer.current = setTimeout(() => setSvcOpen(false), 150)
  }, [])

  return (
    <>
      {/* Topbar */}
      <div className="bg-charcoal text-center py-2 px-4 text-sm text-tlight relative z-50">
        <strong className="text-white">Free, no-obligation quotes</strong>
        {' '}&mdash; Garden &amp; exterior cleaning across Kent &amp; East Sussex &nbsp;&middot;&nbsp;
        <a href="https://wa.me/447989143717" className="text-mid underline underline-offset-2 hover:text-white transition-colors">WhatsApp Andy</a>
      </div>

      {/* Nav */}
      <nav
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-md border-pebble/60'
            : 'bg-white border-pebble'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo-icon.png"
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
              priority
            />
            <div className="flex flex-col leading-none gap-px">
              <span className="font-head font-black text-xl uppercase tracking-wide text-charcoal group-hover:text-forest transition-colors">
                Ticehurst
              </span>
              <span className="font-head font-bold text-[10px] uppercase tracking-[0.14em] text-sage">
                Grounds &amp; Gardens
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Services dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={enterDropdown}
              onMouseLeave={leaveDropdown}
            >
              <button
                onClick={() => setSvcOpen(v => !v)}
                aria-expanded={svcOpen}
                aria-haspopup="true"
                className="relative flex items-center gap-1 text-[13.5px] font-medium text-bark px-3 py-2 rounded-lg hover:text-forest hover:bg-foam transition-colors group"
              >
                Services
                <ChevronDown
                  size={14}
                  strokeWidth={2}
                  className={`transition-transform duration-200 ${svcOpen ? 'rotate-180' : ''}`}
                />
                <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-sage scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
              </button>

              <AnimatePresence>
                {svcOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                    className="absolute top-full left-0 mt-1 w-[480px] bg-white rounded-xl border border-pebble shadow-xl p-5 z-50"
                    role="menu"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      {Object.entries(NAV_SERVICES).map(([key, cat]) => {
                        const Icon = cat.icon
                        return (
                          <div key={key}>
                            <div className="flex items-center gap-2 mb-3">
                              <Icon size={14} className="text-sage" strokeWidth={2} />
                              <span className="font-head font-bold text-xs uppercase tracking-[0.14em] text-sage">
                                {cat.label}
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              {cat.items.map(item => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setSvcOpen(false)}
                                  role="menuitem"
                                  className="text-sm text-bark py-1.5 px-2.5 rounded-lg hover:text-forest hover:bg-foam transition-colors"
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-4 pt-3 border-t border-pebble">
                      <Link
                        href="/services/"
                        onClick={() => setSvcOpen(false)}
                        className="text-xs font-bold font-head uppercase tracking-wider text-sage hover:text-forest transition-colors"
                      >
                        View all services &rarr;
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other links */}
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="relative text-[13.5px] font-medium text-bark px-3 py-2 rounded-lg hover:text-forest hover:bg-foam transition-colors group"
              >
                {l.label}
                <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-sage scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
              </Link>
            ))}
            <Link
              href="mailto:ticehurstgg@gmail.com"
              className="ml-2 flex items-center gap-2 bg-forest text-white font-head font-bold text-sm uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-moss hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
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
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={22} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-pebble"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {/* Services accordion */}
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05, duration: 0.25 }}
                >
                  <button
                    onClick={() => setSvcAccordion(v => !v)}
                    className="w-full flex items-center justify-between text-sm font-medium text-bark py-2.5 px-3 rounded-lg hover:text-forest hover:bg-foam transition-colors"
                  >
                    Services
                    <ChevronDown
                      size={16}
                      strokeWidth={2}
                      className={`text-sage transition-transform duration-200 ${svcAccordion ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {svcAccordion && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 pb-2">
                          {Object.entries(NAV_SERVICES).map(([key, cat]) => (
                            <div key={key} className="mb-3">
                              <span className="font-head font-bold text-[10px] uppercase tracking-[0.14em] text-sage px-3 block mb-1">
                                {cat.label}
                              </span>
                              {cat.items.map((item, j) => (
                                <motion.div
                                  key={item.href}
                                  initial={{ opacity: 0, x: -12 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.03 * j, duration: 0.2 }}
                                >
                                  <Link
                                    href={item.href}
                                    onClick={() => { setOpen(false); setSvcAccordion(false) }}
                                    className="text-[13px] text-bark py-1.5 px-3 rounded-lg hover:text-forest hover:bg-foam transition-colors block"
                                  >
                                    {item.name}
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          ))}
                          <Link
                            href="/services/"
                            onClick={() => { setOpen(false); setSvcAccordion(false) }}
                            className="text-[11px] font-bold font-head uppercase tracking-wider text-sage hover:text-forest transition-colors px-3 block mt-1"
                          >
                            View all services &rarr;
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Other links */}
                {NAV_LINKS.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * (i + 1), duration: 0.25 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium text-bark py-2.5 px-3 rounded-lg hover:text-forest hover:bg-foam transition-colors block"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.25 }}
                >
                  <Link
                    href="mailto:ticehurstgg@gmail.com"
                    onClick={() => setOpen(false)}
                    className="mt-2 flex items-center justify-center gap-2 bg-forest text-white font-head font-bold text-sm uppercase tracking-wider px-5 py-3 rounded-full hover:bg-moss transition-colors"
                  >
                    <MessageCircle size={13} />
                    Get a Free Quote
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
