// features/review/api.ts

import api from '@/lib/axios';
import type * as I from '@/types/api';
import type {
  DeleteReviewInput,
  MyReviewListItem,
  MyReviewsListParams,
  MyReviewsListPayload,
  Review,
  ReviewEntityType,
  MyReviewTableRow,
  UpdateReviewInput,
} from './types';

export function getReviews(params: {
  entityType: ReviewEntityType;
  entityId: string;
}) {
  return api.get<Review[]>('/api/v1/reviews', { params });
}

export async function getMyReviews(params: {
  entityType: ReviewEntityType;
  entityId: string;
}): Promise<Review | null> {
  try {
    return await api.get<Review>('/api/v1/reviews/me', { params });
  } catch (e: unknown) {
    const status = (e as { response?: { status?: number } })?.response?.status;
    if (status === 404) return null;
    throw e;
  }
}

function isListPayload(
  v: MyReviewsListPayload | MyReviewListItem[],
): v is MyReviewsListPayload {
  return !Array.isArray(v) && Array.isArray(v?.data);
}

/**
 * GET /api/v1/reviews/me/list — maps to shared ApiListResponse for DataTable.
 */
export async function getMyReviewsList(
  params: MyReviewsListParams,
): Promise<I.ApiListResponse<MyReviewTableRow>> {
  const payload = await api.get<MyReviewsListPayload | MyReviewListItem[]>(
    '/api/v1/reviews/me/list',
    { params },
  );

  const rawList = isListPayload(payload) ? payload.data : payload;
  const pagination = isListPayload(payload)
    ? payload.pagination
    : { page: 1, limit: rawList.length || 20, total: rawList.length };

  const pageSize = Math.max(1, pagination.limit);
  const pageIndex = Math.max(0, pagination.page - 1);
  const total = pagination.total;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const data: MyReviewTableRow[] = rawList.map((item) => ({
    ...item,
    id: item._id,
  }));

  return {
    data,
    meta: {
      pageIndex,
      pageSize,
      total,
      pageCount,
    },
  };
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
