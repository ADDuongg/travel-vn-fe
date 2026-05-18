import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { ResponsiveH1, P } from '@/components/ui/typography';
import { ROUTES } from '@/constants/router';
import { usePaymentStatus } from '@/features/payment/hooks';
import { useGetBookingById } from '@/features/booking/hooks';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const bookingId = searchParams.get('bookingId');
  const status = searchParams.get('status');

  const { data: paymentStatus, isLoading: isLoadingPayment } = usePaymentStatus(
    bookingId || undefined,
  );
  const { data: booking, isLoading: isLoadingBooking } = useGetBookingById(
    bookingId || undefined,
  );

  useEffect(() => {

    if (!bookingId) {
      navigate(ROUTES.DASHBOARD.ROOM_BOOKINGS);
    }
  }, [bookingId, navigate]);

  const isLoading = isLoadingPayment || isLoadingBooking;

  const isSuccess =
    status === 'success' ||
    paymentStatus?.status === 'SUCCEEDED' ||
    booking?.paymentStatus === 'PAID';
  const isFailed =
    paymentStatus?.status === 'FAILED' || paymentStatus?.status === 'CANCELLED';
  const isPending = paymentStatus?.status === 'PENDING';

  console.log('isSuccess', isSuccess);
  console.log('isFailed', isFailed);
  console.log('isPending', isPending);

  if (isLoading) {
    return (
      <MainLayout>
        <Container className="py-20">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
            <P>{t('payment_result.checking_status')}</P>
          </div>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container className="py-20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          {isSuccess && (
            <>
              <CheckCircle2 className="w-20 h-20 mx-auto text-emerald-600 dark:text-emerald-500" />
              <ResponsiveH1 className="font-dm-serif-display text-emerald-600 dark:text-emerald-500">
                {t('payment_result.success_title')}
              </ResponsiveH1>
              <P className="text-muted-foreground">
                {t('payment_result.success_message')}
              </P>
              {booking && (
                <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2">
                  <p>
                    <span className="font-medium">Booking ID:</span> #
                    {booking._id.slice(-6)}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t('bookings.total_amount')}:
                    </span>{' '}
                    {booking.amount.toLocaleString()} {booking.currency}
                  </p>
                </div>
              )}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={() =>
                    navigate(
                      `${ROUTES.DASHBOARD.ROOM_BOOKINGS_DETAIL.replace(':id', bookingId!)}`,
                    )
                  }
                >
                  {t('payment_result.view_booking_details')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(ROUTES.DASHBOARD.ROOM_BOOKINGS)}
                >
                  {t('payment_result.my_bookings')}
                </Button>
              </div>
            </>
          )}

          {isFailed && (
            <>
              <XCircle className="w-20 h-20 mx-auto text-destructive" />
              <ResponsiveH1 className="font-dm-serif-display text-destructive">
                {t('payment_result.failed_title')}
              </ResponsiveH1>
              <P className="text-muted-foreground">
                {t('payment_result.failed_message')}
              </P>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={() =>
                    navigate(
                      `${ROUTES.BOOKING_PAYMENT.replace(':id', bookingId!)}`,
                    )
                  }
                >
                  {t('payment_result.try_again')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(ROUTES.DASHBOARD.ROOM_BOOKINGS)}
                >
                  {t('payment_page.back_to_bookings')}
                </Button>
              </div>
            </>
          )}

          {isPending && (
            <>
              <Loader2 className="w-20 h-20 mx-auto text-primary animate-spin" />
              <ResponsiveH1 className="font-dm-serif-display text-primary">
                {t('payment_result.processing_title')}
              </ResponsiveH1>
              <P className="text-muted-foreground">
                {t('payment_result.processing_message')}
              </P>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={() =>
                    navigate(
                      `${ROUTES.DASHBOARD.ROOM_BOOKINGS_DETAIL.replace(':id', bookingId!)}`,
                    )
                  }
                >
                  {t('payment_result.view_booking')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(ROUTES.DASHBOARD.ROOM_BOOKINGS)}
                >
                  {t('payment_result.my_bookings')}
                </Button>
              </div>
            </>
          )}
        </div>
      </Container>
    </MainLayout>
  );
};

export default PaymentResult;

