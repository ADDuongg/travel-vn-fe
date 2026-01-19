import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { useGetBookingById } from '@/features/booking/hooks';

const MyBookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openReceiptModal, setOpenReceiptModal] = useState(false);

  const { data: booking, isLoading } = useGetBookingById(id);

  if (isLoading) {
    return <div className="p-6">Loading booking...</div>;
  }

  if (!booking) {
    return <div className="p-6">Booking not found</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT CONTENT */}
      <div className="lg:col-span-2 space-y-10">
        {/* ORDER SUMMARY */}
        <section>
          <h3 className="text-blue-600 font-semibold mb-4">ORDER SUMMARY</h3>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Booking ID:</span> #
              {booking._id.slice(-6)}
            </p>

            <p>
              <span className="font-medium">Booking Date:</span>{' '}
              {dayjs(booking.createdAt).format('DD/MM/YYYY')}
            </p>
          </div>
        </section>

        {/* ROOMS */}
        <section>
          <h3 className="text-blue-600 font-semibold mb-4">ROOM DETAILS</h3>

          <div className="space-y-4">
            {booking.rooms.map((r: any, index: number) => (
              <div key={index} className="flex gap-4 border rounded-lg p-4">
                {r.room.thumbnail?.url && (
                  <img
                    src={r.room.thumbnail.url}
                    alt={r.room.slug}
                    className="w-24 h-16 object-cover rounded"
                  />
                )}

                <div className="text-sm space-y-1">
                  <p className="font-medium">{r.room.slug}</p>

                  <p>
                    Stay: {dayjs(r.checkIn).format('DD/MM/YYYY')} →{' '}
                    {dayjs(r.checkOut).format('DD/MM/YYYY')}
                  </p>

                  <p>Room size: {r.room.roomSize} m²</p>
                  <p>Max guests: {r.room.maxGuests}</p>

                  <p>
                    Guests: Adult {r.guests.adults} – Children{' '}
                    {r.guests.children}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICE */}
        <section>
          <h3 className="text-blue-600 font-semibold mb-4">PRICE BREAKDOWN</h3>

          <div className="flex justify-between text-sm">
            <span>Total</span>
            <span className="font-semibold">
              {booking.amount.toLocaleString()} {booking.currency}
            </span>
          </div>
        </section>
      </div>

      {/* RIGHT SIDEBAR */}
      <aside className="border rounded-xl p-6 space-y-6">
        <div>
          <h3 className="text-blue-600 font-semibold mb-2">ORDER STATUS</h3>

          <p
            className={
              booking.status === 'PENDING'
                ? 'text-green-600 font-medium'
                : booking.status === 'CANCELLED'
                ? 'text-red-500 font-medium'
                : 'text-gray-600'
            }
          >
            {booking.status}
          </p>
        </div>

        <div>
          <p className="font-medium mb-2">Bank Payment Receipt</p>

          <Button
            className="w-full mb-3"
            onClick={() => setOpenReceiptModal(true)}
            disabled={booking.paymentStatus !== 'UNPAID'}
          >
            SUBMIT PAYMENT RECEIPT
          </Button>

          <Button
            className="w-full"
            variant="success"
            disabled={booking.paymentStatus !== 'UNPAID'}
            onClick={() => navigate(`/payment/${booking._id}`)}
          >
            MAKE AN ONLINE PAYMENT
          </Button>
        </div>
      </aside>
    </div>
  );
};

export default MyBookingDetailPage;
