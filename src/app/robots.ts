import { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/contact/thanks/'] }],
    sitemap: 'https://www.ticehurstgroundsandgardens.co.uk/sitemap.xml',
  }
}
