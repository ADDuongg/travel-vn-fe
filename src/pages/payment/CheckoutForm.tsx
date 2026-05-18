import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/router';
import { ResponsiveH1, P } from '@/components/ui/typography';

export type CheckoutFormType = 'room' | 'tour';

interface CheckoutFormProps {

  bookingId: string;
  type?: CheckoutFormType;
}

export default function CheckoutForm({
  bookingId,
  type = 'room',
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isTour = type === 'tour';
  const returnUrl = isTour
    ? `${window.location.origin}${ROUTES.TOUR_PAYMENT_RESULT}?tourBookingId=${bookingId}`
    : `${window.location.origin}${ROUTES.BOOKING_PAYMENT_RESULT}?bookingId=${bookingId}`;
  const cancelPath = isTour
    ? ROUTES.DASHBOARD.TOUR_BOOKINGS
    : ROUTES.DASHBOARD.ROOM_BOOKINGS;
  const successRedirect = isTour
    ? `${ROUTES.TOUR_PAYMENT_RESULT}?tourBookingId=${bookingId}&status=success`
    : `${ROUTES.BOOKING_PAYMENT_RESULT}?bookingId=${bookingId}&status=success`;

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
        return_url: returnUrl,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || t('payment_page.error_default'));
      setIsProcessing(false);
    } else {
      navigate(successRedirect);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <ResponsiveH1 className="font-dm-serif-display mb-2">
          {t('payment_page.title')}
        </ResponsiveH1>
        <P className="text-muted-foreground">
          {t('payment_page.subtitle')}
        </P>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border rounded-lg p-6 bg-card">
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </div>

        {errorMessage && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">{errorMessage}</p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(cancelPath)}
            disabled={isProcessing}
            className="flex-1"
          >
            {t('payment_page.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={!stripe || !elements || isProcessing}
            loading={isProcessing}
            className="flex-1"
          >
            {isProcessing ? t('payment_page.processing') : t('payment_page.pay_now')}
          </Button>
        </div>
      </form>
    </div>
  );
}

