import { useQuery } from '@tanstack/react-query';
import { getAmenities } from './api';
import type { Amenity } from './types';

export const amenityKeys = {
  all: ['amenities'] as const,
  list: () => [...amenityKeys.all, 'list'] as const,
};

export function useAmenitiesQuery() {
  return useQuery<Amenity[]>({
    queryKey: amenityKeys.list(),
    queryFn: getAmenities,
    staleTime: 10 * 60 * 1000,
  });
}

