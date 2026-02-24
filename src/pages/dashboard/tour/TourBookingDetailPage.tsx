/**
 * Chi tiết đơn tour – layout & style đồng bộ với Room Booking Detail
 * GET my-bookings/:code, PATCH cancel, POST :id/receipt (bank receipt)
 */
import { useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { useTranslation } from 'react-i18next';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import {
  useMyTourBookingByCodeQuery,
  useCancelTourBookingMutation,
  useUploadTourBookingReceiptMutation,
} from '@/features/tours/booking-hooks';
import { fmtDate, getPaymentExpireAt } from '@/utils';
import { useCountdown } from '@/hooks/useCountdown';
import type {
  TourBookingDetail,
  TourBookingTourRef,
} from '@/features/tours/booking-types';
import { MapPin, Receipt, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TOUR_STATUS_KEYS: Record<string, string> = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

const statusStyle: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  CONFIRMED: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  PAID: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  COMPLETED: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  CANCELLED: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
};

const paymentStyle: Record<string, string> = {
  unpaid: 'bg-amber-100 text-amber-800',
  partial: 'bg-amber-100 text-amber-800',
  paid: 'bg-emerald-100 text-emerald-800',
};

function getTourName(tourId: TourBookingDetail['tourId']): string {
  if (!tourId) return '—';
  if (typeof tourId === 'string') return '—';
  const tr = (tourId as TourBookingTourRef).translations;
  if (tr?.vi?.name) return tr.vi.name;
  if (tr?.en?.name) return tr.en.name;
  return (tourId as TourBookingTourRef).code ?? '—';
}

function getTourSlug(tourId: TourBookingDetail['tourId']): string | null {
  if (!tourId || typeof tourId === 'string') return null;
  return (tourId as TourBookingTourRef).slug ?? null;
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

  const paymentExpireAt = booking && canPay ? getPaymentExpireAt(booking.createdAt) : undefined;
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
      <Container className="py-8">
        <div className="space-y-4">
          <div className="h-6 w-48 rounded bg-slate-200 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-44 rounded-xl bg-slate-200 animate-pulse" />
              <div className="h-56 rounded-xl bg-slate-200 animate-pulse" />
              <div className="h-52 rounded-xl bg-slate-200 animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="h-72 rounded-xl bg-slate-200 animate-pulse" />
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (isError || !booking) {
    return (
      <Container className="py-8">
        <p className="text-sm text-slate-500">
          {t('bookings.booking_not_found')}
        </p>
        <Button className="mt-4" variant="outline" asChild>
          <Link to={ROUTES.DASHBOARD.TOUR_BOOKINGS}>
            {t('bookings.back_to_my_bookings')}
          </Link>
        </Button>
      </Container>
    );
  }

  const slug = getTourSlug(booking.tourId);
  const tourDetailUrl = slug ? ROUTES.TOUR.DETAIL.replace(':slug', slug) : null;
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

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Link
          to={ROUTES.DASHBOARD.TOUR_BOOKINGS}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {t('bookings.back_to_my_bookings')}
        </Link>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-slate-500 tracking-wide">
            {t('bookings.detail_title')}
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            {booking.bookingCode}
          </h2>
          <p className="text-sm text-slate-500">
            {t('bookings.created_at')} {fmtDate(booking.createdAt)}
            {durationStr && ` · ${durationStr}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={ROUTES.DASHBOARD.TOUR_BOOKINGS}>
              {t('bookings.back_to_list')}
            </Link>
          </Button>
          {canPay && (
            <Button variant="default" asChild>
              <Link
                to={ROUTES.TOUR_BOOKING_PAYMENT.replace(':id', booking._id)}
              >
                {t('bookings.pay_online')}
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Order summary, Tour & stay, Price breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order summary */}
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {t('bookings.order_summary')}
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {booking.bookingCode}
                </p>
                <p className="text-sm text-slate-500">
                  {t('bookings.created_at')} {fmtDate(booking.createdAt)}
                </p>
              </div>
              <div
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[booking.status] ?? 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'}`}
              >
                {t(
                  `bookings.status_${TOUR_STATUS_KEYS[booking.status] ?? booking.status.toLowerCase()}`,
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-slate-500">{t('bookings.payment')}</p>
                <p
                  className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${paymentStyle[paymentStatusKey] ?? 'bg-slate-200 text-slate-700'}`}
                >
                  {paymentStatusLabel}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-slate-500">{t('bookings.total_amount')}</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {booking.totalAmount.toLocaleString()} {booking.currency}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-slate-500">{t('bookings.contact')}</p>
                <p className="mt-1 text-slate-900">{booking.guest.fullName}</p>
                <p className="text-slate-500">{booking.guest.email}</p>
              </div>
            </div>

            {canPay &&
              (paymentRemaining ? (
                <div className="text-xs text-muted-foreground mt-4">
                  {t('bookings.pay_within')}{' '}
                  <span className="font-medium text-amber-600">
                    {paymentRemaining.minutes}:
                    {paymentRemaining.seconds.toString().padStart(2, '0')}
                  </span>
                </div>
              ) : (
                <div className="mt-4">
                  <Badge variant="destructive">
                    {t('bookings.payment_expired_desc')}
                  </Badge>
                </div>
              ))}

            {booking.cancelledAt && (
              <div className="mt-4 text-sm text-muted-foreground">
                {t('bookings.cancelled_at')}: {fmtDate(booking.cancelledAt)}
                {booking.cancelReason && ` — ${booking.cancelReason}`}
              </div>
            )}
            {canCancel && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending
                    ? t('bookings.cancelling')
                    : t('bookings.cancel_booking')}
                </Button>
              </div>
            )}
          </section>

          {/* Tour & departure (giống Rooms & stay) */}
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                {t('bookings.tour_and_departure')}
              </h3>
              <p className="text-xs text-slate-500">1 tour</p>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-4 rounded-lg border p-4 hover:border-blue-200 hover:shadow-sm transition">
              <div className="w-full sm:w-36 h-28 shrink-0 overflow-hidden rounded-md bg-slate-100">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={getTourName(booking.tourId)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                    <MapPin className="h-10 w-10 text-slate-500" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  {tourDetailUrl ? (
                    <Link
                      to={tourDetailUrl}
                      className="text-base font-semibold text-slate-900 hover:text-primary hover:underline"
                    >
                      {getTourName(booking.tourId)}
                    </Link>
                  ) : (
                    <p className="text-base font-semibold text-slate-900">
                      {getTourName(booking.tourId)}
                    </p>
                  )}
                  {durationStr && (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-semibold text-blue-700">
                      {durationStr}
                    </span>
                  )}
                </div>
                <p className="text-slate-600">
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
                <p className="text-slate-500">
                  {booking.guest.fullName} · {booking.guest.email}
                  {booking.guest.phone && ` · ${booking.guest.phone}`}
                </p>
                {booking.guest.note && (
                  <p className="text-slate-500 italic">
                    Note: {booking.guest.note}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Price breakdown */}
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                {t('bookings.price_breakdown')}
              </h3>
              <p className="text-xs text-slate-500">
                Currency: {booking.currency}
              </p>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>
                  {getTourName(booking.tourId)} · {booking.adults}{' '}
                  {t('bookings.adults_label')}
                  {(booking.children ?? 0) > 0 &&
                    `, ${booking.children} ${t('bookings.children_label')}`}
                  {(booking.infants ?? 0) > 0 &&
                    `, ${booking.infants} ${t('bookings.infants')}`}
                </span>
                <span className="font-medium">
                  {booking.totalAmount.toLocaleString()} {booking.currency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('bookings.tour_total')}</span>
                <span className="font-medium">
                  {booking.totalAmount.toLocaleString()} {booking.currency}
                </span>
              </div>
              {booking.depositAmount > 0 && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>{t('bookings.deposit_required')}</span>
                  <span>
                    {booking.depositAmount.toLocaleString()} {booking.currency}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-600">
                <span>{t('bookings.payment_paid')}</span>
                <span>
                  {(booking.paidAmount ?? 0).toLocaleString()}{' '}
                  {booking.currency}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>{t('bookings.taxes_included')}</span>
                <span>{t('bookings.taxes_included_value')}</span>
              </div>
              <div className="border-t pt-3 flex items-center justify-between text-base font-semibold text-slate-900">
                <span>{t('bookings.amount_due')}</span>
                <span>
                  {balanceDue.toLocaleString()} {booking.currency}
                </span>
              </div>
            </div>
          </section>

          {/* Bank receipt (ảnh chuyển khoản) – style giống Room */}
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-slate-500" />
                {t('bookings.bank_receipt')}
              </h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {t('bookings.bank_receipt_desc')}
            </p>
            {booking.bankReceipt?.url ? (
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border overflow-hidden bg-slate-50 inline-block max-w-xs">
                  <a
                    href={booking.bankReceipt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={booking.bankReceipt.url}
                      alt="Bank receipt"
                      className="h-40 w-full object-cover hover:opacity-90 transition"
                    />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      booking.bankReceipt.verified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
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
                  onClick={() => receiptInputRef.current?.click()}
                  disabled={uploadReceiptMutation.isPending}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {uploadReceiptMutation.isPending
                    ? t('bookings.uploading_receipt')
                    : t('bookings.upload_bank_receipt')}
                </Button>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT: Next step & Need help */}
        <aside className="rounded-xl border bg-white p-5 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                {t('bookings.next_step')}
              </h3>
              <span
                className={`rounded-full px-2 py-1 text-[11px] font-semibold ${paymentStyle[paymentStatusKey] ?? 'bg-slate-200 text-slate-700'}`}
              >
                {paymentStatusLabel}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              {t('bookings.next_step_tour_desc_with_receipt')}
            </p>
          </div>

          <div className="space-y-3">
            {canUploadReceipt && (
              <Button
                className="w-full"
                variant="outline"
                onClick={() => receiptInputRef.current?.click()}
                disabled={uploadReceiptMutation.isPending}
              >
                {uploadReceiptMutation.isPending
                  ? t('bookings.uploading_receipt')
                  : t('bookings.upload_bank_receipt')}
              </Button>
            )}
            {canPay && (
              <Button className="w-full" variant="default" asChild>
                <Link
                  to={ROUTES.TOUR_BOOKING_PAYMENT.replace(':id', booking._id)}
                >
                  {t('bookings.pay_online')}
                </Link>
              </Button>
            )}
            {/*  {canCancel && (
              <Button
                className="w-full"
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? t('bookings.cancelling') : t('bookings.cancel_booking')}
              </Button>
            )} */}
            {tourDetailUrl && (
              <Button className="w-full" variant="outline" asChild>
                <Link to={tourDetailUrl}>
                  {t('bookings.view_tour_details')}
                </Link>
              </Button>
            )}
          </div>

          <div className="rounded-lg bg-slate-50 p-4 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800">
              {t('bookings.need_help')}
            </p>
            <p>{t('bookings.need_help_tour_desc')}</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TourBookingDetailPage;
