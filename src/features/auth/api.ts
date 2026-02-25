import api from '@/lib/axios';
import * as I from '@/interface/auth';

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
