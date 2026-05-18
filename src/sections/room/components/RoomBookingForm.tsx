import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FaDoorOpen, FaUserFriends } from 'react-icons/fa';
import { BsLightningFill } from 'react-icons/bs';
import { HiOutlineLockClosed } from 'react-icons/hi2';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { cn } from '@/lib/utils';

type RoomBookingValues = {
  checkIn: string;
  checkOut: string;
  room: any;
};

type Guest = {
  adults: number;
  children: number;
};

const editorialDateWrap =
  '[&_button]:h-auto [&_button]:min-h-[2.75rem] [&_button]:w-full [&_button]:rounded-2xl [&_button]:border [&_button]:border-charcoal/12 [&_button]:bg-sand-50/90 [&_button]:px-4 [&_button]:py-3 [&_button]:text-left [&_button]:text-[0.95rem] [&_button]:font-normal [&_button]:text-charcoal [&_button]:shadow-inner [&_button]:transition [&_button]:hover:bg-sand-50 [&_button]:focus-visible:border-forest/35 [&_button]:focus-visible:ring-2 [&_button]:focus-visible:ring-forest/15';

const editorialSelectWrap =
  '[&_button]:h-auto [&_button]:min-h-[2.75rem] [&_button]:w-full [&_button]:rounded-2xl [&_button]:border [&_button]:border-charcoal/12 [&_button]:bg-sand-50/90 [&_button]:px-4 [&_button]:py-3 [&_button]:text-[0.95rem] [&_button]:text-charcoal [&_button]:shadow-inner [&_button]:focus-visible:border-forest/35 [&_button]:focus-visible:ring-2 [&_button]:focus-visible:ring-forest/15';

type RoomBookingFormProps = {
  room: Room;

  visualVariant?: 'default' | 'editorial';
};

const RoomBookingForm = ({
  room,
  visualVariant = 'default',
}: RoomBookingFormProps) => {
  const { t } = useTranslation();
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
  };

  const isEd = visualVariant === 'editorial';

  const labelDates = isEd ? (
    <span className="text-[11px] uppercase tracking-[0.22em] text-charcoal/40">
      {t('room.booking.check_in')}
    </span>
  ) : (
    'Check-in'
  );

  const IconWithLine = ({ icon }: { icon: React.ReactNode }) => (
    <div className="relative flex justify-center text-primary">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[10px] bg-border" />
      <div className="relative z-10 bg-background">{icon}</div>
    </div>
  );

  if (!authUser) {
    return (
      <div
        className={cn(
          'space-y-4 border p-5',
          isEd
            ? 'rounded-[1.25rem] border-amber-200/90 bg-amber-50/90 text-charcoal'
            : 'rounded-xl border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/30',
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
              isEd ? 'bg-amber-100' : 'bg-amber-100 dark:bg-amber-900/50',
            )}
          >
            <HiOutlineLockClosed
              className={cn(
                'h-5 w-5',
                isEd ? 'text-amber-700' : 'text-amber-600 dark:text-amber-400',
              )}
            />
          </div>
          <div>
            <h3
              className={cn(
                'font-semibold',
                isEd ? 'text-charcoal' : 'text-foreground',
              )}
            >
              {t('room.booking.login_title')}
            </h3>
            <p
              className={cn(
                'mt-0.5 text-sm',
                isEd ? 'text-mist' : 'text-muted-foreground',
              )}
            >
              {t('room.booking.login_desc')}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            asChild
            className={cn(
              'h-11 w-full font-medium',
              isEd ? 'rounded-full' : 'rounded-lg',
            )}
            size="lg"
          >
            <Link to={ROUTES.LOGIN}>{t('room.booking.login_cta')}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className={cn('h-11 w-full', isEd ? 'rounded-full' : 'rounded-lg')}
            size="lg"
          >
            <Link to={ROUTES.REGISTER}>{t('room.booking.register_cta')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const dateFieldShell = cn('w-full', isEd && editorialDateWrap);
  const selectFieldShell = cn('w-full', isEd && editorialSelectWrap);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn('flex flex-col', isEd ? 'gap-6' : 'gap-5')}
      >
        <div className="space-y-3">
          <p
            className={cn(
              'text-sm font-medium',
              isEd ? 'text-charcoal/80' : 'text-muted-foreground',
            )}
          >
            {t('room.booking.dates_section')}
          </p>
          {isEd ? (
            <>
              <div className={dateFieldShell}>
                <CustomInput
                  name="checkIn"
                  type="date"
                  className="w-full"
                  size="lg"
                  label={labelDates}
                  rules={{
                    required: t('room.booking.err_check_in'),
                  }}
                />
              </div>
              <div className={dateFieldShell}>
                <CustomInput
                  name="checkOut"
                  type="date"
                  className="w-full"
                  size="lg"
                  label={
                    <span className="text-[11px] uppercase tracking-[0.22em] text-charcoal/40">
                      {t('room.booking.check_out')}
                    </span>
                  }
                  rules={{
                    required: t('room.booking.err_check_out'),
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-[32px_1fr] items-center gap-3">
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
              <div className="grid grid-cols-[32px_1fr] items-center gap-3">
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
            </>
          )}
        </div>

        <div className="space-y-3">
          <p
            className={cn(
              'text-sm font-medium',
              isEd ? 'text-charcoal/80' : 'text-muted-foreground',
            )}
          >
            {t('room.booking.rooms_section')}
          </p>
          {isEd ? (
            <div className={selectFieldShell}>
              <CustomInput
                name="room"
                type="select"
                className="w-full"
                size="lg"
                label={
                  <span className="text-[11px] uppercase tracking-[0.22em] text-charcoal/40">
                    {t('room.booking.quantity_label')}
                  </span>
                }
                options={Array.from({ length: maxRoomsCanBook }, (_, i) => ({
                  label: `${i + 1}`,
                  value: `${i + 1}`,
                }))}
                rules={{ required: t('room.booking.err_room_qty') }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-[32px_1fr] items-center gap-3">
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
          )}
        </div>

        {guestsByRoom.map((guest, index) => (
          <div
            key={index}
            className={cn(
              isEd
                ? 'rounded-[1.25rem] border border-charcoal/10 bg-sand-100/80 px-4 py-4'
                : 'grid grid-cols-[32px_1fr] items-start gap-3',
            )}
          >
            {!isEd ? <IconWithLine icon={<FaUserFriends size={20} />} /> : null}
            <div className={cn(isEd && 'space-y-3')}>
              {isEd ? (
                <p className="text-[11px] uppercase tracking-[0.18em] text-charcoal/45">
                  {t('room.booking.guests_room', { n: index + 1 })}
                </p>
              ) : null}
              <Select>
                <SelectTrigger
                  size="lg"
                  label={
                    isEd
                      ? undefined
                      : `Khách — Phòng ${index + 1}`
                  }
                  required
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm',
                    isEd
                      ? 'h-auto min-h-[2.75rem] rounded-2xl border border-charcoal/12 bg-sand-50/90 font-medium text-charcoal shadow-inner focus-visible:border-forest/35 focus-visible:ring-2 focus-visible:ring-forest/15'
                      : 'h-11 rounded-lg border border-border',
                  )}
                >
                  <span className="text-sm font-medium">
                    {t('room.booking.guest_counts', {
                      adults: guest.adults,
                      children: guest.children,
                    })}
                  </span>
                </SelectTrigger>

                <SelectContent className="!p-0 w-[--radix-select-trigger-width]">
                  <div className="space-y-4 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{t('room.booking.adults')}</span>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
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
                          type="button"
                          onClick={() =>
                            updateGuests(index, 'adults', guest.adults + 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <hr />

                    <div className="flex items-center justify-between">
                      <span className="font-medium">{t('room.booking.children')}</span>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
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
                          type="button"
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
          </div>
        ))}
        {watch('checkIn') && watch('checkOut') && (
          <p
            className={cn(
              'text-sm',
              isEd ? 'text-charcoal/45' : 'text-muted-foreground',
            )}
          >
            {maxRoomsCanBook > 0
              ? t('room.booking.availability_ok', { count: maxRoomsCanBook })
              : t('room.booking.availability_none')}
          </p>
        )}
        <Button
          type="submit"
          className={cn(
            'w-full text-base font-semibold',
            isEd
              ? 'h-12 rounded-full bg-charcoal text-sand-50 shadow-soft hover:bg-charcoal/90'
              : 'h-12 rounded-lg shadow-sm',
          )}
          disabled={isPending}
          loading={isPending}
        >
          <BsLightningFill className="mr-2 h-4 w-4" />
          {t('room.booking.submit')}
        </Button>
      </form>
    </FormProvider>
  );
};

export default RoomBookingForm;

