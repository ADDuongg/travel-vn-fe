// features/review/hooks.ts

import { useNotifyMutation } from '@/lib/mutation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteReview,
  getMyReviews,
  getMyReviewsList,
  getReviews,
  submitReview,
  updateReview,
} from './api';
import type {
  MyReviewsListParams,
  Review,
  ReviewEntityType,
} from './types';
import { useAuthStore } from '@/stores/useAuthStore';

export const reviewKeys = {
  all: ['reviews'] as const,
  me: (params: { entityType: ReviewEntityType; entityId: string }) =>
    [...reviewKeys.all, 'me', params] as const,
  list: (params: { entityType: ReviewEntityType; entityId: string }) =>
    [...reviewKeys.all, 'list', params] as const,
  meList: (params: MyReviewsListParams) =>
    [...reviewKeys.all, 'meList', params] as const,
};

export function useReviewsQuery(
  params: {
    entityType: ReviewEntityType;
    entityId: string;
  },
  options?: { enabled?: boolean },
) {
  return useQuery<Review[]>({
    queryKey: reviewKeys.list(params),
    queryFn: () => getReviews(params),
    enabled:
      !!params.entityId && (options?.enabled !== false),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyReviewQuery(params: {
  entityType: ReviewEntityType;
  entityId: string;
}) {
  const authUser = useAuthStore((s) => s.authUser);

  return useQuery<Review | null>({
    queryKey: reviewKeys.me(params),
    queryFn: () => getMyReviews(params),
    enabled: !!authUser && !!params.entityId,
    staleTime: 1000 * 60,
  });
}

function invalidateEntityReviews(
  qc: ReturnType<typeof useQueryClient>,
  params: { entityType: ReviewEntityType; entityId: string },
) {
  qc.invalidateQueries({ queryKey: reviewKeys.list(params) });
  qc.invalidateQueries({ queryKey: reviewKeys.me(params) });
}

function invalidateMyReviewsList(
  qc: ReturnType<typeof useQueryClient>,
) {
  qc.invalidateQueries({ queryKey: [...reviewKeys.all, 'meList'] });
}

export function useMyReviewsListQuery(
  params: MyReviewsListParams,
  options?: { enabled?: boolean },
) {
  const authUser = useAuthStore((s) => s.authUser);

  return useQuery({
    queryKey: reviewKeys.meList(params),
    queryFn: () => getMyReviewsList(params),
    enabled: options?.enabled !== false && !!authUser,
    staleTime: 60 * 1000,
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();

  const mutation = useNotifyMutation({
    mutationFn: submitReview,
    successKey: 'notifications.review.submit_success',
    errorKey: 'notifications.review.submit_error',
    onSuccess: (_, variables) => {
      invalidateEntityReviews(qc, {
        entityType: variables.entityType,
        entityId: variables.entityId,
      });
      invalidateMyReviewsList(qc);
    },
  });

  return {
    submitReview: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error as Error & { message?: string } | null,
    reset: mutation.reset,
  };
}

export function useDeleteReview() {
  const qc = useQueryClient();

  const mutation = useNotifyMutation({
    mutationFn: deleteReview,
    successKey: 'notifications.review.delete_success',
    errorKey: 'notifications.review.delete_error',
    onSuccess: (_, variables) => {
      invalidateEntityReviews(qc, {
        entityType: variables.entityType,
        entityId: variables.entityId,
      });
      invalidateMyReviewsList(qc);
    },
  });

  return {
    deleteReview: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error as Error & { message?: string } | null,
    reset: mutation.reset,
  };
}

export function useEditReview() {
  const qc = useQueryClient();

  const mutation = useNotifyMutation({
    mutationFn: updateReview,
    successKey: 'notifications.review.edit_success',
    errorKey: 'notifications.review.edit_error',
    onSuccess: (_, variables) => {
      invalidateEntityReviews(qc, {
        entityType: variables.entityType,
        entityId: variables.entityId,
      });
      invalidateMyReviewsList(qc);
    },
  });

  return {
    editReview: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error as Error & { message?: string } | null,
    reset: mutation.reset,
  };
}
