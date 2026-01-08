// features/review/hooks.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteReview,
  getMyReviews,
  getReviews,
  submitReview,
  updateReview,
} from './api';
import type { Review, ReviewEntityType } from './types';
import { useAuthStore } from '@/stores/useAuthStore';

export const reviewKeys = {
  all: ['reviews'] as const,
  me: ['me'] as const,
  list: (params: { entityType: ReviewEntityType; entityId: string }) =>
    [...reviewKeys.all, params] as const,
};

export function useReviewsQuery(params: {
  entityType: ReviewEntityType;
  entityId: string;
}) {
  return useQuery<Review[]>({
    queryKey: reviewKeys.list(params),
    queryFn: () => getReviews(params),
    enabled: !!params.entityId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyReviewQuery(params: {
  entityType: ReviewEntityType;
  entityId: string;
}) {
  const authUser = useAuthStore((s) => s.authUser);

  return useQuery<Review | null>({
    queryKey: reviewKeys.me,
    queryFn: () => getMyReviews(params),
    enabled: !!authUser,
    staleTime: 1000 * 60,
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitReview,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: reviewKeys.list({
          entityType: variables.entityType,
          entityId: variables.entityId,
        }),
      });
    },
  });

  return {
    submitReview: mutation.mutate,
    isPending: mutation.isPending,
  };
}

export function useDeleteReview() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: reviewKeys.list({
          entityType: variables.entityType,
          entityId: variables.entityId,
        }),
      });
    },
  });

  return {
    deleteReview: mutation.mutate,
    isPending: mutation.isPending,
  };
}

export function useEditReview() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateReview,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: reviewKeys.list({
          entityType: variables.entityType,
          entityId: variables.entityId,
        }),
      });
    },
  });

  return {
    editReview: mutation.mutate,
    isPending: mutation.isPending,
  };
}
