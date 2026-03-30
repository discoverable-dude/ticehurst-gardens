export type Location = {
  slug:     string
  name:     string
  county:   string
  lat:      number
  lng:      number
  desc:     string
  villages: string
  nearby:   string[]
  kwGardeners:  string
  kwWindow:     string
  kwGutter:     string
}

export const LOCATIONS: Location[] = [
  {
    slug: 'ashford', name: 'Ashford', county: 'Kent', lat: 51.1537, lng: 0.8710,
    desc: 'Professional gardening and exterior cleaning services across Ashford and surrounding villages.',
    villages: 'Mersham, Kingsnorth, Great Chart, Willesborough, Kennington, Sevington',
    nearby: ['tenterden','headcorn','folkestone','cranbrook'],
    kwGardeners: 'gardeners Ashford Kent', kwWindow: 'window cleaning Ashford', kwGutter: 'gutter clearing Ashford',
  },
  {
    slug: 'tenterden', name: 'Tenterden', county: 'Kent', lat: 51.0700, lng: 0.6900,
    desc: 'Garden maintenance and exterior cleaning for Tenterden homeowners and businesses.',
    villages: 'St Michaels, Small Hythe, Rolvenden, Wittersham, Stone-in-Oxney',
    nearby: ['ashford','cranbrook','rye','headcorn'],
    kwGardeners: 'gardeners Tenterden Kent', kwWindow: 'window cleaning Tenterden', kwGutter: 'gutter clearing Tenterden',
  },
  {
    slug: 'cranbrook', name: 'Cranbrook', county: 'Kent', lat: 51.0993, lng: 0.5380,
    desc: 'Reliable garden and grounds maintenance plus exterior cleaning for Cranbrook and the High Weald.',
    villages: 'Goudhurst, Sissinghurst, Hawkhurst, Frittenden, Benenden',
    nearby: ['tenterden','tunbridge-wells','maidstone','headcorn'],
    kwGardeners: 'gardeners Cranbrook Kent', kwWindow: 'window cleaning Cranbrook', kwGutter: 'gutter clearing Cranbrook',
  },
  {
    slug: 'headcorn', name: 'Headcorn', county: 'Kent', lat: 51.1670, lng: 0.6280,
    desc: 'Expert garden and grounds care plus exterior cleaning across Headcorn and Mid-Kent.',
    villages: 'Sutton Valence, Chart Sutton, Boughton Monchelsea, Ulcombe',
    nearby: ['maidstone','tenterden','ashford','cranbrook'],
    kwGardeners: 'gardeners Headcorn Kent', kwWindow: 'window cleaning Headcorn', kwGutter: 'gutter clearing Headcorn',
  },
  {
    slug: 'maidstone', name: 'Maidstone', county: 'Kent', lat: 51.2720, lng: 0.5217,
    desc: 'Comprehensive garden maintenance and exterior cleaning for Maidstone and surrounding villages.',
    villages: 'Bearsted, Boxley, Detling, Otham, Loose, Barming',
    nearby: ['tonbridge','headcorn','cranbrook','tunbridge-wells'],
    kwGardeners: 'gardeners Maidstone', kwWindow: 'window cleaning Maidstone', kwGutter: 'gutter clearing Maidstone',
  },
  {
    slug: 'folkestone', name: 'Folkestone', county: 'Kent', lat: 51.0790, lng: 1.1680,
    desc: 'Garden and grounds services plus exterior cleaning across Folkestone and coastal Kent.',
    villages: 'Cheriton, Hawkinge, Hythe, Sandgate, Lyminge, Elham',
    nearby: ['ashford','tenterden','hythe','hawkinge'],
    kwGardeners: 'gardeners Folkestone', kwWindow: 'window cleaning Folkestone', kwGutter: 'gutter clearing Folkestone',
  },
  {
    slug: 'tonbridge', name: 'Tonbridge', county: 'Kent', lat: 51.1960, lng: 0.2729,
    desc: 'Professional gardening and exterior cleaning across Tonbridge and Mid-Kent.',
    villages: 'Hadlow, Hildenborough, East Peckham, Golden Green, Shipbourne',
    nearby: ['tunbridge-wells','maidstone','sevenoaks','paddock-wood'],
    kwGardeners: 'gardeners Tonbridge Kent', kwWindow: 'window cleaning Tonbridge', kwGutter: 'gutter clearing Tonbridge',
  },
  {
    slug: 'tunbridge-wells', name: 'Tunbridge Wells', county: 'Kent', lat: 51.1321, lng: 0.2633,
    desc: 'Expert garden maintenance, lawn care and exterior cleaning across Tunbridge Wells.',
    villages: 'Southborough, Pembury, Rusthall, Speldhurst, Langton Green, High Brooms',
    nearby: ['tonbridge','crowborough','cranbrook','paddock-wood'],
    kwGardeners: 'gardeners Tunbridge Wells', kwWindow: 'window cleaning Tunbridge Wells', kwGutter: 'gutter clearing Tunbridge Wells',
  },
  {
    slug: 'rye', name: 'Rye', county: 'East Sussex', lat: 50.9545, lng: 0.7312,
    desc: 'Reliable garden and grounds maintenance plus exterior cleaning for Rye and surrounding East Sussex.',
    villages: 'Winchelsea, Camber, Iden, Northiam, Peasmarsh',
    nearby: ['battle','tenterden','hastings','winchelsea'],
    kwGardeners: 'gardeners Rye East Sussex', kwWindow: 'window cleaning Rye', kwGutter: 'gutter clearing Rye',
  },
  {
    slug: 'battle', name: 'Battle', county: 'East Sussex', lat: 50.9170, lng: 0.4850,
    desc: 'Garden maintenance and exterior cleaning for Battle and surrounding East Sussex.',
    villages: 'Sedlescombe, Netherfield, Catsfield, Crowhurst, Whatlington',
    nearby: ['hastings','rye','bexhill','heathfield'],
    kwGardeners: 'gardeners Battle East Sussex', kwWindow: 'window cleaning Battle', kwGutter: 'gutter clearing Battle',
  },
  {
    slug: 'hastings', name: 'Hastings', county: 'East Sussex', lat: 50.8538, lng: 0.5732,
    desc: 'Professional gardening and exterior cleaning for Hastings and St Leonards-on-Sea.',
    villages: 'St Leonards-on-Sea, Ore, Hollington, Silverhill, Baldslow',
    nearby: ['bexhill','battle','rye','st-leonards'],
    kwGardeners: 'gardeners Hastings East Sussex', kwWindow: 'window cleaning Hastings', kwGutter: 'gutter clearing Hastings',
  },
  {
    slug: 'bexhill', name: 'Bexhill-on-Sea', county: 'East Sussex', lat: 50.8420, lng: 0.4720,
    desc: 'Garden and grounds maintenance plus exterior cleaning for Bexhill and coastal East Sussex.',
    villages: 'Cooden, Sidley, Little Common, Pevensey Bay, Normans Bay',
    nearby: ['hastings','battle','pevensey','cooden'],
    kwGardeners: 'gardeners Bexhill East Sussex', kwWindow: 'window cleaning Bexhill', kwGutter: 'gutter clearing Bexhill',
  },
]

export function getLocation(slug: string) {
  return LOCATIONS.find(l => l.slug === slug)
}
