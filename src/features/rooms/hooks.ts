// features/review/hooks.ts

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getRooms,
  getRoomById,
  createRoomBooking,
  getTotalRoomByDate,
} from './api';
import type {
  Room,
  RoomBookingPayload,
  RoomListResponse,
  RoomQueryParams,
} from './types';
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
    queryKey: roomKeys.detail(id ?? ''),
    queryFn: () => getRoomById(id!),
    enabled: !!id,
  });
}

export function useCreateRoomBooking() {
  return useMutation({
    mutationFn: ({
      room,
      payload,
    }: {
      room: Room;
      payload: RoomBookingPayload;
    }) => createRoomBooking(room, payload),
  });
}

export function useGetTotalRoomByDate(id?: string, from?: string, to?: string) {
  return useQuery<{ maxRoomsCanBook: number }>({
    queryKey: ['room-availability', id, from, to],
    queryFn: () => getTotalRoomByDate(id!, from!, to!),
    staleTime: 5 * 60 * 1000,
    enabled: !!id && !!from && !!to,
  });
}
