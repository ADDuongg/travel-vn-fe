import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, DollarSign, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import type { Booking } from '@/features/shared/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/popover';
import { fmtDate, fmtMoney, getPaymentExpireAt } from '@utils/index';
import { useCountdown } from '@hooks/useCountdown';

const MultiRoomPopover: React.FC<{
  rooms: Booking['rooms'];
}> = ({ rooms }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-xs text-primary hover:underline">
          +{rooms.length - 1} more room{rooms.length > 2 ? 's' : ''}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-3">
        <div className="font-medium">Booked rooms</div>

        {rooms.map((r, i) => (
          <div key={i} className="rounded border p-2 text-sm space-y-1">
            <div className="font-medium">{r.room.name}</div>

            <div className="text-muted-foreground">
              {fmtDate(r.checkIn)} → {fmtDate(r.checkOut)}
            </div>

            <div className="text-xs">
              {r.guests.adults} adult
              {r.guests.children ? `, ${r.guests.children} child` : ''}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

const PaymentCountdown: React.FC<{ createdAt: string }> = ({ createdAt }) => {
  const expireAt = getPaymentExpireAt(createdAt);
  const remaining = useCountdown(expireAt);

  if (!remaining) {
    return (
      <Badge variant="destructive" className="mt-1">
        Payment expired
      </Badge>
    );
  }

  return (
    <div className="text-xs text-muted-foreground mt-1">
      Pay within{' '}
      <span className="font-medium text-amber-600">
        {remaining.minutes}:{remaining.seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export const useColumns = (
  onPay: (b: Booking) => void,
  onDelete: (b: Booking) => void,
): ColumnDef<Booking>[] =>
  useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                ? 'indeterminate'
                : false
            }
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
          />
        ),
        enableSorting: false,
        size: 32,
      },

      {
        id: 'room',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Room
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        accessorFn: (b) => b.rooms?.[0]?.room?.name,
        cell: ({ row }) => {
          const rooms = row.original.rooms;
          if (!rooms?.length) return <span>-</span>;

          const first = rooms[0];
          const room = first.room;

          return (
            <div className="flex flex-col gap-1">
              {room.slug ? (
                <Link
                  to={`/rooms/${room.slug}`}
                  className="font-medium text-primary hover:underline"
                >
                  {room.name}
                </Link>
              ) : (
                <span className="font-medium">{room.name}</span>
              )}

              <span className="text-xs text-muted-foreground">
                {room.roomSize && `${room.roomSize}m²`}
                {room.roomSize && room.maxGuests && ' • '}
                {room.maxGuests && `Max ${room.maxGuests} guests`}
              </span>

              {rooms.length > 1 && <MultiRoomPopover rooms={rooms} />}
            </div>
          );
        },
      },

      {
        id: 'stay',
        header: () => <span>Stay</span>,
        cell: ({ row }) => {
          const r = row.original.rooms?.[0];
          if (!r) return <span>-</span>;

          return (
            <div className="text-sm">
              <div>{fmtDate(r.checkIn)}</div>
              <div className="text-muted-foreground">
                → {fmtDate(r.checkOut)}
              </div>
            </div>
          );
        },
      },

      {
        id: 'guests',
        header: () => <span>Guests</span>,
        cell: ({ row }) => {
          const g = row.original.rooms?.[0]?.guests;
          if (!g) return <span>-</span>;

          return (
            <span>
              {g.adults} adult
              {g.children ? `, ${g.children} child` : ''}
            </span>
          );
        },
      },

      {
        accessorKey: 'amount',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Total
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-medium">
            {fmtMoney(row.original.amount, row.original.currency)}
          </span>
        ),
      },

      {
        accessorKey: 'status',
        header: () => <span>Status</span>,
        cell: ({ getValue }) => (
          <Badge variant="outline">{getValue<Booking['status']>()}</Badge>
        ),
      },

      {
        accessorKey: 'paymentStatus',
        header: () => <span>Payment</span>,
        cell: ({ row }) => {
          const booking = row.original;
          const status = booking.paymentStatus;

          if (status === 'PAID') {
            return <Badge className="bg-emerald-500">Paid</Badge>;
          }

          if (status === 'EXPIRED') {
            return (
              <div>
                <Badge variant="destructive">Expired</Badge>
                <div className="text-xs text-muted-foreground mt-1">
                  Payment time expired
                </div>
              </div>
            );
          }

          if (status === 'UNPAID') {
            return (
              <div>
                <Badge variant="outline" className="text-amber-600">
                  Unpaid
                </Badge>

                <PaymentCountdown createdAt={booking.createdAt} />
              </div>
            );
          }

          return <Badge>{status}</Badge>;
        },
      },

      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPay(row.original)}
              disabled={row.original.paymentStatus !== 'UNPAID'}
              title="Pay now"
            >
              <DollarSign className="h-4 w-4" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete(row.original)}
              title="Delete booking"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
        size: 90,
      },
    ],
    [onPay, onDelete],
  );
