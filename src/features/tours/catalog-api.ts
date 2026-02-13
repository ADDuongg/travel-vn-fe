import api from '@/lib/axios';
import type {
  Tour,
  TourListItem,
  TourPaginatedResponse,
  TourQueryParams,
} from './catalog-types';

const BASE = '/api/v1/tours';

export function getTours(params?: TourQueryParams) {
  return api.get<TourPaginatedResponse>(BASE, { params });
}

export function getTourById(id: string) {
  return api.get<Tour>(`${BASE}/${id}`);
}

export function getTourBySlug(slug: string) {
  return api.get<Tour>(`${BASE}/slug/${slug}`);
}

export function getFeaturedTours(limit = 6) {
  return api.get<TourListItem[]>(`${BASE}/featured`, {
    params: { limit },
  });
}

export function getTourOptions(destinationId?: string) {
  return api.get<TourListItem[]>(`${BASE}/options`, {
    params: destinationId ? { destinationId } : undefined,
  });
}
