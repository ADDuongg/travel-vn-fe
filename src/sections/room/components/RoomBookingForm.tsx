import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FaDoorOpen, FaUserFriends } from 'react-icons/fa';
import { BsLightningFill } from 'react-icons/bs';
import { HiOutlineLockClosed } from 'react-icons/hi2';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomInput from '@/components/CustomInput';
import { Select, SelectTrigger, SelectContent } from '@components/ui/select';
import type { Room } from '@/features/rooms/types';
import {
  useCreateRoomBooking,
  useGetTotalRoomByDate,
} from '@/features/rooms/hooks';
import { useAuthStore } from '@/stores/useAuthStore';
import { toDateOnly } from '@utils/index';
import { ROUTES } from '@/constants/router';

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
  const authUser = useAuthStore((s) => s.authUser);
  const currentUserId = authUser?._id;
  const { data: totalRoomByDate } = useGetTotalRoomByDate(
    room?._id,
    toDateOnly(checkIn),
    toDateOnly(checkOut),
  );

  const maxRoomsCanBook = useMemo(() => {
    return totalRoomByDate?.maxRoomsCanBook ?? room?.inventory?.totalRooms ?? 1;
  }, [watch('checkIn'), watch('checkOut'), totalRoomByDate]);

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
    <div className="relative flex justify-center text-primary">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[10px] bg-border" />
      <div className="relative z-10 bg-background">{icon}</div>
    </div>
  );

  // Yêu cầu đăng nhập mới cho đặt phòng
  if (!authUser) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/30 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
            <HiOutlineLockClosed className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Đăng nhập để đặt phòng</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Bạn cần đăng nhập để đặt phòng và quản lý đơn của mình.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full rounded-lg h-11 font-medium" size="lg">
            <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
          </Button>
          <Button asChild variant="outline" className="w-full rounded-lg h-11" size="lg">
            <Link to={ROUTES.REGISTER}>Tạo tài khoản</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Ngày nhận / trả phòng</p>
          <div className="grid grid-cols-[32px_1fr] gap-3 items-center">
            <IconWithLine icon={<AiOutlineCalendar size={22} />} />
            <CustomInput
              name="checkIn"
              type="date"
              className="w-full [&_input]:rounded-lg [&_input]:h-11 [&_input]:border-border"
              size="lg"
              label="Check-in"
              rules={{ required: 'Vui lòng chọn ngày nhận phòng' }}
            />
          </div>
          <div className="grid grid-cols-[32px_1fr] gap-3 items-center">
            <IconWithLine icon={<AiOutlineCalendar size={22} />} />
            <CustomInput
              name="checkOut"
              type="date"
              className="w-full [&_input]:rounded-lg [&_input]:h-11 [&_input]:border-border"
              size="lg"
              label="Check-out"
              rules={{ required: 'Vui lòng chọn ngày trả phòng' }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Số phòng</p>
          <div className="grid grid-cols-[32px_1fr] gap-3 items-center">
            <IconWithLine icon={<FaDoorOpen size={20} />} />
            <CustomInput
              name="room"
              type="select"
              className="w-full [&_button]:rounded-lg [&_button]:h-11 [&_button]:border-border"
              size="lg"
              label=""
              options={Array.from({ length: maxRoomsCanBook }, (_, i) => ({
                label: `${i + 1}`,
                value: `${i + 1}`,
              }))}
              rules={{ required: 'Vui lòng chọn số phòng' }}
            />
          </div>
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
                label={`Khách — Phòng ${index + 1}`}
                required
                className="w-full border border-border rounded-lg h-11 px-3 py-2 text-sm text-left"
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
          <p className="text-sm text-muted-foreground">
            {maxRoomsCanBook > 0
              ? `Còn trống: ${maxRoomsCanBook} phòng`
              : 'Không còn phòng cho khoảng ngày đã chọn'}
          </p>
        )}
        <Button
          type="submit"
          className="w-full rounded-lg h-12 text-base font-semibold shadow-sm"
          disabled={isPending}
          loading={isPending}
        >
          <BsLightningFill className="mr-2 h-4 w-4" />
          Đặt phòng
        </Button>
      </form>
    </FormProvider>
  );
};

export default RoomBookingForm;
