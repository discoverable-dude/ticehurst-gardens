import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Wave from '@/components/Wave'
import QuoteTool from '@/components/QuoteTool'
import { CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Instant Price Estimate | Ticehurst Grounds & Gardens',
  description: '...',
  alternates: { canonical: 'https://www.ticehurstgroundsandgardens.co.uk/quote/' },
}

export default function QuotePage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <header className="bg-forest overflow-hidden relative pb-0">
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-0 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pb-14">
            <div className="lg:pt-6">
              <p className="font-head font-bold text-sm uppercase tracking-[0.18em] text-tlight mb-3">Price calculator</p>
              <h1 className="font-head font-black text-[clamp(32px,5vw,58px)] uppercase tracking-wide text-white leading-none mb-5">
                Get an Instant<br/><span className="text-mid">Price Estimate</span>
              </h1>
              <p className="text-tlight text-[15px] leading-relaxed mb-8 max-w-[400px]">
                Answer a few quick questions and get a realistic price guide for your job in Kent or East Sussex — no waiting, no commitment.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  'Covers all 12 gardening & cleaning services',
                  'Based on real Kent & East Sussex market rates',
                  'Free site visit to confirm your exact price',
                  'No obligation — Andy calls to discuss',
                ].map(b => (
                  <div key={b} className="flex items-center gap-3 text-[14px] text-tlight">
                    <CheckCircle2 size={15} className="text-sage flex-shrink-0" strokeWidth={2} />
                    {b}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <QuoteTool />
            </div>
          </div>
        </div>
        <Wave fromColor="#1C3D2A" toColor="#F4F1EC" path="M0,20 C360,65 720,5 1080,45 C1260,60 1380,15 1440,20 L1440,65 L0,65 Z" height={65} />
      </header>

      {/* How it works after estimate */}
      <section className="bg-cream py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-head font-black text-[clamp(24px,3vw,38px)] uppercase tracking-wide text-forest leading-none mb-10 text-center">What Happens Next</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { n: 1, t: 'Andy calls you', d: 'Within 1 working day to discuss your project and answer any questions.' },
              { n: 2, t: 'Free site visit', d: 'We visit your property to measure up and give you a firm fixed-price quote.' },
              { n: 3, t: 'Work confirmed', d: 'Happy with the price? We schedule the job at a time that suits you.' },
            ].map(s => (
              <div key={s.n} className="text-center">
                <div className="w-12 h-12 bg-white border-2 border-sage rounded-full flex items-center justify-center mx-auto mb-3 font-head font-black text-xl text-forest">{s.n}</div>
                <h3 className="font-head font-black text-base uppercase tracking-wide text-forest mb-2">{s.t}</h3>
                <p className="text-[13px] text-bark leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
