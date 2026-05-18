import { ParallaxHero } from '@/components/home-editorial/ParallaxHero';
import { Reveal, RevealItem, Stagger } from '@/components/home-editorial/Reveal';
import { ROUTES } from '@/constants/router';
import { MainLayout } from '@/layout';
import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { useTourGuideQuery } from '@/features/tour-guide/hooks';
import {
  ContactEditorialInquiryForm,
  type ContactEditorialConversationPick,
} from '@/sections/shared/ContactEditorialInquiryForm';

const u = (id: string) =>
  `https://images.unsplash.com/${id}?ixlib=rb-4.1.0&auto=format&fit=crop&q=85&w=2400`;

const visuals = {
  hero: u('photo-1506905925346-21bda4d32df4'),
  formSide: u('photo-1517248135467-4c7edcad34c4'),
  rain: u('photo-1515694346937-94d85e41e6f0'),
  lanterns: u('photo-1559827260-dc66d52bef19'),
  coffee: u('photo-1495474472287-4d71bcdd2085'),
  train: u('photo-1583417319070-4a69db38a482'),
  coast: u('photo-1469474968028-56623f02e42e'),
  fog: u('photo-1464822759023-fed622ff2c3b'),
  closing: u('photo-1528127269322-539801943592'),
};

const conversationIds = [
  'stories',
  'local',
  'inspiration',
  'hidden',
  'culture',
  'partnership',
] as const;

type ConversationId = (typeof conversationIds)[number];

const atmosphereFrames = [
  { id: 'rain' as const, src: visuals.rain },
  { id: 'lanterns' as const, src: visuals.lanterns },
  { id: 'coffee' as const, src: visuals.coffee },
  { id: 'train' as const, src: visuals.train },
  { id: 'coast' as const, src: visuals.coast },
  { id: 'fog' as const, src: visuals.fog },
];

const ContactPage = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [searchParams] = useSearchParams();
  const guideIdFromQuery = searchParams.get('guide');
  const { data: linkedGuide } = useTourGuideQuery(guideIdFromQuery ?? undefined, {
    enabled: !!guideIdFromQuery,
  });
  const [focusKind, setFocusKind] = useState<ConversationId | null>(null);
  const [conversationPick, setConversationPick] =
    useState<ContactEditorialConversationPick | null>(null);

  const guideJourneyPrefill = useMemo(() => {
    const gName = linkedGuide?.user?.fullName?.trim();
    if (!gName) return undefined;
    return t('tour_guide.detail.contact_prefill', { name: gName });
  }, [linkedGuide, t]);

  function handleConversationClick(id: ConversationId) {
    setFocusKind(id);
    setConversationPick({
      nonce: Date.now(),
      title: t(`contact_editorial.conversation.${id}.title`),
    });
  }

  return (
    <MainLayout>
      <div className="pb-6">
        <ParallaxHero
          image={visuals.hero}
          overlayClass="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/45 to-charcoal/25"
        >
          <div className="flex min-h-[92vh] flex-col justify-end px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-44">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
              }
              className="mx-auto flex w-full max-w-5xl flex-col gap-8 text-center text-sand-50"
            >
              <p className="text-[11px] uppercase tracking-[0.38em] text-sand-100/78">
                {t('contact_editorial.hero.eyebrow')}
              </p>
              <h1 className="font-display text-[clamp(2.45rem,7.2vw,5.5rem)] leading-[0.95] tracking-[-0.01em]">
                {t('contact_editorial.hero.title')}
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-sand-100/88 md:text-lg">
                {t('contact_editorial.hero.subtitle')}
              </p>
            </motion.div>
            <motion.div
              aria-hidden
              className="mx-auto mt-14 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.34em] text-sand-50/50"
              animate={
                reduceMotion ? undefined : { opacity: [0.4, 0.9, 0.4] }
              }
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 5.2, repeat: Infinity }
              }
            >
              <span className="h-px w-12 bg-sand-50/35" />
              {t('contact_editorial.hero.scroll_hint')}
            </motion.div>
          </div>
        </ParallaxHero>

        <section className="mx-auto max-w-6xl px-4 py-20 md:px-10 md:py-28">
          <Reveal className="max-w-3xl space-y-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('contact_editorial.intro.eyebrow')}
            </p>
            <h2 className="font-display text-4xl text-charcoal md:text-[2.85rem]">
              {t('contact_editorial.intro.title')}
            </h2>
            <div className="space-y-5 text-[1.05rem] leading-relaxed text-mist md:text-lg">
              <p>
                {t('contact_editorial.intro.p1_before')}
                <span className="text-charcoal/92">
                  {t('contact_editorial.intro.p1_emphasis')}
                </span>
                {t('contact_editorial.intro.p1_after')}
              </p>
              <p>{t('contact_editorial.intro.p2')}</p>
            </div>
          </Reveal>
        </section>

        <section className="border-y border-charcoal/10 bg-sand-100/80 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-10">
            <div className="grid items-stretch gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
              <Reveal>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  className="relative overflow-hidden rounded-[1.85rem] shadow-soft"
                >
                  <div className="relative aspect-[4/5] md:aspect-[16/13] lg:aspect-auto lg:min-h-[560px]">
                    <img
                      src={visuals.formSide}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-charcoal/55 via-charcoal/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 px-8 pb-10 pt-16 md:px-10">
                      <p className="text-[11px] uppercase tracking-[0.34em] text-sand-100/75">
                        {t('contact_editorial.form_side.eyebrow')}
                      </p>
                      <p className="mt-4 max-w-md font-display text-3xl leading-tight text-sand-50 md:text-[2.35rem]">
                        {t('contact_editorial.form_side.quote')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>

              <Reveal delay={0.06} className="flex flex-col justify-center">
                <ContactEditorialInquiryForm
                  mode="page"
                  guideJourneyPrefill={guideJourneyPrefill}
                  conversationPick={conversationPick}
                />
              </Reveal>
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,oklch(92%_0.05_145/0.18),transparent_45%),radial-gradient(circle_at_82%_32%,oklch(88%_0.06_45/0.12),transparent_42%)]" />
          <div className="relative mx-auto max-w-6xl px-4 md:px-10">
            <Reveal className="mb-14 max-w-3xl space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
                {t('contact_editorial.conversation.eyebrow')}
              </p>
              <h2 className="font-display text-4xl text-charcoal md:text-[2.85rem]">
                {t('contact_editorial.conversation.title')}
              </h2>
              <p className="text-mist md:text-lg">
                {t('contact_editorial.conversation.intro')}
              </p>
            </Reveal>

            <Stagger className="grid gap-6 md:grid-cols-2" stagger={0.07}>
              {conversationIds.map((id) => {
                const active = focusKind === id;
                return (
                  <RevealItem key={id}>
                    <motion.button
                      type="button"
                      whileHover={{ y: -4 }}
                      transition={{
                        duration: 0.34,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      onClick={() => handleConversationClick(id)}
                      className={[
                        'w-full rounded-3xl border p-8 text-start shadow-soft backdrop-blur-[2px] transition',
                        active
                          ? 'border-forest/35 bg-sand-50/90'
                          : 'border-charcoal/10 bg-sand-50/70 hover:border-charcoal/18',
                      ].join(' ')}
                    >
                      <p className="font-display text-2xl text-charcoal">
                        {t(`contact_editorial.conversation.${id}.title`)}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-mist">
                        {t(`contact_editorial.conversation.${id}.line`)}
                      </p>
                      {active ? (
                        <p className="mt-5 text-[11px] uppercase tracking-[0.26em] text-forest">
                          {t('contact_editorial.conversation.echoed')}
                        </p>
                      ) : null}
                    </motion.button>
                  </RevealItem>
                );
              })}
            </Stagger>
          </div>
        </section>

        <section className="border-t border-charcoal/10 bg-charcoal px-4 py-20 text-sand-50 md:px-10 md:py-28">
          <div className="mx-auto max-w-6xl space-y-14">
            <Reveal className="max-w-2xl space-y-4">
              <p className="text-[11px] uppercase tracking-[0.34em] text-sand-100/65">
                {t('contact_editorial.atmosphere.eyebrow')}
              </p>
              <h2 className="font-display text-4xl leading-tight md:text-[2.75rem]">
                {t('contact_editorial.atmosphere.title')}
              </h2>
              <p className="text-sand-100/76 md:text-[1.05rem] md:leading-relaxed">
                {t('contact_editorial.atmosphere.intro')}
              </p>
            </Reveal>

            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
              {atmosphereFrames.map((frame) => (
                <RevealItem key={frame.id}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 26,
                    }}
                    className="overflow-hidden rounded-[1.6rem]"
                  >
                    <div className="relative aspect-[16/11]">
                      <img
                        src={frame.src}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/78 via-charcoal/12 to-transparent" />
                      <p className="absolute inset-x-0 bottom-5 px-5 font-display text-xl leading-snug text-sand-50 md:text-[1.35rem]">
                        {t(`contact_editorial.atmosphere.${frame.id}`)}
                      </p>
                    </div>
                  </motion.div>
                </RevealItem>
              ))}
            </Stagger>
          </div>
        </section>

        <ParallaxHero
          image={visuals.closing}
          overlayClass="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/5 to-charcoal/35"
        >
          <div className="flex min-h-[86vh] flex-col justify-end px-6 pb-16 pt-32 md:px-14 md:pb-24 md:pt-40">
            <Reveal className="max-w-2xl space-y-7 text-sand-50">
              <p className="text-[11px] uppercase tracking-[0.36em] text-sand-100/75">
                {t('contact_editorial.closing.eyebrow')}
              </p>
              <h2 className="font-display text-[clamp(2.15rem,5.2vw,3.6rem)] leading-[1.06]">
                {t('contact_editorial.closing.title')}
              </h2>
              <p className="text-base leading-relaxed text-sand-100/86 md:text-lg">
                {t('contact_editorial.closing.body')}
              </p>
              <div className="flex flex-wrap gap-4 pt-1">
                <Link
                  to={ROUTES.PROVINCE.INDEX}
                  className="rounded-full bg-sunset px-7 py-3 text-sm font-semibold text-sand-50 shadow-soft transition hover:bg-sunset-deep"
                >
                  {t('contact_editorial.closing.cta_provinces')}
                </Link>
                <Link
                  to={ROUTES.ABOUT_US}
                  className="rounded-full border border-sand-50/35 px-7 py-3 text-sm font-medium text-sand-50 transition hover:border-sand-50 hover:bg-sand-50/10"
                >
                  {t('contact_editorial.closing.cta_about')}
                </Link>
              </div>
            </Reveal>
          </div>
        </ParallaxHero>
      </div>
    </MainLayout>
  );
};

export default ContactPage;

