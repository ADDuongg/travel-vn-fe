// ProtectedRoute.tsx
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import api from '@/lib/axios';
interface ProtectedRouteProps {
  rolesAllowed?: string[];
  userRole?: string;
  children: React.ReactElement;
  fallbackPath?: string;
}
export function useAuthBootstrap() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['auth-me'],
    queryFn: () => api.get('/api/v1/auth/me'),
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      navigate('/login', { replace: true });
    }
  }, [isError]);

  return {
    user: data,
    isLoading,
  };
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  rolesAllowed,
  userRole,
  children,
  fallbackPath = '/login',
}) => {
  const location = useLocation();

  if (!rolesAllowed || rolesAllowed.length === 0) {
    return children;
  }

  if (!userRole || !rolesAllowed.includes(userRole)) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
