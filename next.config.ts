import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/home',     destination: '/',          permanent: true },
      { source: '/services', destination: '/services/', permanent: true },
      { source: '/gardens',  destination: '/services/garden-maintenance/', permanent: true },
      { source: '/windows',  destination: '/services/window-cleaning/',   permanent: true },
      { source: '/gutters',  destination: '/services/gutter-clearing/',   permanent: true },
    ]
  },
}
export default nextConfig
