import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ticehurstgroundsandgardens.co.uk'),
  title: {
    template: '%s | Ticehurst Grounds & Gardens',
    default: 'Ticehurst Grounds & Gardens | Gardeners & Exterior Cleaning Kent & East Sussex',
  },
  description: 'Professional garden maintenance and exterior cleaning across Kent & East Sussex. Free no-obligation quotes.',
  openGraph: { locale: 'en_GB', type: 'website', siteName: 'Ticehurst Grounds & Gardens' },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://www.ticehurstgroundsandgardens.co.uk' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@300;400;500;600&display=swap" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
