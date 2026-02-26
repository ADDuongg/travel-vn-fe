import api from '@/lib/axios';
import type {
  TourGuide,
  TourGuideListItem,
  TourGuidePaginatedResponse,
  TourGuideQueryParams,
  TourGuideReviewsResponse,
} from './types';

const BASE = '/api/v1/tour-guides';

export function getTourGuides(params?: TourGuideQueryParams) {
  return api.get<TourGuidePaginatedResponse>(BASE, { params });
}

export function getTourGuideById(id: string) {
  return api.get<TourGuide>(`${BASE}/${id}`);
}

export function getTourGuideReviews(
  guideId: string,
  params?: { page?: number; limit?: number },
) {
  return api.get<TourGuideReviewsResponse>(`${BASE}/${guideId}/reviews`, {
    params,
  });
}
