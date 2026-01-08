// AppRouter.tsx
import { useInitAuth } from '@hooks/useInitAuth';
import type { RouteConfig } from '@interface/commons';
import ErrorBoundary from '@lib/ErrorBoundary';
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import type { EnumRole } from './constants/commons';
import { routes } from './router';

localStorage.setItem('userRole', 'admin');

const useUserRole = (): EnumRole | undefined => {
  return localStorage.getItem('userRole') as EnumRole | undefined;
};

const transformRoutes = (
  configs: RouteConfig[],
  userRole: EnumRole | undefined,
): RouteObject[] => {
  return configs.map(({ path, element, rolesAllowed, children }) => ({
    path,
    element: (
      <ErrorBoundary>
        <ProtectedRoute rolesAllowed={rolesAllowed} userRole={userRole}>
          {element}
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    children: children ? transformRoutes(children, userRole) : undefined,
  }));
};

const AppRouter = () => {
  useInitAuth();
  const userRole = useUserRole();
  const routeObjects = React.useMemo(
    () => transformRoutes(routes, userRole),
    [userRole],
  );

  const router = React.useMemo(
    () => createBrowserRouter(routeObjects),
    [routeObjects],
  );

  return <RouterProvider router={router} />;
};

export default AppRouter;
