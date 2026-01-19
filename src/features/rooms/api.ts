import api from '@/lib/axios';
import type {
  Room,
  RoomListResponse,
  RoomQueryParams,
  RoomBookingPayload,
} from './types';
import { diffInNights } from '@utils/index';

export function getRooms(params: RoomQueryParams) {
  return api.get<RoomListResponse>('/api/v1/rooms', {
    params,
  });
}

export function getRoomById(id: string) {
  return api.get<Room>(`/api/v1/rooms/${id}`);
}

export function createRoomBooking(room: Room, payload: RoomBookingPayload) {
  const checkIn = new Date(payload.checkIn);
  const checkOut = new Date(payload.checkOut);

  const nights = diffInNights(checkIn, checkOut);

  if (nights <= 0) {
    throw new Error('Invalid check-in / check-out date');
  }

  const { bookingConfig, inventory } = room;

  if (nights < bookingConfig.minNights) {
    throw new Error(`Minimum stay is ${bookingConfig.minNights} nights`);
  }

  if (bookingConfig.maxNights && nights > bookingConfig.maxNights) {
    throw new Error(`Maximum stay is ${bookingConfig.maxNights} nights`);
  }

  const quantity = payload.rooms.length;

  if (quantity > inventory.totalRooms) {
    throw new Error(`Only ${inventory.totalRooms} rooms available`);
  }

  return api.post('/api/v1/bookings/room', payload);
}

export const getTotalRoomByDate = (
  roomId: string,
  from: string,
  to: string,
) => {
  const params = {
    from,
    to,
  };
  return api.get<{ maxRoomsCanBook: number }>(
    `/api/v1/room-inventories/${roomId}/availability`,
    {
      params,
    },
  );
};
