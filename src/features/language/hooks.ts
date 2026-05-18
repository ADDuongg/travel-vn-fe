import { useQuery } from '@tanstack/react-query';
import { getLanguages } from './api';

export function useGetLanguagesQuery() {
  return useQuery({
    queryKey: ['languages'],
    queryFn: () => getLanguages(),
    staleTime: 5 * 60 * 1000,
  });
}

