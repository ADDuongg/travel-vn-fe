import { useNotifyMutation } from '@/lib/mutation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMyTourGuideProfile,
  getTourGuideById,
  getTourGuides,
  getTourGuideReviews,
  registerTourGuide,
  updateMyTourGuideProfile,
} from './api';
import { tourGuideKeys } from './key';
import type {
  TourGuide,
  TourGuideQueryParams,
  TourGuideRegisterPayload,
  TourGuideUpdatePayload,
} from './types';

export function useMyTourGuideQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: tourGuideKeys.myProfile(),
    queryFn: getMyTourGuideProfile,
    enabled: options?.enabled ?? true,
    staleTime: 2 * 60 * 1000,
  });
}

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

  const mutation = useNotifyMutation<
    TourGuide,
    Error,
    TourGuideRegisterPayload
  >({
    mutationFn: registerTourGuide,
    successKey: 'notifications.tour_guide.register_success',
    errorKey: 'notifications.tour_guide.error',
    onSuccess: (guide) => {
      queryClient.invalidateQueries({ queryKey: tourGuideKeys.myProfile() });
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

export function useUpdateMyTourGuide() {
  const queryClient = useQueryClient();

  const mutation = useNotifyMutation<
    TourGuide,
    Error,
    TourGuideUpdatePayload
  >({
    mutationFn: updateMyTourGuideProfile,
    successKey: 'notifications.tour_guide.update_success',
    errorKey: 'notifications.tour_guide.error',
    onSuccess: (guide) => {
      queryClient.invalidateQueries({ queryKey: tourGuideKeys.myProfile() });
      queryClient.invalidateQueries({ queryKey: tourGuideKeys.lists() });
      if (guide._id) {
        queryClient.invalidateQueries({
          queryKey: tourGuideKeys.detail(guide._id),
        });
      }
    },
  });

  return {
    updateMyTourGuide: mutation.mutate,
    isPending: mutation.isPending,
  };
}

