import React from 'react';

import { RoleEnum, type RouteConfig } from './interface/commons';
import HomePage from '@/pages/home';
import LoginPage from './pages/auth/login';

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
];
