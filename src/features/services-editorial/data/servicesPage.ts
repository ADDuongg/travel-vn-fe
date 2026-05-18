const u = (id: string) =>
  `https://images.unsplash.com/${id}?ixlib=rb-4.1.0&auto=format&fit=crop&q=85&w=2400`;
export const serviceVisuals = {
  hero: u('photo-1469854523086-cc02fe5d8800'),
  cityJourney: u('photo-1469474968028-56623f02e42e'),
  food: u('photo-1555396273-367ea4eb4db5'),
  hidden: u('photo-1520250497591-112f2f40a3f4'),
  cultural: u('photo-1528127269322-539801943592'),
  coffeeNight: u('photo-1495474472287-4d71bcdd2085'),
  guidance: u('photo-1476514525535-07fb3b4ae5f1'),
  atmosphere: u('photo-1526778548025-fa2f459cd5c1'),
  mountain: u('photo-1464822759023-fed622ff2c3b'),
  lanterns: u('photo-1559827260-dc66d52bef19'),
  coastal: u('photo-1507525428034-b723cf961d3e'),
  fog: u('photo-1506905925346-21bda4d32df4'),
  cafe: u('photo-1517248135467-4c7edcad34c4'),
  alley: u('photo-1583417319070-4a69db38a482'),
  district: u('photo-1528164344705-47542687000d'),
  closing: u('photo-1498837167922-ddd27525d352'),
} as const;

export type ServiceEditorialLinkTarget = 'provinces' | 'tour' | 'about' | 'home';

export type ExperienceOfferId =
  | 'city_journey'
  | 'food'
  | 'hidden'
  | 'cultural'
  | 'coffee_night'
  | 'cinematic_guidance'
  | 'atmosphere';

export type ExperienceOfferMeta = {
  id: ExperienceOfferId;
  imageKey: keyof typeof serviceVisuals;
  gradient: string;
  imageFirst: boolean;
  linkTarget: ServiceEditorialLinkTarget;
};

export const experienceOffersMeta: readonly ExperienceOfferMeta[] = [
  {
    id: 'city_journey',
    imageKey: 'cityJourney',
    gradient: 'from-charcoal/42 via-transparent to-charcoal/22',
    linkTarget: 'provinces',
    imageFirst: true,
  },
  {
    id: 'food',
    imageKey: 'food',
    gradient: 'from-charcoal/38 via-transparent to-charcoal/26',
    linkTarget: 'tour',
    imageFirst: false,
  },
  {
    id: 'hidden',
    imageKey: 'hidden',
    gradient: 'from-charcoal/45 via-transparent to-charcoal/18',
    linkTarget: 'provinces',
    imageFirst: true,
  },
  {
    id: 'cultural',
    imageKey: 'cultural',
    gradient: 'from-charcoal/36 via-transparent to-charcoal/28',
    linkTarget: 'tour',
    imageFirst: false,
  },
  {
    id: 'coffee_night',
    imageKey: 'coffeeNight',
    gradient: 'from-charcoal/40 via-transparent to-charcoal/24',
    linkTarget: 'tour',
    imageFirst: true,
  },
  {
    id: 'cinematic_guidance',
    imageKey: 'guidance',
    gradient: 'from-charcoal/34 via-transparent to-charcoal/30',
    linkTarget: 'about',
    imageFirst: false,
  },
  {
    id: 'atmosphere',
    imageKey: 'atmosphere',
    gradient: 'from-charcoal/41 via-transparent to-charcoal/20',
    linkTarget: 'home',
    imageFirst: true,
  },
];

export const showcaseImageKeys = [
  'mountain',
  'lanterns',
  'coastal',
  'fog',
  'cafe',
  'alley',
  'district',
] as const satisfies readonly (keyof typeof serviceVisuals)[];

export type ShowcaseImageKey = (typeof showcaseImageKeys)[number];

export const flowStepIds = ['discover', 'wander', 'immerse', 'connect', 'remember'] as const;
export type FlowStepId = (typeof flowStepIds)[number];

