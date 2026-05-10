/** Editorial homepage data — sourced from Open Design prototype (static imagery). */

export type CitySlug =
  | 'hanoi'
  | 'da-nang'
  | 'hoi-an'
  | 'ho-chi-minh-city'
  | 'da-lat';

export type CityCard = {
  slug: CitySlug;
  name: string;
  subtitle: string;
  vibe: string;
  specialties: string[];
  image: string;
  moodClass:
    | 'city-hanoi'
    | 'city-danang'
    | 'city-hoian'
    | 'city-hcmc'
    | 'city-dalat';
};

const u = (id: string) =>
  `https://images.unsplash.com/${id}?ixlib=rb-4.1.0&auto=format&fit=crop&q=85&w=2400`;

export const cityCards: CityCard[] = [
  {
    slug: 'hanoi',
    name: 'Hanoi',
    subtitle: 'Layers of lakeside dusk',
    vibe: 'Nostalgic lanes · dusk trains · egg coffee steam',
    specialties: ['Phở gánh', 'Bánh cuốn', 'Egg coffee'],
    moodClass: 'city-hanoi',
    image: u('photo-1528127269322-539801943592'),
  },
  {
    slug: 'da-nang',
    name: 'Da Nang',
    subtitle: 'Sea salt on the marble breeze',
    vibe: 'Coastal roads · morning surf · modern galleries',
    specialties: ['Mì Quảng', 'Bánh xèo', 'Seafood grill'],
    moodClass: 'city-danang',
    image: u('photo-1559827260-dc66d52bef19'),
  },
  {
    slug: 'hoi-an',
    name: 'Hoi An',
    subtitle: 'Silk light through paper lanterns',
    vibe: 'Riverside tailors · night markets · slow pedals',
    specialties: ['Cao lầu', 'White rose dumplings', 'Herbed corn'],
    moodClass: 'city-hoian',
    image: u('photo-1555396273-367ea4eb4db5'),
  },
  {
    slug: 'ho-chi-minh-city',
    name: 'Ho Chi Minh City',
    subtitle: 'Neon rivers on asphalt',
    vibe: 'Rooftop jazz · alley banh mi · midnight phở',
    specialties: ['Bánh mì', 'Hủ tiếu', 'Com tam'],
    moodClass: 'city-hcmc',
    image: u('photo-1583417319070-4a69db38a482'),
  },
  {
    slug: 'da-lat',
    name: 'Da Lat',
    subtitle: 'Pine fog and greenhouse glass',
    vibe: 'French villas · farm strawberries · quiet hikes',
    specialties: ['Bánh căn', 'Artichoke tea', 'Farm cheeses'],
    moodClass: 'city-dalat',
    image: u('photo-1464822759023-fed622ff2c3b'),
  },
];

export const foodStoryImages = [
  u('photo-1567620905732-2d1ec7ab7445'),
  u('photo-1498837167922-ddd27525d352'),
  u('photo-1497935586351-b67a49e012bf'),
];

export const trendingSpotImages = [
  u('photo-1470071459604-3b5ec3a7fe05'),
  u('photo-1526778548025-fa2f459cd5c1'),
  u('photo-1500530855697-b586d89ba3ee'),
];

export const collectionImages = [
  u('photo-1507525428034-b723cf961d3e'),
  u('photo-1526778548025-fa2f459cd5c1'),
  u('photo-1476514525535-07fb3b4ae5f1'),
];
