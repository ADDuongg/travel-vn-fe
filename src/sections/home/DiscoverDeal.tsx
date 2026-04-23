import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { services } from '@/mock';
import { SectionReveal } from './SectionReveal';

const serviceKeys = ['destinations', 'best_price', 'support'] as const;

export const DiscoverDeal: React.FC = () => {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<{ email: string }>();

  const onSubmit = (data: { email: string }) => {
    // Newsletter — wire to API when ready
    void data.email;
  };

  return (
    <div className="w-full" aria-labelledby="final-cta-heading">
      <div className="relative overflow-hidden border-t border-border/40">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/destination4.png"
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#1c1a14]/88 via-[#1c1a14]/75 to-[#1c1a14]/50"
            aria-hidden
          />
        </div>

        <div className="relative z-10 py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 text-white md:px-6">
            <div className="max-w-2xl">
              <h2
                id="final-cta-heading"
                className="font-dm-serif-display text-3xl font-bold leading-tight text-white drop-shadow-sm md:text-4xl lg:text-5xl"
              >
                {t('home_page.final_cta_title')}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/90 md:text-lg">
                {t('home_page.final_cta_subtitle')}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="cursor-pointer rounded-xl bg-primary text-primary-foreground shadow-lg transition-shadow duration-200 hover:bg-[#a50d25] hover:shadow-[0_8px_32px_rgba(200,16,46,0.25)]"
                >
                  <Link to={ROUTES.DESTINATION.SEARCH}>{t('home_page.final_cta_primary')}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="cursor-pointer rounded-xl border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                >
                  <Link to={ROUTES.TOUR.INDEX}>{t('home_page.final_cta_secondary')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background py-12 md:py-16">
        <SectionReveal>
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <ul
              className="mb-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-center"
              role="list"
            >
              {services.map((s, idx) => (
                <li
                  key={s.title}
                  className="flex min-w-0 flex-1 flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card px-4 py-4 text-center sm:max-w-xs sm:min-w-[200px] md:px-6"
                >
                  <span className="flex size-12 items-center justify-center rounded-xl bg-surface-100 text-primary">
                    <img src={s.icon} alt="" className="h-7 w-7 object-contain" />
                  </span>
                  <span className="font-dm-serif-display text-base font-bold text-foreground sm:text-lg">
                    {t(`services.${serviceKeys[idx]}_title`)}
                  </span>
                  <p className="text-pretty text-xs text-muted-foreground sm:text-sm">
                    {t(`services.${serviceKeys[idx]}_desc`)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 gap-8 rounded-2xl border border-border/60 bg-card p-8 shadow-sm md:grid-cols-2 md:gap-10 md:p-10 lg:items-center">
              <div>
                <h3 className="mb-2 font-dm-serif-display text-2xl font-bold text-foreground md:text-3xl">
                  {t('home_page.dont_miss')}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t('home_page.newsletter_desc_vn')}
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                    <label className="sr-only" htmlFor="final-cta-email">
                      {t('home_page.your_email')}
                    </label>
                    <div className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-surface-100 px-4 shadow-sm focus-within:ring-2 focus-within:ring-primary/30">
                      <span className="shrink-0 text-muted-foreground" aria-hidden>
                        <Send className="size-5" />
                      </span>
                      <Input
                        id="final-cta-email"
                        type="email"
                        autoComplete="email"
                        placeholder={t('home_page.your_email')}
                        className="min-h-12 min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-base shadow-none focus-visible:ring-0"
                        {...register('email', { required: true })}
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 shrink-0 cursor-pointer rounded-xl px-6 sm:w-auto sm:min-w-[140px]"
                    >
                      {t('buttons.subscribe')}
                    </Button>
                  </div>
                </form>
              </div>
              <div className="flex min-h-[200px] flex-col justify-end overflow-hidden rounded-2xl border border-border/40 bg-surface-100 p-6 sm:justify-center sm:p-8">
                <p className="text-sm text-muted-foreground">{t('home_page.newsletter_trust')}</p>
                <p className="mt-2 font-dm-serif-display text-xl font-bold text-foreground">
                  {t('home_page.newsletter_headline')}
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
};
