import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FaDoorOpen, FaUserFriends } from 'react-icons/fa';
import { BsLightningFill } from 'react-icons/bs';
import React, { useEffect, useMemo, useState } from 'react';
import CustomInput from '@/components/CustomInput';
import { Select, SelectTrigger, SelectContent } from '@components/ui/select';
import type { Room } from '@/features/rooms/types';
import {
  useCreateRoomBooking,
  useGetTotalRoomByDate,
} from '@/features/rooms/hooks';
import { useAuthStore } from '@/stores/useAuthStore';
import { toDateOnly } from '@utils/index';

type RoomBookingValues = {
  checkIn: string;
  checkOut: string;
  room: any;
};

type Guest = {
  adults: number;
  children: number;
};

const RoomBookingForm = ({ room }: { room: Room }) => {
  const methods = useForm<RoomBookingValues>({
    defaultValues: {
      checkIn: '',
      checkOut: '',
      room: '1',
    },
  });

  const { handleSubmit, watch } = methods;

  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');

  const roomQuantity = Number(watch('room') || 1);
  const { mutateAsync: createRoomBooking, isPending } = useCreateRoomBooking();
  const currentUserId = useAuthStore((s) => s.authUser?._id);
  const { data: totalRoomByDate } = useGetTotalRoomByDate(
    room?._id,
    toDateOnly(checkIn),
    toDateOnly(checkOut),
  );

  const maxRoomsCanBook = useMemo(() => {
    return totalRoomByDate?.maxRoomsCanBook ?? room?.inventory?.totalRooms ?? 1;
  }, [watch('checkIn'), watch('checkOut'), totalRoomByDate]);

  console.log('totalRoomByDate', totalRoomByDate);
  console.log('checkIn', watch('checkIn'));
  console.log('checkOut', watch('checkOut'));

  const [guestsByRoom, setGuestsByRoom] = useState<Guest[]>([
    { adults: 1, children: 0 },
  ]);

  useEffect(() => {
    setGuestsByRoom((prev) => {
      const next = [...prev];

      if (roomQuantity > next.length) {
        for (let i = next.length; i < roomQuantity; i++) {
          next.push({ adults: 1, children: 0 });
        }
      } else if (roomQuantity < next.length) {
        next.length = roomQuantity;
      }

      return next;
    });
  }, [roomQuantity]);

  const updateGuests = (
    roomIndex: number,
    key: 'adults' | 'children',
    value: number,
  ) => {
    setGuestsByRoom((prev) => {
      const next = [...prev];
      next[roomIndex] = {
        ...next[roomIndex],
        [key]: value,
      };
      return next;
    });
  };

  const onSubmit = async (data: RoomBookingValues) => {
    try {
      await createRoomBooking({
        room,
        payload: {
          roomId: room._id,
          checkIn: data.checkIn as string,
          checkOut: data.checkOut as string,
          userId: currentUserId,
          rooms: guestsByRoom,
        },
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const IconWithLine = ({ icon }: { icon: React.ReactNode }) => (
    <div className="relative flex justify-center text-blue-500">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[10px] bg-gray-300" />
      <div className="relative z-10 bg-white">{icon}</div>
    </div>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Check In */}
        <div className="grid grid-cols-[32px_1fr] gap-3 items-center">
          <IconWithLine icon={<AiOutlineCalendar size={22} />} />
          <CustomInput
            name="checkIn"
            type="date"
            className="w-full"
            size="lg"
            label="Check In"
            rules={{ required: 'Please select check-in date' }}
          />
        </div>

        {/* Check Out */}
        <div className="grid grid-cols-[32px_1fr] gap-3 items-center">
          <IconWithLine icon={<AiOutlineCalendar size={22} />} />
          <CustomInput
            name="checkOut"
            type="date"
            className="w-full"
            size="lg"
            label="Check Out"
            rules={{ required: 'Please select check-out date' }}
          />
        </div>

        {/* Room quantity */}
        <div className="grid grid-cols-[32px_1fr] gap-3 items-center">
          <IconWithLine icon={<FaDoorOpen size={20} />} />
          <CustomInput
            name="room"
            type="select"
            className="w-full"
            size="lg"
            label="Room"
            options={Array.from({ length: maxRoomsCanBook }, (_, i) => ({
              label: `${i + 1}`,
              value: `${i + 1}`,
            }))}
            rules={{ required: 'Please select room number' }}
          />
        </div>

        {/* Guests per room */}
        {guestsByRoom.map((guest, index) => (
          <div
            key={index}
            className="grid grid-cols-[32px_1fr] gap-3 items-start"
          >
            <IconWithLine icon={<FaUserFriends size={20} />} />

            <Select>
              <SelectTrigger
                size="lg"
                label={`Guests - Room ${index + 1}`}
                required
                className="w-full border rounded-md px-3 py-2 text-sm text-left"
              >
                <span className="text-sm font-medium">
                  Adult {guest.adults} - Children {guest.children}
                </span>
              </SelectTrigger>

              <SelectContent className="!p-0 w-[--radix-select-trigger-width]">
                <div className="p-4 space-y-4">
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Adults</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateGuests(
                            index,
                            'adults',
                            Math.max(1, guest.adults - 1),
                          )
                        }
                      >
                        −
                      </Button>
                      <span className="w-6 text-center">{guest.adults}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateGuests(index, 'adults', guest.adults + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <hr />

                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Children</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateGuests(
                            index,
                            'children',
                            Math.max(0, guest.children - 1),
                          )
                        }
                      >
                        −
                      </Button>
                      <span className="w-6 text-center">{guest.children}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateGuests(index, 'children', guest.children + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </SelectContent>
            </Select>
          </div>
        ))}
        {watch('checkIn') && watch('checkOut') && (
          <p className="text-sm text-gray-500">
            {maxRoomsCanBook > 0
              ? `Available rooms: ${maxRoomsCanBook}`
              : 'No rooms available for selected dates'}
          </p>
        )}
        {/* Submit */}
        <div className="grid grid-cols-[32px_1fr] gap-3 items-center">
          <IconWithLine icon={<BsLightningFill size={20} />} />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            loading={isPending}
          >
            Book Now
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default RoomBookingForm;
