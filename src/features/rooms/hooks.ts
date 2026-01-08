// features/review/hooks.ts

import { useQuery } from '@tanstack/react-query';
import { getRooms, getRoomById } from './api';
import type { Room, RoomListResponse, RoomQueryParams } from './types';
export const roomKeys = {
  all: ['rooms'] as const,
  list: (params: RoomQueryParams) => [...roomKeys.all, params] as const,
  detail: (id: string) => [...roomKeys.all, 'detail', id] as const,
};

export function useRoomsQuery(params: RoomQueryParams) {
  return useQuery<RoomListResponse>({
    queryKey: roomKeys.list(params),
    queryFn: () => getRooms(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRoomDetailQuery(id?: string) {
  return useQuery<Room>({
    queryKey: id ? roomKeys.detail(id) : [],
    queryFn: () => getRoomById(id!),
    enabled: !!id,
  });
}
