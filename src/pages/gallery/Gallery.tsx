import { ParallaxHero } from '@/components/home-editorial/ParallaxHero';
import { Reveal, RevealItem, Stagger } from '@/components/home-editorial/Reveal';
import { ROUTES } from '@/constants/router';
import {
  galleryChapters,
  galleryStoryStills,
  galleryVisuals,
  storyStillIds,
  type GalleryChapterImage,
  type GalleryChapterMeta,
} from '@/features/gallery-editorial/data/galleryPage';
import { MainLayout } from '@/layout';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const BASE = 'gallery_editorial';

function FrameCluster({
  images,
  tint,
}: {
  images: readonly GalleryChapterImage[];
  tint: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="grid gap-5 md:grid-cols-12 md:gap-6">
      {images.map((im, idx) => (
        <Reveal key={`${im.src}-${idx}`} className={im.span}>
          <motion.div
            whileHover={reduceMotion ? undefined : { y: -4 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[1.65rem] shadow-soft"
          >
            <div className={`relative ${im.aspect} w-full`}>
              <img src={im.src} alt="" className="h-full w-full object-cover" loading="lazy" />
              <div className={`absolute inset-0 bg-gradient-to-tr ${tint}`} />
            </div>
          </motion.div>
        </Reveal>
      ))}
    </div>
  );
}

function ChapterArticle({ ch }: { ch: GalleryChapterMeta }) {
  const { t } = useTranslation();
  const ck = `${BASE}.chapters.${ch.id}`;
  return (
    <article className="space-y-10 md:space-y-12">
      <Reveal className="max-w-3xl space-y-5">
        <p className="text-[11px] uppercase tracking-[0.34em] text-charcoal/45">
          {t(`${BASE}.chapter_label`)} · {t(`${ck}.scene`)}
        </p>
        <h2 className="font-display text-[clamp(2rem,4vw,2.85rem)] text-charcoal">{t(`${ck}.title`)}</h2>
        <p className="font-display text-xl italic text-forest md:text-[1.35rem]">{t(`${ck}.verse`)}</p>
        <p className="text-mist md:text-[1.05rem] md:leading-relaxed">{t(`${ck}.body`)}</p>
        {ch.hasHint ? (
          <p className="border-s-2 border-sunset/55 ps-4 text-sm leading-relaxed text-charcoal/70">{t(`${ck}.hint`)}</p>
        ) : null}
      </Reveal>
      <FrameCluster images={ch.images} tint={ch.tint} />
    </article>
  );
}

const GalleryPage = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const ch123 = galleryChapters.slice(0, 3);
  const ch456 = galleryChapters.slice(3, 6);
  const ch710 = galleryChapters.slice(6, 10);

  return (
    <MainLayout>
      <div className="pb-6">
        <ParallaxHero
          image={galleryVisuals.hero}
          overlayClass="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/35 to-charcoal/25"
        >
          <div className="flex min-h-[92vh] flex-col justify-end px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-44">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto flex w-full max-w-5xl flex-col gap-8 text-center text-sand-50"
            >
              <p className="text-[11px] uppercase tracking-[0.38em] text-sand-100/78">{t(`${BASE}.hero.eyebrow`)}</p>
              <h1
                id="gallery-hero-heading"
                className="font-display text-[clamp(2.45rem,7.2vw,5.55rem)] leading-[0.95] tracking-[-0.01em]"
              >
                {t(`${BASE}.hero.title`)}
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-sand-100/86 md:text-lg">{t(`${BASE}.hero.subtitle`)}</p>
            </motion.div>
            <motion.div
              aria-hidden
              className="mx-auto mt-14 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.34em] text-sand-50/50"
              animate={reduceMotion ? undefined : { opacity: [0.4, 0.95, 0.4] }}
              transition={{ duration: 5.2, repeat: Infinity }}
            >
              <span className="h-px w-12 bg-sand-50/35" />
              {t(`${BASE}.hero.scroll_hint`)}
            </motion.div>
          </div>
        </ParallaxHero>

        <section className="mx-auto max-w-6xl px-4 py-20 md:px-10 md:py-28">
          <Reveal className="max-w-3xl space-y-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">{t(`${BASE}.intro.eyebrow`)}</p>
            <h2 className="font-display text-4xl text-charcoal md:text-[2.85rem]">{t(`${BASE}.intro.title`)}</h2>
            <div className="space-y-5 text-[1.05rem] leading-relaxed text-mist md:text-lg">
              <p>
                {t(`${BASE}.intro.p1_prefix`)}
                <span className="text-charcoal/92">{t(`${BASE}.intro.p1_emphasis`)}</span>
                {t(`${BASE}.intro.p1_suffix`)}
              </p>
              <p>{t(`${BASE}.intro.p2`)}</p>
            </div>
          </Reveal>
        </section>

        <section className="border-y border-charcoal/10 bg-sand-100 py-16 md:py-24">
          <div className="mx-auto max-w-6xl space-y-24 px-4 md:space-y-28 md:px-10">
            {ch123.map((ch) => (
              <ChapterArticle key={ch.id} ch={ch} />
            ))}
          </div>
        </section>

        <ParallaxHero
          image={galleryVisuals.featured1}
          heightClass="min-h-[76vh]"
          overlayClass="absolute inset-0 bg-gradient-to-r from-charcoal/72 via-charcoal/38 to-charcoal/18"
        >
          <div className="flex min-h-[76vh] flex-col justify-center px-6 py-24 md:px-14">
            <Reveal className="max-w-xl space-y-5 text-sand-50">
              <p className="text-[11px] uppercase tracking-[0.34em] text-sand-100/72">{t(`${BASE}.featured1.eyebrow`)}</p>
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05]">{t(`${BASE}.featured1.title`)}</h2>
              <p className="text-base leading-relaxed text-sand-100/84 md:text-[1.05rem]">{t(`${BASE}.featured1.body`)}</p>
            </Reveal>
          </div>
        </ParallaxHero>

        <section className="mx-auto max-w-6xl space-y-24 px-4 py-20 md:space-y-28 md:px-10 md:py-28">
          {ch456.map((ch) => (
            <ChapterArticle key={ch.id} ch={ch} />
          ))}
        </section>

        <ParallaxHero
          image={galleryVisuals.featured2}
          heightClass="min-h-[74vh]"
          overlayClass="absolute inset-0 bg-gradient-to-t from-charcoal/78 via-charcoal/32 to-charcoal/14"
        >
          <div className="flex min-h-[74vh] flex-col justify-end px-6 pb-16 pt-28 md:px-14 md:pb-20">
            <Reveal className="max-w-2xl space-y-5 pb-6 text-sand-50">
              <p className="text-[11px] uppercase tracking-[0.34em] text-sand-100/72">{t(`${BASE}.featured2.eyebrow`)}</p>
              <h2 className="font-display text-[clamp(1.9rem,4.2vw,3rem)] leading-[1.08]">{t(`${BASE}.featured2.title`)}</h2>
              <p className="text-sm leading-relaxed text-sand-100/78 md:text-base">{t(`${BASE}.featured2.body`)}</p>
            </Reveal>
          </div>
        </ParallaxHero>

        <section className="border-y border-charcoal/10 bg-sand-50 py-16 md:py-24">
          <div className="mx-auto max-w-6xl space-y-24 px-4 md:space-y-28 md:px-10">
            {ch710.map((ch) => (
              <ChapterArticle key={ch.id} ch={ch} />
            ))}
          </div>
        </section>

        <section className="relative isolate overflow-hidden py-20 md:py-28">
          <img
            src={galleryVisuals.closing}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.12] grayscale"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sand-50 via-sand-50/96 to-sand-100" />
          <div className="relative mx-auto max-w-6xl px-4 md:px-10">
            <Reveal className="mb-14 max-w-3xl space-y-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-forest">{t(`${BASE}.story_strip.eyebrow`)}</p>
              <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">{t(`${BASE}.story_strip.title`)}</h2>
              <p className="text-mist md:text-lg">{t(`${BASE}.story_strip.subtitle`)}</p>
            </Reveal>
            <Stagger className="grid gap-8 lg:grid-cols-3" stagger={0.09}>
              {storyStillIds.map((sid) => (
                <RevealItem key={sid}>
                  <motion.article
                    whileHover={reduceMotion ? undefined : { y: -3 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    className="overflow-hidden rounded-[1.7rem] border border-charcoal/10 bg-sand-50/70 shadow-soft backdrop-blur-[2px]"
                  >
                    <div className="relative aspect-[16/11]">
                      <img
                        src={galleryStoryStills[sid].src}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
                    </div>
                    <p className="px-6 py-5 text-sm leading-relaxed text-mist">{t(`${BASE}.story_stills.${sid}`)}</p>
                  </motion.article>
                </RevealItem>
              ))}
            </Stagger>
          </div>
        </section>

        <ParallaxHero
          image={galleryVisuals.closing}
          overlayClass="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/20"
        >
          <div className="flex min-h-[88vh] flex-col justify-end px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-40">
            <Reveal className="max-w-2xl space-y-7 text-sand-50">
              <p className="text-[11px] uppercase tracking-[0.36em] text-sand-100/75">{t(`${BASE}.closing.eyebrow`)}</p>
              <h2 className="font-display text-[clamp(2.15rem,5.2vw,3.6rem)] leading-[1.06]">{t(`${BASE}.closing.title`)}</h2>
              <p className="text-base leading-relaxed text-sand-100/85 md:text-lg">{t(`${BASE}.closing.body`)}</p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to={ROUTES.PROVINCE.INDEX}
                  className="rounded-full bg-sunset px-7 py-3 text-sm font-semibold text-sand-50 shadow-soft transition hover:bg-sunset-deep"
                >
                  {t(`${BASE}.closing.cta_provinces`)}
                </Link>
                <Link
                  to={ROUTES.TOUR.INDEX}
                  className="rounded-full border border-sand-50/35 px-7 py-3 text-sm font-medium text-sand-50 transition hover:border-sand-50 hover:bg-sand-50/10"
                >
                  {t(`${BASE}.closing.cta_tours`)}
                </Link>
                <Link
                  to={ROUTES.HOME}
                  className="rounded-full border border-transparent px-7 py-3 text-sm font-medium text-sand-50/82 underline-offset-[6px] transition hover:text-sand-50 hover:underline"
                >
                  {t(`${BASE}.closing.cta_home`)}
                </Link>
              </div>
            </Reveal>
          </div>
        </ParallaxHero>
      </div>
    </MainLayout>
  );
};

export default GalleryPage;

