export type HotelListQuery = {
  search: string;

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

