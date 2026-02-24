/**
 * Tour Booking Phase 2 API – FE Client only
 * docs/FE-API-TOUR-PHASE2.md
 */
import api from '@/lib/axios';
import type {
  TourAvailabilityItem,
  CreateTourBookingPayload,
  TourBookingDetail,
  TourBookingListResponse,
  CancelTourBookingBody,
} from './booking-types';

const TOURS_BASE = '/api/v1/tours';
const BOOKINGS_BASE = '/api/v1/tour-bookings';

/** 1.1 GET tours/:id/availability?month=YYYY-MM (Public) */
export function getTourAvailability(
  tourId: string,
  month: string,
): Promise<TourAvailabilityItem[]> {
  return api.get<TourAvailabilityItem[]>(`${TOURS_BASE}/${tourId}/availability`, {
    params: { month },
  });
}

/** POST tour-bookings */
export function createTourBooking(
  payload: CreateTourBookingPayload,
): Promise<TourBookingDetail> {
  return api.post<TourBookingDetail>(BOOKINGS_BASE, payload);
}

/** GET tour-bookings/by-code/:code (public lookup) */
export function getTourBookingByCode(code: string): Promise<TourBookingDetail> {
  return api.get<TourBookingDetail>(`${BOOKINGS_BASE}/by-code/${encodeURIComponent(code)}`);
}

/** GET tour-bookings/my-bookings (Bearer) */
export function getMyTourBookings(params: {
  page?: number;
  limit?: number;
}): Promise<TourBookingListResponse> {
  return api.get<TourBookingListResponse>(`${BOOKINGS_BASE}/my-bookings`, {
    params: { page: params.page ?? 1, limit: params.limit ?? 10 },
  });
}

/** GET tour-bookings/my-bookings/:code (Bearer) */
export function getMyTourBookingByCode(code: string): Promise<TourBookingDetail> {
  return api.get<TourBookingDetail>(
    `${BOOKINGS_BASE}/my-bookings/${encodeURIComponent(code)}`,
  );
}

/** 3.6 GET tour-bookings/:id (detail by ObjectId, Public) */
export function getTourBookingById(id: string): Promise<TourBookingDetail> {
  return api.get<TourBookingDetail>(`${BOOKINGS_BASE}/${id}`);
}

/** 3.8 PATCH tour-bookings/:id/cancel (User/Admin – client dùng cho "Hủy đơn") */
export function cancelTourBooking(
  id: string,
  body?: CancelTourBookingBody,
): Promise<TourBookingDetail> {
  return api.patch<TourBookingDetail>(`${BOOKINGS_BASE}/${id}/cancel`, body ?? {});
}

/** 3.10.1 POST tour-bookings/:id/receipt – Upload ảnh chuyển khoản (multipart/form-data, field `file`) */
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
  return api.post<UploadReceiptResponse>(`${BOOKINGS_BASE}/${id}/receipt`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
