// features/auth/hooks.ts

import { ROUTES } from '@/constants/router';
import { useAuthStore } from '@/stores/useAuthStore';
import * as I from '@/types/auth';
import { authUtils } from '@lib/auth-token';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import {
  forgotPasswordConfirm,
  forgotPasswordRequest,
  getMe,
  login,
  logout,
  refresh,
  register,
  sendOtpVerifyEmail,
  verifyOtpEmail,
} from './api';
import { authKeyQuery } from './key';

export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const mutation = useMutation<I.LoginPayload, Error, I.LoginFormValues>({
    mutationFn: login,
    onSuccess: (data) => {
      authUtils.setAccessToken(data.access_token);
      setUser(data.account);
      queryClient.removeQueries({ queryKey: authKeyQuery.me });
      queryClient.prefetchQuery({
        queryKey: authKeyQuery.me,
        queryFn: () => getMe(),
      });
    },
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
  };
}

export function useRegister() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  const mutation = useMutation<I.LoginPayload, Error, I.RegisterFormValues>({
    mutationFn: register,
    onSuccess: (data) => {
      authUtils.setAccessToken(data.access_token);
      setUser(data.account);
      queryClient.removeQueries({ queryKey: authKeyQuery.me });
      queryClient.prefetchQuery({
        queryKey: authKeyQuery.me,
        queryFn: () => getMe(),
      });
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
      queryClient.prefetchQuery({
        queryKey: authKeyQuery.me,
        queryFn: () => getMe(),
      });
    },
  });

  return {
    refresh: mutation.mutate,
    // isPending: mutation.isPending,
  };
}

export function useForgotPasswordRequest() {
  const mutation = useMutation({
    mutationFn: forgotPasswordRequest,
  });

  return {
    forgotPasswordRequest: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
  };
}

export function useForgotPasswordConfirm() {
  const mutation = useMutation({
    mutationFn: forgotPasswordConfirm,
  });

  return {
    forgotPasswordConfirm: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
  };
}

export function useSendOtpVerifyEmail() {
  const mutation = useMutation({
    mutationFn: sendOtpVerifyEmail,
  });

  return {
    sendOtpVerifyEmail: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
  };
}

export function useVerifyOtpEmail() {
  const mutation = useMutation({
    mutationFn: verifyOtpEmail,
  });

  return {
    verifyOtpEmail: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
  };
}
