import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import { getMyFavoritesList, getMyIsFavorited, toggleFavorite } from './api';
import { favoritesKeys } from './query-keys';
import type { FavoriteEntityType, MyFavoritesListParams } from './types';

function invalidateMyFavoritesList(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: [...favoritesKeys.all, 'meList'] });
}

export function useMyFavoritesListQuery(
  params: MyFavoritesListParams,
  options?: { enabled?: boolean },
) {
  const authUser = useAuthStore((s) => s.authUser);

  return useQuery({
    queryKey: favoritesKeys.meList(params),
    queryFn: () => getMyFavoritesList(params),
    enabled: options?.enabled !== false && !!authUser,
    staleTime: 60 * 1000,
  });
}

export function useMyIsFavoritedQuery(
  params: { entityType: FavoriteEntityType; entityId: string },
  options?: { enabled?: boolean },
) {
  const authUser = useAuthStore((s) => s.authUser);

  return useQuery({
    queryKey: favoritesKeys.isFavorited(params),
    queryFn: () => getMyIsFavorited(params),
    enabled: options?.enabled !== false && !!authUser && !!params.entityId,
    staleTime: 30 * 1000,
  });
}

export function useToggleFavoriteMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: () => {
      invalidateMyFavoritesList(qc);
      qc.invalidateQueries({ queryKey: [...favoritesKeys.all, 'isFavorited'] });
    },
  });
}

