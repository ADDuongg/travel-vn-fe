/**
 * Tour Booking Phase 2 – types (FE Client only)
 * docs/FE-API-TOUR-PHASE2.md
 */

/** Availability item per date (GET tours/:id/availability?month=YYYY-MM) */
export interface TourAvailabilityItem {
  departureDate: string; // YYYY-MM-DD
  availableSlots: number;
  totalSlots: number;
  status: 'AVAILABLE' | 'LIMITED' | 'FULL' | 'CANCELLED';
  specialPrice: number | null;
  currency: string;
}

/** Guest info for creating a booking */
export interface TourBookingGuest {
  fullName: string;
  email: string;
  phone?: string;
  note?: string;
}

/** Payload for POST /api/v1/tour-bookings */
export interface CreateTourBookingPayload {
  tourId: string;
  departureDate: string; // YYYY-MM-DD
  guest: TourBookingGuest;
  adults: number;
  children?: number;
  infants?: number;
  userId?: string;
}

/** Booking status per Phase 2 */
export type TourBookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PAID'
  | 'CANCELLED'
  | 'COMPLETED';

/** Payment status (Stripe / bank verify / admin) – FE-API-TOUR-PHASE2 */
export type TourPaymentStatus =
  | 'UNPAID'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'EXPIRED';

/** Populated refs in booking detail (minimal shape) */
export interface TourBookingTourRef {
  _id: string;
  code: string;
  slug: string;
  translations?: Record<string, { name?: string }>;
  duration?: { days: number; nights: number };
  pricing?: { basePrice: number; currency: string };
  thumbnail?: { url: string; publicId?: string; alt?: string };
}

/** Tour booking detail (POST response, GET by-code/:code, GET :id) */
export interface TourBookingDetail {
  _id: string;
  bookingCode: string;
  tourId: string | TourBookingTourRef;
  tourInventoryId?: { _id: string; departureDate: string };
  guest: TourBookingGuest;
  adults: number;
  children: number;
  infants: number;
  departureDate: string;
  totalAmount: number;
  currency: string;
  depositAmount: number;
  paidAmount: number;
  status: TourBookingStatus;
  paymentStatus?: TourPaymentStatus;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancelReason?: string;
  paidAt?: string;
  /** Bank receipt (ảnh chuyển khoản) – 3.10 FE-API-TOUR-PHASE2 */
  bankReceipt?: {
    url: string;
    uploadedAt?: string;
    verified?: boolean;
  };
}

/** Item in GET my-bookings list */
export interface TourBookingListItem {
  _id: string;
  bookingCode: string;
  tourId: string | TourBookingTourRef;
  departureDate: string;
  totalAmount: number;
  status: TourBookingStatus;
  paymentStatus?: TourPaymentStatus;
  createdAt: string;
}

/** Response of GET tour-bookings/my-bookings */
export interface TourBookingListResponse {
  items: TourBookingListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** PATCH cancel body (optional) – 3.8 (User hủy đơn) */
export interface CancelTourBookingBody {
  reason?: string;
}
