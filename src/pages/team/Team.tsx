import { ParallaxHero } from '@/components/home-editorial/ParallaxHero';
import { Reveal, RevealItem, Stagger } from '@/components/home-editorial/Reveal';
import { ROUTES } from '@/constants/router';
import {
  teamPortraitChapters,
  teamVisuals,
  type TeamChapterId,
  type TeamPortraitChapterMeta,
} from '@/features/team-editorial/data/team';
import { MainLayout } from '@/layout';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const VALUE_KEYS = ['patience', 'proximity', 'texture', 'trust'] as const;

function PortraitFrame({
  portraitSrc,
  nameLabel,
  portraitAlt,
  tint,
}: {
  portraitSrc: string;
  nameLabel: string;
  portraitAlt: string;
  tint: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -3 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="overflow-hidden rounded-[1.75rem] shadow-soft"
    >
      <div className="relative aspect-[4/5] md:aspect-[3/4]">
        <img
          src={portraitSrc}
          alt={portraitAlt}
          className="h-full w-full object-cover object-[center_22%]"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${tint}`} />
        <p className="absolute inset-x-0 bottom-6 px-6 font-display text-2xl text-sand-50 md:text-[1.85rem]">
          {nameLabel}
        </p>
      </div>
    </motion.div>
  );
}

function SecondaryCluster({
  secondaryStill,
  alt,
}: {
  secondaryStill: NonNullable<TeamPortraitChapterMeta['secondaryStill']>;
  alt: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="grid gap-5 md:grid-cols-12 md:gap-6">
      <Reveal className="md:col-span-7">
        <motion.div
          whileHover={reduceMotion ? undefined : { y: -4 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[1.65rem] shadow-soft"
        >
          <div className={`relative ${secondaryStill.aspect} w-full`}>
            <img
              src={secondaryStill.src}
              alt={alt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-charcoal/38 via-transparent to-charcoal/14" />
          </div>
        </motion.div>
      </Reveal>
    </div>
  );
}

function PortraitChapterBlock({
  chapter,
  scene,
  index,
}: {
  chapter: TeamPortraitChapterMeta;
  scene: TeamChapterId;
  index: number;
}) {
  const { t } = useTranslation();
  const base = `team_editorial.chapters.${scene}`;
  const reverse = index % 2 === 1;
  const tint =
    index % 2 === 0
      ? 'from-charcoal/52 via-charcoal/15 to-charcoal/25'
      : 'from-charcoal/48 via-charcoal/12 to-charcoal/28';

  const portraitCol = (
    <Reveal>
      <PortraitFrame
        portraitSrc={chapter.portraitSrc}
        nameLabel={t(`${base}.givenName`)}
        portraitAlt={t(`${base}.portrait_alt`)}
        tint={tint}
      />
    </Reveal>
  );

  const textCol = (
    <div className="space-y-6">
      <Reveal className="space-y-4" delay={0.05}>
        <p className="text-[11px] uppercase tracking-[0.34em] text-charcoal/45">
          {t('team_editorial.scene_prefix')} · {t(`${base}.scene`)}
        </p>
        <h2 className="font-display text-[clamp(2rem,4vw,2.85rem)] text-charcoal">
          {t(`${base}.givenName`)}
        </h2>
        <p className="font-display text-lg italic text-forest md:text-[1.2rem]">{t(`${base}.descriptor`)}</p>
        <p className="text-[11px] uppercase tracking-[0.26em] text-charcoal/40">{t(`${base}.vietnam_anchor`)}</p>
      </Reveal>
      <Reveal className="space-y-5" delay={0.08}>
        <p className="font-display text-xl italic text-charcoal/88 md:text-[1.35rem]">{t(`${base}.verse`)}</p>
        <div className="space-y-4 text-mist md:text-[1.05rem] md:leading-relaxed">
          <p>{t(`${base}.p1`)}</p>
          <p>{t(`${base}.p2`)}</p>
        </div>
      </Reveal>
    </div>
  );

  return (
    <article className="space-y-12 md:space-y-14">
      <div className="grid items-start gap-10 md:grid-cols-[1.1fr_0.95fr] md:gap-14">
        {reverse ? (
          <>
            {textCol}
            {portraitCol}
          </>
        ) : (
          <>
            {portraitCol}
            {textCol}
          </>
        )}
      </div>
      {chapter.secondaryStill ? (
        <SecondaryCluster secondaryStill={chapter.secondaryStill} alt={t(`${base}.secondary_alt`)} />
      ) : null}
    </article>
  );
}

const TeamPage = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const firstPair = teamPortraitChapters.slice(0, 2);
  const secondPair = teamPortraitChapters.slice(2, 4);

  return (
    <MainLayout>
      <div className="pb-6">
        <ParallaxHero
          image={teamVisuals.hero}
          overlayClass="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/5 to-charcoal/35"
        >
          <div className="flex min-h-[92vh] flex-col justify-end px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-44">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto flex w-full max-w-5xl flex-col gap-8 text-center text-sand-50"
            >
              <p className="text-[11px] uppercase tracking-[0.38em] text-sand-100/78">
                {t('team_editorial.hero.eyebrow')}
              </p>
              <h1
                id="team-hero-heading"
                className="font-display text-[clamp(2.45rem,7.2vw,5.55rem)] leading-[0.95] tracking-[-0.01em]"
              >
                {t('team_editorial.hero.title')}
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-sand-100/86 md:text-lg">
                {t('team_editorial.hero.subtitle')}
              </p>
            </motion.div>
            <motion.div
              aria-hidden
              className="mx-auto mt-14 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.34em] text-sand-50/50"
              animate={reduceMotion ? undefined : { opacity: [0.4, 0.95, 0.4] }}
              transition={{ duration: 5.2, repeat: Infinity }}
            >
              <span className="h-px w-12 bg-sand-50/35" />
              {t('team_editorial.hero.scroll_hint')}
            </motion.div>
          </div>
        </ParallaxHero>

        <section className="mx-auto max-w-6xl px-4 py-20 md:px-10 md:py-28">
          <Reveal className="max-w-3xl space-y-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">{t('team_editorial.intro.eyebrow')}</p>
            <h2 className="font-display text-4xl text-charcoal md:text-[2.85rem]">{t('team_editorial.intro.title')}</h2>
            <div className="space-y-5 text-[1.05rem] leading-relaxed text-mist md:text-lg">
              <p>
                {t('team_editorial.intro.p1_lead')}
                <span className="text-charcoal/90">{t('team_editorial.intro.p1_strong')}</span>
              </p>
              <p>{t('team_editorial.intro.p2')}</p>
            </div>
          </Reveal>
        </section>

        <section className="border-y border-charcoal/10 bg-sand-100 py-16 md:py-24">
          <div className="mx-auto max-w-6xl space-y-24 px-4 md:space-y-28 md:px-10">
            {firstPair.map((chapter, i) => (
              <PortraitChapterBlock key={chapter.scene} chapter={chapter} scene={chapter.scene} index={i} />
            ))}
          </div>
        </section>

        <section className="border-y border-charcoal/10 bg-sand-50 py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-4 md:px-10">
            <Reveal className="space-y-8">
              <p className="text-[11px] uppercase tracking-[0.34em] text-forest">{t('team_editorial.interlude.eyebrow')}</p>
              <blockquote className="font-display text-[clamp(1.65rem,3.6vw,2.35rem)] leading-snug text-charcoal">
                {t('team_editorial.interlude.quote')}
              </blockquote>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-24 px-4 py-20 md:space-y-28 md:px-10 md:py-28">
          {secondPair.map((chapter, i) => (
            <PortraitChapterBlock key={chapter.scene} chapter={chapter} scene={chapter.scene} index={i + 2} />
          ))}
        </section>

        <ParallaxHero
          image={teamVisuals.interlude}
          heightClass="min-h-[74vh]"
          overlayClass="absolute inset-0 bg-gradient-to-r from-charcoal/72 via-charcoal/40 to-charcoal/18"
        >
          <div className="flex min-h-[74vh] flex-col justify-center px-6 py-24 md:px-14">
            <Reveal className="max-w-xl space-y-5 text-sand-50">
              <p className="text-[11px] uppercase tracking-[0.34em] text-sand-100/72">{t('team_editorial.parallax_mid.eyebrow')}</p>
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05]">
                {t('team_editorial.parallax_mid.title')}
              </h2>
              <p className="text-base leading-relaxed text-sand-100/84 md:text-[1.05rem]">{t('team_editorial.parallax_mid.body')}</p>
            </Reveal>
          </div>
        </ParallaxHero>

        <section className="border-y border-charcoal/10 bg-charcoal px-4 py-20 text-sand-50 md:px-10 md:py-28">
          <div className="mx-auto max-w-5xl space-y-10">
            <Reveal className="max-w-2xl space-y-4">
              <p className="text-[11px] uppercase tracking-[0.34em] text-sand-100/65">{t('team_editorial.values_section.eyebrow')}</p>
              <h2 className="font-display text-4xl leading-tight md:text-[2.8rem]">{t('team_editorial.values_section.title')}</h2>
              <p className="text-sand-100/75 md:text-[1.05rem] md:leading-relaxed">{t('team_editorial.values_section.intro')}</p>
            </Reveal>
            <Stagger className="grid gap-8 md:grid-cols-2" stagger={0.08}>
              {VALUE_KEYS.map((key) => (
                <RevealItem key={key}>
                  <div className="border-b border-sand-50/15 pb-8">
                    <p className="font-display text-2xl">{t(`team_editorial.values.${key}.title`)}</p>
                    <p className="mt-3 text-sm leading-relaxed text-sand-100/74">{t(`team_editorial.values.${key}.body`)}</p>
                  </div>
                </RevealItem>
              ))}
            </Stagger>
          </div>
        </section>

        <ParallaxHero
          image={teamVisuals.closing}
          overlayClass="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/22"
        >
          <div className="flex min-h-[88vh] flex-col justify-end px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-40">
            <Reveal className="max-w-2xl space-y-7 text-sand-50">
              <p className="text-[11px] uppercase tracking-[0.36em] text-sand-100/75">{t('team_editorial.closing.eyebrow')}</p>
              <h2 className="font-display text-[clamp(2.25rem,5.5vw,3.85rem)] leading-[1.05]">{t('team_editorial.closing.title')}</h2>
              <p className="text-base leading-relaxed text-sand-100/85 md:text-lg">{t('team_editorial.closing.body')}</p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to={ROUTES.CONTACT}
                  className="rounded-full bg-sunset px-7 py-3 text-sm font-semibold text-sand-50 shadow-soft transition hover:bg-sunset-deep"
                >
                  {t('team_editorial.closing.cta_contact')}
                </Link>
                <Link
                  to={ROUTES.TOUR.INDEX}
                  className="rounded-full border border-sand-50/35 px-7 py-3 text-sm font-medium text-sand-50 transition hover:border-sand-50 hover:bg-sand-50/10"
                >
                  {t('team_editorial.closing.cta_tours')}
                </Link>
                <Link
                  to={ROUTES.ABOUT_US}
                  className="rounded-full border border-transparent px-7 py-3 text-sm font-medium text-sand-50/82 underline-offset-[6px] transition hover:text-sand-50 hover:underline"
                >
                  {t('team_editorial.closing.cta_about')}
                </Link>
              </div>
            </Reveal>
          </div>
        </ParallaxHero>
      </div>
    </MainLayout>
  );
};

export default TeamPage;
