import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import {
  useGetBookingById,
  useCancelRoomBookingMutation,
} from '@/features/booking/hooks';
import { ROUTES } from '@/constants/router';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  CalendarRange,
  CreditCard,
  Headphones,
  Hotel,
  Loader2,
  User,
} from 'lucide-react';

type SaleInfo = {
  isActive: boolean;
  type: 'PERCENT' | 'FIXED';
  value: number;
  startDate?: string;
  endDate?: string;
};

const ROOM_STATUS_KEYS: Record<string, string> = {
  PENDING: 'pending',
  APPROVED: 'approved',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};

const statusStyle: Record<string, string> = {
  PENDING:
    'bg-amber-50 text-amber-800 ring-1 ring-amber-200/90 shadow-sm shadow-amber-100/50',
  APPROVED:
    'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/90 shadow-sm shadow-emerald-100/50',
  CONFIRMED:
    'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/90 shadow-sm shadow-emerald-100/50',
  CANCELLED:
    'bg-rose-50 text-rose-800 ring-1 ring-rose-200/90 shadow-sm shadow-rose-100/50',
  COMPLETED:
    'bg-sand-100/90 text-charcoal ring-1 ring-charcoal/15 shadow-soft',
  REJECTED:
    'bg-rose-50 text-rose-800 ring-1 ring-rose-200/90 shadow-sm shadow-rose-100/50',
};

const paymentStyle: Record<string, string> = {
  UNPAID: 'bg-amber-50 text-amber-900 ring-1 ring-amber-200/80 font-semibold',
  PAID: 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200/80 font-semibold',
  REFUNDED:
    'bg-slate-100 text-slate-800 ring-1 ring-slate-200/80 font-semibold',
  EXPIRED: 'bg-rose-50 text-rose-900 ring-1 ring-rose-200/80 font-semibold',
};

function roomPaymentLabelKey(status: string): string {
  if (status === 'PAID') return 'bookings.payment_paid';
  if (status === 'UNPAID') return 'bookings.payment_unpaid';
  if (status === 'REFUNDED') return 'bookings.payment_partial';
  if (status === 'EXPIRED') return 'bookings.payment_expired';
  return 'bookings.payment_unpaid';
}

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

const cardClass =
  'rounded-2xl border border-charcoal/10 bg-card p-5 shadow-soft sm:p-6';

const MyBookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [, setOpenReceiptModal] = useState(false);

  const { data: booking, isLoading } = useGetBookingById(id);
  const cancelMutation = useCancelRoomBookingMutation();

  const canCancel =
    booking && (booking.status === 'PENDING' || booking.status === 'APPROVED');

  const handleCancel = async () => {
    if (!booking?._id || !window.confirm(t('bookings.confirm_cancel'))) return;
    await cancelMutation.mutateAsync(booking._id);
    navigate(ROUTES.DASHBOARD.ROOM_BOOKINGS);
  };

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
        discountedBase +
        extraAdults * extraAdultPrice +
        extraChildren * extraChildPrice;
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

  const statusLabel = booking
    ? t(
        `bookings.status_${ROOM_STATUS_KEYS[booking.status] ?? booking.status.toLowerCase()}`,
      )
    : '';

  if (isLoading) {
    return (
      <div
        className="space-y-4 font-dashboard-sans"
        aria-busy="true"
        aria-label={t('bookings.table_loading')}
      >
        <div className="h-4 w-40 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-36 animate-pulse rounded-2xl border border-slate-100 bg-slate-100/80" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-2xl border border-slate-100 bg-slate-100/80 lg:col-span-2" />
          <div className="h-64 animate-pulse rounded-2xl border border-slate-100 bg-slate-100/80" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div
        className={cn(
          cardClass,
          'font-dashboard-sans text-center sm:text-left',
        )}
      >
        <p className="text-sm text-slate-600">
          {t('bookings.booking_not_found')}
        </p>
        <Button
          className="mt-4 cursor-pointer"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          {t('bookings.go_back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-dashboard-sans">
      <Link
        to={ROUTES.DASHBOARD.ROOM_BOOKINGS}
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-forest transition-colors duration-200 hover:text-forest/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/35 focus-visible:ring-offset-2"
      >
        <ArrowLeft className="size-4 shrink-0" aria-hidden />
        {t('bookings.back_to_my_bookings')}
      </Link>

      {/* Header */}
      <header className={cn(cardClass, 'border-t-4 border-t-forest')}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t('bookings.detail_title')}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
              {summary?.id}
            </h1>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1">
                <CalendarRange className="size-4 text-forest" aria-hidden />
                {t('bookings.created_at')} {summary?.createdAt}
              </span>
              {summary?.nights ? (
                <span className="text-slate-400">·</span>
              ) : null}
              {summary?.nights ? (
                <span>
                  {summary.nights} {t('bookings.nights')}
                </span>
              ) : null}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="cursor-pointer border-charcoal/15 text-charcoal shadow-soft transition-colors hover:bg-charcoal/4"
              asChild
            >
              <Link to={ROUTES.DASHBOARD.ROOM_BOOKINGS}>
                {t('bookings.back_to_list')}
              </Link>
            </Button>
            <Button
              className="cursor-pointer rounded-full bg-forest font-semibold text-sand-50 shadow-soft transition-colors hover:bg-forest/90 disabled:opacity-50"
              disabled={booking.paymentStatus !== 'UNPAID'}
              onClick={() => navigate(`/bookings/${booking._id}/payment`)}
            >
              <CreditCard className="mr-2 size-4" aria-hidden />
              {t('bookings.pay_online')}
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="space-y-6 lg:col-span-2">
          {/* Order summary */}
          <section className={cardClass}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t('bookings.order_summary')}
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {summary?.id}
                </p>
                <p className="text-sm text-slate-600">
                  {t('bookings.created_at')} {summary?.createdAt}
                </p>
              </div>
              <span
                className={cn(
                  'inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
                  statusStyle[booking.status] ||
                    'bg-slate-100 text-slate-800 ring-1 ring-slate-200',
                )}
              >
                {statusLabel}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-sand-50/80 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {t('bookings.payment')}
                </p>
                <p
                  className={cn(
                    'mt-2 inline-flex rounded-full px-2.5 py-1 text-xs',
                    paymentStyle[booking.paymentStatus] ||
                      'bg-slate-200 text-slate-800',
                  )}
                >
                  {t(roomPaymentLabelKey(booking.paymentStatus))}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-sand-50/80 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {t('bookings.total_amount')}
                </p>
                <p className="mt-2 text-base font-bold tabular-nums text-charcoal">
                  {computedAmount.toLocaleString()} {booking.currency}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-sand-50/80 p-4">
                <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  <User className="size-3.5" aria-hidden />
                  {t('bookings.contact')}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {(booking as any)?.contactName ||
                    (booking as any)?.contact?.name ||
                    '—'}
                </p>
                <p className="text-xs text-slate-600 break-all">
                  {(booking as any)?.contactEmail ||
                    (booking as any)?.contact?.email ||
                    ''}
                </p>
              </div>
            </div>

            {booking.cancelledAt && (
              <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50/80 p-3 text-sm text-rose-900">
                {t('bookings.cancelled_at')}:{' '}
                {dayjs(booking.cancelledAt).format('DD/MM/YYYY HH:mm')}
                {booking.cancelReason && ` — ${booking.cancelReason}`}
              </div>
            )}
            {canCancel && (
              <div className="mt-5 border-t border-slate-100 pt-5">
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? (
                    <>
                      <Loader2
                        className="mr-2 size-4 shrink-0 animate-spin"
                        aria-hidden
                      />
                      {t('bookings.cancelling')}
                    </>
                  ) : (
                    t('bookings.cancel_booking')
                  )}
                </Button>
              </div>
            )}
          </section>

          {/* Rooms */}
          <section className={cardClass}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-charcoal">
                <Hotel className="size-5 text-forest" aria-hidden />
                {t('bookings.rooms_and_stay')}
              </h2>
              <p className="text-xs font-medium text-slate-500">
                {t('bookings.room_count', { count: booking.rooms.length })}
              </p>
            </div>

            <ul className="mt-5 grid list-none grid-cols-1 gap-4 p-0">
              {booking.rooms.map((r: any, index: number) => (
                <li
                  key={index}
                  className="flex flex-col gap-4 rounded-xl border border-charcoal/10 p-4 transition-all duration-200 hover:border-forest/30 hover:shadow-soft motion-reduce:transition-none sm:flex-row"
                >
                  <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-sand-50/80 sm:h-auto sm:w-36">
                    {r.room.thumbnail?.url ? (
                      <img
                        src={r.room.thumbnail.url}
                        alt={r.room.name || ''}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-[7rem] w-full items-center justify-center text-xs font-medium text-slate-400">
                        {t('bookings.no_room_image')}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-slate-900">
                        {r.room.name || r.room.slug}
                      </p>
                      {r.room.roomType && (
                        <span className="rounded-full bg-sand-100/90 px-2 py-0.5 text-[11px] font-semibold text-charcoal ring-1 ring-charcoal/15">
                          {r.room.roomType}
                        </span>
                      )}
                      {!r.room.roomType && r.room.category && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/80">
                          {r.room.category}
                        </span>
                      )}
                    </div>

                    <p className="tabular-nums text-slate-700">
                      {dayjs(r.checkIn).format('DD MMM YYYY')} →{' '}
                      {dayjs(r.checkOut).format('DD MMM YYYY')}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 sm:text-sm">
                      <span>
                        {t('bookings.size_sqm')}:{' '}
                        {r.room.capacity?.roomSize ?? '—'} m²
                      </span>
                      <span>
                        Max: {r.room.capacity?.maxAdults ?? 0}{' '}
                        {t('bookings.adults_label')} ·{' '}
                        {r.room.capacity?.maxChildren ?? 0}{' '}
                        {t('bookings.children_label')}
                      </span>
                      <span>
                        {r.guests.adults} {t('bookings.adults_label')} ·{' '}
                        {r.guests.children} {t('bookings.children_label')}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Price */}
          <section className={cardClass}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold text-charcoal">
                {t('bookings.price_breakdown')}
              </h2>
              <p className="text-xs font-medium text-slate-500">
                {booking.currency}
              </p>
            </div>

            <div className="mt-5 space-y-3 text-sm text-slate-700">
              {priceDetail?.rooms?.map((room) => (
                <div
                  key={room.index}
                  className="flex flex-col justify-between gap-1 border-b border-slate-100 py-2 last:border-0 sm:flex-row sm:items-center"
                >
                  <span className="text-slate-700">
                    {room.title} · {room.nights} {t('bookings.nights')} ·{' '}
                    {room.guestsAdults} {t('bookings.adults_label')}
                    {room.guestsChildren
                      ? `, ${room.guestsChildren} ${t('bookings.children_label')}`
                      : ''}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-charcoal">
                    {room.total.toLocaleString()} {priceDetail.currency}
                  </span>
                </div>
              ))}
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                <span className="font-medium text-slate-800">
                  {t('bookings.room_total')}
                </span>
                <span className="font-semibold tabular-nums text-charcoal">
                  {computedAmount.toLocaleString()}{' '}
                  {priceDetail?.currency || booking.currency}
                </span>
              </div>
              <div className="flex flex-col justify-between gap-1 text-slate-500 sm:flex-row sm:items-center">
                <span>{t('bookings.taxes_included')}</span>
                <span>{t('bookings.taxes_included_value')}</span>
              </div>
              <div className="flex flex-col justify-between gap-1 border-t border-slate-200 pt-4 text-base font-bold text-slate-900 sm:flex-row sm:items-center">
                <span>{t('bookings.amount_due')}</span>
                <span className="tabular-nums text-charcoal">
                  {computedAmount.toLocaleString()}{' '}
                  {priceDetail?.currency || booking.currency}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside
          className={cn(cardClass, 'h-fit lg:sticky lg:top-24 lg:self-start')}
        >
          <div className="space-y-3 border-b border-slate-100 pb-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-charcoal">
                {t('bookings.next_step')}
              </h3>
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-[11px] font-semibold',
                  paymentStyle[booking.paymentStatus] ||
                    'bg-slate-200 text-slate-800',
                )}
              >
                {t(roomPaymentLabelKey(booking.paymentStatus))}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              {t('bookings.next_step_room_desc')}
            </p>
          </div>

          <div className="space-y-3 pt-5">
            <Button
              className="w-full cursor-pointer border-charcoal/15 text-charcoal shadow-soft transition-colors hover:bg-charcoal/4"
              variant="outline"
              onClick={() => setOpenReceiptModal(true)}
              disabled={booking.paymentStatus !== 'UNPAID'}
              type="button"
            >
              {t('bookings.upload_bank_receipt')}
            </Button>

            <Button
              className="w-full cursor-pointer rounded-full bg-forest font-semibold text-sand-50 shadow-soft transition-colors hover:bg-forest/90 disabled:opacity-50"
              variant="default"
              disabled={booking.paymentStatus !== 'UNPAID'}
              onClick={() => navigate(`/bookings/${booking._id}/payment`)}
              type="button"
            >
              {t('bookings.pay_online')}
            </Button>

            <Button
              className="w-full cursor-pointer border-charcoal/15 text-charcoal transition-colors hover:bg-charcoal/4"
              variant="outline"
              onClick={() => navigate('/dashboard/support')}
              type="button"
            >
              <Headphones className="mr-2 size-4" aria-hidden />
              {t('bookings.contact_support')}
            </Button>
          </div>

          <div className="mt-6 rounded-xl border border-charcoal/10 bg-sand-50/80 p-4 text-xs leading-relaxed text-charcoal/65">
            <p className="font-semibold text-charcoal">
              {t('bookings.need_help')}
            </p>
            <p className="mt-2">{t('bookings.need_help_tour_desc')}</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MyBookingDetailPage;
