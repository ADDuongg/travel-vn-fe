import api from '@/lib/axios';
import type {
  ProvinceDetail,
  ProvinceDropdownItem,
  ProvinceListItem,
  ProvinceListParams,
  ProvinceListResponse,
} from './types';

const BASE = '/api/v1/public/provinces';

export function getProvincesList(params?: ProvinceListParams) {
  return api.get<ProvinceListResponse>(BASE, { params });
}

export function getPopularProvinces() {
  return api.get<ProvinceListItem[]>(`${BASE}/popular`);
}
export function getProvinceBySlug(slug: string) {
  return api.get<ProvinceDetail>(`${BASE}/${slug}`);
}
export function getProvinces() {
  return api.get<ProvinceDropdownItem[]>(`${BASE}/dropdown`);
}

