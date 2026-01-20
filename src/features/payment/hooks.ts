import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createPaymentIntent,
  generateIdempotencyKey,
  getPaymentStatus,
  type CreatePaymentIntentResponse,
  type PaymentStatusResponse,
} from './api';

const paymentKeys = {
  all: ['payments'] as const,
  status: (bookingId: string) => [...paymentKeys.all, 'status', bookingId] as const,
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
      // Refetch every 5 seconds if payment is pending
      const data = query.state.data;
      if (data?.status === 'PENDING') {
        return 5000;
      }
      return false;
    },
  });
}
