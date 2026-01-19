// features/bookings/hooks/useMyBookings.ts
import { useQuery } from '@tanstack/react-query';
import { getBookingById, getMyBookings } from '../booking/api';
import type { ApiListResponse, SortParam } from '@interface/api';
import type { Booking } from '../shared/types';

const bookingKeys = {
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
  sort?: SortParam[];
}) {
  return useQuery<ApiListResponse<Booking>>({
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
  });
}

export function useGetBookingById(id?: string) {
  return useQuery<Booking>({
    queryKey: id ? bookingKeys.detail(id) : [],
    queryFn: () => getBookingById(id!),
    enabled: !!id,
  });
}
