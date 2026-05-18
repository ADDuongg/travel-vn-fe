import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTourBookingByCodeQuery } from '@/features/tours/hooks';
import { fmtMoney, fmtDate } from '@/utils';
import { ROUTES } from '@/constants/router';
import { Link } from 'react-router-dom';
import type { TourBookingDetail, TourBookingTourRef } from '@/features/tours/types';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PAID: 'Đã thanh toán',
  CANCELLED: 'Đã hủy',
  COMPLETED: 'Hoàn thành',
};

function getTourName(tourId: TourBookingDetail['tourId']): string {
  if (!tourId) return '—';
  if (typeof tourId === 'string') return '—';
  const t = (tourId as TourBookingTourRef).translations;
  if (t?.vi?.name) return t.vi.name;
  if (t?.en?.name) return t.en.name;
  return (tourId as TourBookingTourRef).code ?? '—';
}

const TourBookingLookupPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const codeFromUrl = searchParams.get('code') ?? '';
  const [inputCode, setInputCode] = useState(codeFromUrl);

  useEffect(() => {
    if (codeFromUrl) setInputCode(codeFromUrl);
  }, [codeFromUrl]);

  const queryCode = inputCode.trim().toUpperCase();
  const { data: booking, isLoading, isError, refetch } = useTourBookingByCodeQuery(
    queryCode || undefined,
    { enabled: queryCode.length >= 3 },
  );

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setSearchParams({ code: inputCode.trim() });
    refetch();
  };

  return (
    <MainLayout>
      <Container className="max-w-2xl py-16">
        <h1 className="text-2xl font-bold mb-6">Tra cứu đơn tour</h1>

        <form onSubmit={handleLookup} className="flex gap-2 mb-8">
          <Input
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Nhập mã đặt chỗ (vd: TB-A1B2C3D4)"
            className="flex-1"
          />
          <Button type="submit" disabled={!inputCode.trim()}>
            Tra cứu
          </Button>
        </form>

        {isLoading && queryCode && (
          <div className="text-muted-foreground">Đang tải...</div>
        )}

        {isError && queryCode && (
          <Card className="border-destructive/50">
            <CardContent className="pt-6">
              <p className="text-destructive">Không tìm thấy đơn với mã này.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Kiểm tra lại mã đặt chỗ hoặc liên hệ hỗ trợ.
              </p>
            </CardContent>
          </Card>
        )}

        {booking && !isError && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <span className="font-mono font-semibold">{booking.bookingCode}</span>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  booking.status === 'CANCELLED'
                    ? 'bg-rose-100 text-rose-800'
                    : booking.status === 'PAID' || booking.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                }`}
              >
                {STATUS_LABELS[booking.status] ?? booking.status}
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Tour</p>
                <p className="font-medium">{getTourName(booking.tourId)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ngày khởi hành</p>
                <p>{fmtDate(booking.departureDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Khách</p>
                <p>{booking.guest.fullName}</p>
                <p className="text-sm text-muted-foreground">{booking.guest.email}</p>
                {booking.guest.phone && (
                  <p className="text-sm text-muted-foreground">{booking.guest.phone}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số khách</p>
                <p>
                  {booking.adults} người lớn
                  {(booking.children ?? 0) > 0 && `, ${booking.children} trẻ em`}
                  {(booking.infants ?? 0) > 0 && `, ${booking.infants} em bé`}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng tiền</p>
                <p className="font-semibold">{fmtMoney(booking.totalAmount, booking.currency)}</p>
                {booking.depositAmount > 0 && (
                  <p className="text-sm">
                    Đặt cọc: {fmtMoney(booking.depositAmount, booking.currency)} • Đã thanh toán:{' '}
                    {fmtMoney(booking.paidAmount, booking.currency)}
                  </p>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Tạo lúc: {fmtDate(booking.createdAt)}
              </div>
              <div className="pt-2">
                <Link to={ROUTES.TOUR.INDEX} className="text-primary hover:underline">
                  ← Về danh sách tour
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {!queryCode && !booking && (
          <p className="text-muted-foreground">Nhập mã đặt chỗ và bấm Tra cứu.</p>
        )}
      </Container>
    </MainLayout>
  );
};

export default TourBookingLookupPage;

