import { useQuery } from '@tanstack/react-query';
import { getTourGuideById, getTourGuides, getTourGuideReviews } from './api';
import { tourGuideKeys } from './key';
import type { TourGuideQueryParams } from './types';

export function useTourGuidesQuery(params?: TourGuideQueryParams) {
  return useQuery({
    queryKey: tourGuideKeys.list(params),
    queryFn: () => getTourGuides(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useTourGuideQuery(
  id: string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: tourGuideKeys.detail(id ?? ''),
    queryFn: () => getTourGuideById(id!),
    enabled: !!id && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTourGuideReviewsQuery(
  guideId: string | undefined,
  params?: { page?: number; limit?: number },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: tourGuideKeys.reviews(guideId ?? '', params?.page),
    queryFn: () =>
      getTourGuideReviews(guideId!, {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
      }),
    enabled: !!guideId && (options?.enabled ?? true),
    staleTime: 2 * 60 * 1000,
  });
}
