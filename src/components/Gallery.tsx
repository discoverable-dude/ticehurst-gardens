import Image from 'next/image'
import { ImageIcon } from 'lucide-react'
import type { Photo } from '@/lib/photos'

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

/* ── Before / After card ─────────────────────────────────── */

export function BeforeAfterCard({
  before,
  after,
  dark = false,
}: {
  before: Photo
  after: Photo
  dark?: boolean
}) {
  return (
    <div className={`rounded-xl border overflow-hidden ${dark ? 'border-white/10' : 'border-pebble'}`}>
      <div className="grid grid-cols-2">
        <div className="relative">
          <Image
            src={before.url}
            alt={before.alt || 'Before'}
            width={600}
            height={400}
            className="w-full aspect-[4/3] object-cover"
          />
          <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold font-head uppercase tracking-wider px-2 py-1 rounded">
            Before
          </span>
        </div>
        <div className="relative">
          <Image
            src={after.url}
            alt={after.alt || 'After'}
            width={600}
            height={400}
            className="w-full aspect-[4/3] object-cover"
          />
          <span className="absolute bottom-2 left-2 bg-green-700/80 text-white text-[10px] font-bold font-head uppercase tracking-wider px-2 py-1 rounded">
            After
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── Gallery section — drop-in on any page ────────────────── */

export function GallerySection({
  heading = 'Our Work',
  subheading = 'Gallery',
  description = 'Photos of recent projects.',
  images,
  count = 6,
  columns = 3,
  dark = false,
  labels,
}: {
  heading?: string
  subheading?: string
  description?: string
  images?: Photo[]
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

  // Split images into before/after pairs and regular work photos
  const workPhotos = images?.filter(p => p.category === 'work') ?? []
  const beforePhotos = images?.filter(p => p.category === 'before') ?? []
  const afterPhotos = images?.filter(p => p.category === 'after') ?? []

  // Build before/after pairs by pair_id, or by position if unpaired
  const pairs: { before: Photo; after: Photo }[] = []
  const usedAfterIds = new Set<string>()
  for (const b of beforePhotos) {
    if (b.pair_id) {
      const a = afterPhotos.find(p => p.pair_id === b.pair_id)
      if (a) { pairs.push({ before: b, after: a }); usedAfterIds.add(a.id) }
    }
  }
  // Pair remaining unpaired before/after by position
  const unpairedBefore = beforePhotos.filter(b => !b.pair_id)
  const unpairedAfter = afterPhotos.filter(a => !a.pair_id && !usedAfterIds.has(a.id))
  for (let i = 0; i < Math.min(unpairedBefore.length, unpairedAfter.length); i++) {
    pairs.push({ before: unpairedBefore[i], after: unpairedAfter[i] })
  }

  const hasImages = workPhotos.length > 0 || pairs.length > 0

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

        {/* Before/After pairs */}
        {pairs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {pairs.map(p => (
              <BeforeAfterCard key={p.before.id} before={p.before} after={p.after} dark={dark} />
            ))}
          </div>
        )}

        {/* Work photos grid */}
        {hasImages ? (
          <div className={`grid ${colClass} gap-4`}>
            {workPhotos.map(photo => (
              <div key={photo.id} className={`rounded-xl overflow-hidden border ${dark ? 'border-white/10' : 'border-pebble'}`}>
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  width={600}
                  height={450}
                  className="w-full aspect-[4/3] object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid ${colClass} gap-4`}>
            {Array.from({ length: count }).map((_, i) => (
              <ImagePlaceholder
                key={i}
                label={labels?.[i]}
                dark={dark}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
