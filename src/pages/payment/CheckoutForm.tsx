import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/router';
import { ResponsiveH1, P } from '@/components/ui/typography';

interface CheckoutFormProps {
  bookingId: string;
}

export default function CheckoutForm({ bookingId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${ROUTES.BOOKING_PAYMENT_RESULT}?bookingId=${bookingId}`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An error occurred during payment');
      setIsProcessing(false);
    } else {
      navigate(`${ROUTES.BOOKING_PAYMENT_RESULT}?bookingId=${bookingId}&status=success`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <ResponsiveH1 className="font-dm-serif-display mb-2">
          Complete Your Payment
        </ResponsiveH1>
        <P className="text-gray-600">
          Please enter your payment details below to complete your booking.
        </P>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border rounded-lg p-6 bg-white">
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.DASHBOARD.ROOM_BOOKINGS)}
            disabled={isProcessing}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!stripe || !elements || isProcessing}
            loading={isProcessing}
            className="flex-1"
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </form>
    </div>
  );
}
