import api from '@/lib/axios';
import type { Room, RoomListResponse, RoomQueryParams } from './types';

export function getRooms(params: RoomQueryParams) {
  return api.get<RoomListResponse>('/api/v1/rooms', {
    params,
  });
}

export function getRoomById(id: string) {
  return api.get<Room>(`/api/v1/rooms/${id}`);
}

/* export function createRoom(formData: FormData) {
  return api.post('/api/v1/rooms', formData);
}

export function updateRoom(id: string, formData: FormData) {
  return api.patch(`/api/v1/rooms/${id}`, formData);
}

export function deleteRoom(id: string) {
  return api.delete(`/api/v1/rooms/${id}`);
} */
