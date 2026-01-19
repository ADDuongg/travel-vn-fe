import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

export default function CheckoutForm({ bookingId }: { bookingId: string }) {
  const stripe = useStripe();
  const elements = useElements();

  const handlePay = async () => {
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-result?bookingId=${bookingId}`,
      },
    });

    if (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <PaymentElement />
      <button onClick={handlePay}>Pay</button>
    </>
  );
}
