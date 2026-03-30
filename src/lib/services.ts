export type Service = {
  slug:     string
  name:     string
  category: 'gardening' | 'cleaning'
  title:    string
  meta:     string
  h1a:      string
  h1b:      string
  intro:    string
  includes: string[]
  faqs:     [string, string][]
  kwExtra:  string
}

export const SERVICES: Service[] = [
  {
    slug: 'lawn-care', name: 'Lawn Care', category: 'gardening',
    title: 'Lawn Care in Kent & East Sussex | Ticehurst Grounds & Gardens',
    meta: 'Professional lawn care across Kent & East Sussex. Mowing, aeration, scarification, seeding & more. Free quotes.',
    h1a: 'Lawn Care', h1b: 'Kent & East Sussex',
    intro: 'A well-maintained lawn is the foundation of any great garden. We provide comprehensive lawn care across Kent and East Sussex — from regular mowing to seasonal treatments, tailored to your grass type and garden.',
    includes: ['Regular lawn mowing & strimming','Lawn aeration to improve drainage & root growth','Scarification — moss & thatch removal','Grass seeding & overseeding for thin or patchy lawns','Lawn edging & border definition','Seasonal lawn treatments & preparation'],
    faqs: [
      ['How often should my lawn be mowed in Kent?','During the growing season (April to October) most lawns need mowing every one to two weeks. In winter, monthly tidying is usually sufficient. We advise based on your grass type and conditions.'],
      ['What is lawn aeration and do I need it?','Aeration involves perforating the soil to allow air, water and nutrients to reach grass roots. Particularly beneficial for lawns on heavy clay soils, which are common across Kent. We recommend annual aeration for most lawns.'],
      ['Can you overseed a patchy or thin lawn?','Yes. We can scarify to remove dead material, then overseed with a suitable grass mix. Results are usually visible within two to four weeks depending on weather.'],
    ],
    kwExtra: 'lawn care Kent, lawn mowing Kent, grass cutting Kent',
  },
  {
    slug: 'garden-maintenance', name: 'Garden Maintenance', category: 'gardening',
    title: 'Garden Maintenance in Kent & East Sussex | Ticehurst Grounds & Gardens',
    meta: 'Regular garden maintenance across Kent & East Sussex. Weeding, pruning, seasonal prep & ongoing contracts. Free quotes.',
    h1a: 'Garden Maintenance', h1b: 'Kent & East Sussex',
    intro: 'Regular maintenance keeps your garden looking its best throughout the year. We handle all aspects of seasonal garden care — weeding, pruning, planting and tidy-ups — so you can simply enjoy your outdoor space.',
    includes: ['Weeding — beds, borders & paths','Pruning, deadheading & plant care','Seasonal planting & preparation','Leaf clearance & autumn tidy-ups','Mulching & soil conditioning','Ongoing maintenance contracts available'],
    faqs: [
      ['What does a regular garden maintenance visit include?','Every visit is tailored to what your garden needs at that time of year — typically weeding beds and borders, cutting back overgrown plants, deadheading, and general tidying. We adapt to the season.'],
      ['How often do I need garden maintenance visits?','Most gardens benefit from fortnightly or monthly visits during the growing season, reducing in autumn and winter. We recommend a schedule based on your garden size.'],
      ['Do you offer one-off garden tidy sessions?','Yes. As well as regular contracts we offer one-off seasonal tidy sessions — perfect for spring preparation, post-summer clearances or getting a garden ready for sale.'],
    ],
    kwExtra: 'garden maintenance Kent, gardening services Kent',
  },
  {
    slug: 'hedge-tree-care', name: 'Hedge & Tree Care', category: 'gardening',
    title: 'Hedge Cutting & Tree Care in Kent & East Sussex | Ticehurst Grounds & Gardens',
    meta: 'Professional hedge cutting and tree care across Kent & East Sussex. Shaping, pruning, crown reduction & waste removal. Free quotes.',
    h1a: 'Hedge & Tree Care', h1b: 'Kent & East Sussex',
    intro: 'Overgrown hedges and trees can quickly become an eyesore. Our professional hedge cutting and tree care service keeps everything neat, shaped and healthy across Kent and East Sussex.',
    includes: ['Hedge trimming & shaping to your specification','Conifer, box, privet & ornamental hedge cutting','Tree pruning & crown reduction','Cutting back overgrown shrubs & climbers','New tree & shrub planting','All green waste removed & disposed of'],
    faqs: [
      ['When is the best time to cut hedges in Kent?','The optimal window is late summer to early autumn, once nesting season has ended. We always comply with wildlife protection guidelines.'],
      ['Do you remove all the cuttings?','Yes. All green waste is removed and disposed of responsibly. Your garden is left clean and tidy after every visit.'],
      ['Can you reduce an overgrown conifer hedge?','Yes, though the extent depends on the species. Many conifers will not regenerate from old wood, so we assess and advise before starting any work.'],
    ],
    kwExtra: 'hedge cutting Kent, hedge trimming Kent, tree pruning Kent',
  },
  {
    slug: 'garden-clearances', name: 'Garden Clearances', category: 'gardening',
    title: 'Garden Clearances in Kent & East Sussex | Ticehurst Grounds & Gardens',
    meta: 'Full garden clearances across Kent & East Sussex. One-off or regular. Overgrown shrubs, brambles, waste removal & more. Free quotes.',
    h1a: 'Garden Clearances', h1b: 'Kent & East Sussex',
    intro: 'Moving into a new property or need a complete outdoor reset? We handle full garden clearances across Kent and East Sussex — tackling overgrown shrubs, brambles, weeds and general debris to leave a clean slate.',
    includes: ['Full garden clearances for new homeowners','Overgrown shrub, bramble & weed removal','Garden waste & rubbish removal','Stump grinding & root removal','Post-clearance levelling & preparation','One-off & seasonal clearances available'],
    faqs: [
      ['How long does a full garden clearance take?','Most domestic clearances are completed in a single day with our multi-person team. We give you an accurate time estimate at your free site visit.'],
      ['Can you clear a garden that has not been maintained for years?','Yes. Our experienced team handles everything from heavily brambled plots to severely overgrown conditions. We assess and give a clear, honest quote.'],
      ['Do you take the waste away?','Yes. All green waste and garden rubbish is removed and responsibly disposed of. Waste removal is included in our quote.'],
    ],
    kwExtra: 'garden clearance Kent, overgrown garden clearance Kent',
  },
  {
    slug: 'borders-beds', name: 'Border & Bed Design', category: 'gardening',
    title: 'Garden Border & Flower Bed Design in Kent | Ticehurst Grounds & Gardens',
    meta: 'Transform your garden with professionally designed borders and flower beds across Kent & East Sussex. Planting schemes, seasonal colour & more.',
    h1a: 'Border & Bed Design', h1b: 'Kent & East Sussex',
    intro: 'Well-designed borders and flower beds transform any garden. We create and plant bespoke beds across Kent and East Sussex — from cottage-style perennial planting to low-maintenance structural schemes.',
    includes: ['New border creation & excavation','Flower bed installation & soil preparation','Perennial, annual & shrub planting schemes','Seasonal colour planting','Bulb planting & spring displays','Mulching, edging & ongoing care'],
    faqs: [
      ['Can you advise on what plants will work in my garden?','Yes. Before we plant anything we assess your soil type, aspect, light levels and drainage to recommend plants suited to your specific conditions.'],
      ['Do you offer low-maintenance planting schemes?','Absolutely. We specialise in hardy perennials, grasses and structural shrubs that give year-round interest with minimal upkeep.'],
      ['Can you refresh existing overgrown borders?','Yes. We can clear, improve the soil and replant existing borders. Sometimes a full replant is the best approach; in other cases selective editing transforms the space.'],
    ],
    kwExtra: 'flower bed planting Kent, garden border design Kent',
  },
  {
    slug: 'fencing', name: 'Fencing', category: 'gardening',
    title: 'Fencing Installation & Repair in Kent & East Sussex | Ticehurst Grounds & Gardens',
    meta: 'Quality fencing installation and repair across Kent & East Sussex. Close-board, panel, post & rail. Fencing contractor Kent. Free quotes.',
    h1a: 'Fencing Installation', h1b: 'Kent & East Sussex',
    intro: 'Quality fencing defines your garden, provides privacy and adds security. We install and repair all types of domestic fencing across Kent and East Sussex — with full supply and installation included.',
    includes: ['Close-board fence installation','Featheredge panel & lap panel fencing','Post & rail fencing','Fence post replacement & repairs','Trellis, pergola & garden screening','Gate installation & repair'],
    faqs: [
      ['How long does fence installation take?','A typical garden fence replacement of up to 20 panels is usually completed in a single day. We give you an accurate timeframe at your free site visit.'],
      ['Do you supply the fencing materials as well as fit them?','Yes. Our quotes include both materials and labour. We use quality timber and concrete posts — all included in the price we quote.'],
      ['Do you offer close-board fencing for added privacy?','Yes. Close-board fencing provides excellent privacy and durability. We can match the height and style to your specific needs.'],
    ],
    kwExtra: 'fencing contractor Kent, fence installation Kent, fencing company Kent',
  },
  {
    slug: 'window-cleaning', name: 'Window Cleaning', category: 'cleaning',
    title: 'Window Cleaning in Kent & East Sussex | Ticehurst Grounds & Gardens',
    meta: 'Professional window cleaning across Kent & East Sussex. Residential & commercial. Streak-free results. Free quotes — window cleaner Kent.',
    h1a: 'Window Cleaning', h1b: 'Kent & East Sussex',
    intro: 'Crystal clear windows make an immediate difference to your home or business. We provide professional residential and commercial window cleaning across Kent and East Sussex using a reach-and-wash pole system for streak-free results every time.',
    includes: ['Residential window cleaning','Commercial window cleaning','Conservatory glass & frame cleaning','Reach & wash pure water system','Ground floor to high-level windows','Regular scheduled cleaning contracts'],
    faqs: [
      ['What is the reach and wash system?','We use a pure water fed pole system that reaches windows up to four storeys high without ladders. Purified water leaves no mineral residue, giving streak-free results that stay cleaner for longer.'],
      ['How often should I have my windows cleaned?','Most homeowners opt for monthly or bi-monthly cleaning. We recommend a schedule based on your location and how quickly your windows accumulate dirt.'],
      ['Do you clean commercial premises?','Yes. We provide commercial window cleaning for offices, shops, schools and other business premises across Kent and East Sussex.'],
    ],
    kwExtra: 'window cleaner Kent, window cleaning Kent, commercial window cleaning Kent',
  },
  {
    slug: 'gutter-clearing', name: 'Gutter Clearing', category: 'cleaning',
    title: 'Gutter Cleaning & Clearing in Kent & East Sussex | Ticehurst Grounds & Gardens',
    meta: 'Professional gutter clearing across Kent & East Sussex. Clear blockages, flush downpipes, clean fascias & soffits. Free quotes — gutter cleaning Kent.',
    h1a: 'Gutter Clearing', h1b: 'Kent & East Sussex',
    intro: 'Blocked gutters cause damp penetration, structural damage and water ingress. We provide professional gutter clearing and cleaning across Kent and East Sussex — keeping your gutters flowing freely and your property protected year-round.',
    includes: ['Full gutter clearing & unblocking','Downpipe flushing & clearing','Fascia, soffit & guttering external cleaning','Moss, debris & leaf removal','Minor gutter repairs & resealing','Annual maintenance contracts available'],
    faqs: [
      ['How often should gutters be cleared?','We recommend at least once a year — ideally in late autumn after the leaves have fallen. Properties near trees may need clearing twice a year.'],
      ['Do you clean the outside of the gutters and fascias too?','Yes. Our gutter clearing service includes a full external clean of the guttering, fascias and soffits — removing algae, dirt and green staining.'],
      ['Can you clear downpipe blockages?','Yes. We flush and clear downpipes as part of our standard gutter clearing service.'],
    ],
    kwExtra: 'gutter cleaning Kent, gutter clearing Kent, gutter cleaner Kent',
  },
  {
    slug: 'solar-panel-cleaning', name: 'Solar Panel Cleaning', category: 'cleaning',
    title: 'Solar Panel Cleaning in Kent & East Sussex | Ticehurst Grounds & Gardens',
    meta: 'Professional solar panel cleaning across Kent & East Sussex. Pure water system, efficiency restoration. Free quotes.',
    h1a: 'Solar Panel Cleaning', h1b: 'Kent & East Sussex',
    intro: 'Dirty solar panels can lose up to 25 to 30 percent of their generating efficiency. Our professional solar panel cleaning service uses a pure water system to restore peak performance — no harsh chemicals, no residue.',
    includes: ['Residential & commercial solar panel cleaning','Pure water cleaning system — streak-free & residue-free','Bird droppings, moss & algae removal','Bird guard debris clearing','Panel inspection & condition report','Regular maintenance cleaning plans'],
    faqs: [
      ['How much efficiency do dirty solar panels lose?','Research suggests dirty panels can lose 15 to 30 percent of their output. Bird droppings covering even a small area can disproportionately reduce output due to shading.'],
      ['How do you clean solar panels safely?','We use a pure water fed pole system — no abrasive materials or chemicals. The system reaches roof-mounted panels without ladders or direct contact.'],
      ['How often should solar panels be cleaned?','Once or twice a year is typically sufficient for most residential installations. Properties with high bird activity may benefit from more frequent cleaning.'],
    ],
    kwExtra: 'solar panel cleaning Kent, solar panel cleaner Kent',
  },
  {
    slug: 'jet-washing', name: 'Jet Washing', category: 'cleaning',
    title: 'Patio & Driveway Jet Washing in Kent & East Sussex | Ticehurst Grounds & Gardens',
    meta: 'Professional jet washing for patios, driveways, paths & decking across Kent & East Sussex. Algae removal & restoration. Free quotes.',
    h1a: 'Jet Washing', h1b: 'Patios, Driveways & Paths',
    intro: 'High-pressure jet washing transforms grimy, algae-covered patios, driveways and paths — restoring surfaces to their original appearance. We provide professional jet washing across Kent and East Sussex for homes and commercial properties.',
    includes: ['Patio & paving jet washing','Driveway cleaning & restoration','Block paving cleaning','Path & decking jet washing','Render & brickwork washing','Algae, moss & green staining treatment'],
    faqs: [
      ['Will jet washing damage my patio or driveway?','When done correctly with the right pressure and technique, jet washing is safe for most outdoor surfaces. We adjust pressure to suit the surface and test if needed.'],
      ['Can jet washing remove oil stains from a driveway?','Jet washing removes most surface grime and algae. Oil stains may require a degreaser treatment first. We assess and advise on the best approach.'],
      ['How long does a patio jet wash take?','Most domestic patios are completed in two to four hours. We give you a realistic time estimate with your quote.'],
    ],
    kwExtra: 'patio cleaning Kent, driveway jet washing Kent, patio jet wash Kent',
  },
  {
    slug: 'building-cleaning', name: 'Building & Cladding Cleaning', category: 'cleaning',
    title: 'Building & Cladding Cleaning in Kent & East Sussex | Ticehurst Grounds & Gardens',
    meta: 'Specialist building exterior and cladding cleaning across Kent & East Sussex. Weatherboard, render, brickwork & commercial. Free quotes.',
    h1a: 'Building & Cladding Cleaning', h1b: 'Kent & East Sussex',
    intro: 'The exterior of your building creates a first impression. We provide specialist building and cladding cleaning for homes and commercial properties across Kent and East Sussex — removing algae, moss, dirt and green staining.',
    includes: ['Cladding cleaning — all types','Weatherboard & timber cladding cleaning','Render & pebbledash washing','External brickwork cleaning','Commercial building exterior cleaning','Algae, moss & green stain removal'],
    faqs: [
      ['Can you clean UPVC cladding without damaging it?','Yes. UPVC and plastic cladding responds well to professional soft washing — a low-pressure technique that removes algae and staining without risk of damage.'],
      ['Do you clean commercial premises?','Yes. We provide building exterior cleaning for commercial properties of all sizes across Kent and East Sussex.'],
      ['How long does building cleaning last?','Results typically last 12 to 24 months depending on the surface type, orientation and environment.'],
    ],
    kwExtra: 'cladding cleaning Kent, building cleaning Kent, exterior cleaning Kent',
  },
  {
    slug: 'conservatory-cleaning', name: 'Conservatory Cleaning', category: 'cleaning',
    title: 'Conservatory Cleaning in Kent & East Sussex | Ticehurst Grounds & Gardens',
    meta: 'Professional conservatory cleaning across Kent & East Sussex. Glass roofs, polycarbonate panels, frames, gutters & fascias. Free quotes.',
    h1a: 'Conservatory Cleaning', h1b: 'Kent & East Sussex',
    intro: 'A dirty conservatory loses its charm quickly — algae on the roof, mould in the frames, blocked gutters and grimy glass. We provide full conservatory exterior cleaning across Kent and East Sussex, bringing back that like-new clarity.',
    includes: ['Full conservatory exterior cleaning','Glass & polycarbonate roof cleaning','Conservatory frame & door cleaning','Integral gutter & fascia cleaning','Algae, moss & mould treatment','Conservatory window cleaning'],
    faqs: [
      ['How do you clean a polycarbonate conservatory roof?','Polycarbonate panels are cleaned using a soft brush with pure water — no abrasive materials or harsh chemicals that could scratch or cloud the surface.'],
      ['Do you clean inside the gutters on the conservatory?','Yes. Conservatory gutters regularly block with moss, leaves and debris. We clear and flush the gutters as part of our conservatory cleaning service.'],
      ['How often should a conservatory be cleaned?','Twice a year is typical — once in spring and once in autumn. Conservatories in shaded positions may benefit from more frequent cleaning.'],
    ],
    kwExtra: 'conservatory cleaning Kent, conservatory roof cleaning Kent',
  },
]

export function getService(slug: string) {
  return SERVICES.find(s => s.slug === slug)
}
