import type { BookingPaymentStatus, BookingStatus } from '../shared/types';

export type TourBookingRow = {
  id: string;
  tourName: string;
  tourUrl?: string;
  travelDate: string;
  total: number;
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
};

/** Province ref (populated) */
export interface ProvinceRef {
  _id: string;
  name: { vi: string; en: string };
  code: string;
  slug: string;
  fullName?: { vi: string; en: string };
}

export type TourType = 'DOMESTIC' | 'INTERNATIONAL' | 'DAILY';
export type Difficulty = 'EASY' | 'MODERATE' | 'CHALLENGING' | 'DIFFICULT';
export type TourSortBy =
  | 'price_asc'
  | 'price_desc'
  | 'duration_asc'
  | 'duration_desc'
  | 'rating'
  | 'newest';

export interface TourTranslation {
  name: string;
  description?: string;
  shortDescription?: string;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  notes?: string[];
  cancellationPolicy?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface TourDestination {
  provinceId: string | ProvinceRef;
  isMainDestination: boolean;
}

export interface TourItineraryDay {
  dayNumber: number;
  translations: Record<
    string,
    {
      title: string;
      description: string;
      meals?: string[];
      accommodation?: string;
    }
  >;
}

export interface TourPricing {
  basePrice: number;
  currency: string;
  childPrice?: number;
  infantPrice?: number;
  singleSupplement?: number;
}

export interface TourSale {
  isActive: boolean;
  type: 'PERCENT' | 'FIXED';
  value: number;
  startDate?: string;
  endDate?: string;
}

export interface TourSchedule {
  departureDays?: string[];
  fixedDepartures?: Array<{
    date: string;
    availableSlots: number;
    status: string;
  }>;
}

/** Tour - list item (summary) */
export interface TourListItem {
  _id: string;
  slug: string;
  code: string;
  /** Returned when request includes Authorization (Favorites module). */
  isFavorited?: boolean;
  tourType: TourType;
  duration: { days: number; nights: number };
  destinations: TourDestination[];
  departureProvinceId: string | ProvinceRef;
  translations: Record<string, TourTranslation>;
  capacity: { minGuests: number; maxGuests: number; privateAvailable: boolean };
  pricing: TourPricing;
  difficulty?: Difficulty;
  transportTypes: string[];
  thumbnail?: { url: string; publicId?: string; alt?: string };
  ratingSummary?: { average: number; total: number };
  bookingConfig?: {
    advanceBookingDays: number;
    allowInstantBooking: boolean;
    requireDeposit: boolean;
    depositPercent: number;
  };
  sale?: TourSale;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Tour - full detail */
export interface Tour extends TourListItem {
  itinerary: TourItineraryDay[];
  contact?: { phone?: string; email?: string; hotline?: string };
  gallery?: Array<{
    url: string;
    publicId?: string;
    alt?: string;
    order?: number;
  }>;
  amenities?: Array<{ _id: string; name?: Record<string, string>; icon?: string }>;
  schedule?: TourSchedule;
}

export interface TourPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TourPaginatedResponse {
  items: TourListItem[];
  pagination: TourPagination;
}

export interface TourQueryParams {
  page?: number;
  limit?: number;
  destinationId?: string;
  departureProvinceId?: string;
  tourType?: TourType;
  minDays?: number;
  maxDays?: number;
  minPrice?: number;
  maxPrice?: number;
  difficulty?: Difficulty;
  sortBy?: TourSortBy;
  search?: string;
  transportTypes?: string;
}

/** Availability item per date (GET tours/:id/availability?month=YYYY-MM) */
export interface TourAvailabilityItem {
  departureDate: string;
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

/** Payload for POST /api/v1/client/tour-bookings */
export interface CreateTourBookingPayload {
  tourId: string;
  departureDate: string;
  guest: TourBookingGuest;
  adults: number;
  children?: number;
  infants?: number;
  userId?: string;
}

export type TourBookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PAID'
  | 'CANCELLED'
  | 'COMPLETED';

export type TourPaymentStatus =
  | 'UNPAID'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'EXPIRED';

export interface TourBookingTourRef {
  _id: string;
  code: string;
  slug: string;
  translations?: Record<string, { name?: string }>;
  duration?: { days: number; nights: number };
  pricing?: { basePrice: number; currency: string };
  thumbnail?: { url: string; publicId?: string; alt?: string };
}

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
  bankReceipt?: {
    url: string;
    uploadedAt?: string;
    verified?: boolean;
  };
}

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

export interface TourBookingListResponse {
  items: TourBookingListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CancelTourBookingBody {
  reason?: string;
}
