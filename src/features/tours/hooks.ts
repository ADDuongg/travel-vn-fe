import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cancelTourBooking,
  createTourBooking,
  createBooking,
  deleteBooking,
  getFeaturedTours,
  getBookings,
  getMyTourBookingByCode,
  getMyTourBookings,
  getTourAvailability,
  getTourBookingByCode,
  getTourBookingById,
  getTourById,
  getTours,
  type GetBookingsParams,
  uploadTourBookingReceipt,
} from './api';
import type {
  CancelTourBookingBody,
  CreateTourBookingPayload,
  TourBookingRow,
  TourQueryParams,
} from './types';
import * as I from '@/types/api';
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

export const tourCatalogKeys = {
  all: ['tours'] as const,
  list: (params?: TourQueryParams) =>
    [...tourCatalogKeys.all, 'list', params] as const,
  detail: (id: string) => [...tourCatalogKeys.all, 'detail', id] as const,
  featured: (limit?: number) =>
    [...tourCatalogKeys.all, 'featured', limit] as const,
};

export function useToursQuery(params?: TourQueryParams) {
  return useQuery({
    queryKey: tourCatalogKeys.list(params),
    queryFn: () => getTours(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useTourQuery(id: string | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: tourCatalogKeys.detail(id ?? ''),
    queryFn: () => getTourById(id!),
    enabled: !!id && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedToursQuery(limit = 6) {
  return useQuery({
    queryKey: tourCatalogKeys.featured(limit),
    queryFn: () => getFeaturedTours(limit),
    staleTime: 5 * 60 * 1000,
  });
}

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

export function useCreateTourBookingMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTourBookingPayload) => createTourBooking(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tourBookingKeys.all });
    },
  });
}

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

export function useMyTourBookingsQuery(params: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: tourBookingKeys.myList(params),
    queryFn: () => getMyTourBookings(params),
    staleTime: 1 * 60 * 1000,
  });
}

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
