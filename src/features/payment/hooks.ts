import { useNotifyMutation } from '@/lib/mutation';
import { useQuery } from '@tanstack/react-query';
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
  return useNotifyMutation<
    CreatePaymentIntentResponse,
    Error,
    { bookingId: string }
  >({
    mutationFn: ({ bookingId }) => {
      const idempotencyKey = generateIdempotencyKey(bookingId);
      return createPaymentIntent(bookingId, idempotencyKey);
    },
    errorKey: 'notifications.payment.intent_error',
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

export function useCreateTourPaymentIntent() {
  return useNotifyMutation<
    CreatePaymentIntentResponse,
    Error,
    { tourBookingId: string }
  >({
    mutationFn: ({ tourBookingId }) => {
      const idempotencyKey = generateTourIdempotencyKey(tourBookingId);
      return createTourPaymentIntent(tourBookingId, idempotencyKey);
    },
    errorKey: 'notifications.payment.intent_error',
  });
}

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

