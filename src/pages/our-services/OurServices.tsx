import { ParallaxHero } from '@/components/home-editorial/ParallaxHero';
import { Reveal, RevealItem, Stagger } from '@/components/home-editorial/Reveal';
import { ROUTES } from '@/constants/router';
import {
  experienceOffersMeta,
  flowStepIds,
  serviceVisuals,
  showcaseImageKeys,
  type ServiceEditorialLinkTarget,
} from '@/features/services-editorial/data/servicesPage';
import { MainLayout } from '@/layout';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function resolveEditorialLink(target: ServiceEditorialLinkTarget): string {
  switch (target) {
    case 'provinces':
      return ROUTES.PROVINCE.INDEX;
    case 'tour':
      return ROUTES.TOUR.INDEX;
    case 'about':
      return ROUTES.ABOUT_US;
    case 'home':
      return ROUTES.HOME;
    default:
      return ROUTES.HOME;
  }
}

const OurServicesPage = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const base = 'our_services_editorial';

  return (
    <MainLayout>
      <div className="pb-6">
        <ParallaxHero
          image={serviceVisuals.hero}
          overlayClass="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/48 to-charcoal/28"
        >
          <div className="flex min-h-[92vh] flex-col justify-end px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-44">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto flex w-full max-w-5xl flex-col gap-8 text-center text-sand-50"
            >
              <p className="text-[11px] uppercase tracking-[0.38em] text-sand-100/78">{t(`${base}.hero.eyebrow`)}</p>
              <h1
                id="our-services-hero-heading"
                className="font-display text-[clamp(2.45rem,7.4vw,5.65rem)] leading-[0.95] tracking-[-0.01em]"
              >
                {t(`${base}.hero.title`)}
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-sand-100/88 md:text-lg">{t(`${base}.hero.subtitle`)}</p>
            </motion.div>
            <motion.div
              aria-hidden
              className="mx-auto mt-14 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.34em] text-sand-50/50"
              animate={reduceMotion ? undefined : { opacity: [0.4, 0.95, 0.4] }}
              transition={{ duration: 5.1, repeat: Infinity }}
            >
              <span className="h-px w-12 bg-sand-50/35" />
              {t(`${base}.hero.scroll_hint`)}
            </motion.div>
          </div>
        </ParallaxHero>

        <section className="mx-auto max-w-6xl px-4 py-20 md:px-10 md:py-28">
          <Reveal className="max-w-3xl space-y-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">{t(`${base}.intro.eyebrow`)}</p>
            <h2 className="font-display text-4xl text-charcoal md:text-[2.85rem]">{t(`${base}.intro.title`)}</h2>
            <div className="space-y-5 text-[1.05rem] leading-relaxed text-mist md:text-lg">
              <p>
                {t(`${base}.intro.p1_prefix`)}
                <span className="text-charcoal/92">{t(`${base}.intro.p1_emphasis`)}</span>
                {t(`${base}.intro.p1_suffix`)}
              </p>
              <p>{t(`${base}.intro.p2`)}</p>
            </div>
          </Reveal>
        </section>

        <section className="border-y border-charcoal/10 bg-sand-100 py-16 md:py-24">
          <div className="mx-auto max-w-6xl space-y-24 px-4 md:space-y-28 md:px-10">
            <Reveal className="max-w-xl space-y-3">
              <p className="text-[11px] uppercase tracking-[0.32em] text-forest">{t(`${base}.immersive.eyebrow`)}</p>
              <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">{t(`${base}.immersive.title`)}</h2>
              <p className="text-mist md:text-[1.05rem] md:leading-relaxed">{t(`${base}.immersive.subtitle`)}</p>
            </Reveal>

            {experienceOffersMeta.map((block) => (
              <div key={block.id} className="grid items-center gap-10 md:grid-cols-[1.05fr_1fr] md:gap-14">
                <Reveal className={block.imageFirst ? '' : 'md:order-2'}>
                  <motion.div
                    whileHover={reduceMotion ? undefined : { y: -3 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    className="overflow-hidden rounded-[1.75rem] shadow-soft"
                  >
                    <div className="relative aspect-[16/11]">
                      <img
                        src={serviceVisuals[block.imageKey]}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-tr ${block.gradient}`} />
                    </div>
                  </motion.div>
                </Reveal>
                <Reveal className={`space-y-5 ${block.imageFirst ? '' : 'md:order-1'}`} delay={0.06}>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-charcoal/40">{t(`${base}.offers.${block.id}.eyebrow`)}</p>
                  <h3 className="font-display text-3xl text-charcoal md:text-[2.25rem]">{t(`${base}.offers.${block.id}.title`)}</h3>
                  <p className="text-mist md:text-[1.05rem] md:leading-relaxed">{t(`${base}.offers.${block.id}.body`)}</p>
                  <Link
                    to={resolveEditorialLink(block.linkTarget)}
                    className="inline-flex text-sm font-semibold text-sunset-deep underline-offset-4 hover:underline"
                  >
                    {t(`${base}.offers.${block.id}.link_label`)}
                  </Link>
                </Reveal>
              </div>
            ))}
          </div>
        </section>

        <section className="relative isolate overflow-hidden py-20 md:py-28">
          <img
            src={serviceVisuals.fog}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 grayscale"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sand-50 via-sand-50/94 to-sand-100" />
          <div className="relative mx-auto max-w-6xl px-4 md:px-10">
            <Reveal className="mb-14 max-w-2xl space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-forest">{t(`${base}.showcase.eyebrow`)}</p>
              <h2 className="font-display text-4xl text-charcoal md:text-[2.8rem]">{t(`${base}.showcase.title`)}</h2>
              <p className="text-mist md:text-lg">{t(`${base}.showcase.subtitle`)}</p>
            </Reveal>
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
              {showcaseImageKeys.map((key) => (
                <RevealItem key={key}>
                  <motion.div
                    whileHover={reduceMotion ? undefined : { y: -4 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden rounded-[1.65rem] shadow-soft"
                  >
                    <div className="relative aspect-[16/11]">
                      <img
                        src={serviceVisuals[key]}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/72 via-charcoal/15 to-transparent" />
                      <p className="absolute inset-x-0 bottom-5 px-5 font-display text-xl leading-snug text-sand-50 md:text-[1.35rem]">
                        {t(`${base}.showcase.lines.${key}`)}
                      </p>
                    </div>
                  </motion.div>
                </RevealItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section className="border-y border-charcoal/10 bg-charcoal px-4 py-20 text-sand-50 md:px-10 md:py-28">
          <div className="mx-auto max-w-5xl space-y-10">
            <Reveal className="max-w-3xl space-y-5">
              <p className="text-[11px] uppercase tracking-[0.34em] text-sand-100/65">{t(`${base}.philosophy.eyebrow`)}</p>
              <h2 className="font-display text-4xl leading-tight md:text-[2.75rem]">{t(`${base}.philosophy.title`)}</h2>
              <div className="space-y-5 text-sand-100/78 md:text-[1.05rem] md:leading-relaxed">
                <p>{t(`${base}.philosophy.p1`)}</p>
                <p>
                  {t(`${base}.philosophy.p2_lead`)}{' '}
                  <span className="text-sand-50/92">{t(`${base}.philosophy.p2_emphasis`)}</span>
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 md:px-10 md:py-28">
          <Reveal className="mb-14 max-w-2xl space-y-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">{t(`${base}.flow.eyebrow`)}</p>
            <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">{t(`${base}.flow.title`)}</h2>
            <p className="text-mist md:text-lg">{t(`${base}.flow.subtitle`)}</p>
          </Reveal>
          <Stagger className="grid gap-8 md:grid-cols-5 md:gap-6" stagger={0.08}>
            {flowStepIds.map((step) => (
              <RevealItem key={step}>
                <motion.article
                  whileHover={reduceMotion ? undefined : { y: -3 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                  className="rounded-3xl border border-charcoal/10 bg-sand-50/85 p-7 shadow-soft backdrop-blur-[2px]"
                >
                  <p className="font-display text-2xl text-charcoal">{t(`${base}.flow.steps.${step}.word`)}</p>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{t(`${base}.flow.steps.${step}.line`)}</p>
                </motion.article>
              </RevealItem>
            ))}
          </Stagger>
        </section>

        <ParallaxHero
          image={serviceVisuals.closing}
          overlayClass="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/52 to-charcoal/22"
        >
          <div className="flex min-h-[88vh] flex-col justify-end px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-40">
            <Reveal className="max-w-2xl space-y-7 text-sand-50">
              <p className="text-[11px] uppercase tracking-[0.36em] text-sand-100/75">{t(`${base}.closing.eyebrow`)}</p>
              <h2 className="font-display text-[clamp(2.2rem,5.4vw,3.75rem)] leading-[1.05]">{t(`${base}.closing.title`)}</h2>
              <p className="text-base leading-relaxed text-sand-100/85 md:text-lg">{t(`${base}.closing.body`)}</p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to={ROUTES.TOUR.INDEX}
                  className="rounded-full bg-sunset px-7 py-3 text-sm font-semibold text-sand-50 shadow-soft transition hover:bg-sunset-deep"
                >
                  {t(`${base}.closing.cta_tours`)}
                </Link>
                <Link
                  to={ROUTES.CONTACT}
                  className="rounded-full border border-sand-50/35 px-7 py-3 text-sm font-medium text-sand-50 transition hover:border-sand-50 hover:bg-sand-50/10"
                >
                  {t(`${base}.closing.cta_contact`)}
                </Link>
                <Link
                  to={ROUTES.HOME}
                  className="rounded-full border border-transparent px-7 py-3 text-sm font-medium text-sand-50/82 underline-offset-[6px] transition hover:text-sand-50 hover:underline"
                >
                  {t(`${base}.closing.cta_home`)}
                </Link>
              </div>
            </Reveal>
          </div>
        </ParallaxHero>
      </div>
    </MainLayout>
  );
};

export default OurServicesPage;

