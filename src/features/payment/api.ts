import api from '@/lib/axios';

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentId: string;
}

export interface PaymentStatusResponse {
  exists: boolean;
  status:
    | 'PENDING'
    | 'SUCCEEDED'
    | 'FAILED'
    | 'REFUNDED'
    | 'FULLY_REFUNDED'
    | 'EXPIRED'
    | 'CANCELLED'
    | null;
  amount: number | null;
  currency: string | null;
  refundedAmount: number | null;
  createdAt: string | null;
}

export interface CreatePaymentIntentDto {
  bookingId: string;
}

/**
 * Generate idempotency key for payment intent creation
 */
export function generateIdempotencyKey(bookingId: string): string {
  return `payment-intent-${bookingId}-${Date.now()}`;
}

/**
 * Create Stripe payment intent
 * @param bookingId - Booking ID
 * @param idempotencyKey - Unique idempotency key
 */
export async function createPaymentIntent(
  bookingId: string,
  idempotencyKey: string,
): Promise<CreatePaymentIntentResponse> {
  // Note: Backend payment controller uses @Controller('payments')
  // If backend has /api/v1 prefix, update route accordingly
  return api.post<CreatePaymentIntentResponse>('/payments/create-intent', {
    bookingId,
  }, {
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });
}

/**
 * Get payment status by booking ID
 */
export async function getPaymentStatus(
  bookingId: string,
): Promise<PaymentStatusResponse> {
  return api.get<PaymentStatusResponse>(`/payments/status/${bookingId}`);
}
