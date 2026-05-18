import api from '@/lib/axios';
import type { BookingStatus } from '../shared/types';
import type {
  CancelTourBookingBody,
  CreateTourBookingPayload,
  Tour,
  TourAvailabilityItem,
  TourBookingDetail,
  TourBookingListResponse,
  TourBookingRow,
  TourListItem,
  TourPaginatedResponse,
  TourQueryParams,
} from './types';
import * as I from '@/types/api';

export type GetBookingsParams = I.Paginate & {
  q?: string;
  status?: Exclude<BookingStatus, 'all'>;
  sort?: I.SortParam[];
};

export async function getBookings(params: GetBookingsParams) {
  const { pageIndex, pageSize, q, status, sort } = params;
  return api.get<I.ApiListResponse<TourBookingRow>>('/test-api/bookings', {
    params: {
      pageIndex,
      pageSize,
      q: q ?? undefined,
      status: status ?? undefined,
      sort: sort ? JSON.stringify(sort) : undefined,
    },
  });
}

export async function deleteBooking(id: string) {
  return api.delete<{ success: boolean }>(`/test-api/bookings/${id}`);
}

export async function createBooking(payload: Partial<TourBookingRow>) {
  return api.post<TourBookingRow>('/test-api/bookings', payload);
}

const TOURS_BASE = '/api/v1/public/tours';
const CLIENT_BOOKINGS_BASE = '/api/v1/client/tour-bookings';
const PUBLIC_BOOKINGS_BASE = '/api/v1/public/tour-bookings';

export function getTours(params?: TourQueryParams) {
  return api.get<TourPaginatedResponse>(TOURS_BASE, { params });
}

export function getTourById(id: string) {
  return api.get<Tour>(`${TOURS_BASE}/${id}`);
}

export function getFeaturedTours(limit = 6) {
  return api.get<TourListItem[]>(`${TOURS_BASE}/featured`, {
    params: { limit },
  });
}

export function getTourOptions(destinationId?: string) {
  return api.get<TourListItem[]>(`${TOURS_BASE}/options`, {
    params: destinationId ? { destinationId } : undefined,
  });
}

export function getTourAvailability(
  tourId: string,
  month: string,
): Promise<TourAvailabilityItem[]> {
  return api.get<TourAvailabilityItem[]>(
    `/api/v1/public/tour-inventory/tours/${tourId}/availability`,
    {
      params: { month },
    },
  );
}

export function createTourBooking(
  payload: CreateTourBookingPayload,
): Promise<TourBookingDetail> {
  return api.post<TourBookingDetail>(CLIENT_BOOKINGS_BASE, payload);
}

export function getTourBookingByCode(code: string): Promise<TourBookingDetail> {
  return api.get<TourBookingDetail>(
    `${PUBLIC_BOOKINGS_BASE}/by-code/${encodeURIComponent(code)}`,
  );
}

export function getMyTourBookings(params: {
  page?: number;
  limit?: number;
}): Promise<TourBookingListResponse> {
  return api.get<TourBookingListResponse>(`${CLIENT_BOOKINGS_BASE}/my-bookings`, {
    params: { page: params.page ?? 1, limit: params.limit ?? 10 },
  });
}

export function getMyTourBookingByCode(code: string): Promise<TourBookingDetail> {
  return api.get<TourBookingDetail>(
    `${CLIENT_BOOKINGS_BASE}/my-bookings/${encodeURIComponent(code)}`,
  );
}

export function getTourBookingById(id: string): Promise<TourBookingDetail> {
  return api.get<TourBookingDetail>(`${CLIENT_BOOKINGS_BASE}/${id}`);
}

export function cancelTourBooking(
  id: string,
  body?: CancelTourBookingBody,
): Promise<TourBookingDetail> {
  return api.patch<TourBookingDetail>(
    `${CLIENT_BOOKINGS_BASE}/${id}/cancel`,
    body ?? {},
  );
}

export interface UploadReceiptResponse {
  message: string;
  receipt: { url: string; uploadedAt: string; verified: boolean };
}

export function uploadTourBookingReceipt(
  id: string,
  file: File,
): Promise<UploadReceiptResponse> {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<UploadReceiptResponse>(
    `${CLIENT_BOOKINGS_BASE}/${id}/receipt`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
}

