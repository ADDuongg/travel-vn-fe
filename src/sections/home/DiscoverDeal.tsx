import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { AiOutlineSend } from 'react-icons/ai';
import Container from '@components/Container';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';

export const DiscoverDeal: React.FC = () => {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<{ email: string }>();

  const onSubmit = (data: { email: string }) => {
    // handle subscribe logic here
    alert(`Subscribed: ${data.email}`);
  };

  return (
    <Container>
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 md:gap-8">
        {/* Special deals — image + gradient, visual weight balanced with right card */}
        <div className="relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-2xl border border-border/60 shadow-md sm:min-h-[340px] md:justify-center">
          <img
            src="/images/destination5.png"
            alt=""
            className="absolute inset-0 z-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div
            className="absolute inset-0 z-[1] bg-gradient-to-t from-black/75 via-black/45 to-black/35 sm:bg-gradient-to-r sm:from-black/70 sm:via-black/40 sm:to-black/30"
            aria-hidden
          />
          <div className="relative z-10 flex flex-col items-start p-8 sm:p-10">
            <h2 className="mb-3 font-dm-serif-display text-3xl font-bold leading-tight text-white md:text-4xl">
              {t('home_page.discover_special_deals')}
            </h2>
            <p className="mb-6 max-w-lg text-base leading-relaxed text-white/90 sm:text-lg">
              {t('home_page.discover_special_deals_desc')}
            </p>
            <Button asChild size="lg" className="rounded-xl shadow-sm">
              <Link to={ROUTES.TOUR.INDEX}>{t('buttons.see_tours')}</Link>
            </Button>
          </div>
        </div>

        {/* Newsletter — no overlapping controls: input row + full-width CTA on small, inline on md+ */}
        <div className="flex min-h-[300px] flex-col justify-center rounded-2xl border border-border/60 bg-card p-8 shadow-sm sm:min-h-[340px] sm:p-10">
          <h2 className="mb-3 font-dm-serif-display text-2xl font-bold leading-tight text-foreground md:text-3xl">
            {t('home_page.dont_miss')}
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t('home_page.newsletter_desc')}
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <label className="sr-only" htmlFor="discover-deal-email">
                {t('home_page.your_email')}
              </label>
              <div className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-input bg-background px-4 shadow-sm focus-within:ring-2 focus-within:ring-ring/50">
                <span
                  className="flex shrink-0 text-muted-foreground"
                  aria-hidden
                >
                  <AiOutlineSend className="size-5" />
                </span>
                <Input
                  id="discover-deal-email"
                  type="email"
                  autoComplete="email"
                  placeholder={t('home_page.your_email')}
                  className="min-h-12 min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...register('email')}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 shrink-0 rounded-xl px-6 sm:w-auto sm:min-w-[140px]"
              >
                {t('buttons.subscribe')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};
