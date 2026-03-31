'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, Menu, X } from 'lucide-react'
import { motion, AnimatePresence, useScroll } from 'motion/react'

const NAV_LINKS = [
  { label: 'Gardening',        href: '/#gardening' },
  { label: 'Exterior Cleaning',href: '/#cleaning'  },
  { label: 'Areas',            href: '/areas/'      },
  { label: 'Get a Quote',      href: '/quote/'      },
  { label: 'Reviews',          href: '/reviews/'     },
  { label: 'About',            href: '/about/'      },
  { label: 'Contact',          href: '/contact/'    },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  const { scrollY } = useScroll()

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (y) => setScrolled(y > 20))
    return () => unsubscribe()
  }, [scrollY])

  return (
    <>
      {/* Topbar */}
      <div className="bg-charcoal text-center py-2 px-4 text-sm text-tlight relative z-50">
        <strong className="text-white">Free, no-obligation quotes</strong>
        {' '}— Garden &amp; exterior cleaning across Kent &amp; East Sussex &nbsp;·&nbsp;
        <a href="https://wa.me/447700000000" className="text-mid underline underline-offset-2 hover:text-white transition-colors">WhatsApp Andy</a>
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
                {NAV_LINKS.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.25 }}
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
