/**
 * Chi tiết đơn tour của tôi (dashboard) – GET my-bookings/:code, PATCH cancel
 * docs/FE-API-TOUR-PHASE2.md
 */
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  useMyTourBookingByCodeQuery,
  useCancelTourBookingMutation,
} from '@/features/tours/booking-hooks';
import { fmtMoney, fmtDate } from '@/utils';
import { ROUTES } from '@/constants/router';
import type { TourBookingDetail, TourBookingTourRef } from '@/features/tours/booking-types';

const TOUR_STATUS_KEYS: Record<string, string> = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
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

const TourBookingDetailPage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: booking, isLoading, isError } = useMyTourBookingByCodeQuery(code);
  const cancelMutation = useCancelTourBookingMutation();

  const canCancel =
    booking &&
    (booking.status === 'PENDING' || booking.status === 'CONFIRMED');

  const handleCancel = async () => {
    if (!booking?._id || !window.confirm(t('bookings.confirm_cancel'))) return;
    try {
      await cancelMutation.mutateAsync({ id: booking._id });
      navigate(ROUTES.DASHBOARD.TOUR_BOOKINGS);
    } catch {
      // error already handled by mutation
    }
  };

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="animate-pulse h-64 bg-muted rounded-lg" />
      </Container>
    );
  }

  if (isError || !booking) {
    return (
      <Container className="py-8">
        <p className="text-destructive">{t('bookings.not_found')}</p>
        <Link to={ROUTES.DASHBOARD.TOUR_BOOKINGS} className="text-primary hover:underline mt-2 inline-block">
          {t('bookings.back_to_my_bookings')}
        </Link>
      </Container>
    );
  }

  const slug = getTourSlug(booking.tourId);
  const tourDetailUrl = slug ? ROUTES.TOUR.DETAIL.replace(':slug', slug) : null;

  return (
    <Container className="max-w-2xl py-8">
        <div className="mb-6">
          <Link
            to={ROUTES.DASHBOARD.TOUR_BOOKINGS}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t('bookings.back_to_my_bookings')}
          </Link>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <span className="font-mono font-semibold">{booking.bookingCode}</span>
            <span
              className={`text-sm px-2 py-1 rounded ${
                booking.status === 'CANCELLED'
                  ? 'bg-rose-100 text-rose-800'
                  : booking.status === 'PAID' || booking.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
              }`}
            >
              {t(`bookings.status_${TOUR_STATUS_KEYS[booking.status] ?? booking.status.toLowerCase()}`)}
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('bookings.table_tour')}</p>
              {tourDetailUrl ? (
                <Link to={tourDetailUrl} className="font-medium text-primary hover:underline">
                  {getTourName(booking.tourId)}
                </Link>
              ) : (
                <p className="font-medium">{getTourName(booking.tourId)}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('bookings.departure_date')}</p>
              <p>{fmtDate(booking.departureDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('bookings.guest')}</p>
              <p>{booking.guest.fullName}</p>
              <p className="text-sm text-muted-foreground">{booking.guest.email}</p>
              {booking.guest.phone && (
                <p className="text-sm text-muted-foreground">{booking.guest.phone}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('bookings.pax')}</p>
              <p>
                {booking.adults} {t('bookings.adults_label')}
                {(booking.children ?? 0) > 0 && `, ${booking.children} ${t('bookings.children_label')}`}
                {(booking.infants ?? 0) > 0 && `, ${booking.infants} ${t('bookings.infants')}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('bookings.total')}</p>
              <p className="font-semibold">{fmtMoney(booking.totalAmount, booking.currency)}</p>
              {booking.depositAmount > 0 && (
                <p className="text-sm">
                  {t('bookings.deposit_paid')}: {fmtMoney(booking.depositAmount, booking.currency)} • {fmtMoney(booking.paidAmount, booking.currency)}
                </p>
              )}
            </div>
            {booking.cancelledAt && (
              <div className="text-sm text-muted-foreground">
                {t('bookings.cancelled_at')}: {fmtDate(booking.cancelledAt)}
                {booking.cancelReason && ` — ${booking.cancelReason}`}
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              {t('bookings.created_at')}: {fmtDate(booking.createdAt)}
            </div>

            {canCancel && (
              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? t('bookings.cancelling') : t('bookings.cancel_booking')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
  );
};

export default TourBookingDetailPage;
