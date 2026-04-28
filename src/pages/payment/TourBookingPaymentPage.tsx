/**
 * Trang thanh toán đơn tour (Stripe) – tương tự RoomBookingPaymentPage
 * POST /api/v1/client/payments/create-intent/tour
 */
import { Elements } from '@stripe/react-stripe-js';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CheckoutForm from './CheckoutForm';
import { stripePromise } from '@/stripe';
import { useCreateTourPaymentIntent } from '@/features/payment/hooks';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/router';
import Container from '@/components/Container';
import { MainLayout } from '@/layout';

const TourBookingPaymentPage = () => {
  const { id: tourBookingId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    mutate: createIntent,
    data: paymentIntentData,
    isPending,
    isError,
    error,
  } = useCreateTourPaymentIntent();

  useEffect(() => {
    if (tourBookingId) {
      createIntent({ tourBookingId });
    }
  }, [tourBookingId, createIntent]);

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
            <h1 className="text-2xl font-bold text-destructive">
              {t('payment_page.error_title')}
            </h1>
            <p className="text-muted-foreground">
              {error?.message || t('payment_page.error_message')}
            </p>
            <Button onClick={() => navigate(ROUTES.DASHBOARD.TOUR_BOOKINGS)}>
              {t('payment_page.back_to_tour_bookings')}
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
            <h1 className="text-2xl font-bold">
              {t('payment_page.no_intent_title')}
            </h1>
            <p className="text-muted-foreground">
              {t('payment_page.no_intent_message')}
            </p>
            <Button onClick={() => navigate(ROUTES.DASHBOARD.TOUR_BOOKINGS)}>
              {t('payment_page.back_to_tour_bookings')}
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
            <CheckoutForm bookingId={tourBookingId ?? ''} type="tour" />
          </Elements>
        </div>
      </Container>
    </MainLayout>
  );
};

export default TourBookingPaymentPage;
