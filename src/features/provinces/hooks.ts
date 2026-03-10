import { useQuery } from '@tanstack/react-query';
import {
  getProvinces,
  getProvincesList,
  getPopularProvinces,
  getProvinceBySlug,
} from './api';
import type {
  Province,
  ProvinceDetail,
  ProvinceListItem,
  ProvinceListParams,
} from './types';

export const provinceKeys = {
  all: ['provinces'] as const,
  list: (params?: ProvinceListParams) =>
    [...provinceKeys.all, 'list', params] as const,
  popular: () => [...provinceKeys.all, 'popular'] as const,
  detail: (slug: string) => [...provinceKeys.all, 'detail', slug] as const,
  dropdown: () => [...provinceKeys.all, 'dropdown'] as const,
};

/** Dropdown – form select (tỉnh → quận/huyện) */
export function useProvincesQuery() {
  return useQuery<Province[]>({
    queryKey: provinceKeys.dropdown(),
    queryFn: getProvinces,
    staleTime: 10 * 60 * 1000,
  });
}

/** Danh sách tỉnh (filter, pagination) */
export function useProvincesListQuery(params?: ProvinceListParams) {
  return useQuery({
    queryKey: provinceKeys.list(params),
    queryFn: () => getProvincesList(params),
    staleTime: 5 * 60 * 1000,
  });
}

/** Tỉnh nổi bật */
export function usePopularProvincesQuery() {
  return useQuery<ProvinceListItem[]>({
    queryKey: provinceKeys.popular(),
    queryFn: getPopularProvinces,
    staleTime: 10 * 60 * 1000,
  });
}

/** Chi tiết tỉnh theo slug */
export function useProvinceDetailQuery(slug: string) {
  return useQuery<ProvinceDetail>({
    queryKey: provinceKeys.detail(slug),
    queryFn: () => getProvinceBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}
