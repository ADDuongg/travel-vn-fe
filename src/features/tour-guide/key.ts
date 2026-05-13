import type { TourGuideQueryParams } from './types';

export const tourGuideKeys = {
  all: ['tour-guides'] as const,
  myProfile: () => [...tourGuideKeys.all, 'my-profile'] as const,
  lists: () => [...tourGuideKeys.all, 'list'] as const,
  list: (params?: TourGuideQueryParams) =>
    [...tourGuideKeys.all, 'list', params] as const,
  details: () => [...tourGuideKeys.all, 'detail'] as const,
  detail: (id: string) => [...tourGuideKeys.all, 'detail', id] as const,
  reviews: (guideId: string, page?: number) =>
    [...tourGuideKeys.all, 'detail', guideId, 'reviews', page] as const,
};
