/**
 * Tour Booking Phase 2 – React Query hooks (FE Client only)
 */
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getTourAvailability,
  createTourBooking,
  getTourBookingByCode,
  getMyTourBookings,
  getMyTourBookingByCode,
  getTourBookingById,
  cancelTourBooking,
  uploadTourBookingReceipt,
} from './booking-api';
import type { CreateTourBookingPayload, CancelTourBookingBody } from './booking-types';

export const tourBookingKeys = {
  all: ['tour-bookings'] as const,
  availability: (tourId: string, month: string) =>
    [...tourBookingKeys.all, 'availability', tourId, month] as const,
  byCode: (code: string) => [...tourBookingKeys.all, 'by-code', code] as const,
  byId: (id: string) => [...tourBookingKeys.all, 'by-id', id] as const,
  myList: (params: { page?: number; limit?: number }) =>
    [...tourBookingKeys.all, 'my-list', params] as const,
  myDetail: (code: string) => [...tourBookingKeys.all, 'my-detail', code] as const,
};

/** GET tours/:id/availability?month=YYYY-MM */
export function useTourAvailabilityQuery(
  tourId: string | undefined,
  month: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: tourBookingKeys.availability(tourId ?? '', month),
    queryFn: () => getTourAvailability(tourId!, month),
    enabled: !!tourId && !!month && (options?.enabled ?? true),
    staleTime: 2 * 60 * 1000,
  });
}

/** POST tour-bookings */
export function useCreateTourBookingMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTourBookingPayload) => createTourBooking(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tourBookingKeys.all });
    },
  });
}

/** GET tour-bookings/by-code/:code (public lookup) */
export function useTourBookingByCodeQuery(
  code: string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: tourBookingKeys.byCode(code ?? ''),
    queryFn: () => getTourBookingByCode(code!),
    enabled: !!code && (options?.enabled ?? true),
    retry: false,
  });
}

/** GET tour-bookings/my-bookings (Bearer) */
export function useMyTourBookingsQuery(params: {
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: tourBookingKeys.myList(params),
    queryFn: () => getMyTourBookings(params),
    staleTime: 1 * 60 * 1000,
  });
}

/** GET tour-bookings/my-bookings/:code (Bearer) */
export function useMyTourBookingByCodeQuery(
  code: string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: tourBookingKeys.myDetail(code ?? ''),
    queryFn: () => getMyTourBookingByCode(code!),
    enabled: !!code && (options?.enabled ?? true),
  });
}

/** GET tour-bookings/:id */
export function useTourBookingByIdQuery(
  id: string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: tourBookingKeys.byId(id ?? ''),
    queryFn: () => getTourBookingById(id!),
    enabled: !!id && (options?.enabled ?? true),
  });
}

/** PATCH tour-bookings/:id/cancel – 3.8 (User hủy đơn) */
export function useCancelTourBookingMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body?: CancelTourBookingBody;
    }) => cancelTourBooking(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tourBookingKeys.all });
    },
  });
}

/** POST tour-bookings/:id/receipt – 3.10.1 Upload ảnh chuyển khoản */
export function useUploadTourBookingReceiptMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      uploadTourBookingReceipt(id, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tourBookingKeys.all });
    },
  });
}
