export type Review = {
  quote: string
  name: string
  location: string
  service?: string
  rating?: number
}

export const DEFAULT_REVIEWS: Review[] = [
  { quote: 'Andy and his team transformed our overgrown garden. Incredibly professional, reliable and great value.', name: 'Sarah M.', location: 'Ashford, Kent', service: 'Garden Clearance' },
  { quote: 'Used Ticehurst for lawn maintenance for over a year. Always on time, always brilliant results.', name: 'James T.', location: 'Tenterden, Kent', service: 'Lawn Care' },
  { quote: 'The exterior window and conservatory cleaning was outstanding. Would definitely recommend.', name: 'Rachel B.', location: 'Headcorn, Kent', service: 'Window & Conservatory Cleaning' },
  { quote: 'Hedges cut, patio jet washed and gutters cleared in one visit. Excellent work at a fair price.', name: 'Linda R.', location: 'Rye, East Sussex', service: 'Multiple Services' },
  { quote: 'Full garden clearance \u2014 completely overgrown and now it looks incredible. Fast, friendly and professional.', name: 'David K.', location: 'Cranbrook, Kent', service: 'Garden Clearance' },
  { quote: 'Reliable, hardworking, results speak for themselves. Our garden is always immaculate. Great team.', name: 'Mark P.', location: 'Battle, East Sussex', service: 'Garden Maintenance' },
  { quote: 'We had our solar panels cleaned and the difference in output was immediately noticeable. Brilliant service.', name: 'Helen W.', location: 'Tonbridge, Kent', service: 'Solar Panel Cleaning' },
  { quote: 'Had fencing put in across the back garden. Neat, tidy work and competitively priced. Very happy.', name: 'Steve G.', location: 'Maidstone, Kent', service: 'Fencing' },
  { quote: 'Andy is brilliant to deal with. Prompt replies, fair prices, excellent standard of work every time.', name: 'Karen D.', location: 'Tunbridge Wells, Kent', service: 'Hedge & Tree Care' },
  { quote: 'Jet washed our entire driveway and patio \u2014 looks brand new. Will be booking again next year.', name: 'Tom L.', location: 'Folkestone, Kent', service: 'Jet Washing' },
  { quote: 'Gutters were overflowing. Team came out same week, cleared everything and cleaned the fascias too.', name: 'Pauline C.', location: 'Hastings, East Sussex', service: 'Gutter Clearing' },
  { quote: 'We use Ticehurst for fortnightly garden maintenance. Lawn is always perfect, borders always tidy.', name: 'Ian R.', location: 'Bexhill, East Sussex', service: 'Garden Maintenance' },
]
