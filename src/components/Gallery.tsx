import { ImageIcon } from 'lucide-react'

/* ── Single placeholder tile ──────────────────────────────── */

export function ImagePlaceholder({
  label,
  aspect = '4/3',
  dark = false,
}: {
  label?: string
  aspect?: string
  dark?: boolean
}) {
  return (
    <div
      className={`rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 overflow-hidden ${
        dark
          ? 'border-white/10 bg-white/[0.04]'
          : 'border-pebble bg-cream/60'
      }`}
      style={{ aspectRatio: aspect }}
    >
      <ImageIcon
        size={28}
        className={dark ? 'text-tlight/30' : 'text-stone/50'}
        strokeWidth={1.4}
      />
      <span
        className={`text-[11px] font-head font-bold uppercase tracking-wider ${
          dark ? 'text-tlight/30' : 'text-stone/50'
        }`}
      >
        {label ?? 'Photo coming soon'}
      </span>
    </div>
  )
}

/* ── Gallery section — drop-in on any page ────────────────── */

export function GallerySection({
  heading = 'Our Work',
  subheading = 'Gallery',
  description = 'Photos of recent projects — coming soon.',
  count = 6,
  columns = 3,
  dark = false,
  labels,
}: {
  heading?: string
  subheading?: string
  description?: string
  count?: number
  columns?: 2 | 3 | 4
  dark?: boolean
  labels?: string[]
}) {
  const colClass =
    columns === 4
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
      : columns === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <section className={dark ? 'bg-forest py-16' : 'bg-white py-16'}>
      <div className="max-w-6xl mx-auto px-6">
        <p
          className={`font-head font-bold text-sm uppercase tracking-[0.18em] mb-2 ${
            dark ? 'text-tlight' : 'text-sage'
          }`}
        >
          {subheading}
        </p>
        <h2
          className={`font-head font-black text-[clamp(22px,3vw,36px)] uppercase tracking-wide leading-none mb-3 ${
            dark ? 'text-white' : 'text-forest'
          }`}
        >
          {heading}
        </h2>
        <p
          className={`text-[15px] leading-relaxed max-w-2xl mb-8 ${
            dark ? 'text-tlight' : 'text-bark'
          }`}
        >
          {description}
        </p>
        <div className={`grid ${colClass} gap-4`}>
          {Array.from({ length: count }).map((_, i) => (
            <ImagePlaceholder
              key={i}
              label={labels?.[i]}
              dark={dark}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
