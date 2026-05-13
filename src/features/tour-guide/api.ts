import api from '@/lib/axios';
import type {
  TourGuide,
  TourGuidePaginatedResponse,
  TourGuideQueryParams,
  TourGuideRegisterPayload,
  TourGuideReviewsResponse,
  TourGuideUpdatePayload,
} from './types';

const PUBLIC_BASE = '/api/v1/public/tour-guides';
const CLIENT_BASE = '/api/v1/client/tour-guides';

export function getTourGuides(params?: TourGuideQueryParams) {
  return api.get<TourGuidePaginatedResponse>(PUBLIC_BASE, { params });
}

export function getTourGuideById(id: string) {
  return api.get<TourGuide>(`${PUBLIC_BASE}/${id}`);
}

export function getTourGuideReviews(
  guideId: string,
  params?: { page?: number; limit?: number },
) {
  return api.get<TourGuideReviewsResponse>(`${PUBLIC_BASE}/${guideId}/reviews`, {
    params,
  });
}

export function registerTourGuide(payload: TourGuideRegisterPayload) {
  return api.post<TourGuide>(`${CLIENT_BASE}/register`, payload);
}

function isAxiosNotFound(err: unknown): boolean {
  const status = (err as { response?: { status?: number } })?.response?.status;
  return status === 404;
}

export async function getMyTourGuideProfile(): Promise<TourGuide | null> {
  try {
    return await api.get<TourGuide>(`${CLIENT_BASE}/my-profile`);
  } catch (err: unknown) {
    if (isAxiosNotFound(err)) return null;
    throw err;
  }
}

export function updateMyTourGuideProfile(payload: TourGuideUpdatePayload) {
  return api.patch<TourGuide>(`${CLIENT_BASE}/my-profile`, payload);
}
