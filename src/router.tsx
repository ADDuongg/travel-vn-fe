import React from 'react';

import { RoleEnum, type RouteConfig } from './interface/commons';
import { DestinationSearchPage, HomePage, LoginPage } from '@/pages';

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <HomePage />,
    rolesAllowed: [RoleEnum.ADMIN] as RoleEnum[],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/destination/search',
    element: <DestinationSearchPage />,
  },
];
