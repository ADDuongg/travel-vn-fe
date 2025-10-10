export type BookingStatus =
  | 'all'
  | 'pending'
  | 'approved'
  | 'receipt_submitted'
  | 'online_paid'
  | 'deposit_paid'
  | 'departed'
  | 'rejected'
  | 'wait_for_approval';

export type PaymentStatus = 'pending' | 'paid' | 'refunded';
