import { useQuery } from '@tanstack/react-query';
import { getProvinces } from './api';
import type { Province } from './types';

export const provinceKeys = {
  all: ['provinces'] as const,
  list: () => [...provinceKeys.all, 'list'] as const,
};

export function useProvincesQuery() {
  return useQuery<Province[]>({
    queryKey: provinceKeys.list(),
    queryFn: getProvinces,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
