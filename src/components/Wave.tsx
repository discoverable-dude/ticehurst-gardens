interface WaveProps {
  fromColor: string
  toColor:   string
  path?:     string
  height?:   number
  flip?:     boolean
}

export default function Wave({
  fromColor,
  toColor,
  path = 'M0,30 C360,70 720,0 1080,45 C1260,65 1380,20 1440,30 L1440,70 L0,70 Z',
  height = 70,
  flip   = false,
}: WaveProps) {
  return (
    <div className="wave-wrap" style={{ background: fromColor }} aria-hidden="true">
      <svg
        viewBox={`0 0 1440 ${height}`}
        preserveAspectRatio="none"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      >
        <path d={path} fill={toColor} />
      </svg>
    </div>
  )
}
