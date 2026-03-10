import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTourGuideById,
  getTourGuides,
  getTourGuideReviews,
  registerTourGuide,
} from './api';
import { tourGuideKeys } from './key';
import type { TourGuide, TourGuideQueryParams, TourGuideRegisterPayload } from './types';

export function useTourGuidesQuery(
  params?: TourGuideQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: tourGuideKeys.list(params),
    queryFn: () => getTourGuides(params),
    enabled: options?.enabled ?? true,
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

export function useRegisterTourGuide() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    TourGuide,
    Error,
    TourGuideRegisterPayload
  >({
    mutationFn: registerTourGuide,
    onSuccess: (guide) => {
      // Invalidate tour guide lists so new profile appears where relevant
      queryClient.invalidateQueries({ queryKey: tourGuideKeys.lists() });
      if (guide._id) {
        queryClient.invalidateQueries({
          queryKey: tourGuideKeys.detail(guide._id),
        });
      }
    },
  });

  return {
    registerTourGuide: mutation.mutate,
    isPending: mutation.isPending,
  };
}
