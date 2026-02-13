import type { CountryFlag, HeaderItemType } from '@/interface/commons';
import { ROUTES } from './router';

export const HeaderItem: HeaderItemType[] = [
  {
    name: 'home',
    label: 'home',
    path: ROUTES.HOME,
  },
  {
    name: 'pages',
    label: 'pages',
    children: [
      {
        name: 'destination',
        label: 'nav.destination',
        path: ROUTES.DESTINATION.SEARCH,
      },
      {
        name: 'about-us',
        label: 'nav.about_us',
        path: ROUTES.ABOUT_US,
      },
      {
        name: 'contact',
        label: 'nav.contact',
        path: ROUTES.CONTACT,
      },
      {
        name: 'our-services',
        label: 'nav.our_services',
        path: ROUTES.OUR_SERVICES,
      },
      {
        name: 'team',
        label: 'nav.team',
        path: ROUTES.TEAM,
      },
      {
        name: 'gallery',
        label: 'nav.gallery',
        path: ROUTES.GALLERY,
      },
    ],
  },
  {
    name: 'list',
    label: 'list',
    children: [
      {
        name: 'tour_list',
        label: 'tour_list',
        path: ROUTES.TOUR.INDEX,
      },
      {
        name: 'room_list',
        label: 'room_list',
        path: ROUTES.LIST_ROOMS,
      },
      {
        name: 'hotel_list',
        label: 'hotel_list',
        path: ROUTES.LIST_HOTELS,
      },
    ],
  },
  {
    name: 'blog',
    label: 'blog',
    path: '/blog',
  },
];

export const countryFlags: Record<string, CountryFlag> = {
  vi: { label: 'VI', code: 'VN' },
  en: { label: 'ENG', code: 'EN' },
};

export enum EnumRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export enum EnumDisplayItem {
  TABLE = 'table',
  GRID = 'grid',
  FLEX = 'flex',
}

export const EnumLanguage = {
  VI: 'vi',
  EN: 'en',
  DEFAULT: 'en',
};
