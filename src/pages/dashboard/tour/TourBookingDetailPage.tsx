/**
 * Chi tiết đơn tour – layout đồng bộ Room Booking Detail (UI UX Pro Max kit)
 * GET my-bookings/:code, PATCH cancel, POST :id/receipt (bank receipt)
 */
import React, { useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  useMyTourBookingByCodeQuery,
  useCancelTourBookingMutation,
  useUploadTourBookingReceiptMutation,
} from '@/features/tours/hooks';
import { fmtDate, getPaymentExpireAt } from '@/utils';
import { useCountdown } from '@/hooks/useCountdown';
import type {
  TourBookingDetail,
  TourBookingTourRef,
} from '@/features/tours/types';
import {
  ArrowLeft,
  CalendarRange,
  CreditCard,
  Loader2,
  MapPin,
  Receipt,
  Upload,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const TOUR_STATUS_KEYS: Record<string, string> = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

const statusStyle: Record<string, string> = {
  PENDING:
    'bg-amber-50 text-amber-800 ring-1 ring-amber-200/90 shadow-sm shadow-amber-100/50',
  CONFIRMED:
    'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/90 shadow-sm shadow-emerald-100/50',
  PAID: 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200/90 shadow-sm font-semibold',
  COMPLETED:
    'bg-[#EFF6FF] text-[#1E40AF] ring-1 ring-[#3B82F6]/25 shadow-sm font-semibold',
  CANCELLED:
    'bg-rose-50 text-rose-800 ring-1 ring-rose-200/90 shadow-sm shadow-rose-100/50',
};

const paymentStyle: Record<string, string> = {
  unpaid: 'bg-amber-50 text-amber-900 ring-1 ring-amber-200/80 font-semibold',
  partial: 'bg-amber-50 text-amber-900 ring-1 ring-amber-200/80 font-semibold',
  paid: 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200/80 font-semibold',
};

const cardClass =
  'rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6';

function getTourName(tourId: TourBookingDetail['tourId']): string {
  if (!tourId) return '—';
  if (typeof tourId === 'string') return '—';
  const tr = (tourId as TourBookingTourRef).translations;
  if (tr?.vi?.name) return tr.vi.name;
  if (tr?.en?.name) return tr.en.name;
  return (tourId as TourBookingTourRef).code ?? '—';
}

function getTourId(tourId: TourBookingDetail['tourId']): string | null {
  if (!tourId || typeof tourId === 'string') return null;
  return (tourId as TourBookingTourRef)._id ?? null;
}

function getTourDuration(tourId: TourBookingDetail['tourId']): string | null {
  if (!tourId || typeof tourId === 'string') return null;
  const d = (tourId as TourBookingTourRef).duration;
  if (!d) return null;
  if (d.days != null && d.nights != null) return `${d.days}D ${d.nights}N`;
  if (d.days) return `${d.days} day(s)`;
  return null;
}

function getTourThumbnailUrl(
  tourId: TourBookingDetail['tourId'],
): string | null {
  if (!tourId || typeof tourId === 'string') return null;
  return (tourId as TourBookingTourRef).thumbnail?.url ?? null;
}

const TourBookingDetailPage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const {
    data: booking,
    isLoading,
    isError,
  } = useMyTourBookingByCodeQuery(code);
  const cancelMutation = useCancelTourBookingMutation();
  const uploadReceiptMutation = useUploadTourBookingReceiptMutation();

  const canCancel =
    booking && (booking.status === 'PENDING' || booking.status === 'CONFIRMED');

  const canPay =
    booking &&
    (booking.status === 'PENDING' || booking.status === 'CONFIRMED') &&
    (booking.paidAmount ?? 0) < booking.totalAmount;

  const canUploadReceipt =
    booking &&
    booking.status !== 'PAID' &&
    booking.status !== 'CANCELLED' &&
    (booking.paidAmount ?? 0) < booking.totalAmount;

  const paymentExpireAt =
    booking && canPay ? getPaymentExpireAt(booking.createdAt) : undefined;
  const paymentRemaining = useCountdown(paymentExpireAt);

  const handleCancel = async () => {
    if (!booking?._id || !window.confirm(t('bookings.confirm_cancel'))) return;
    try {
      await cancelMutation.mutateAsync({ id: booking._id });
      navigate(ROUTES.DASHBOARD.TOUR_BOOKINGS);
    } catch {
      // error already handled by mutation
    }
  };

  const handleReceiptFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !booking?._id) return;
    e.target.value = '';
    try {
      await uploadReceiptMutation.mutateAsync({ id: booking._id, file });
    } catch {
      // error already handled by mutation
    }
  };

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

  if (isError || !booking) {
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
        <Button className="mt-4 cursor-pointer" variant="outline" asChild>
          <Link to={ROUTES.DASHBOARD.TOUR_BOOKINGS}>
            {t('bookings.back_to_my_bookings')}
          </Link>
        </Button>
      </div>
    );
  }

  const tourId = getTourId(booking.tourId);
  const tourDetailUrl = tourId
    ? ROUTES.TOUR.DETAIL.replace(':id', tourId)
    : null;
  const durationStr = getTourDuration(booking.tourId);
  const thumbnailUrl = getTourThumbnailUrl(booking.tourId);
  const balanceDue = Math.max(
    0,
    booking.totalAmount - (booking.paidAmount ?? 0),
  );

  const paymentStatusLabel =
    (booking.paidAmount ?? 0) >= booking.totalAmount
      ? t('bookings.payment_paid')
      : (booking.paidAmount ?? 0) > 0
        ? t('bookings.payment_partial')
        : t('bookings.payment_unpaid');
  const paymentStatusKey =
    (booking.paidAmount ?? 0) >= booking.totalAmount
      ? 'paid'
      : (booking.paidAmount ?? 0) > 0
        ? 'partial'
        : 'unpaid';

  const statusLabel = t(
    `bookings.status_${TOUR_STATUS_KEYS[booking.status] ?? booking.status.toLowerCase()}`,
  );

  return (
    <div className="space-y-6 font-dashboard-sans">
      <Link
        to={ROUTES.DASHBOARD.TOUR_BOOKINGS}
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#2563EB] transition-colors duration-200 hover:text-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/40 focus-visible:ring-offset-2"
      >
        <ArrowLeft className="size-4 shrink-0" aria-hidden />
        {t('bookings.back_to_my_bookings')}
      </Link>

      <header className={cn(cardClass, 'border-t-4 border-t-[#1E3A8A]')}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t('bookings.detail_title')}
            </p>
            <h1 className="font-mono text-2xl font-bold tracking-tight text-[#1E3A8A] sm:text-3xl">
              {booking.bookingCode}
            </h1>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1">
                <CalendarRange className="size-4 text-[#3B82F6]" aria-hidden />
                {t('bookings.created_at')} {fmtDate(booking.createdAt)}
              </span>
              {durationStr ? (
                <>
                  <span className="text-slate-400">·</span>
                  <span>{durationStr}</span>
                </>
              ) : null}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="cursor-pointer border-slate-200 text-[#1E3A8A] shadow-sm hover:bg-slate-50"
              asChild
            >
              <Link to={ROUTES.DASHBOARD.TOUR_BOOKINGS}>
                {t('bookings.back_to_list')}
              </Link>
            </Button>
            {canPay && (
              <Button
                className="cursor-pointer bg-[#CA8A04] font-semibold text-white shadow-md hover:bg-[#B45309]"
                asChild
              >
                <Link
                  to={ROUTES.TOUR_BOOKING_PAYMENT.replace(':id', booking._id)}
                >
                  <CreditCard className="mr-2 size-4" aria-hidden />
                  {t('bookings.pay_online')}
                </Link>
              </Button>
            )}
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
                <p className="font-mono text-lg font-semibold text-slate-900">
                  {booking.bookingCode}
                </p>
                <p className="text-sm text-slate-600">
                  {t('bookings.created_at')} {fmtDate(booking.createdAt)}
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
              <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {t('bookings.payment')}
                </p>
                <p
                  className={cn(
                    'mt-2 inline-flex rounded-full px-2.5 py-1 text-xs',
                    paymentStyle[paymentStatusKey] ??
                      'bg-slate-200 text-slate-800',
                  )}
                >
                  {paymentStatusLabel}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {t('bookings.total_amount')}
                </p>
                <p className="mt-2 text-base font-bold tabular-nums text-[#1E40AF]">
                  {booking.totalAmount.toLocaleString()} {booking.currency}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4">
                <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  <User className="size-3.5" aria-hidden />
                  {t('bookings.contact')}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {booking.guest.fullName}
                </p>
                <p className="text-xs text-slate-600 break-all">
                  {booking.guest.email}
                </p>
              </div>
            </div>

            {canPay &&
              (paymentRemaining ? (
                <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
                  {t('bookings.pay_within')}{' '}
                  <span className="font-semibold tabular-nums text-amber-800">
                    {paymentRemaining.minutes}:
                    {paymentRemaining.seconds.toString().padStart(2, '0')}
                  </span>
                </div>
              ) : (
                <div className="mt-4">
                  <Badge variant="destructive" className="font-medium">
                    {t('bookings.payment_expired_desc')}
                  </Badge>
                </div>
              ))}

            {booking.cancelledAt && (
              <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50/80 p-3 text-sm text-rose-900">
                {t('bookings.cancelled_at')}: {fmtDate(booking.cancelledAt)}
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

          {/* Tour & departure */}
          <section className={cardClass}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold text-[#1E3A8A]">
                {t('bookings.tour_and_departure')}
              </h2>
              <p className="text-xs font-medium text-slate-500">1 tour</p>
            </div>

            <div className="mt-5 flex flex-col gap-4 rounded-xl border border-slate-200/90 p-4 transition-all duration-200 hover:border-[#3B82F6]/35 hover:shadow-md motion-reduce:transition-none sm:flex-row">
              <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-[#F8FAFC] sm:h-auto sm:w-40">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={getTourName(booking.tourId)}
                    className="h-full min-h-[7rem] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[7rem] w-full items-center justify-center bg-gradient-to-br from-[#EEF2FF] to-[#F8FAFC]">
                    <MapPin className="h-10 w-10 text-[#94A3B8]" aria-hidden />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  {tourDetailUrl ? (
                    <Link
                      to={tourDetailUrl}
                      className="text-base font-semibold text-[#2563EB] underline-offset-2 transition-colors hover:text-[#1D4ED8] hover:underline"
                    >
                      {getTourName(booking.tourId)}
                    </Link>
                  ) : (
                    <p className="text-base font-semibold text-slate-900">
                      {getTourName(booking.tourId)}
                    </p>
                  )}
                  {durationStr && (
                    <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-semibold text-[#1E40AF] ring-1 ring-[#3B82F6]/20">
                      {durationStr}
                    </span>
                  )}
                </div>
                <p className="tabular-nums text-slate-700">
                  {t('bookings.departure_date')}:{' '}
                  {fmtDate(booking.departureDate)}
                </p>
                <div className="flex flex-wrap gap-3 text-slate-600">
                  <span>
                    {booking.adults} {t('bookings.adults_label')}
                    {(booking.children ?? 0) > 0 &&
                      ` · ${booking.children} ${t('bookings.children_label')}`}
                    {(booking.infants ?? 0) > 0 &&
                      ` · ${booking.infants} ${t('bookings.infants')}`}
                  </span>
                </div>
                <p className="text-xs text-slate-500 sm:text-sm">
                  {booking.guest.fullName} · {booking.guest.email}
                  {booking.guest.phone && ` · ${booking.guest.phone}`}
                </p>
                {booking.guest.note && (
                  <p className="text-sm italic text-slate-600">
                    {booking.guest.note}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Price breakdown */}
          <section className={cardClass}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold text-[#1E3A8A]">
                {t('bookings.price_breakdown')}
              </h2>
              <p className="text-xs font-medium text-slate-500">
                {booking.currency}
              </p>
            </div>

            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <div className="flex flex-col justify-between gap-1 border-b border-slate-100 py-2 sm:flex-row sm:items-center">
                <span>
                  {getTourName(booking.tourId)} · {booking.adults}{' '}
                  {t('bookings.adults_label')}
                  {(booking.children ?? 0) > 0 &&
                    `, ${booking.children} ${t('bookings.children_label')}`}
                  {(booking.infants ?? 0) > 0 &&
                    `, ${booking.infants} ${t('bookings.infants')}`}
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-[#1E40AF]">
                  {booking.totalAmount.toLocaleString()} {booking.currency}
                </span>
              </div>
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                <span className="font-medium text-slate-800">
                  {t('bookings.tour_total')}
                </span>
                <span className="font-semibold tabular-nums text-[#1E40AF]">
                  {booking.totalAmount.toLocaleString()} {booking.currency}
                </span>
              </div>
              {booking.depositAmount > 0 && (
                <div className="flex flex-col justify-between gap-1 text-slate-600 sm:flex-row sm:items-center">
                  <span>{t('bookings.deposit_required')}</span>
                  <span className="tabular-nums">
                    {booking.depositAmount.toLocaleString()} {booking.currency}
                  </span>
                </div>
              )}
              <div className="flex flex-col justify-between gap-1 text-slate-600 sm:flex-row sm:items-center">
                <span>{t('bookings.payment_paid')}</span>
                <span className="tabular-nums">
                  {(booking.paidAmount ?? 0).toLocaleString()}{' '}
                  {booking.currency}
                </span>
              </div>
              <div className="flex flex-col justify-between gap-1 text-slate-500 sm:flex-row sm:items-center">
                <span>{t('bookings.taxes_included')}</span>
                <span>{t('bookings.taxes_included_value')}</span>
              </div>
              <div className="flex flex-col justify-between gap-1 border-t border-slate-200 pt-4 text-base font-bold text-slate-900 sm:flex-row sm:items-center">
                <span>{t('bookings.amount_due')}</span>
                <span className="tabular-nums text-[#1E3A8A]">
                  {balanceDue.toLocaleString()} {booking.currency}
                </span>
              </div>
            </div>
          </section>

          {/* Bank receipt */}
          <section className={cardClass}>
            <h2 className="flex items-center gap-2 text-base font-semibold text-[#1E3A8A]">
              <Receipt className="size-5 text-[#3B82F6]" aria-hidden />
              {t('bookings.bank_receipt')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {t('bookings.bank_receipt_desc')}
            </p>
            {booking.bankReceipt?.url ? (
              <div className="mt-4 space-y-3">
                <div className="inline-block max-w-xs overflow-hidden rounded-xl border border-slate-200/90 bg-[#F8FAFC]">
                  <a
                    href={booking.bankReceipt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-pointer transition-opacity hover:opacity-90"
                  >
                    <img
                      src={booking.bankReceipt.url}
                      alt="Bank receipt"
                      className="h-40 w-full object-cover"
                    />
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                      booking.bankReceipt.verified
                        ? 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200'
                        : 'bg-amber-50 text-amber-900 ring-1 ring-amber-200',
                    )}
                  >
                    {booking.bankReceipt.verified
                      ? t('bookings.receipt_verified')
                      : t('bookings.receipt_pending')}
                  </span>
                  {booking.bankReceipt.uploadedAt && (
                    <span className="text-xs text-slate-500">
                      {t('bookings.receipt_uploaded_at')}{' '}
                      {fmtDate(booking.bankReceipt.uploadedAt)}
                    </span>
                  )}
                </div>
                {canUploadReceipt && (
                  <p className="text-xs text-slate-500">
                    {t('bookings.receipt_replace_hint')}
                  </p>
                )}
              </div>
            ) : null}
            {canUploadReceipt && (
              <div className="mt-4">
                <input
                  ref={receiptInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleReceiptFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer gap-2 border-[#1E3A8A]/25 text-[#1E3A8A] hover:bg-[#1E3A8A]/5"
                  onClick={() => receiptInputRef.current?.click()}
                  disabled={uploadReceiptMutation.isPending}
                >
                  <Upload className="size-4" aria-hidden />
                  {uploadReceiptMutation.isPending
                    ? t('bookings.uploading_receipt')
                    : t('bookings.upload_bank_receipt')}
                </Button>
              </div>
            )}
          </section>
        </div>

        <aside
          className={cn(cardClass, 'h-fit lg:sticky lg:top-24 lg:self-start')}
        >
          <div className="space-y-3 border-b border-slate-100 pb-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-[#1E3A8A]">
                {t('bookings.next_step')}
              </h3>
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-[11px] font-semibold',
                  paymentStyle[paymentStatusKey] ??
                    'bg-slate-200 text-slate-800',
                )}
              >
                {paymentStatusLabel}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              {t('bookings.next_step_tour_desc_with_receipt')}
            </p>
          </div>

          <div className="space-y-3 pt-5">
            {canUploadReceipt && (
              <Button
                className="w-full cursor-pointer border-[#1E3A8A]/25 text-[#1E3A8A] hover:bg-[#1E3A8A]/5"
                variant="outline"
                type="button"
                onClick={() => receiptInputRef.current?.click()}
                disabled={uploadReceiptMutation.isPending}
              >
                {uploadReceiptMutation.isPending
                  ? t('bookings.uploading_receipt')
                  : t('bookings.upload_bank_receipt')}
              </Button>
            )}
            {canPay && (
              <Button
                className="w-full cursor-pointer bg-[#CA8A04] font-semibold text-white shadow-md hover:bg-[#B45309]"
                variant="default"
                asChild
              >
                <Link
                  to={ROUTES.TOUR_BOOKING_PAYMENT.replace(':id', booking._id)}
                >
                  <CreditCard className="mr-2 size-4" aria-hidden />
                  {t('bookings.pay_online')}
                </Link>
              </Button>
            )}
            {tourDetailUrl && (
              <Button
                className="w-full cursor-pointer border-slate-200 text-[#1E3A8A] hover:bg-slate-50"
                variant="outline"
                asChild
              >
                <Link to={tourDetailUrl}>
                  {t('bookings.view_tour_details')}
                </Link>
              </Button>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-slate-200/90 bg-[#F8FAFC] p-4 text-xs leading-relaxed text-slate-600">
            <p className="font-semibold text-[#1E3A8A]">
              {t('bookings.need_help')}
            </p>
            <p className="mt-2">{t('bookings.need_help_tour_desc')}</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TourBookingDetailPage;
