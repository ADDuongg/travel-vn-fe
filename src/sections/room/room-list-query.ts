import type { RoomQueryParams } from '@/features/rooms/types';

export type RoomListQuery = {
  search: string;
  provinceId: string;
  minPrice: string;
  maxPrice: string;
  minRating: 0 | 3 | 4 | 5;
  sortBy: NonNullable<RoomQueryParams['sortBy']>;
  adults: number;
  children: number;
  checkIn: string;
  checkOut: string;
  amenities: string[];
  roomSize: number[];
};

export const defaultRoomListQuery: RoomListQuery = {
  search: '',
  provinceId: '',
  minPrice: '',
  maxPrice: '',
  minRating: 0,
  sortBy: 'newest',
  adults: 1,
  children: 0,
  checkIn: '',
  checkOut: '',
  amenities: [],
  roomSize: [],
};

