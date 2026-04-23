import CustomInput from '@components/CustomInput';
import { Button } from '@components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Search } from 'lucide-react';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { cn } from '@/lib/utils';

const schema = z.object({
  destination: z.string(),
  checkIn: z.date().optional(),
  checkOut: z.date().optional(),
  guests: z.string(),
});

type FormData = z.infer<typeof schema>;

export const TitleSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      destination: 'hanoi',
      checkIn: undefined,
      checkOut: undefined,
      guests: '2',
    },
  });

  const onSubmit = (data: FormData) => {
    const params = new URLSearchParams();
    params.set('destination', data.destination);
    if (data.checkIn) params.set('checkIn', data.checkIn.toISOString().slice(0, 10));
    if (data.checkOut) params.set('checkOut', data.checkOut.toISOString().slice(0, 10));
    params.set('guests', data.guests);
    navigate(`${ROUTES.LIST_ROOMS}?${params.toString()}`);
  };

  const destinationOptions = [
    { label: t('home_page.opt_dest_hanoi'), value: 'hanoi' },
    { label: t('home_page.opt_dest_danang'), value: 'da-nang' },
    { label: t('home_page.opt_dest_hoian'), value: 'hoi-an' },
    { label: t('home_page.opt_dest_hcmc'), value: 'ho-chi-minh' },
    { label: t('home_page.opt_dest_sapa'), value: 'sapa' },
    { label: t('home_page.opt_dest_phuquoc'), value: 'phu-quoc' },
    { label: t('home_page.opt_dest_nhatrang'), value: 'nha-trang' },
  ];

  const guestOptions = [
    { label: t('home_page.guests_1'), value: '1' },
    { label: t('home_page.guests_2'), value: '2' },
    { label: t('home_page.guests_3'), value: '3' },
    { label: t('home_page.guests_4'), value: '4' },
    { label: t('home_page.guests_5'), value: '5' },
    { label: t('home_page.guests_6'), value: '6' },
    { label: t('home_page.guests_7'), value: '7' },
    { label: t('home_page.guests_8'), value: '8' },
  ];

  return (
    <section
      className="relative min-h-[min(100vh,920px)] w-full overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="/images/destination1.png"
          alt=""
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#1c1a14]/80 via-[#1c1a14]/40 to-[#1c1a14]/20"
          aria-hidden
        />
      </div>

      <div className="relative z-[1] mx-auto flex max-w-7xl flex-col justify-end gap-10 px-4 pb-16 pt-32 md:gap-12 md:pb-24 md:pt-28 lg:pb-32 lg:pt-32">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm md:text-sm">
            {t('home_page.badge_hero')}
          </p>
          <h1
            id="hero-heading"
            className="font-dm-serif-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-white drop-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {t('home_page.hero_line1')}
            <br />
            <span className="text-[#f5e9d0]">{t('home_page.hero_line2')}</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
            {t('home_page.hero_subtitle_vn')}
          </p>
        </div>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-5xl rounded-2xl border border-white/20 bg-white p-4 shadow-[var(--shadow-elevated)] md:p-6"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-4">
              <div className="lg:col-span-3">
                <CustomInput
                  name="destination"
                  type="select"
                  label={t('input.field_label.destination')}
                  className="custom-input !h-auto min-h-[4.5rem] rounded-xl border-0 bg-[var(--surface-100)] py-1 shadow-none"
                  value={form.watch('destination')}
                  options={destinationOptions}
                  labelPosition="vertical"
                />
              </div>
              <div className="lg:col-span-3">
                <CustomInput
                  name="checkIn"
                  type="date"
                  label={t('input.field_label.check_in')}
                  className="custom-input !h-auto min-h-[4.5rem] rounded-xl border-0 bg-[var(--surface-100)] py-1 shadow-none"
                  labelPosition="vertical"
                />
              </div>
              <div className="lg:col-span-3">
                <CustomInput
                  name="checkOut"
                  type="date"
                  label={t('input.field_label.check_out')}
                  className="custom-input !h-auto min-h-[4.5rem] rounded-xl border-0 bg-[var(--surface-100)] py-1 shadow-none"
                  labelPosition="vertical"
                />
              </div>
              <div className="lg:col-span-2">
                <CustomInput
                  name="guests"
                  type="select"
                  label={t('input.field_label.guests')}
                  className="custom-input !h-auto min-h-[4.5rem] rounded-xl border-0 bg-[var(--surface-100)] py-1 shadow-none"
                  value={form.watch('guests')}
                  options={guestOptions}
                  labelPosition="vertical"
                />
              </div>
              <div className="lg:col-span-1">
                <Button
                  type="submit"
                  size="lg"
                  className={cn(
                    'h-12 w-full gap-2 rounded-xl bg-primary text-primary-foreground shadow-md transition-all duration-200',
                    'hover:bg-[var(--vietnam-red-deep)] hover:shadow-[0_8px_32px_rgba(200,16,46,0.25)]',
                    'md:h-14',
                  )}
                >
                  <Search className="size-5 shrink-0" aria-hidden />
                  <span className="font-medium">{t('search')}</span>
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};
