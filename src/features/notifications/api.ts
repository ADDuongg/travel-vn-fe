import api from '@/lib/axios';
import type {
  NotificationListParams,
  PaginatedNotifications,
  NotificationItem,
} from './types';

const BASE = '/api/v1/notifications';

export function getUnreadCount(): Promise<{ count: number }> {
  return api.get<{ count: number }>(`${BASE}/unread-count`);
}

export function getNotifications(
  params?: NotificationListParams,
): Promise<PaginatedNotifications> {
  return api.get<PaginatedNotifications>(BASE, {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
      isRead: params?.isRead,
      type: params?.type,
    },
  });
}

export function markNotificationAsRead(id: string): Promise<NotificationItem> {
  return api.patch<NotificationItem>(`${BASE}/${id}/read`);
}

export function markAllNotificationsAsRead(): Promise<{ modifiedCount: number }> {
  return api.patch<{ modifiedCount: number }>(`${BASE}/read-all`);
}

