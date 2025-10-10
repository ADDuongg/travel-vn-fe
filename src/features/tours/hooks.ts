import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingKeys } from './keys';
import {
  createBooking,
  deleteBooking,
  getBookings,
  type GetBookingsParams,
} from './api';
import type { TourBookingRow } from './types';
import type { ApiPage } from '@interface/api';

export function useBookingsQuery(params: GetBookingsParams) {
  return useQuery<ApiPage<TourBookingRow>>({
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
