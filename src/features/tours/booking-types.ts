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

/** Populated refs in booking detail (minimal shape) */
export interface TourBookingTourRef {
  _id: string;
  code: string;
  slug: string;
  translations?: Record<string, { name?: string }>;
  duration?: { days: number; nights: number };
  pricing?: { basePrice: number; currency: string };
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
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancelReason?: string;
  paidAt?: string;
}

/** Item in GET my-bookings list */
export interface TourBookingListItem {
  _id: string;
  bookingCode: string;
  tourId: string | TourBookingTourRef;
  departureDate: string;
  totalAmount: number;
  status: TourBookingStatus;
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
