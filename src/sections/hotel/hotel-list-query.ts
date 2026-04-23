/** Shared list state for hotel discovery (list page + filter bar). */
export type HotelListQuery = {
  search: string;
  /** Empty = all provinces */
  provinceId: string;
  minStars: 0 | 3 | 4 | 5;
  sortBy: 'newest' | 'name' | 'rating';
};

export const defaultHotelListQuery: HotelListQuery = {
  search: '',
  provinceId: '',
  minStars: 0,
  sortBy: 'newest',
};
