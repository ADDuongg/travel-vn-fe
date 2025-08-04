import React from 'react';

import { EnumRole, type RouteConfig } from './interface/commons';
import { DestinationSearchPage, HomePage, LoginPage } from '@/pages';
import { TourSearchPage } from '@pages/tour/TourSearch';
import { RoomSearchPage } from '@pages/room/RoomSearch';

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <HomePage />,
    // rolesAllowed: [EnumRole.ADMIN] as EnumRole[],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/destination/search',
    element: <DestinationSearchPage />,
  },
  {
    path: '/tour/search',
    element: <TourSearchPage />,
  },
  {
    path: '/room/search',
    element: <RoomSearchPage />,
  },
];
