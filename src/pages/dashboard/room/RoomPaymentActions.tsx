import { Button } from '@/components/ui/button';

type BookingPaymentActionsProps = {
  paymentStatus: 'UNPAID' | 'PAID' | 'EXPIRED';
  hasReceipt?: boolean;
  onUploadReceipt: () => void;
  onOnlinePayment: () => void;
};

export function BookingPaymentActions({
  paymentStatus,
  hasReceipt,
  onUploadReceipt,
  onOnlinePayment,
}: BookingPaymentActionsProps) {
  if (paymentStatus === 'PAID') {
    return <p className="text-green-600 font-medium">Payment completed</p>;
  }

  if (paymentStatus === 'EXPIRED') {
    return <p className="text-red-500 font-medium">Booking expired</p>;
  }

  return (
    <div className="space-y-4">
      {/* Bank transfer */}
      <div>
        <p className="font-semibold mb-2">Bank Payment Receipt</p>

        <Button
          className="w-full bg-blue-500 hover:bg-blue-600"
          onClick={onUploadReceipt}
        >
          SUBMIT PAYMENT RECEIPT
        </Button>

        {hasReceipt && (
          <p className="mt-2 text-sm text-gray-500">
            Receipt submitted. Waiting for confirmation.
          </p>
        )}
      </div>

      {/* Online payment */}
      <Button
        className="w-full bg-emerald-500 hover:bg-emerald-600"
        onClick={onOnlinePayment}
        disabled={hasReceipt}
      >
        MAKE AN ONLINE PAYMENT
      </Button>
    </div>
  );
}
