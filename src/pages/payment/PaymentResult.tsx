import { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
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
  const bookingId = searchParams.get('bookingId');
  const status = searchParams.get('status');

  const { data: paymentStatus, isLoading: isLoadingPayment } = usePaymentStatus(
    bookingId || undefined,
  );
  const { data: booking, isLoading: isLoadingBooking } = useGetBookingById(
    bookingId || undefined,
  );

  useEffect(() => {
    // If no bookingId in URL, redirect to bookings
    if (!bookingId) {
      navigate(ROUTES.DASHBOARD.ROOM_BOOKINGS);
    }
  }, [bookingId, navigate]);

  const isLoading = isLoadingPayment || isLoadingBooking;

  // Determine payment status
  const isSuccess =
    status === 'success' ||
    paymentStatus?.status === 'SUCCEEDED' ||
    booking?.paymentStatus === 'PAID';
  const isFailed =
    paymentStatus?.status === 'FAILED' ||
    paymentStatus?.status === 'CANCELLED';
  const isPending = paymentStatus?.status === 'PENDING';

  if (isLoading) {
    return (
      <MainLayout>
        <Container className="py-20">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <Loader2 className="w-16 h-16 mx-auto animate-spin text-blue-600" />
            <P>Checking payment status...</P>
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
              <CheckCircle2 className="w-20 h-20 mx-auto text-green-600" />
              <ResponsiveH1 className="font-dm-serif-display text-green-600">
                Payment Successful!
              </ResponsiveH1>
              <P className="text-gray-600">
                Your payment has been processed successfully. Your booking has
                been confirmed.
              </P>
              {booking && (
                <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
                  <p>
                    <span className="font-medium">Booking ID:</span> #
                    {booking._id.slice(-6)}
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span>{' '}
                    {booking.amount.toLocaleString()} {booking.currency}
                  </p>
                </div>
              )}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() =>
                    navigate(`${ROUTES.DASHBOARD.ROOM_BOOKINGS_DETAIL.replace(':id', bookingId!)}`)
                  }
                >
                  View Booking Details
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(ROUTES.DASHBOARD.ROOM_BOOKINGS)}
                >
                  My Bookings
                </Button>
              </div>
            </>
          )}

          {isFailed && (
            <>
              <XCircle className="w-20 h-20 mx-auto text-red-600" />
              <ResponsiveH1 className="font-dm-serif-display text-red-600">
                Payment Failed
              </ResponsiveH1>
              <P className="text-gray-600">
                {paymentStatus?.status === 'FAILED'
                  ? 'Your payment could not be processed. Please try again.'
                  : 'Payment was cancelled.'}
              </P>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() =>
                    navigate(`${ROUTES.BOOKING_PAYMENT.replace(':id', bookingId!)}`)
                  }
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(ROUTES.DASHBOARD.ROOM_BOOKINGS)}
                >
                  Back to Bookings
                </Button>
              </div>
            </>
          )}

          {isPending && (
            <>
              <Loader2 className="w-20 h-20 mx-auto text-blue-600 animate-spin" />
              <ResponsiveH1 className="font-dm-serif-display text-blue-600">
                Payment Processing
              </ResponsiveH1>
              <P className="text-gray-600">
                Your payment is being processed. Please wait while we confirm
                your payment.
              </P>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() =>
                    navigate(`${ROUTES.DASHBOARD.ROOM_BOOKINGS_DETAIL.replace(':id', bookingId!)}`)
                  }
                >
                  View Booking
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(ROUTES.DASHBOARD.ROOM_BOOKINGS)}
                >
                  My Bookings
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
