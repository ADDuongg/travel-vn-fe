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
        label: 'destination',
        path: '/destination',
      },
      {
        name: 'about-us',
        label: 'about_us',
        path: '/about-us',
      },
      {
        name: 'contact',
        label: 'contact',
        path: '/contact',
      },
      {
        name: 'our-services',
        label: 'our_services',
        path: '/our-services',
      },
      {
        name: 'team',
        label: 'team',
        path: '/team',
      },
      {
        name: 'gallery',
        label: 'gallery',
        path: '/gallery',
      },
    ],
  },
  {
    name: 'tour-list',
    label: 'tour_list',
    path: ROUTES.TOUR.INDEX,
  },
  {
    name: 'room',
    label: 'room_list',
    path: '/room',
  },
  {
    name: 'search',
    label: 'search',
    children: [
      {
        name: 'tour-search',
        label: 'tour_search',
        path: '/tour/search',
      },
      {
        name: 'room-search',
        label: 'room_search',
        path: '/room/search',
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
