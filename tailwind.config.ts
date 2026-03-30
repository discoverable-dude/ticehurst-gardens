import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        forest:   '#1C3D2A',
        moss:     '#2E6044',
        sage:     '#5A9A6A',
        mid:      '#7DBF8E',
        tlight:   '#A8D5B5',
        mist:     '#D4EDD9',
        foam:     '#EDF7EF',
        cream:    '#F4F1EC',
        pebble:   '#E8E3DB',
        bark:     '#7A6050',
        stone:    '#B0A898',
        charcoal: '#1A2218',
      },
      fontFamily: {
        head: ['"Barlow Condensed"', 'Impact', 'sans-serif'],
        body: ['Barlow', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
