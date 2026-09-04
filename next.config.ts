import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/home',     destination: '/',          permanent: true },
      { source: '/gardens',  destination: '/services/garden-maintenance/', permanent: true },
      { source: '/windows',  destination: '/services/window-cleaning/',    permanent: true },
      { source: '/gutters',  destination: '/services/gutter-clearing/',    permanent: true },
    ]
  },
}
export default nextConfig
