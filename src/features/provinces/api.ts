import api from '@/lib/axios';
import type {
  ProvinceDetail,
  ProvinceDropdownItem,
  ProvinceListItem,
  ProvinceListParams,
  ProvinceListResponse,
} from './types';

const BASE = '/api/v1/provinces';

/** Danh sách tỉnh (filter, pagination) */
export function getProvincesList(params?: ProvinceListParams) {
  return api.get<ProvinceListResponse>(BASE, { params });
}

/** Tỉnh nổi bật */
export function getPopularProvinces() {
  return api.get<ProvinceListItem[]>(`${BASE}/popular`);
}

/** Chi tiết tỉnh (kèm wards) */
export function getProvinceBySlug(slug: string) {
  return api.get<ProvinceDetail>(`${BASE}/${slug}`);
}

/** Dropdown cho form (chọn tỉnh → quận/huyện) */
export function getProvinces() {
  return api.get<ProvinceDropdownItem[]>(`${BASE}/dropdown`);
}
