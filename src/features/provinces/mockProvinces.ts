import type { ProvinceListItem } from './types';

/**
 * Fallback when GET /popular or GET list returns empty (UI-only; dev/staging).
 * Three stable demo provinces — North / Central / South.
 */
export const MOCK_PROVINCES_FALLBACK: ProvinceListItem[] = [
  {
    _id: 'mock-prov-north',
    code: 'HN',
    slug: 'ha-noi',
    type: 'province',
    name: { vi: 'Hà Nội', en: 'Hanoi' },
    fullName: { vi: 'Thành phố Hà Nội', en: 'Hanoi City' },
    region: 'NORTH',
    isPopular: true,
    isActive: true,
    displayOrder: 1,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80',
      alt: 'Hanoi',
    },
    translations: {
      vi: {
        shortDescription: 'Phố cổ, hồ Hoàn Kiếm và ẩm thực đêm.',
      },
      en: {
        shortDescription: 'Old Quarter, Hoan Kiem Lake, and midnight kitchens.',
      },
    },
    totalHotels: 120,
    totalTours: 45,
    totalTourGuides: 12,
    highlights: [
      {
        translations: {
          vi: { name: 'Phố cổ', description: '' },
          en: { name: 'Old Quarter', description: '' },
        },
      },
      {
        translations: {
          vi: { name: 'Cà phê trứng', description: '' },
          en: { name: 'Egg coffee', description: '' },
        },
      },
      {
        translations: {
          vi: { name: 'Hồ Hoàn Kiếm', description: '' },
          en: { name: 'Hoan Kiem Lake', description: '' },
        },
      },
    ],
  },
  {
    _id: 'mock-prov-central',
    code: 'DN',
    slug: 'da-nang',
    type: 'province',
    name: { vi: 'Đà Nẵng', en: 'Da Nang' },
    fullName: { vi: 'Thành phố Đà Nẵng', en: 'Da Nang City' },
    region: 'CENTRAL',
    isPopular: true,
    isActive: true,
    displayOrder: 2,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80',
      alt: 'Da Nang',
    },
    translations: {
      vi: {
        shortDescription: 'Biển, bán đảo Sơn Trà và cầu Rồng.',
      },
      en: {
        shortDescription: 'Beaches, Son Tra peninsula, and Dragon Bridge.',
      },
    },
    totalHotels: 95,
    totalTours: 38,
    totalTourGuides: 9,
    highlights: [
      {
        translations: {
          vi: { name: 'Mỹ Khê', description: '' },
          en: { name: 'My Khe Beach', description: '' },
        },
      },
      {
        translations: {
          vi: { name: 'Mì Quảng', description: '' },
          en: { name: 'Mi Quang', description: '' },
        },
      },
      {
        translations: {
          vi: { name: 'Ngũ Hành Sơn', description: '' },
          en: { name: 'Marble Mountains', description: '' },
        },
      },
    ],
  },
  {
    _id: 'mock-prov-south',
    code: 'SG',
    slug: 'ho-chi-minh',
    type: 'province',
    name: { vi: 'Hồ Chí Minh', en: 'Ho Chi Minh City' },
    fullName: { vi: 'Thành phố Hồ Chí Minh', en: 'Ho Chi Minh City' },
    region: 'SOUTH',
    isPopular: true,
    isActive: true,
    displayOrder: 3,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80',
      alt: 'Ho Chi Minh City',
    },
    translations: {
      vi: {
        shortDescription: 'Sài Gòn — rooftop, chợ và phở khuya.',
      },
      en: {
        shortDescription: 'Saigon pulse — rooftops, markets, midnight pho.',
      },
    },
    totalHotels: 210,
    totalTours: 62,
    totalTourGuides: 18,
    highlights: [
      {
        translations: {
          vi: { name: 'Quận 1', description: '' },
          en: { name: 'District 1', description: '' },
        },
      },
      {
        translations: {
          vi: { name: 'Bánh mì', description: '' },
          en: { name: 'Banh mi', description: '' },
        },
      },
      {
        translations: {
          vi: { name: 'Nhà thờ Đức Bà', description: '' },
          en: { name: 'Notre-Dame Basilica', description: '' },
        },
      },
    ],
  },
];
