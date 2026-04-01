import type { Metadata } from 'next'
import HomeContent from '@/components/HomeContent'
import { getPhotosByCategory } from '@/lib/photos'
import { getPageContent, getReviews } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Ticehurst Grounds & Gardens | Gardeners & Exterior Cleaning in Kent & East Sussex',
  description: 'Professional garden maintenance and exterior cleaning across Kent & East Sussex. Free quotes.',
  alternates: { canonical: 'https://www.ticehurstgroundsandgardens.co.uk' },
}

export const revalidate = 60

const LOCAL_BUSINESS_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Ticehurst Grounds & Gardens",
  "description": "Professional garden maintenance and exterior cleaning across Kent and East Sussex.",
  "url": "https://www.ticehurstgroundsandgardens.co.uk/",
  "telephone": "+447700000000",
  "email": "ticehurstgg@gmail.com",
  "priceRange": "££",
  "address": { "@type": "PostalAddress", "addressLocality": "Ticehurst", "addressRegion": "East Sussex", "addressCountry": "GB", "postalCode": "TN5" },
  "geo": { "@type": "GeoCoordinates", "latitude": 51.0366, "longitude": 0.3902 },
  "areaServed": [
    {"@type":"AdministrativeArea","name":"Kent"},{"@type":"AdministrativeArea","name":"East Sussex"},
    {"@type":"City","name":"Ashford"},{"@type":"City","name":"Tunbridge Wells"},{"@type":"City","name":"Maidstone"},{"@type":"City","name":"Tenterden"}
  ],
  "sameAs": ["https://www.instagram.com/ticehurstgg"],
  "openingHoursSpecification": [
    {"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"opens":"07:30","closes":"18:00"},
    {"@type":"OpeningHoursSpecification","dayOfWeek":"Saturday","opens":"08:00","closes":"16:00"}
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Garden & Exterior Cleaning Services",
    "itemListElement": [
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Lawn Care"}},
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Garden Maintenance"}},
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Window Cleaning"}},
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Gutter Clearing"}},
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Jet Washing"}},
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Solar Panel Cleaning"}}
    ]
  }
})

export default async function Home() {
  const [heroPhotos, aboutPhotos, homeContent, reviews] = await Promise.all([
    getPhotosByCategory('hero'),
    getPhotosByCategory('about'),
    getPageContent('home'),
    getReviews(),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: LOCAL_BUSINESS_SCHEMA }}
      />
      <HomeContent
        heroImage={heroPhotos[0]?.url}
        aboutImage={aboutPhotos[0] ? { url: aboutPhotos[0].url, alt: aboutPhotos[0].alt } : undefined}
        cms={homeContent}
        reviews={reviews}
      />
    </>
  )
}
