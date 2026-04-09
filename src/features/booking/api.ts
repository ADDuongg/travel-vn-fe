// features/bookings/booking/api.ts
import api from '@/lib/axios';
import type { Booking } from '../shared/types';
import * as I from '@/types/api';

export async function getMyBookings(params: {
  pageIndex: number;
  pageSize: number;
  q?: string;
  status?: string;
  sort?: I.SortParam[];
}) {
  return api.get<I.ApiListResponse<Booking>>('/api/v1/bookings/me', {
    params: {
      page: params.pageIndex + 1,
      limit: params.pageSize,
      q: params.q,
      status: params.status,
      sort: params.sort,
    },
  });
}

export async function getBookingById(id: string) {
  return api.get<Booking>(`/api/v1/bookings/me/${id}`);
}

/** PATCH /api/v1/bookings/:id/cancel – User/Admin, Bearer required */
export async function cancelBooking(id: string) {
  return api.patch<Booking>(`/api/v1/bookings/${id}/cancel`);
}
