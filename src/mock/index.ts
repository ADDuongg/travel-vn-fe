import type { FreshlyTourItem } from '@components/CardWithRating';
import type { TourItem } from '@components/TourCard';
import iconEarth from '/images/icon-earth.png';
import iconSupport from '/images/icon-like-money.png';
import iconCustomer from '/images/icon-customer.png';
import destination1 from '/images/destination1.png';
import destination2 from '/images/destination2.png';
import destination3 from '/images/destination3.png';
import destination4 from '/images/destination4.png';
import destination5 from '/images/destination5.png';
import destination6 from '/images/destination6.png';
import { ROUTES } from '@/constants/router';

export const services = [
  {
    icon: iconEarth,
    title: '700 Destinations',
    desc: 'Our expert team handpicked all destinations in this site',
  },
  {
    icon: iconSupport,
    title: 'Best Price Gurantee',
    desc: 'Price match within 48 hours of order confirmation',
  },
  {
    icon: iconCustomer,
    title: 'Top Notch Support',
    desc: 'We are here to help, before, during, and even after your trip.',
  },
];

export interface VietnamRegion {
  id: string;
  nameKey: string;
  shortKey: string;
  image: string;
  destinationCount: number;
  href: string;
}

export const vietnamRegions: VietnamRegion[] = [
  {
    id: 'north',
    nameKey: 'home_page.region_north',
    shortKey: 'home_page.region_north_short',
    image: '/images/destination1.png',
    destinationCount: 28,
    href: `${ROUTES.DESTINATION.SEARCH}?region=north`,
  },
  {
    id: 'central',
    nameKey: 'home_page.region_central',
    shortKey: 'home_page.region_central_short',
    image: '/images/destination2.png',
    destinationCount: 19,
    href: `${ROUTES.DESTINATION.SEARCH}?region=central`,
  },
  {
    id: 'south',
    nameKey: 'home_page.region_south',
    shortKey: 'home_page.region_south_short',
    image: '/images/destination3.png',
    destinationCount: 16,
    href: `${ROUTES.DESTINATION.SEARCH}?region=south`,
  },
];

export interface CityStripItem {
  id: string;
  nameKey: string;
  image: string;
  slug: string;
}

export const cityExplorerStrip: CityStripItem[] = [
  { id: 'hanoi', nameKey: 'home_page.city_hanoi', image: '/images/destination1.png', slug: 'hanoi' },
  { id: 'danang', nameKey: 'home_page.city_danang', image: '/images/destination2.png', slug: 'da-nang' },
  { id: 'hoian', nameKey: 'home_page.city_hoian', image: '/images/destination3.png', slug: 'hoi-an' },
  { id: 'hcmc', nameKey: 'home_page.city_hcmc', image: '/images/destination4.png', slug: 'ho-chi-minh' },
  { id: 'sapa', nameKey: 'home_page.city_sapa', image: '/images/destination5.png', slug: 'sapa' },
  { id: 'phuquoc', nameKey: 'home_page.city_phuquoc', image: '/images/destination6.png', slug: 'phu-quoc' },
];

export type DestinationGridItem = {
  id: number;
  nameKey: string;
  descriptionKey: string;
  image: string;
  tour_number: number;
  bestSeasonKey: string;
variant: 0 | 1;
  slug: string;
};
export const DestinationItem: DestinationGridItem[] = [
  {
    id: 1,
    nameKey: 'home_page.dest_hanoi',
    descriptionKey: 'home_page.dest_hanoi_desc',
    image: destination1,
    tour_number: 42,
    bestSeasonKey: 'home_page.season_sept_mar',
    variant: 1,
    slug: 'hanoi',
  },
  {
    id: 2,
    nameKey: 'home_page.dest_danang',
    descriptionKey: 'home_page.dest_danang_desc',
    image: destination2,
    tour_number: 31,
    bestSeasonKey: 'home_page.season_feb_aug',
    variant: 0,
    slug: 'da-nang',
  },
  {
    id: 3,
    nameKey: 'home_page.dest_hoian',
    descriptionKey: 'home_page.dest_hoian_desc',
    image: destination3,
    tour_number: 28,
    bestSeasonKey: 'home_page.season_feb_jun',
    variant: 0,
    slug: 'hoi-an',
  },
  {
    id: 4,
    nameKey: 'home_page.dest_hcmc',
    descriptionKey: 'home_page.dest_hcmc_desc',
    image: destination4,
    tour_number: 56,
    bestSeasonKey: 'home_page.season_dec_apr',
    variant: 1,
    slug: 'ho-chi-minh',
  },
  {
    id: 5,
    nameKey: 'home_page.dest_sapa',
    descriptionKey: 'home_page.dest_sapa_desc',
    image: destination5,
    tour_number: 18,
    bestSeasonKey: 'home_page.season_sep_nov',
    variant: 0,
    slug: 'sapa',
  },
  {
    id: 6,
    nameKey: 'home_page.dest_phuquoc',
    descriptionKey: 'home_page.dest_phuquoc_desc',
    image: destination6,
    tour_number: 22,
    bestSeasonKey: 'home_page.season_nov_mar',
    variant: 0,
    slug: 'phu-quoc',
  },
];

export type HotelCategory = 'all' | 'luxury' | 'boutique' | 'city' | 'homestay';

export interface FeaturedHotel {
  id: number;
  name: string;
  location: string;
  image: string;
  priceVnd: number;
  stars: number;
  category: HotelCategory;
  reviewCount: number;
}

export const featuredHotels: FeaturedHotel[] = [
  {
    id: 1,
    name: 'Sofitel Legend Metropole Hanoi',
    location: 'Hoàn Kiếm, Hà Nội',
    image: '/images/destination1.png',
    priceVnd: 4500000,
    stars: 5,
    category: 'luxury',
    reviewCount: 892,
  },
  {
    id: 2,
    name: 'The Nam Hai, a Four Seasons Resort',
    location: 'Hội An, Quảng Nam',
    image: '/images/destination2.png',
    priceVnd: 9200000,
    stars: 5,
    category: 'luxury',
    reviewCount: 640,
  },
  {
    id: 3,
    name: 'Mia Resort Nha Trang',
    location: 'Cam Hải Đông, Khánh Hòa',
    image: '/images/destination3.png',
    priceVnd: 3200000,
    stars: 4,
    category: 'boutique',
    reviewCount: 412,
  },
  {
    id: 4,
    name: 'Hotel des Arts Saigon',
    location: 'Quận 1, TP. Hồ Chí Minh',
    image: '/images/destination4.png',
    priceVnd: 3800000,
    stars: 5,
    category: 'city',
    reviewCount: 1203,
  },
  {
    id: 5,
    name: "Phori's House Sapa",
    location: 'Sapa, Lào Cai',
    image: '/images/destination5.png',
    priceVnd: 1200000,
    stars: 4,
    category: 'homestay',
    reviewCount: 267,
  },
  {
    id: 6,
    name: 'La Veranda Phú Quốc',
    location: 'Dương Đông, Phú Quốc',
    image: '/images/destination6.png',
    priceVnd: 4100000,
    stars: 4,
    category: 'boutique',
    reviewCount: 556,
  },
  {
    id: 7,
    name: 'Amanoi Ninh Thuan',
    location: 'Vĩnh Hy, Ninh Thuận',
    image: '/images/destination1.png',
    priceVnd: 15000000,
    stars: 5,
    category: 'luxury',
    reviewCount: 198,
  },
  {
    id: 8,
    name: 'Hanoi La Siesta Hotel & Spa',
    location: 'Phố Cổ, Hà Nội',
    image: '/images/destination2.png',
    priceVnd: 2100000,
    stars: 4,
    category: 'city',
    reviewCount: 743,
  },
];

export type FoodCategory = 'street' | 'signature' | 'hidden';

export interface FoodExperienceItem {
  id: number;
  name: string;
  description: string;
  image: string;
  priceVnd: number;
  city: string;
  category: FoodCategory;
}

export const foodExperiences: FoodExperienceItem[] = [
  {
    id: 1,
    name: 'Phở Bắc',
    description: 'Slow-simmered broth, rice noodles, tender beef — a Hanoi morning ritual.',
    image: '/images/destination1.png',
    priceVnd: 85000,
    city: 'Hà Nội',
    category: 'signature',
  },
  {
    id: 2,
    name: 'Bánh mì Hội An',
    description: 'Crispy baguette, pâté, pickled vegetables, and char siu in a yellow town.',
    image: '/images/destination2.png',
    priceVnd: 35000,
    city: 'Hội An',
    category: 'street',
  },
  {
    id: 3,
    name: 'Bún chả Hàng Mành',
    description: 'Grilled pork, herbs, and dipping sauce — a UNESCO-worthy lunch set.',
    image: '/images/destination1.png',
    priceVnd: 120000,
    city: 'Hà Nội',
    category: 'signature',
  },
  {
    id: 4,
    name: 'Cao lầu',
    description: 'Alkaline noodles, pork, and croutons from Hội An’s well water tradition.',
    image: '/images/destination3.png',
    priceVnd: 60000,
    city: 'Hội An',
    category: 'hidden',
  },
  {
    id: 5,
    name: 'Cơm tấm Sài Gòn',
    description: 'Broken rice, grilled pork chop, egg cake — a southern comfort classic.',
    image: '/images/destination4.png',
    priceVnd: 75000,
    city: 'TP. Hồ Chí Minh',
    category: 'street',
  },
  {
    id: 6,
    name: 'Bánh xèo',
    description: 'Crisp turmeric crepe with shrimp, pork, and fresh herbs to wrap and dip.',
    image: '/images/destination5.png',
    priceVnd: 55000,
    city: 'Miền Tây',
    category: 'hidden',
  },
];
export const freshlyTours: FreshlyTourItem[] = foodExperiences.map((f, i) => ({
  id: f.id,
  name: f.name,
  image: f.image,
  price: Math.round(f.priceVnd / 25000),
  bestSeller: i < 2,
  review_number: 40 + i * 3,
  rate: 5,
}));

export interface TravelGuideItem {
  id: number;
  titleKey: string;
  excerptKey: string;
  image: string;
  readMinutes: number;
  author: string;
  categoryKey: string;
  featured?: boolean;
  href: string;
}

export const travelGuides: TravelGuideItem[] = [
  {
    id: 1,
    titleKey: 'home_page.guide_hanoi_2d',
    excerptKey: 'home_page.guide_hanoi_2d_desc',
    image: '/images/destination1.png',
    readMinutes: 8,
    author: 'Minh Anh',
    categoryKey: 'home_page.guide_cat_itinerary',
    featured: true,
    href: `${ROUTES.TOUR_GUIDE.INDEX}/hanoi-2-days`,
  },
  {
    id: 2,
    titleKey: 'home_page.guide_danang_3d',
    excerptKey: 'home_page.guide_danang_3d_desc',
    image: '/images/destination2.png',
    readMinutes: 12,
    author: 'Thu Hà',
    categoryKey: 'home_page.guide_cat_itinerary',
    href: `${ROUTES.TOUR_GUIDE.INDEX}/da-nang-3-days`,
  },
  {
    id: 3,
    titleKey: 'home_page.guide_food_crawl',
    excerptKey: 'home_page.guide_food_crawl_desc',
    image: '/images/destination3.png',
    readMinutes: 10,
    author: 'Quốc Huy',
    categoryKey: 'home_page.guide_cat_food',
    href: `${ROUTES.TOUR_GUIDE.INDEX}/hcmc-street-food`,
  },
  {
    id: 4,
    titleKey: 'home_page.guide_sapa_tips',
    excerptKey: 'home_page.guide_sapa_tips_desc',
    image: '/images/destination5.png',
    readMinutes: 6,
    author: 'Lan Chi',
    categoryKey: 'home_page.guide_cat_tips',
    href: `${ROUTES.TOUR_GUIDE.INDEX}/sapa-trekking-tips`,
  },
];

export const feedbacks = [
  {
    name: 'Nguyễn Minh Khang',
    role: 'Solo traveler',
    location: 'Hồ Chí Minh',
    avatar: '/images/avatar1.png',
    rating: 5,
    feedback:
      'Booked a homestay in Sapa and a food tour in Hội An — every step felt clear and trustworthy. The team really understands Vietnam; I will use TravelVN again for my next trip to Đà Nẵng.',
  },
  {
    name: 'Sarah Mitchell',
    role: 'Family trip',
    location: 'Melbourne, Australia',
    avatar: '/images/avatar2.png',
    rating: 5,
    feedback:
      'We wanted something beyond generic package tours. The guides and hotel picks felt curated — from lantern-lit Hội An to a quiet Phú Quốc resort. Our kids still talk about the bánh mì stop!',
  },
  {
    name: 'Trần Bảo',
    role: 'Photography tour',
    location: 'Hà Nội',
    avatar: '/images/avatar3.png',
    rating: 5,
    feedback:
      'Transparent pricing, fast responses, and beautiful routes through the north. The 2-day Hà Nội itinerary in the app made exploring feel effortless. Highly recommend for anyone visiting Vietnam the first time.',
  },
];
export const ToursItem: TourItem[] = [
  {
    id: 1,
    name: 'Hà Nội & Hạ Long',
    description: 'Capital streets, street food, and limestone bays — 5 days of north Vietnam highlights.',
    image: destination1,
    price: 450,
    tour_number: 12,
    sale_percent: 10,
    duration: '5 days',
    bestSeller: true,
    hasSpecialOffer: true,
    review_number: 210,
    rate: 4.8,
  },
  {
    id: 2,
    name: 'Huế & Hội An Heritage',
    description: 'Imperial citadel, lantern town, and central coast culture in one journey.',
    image: destination2,
    price: 320,
    tour_number: 8,
    duration: '4 days',
    hasSpecialOffer: true,
    review_number: 156,
    rate: 4.7,
  },
  {
    id: 3,
    name: 'Đà Nẵng Beach Escape',
    description: 'Marble Mountain, Mỹ Khê, and day trips to craft villages and ancient towns.',
    image: destination3,
    price: 280,
    tour_number: 15,
    sale_percent: 15,
    duration: '3 days',
    review_number: 98,
    rate: 4.6,
  },
  {
    id: 4,
    name: 'Sapa Trek & Homestay',
    description: 'Terraced rice fields, ethnic villages, and sunrise over the Fansipan range.',
    image: destination4,
    price: 195,
    tour_number: 9,
    duration: '3 days',
    review_number: 175,
    rate: 4.9,
  },
  {
    id: 5,
    name: 'Mekong Delta & Cần Thơ',
    description: 'Floating markets, coconut groves, and southern hospitality in two days.',
    image: destination5,
    price: 165,
    tour_number: 11,
    bestSeller: true,
    duration: '2 days',
    hasSpecialOffer: true,
    review_number: 88,
    rate: 4.5,
  },
  {
    id: 6,
    name: 'Phú Quốc Island',
    description: 'Snorkel, sunset beach bars, and pepper farms at Vietnam’s southern island.',
    image: destination6,
    price: 410,
    tour_number: 7,
    sale_percent: 8,
    duration: '4 days',
    review_number: 124,
    rate: 4.7,
  },
];

const galleryPhoto = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=600&auto=format&fit=crop`;

export type GalleryImageItem = {
  src: string;
captionKey: string;
};

export type GalleryCollection = {
  id: 'hanoi' | 'sapa' | 'hoian' | 'halong';
  titleKey: string;
  descKey: string;
  images: GalleryImageItem[];
};
export const galleryCollections: GalleryCollection[] = [
  {
    id: 'hanoi',
    titleKey: 'gallery.collection_hanoi_title',
    descKey: 'gallery.collection_hanoi_desc',
    images: [
      { src: galleryPhoto('1528127269322-539801943592'), captionKey: 'gallery.cap_hanoi_1' },
      { src: galleryPhoto('1551218808-94e220e084d2'), captionKey: 'gallery.cap_hanoi_2' },
      { src: galleryPhoto('1504215680853-026ed1b8e7a5'), captionKey: 'gallery.cap_hanoi_3' },
      { src: galleryPhoto('1559592416-0ae07c2af17c'), captionKey: 'gallery.cap_hanoi_4' },
    ],
  },
  {
    id: 'sapa',
    titleKey: 'gallery.collection_sapa_title',
    descKey: 'gallery.collection_sapa_desc',
    images: [
      { src: galleryPhoto('1528127269322-539801943592'), captionKey: 'gallery.cap_sapa_1' },
      { src: galleryPhoto('1506905925346-21bfe4e5667a'), captionKey: 'gallery.cap_sapa_2' },
      { src: galleryPhoto('1488646953014-85cb44e25828'), captionKey: 'gallery.cap_sapa_3' },
      { src: galleryPhoto('1552465011-b4e21bf6e79a'), captionKey: 'gallery.cap_sapa_4' },
    ],
  },
  {
    id: 'hoian',
    titleKey: 'gallery.collection_hoian_title',
    descKey: 'gallery.collection_hoian_desc',
    images: [
      { src: galleryPhoto('1583417319070-4a69db38a482'), captionKey: 'gallery.cap_hoian_1' },
      { src: galleryPhoto('1552465011-b4e21bf6e79a'), captionKey: 'gallery.cap_hoian_2' },
      { src: galleryPhoto('1528127269322-539801943592'), captionKey: 'gallery.cap_hoian_3' },
      { src: galleryPhoto('1566073771259-6a8506099945'), captionKey: 'gallery.cap_hoian_4' },
    ],
  },
  {
    id: 'halong',
    titleKey: 'gallery.collection_halong_title',
    descKey: 'gallery.collection_halong_desc',
    images: [
      { src: galleryPhoto('1552465011-b4e21bf6e79a'), captionKey: 'gallery.cap_halong_1' },
      { src: galleryPhoto('1528127269322-539801943592'), captionKey: 'gallery.cap_halong_2' },
      { src: galleryPhoto('1488646953014-85cb44e25828'), captionKey: 'gallery.cap_halong_3' },
      { src: galleryPhoto('1506905925346-21bfe4e5667a'), captionKey: 'gallery.cap_halong_4' },
    ],
  },
];
