import api from '@/lib/axios';

const CLIENT_PAYMENTS_BASE = '/api/v1/client/payments';

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

export function generateIdempotencyKey(bookingId: string): string {
  return `payment-intent-${bookingId}-${Date.now()}`;
}
export async function createPaymentIntent(
  bookingId: string,
  idempotencyKey: string,
): Promise<CreatePaymentIntentResponse> {
  return api.post<CreatePaymentIntentResponse>(
    `${CLIENT_PAYMENTS_BASE}/create-intent`,
    {
      bookingId,
    },
    {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    },
  );
}
export async function getPaymentStatus(
  bookingId: string,
): Promise<PaymentStatusResponse> {
  return api.get<PaymentStatusResponse>(
    `${CLIENT_PAYMENTS_BASE}/status/${bookingId}`,
  );
}

export interface CreateTourPaymentIntentDto {
  tourBookingId: string;
}
export async function createTourPaymentIntent(
  tourBookingId: string,
  idempotencyKey: string,
): Promise<CreatePaymentIntentResponse> {
  return api.post<CreatePaymentIntentResponse>(
    `${CLIENT_PAYMENTS_BASE}/create-intent/tour`,
    { tourBookingId },
    {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    },
  );
}
export async function getTourPaymentStatus(
  tourBookingId: string,
): Promise<PaymentStatusResponse> {
  return api.get<PaymentStatusResponse>(
    `${CLIENT_PAYMENTS_BASE}/status/tour/${tourBookingId}`,
  );
}

export function generateTourIdempotencyKey(tourBookingId: string): string {
  return `tour-payment-${tourBookingId}-${Date.now()}`;
}

