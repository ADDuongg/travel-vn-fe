// ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  rolesAllowed?: string[];
  userRoles?: string[];
  children: React.ReactNode;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  rolesAllowed,
  userRoles,
  children,
  fallbackPath = '/login',
}) => {
  const location = useLocation();

  if (!rolesAllowed || rolesAllowed.length === 0) {
    return children;
  }

  const hasRole =
    Array.isArray(userRoles) &&
    userRoles.some((role) => rolesAllowed.includes(role));

  if (!hasRole) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
