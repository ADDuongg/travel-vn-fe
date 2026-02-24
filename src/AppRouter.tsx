// AppRouter.tsx
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
  type IndexRouteObject,
  type NonIndexRouteObject,
} from 'react-router-dom';
import { useInitAuth } from '@hooks/useInitAuth';
import type { RouteConfig } from '@interface/commons';
import ErrorBoundary from '@lib/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import type { EnumRole } from './constants/commons';
import { routes } from './router';
import { useAuthStore } from '@/stores/useAuthStore';

const useUserRoles = (): string[] | undefined => {
  const authUser = useAuthStore((s) => s.authUser as any);
  if (!Array.isArray(authUser?.roles)) return undefined;
  return authUser.roles.map((r: string) => r.toLowerCase());
};

const wrap = (
  element: React.ReactNode,
  rolesAllowed: EnumRole[] | undefined,
  userRoles: string[] | undefined,
) => (
  <ErrorBoundary>
    <ProtectedRoute rolesAllowed={rolesAllowed} userRoles={userRoles}>
      {element}
    </ProtectedRoute>
  </ErrorBoundary>
);

const transformRoutes = (
  configs: RouteConfig[],
  userRoles: string[] | undefined,
): RouteObject[] => {
  return configs.map<RouteObject>((cfg) => {
    const { index, path, element, rolesAllowed, children, handle } = cfg;

    if (index) {
      const node: IndexRouteObject = {
        index: true,
        element: wrap(element, rolesAllowed, userRoles),
        handle,
      };
      return node;
    }

    const node: NonIndexRouteObject = {
      path,
      element: wrap(element, rolesAllowed, userRoles),
      handle,
      children: children ? transformRoutes(children, userRoles) : undefined,
    };
    return node;
  });
};

const AppRouter = () => {
  useInitAuth();
  const userRoles = useUserRoles();

  const routeObjects = React.useMemo(
    () => transformRoutes(routes, userRoles),
    [userRoles],
  );

  const router = React.useMemo(
    () => createBrowserRouter(routeObjects),
    [routeObjects],
  );

  return <RouterProvider router={router} />;
};

export default AppRouter;
