import type { FavoriteEntityType, MyFavoritesListParams } from './types';

export const favoritesKeys = {
  all: ['favorites'] as const,
  meList: (params: MyFavoritesListParams) =>
    [...favoritesKeys.all, 'meList', params] as const,
  isFavorited: (params: { entityType: FavoriteEntityType; entityId: string }) =>
    [...favoritesKeys.all, 'isFavorited', params] as const,
} as const;

