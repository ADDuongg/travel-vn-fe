import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import CustomInput from '@/components/CustomInput';
import { BsLightningFill } from 'react-icons/bs';
import { HiOutlineLockClosed } from 'react-icons/hi2';
import type { Tour } from '@/features/tours/catalog-types';
import {
  useTourAvailabilityQuery,
  useCreateTourBookingMutation,
} from '@/features/tours/booking-hooks';
import { useTourDetail } from '@/sections/tour/tour-detail/TourDetailContext';
import { useCallback, useState } from 'react';
import { fmtMoney } from '@/utils';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslation } from 'react-i18next';

type BookingFormValues = {
  departureDate: string;
  adults: string;
  children: string;
  infants: string;
  fullName: string;
  email: string;
  phone: string;
  note: string;
};

const currentMonth = () => new Date().toISOString().slice(0, 7); // YYYY-MM

const TourBookingForm = ({ tour: tourProp }: { tour?: Tour | null }) => {
  const tourFromContext = useTourDetail();
  const tour = tourProp ?? tourFromContext;
  const authUser = useAuthStore((s) => s.authUser);
  const { t } = useTranslation();

  const [month, setMonth] = useState(currentMonth());
  const [bookingSuccess, setBookingSuccess] = useState<{
    bookingCode: string;
    bookingId: string;
  } | null>(null);

  const { data: availability = [], isLoading: loadingAvailability } =
    useTourAvailabilityQuery(tour?._id, month, { enabled: !!tour?._id });

  const createBooking = useCreateTourBookingMutation();

  const methods = useForm<BookingFormValues>({
    defaultValues: {
      departureDate: '',
      adults: '1',
      children: '0',
      infants: '0',
      fullName: '',
      email: '',
      phone: '',
      note: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = methods;

  const selectableDates = availability.filter(
    (d) =>
      d.status !== 'FULL' && d.status !== 'CANCELLED' && d.availableSlots > 0,
  );

  const dateOptions = selectableDates.map((d) => ({
    label: `${d.departureDate} — ${d.availableSlots} chỗ • ${d.specialPrice != null ? fmtMoney(d.specialPrice) : 'Giá gốc'}`,
    value: d.departureDate,
  }));

  const maxGuests = tour?.capacity?.maxGuests ?? 20;
  const adultOptions = Array.from({ length: maxGuests }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1),
  }));
  const childOptions = Array.from({ length: 11 }, (_, i) => ({
    label: String(i),
    value: String(i),
  }));

  const onSubmit = useCallback(
    async (data: BookingFormValues) => {
      if (!tour?._id || !authUser?._id) return;
      setBookingSuccess(null);
      try {
        const result = await createBooking.mutateAsync({
          tourId: tour._id,
          departureDate: data.departureDate,
          guest: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone || undefined,
            note: data.note || undefined,
          },
          adults: parseInt(data.adults, 10),
          children: parseInt(data.children, 10) || 0,
          infants: parseInt(data.infants, 10) || 0,
          userId: authUser._id,
        });
        setBookingSuccess({
          bookingCode: result.bookingCode,
          bookingId: result._id,
        });
      } catch (err: unknown) {
        const message =
          (err as { message?: string })?.message ?? 'Đặt tour thất bại';
        setError('root', { type: 'manual', message });
      }
    },
    [tour?._id, authUser?._id, createBooking, setError],
  );

  const prevMonth = () => {
    const d = new Date(month + '-01');
    d.setMonth(d.getMonth() - 1);
    setMonth(d.toISOString().slice(0, 7));
  };
  const nextMonth = () => {
    const d = new Date(month + '-01');
    d.setMonth(d.getMonth() + 1);
    setMonth(d.toISOString().slice(0, 7));
  };

  // Yêu cầu đăng nhập mới cho đặt tour
  if (!authUser) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/30 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
            <HiOutlineLockClosed className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Đăng nhập để đặt tour
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Bạn cần đăng nhập để đặt tour và quản lý đơn của mình.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            asChild
            className="w-full rounded-lg h-11 font-medium"
            size="lg"
          >
            <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full rounded-lg h-11"
            size="lg"
          >
            <Link to={ROUTES.REGISTER}>Tạo tài khoản</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/30 p-5 space-y-4">
        <p className="font-semibold text-emerald-800 dark:text-emerald-200">
          {t('tour_booking_form.booking_success_title')}
        </p>
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          {t('tour_booking_form.booking_success_code')}:{' '}
          <strong className="font-mono">{bookingSuccess.bookingCode}</strong>
        </p>
        <p className="text-sm text-muted-foreground">
          {t('tour_booking_form.booking_success_lookup')}
        </p>
        <div className="flex flex-wrap gap-2">
          {bookingSuccess.bookingId && (
            <Button asChild size="sm" className="rounded-lg font-medium">
              <Link
                to={ROUTES.TOUR_BOOKING_PAYMENT.replace(':id', bookingSuccess.bookingId)}
              >
                {t('tour_booking_form.pay_now')}
              </Link>
            </Button>
          )}
          <Button asChild size="sm" className="rounded-lg font-medium" variant="outline">
            <Link
              to={`${ROUTES.TOUR.BOOKING_LOOKUP}?code=${encodeURIComponent(bookingSuccess.bookingCode)}`}
            >
              {t('tour_booking_form.lookup_booking')}
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => setBookingSuccess(null)}
          >
            {t('tour_booking_form.book_another')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Tháng & Ngày khởi hành */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Ngày khởi hành
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
              aria-label="Tháng trước"
            >
              ‹
            </button>
            <span className="flex-1 text-center text-sm font-medium tabular-nums">
              {month}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
              aria-label="Tháng sau"
            >
              ›
            </button>
          </div>
          <div className="[&_.flex]:!flex-col [&_.flex] gap-2">
            <CustomInput
              name="departureDate"
              type="select"
              className="w-full rounded-lg border-border bg-background h-11"
              size="lg"
              placeHolder={
                loadingAvailability ? 'Đang tải...' : 'Chọn ngày khởi hành'
              }
              label=""
              options={dateOptions}
              rules={{ required: 'Vui lòng chọn ngày khởi hành' }}
            />
          </div>
          {!loadingAvailability && selectableDates.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Không có ngày khởi hành trong tháng này.
            </p>
          )}
        </div>

        {/* Số khách */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Số khách</p>
          <div className="grid grid-cols-3 gap-2">
            <CustomInput
              name="adults"
              type="select"
              className="w-full [&_button]:rounded-lg [&_button]:h-11 [&_button]:border-border"
              size="lg"
              placeHolder="NL"
              label="Người lớn"
              options={adultOptions}
              rules={{ required: 'Bắt buộc' }}
            />
            <CustomInput
              name="children"
              type="select"
              className="w-full [&_button]:rounded-lg [&_button]:h-11 [&_button]:border-border"
              size="lg"
              placeHolder="TE"
              label="Trẻ em"
              options={childOptions}
            />
            <CustomInput
              name="infants"
              type="select"
              className="w-full [&_button]:rounded-lg [&_button]:h-11 [&_button]:border-border"
              size="lg"
              placeHolder="EB"
              label="Em bé"
              options={childOptions}
            />
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Thông tin liên hệ
          </p>
          <div className="space-y-3">
            <CustomInput
              name="fullName"
              type="text"
              label="Họ tên"
              placeHolder="Nguyễn Văn A"
              className="[&_input]:rounded-lg [&_input]:h-11 [&_input]:border-border"
              rules={{ required: 'Vui lòng nhập họ tên' }}
            />
            <CustomInput
              name="email"
              type="text"
              label="Email"
              placeHolder="email@example.com"
              className="[&_input]:rounded-lg [&_input]:h-11 [&_input]:border-border"
              rules={{ required: 'Vui lòng nhập email' }}
            />
            <CustomInput
              name="phone"
              type="text"
              label="Số điện thoại"
              placeHolder="0901234567"
              className="[&_input]:rounded-lg [&_input]:h-11 [&_input]:border-border"
            />
            <CustomInput
              name="note"
              type="text"
              label="Ghi chú"
              placeHolder="Ăn chay, yêu cầu đặc biệt..."
              className="[&_input]:rounded-lg [&_input]:h-11 [&_input]:border-border"
            />
          </div>
        </div>

        {methods.formState.errors.root && (
          <p className="text-sm text-destructive rounded-lg bg-destructive/10 px-3 py-2">
            {(methods.formState.errors.root as { message?: string }).message}
          </p>
        )}

        <Button
          type="submit"
          className="w-full rounded-lg h-12 text-base font-semibold shadow-sm"
          disabled={
            isSubmitting ||
            createBooking.isPending ||
            selectableDates.length === 0
          }
        >
          <BsLightningFill className="mr-2 h-4 w-4" />
          {isSubmitting || createBooking.isPending
            ? 'Đang xử lý...'
            : 'Đặt tour'}
        </Button>
      </form>
    </FormProvider>
  );
};

export default TourBookingForm;
