// features/review/hooks.ts

import * as I from '@interface/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe, login, logout, refresh, register } from './api';
import { authUtils } from '@lib/auth-token';
import { authKeyQuery } from './key';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/constants/router';
import { useAuthStore } from '@/stores/useAuthStore';

export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const mutation = useMutation<I.LoginPayload, Error, I.LoginFormValues>({
    mutationFn: login,
    onSuccess: (data) => {
      authUtils.setAccessToken(data.access_token);
      setUser(data.account);
      queryClient.removeQueries({ queryKey: authKeyQuery.me });
    },
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
  };
}

export function useRegister() {
  const queryClient = useQueryClient();

  const mutation = useMutation<I.LoginPayload, Error, I.LoginFormValues>({
    mutationFn: register,
    onSuccess: (data) => {
      authUtils.setAccessToken(data.access_token);
      queryClient.removeQueries({ queryKey: authKeyQuery.me });
    },
  });

  return {
    register: mutation.mutate,
    isPending: mutation.isPending,
  };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const clearUser = useAuthStore((s) => s.clearUser);

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      authUtils.clearAccessToken();
      clearUser();
      queryClient.removeQueries({ queryKey: authKeyQuery.me });
      navigate(ROUTES.LOGIN);
    },
  });

  return {
    logout: mutation.mutate,
    isPending: mutation.isPending,
  };
}

export function useMe() {
  return useQuery({
    queryKey: authKeyQuery.me,
    queryFn: () => getMe(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useRefresh() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const mutation = useMutation({
    mutationFn: refresh,
    onSuccess: (data) => {
      authUtils.setAccessToken(data.access_token);
      setUser(data.account);
      queryClient.removeQueries({ queryKey: authKeyQuery.me });
    },
  });

  return {
    refresh: mutation.mutate,
    // isPending: mutation.isPending,
  };
}
