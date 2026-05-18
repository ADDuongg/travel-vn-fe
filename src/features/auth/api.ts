import api from '@/lib/axios';
import type {
  ForgotPasswordConfirmPayload,
  ResendVerifyEmailPayload,
  VerifyEmailPayload,
} from '@/types/auth';
import * as I from '@/types/auth';

export function login(data: I.LoginFormValues) {
  return api.post<I.LoginPayload>('/api/v1/auth/login', data);
}

export function register(data: I.RegisterFormValues) {
  return api.post<I.LoginPayload>('/api/v1/auth/register', data);
}

export function logout() {
  return api.post<I.LoginPayload>('/api/v1/auth/logout');
}

export function getMe() {
  return api.get<I.UserProfile>('/api/v1/auth/me');
}

export function refresh() {
  return api.post<I.LoginPayload>('/api/v1/auth/refresh');
}

export function forgotPasswordRequest(payload: { identifier: string }) {
  return api.post<{ message: string }, { identifier: string }>(
    '/api/v1/auth/forgot-password/request',
    payload,
  );
}

export function forgotPasswordConfirm(payload: ForgotPasswordConfirmPayload) {
  return api.post<{ message: string }, ForgotPasswordConfirmPayload>(
    '/api/v1/auth/forgot-password/confirm',
    payload,
  );
}

export function verifyEmail(payload: VerifyEmailPayload) {
  return api.post<unknown, VerifyEmailPayload>(
    '/api/v1/auth/verify-email',
    payload,
  );
}

export function resendVerifyEmail(payload: ResendVerifyEmailPayload) {
  return api.post<unknown, ResendVerifyEmailPayload>(
    '/api/v1/auth/resend-verify-email',
    payload,
  );
}

