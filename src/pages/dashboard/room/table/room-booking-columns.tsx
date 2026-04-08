import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Booking } from '@/features/shared/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/popover';
import { cn } from '@/lib/utils';
import { fmtDate, fmtMoney, getPaymentExpireAt } from '@utils/index';
import { useCountdown } from '@hooks/useCountdown';
import { ROUTES } from '@/constants/router';

const STATUS_KEYS: Record<Booking['status'], string> = {
  all: 'all',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

const StatusBadge: React.FC<{
  status: Booking['status'];
  label: string;
}> = ({ status, label }) => (
  <Badge
    variant="outline"
    className={
      status === 'CANCELLED' || status === 'REJECTED'
        ? 'border-rose-300 text-rose-700'
        : status === 'APPROVED' || status === 'COMPLETED'
          ? 'border-emerald-300 text-emerald-700'
          : 'border-amber-300 text-amber-700'
    }
  >
    {label}
  </Badge>
);

const MultiRoomPopover: React.FC<{ rooms: Booking['rooms'] }> = ({ rooms }) => {
  const { t } = useTranslation();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'cursor-pointer text-xs font-medium text-[#2563EB] underline-offset-2 transition-colors hover:text-[#1D4ED8] hover:underline',
          )}
        >
          +{rooms.length - 1} {t('bookings.more_rooms')}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-3 rounded-xl border-slate-200/90 p-4 shadow-lg">
        <div className="font-semibold text-[#1E3A8A]">{t('bookings.booked_rooms')}</div>

        {rooms.map((r, i) => (
          <div
            key={i}
            className="space-y-1 rounded-lg border border-slate-100 bg-[#F8FAFC]/80 p-3 text-sm"
          >
            <div className="font-medium text-slate-800">{r.room.name}</div>

            <div className="text-xs text-slate-600 sm:text-sm">
              {fmtDate(r.checkIn)} → {fmtDate(r.checkOut)}
            </div>

            <div className="text-xs text-slate-600">
              {r.guests.adults} {t('bookings.adults_label')}
              {r.guests.children
                ? `, ${r.guests.children} ${t('bookings.children_label')}`
                : ''}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

const PaymentCountdown: React.FC<{ createdAt: string }> = ({ createdAt }) => {
  const { t } = useTranslation();
  const expireAt = getPaymentExpireAt(createdAt);
  const remaining = useCountdown(expireAt);

  if (!remaining) {
    return (
      <Badge variant="destructive" className="mt-1">
        {t('bookings.payment_expired_desc')}
      </Badge>
    );
  }

  return (
    <div className="text-xs text-muted-foreground mt-1">
      {t('bookings.pay_within')}{' '}
      <span className="font-medium text-amber-600">
        {remaining.minutes}:{remaining.seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export const useColumns = (): ColumnDef<Booking>[] => {
  const { t } = useTranslation();
  const statusLabels = useMemo(
    () =>
      (Object.keys(STATUS_KEYS) as Booking['status'][]).reduce(
        (acc, status) => {
          acc[status] =
            t(`bookings.status_${STATUS_KEYS[status]}`) || status;
          return acc;
        },
        {} as Record<Booking['status'], string>,
      ),
    [t],
  );

  return useMemo(
    () => [
      {
        id: 'room',
        header: () => t('bookings.table_room'),
        accessorFn: (b) => b.rooms?.[0]?.room?.name,
        cell: ({ row }) => {
          const rooms = row.original.rooms;
          if (!rooms?.length) return <span>—</span>;

          const first = rooms[0];
          const room = first.room;
          const capacity = room?.capacity;
          const roomSize = capacity?.roomSize;
          const maxAdults = capacity?.maxAdults;

          return (
            <div className="flex flex-col gap-1">
              {room.slug ? (
                <Link
                  to={`/rooms/${room.slug}`}
                  className="font-medium text-[#2563EB] underline-offset-2 transition-colors hover:text-[#1D4ED8] hover:underline"
                >
                  {room.name}
                </Link>
              ) : (
                <span className="font-medium text-slate-900">{room.name}</span>
              )}

              <span className="text-xs text-slate-600">
                {room.roomType && (
                  <span className="font-semibold text-[#1E3A8A]">
                    {room.roomType}
                  </span>
                )}
                {room.roomType && (roomSize || maxAdults) && ' • '}
                {roomSize && `${roomSize}m²`}
                {roomSize && maxAdults && ' • '}
                {maxAdults != null &&
                  t('bookings.max_guests', { count: maxAdults })}
              </span>

              {rooms.length > 1 && <MultiRoomPopover rooms={rooms} />}
            </div>
          );
        },
      },

      {
        id: 'stay',
        header: () => t('bookings.table_stay'),
        cell: ({ row }) => {
          const r = row.original.rooms?.[0];
          if (!r) return <span>—</span>;

          return (
            <div className="text-sm tabular-nums">
              <div className="font-medium text-slate-800">{fmtDate(r.checkIn)}</div>
              <div className="text-xs text-slate-500 sm:text-sm">
                → {fmtDate(r.checkOut)}
              </div>
            </div>
          );
        },
      },

      {
        id: 'guests',
        header: () => t('bookings.table_guests'),
        cell: ({ row }) => {
          const g = row.original.rooms?.[0]?.guests;
          if (!g) return <span>—</span>;

          return (
            <span>
              {g.adults} {t('bookings.adults_label')}
              {g.children ? `, ${g.children} ${t('bookings.children_label')}` : ''}
            </span>
          );
        },
      },

      {
        accessorKey: 'amount',
        header: () => t('bookings.table_total'),
        cell: ({ row }) => (
          <span className="font-semibold tabular-nums text-[#1E40AF]">
            {fmtMoney(row.original.amount, row.original.currency)}
          </span>
        ),
      },

      {
        accessorKey: 'status',
        header: () => t('bookings.table_status'),
        cell: ({ getValue }) => {
          const status = getValue<Booking['status']>();
          return (
            <StatusBadge
              status={status}
              label={statusLabels[status] ?? status}
            />
          );
        },
      },

      {
        accessorKey: 'paymentStatus',
        header: () => t('bookings.table_payment'),
        cell: ({ row }) => {
          const booking = row.original;
          const status = booking.paymentStatus;

          if (status === 'PAID') {
            return (
              <Badge
                variant="outline"
                className="border-emerald-300 text-emerald-700"
              >
                {t('bookings.payment_paid')}
              </Badge>
            );
          }

          if (status === 'EXPIRED') {
            return (
              <div>
                <Badge variant="destructive">
                  {t('bookings.payment_expired')}
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">
                  {t('bookings.payment_expired_desc')}
                </div>
              </div>
            );
          }

          if (status === 'UNPAID') {
            return (
              <div>
                <Badge
                  variant="outline"
                  className="border-amber-300 text-amber-700"
                >
                  {t('bookings.payment_unpaid')}
                </Badge>
                <PaymentCountdown createdAt={booking.createdAt} />
              </div>
            );
          }

          return <Badge variant="outline">{status}</Badge>;
        },
      },

      {
        id: 'actions',
        header: () => <span className="sr-only">{t('bookings.table_actions')}</span>,
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer border-[#1E3A8A]/25 font-medium text-[#1E3A8A] transition-colors hover:bg-[#1E3A8A]/5"
            asChild
          >
            <Link
              to={ROUTES.DASHBOARD.ROOM_BOOKINGS_DETAIL.replace(
                ':id',
                row.original._id,
              )}
            >
              {t('bookings.table_detail')}
            </Link>
          </Button>
        ),
        size: 80,
      },
    ],
    [t, statusLabels],
  );
};
