// ── Pricing engine for the quote tool ─────────────────────────
// All prices in GBP. Returns { low, high } estimate range.
// These are realistic Kent/East Sussex market rates for a
// professional multi-team operation — adjust as Andy sees fit.

export type GardenSize  = 'small' | 'medium' | 'large' | 'extra_large'
export type CleanSize   = 'terrace' | 'semi' | 'detached' | 'large_detached'
export type Frequency   = 'one_off' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly'

export interface PriceRange { low: number; high: number; label: string }

// Frequency multipliers (applied to base monthly price to give per-visit cost)
const FREQ_MULTIPLIER: Record<Frequency, number> = {
  one_off:      1.4,   // 40% premium for one-offs
  weekly:       0.75,  // discount for regulars
  fortnightly:  0.85,
  monthly:      1.0,   // base
  quarterly:    1.25,
}

// ── GARDENING ────────────────────────────────────────────────

const LAWN_MOWING: Record<GardenSize, [number, number]> = {
  small:       [25, 40],
  medium:      [40, 60],
  large:       [60, 90],
  extra_large: [90, 140],
}
const GARDEN_MAINT: Record<GardenSize, [number, number]> = {
  small:       [60, 90],
  medium:      [90, 140],
  large:       [130, 200],
  extra_large: [180, 280],
}
const HEDGE_CARE: Record<GardenSize, [number, number]> = {
  small:       [80, 130],
  medium:      [130, 200],
  large:       [180, 300],
  extra_large: [250, 450],
}
const CLEARANCE: Record<GardenSize, [number, number]> = {
  small:       [200, 350],
  medium:      [350, 600],
  large:       [550, 950],
  extra_large: [800, 1500],
}
const BORDERS: Record<GardenSize, [number, number]> = {
  small:       [150, 300],
  medium:      [280, 500],
  large:       [450, 800],
  extra_large: [700, 1400],
}
const FENCING_PER_PANEL: [number, number] = [70, 110] // per panel installed

// ── EXTERIOR CLEANING ─────────────────────────────────────────

const WINDOWS: Record<CleanSize, [number, number]> = {
  terrace:       [10, 15],
  semi:          [12, 20],
  detached:      [18, 30],
  large_detached:[28, 45],
}
const GUTTERS: Record<CleanSize, [number, number]> = {
  terrace:       [60, 90],
  semi:          [80, 120],
  detached:      [110, 160],
  large_detached:[150, 240],
}
const SOLAR_PER_PANEL: [number, number] = [4, 7] // per panel
const SOLAR_MIN: [number, number]       = [80, 120]
const PATIO: Record<CleanSize, [number, number]> = {
  terrace:       [80, 130],
  semi:          [100, 160],
  detached:      [140, 220],
  large_detached:[180, 300],
}
const BUILDING_CLEAN: Record<CleanSize, [number, number]> = {
  terrace:       [150, 250],
  semi:          [200, 350],
  detached:      [280, 480],
  large_detached:[400, 700],
}
const CONSERVATORY: Record<string, [number, number]> = {
  small:  [100, 160],
  medium: [140, 220],
  large:  [180, 280],
}

// ── Main pricing function ──────────────────────────────────────

export function calculateEstimate(params: {
  service:      string
  gardenSize?:  GardenSize
  cleanSize?:   CleanSize
  frequency?:   Frequency
  numPanels?:   number
  numPanels_fencing?: number
  conservSize?: string
}): PriceRange {

  const { service, gardenSize, cleanSize, frequency, numPanels, conservSize } = params
  const freq = frequency ?? 'monthly'

  let base: [number, number] = [0, 0]

  // ── Gardening ─────────────────────────────────────────────
  if (service === 'Lawn Care') {
    base = LAWN_MOWING[gardenSize ?? 'medium']
    const m = FREQ_MULTIPLIER[freq]
    return fmt(base[0] * m, base[1] * m, freq)
  }
  if (service === 'Garden Maintenance') {
    base = GARDEN_MAINT[gardenSize ?? 'medium']
    const m = FREQ_MULTIPLIER[freq]
    return fmt(base[0] * m, base[1] * m, freq)
  }
  if (service === 'Hedge & Tree Care') {
    base = HEDGE_CARE[gardenSize ?? 'medium']
    return fmt(base[0], base[1], 'one_off') // usually one-off
  }
  if (service === 'Garden Clearance') {
    base = CLEARANCE[gardenSize ?? 'medium']
    return fmt(base[0], base[1], 'one_off')
  }
  if (service === 'Border & Bed Design') {
    base = BORDERS[gardenSize ?? 'medium']
    return fmt(base[0], base[1], 'one_off')
  }
  if (service === 'Fencing') {
    const n = params.numPanels_fencing ?? 10
    return fmt(FENCING_PER_PANEL[0] * n, FENCING_PER_PANEL[1] * n, 'one_off')
  }

  // ── Exterior Cleaning ──────────────────────────────────────
  if (service === 'Window Cleaning') {
    base = WINDOWS[cleanSize ?? 'semi']
    const m = FREQ_MULTIPLIER[freq]
    return fmt(base[0] * m, base[1] * m, freq)
  }
  if (service === 'Gutter Clearing') {
    base = GUTTERS[cleanSize ?? 'semi']
    return fmt(base[0], base[1], 'one_off')
  }
  if (service === 'Solar Panel Cleaning') {
    const n   = numPanels ?? 12
    const low = Math.max(SOLAR_MIN[0], SOLAR_PER_PANEL[0] * n)
    const hi  = Math.max(SOLAR_MIN[1], SOLAR_PER_PANEL[1] * n)
    const m   = FREQ_MULTIPLIER[freq]
    return fmt(low * m, hi * m, freq)
  }
  if (service === 'Jet Washing') {
    base = PATIO[cleanSize ?? 'semi']
    return fmt(base[0], base[1], 'one_off')
  }
  if (service === 'Building & Cladding Cleaning') {
    base = BUILDING_CLEAN[cleanSize ?? 'semi']
    return fmt(base[0], base[1], 'one_off')
  }
  if (service === 'Conservatory Cleaning') {
    base = CONSERVATORY[conservSize ?? 'medium']
    return fmt(base[0], base[1], 'one_off')
  }

  return { low: 0, high: 0, label: 'Contact for a quote' }
}

function fmt(low: number, high: number, freq: Frequency): PriceRange {
  const r = (n: number) => Math.round(n / 5) * 5 // round to nearest £5
  const label = freq === 'one_off' ? 'one-off' : `per ${freq.replace('_', '-')} visit`
  return { low: r(low), high: r(high), label }
}

// ── Display helpers ────────────────────────────────────────────
export const GARDEN_SIZES: { value: GardenSize; label: string; desc: string }[] = [
  { value: 'small',       label: 'Small',        desc: 'Up to 50m² — typical terraced garden' },
  { value: 'medium',      label: 'Medium',       desc: '50–150m² — typical semi-detached' },
  { value: 'large',       label: 'Large',        desc: '150–400m² — generous detached garden' },
  { value: 'extra_large', label: 'Extra large',  desc: '400m²+ — large plot or smallholding' },
]
export const CLEAN_SIZES: { value: CleanSize; label: string; desc: string }[] = [
  { value: 'terrace',        label: 'Terraced house',    desc: '2 bed terrace, 6–8 windows' },
  { value: 'semi',           label: 'Semi-detached',     desc: '3 bed semi, 8–12 windows' },
  { value: 'detached',       label: 'Detached',          desc: '3–4 bed detached, 12–18 windows' },
  { value: 'large_detached', label: 'Large detached',    desc: '4+ bed, 18+ windows' },
]
export const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'one_off',     label: 'One-off' },
  { value: 'weekly',      label: 'Weekly' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'monthly',     label: 'Monthly' },
  { value: 'quarterly',   label: 'Quarterly' },
]
export const SERVICE_CATEGORIES = {
  gardening: [
    'Lawn Care',
    'Garden Maintenance',
    'Hedge & Tree Care',
    'Garden Clearance',
    'Border & Bed Design',
    'Fencing',
  ],
  cleaning: [
    'Window Cleaning',
    'Gutter Clearing',
    'Solar Panel Cleaning',
    'Jet Washing',
    'Building & Cladding Cleaning',
    'Conservatory Cleaning',
  ],
}
