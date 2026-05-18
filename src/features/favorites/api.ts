import api from '@/lib/axios';
import type * as I from '@/types/api';
import type {
  FavoriteEntityType,
  FavoriteRecord,
  MyFavoritesListParams,
  MyFavoritesListPayload,
} from './types';

export async function toggleFavorite(payload: {
  entityType: FavoriteEntityType;
  entityId: string;
}): Promise<{ isFavorited: boolean }> {
  return api.post('/api/v1/client/favorites/toggle', payload);
}

export async function getMyFavoritesList(
  params: MyFavoritesListParams,
): Promise<I.ApiListResponse<FavoriteRecord>> {
  const payload = await api.get<MyFavoritesListPayload>(
    '/api/v1/client/favorites/me/list',
    { params },
  );

  const pagination = payload.pagination ?? {
    page: 1,
    limit: payload.data?.length || 20,
    total: payload.data?.length || 0,
  };

  const pageSize = Math.max(1, pagination.limit);
  const pageIndex = Math.max(0, pagination.page - 1);
  const total = pagination.total;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return {
    data: payload.data ?? [],
    meta: {
      pageIndex,
      pageSize,
      total,
      pageCount,
    },
  };
}

export async function getMyIsFavorited(params: {
  entityType: FavoriteEntityType;
  entityId: string;
}): Promise<{ isFavorited: boolean }> {
  return api.get('/api/v1/client/favorites/me/is-favorited', { params });
}

