import api from '@/lib/axios';
import type { Province } from './types';

export function getProvinces() {
  return api.get<Province[]>('/api/v1/provinces');
}
