import { ROUTES } from '@/constants/router';
import { useNotifyMutation } from '@/lib/mutation';
import { useAuthStore } from '@/stores/useAuthStore';
import type { ForgotPasswordConfirmPayload } from '@/types/auth';
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
  resendVerifyEmail,
  verifyEmail,
} from './api';
import { authKeyQuery } from './key';

export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const mutation = useNotifyMutation<I.LoginPayload, Error, I.LoginFormValues>({
    mutationFn: login,
    successKey: 'notifications.auth.login_success',
    errorKey: 'notifications.auth.login_error',
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
    error: mutation.error,
    isError: mutation.isError,
    reset: mutation.reset,
  };
}

export function useRegister() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  const mutation = useNotifyMutation<
    I.LoginPayload,
    Error,
    I.RegisterFormValues
  >({
    mutationFn: register,
    silentSuccess: true,
    errorKey: 'notifications.auth.register_error',
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

  const mutation = useNotifyMutation({
    mutationFn: logout,
    successKey: 'notifications.auth.logout_success',
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
  };
}

export function useForgotPasswordRequest() {
  const mutation = useNotifyMutation({
    mutationFn: forgotPasswordRequest,
    successKey: 'notifications.auth.forgot_request_sent',
    errorKey: 'notifications.auth.forgot_request_error',
  });

  return {
    forgotPasswordRequest: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
  };
}

export function useForgotPasswordConfirm() {
  const mutation = useNotifyMutation<
    { message: string },
    Error,
    ForgotPasswordConfirmPayload
  >({
    mutationFn: forgotPasswordConfirm,
    successKey: 'notifications.auth.forgot_reset_done',
    errorKey: 'notifications.auth.forgot_reset_error',
  });

  return {
    forgotPasswordConfirm: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
  };
}

export function useResendVerifyEmail() {
  const mutation = useNotifyMutation({
    mutationFn: resendVerifyEmail,
    successKey: 'notifications.auth.verify_email_resend_sent',
    errorKey: 'notifications.auth.verify_email_resend_error',
  });

  return {
    resendVerifyEmail: mutation.mutate,
    resendVerifyEmailAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const mutation = useNotifyMutation<
    I.LoginPayload,
    Error,
    I.VerifyEmailPayload
  >({
    mutationFn: async (payload) => {
      await verifyEmail(payload);
      return refresh();
    },
    successKey: 'notifications.auth.verify_email_done',
    errorKey: 'notifications.auth.verify_email_error',
    onSuccess: (data) => {
      authUtils.setAccessToken(data.access_token);
      setUser(data.account);
      queryClient.removeQueries({ queryKey: authKeyQuery.me });
      queryClient.prefetchQuery({
        queryKey: authKeyQuery.me,
        queryFn: () => getMe(),
      });
      navigate(ROUTES.DASHBOARD.INDEX);
    },
  });

  return {
    verifyEmail: mutation.mutate,
    verifyEmailAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}

