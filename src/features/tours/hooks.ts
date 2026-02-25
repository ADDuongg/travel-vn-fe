import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBooking,
  deleteBooking,
  getBookings,
  type GetBookingsParams,
} from './api';
import type { TourBookingRow } from './types';
import * as I from '@/interface/api';
export const bookingKeys = {
  all: ['bookings'] as const,
  list: (filters: unknown) => [...bookingKeys.all, 'list', filters] as const,
  detail: (id: string) => [...bookingKeys.all, 'detail', id] as const,
};
export function useBookingsQuery(params: GetBookingsParams) {
  return useQuery<I.ApiListResponse<TourBookingRow>>({
    queryKey: bookingKeys.list(params),
    queryFn: () => getBookings(params),
    // keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    // select: (page) => page, // tuỳ nếu muốn map về UI shape
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}

export function useDeleteBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
