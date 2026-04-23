import { useQuery } from '@tanstack/react-query';
import {
  getHotels,
  getHotelOptions,
  getHotelById,
  type GetHotelsParams,
} from './api';
import type { Hotel, HotelOption, HotelPaginatedResponse } from './types';

export const hotelKeys = {
  all: ['hotels'] as const,
  list: (params?: GetHotelsParams) =>
    [...hotelKeys.all, 'list', params] as const,
  options: (params?: GetHotelsParams) =>
    [...hotelKeys.all, 'options', params] as const,
  detail: (id: string) => [...hotelKeys.all, 'detail', id] as const,
};

export function useHotelsQuery(params?: GetHotelsParams) {
  return useQuery<HotelPaginatedResponse>({
    queryKey: hotelKeys.list(params),
    queryFn: () => getHotels(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHotelOptionsQuery(params?: GetHotelsParams) {
  return useQuery<HotelOption[]>({
    queryKey: hotelKeys.options(params),
    queryFn: () => getHotelOptions(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHotelDetailQuery(id?: string) {
  return useQuery<Hotel>({
    queryKey: hotelKeys.detail(id ?? ''),
    queryFn: () => getHotelById(id!),
    enabled: !!id,
  });
}
