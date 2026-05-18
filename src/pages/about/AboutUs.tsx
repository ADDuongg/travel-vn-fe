import { ParallaxHero } from '@/components/home-editorial/ParallaxHero';
import { Reveal, RevealItem, Stagger } from '@/components/home-editorial/Reveal';
import { ROUTES } from '@/constants/router';
import { MainLayout } from '@/layout';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const u = (id: string) =>
  `https://images.unsplash.com/${id}?ixlib=rb-4.1.0&auto=format&fit=crop&q=85&w=2400`;

const visuals = {
  hero: u('photo-1528127269322-539801943592'),
  journal: u('photo-1476514525535-07fb3b4ae5f1'),
  archive: u('photo-1555396273-367ea4eb4db5'),
  sensoryFog: u('photo-1464822759023-fed622ff2c3b'),
  sensoryCoast: u('photo-1559827260-dc66d52bef19'),
  sensoryNight: u('photo-1583417319070-4a69db38a482'),
  closing: u('photo-1507525428034-b723cf961d3e'),
};

const sensoryKeys = [
  'alley_kitchens',
  'lantern_streets',
  'coffee_culture',
  'mountain_fog',
  'coastal_roads',
  'local_markets',
  'train_street_tempo',
  'night_lights_rain',
] as const;

const valueKeys = [
  'slowness',
  'atmosphere',
  'authenticity',
  'visual_storytelling',
  'emotional_discovery',
  'local_immersion',
] as const;

const AboutUsPage = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <MainLayout>
      <div className="pb-6">
        <ParallaxHero
          image={visuals.hero}
          overlayClass="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/6 to-charcoal/30"
        >
          <div className="flex min-h-[92vh] flex-col justify-end px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-44">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
              }
              className="mx-auto flex w-full max-w-5xl flex-col gap-8 text-center text-sand-50"
            >
              <p className="text-[11px] uppercase tracking-[0.38em] text-sand-100/78">
                {t('about_editorial.hero.eyebrow')}
              </p>
              <h1 className="font-display text-[clamp(2.5rem,7.5vw,5.75rem)] leading-[0.95] tracking-[-0.01em]">
                {t('about_editorial.hero.title')}
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-sand-100/86 md:text-lg">
                {t('about_editorial.hero.subtitle')}
              </p>
            </motion.div>
            <motion.div
              aria-hidden
              className="mx-auto mt-14 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.34em] text-sand-50/50"
              animate={
                reduceMotion ? undefined : { opacity: [0.4, 0.95, 0.4] }
              }
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 5, repeat: Infinity }
              }
            >
              <span className="h-px w-12 bg-sand-50/35" />
              {t('about_editorial.hero.scroll_hint')}
            </motion.div>
          </div>
        </ParallaxHero>

        <section
          id="philosophy"
          className="mx-auto max-w-6xl px-4 py-20 md:px-10 md:py-28"
        >
          <Reveal className="max-w-3xl space-y-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('about_editorial.philosophy.eyebrow')}
            </p>
            <h2 className="font-display text-4xl text-charcoal md:text-[2.85rem]">
              {t('about_editorial.philosophy.title')}
            </h2>
            <div className="space-y-5 text-[1.05rem] leading-relaxed text-mist md:text-lg">
              <p>
                {t('about_editorial.philosophy.p1')}{' '}
                <span className="text-charcoal/90">
                  {t('about_editorial.philosophy.p1_emphasis')}
                </span>
              </p>
              <p>{t('about_editorial.philosophy.p2')}</p>
            </div>
          </Reveal>
        </section>

        <section className="border-y border-charcoal/10 bg-sand-100 py-16 md:py-24">
          <div className="mx-auto max-w-6xl space-y-20 px-4 md:px-10">
            <Reveal className="max-w-xl space-y-3">
              <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
                {t('about_editorial.storytelling.eyebrow')}
              </p>
              <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
                {t('about_editorial.storytelling.title')}
              </h2>
            </Reveal>

            <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.95fr] md:gap-14">
              <Reveal>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  className="overflow-hidden rounded-[1.75rem] shadow-soft"
                >
                  <div className="relative aspect-[16/11]">
                    <img
                      src={visuals.journal}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-charcoal/40 via-transparent to-charcoal/20" />
                  </div>
                </motion.div>
              </Reveal>
              <Reveal className="space-y-5" delay={0.06}>
                <p className="text-[11px] uppercase tracking-[0.3em] text-charcoal/40">
                  {t('about_editorial.block1.eyebrow')}
                </p>
                <h3 className="font-display text-3xl text-charcoal md:text-[2.25rem]">
                  {t('about_editorial.block1.title')}
                </h3>
                <p className="text-mist md:text-[1.05rem] md:leading-relaxed">
                  {t('about_editorial.block1.body')}
                </p>
                <Link
                  to={ROUTES.TOUR.INDEX}
                  className="inline-flex text-sm font-semibold text-sunset-deep underline-offset-4 hover:underline"
                >
                  {t('about_editorial.block1.link')}
                </Link>
              </Reveal>
            </div>

            <div className="grid items-center gap-10 md:grid-cols-[0.95fr_1.1fr] md:gap-14">
              <Reveal className="order-2 space-y-5 md:order-1" delay={0.05}>
                <p className="text-[11px] uppercase tracking-[0.3em] text-charcoal/40">
                  {t('about_editorial.block2.eyebrow')}
                </p>
                <h3 className="font-display text-3xl text-charcoal md:text-[2.25rem]">
                  {t('about_editorial.block2.title')}
                </h3>
                <p className="text-mist md:text-[1.05rem] md:leading-relaxed">
                  {t('about_editorial.block2.body')}
                </p>
                <Link
                  to={ROUTES.PROVINCE.INDEX}
                  className="inline-flex text-sm font-semibold text-sunset-deep underline-offset-4 hover:underline"
                >
                  {t('about_editorial.block2.link')}
                </Link>
              </Reveal>
              <Reveal className="order-1 md:order-2">
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  className="overflow-hidden rounded-[1.75rem] shadow-soft"
                >
                  <div className="relative aspect-[16/11]">
                    <img
                      src={visuals.archive}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-bl from-charcoal/35 via-transparent to-charcoal/25" />
                  </div>
                </motion.div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden py-20 md:py-28">
          <img
            src={visuals.sensoryFog}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25 grayscale"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sand-50 via-sand-50/92 to-sand-100" />
          <div className="relative mx-auto max-w-6xl px-4 md:px-10">
            <Reveal className="mb-14 max-w-2xl space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
                {t('about_editorial.sensory_section.eyebrow')}
              </p>
              <h2 className="font-display text-4xl text-charcoal md:text-[2.8rem]">
                {t('about_editorial.sensory_section.title')}
              </h2>
              <p className="text-mist md:text-lg">
                {t('about_editorial.sensory_section.intro')}
              </p>
            </Reveal>
            <Stagger className="grid gap-8 md:grid-cols-2" stagger={0.07}>
              {sensoryKeys.map((key) => (
                <RevealItem key={key}>
                  <motion.article
                    whileHover={{ y: -4 }}
                    transition={{
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="rounded-3xl border border-charcoal/10 bg-sand-50/80 p-8 shadow-soft backdrop-blur-[2px]"
                  >
                    <p className="font-display text-2xl text-charcoal">
                      {t(`about_editorial.sensory.${key}.label`)}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-mist">
                      {t(`about_editorial.sensory.${key}.line`)}
                    </p>
                  </motion.article>
                </RevealItem>
              ))}
            </Stagger>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <Reveal>
                <div className="relative overflow-hidden rounded-[1.65rem]">
                  <img
                    src={visuals.sensoryCoast}
                    alt=""
                    className="aspect-[16/10] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-transparent to-transparent" />
                  <p className="absolute inset-x-0 bottom-6 px-6 font-display text-2xl text-sand-50 md:text-[1.85rem]">
                    {t('about_editorial.sensory_split.coast_caption')}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="relative overflow-hidden rounded-[1.65rem]">
                  <img
                    src={visuals.sensoryNight}
                    alt=""
                    className="aspect-[16/10] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                  <p className="absolute inset-x-0 bottom-6 px-6 font-display text-2xl text-sand-50 md:text-[1.85rem]">
                    {t('about_editorial.sensory_split.night_caption')}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="border-y border-charcoal/10 bg-charcoal px-4 py-20 text-sand-50 md:px-10 md:py-28">
          <div className="mx-auto max-w-5xl space-y-12">
            <Reveal className="max-w-2xl space-y-4">
              <p className="text-[11px] uppercase tracking-[0.34em] text-sand-100/65">
                {t('about_editorial.values_section.eyebrow')}
              </p>
              <h2 className="font-display text-4xl leading-tight md:text-[2.8rem]">
                {t('about_editorial.values_section.title')}
              </h2>
              <p className="text-sand-100/75 md:text-[1.05rem] md:leading-relaxed">
                {t('about_editorial.values_section.intro')}
              </p>
            </Reveal>
            <Stagger className="grid gap-10 md:grid-cols-2" stagger={0.09}>
              {valueKeys.map((key) => (
                <RevealItem key={key}>
                  <div className="border-b border-sand-50/15 pb-8">
                    <p className="font-display text-2xl">
                      {t(`about_editorial.values.${key}.title`)}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-sand-100/74">
                      {t(`about_editorial.values.${key}.body`)}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-20 md:px-10 md:py-28">
          <Reveal className="space-y-10">
            <p className="text-[11px] uppercase tracking-[0.34em] text-forest">
              {t('about_editorial.manifesto.eyebrow')}
            </p>
            <blockquote className="space-y-8">
              <p className="font-display text-[clamp(2rem,4.8vw,3.35rem)] leading-[1.12] text-charcoal">
                {t('about_editorial.manifesto.quote_lead')}
              </p>
              <p className="text-lg leading-relaxed text-mist md:text-xl">
                {t('about_editorial.manifesto.quote_body')}{' '}
                <span className="text-charcoal/95">
                  {t('about_editorial.manifesto.quote_emphasis')}
                </span>
              </p>
            </blockquote>
          </Reveal>
        </section>

        <ParallaxHero
          image={visuals.closing}
          overlayClass="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/20"
        >
          <div className="flex min-h-[88vh] flex-col justify-end px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-40">
            <Reveal className="max-w-2xl space-y-7 text-sand-50">
              <p className="text-[11px] uppercase tracking-[0.36em] text-sand-100/75">
                {t('about_editorial.closing.eyebrow')}
              </p>
              <h2 className="font-display text-[clamp(2.25rem,5.5vw,3.85rem)] leading-[1.05]">
                {t('about_editorial.closing.title')}
              </h2>
              <p className="text-base leading-relaxed text-sand-100/85 md:text-lg">
                {t('about_editorial.closing.body')}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to={ROUTES.PROVINCE.INDEX}
                  className="rounded-full bg-sunset px-7 py-3 text-sm font-semibold text-sand-50 shadow-soft transition hover:bg-sunset-deep"
                >
                  {t('about_editorial.closing.cta_provinces')}
                </Link>
                <Link
                  to={ROUTES.TOUR.INDEX}
                  className="rounded-full border border-sand-50/35 px-7 py-3 text-sm font-medium text-sand-50 transition hover:border-sand-50 hover:bg-sand-50/10"
                >
                  {t('about_editorial.closing.cta_journeys')}
                </Link>
                <Link
                  to={ROUTES.HOME}
                  className="rounded-full border border-transparent px-7 py-3 text-sm font-medium text-sand-50/82 underline-offset-[6px] transition hover:text-sand-50 hover:underline"
                >
                  {t('about_editorial.closing.cta_home')}
                </Link>
              </div>
            </Reveal>
          </div>
        </ParallaxHero>
      </div>
    </MainLayout>
  );
};

export default AboutUsPage;

