/* eslint-disable @typescript-eslint/no-unused-vars */
// features/review/api.ts

import api from '@/lib/axios';
import type {
  DeleteReviewInput,
  Review,
  ReviewEntityType,
  UpdateReviewInput,
} from './types';

export function getReviews(params: {
  entityType: ReviewEntityType;
  entityId: string;
}) {
  return api.get<Review[]>('/api/v1/reviews', { params });
}

export function getMyReviews(params: {
  entityType: ReviewEntityType;
  entityId: string;
}) {
  return api.get<Review>('/api/v1/reviews/me', { params });
}

export function submitReview(payload: {
  entityType: ReviewEntityType;
  entityId: string;

  rating?: number;
  comment?: string;

  isAnonymous?: boolean;
}) {
  return api.post('/api/v1/reviews', payload);
}

export const deleteReview = ({ id }: DeleteReviewInput) =>
  api.delete(`/api/v1/reviews/${id}`);

export const updateReview = (payload: UpdateReviewInput) => {
  return api.post('/api/v1/reviews', payload);
};
