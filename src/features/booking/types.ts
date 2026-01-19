import type { Booking } from '../shared/types';

export interface BookingListResponse {
  items: Booking[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
}
