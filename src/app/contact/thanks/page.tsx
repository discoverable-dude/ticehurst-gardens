import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function ThanksPage() {
  return (
    <>
      <Nav />
      <section className="bg-cream min-h-[60vh] flex items-center">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="w-20 h-20 bg-foam border-2 border-sage rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-sage" strokeWidth={1.5} />
          </div>
          <h1 className="font-head font-black text-[clamp(28px,4vw,46px)] uppercase tracking-wide text-forest leading-none mb-4">
            Message Received!
          </h1>
          <p className="text-bark text-[16px] leading-relaxed mb-8">
            Thanks for getting in touch. Andy will get back to you within 24 hours to discuss your project and arrange a free site visit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="flex items-center justify-center gap-2 bg-forest text-white font-head font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-moss transition-all">
              Back to home
            </Link>
            <Link href="/quote/" className="flex items-center justify-center gap-2 bg-white border-2 border-pebble text-forest font-head font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-full hover:border-sage transition-all">
              Try the quote tool
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
