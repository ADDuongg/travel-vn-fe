import api from '@/lib/axios';
import type { Hotel, HotelOption } from './types';

export interface GetHotelsParams {
  provinceId?: string;
}

export function getHotels(params?: GetHotelsParams) {
  return api.get<HotelOption[]>('/api/v1/hotels', { params });
}

export function getHotelOptions(params?: GetHotelsParams) {
  return api.get<HotelOption[]>('/api/v1/hotels/options', { params });
}

export function getHotelById(id: string) {
  return api.get<Hotel>(`/api/v1/hotels/${id}`);
}
