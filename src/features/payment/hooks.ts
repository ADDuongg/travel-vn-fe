import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createPaymentIntent,
  generateIdempotencyKey,
  getPaymentStatus,
  createTourPaymentIntent,
  getTourPaymentStatus,
  generateTourIdempotencyKey,
  type CreatePaymentIntentResponse,
  type PaymentStatusResponse,
} from './api';

const paymentKeys = {
  all: ['payments'] as const,
  status: (bookingId: string) => [...paymentKeys.all, 'status', bookingId] as const,
  tourStatus: (tourBookingId: string) =>
    [...paymentKeys.all, 'tour-status', tourBookingId] as const,
};

export function useCreatePaymentIntent() {
  return useMutation<
    CreatePaymentIntentResponse,
    Error,
    { bookingId: string }
  >({
    mutationFn: ({ bookingId }) => {
      const idempotencyKey = generateIdempotencyKey(bookingId);
      return createPaymentIntent(bookingId, idempotencyKey);
    },
  });
}

export function usePaymentStatus(bookingId: string | undefined) {
  return useQuery<PaymentStatusResponse>({
    queryKey: bookingId ? paymentKeys.status(bookingId) : [],
    queryFn: () => getPaymentStatus(bookingId!),
    enabled: !!bookingId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'PENDING') {
        return 5000;
      }
      return false;
    },
  });
}

/** Tour: create Stripe payment intent for tour booking */
export function useCreateTourPaymentIntent() {
  return useMutation<
    CreatePaymentIntentResponse,
    Error,
    { tourBookingId: string }
  >({
    mutationFn: ({ tourBookingId }) => {
      const idempotencyKey = generateTourIdempotencyKey(tourBookingId);
      return createTourPaymentIntent(tourBookingId, idempotencyKey);
    },
  });
}

/** Tour: get payment status by tour booking ID */
export function useTourPaymentStatus(tourBookingId: string | undefined) {
  return useQuery<PaymentStatusResponse>({
    queryKey: tourBookingId ? paymentKeys.tourStatus(tourBookingId) : [],
    queryFn: () => getTourPaymentStatus(tourBookingId!),
    enabled: !!tourBookingId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'PENDING') {
        return 5000;
      }
      return false;
    },
  });
}
