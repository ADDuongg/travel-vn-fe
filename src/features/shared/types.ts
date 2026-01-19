export type BookingType = 'ROOM' | 'TOUR';

export type BookingStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'all';

export enum BookingPaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  EXPIRED = 'EXPIRED',
}

export interface BookedRoom {
  roomId: string;
  roomName: string;
  roomSlug?: string;

  checkIn: string;
  checkOut: string;

  adults: number;
  children: number;
}
export type BookingRow = {
  id: string;
  tourName: string;
  tourUrl?: string;
  travelDate: string;
  total: number;
  status: BookingStatus;
  paymentStatus: 'pending' | 'paid' | 'refunded';
};
export interface TourInfo {
  tourId: string;
  title: string;
  slug?: string;
  startDate: string;
  endDate?: string;
}

export interface BookedRoom {
  room: {
    _id: string;
    name: string;
    slug: string;
    thumbnail?: string;
    roomSize?: number;
    maxGuests?: number;
  };
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
  };
}

export interface Booking {
  _id: string;
  bookingType: 'ROOM' | 'TOUR';

  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;

  amount: number;
  currency: string;

  rooms: BookedRoom[];

  createdAt: string;
  updatedAt: string;
}
