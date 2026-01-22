import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { useGetBookingById } from '@/features/booking/hooks';

type SaleInfo = {
  isActive: boolean;
  type: 'PERCENT' | 'FIXED';
  value: number;
  startDate?: string;
  endDate?: string;
};

const statusStyle: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  CONFIRMED: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  COMPLETED: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
};

const paymentStyle: Record<string, string> = {
  UNPAID: 'bg-amber-100 text-amber-800',
  PAID: 'bg-emerald-100 text-emerald-800',
  REFUNDED: 'bg-slate-100 text-slate-800',
};

const getNights = (checkIn?: string, checkOut?: string) => {
  if (!checkIn || !checkOut) return 1;
  const diff = dayjs(checkOut).diff(dayjs(checkIn), 'day');
  return Math.max(diff, 1);
};

const applySale = (base: number, sale?: SaleInfo) => {
  if (!sale?.isActive) return base;

  const now = dayjs();
  if (sale.startDate && dayjs(sale.startDate).isAfter(now)) return base;
  if (sale.endDate && dayjs(sale.endDate).isBefore(now)) return base;

  if (sale.type === 'PERCENT') {
    return Math.max(0, Math.round(base * (1 - sale.value / 100)));
  }

  if (sale.type === 'FIXED') {
    return Math.max(0, base - sale.value);
  }

  return base;
};

const MyBookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [, setOpenReceiptModal] = useState(false);

  const { data: booking, isLoading } = useGetBookingById(id);

  const summary = useMemo(() => {
    if (!booking) return null;
    const created = dayjs(booking.createdAt);
    const checkIn = booking.rooms?.[0]?.checkIn;
    const checkOut = booking.rooms?.[0]?.checkOut;
    const nights =
      checkIn && checkOut
        ? Math.max(dayjs(checkOut).diff(dayjs(checkIn), 'day'), 1)
        : undefined;

    return {
      id: `#${booking._id.slice(-6)}`,
      createdAt: created.format('DD MMM YYYY'),
      nights,
    };
  }, [booking]);

  const priceDetail = useMemo(() => {
    if (!booking) return null;

    const rooms = booking.rooms.map((r: any, index: number) => {
      const nights = getNights(r.checkIn, r.checkOut);
      const capacity = r.room?.capacity || {};
      const maxAdults = capacity.maxAdults ?? 0;
      const maxChildren = capacity.maxChildren ?? 0;
      const baseAdults = capacity.baseAdults ?? maxAdults ?? 0;
      const baseChildren = capacity.baseChildren ?? maxChildren ?? 0;

      const safeMaxAdults = maxAdults || r.guests?.adults || 0;
      const safeMaxChildren = maxChildren || r.guests?.children || 0;
      const guestsAdults = Math.min(r.guests?.adults ?? 0, safeMaxAdults);
      const guestsChildren = Math.min(r.guests?.children ?? 0, safeMaxChildren);

      const basePrice = r.room?.pricing?.basePrice ?? 0;
      const currency = r.room?.pricing?.currency ?? booking.currency;
      const discountedBase = applySale(basePrice, r.room?.sale);

      const extraAdults = Math.max(0, guestsAdults - baseAdults);
      const extraChildren = Math.max(0, guestsChildren - baseChildren);
      const extraAdultPrice = r.room?.pricing?.extraAdultPrice ?? 0;
      const extraChildPrice = r.room?.pricing?.extraChildPrice ?? 0;

      const nightlyPrice =
        discountedBase + extraAdults * extraAdultPrice + extraChildren * extraChildPrice;
      const total = nightlyPrice * nights;

      return {
        index,
        nightlyPrice,
        total,
        nights,
        currency,
        title: r.room?.name || r.room?.slug || `Room ${index + 1}`,
        guestsAdults,
        guestsChildren,
      };
    });

    const totalAmount = rooms.reduce((sum, r) => sum + r.total, 0);

    return {
      rooms,
      totalAmount,
      currency: booking.currency || rooms[0]?.currency,
    };
  }, [booking]);

  const computedAmount = priceDetail?.totalAmount ?? booking?.amount ?? 0;

  if (isLoading) {
    return (
      <div className="p-6 space-y-3 animate-pulse">
        <div className="h-8 w-48 rounded bg-slate-200" />
        <div className="h-5 w-full rounded bg-slate-200" />
        <div className="h-5 w-2/3 rounded bg-slate-200" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-500">Booking not found.</p>
        <Button className="mt-4" variant="outline" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-slate-500 tracking-wide">
            Booking Detail
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            {summary?.id}
          </h2>
          <p className="text-sm text-slate-500">
            Created {summary?.createdAt}
            {summary?.nights ? ` · ${summary.nights} night stay` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back to list
          </Button>
          <Button
            variant="default"
            disabled={booking.paymentStatus !== 'UNPAID'}
            onClick={() => navigate(`/bookings/${booking._id}/payment`)}
          >
            Pay online
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          {/* ORDER SUMMARY */}
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Order summary
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {summary?.id}
                </p>
                <p className="text-sm text-slate-500">
                  Booked on {summary?.createdAt}
                </p>
              </div>
              <div
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[booking.status] || 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'}`}
              >
                {booking.status}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-slate-500">Payment</p>
                <p
                  className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${paymentStyle[booking.paymentStatus] || 'bg-slate-200 text-slate-700'}`}
                >
                  {booking.paymentStatus}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-slate-500">Total amount</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {computedAmount.toLocaleString()} {booking.currency}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-slate-500">Contact</p>
                <p className="mt-1 text-slate-900">
                  {(booking as any)?.contactName ||
                    (booking as any)?.contact?.name ||
                    'N/A'}
                </p>
                <p className="text-slate-500">
                  {(booking as any)?.contactEmail ||
                    (booking as any)?.contact?.email ||
                    ''}
                </p>
              </div>
            </div>
          </section>

          {/* ROOMS */}
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Rooms & stay
              </h3>
              <p className="text-xs text-slate-500">
                {booking.rooms.length} room{booking.rooms.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              {booking.rooms.map((r: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 rounded-lg border p-4 hover:border-blue-200 hover:shadow-sm transition"
                >
                  <div className="w-full sm:w-32 h-24 shrink-0 overflow-hidden rounded-md bg-slate-100">
                    {r.room.thumbnail?.url ? (
                      <img
                        src={r.room.thumbnail.url}
                        alt={r.room.slug}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-slate-900">
                        {r.room.name || r.room.slug}
                      </p>
                      {r.room.roomType && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-semibold text-blue-700">
                          {r.room.roomType}
                        </span>
                      )}
                      {!r.room.roomType && r.room.category && (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                          {r.room.category}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600">
                      {dayjs(r.checkIn).format('DD MMM YYYY')} →{' '}
                      {dayjs(r.checkOut).format('DD MMM YYYY')}
                    </p>

                    <div className="flex flex-wrap gap-3 text-slate-600">
                      <span>
                        Size: {r.room.capacity?.roomSize ?? 'N/A'} m²
                      </span>
                      <span>
                        Max: {r.room.capacity?.maxAdults ?? 0} adults ·{' '}
                        {r.room.capacity?.maxChildren ?? 0} children
                      </span>
                      <span>
                        Guests: {r.guests.adults} adult
                        {r.guests.adults > 1 ? 's' : ''} ·{' '}
                        {r.guests.children} child
                        {r.guests.children !== 1 ? 'ren' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PRICE */}
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Price breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Currency: {booking.currency}
              </p>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-700">
              {priceDetail?.rooms?.map((room) => (
                <div key={room.index} className="flex items-center justify-between">
                  <span>
                    {room.title} · {room.nights} night{room.nights > 1 ? 's' : ''} ·{' '}
                    {room.guestsAdults} adult{room.guestsAdults !== 1 ? 's' : ''}
                    {room.guestsChildren ? `, ${room.guestsChildren} child` : ''}
                  </span>
                  <span className="font-medium">
                    {room.total.toLocaleString()} {priceDetail.currency}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span>Room total</span>
                <span className="font-medium">
                  {computedAmount.toLocaleString()} {priceDetail?.currency || booking.currency}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Taxes & fees</span>
                <span>Included</span>
              </div>
              <div className="border-t pt-3 flex items-center justify-between text-base font-semibold text-slate-900">
                <span>Amount due</span>
                <span>
                  {computedAmount.toLocaleString()} {priceDetail?.currency || booking.currency}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="rounded-xl border bg-white p-5 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Next step
              </h3>
              <span
                className={`rounded-full px-2 py-1 text-[11px] font-semibold ${paymentStyle[booking.paymentStatus] || 'bg-slate-200 text-slate-700'}`}
              >
                {booking.paymentStatus}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Share a bank transfer receipt or complete online payment to
              finalize this booking.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setOpenReceiptModal(true)}
              disabled={booking.paymentStatus !== 'UNPAID'}
            >
              Upload bank receipt
            </Button>

            <Button
              className="w-full"
              variant="default"
              disabled={booking.paymentStatus !== 'UNPAID'}
              onClick={() => navigate(`/bookings/${booking._id}/payment`)}
            >
              Make an online payment
            </Button>

            <Button
              className="w-full"
              variant="secondary"
              onClick={() => navigate('/dashboard/support')}
            >
              Contact support
            </Button>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800">Need help?</p>
            <p>
              Keep your booking ID handy when you reach out. We are here to help
              with payment confirmations, schedule changes, or special requests.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MyBookingDetailPage;
