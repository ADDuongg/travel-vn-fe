import api from '@/lib/axios';
import type {
  Hotel,
  HotelOption,
  HotelPaginatedResponse,
  HotelQueryParams,
} from './types';

export type GetHotelsParams = HotelQueryParams;

export function getHotels(params?: GetHotelsParams) {
  return api.get<HotelPaginatedResponse>('/api/v1/public/hotels', { params });
}

export function getHotelOptions(params?: GetHotelsParams) {
  return api.get<HotelOption[]>('/api/v1/public/hotels/options', { params });
}

export function getHotelById(id: string) {
  return api.get<Hotel>(`/api/v1/public/hotels/${id}`);
}
