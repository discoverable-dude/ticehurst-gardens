import { MetadataRoute } from 'next'
import { LOCATIONS } from '@/lib/locations'
import { SERVICES } from '@/lib/services'

const BASE = 'https://www.ticehurstgroundsandgardens.co.uk'

export default function sitemap(): MetadataRoute.Sitemap {
  const core: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,          priority: 1.0, changeFrequency: 'weekly'  },
    { url: `${BASE}/services/`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE}/areas/`,    priority: 0.8, changeFrequency: 'weekly'  },
    { url: `${BASE}/quote/`,    priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE}/contact/`,  priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE}/about/`,    priority: 0.5, changeFrequency: 'yearly'  },
    { url: `${BASE}/reviews/`,  priority: 0.7, changeFrequency: 'monthly' },
  ]
  const services: MetadataRoute.Sitemap = SERVICES.map(s => ({
    url: `${BASE}/services/${s.slug}/`, priority: 0.85, changeFrequency: 'monthly',
  }))
  const areas: MetadataRoute.Sitemap = LOCATIONS.map(l => ({
    url: `${BASE}/areas/${l.slug}/`, priority: 0.9, changeFrequency: 'monthly',
  }))
  return [...core, ...services, ...areas].map(r => ({ ...r, lastModified: new Date() }))
}
