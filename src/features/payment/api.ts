import api from '@/lib/axios';

/** User JWT routes under global prefix — see MODULES-12-15-FE-API.md */
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

/**
 * Generate idempotency key for payment intent creation
 */
export function generateIdempotencyKey(bookingId: string): string {
  return `payment-intent-${bookingId}-${Date.now()}`;
}

/**
 * Create Stripe payment intent (room booking)
 * POST /api/v1/client/payments/create-intent
 */
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

/**
 * Get payment status by booking ID (room)
 * GET /api/v1/client/payments/status/:bookingId
 */
export async function getPaymentStatus(
  bookingId: string,
): Promise<PaymentStatusResponse> {
  return api.get<PaymentStatusResponse>(
    `${CLIENT_PAYMENTS_BASE}/status/${bookingId}`,
  );
}

// --- Tour payment (Phase 2) ---

export interface CreateTourPaymentIntentDto {
  tourBookingId: string;
}

/**
 * Create Stripe payment intent for tour booking
 * POST /api/v1/client/payments/create-intent/tour
 */
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

/**
 * Get payment status for tour booking
 * GET /api/v1/client/payments/status/tour/:tourBookingId
 */
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
