import { VietnamMap } from '@/components/home-editorial/VietnamMap';
import { CityPreviewCard } from '@/components/home-editorial/CityPreviewCard';
import { ParallaxHero } from '@/components/home-editorial/ParallaxHero';
import { Reveal, RevealItem, Stagger } from '@/components/home-editorial/Reveal';
import { ROUTES } from '@/constants/router';
import { usePopularProvincesQuery } from '@/features/provinces/hooks';
import { MOCK_PROVINCES_FALLBACK } from '@/features/provinces/mockProvinces';
import {
  collectionImages,
  foodStoryImages,
  trendingSpotImages,
} from '@/features/home-editorial/data/citiesHome';
import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.1.0&auto=format&fit=crop&q=85&w=2400';

export function HomeEditorial() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const { data: popularProvinces, isLoading: isPopularLoading } =
    usePopularProvincesQuery();

  const featuredProvinces = useMemo(() => {
    if (isPopularLoading) return [];
    if (popularProvinces?.length) return popularProvinces.slice(0, 3);
    return MOCK_PROVINCES_FALLBACK.slice(0, 3);
  }, [isPopularLoading, popularProvinces]);

  return (
    <div className="pb-6">
      <ParallaxHero image={HERO_IMAGE}>
        <div className="flex flex-1 flex-col justify-end px-6 pb-14 pt-36 md:px-14 md:pb-20 md:pt-40">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl space-y-6 text-sand-50"
          >
            <p className="text-[11px] uppercase tracking-[0.38em] text-sand-100/80">
              {t('editorial.hero.eyebrow')}
            </p>
            <h1 className="font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92]">
              {t('editorial.hero.title')}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-sand-100/85 md:text-lg">
              {t('editorial.hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to={ROUTES.PROVINCE.INDEX}
                className="rounded-full bg-sunset px-7 py-3 text-sm font-semibold text-sand-50 shadow-soft transition hover:bg-sunset-deep"
              >
                {t('editorial.hero.cta_cities')}
              </Link>
              <Link
                to={ROUTES.TOUR.INDEX}
                className="rounded-full border border-sand-50/35 px-7 py-3 text-sm font-medium text-sand-50 transition hover:border-sand-50 hover:bg-sand-50/10"
              >
                {t('editorial.hero.cta_journeys')}
              </Link>
              <a
                href="#collections"
                className="rounded-full border border-sand-50/35 px-7 py-3 text-sm font-medium text-sand-50 transition hover:border-sand-50 hover:bg-sand-50/10"
              >
                {t('editorial.hero.cta_collections')}
              </a>
            </div>
          </motion.div>
          <motion.div
            aria-hidden
            className="mt-12 flex items-center gap-3 text-[11px] uppercase tracking-[0.34em] text-sand-50/55"
            animate={
              reduceMotion ? undefined : { opacity: [0.35, 1, 0.35] }
            }
            transition={
              reduceMotion ? undefined : { duration: 4.8, repeat: Infinity }
            }
          >
            <span className="h-px w-14 bg-sand-50/35" />
            {t('editorial.hero.scroll_hint')}
          </motion.div>
        </div>
      </ParallaxHero>

      <section className="mx-auto max-w-6xl space-y-10 px-4 py-20 md:px-10 md:py-28">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('editorial.featured.eyebrow')}
            </p>
            <h2 className="font-display text-4xl text-charcoal md:text-5xl">
              {t('editorial.featured.title')}
            </h2>
          </div>
          <Link
            to={ROUTES.PROVINCE.INDEX}
            className="text-sm font-semibold text-sunset-deep underline-offset-4 hover:underline"
          >
            {t('editorial.featured.cta_atlas')}
          </Link>
        </Reveal>
        {isPopularLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((k) => (
              <div
                key={k}
                className="aspect-[4/5] animate-pulse rounded-3xl bg-sand-200/80 md:aspect-[16/11]"
              />
            ))}
          </div>
        ) : (
          <Stagger className="grid gap-6 md:grid-cols-3">
            {featuredProvinces.map((item, i) => (
              <RevealItem key={item._id}>
                <CityPreviewCard item={item} index={i} />
              </RevealItem>
            ))}
          </Stagger>
        )}
      </section>

      <section className="border-y border-charcoal/10 bg-sand-100 py-20 md:py-28">
        <div className="mx-auto max-w-6xl space-y-12 px-4 md:px-10">
          <Reveal className="max-w-2xl space-y-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('editorial.food.eyebrow')}
            </p>
            <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
              {t('editorial.food.title')}
            </h2>
            <p className="text-mist md:text-lg">{t('editorial.food.subtitle')}</p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {foodStoryImages.map((image, i) => (
              <Reveal key={String(i)} delay={i * 0.06}>
                <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-sand-50 shadow-soft">
                  <div className="relative aspect-[16/11]">
                    <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <h3 className="font-display text-2xl text-charcoal">
                      {t(`editorial.food.stories.${i}.title`)}
                    </h3>
                    <p className="text-sm leading-relaxed text-mist">
                      {t(`editorial.food.stories.${i}.body`)}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-12 px-4 py-20 md:px-10 md:py-28">
        <Reveal className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('editorial.trending.eyebrow')}
          </p>
          <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
            {t('editorial.trending.title')}
          </h2>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-3">
          {trendingSpotImages.map((image, i) => (
            <Reveal key={String(i)} delay={i * 0.08}>
              <article className="group relative overflow-hidden rounded-[1.75rem] bg-charcoal">
                <img
                  src={image}
                  alt=""
                  className="h-[420px] w-full object-cover opacity-80 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-95 md:h-[480px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 space-y-2 p-8 text-sand-50">
                  <h3 className="font-display text-3xl">
                    {t(`editorial.trending.${i}.label`)}
                  </h3>
                  <p className="text-sm text-sand-100/80">
                    {t(`editorial.trending.${i}.detail`)}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 md:px-10 md:pb-28">
        <Reveal className="mb-10 max-w-2xl space-y-4">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('editorial.navigate.eyebrow')}
          </p>
          <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
            {t('editorial.navigate.title')}
          </h2>
          <p className="text-mist">{t('editorial.navigate.subtitle')}</p>
        </Reveal>
        <Reveal>
          <VietnamMap />
        </Reveal>
      </section>

      <section
        id="collections"
        className="border-t border-charcoal/10 bg-sand-100 py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl space-y-12 px-4 md:px-10">
          <Reveal className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('editorial.collections.eyebrow')}
            </p>
            <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
              {t('editorial.collections.title')}
            </h2>
          </Reveal>
          <div className="grid gap-8 lg:grid-cols-3">
            {collectionImages.map((image, i) => (
              <Reveal key={String(i)} delay={i * 0.07}>
                <article className="overflow-hidden rounded-[2rem] border border-charcoal/10 bg-sand-50 shadow-soft">
                  <div className="relative aspect-[16/12]">
                    <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="space-y-3 p-7">
                    <h3 className="font-display text-3xl text-charcoal">
                      {t(`editorial.collections.${i}.title`)}
                    </h3>
                    <p className="text-sm text-mist">
                      {t(`editorial.collections.${i}.subtitle`)}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:px-10 md:pb-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-forest px-8 py-14 text-sand-50 md:px-14 md:py-16">
            <div className="pointer-events-none absolute -left-10 top-0 h-56 w-56 rounded-full bg-sunset/35 blur-3xl" />
            <div className="relative grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.32em] text-sand-50/70">
                  {t('editorial.seasonal.eyebrow')}
                </p>
                <h3 className="font-display text-4xl md:text-[2.75rem]">
                  {t('editorial.seasonal.title')}
                </h3>
                <p className="text-sand-50/85 md:text-lg">
                  {t('editorial.seasonal.body')}
                </p>
              </div>
              <ul className="glass-panel space-y-4 rounded-2xl bg-sand-50/10 p-6 text-sm text-sand-50/90 md:text-base">
                {[0, 1, 2].map((i) => (
                  <li
                    key={i}
                    className={`flex justify-between gap-4 pb-4 ${
                      i < 2 ? 'border-b border-sand-50/15' : ''
                    }`}
                  >
                    <span>{t(`editorial.seasonal.rows.${i}.left`)}</span>
                    <span className="text-sand-50/70">
                      {t(`editorial.seasonal.rows.${i}.right`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

