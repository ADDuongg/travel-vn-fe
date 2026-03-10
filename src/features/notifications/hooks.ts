import { useAuthStore } from '@/stores/useAuthStore';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from './api';
import type { NotificationListParams, PaginatedNotifications } from './types';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (params?: NotificationListParams) =>
    [...notificationKeys.all, 'list', params] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  infiniteList: () => [...notificationKeys.all, 'infinite-list'] as const,
};

export function useUnreadNotificationCount(enabled = true) {
  const isAuthenticated = !!useAuthStore.getState().authUser;

  return useQuery<{ count: number }>({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadCount,
    enabled: enabled && isAuthenticated,
    refetchInterval: enabled && isAuthenticated ? 30_000 : false,
  });
}

export function useNotificationsList(
  params?: NotificationListParams,
  enabled = true,
) {
  const isAuthenticated = !!useAuthStore.getState().authUser;

  return useQuery<PaginatedNotifications>({
    queryKey: notificationKeys.list(params),
    queryFn: () => getNotifications(params),
    enabled: enabled && isAuthenticated,
    staleTime: 30_000,
  });
}

export function useInfiniteNotificationsList(limit = 5, enabled = true) {
  const isAuthenticated = !!useAuthStore.getState().authUser;

  return useInfiniteQuery<PaginatedNotifications>({
    queryKey: notificationKeys.infiniteList(),
    enabled: enabled && isAuthenticated,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getNotifications({
        page: pageParam as number,
        limit,
      }),
    getNextPageParam: (lastPage) => {
      const { page, limit: pageSize, total } = lastPage;
      const loaded = page * pageSize;
      if (loaded >= total) return undefined;
      return page + 1;
    },
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

