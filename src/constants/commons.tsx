import type { HeaderItemType } from '@/interface/commons';

export const HeaderItem: HeaderItemType[] = [
  {
    name: 'home',
    label: 'Home',
    path: '/',
  },
  {
    name: 'pages',
    label: 'Pages',
    children: [
      {
        name: 'destination',
        label: 'Destination',
        path: '/destination',
      },
      {
        name: 'about-us',
        label: 'About Us',
        path: '/about-us',
      },
      {
        name: 'contact',
        label: 'Contact',
        path: '/contact',
      },
      {
        name: 'our-services',
        label: 'Our Services',
        path: '/our-services',
      },
      {
        name: 'team',
        label: 'Team',
        path: '/team',
      },
      {
        name: 'gallery',
        label: 'Gallery',
        path: '/gallery',
      },
    ],
  },
  {
    name: 'tour-list',
    label: 'Tour List',
    path: '/tour-list',
  },
  {
    name: 'room-list',
    label: 'Room List',
    path: '/room-list',
  },
  {
    name: 'search',
    label: 'Search',
    children: [
      {
        name: 'tour-search',
        label: 'Tour Search',
        path: '/tour-search',
      },
      {
        name: 'room-search',
        label: 'Room Search',
        path: '/room-search',
      },
    ],
  },
  {
    name: 'blog',
    label: 'Blog',
    path: '/blog',
  },
];
