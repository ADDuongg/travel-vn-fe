import { useQuery } from '@tanstack/react-query';
import {
  getTourById,
  getTourBySlug,
  getTours,
  getFeaturedTours,
} from './catalog-api';
import type { TourQueryParams } from './catalog-types';

export const tourCatalogKeys = {
  all: ['tours'] as const,
  list: (params?: TourQueryParams) =>
    [...tourCatalogKeys.all, 'list', params] as const,
  detail: (id: string) => [...tourCatalogKeys.all, 'detail', id] as const,
  bySlug: (slug: string) => [...tourCatalogKeys.all, 'slug', slug] as const,
  featured: (limit?: number) =>
    [...tourCatalogKeys.all, 'featured', limit] as const,
};

export function useToursQuery(params?: TourQueryParams) {
  return useQuery({
    queryKey: tourCatalogKeys.list(params),
    queryFn: () => getTours(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useTourQuery(id: string | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: tourCatalogKeys.detail(id ?? ''),
    queryFn: () => getTourById(id!),
    enabled: !!id && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTourBySlugQuery(slug: string | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: tourCatalogKeys.bySlug(slug ?? ''),
    queryFn: () => getTourBySlug(slug!),
    enabled: !!slug && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedToursQuery(limit = 6) {
  return useQuery({
    queryKey: tourCatalogKeys.featured(limit),
    queryFn: () => getFeaturedTours(limit),
    staleTime: 5 * 60 * 1000,
  });
}
