import { Elements } from '@stripe/react-stripe-js';
import { useParams } from 'react-router-dom';
import CheckoutForm from './CheckoutForm';
import { stripePromise } from '@/stripe';

const RoomBookingPaymentPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm bookingId={bookingId ?? ''} />
    </Elements>
  );
};

export default RoomBookingPaymentPage;
