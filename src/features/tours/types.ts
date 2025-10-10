import type { BookingStatus, PaymentStatus } from '../shared/types';

export type TourBookingRow = {
  id: string;
  tourName: string;
  tourUrl?: string;
  travelDate: string;
  total: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
};
