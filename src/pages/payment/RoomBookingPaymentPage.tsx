import { Elements } from '@stripe/react-stripe-js';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import CheckoutForm from './CheckoutForm';
import { stripePromise } from '@/stripe';
import { useCreatePaymentIntent } from '@/features/payment/hooks';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/router';
import Container from '@/components/Container';
import { MainLayout } from '@/layout';

const RoomBookingPaymentPage = () => {
  const { id: bookingId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    mutate: createIntent,
    data: paymentIntentData,
    isPending,
    isError,
    error,
  } = useCreatePaymentIntent();

  useEffect(() => {
    if (bookingId) {
      createIntent({ bookingId });
    }
  }, [bookingId, createIntent]);

  if (isPending) {
    return (
      <MainLayout>
        <Container className="py-20">
          <LoadingScreen />
        </Container>
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <Container className="py-20">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-2xl font-bold text-red-600">Payment Error</h1>
            <p className="text-gray-600">
              {error?.message || 'Failed to initialize payment. Please try again.'}
            </p>
            <Button onClick={() => navigate(ROUTES.DASHBOARD.ROOM_BOOKINGS)}>
              Back to Bookings
            </Button>
          </div>
        </Container>
      </MainLayout>
    );
  }

  if (!paymentIntentData?.clientSecret) {
    return (
      <MainLayout>
        <Container className="py-20">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-2xl font-bold">No Payment Intent</h1>
            <p className="text-gray-600">
              Unable to create payment intent. Please try again.
            </p>
            <Button onClick={() => navigate(ROUTES.DASHBOARD.ROOM_BOOKINGS)}>
              Back to Bookings
            </Button>
          </div>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container className="py-20">
        <div className="max-w-2xl mx-auto">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: paymentIntentData.clientSecret,
            }}
          >
      <CheckoutForm bookingId={bookingId ?? ''} />
    </Elements>
        </div>
      </Container>
    </MainLayout>
  );
};

export default RoomBookingPaymentPage;
