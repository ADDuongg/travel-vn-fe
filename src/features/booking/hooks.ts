// features/bookings/hooks/useMyBookings.ts
import { useNotifyMutation } from '@/lib/mutation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBookingById, getMyBookings, cancelBooking } from '../booking/api';
import * as I from '@/types/api';
import type { Booking } from '../shared/types';

export const bookingKeys = {
  all: ['bookings'] as const,
  list: (filters: unknown) => [...bookingKeys.all, 'list', filters] as const,
  detail: (id: string) => [...bookingKeys.all, 'detail', id] as const,
};

export function useMyBookings({
  pageIndex,
  pageSize,
  q,
  status,
  sort,
}: {
  pageIndex: number;
  pageSize: number;
  q?: string;
  status?: string;
  sort?: I.SortParam[];
}) {
  return useQuery<I.ApiListResponse<Booking>>({
    queryKey: bookingKeys.list({ pageIndex, pageSize, q, status, sort }),
    queryFn: async () => {
      const res = await getMyBookings({
        pageIndex,
        pageSize,
        q,
        status,
        sort,
      });
      return res;
    },
    placeholderData: (prev) =>
      prev ?? {
        data: [],
        meta: {
          pageIndex,
          pageSize,
          total: 0,
          pageCount: 0,
        },
      },
    retry: 1,
  });
}

export function useGetBookingById(id?: string) {
  return useQuery<Booking>({
    queryKey: id ? bookingKeys.detail(id) : [],
    queryFn: () => getBookingById(id!),
    enabled: !!id,
  });
}

/** PATCH bookings/:id/cancel – invalidates list & detail */
export function useCancelRoomBookingMutation() {
  const qc = useQueryClient();
  return useNotifyMutation({
    mutationFn: (id: string) => cancelBooking(id),
    successKey: 'notifications.booking.room.cancel_success',
    errorKey: 'notifications.booking.room.cancel_error',
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
