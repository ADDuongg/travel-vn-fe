import api from '@/lib/axios';
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

export function forgotPasswordConfirm(payload: { token: string; newPassword: string }) {
  return api.post<{ message: string }, typeof payload>(
    '/api/v1/auth/forgot-password/confirm',
    payload,
  );
}

export function sendOtpVerifyEmail(payload: { target: string }) {
  return api.post<{ success: boolean }, { purpose: string; target: string }>(
    '/api/v1/otp/send',
    { purpose: 'VERIFY_EMAIL', target: payload.target },
  );
}

export function verifyOtpEmail(payload: { target: string; code: string }) {
  return api.post<
    { success: boolean; purpose: string; target: string },
    { purpose: string; target: string; code: string }
  >('/api/v1/otp/verify', {
    purpose: 'VERIFY_EMAIL',
    target: payload.target,
    code: payload.code,
  });
}
