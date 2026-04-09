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
