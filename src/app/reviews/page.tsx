import type { Metadata } from 'next'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Wave from '@/components/Wave'
import Link from 'next/link'
import { Star, ArrowRight, MapPin, CheckCircle2 } from 'lucide-react'
import { GallerySection } from '@/components/Gallery'
import { getReviews } from '@/lib/cms'
import { getPhotosByCategory, getPortfolioPhotos } from '@/lib/photos'

export const metadata: Metadata = {
  title: 'Customer Reviews | Ticehurst Grounds & Gardens',
  description:
    'Read what our customers say about Ticehurst Grounds & Gardens. Five-star garden maintenance and exterior cleaning across Kent & East Sussex.',
  alternates: {
    canonical: 'https://www.ticehurstgardens.co.uk/reviews/',
  },
}

export const revalidate = 60

// Reviews are now fetched from CMS in the page function below

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className="fill-amber-400 text-amber-500" strokeWidth={0.5} />
      ))}
    </div>
  )
}

export default async function ReviewsPage() {
  const cmsReviews = await getReviews()
  const [heroPhotos, portfolioPhotos] = await Promise.all([
    getPhotosByCategory('hero'),
    getPortfolioPhotos(6),
  ])
  const heroPhoto = heroPhotos[0]
  const REVIEWS = cmsReviews.map(r => ({ q: r.quote, name: r.name, loc: r.location, service: r.service || '' }))

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Ticehurst Grounds & Gardens',
    url: 'https://www.ticehurstgardens.co.uk/',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: String(REVIEWS.length),
      bestRating: '5',
      worstRating: '1',
    },
    review: REVIEWS.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      reviewBody: r.q,
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    })),
  })
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <Nav />

      {/* Hero */}
      <header className="bg-forest overflow-hidden relative">
        {heroPhoto && (
          <>
            <Image src={heroPhoto.url} alt="" fill priority className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-forest/80" />
          </>
        )}
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-14 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-mid font-medium mb-4">
            <a href="/" className="text-mid hover:text-tlight">Home</a>
            <span className="text-tlight/40">›</span>
            <span className="text-white">Reviews</span>
          </nav>
          <h1 className="font-head font-black text-[clamp(30px,5vw,56px)] uppercase tracking-wide text-white leading-none mb-4">
            Customer<br /><span className="text-mid">Reviews</span>
          </h1>
          <p className="text-tlight text-[15px] leading-relaxed max-w-[520px] mb-6">
            Don&apos;t just take our word for it — here&apos;s what our customers across Kent &amp; East Sussex have to say about working with Ticehurst Grounds &amp; Gardens.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { n: '5\u2605', l: 'Average rating' },
              { n: String(REVIEWS.length), l: 'Reviews' },
              { n: '12', l: 'Areas covered' },
            ].map((s) => (
              <div key={s.l} className="bg-sage/15 border border-tlight/25 rounded-xl px-5 py-3 text-center">
                <div className="font-head font-black text-2xl text-mid leading-none mb-0.5">{s.n}</div>
                <div className="text-[11px] text-tlight font-medium">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <Wave fromColor="#1C3D2A" toColor="#F4F1EC" path="M0,20 C360,65 720,5 1080,45 C1260,60 1380,15 1440,20 L1440,65 L0,65 Z" height={65} />
      </header>

      {/* All Reviews */}
      <section className="bg-cream py-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="font-head font-bold text-sm uppercase tracking-[0.18em] text-sage mb-2">What our customers say</p>
          <h2 className="font-head font-black text-[clamp(24px,3vw,38px)] uppercase tracking-wide text-forest leading-none mb-10">
            Trusted Across Kent &amp; East Sussex
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REVIEWS.map((r, i) => (
              <article
                key={i}
                className="bg-white border border-pebble rounded-xl p-6 flex flex-col gap-3 relative hover:border-sage/30 hover:shadow-lg transition-all duration-200"
              >
                <span className="absolute top-3 right-4 text-5xl text-mist font-serif leading-none select-none">
                  &ldquo;
                </span>
                <Stars />
                <blockquote className="text-[14px] text-charcoal leading-relaxed italic flex-1">
                  &ldquo;{r.q}&rdquo;
                </blockquote>
                <div className="flex items-end justify-between gap-3 pt-1">
                  <div>
                    <p className="font-head font-bold uppercase tracking-wide text-forest text-[13px]">
                      {r.name}
                    </p>
                    <p className="text-[12px] text-sage font-medium flex items-center gap-1">
                      <MapPin size={10} strokeWidth={2} />
                      {r.loc}
                    </p>
                  </div>
                  <span className="text-[10px] font-head font-bold uppercase tracking-wider text-bark/50 bg-cream rounded-full px-2.5 py-1">
                    {r.service}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Wave fromColor="#F4F1EC" toColor="#FFFFFF" />

      {/* Before & After gallery placeholder */}
      <GallerySection
        subheading="Our work"
        heading="See the Results"
        description="A selection of recent projects across Kent & East Sussex."
        images={portfolioPhotos}
        count={6}
        columns={3}
      />

      <Wave fromColor="#FFFFFF" toColor="#EDF7EF" path="M0,35 C480,0 960,68 1440,25 L1440,68 L0,68 Z" height={68} />

      {/* Trust signals */}
      <section className="bg-foam py-14">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-head font-black text-[clamp(24px,3vw,38px)] uppercase tracking-wide text-forest leading-none mb-4">
            Why Customers Trust Us
          </h2>
          <p className="text-bark text-[15px] max-w-xl mx-auto mb-10">
            Professional, insured, and consistently five-star rated across both counties.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: CheckCircle2, t: 'Fully insured' },
              { icon: Star, t: '5\u2605 rated' },
              { icon: MapPin, t: '12 areas covered' },
              { icon: ArrowRight, t: 'Free quotes' },
            ].map(({ icon: Icon, t }) => (
              <div
                key={t}
                className="bg-white border border-pebble rounded-xl p-5 flex flex-col items-center gap-2"
              >
                <Icon size={20} className="text-sage" strokeWidth={1.8} />
                <span className="font-head font-bold text-[13px] uppercase tracking-wide text-forest">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <Wave fromColor="#EDF7EF" toColor="#1C3D2A" path="M0,30 C360,65 720,5 1080,45 C1260,60 1380,20 1440,30 L1440,65 L0,65 Z" height={65} />
      <section className="bg-forest py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-head font-black text-[clamp(26px,3.5vw,42px)] uppercase tracking-wide text-white leading-none mb-4">
              Ready to Join Our Happy Customers?
            </h2>
            <p className="text-tlight text-[15px] leading-relaxed">
              Get in touch for a free, no-obligation quote. We&apos;d love to add you to the list.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/quote/"
              className="flex-1 flex items-center justify-center gap-2 bg-sage text-white font-head font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-moss transition-all"
            >
              Get instant estimate
            </Link>
            <a
              href="https://wa.me/447989143717"
              className="flex-1 flex items-center justify-center gap-2 bg-white text-forest font-head font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-mist transition-all"
            >
              WhatsApp Andy
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
