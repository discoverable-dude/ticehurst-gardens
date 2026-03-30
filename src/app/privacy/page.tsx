import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Wave from '@/components/Wave'
export const metadata: Metadata = {
  title: 'Privacy Policy | Ticehurst Grounds & Gardens',
  description: 'Privacy policy for Ticehurst Grounds & Gardens.',
  alternates: { canonical: 'https://www.ticehurstgroundsandgardens.co.uk/privacy/' },
  robots: { index: false },
}
export default function PrivacyPage() {
  const items = [
    ['Who we are', 'Ticehurst Grounds & Gardens is a garden maintenance and exterior cleaning business based in Ticehurst, East Sussex. Contact: ticehurstgg@gmail.com.'],
    ['What we collect', 'When you submit a contact or quote form we collect your name, phone, email (if provided), town and service enquiry. No payment data is collected through this website.'],
    ['How we use it', 'Solely to respond to enquiries, provide quotes and arrange agreed work. We do not sell or share your data with third parties for marketing.'],
    ['Retention', 'Enquiry data is kept for up to 12 months. Request deletion at any time: ticehurstgg@gmail.com.'],
    ['Your rights', 'Under UK GDPR you have the right to access, correct or delete your personal data. Contact: ticehurstgg@gmail.com.'],
    ['Cookies', 'This site does not use tracking or analytics cookies by default.'],
  ]
  return (
    <>
      <Nav />
      <header className="bg-forest overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-10">
          <h1 className="font-head font-black text-[clamp(26px,4vw,44px)] uppercase tracking-wide text-white leading-none">Privacy Policy</h1>
          <p className="text-tlight text-sm mt-2">Last updated: March 2026</p>
        </div>
        <Wave fromColor="#1C3D2A" toColor="#F4F1EC" height={50} />
      </header>
      <section className="bg-cream py-14">
        <div className="max-w-3xl mx-auto px-6 flex flex-col gap-8">
          {items.map(([h, p]) => (
            <div key={h}>
              <h2 className="font-head font-black text-xl uppercase tracking-wide text-forest mb-2">{h}</h2>
              <p className="text-bark text-[15px] leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  )
}
