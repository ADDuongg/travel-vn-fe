import api from '@/lib/axios';
import type { BookingStatus } from '../shared/types';
import type { TourBookingRow } from './types';
import * as I from '@/interface/api';

export type GetBookingsParams = I.Paginate & {
  q?: string;
  status?: Exclude<BookingStatus, 'all'>; // nếu 'all' thì bỏ qua param
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
