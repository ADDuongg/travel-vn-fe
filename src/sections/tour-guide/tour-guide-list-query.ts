export type TourGuideListQuery = {
  search: string;
  provinceId: string;
  language: string;
  isVerified: 'all' | 'true' | 'false';
  sortBy: 'newest' | 'rating' | 'experience';
};

export const defaultTourGuideListQuery: TourGuideListQuery = {
  search: '',
  provinceId: '',
  language: '',
  isVerified: 'all',
  sortBy: 'newest',
};
