import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { FloatingSectionNav } from '@/components/home-editorial/FloatingSectionNav';
import { MagazineSectionHeading } from '@/components/home-editorial/MagazineSectionHeading';
import { ParallaxHero } from '@/components/home-editorial/ParallaxHero';
import {
  Reveal,
  RevealItem,
  Stagger,
} from '@/components/home-editorial/Reveal';
import { useHeroScrollNavReveal } from '@/components/home-editorial/useHeroScrollNavReveal';
import { ROUTES } from '@/constants/router';
import { useTourQuery } from '@/features/tours/hooks';
import type { Tour } from '@/features/tours/types';
import { MainLayout } from '@/layout';
import TourFAQ from '@/sections/tour/tour-detail/TourFAQ';
import TourMap from '@/sections/tour/tour-detail/TourMap';
import TourRelated from '@/sections/tour/tour-detail/TourRelated';
import TourReviews from '@/sections/tour/tour-detail/TourReviews';
import {
  JourneyBookingShell,
  JourneyEssentials,
  JourneyGalleryGrid,
  JourneyItineraryTimeline,
  JourneyMetaStrip,
  JourneyMobileInquiryBar,
  JourneyPlanBand,
  JourneyRhythm,
  JourneyShareSave,
  buildContextCards,
  buildEssentialsLines,
  buildItineraryStops,
  buildRhythmFromSchedule,
  buildTourJourneyNavItems,
  getDurationLabel,
  getHeroCoverUrl,
  getMainRegionLabel,
  getPlanLeadCopy,
  getSecondaryStoryImage,
  getTourGalleryItems,
  getTourName,
  getTourStoryVm,
  hasJourneyStorySection,
} from '@/sections/tour/journey-detail';
import { useLanguage } from '@/hooks/useLanguage';
import { scrollToSectionAnchor } from '@/lib/scrollToSectionAnchor';

function moodLabelForTour(tour: Tour, t: TFunction<'translation'>) {
  const parts: string[] = [];
  if (tour.tourType) {
    parts.push(
      t(`tour.journey.mood.tour_type.${tour.tourType}`, String(tour.tourType)),
    );
  }
  if (tour.difficulty) {
    parts.push(
      t(
        `tour.journey.mood.difficulty.${tour.difficulty}`,
        String(tour.difficulty),
      ),
    );
  }
  return parts.join(' · ');
}

const TourDetailPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { data: tour, isLoading, isError } = useTourQuery(id);

  return (
    <MainLayout>
      {isLoading && <TourDetailSkeleton />}
      {isError && !isLoading && (
        <TourDetailError
          title={t('tour.detail.not_found', 'Tour not found')}
          description={t(
            'tour.detail.not_found_desc',
            'This tour may have been removed or the link is incorrect.',
          )}
        />
      )}
      {tour && !isLoading && (
        <TourJourneyArticle tour={tour} language={language} />
      )}
    </MainLayout>
  );
};

type TourJourneyArticleProps = {
  tour: Tour;
  language: string;
};

const TourJourneyArticle = ({ tour, language }: TourJourneyArticleProps) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const navVisible = useHeroScrollNavReveal(heroRef);
  const [bookingOpen, setBookingOpen] = useState(false);

  const locale = language === 'vi' ? 'vi-VN' : 'en-US';

  const name = getTourName(tour, language);
  const coverUrl = getHeroCoverUrl(tour);
  const storyVm = getTourStoryVm(tour, language);
  const essentials = buildEssentialsLines(tour, language);
  const rhythm = buildRhythmFromSchedule(tour, t, locale);
  const itineraryStops = buildItineraryStops(tour, language, t);
  const galleryItems = getTourGalleryItems(tour);
  const contextCards = buildContextCards(tour, language);
  const regionLabel = getMainRegionLabel(tour, language);
  const durationVm = getDurationLabel(tour, t);
  const planCopy = getPlanLeadCopy(tour, language, t);
  const secondaryImg = getSecondaryStoryImage(tour);
  const mood = moodLabelForTour(tour, t);

  const labeledNavItems = useMemo(
    () =>
      buildTourJourneyNavItems(tour, language, t).map((item) => ({
        id: item.id,
        label: t(item.labelKey),
      })),
    [tour, language, t],
  );

  const categoryLine = t(
    `tour.journey.mood.tour_type.${tour.tourType}`,
    String(tour.tourType),
  );

  const showStory = hasJourneyStorySection(tour, language);
  const showEssentials =
    essentials.included.length > 0 || essentials.excluded.length > 0;
  const showRhythm =
    rhythm.departureRhythm.length > 0 || rhythm.nextWindows.length > 0;
  const showItinerary = itineraryStops.length > 0;
  const showGallery = galleryItems.length > 0;
  const showContext = contextCards.length > 0;

  return (
    <article className="relative bg-sand-50 pb-28 lg:pb-24">
      <section ref={heroRef}>
        <ParallaxHero image={coverUrl} heightClass="min-h-[100svh]">
          <div className="flex flex-1 flex-col justify-end px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-44">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl space-y-5 text-sand-50"
            >
              <p className="text-[11px] uppercase tracking-[0.38em] text-sand-100/75">
                {categoryLine}
              </p>
              <h1 className="font-display text-[clamp(2.75rem,7vw,4.75rem)] leading-[0.95]">
                {name}
              </h1>
              {storyVm.lead ? (
                <p className="max-w-2xl text-lg text-sand-100/85">
                  {storyVm.lead}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-4 pt-2 text-[11px] uppercase tracking-[0.24em] text-sand-100/70">
                <span>{regionLabel}</span>
                <span className="text-sand-100/40">·</span>
                <span>{durationVm.line}</span>
                {mood ? (
                  <>
                    <span className="text-sand-100/40">·</span>
                    <span>{mood}</span>
                  </>
                ) : null}
              </div>
            </motion.div>
          </div>
        </ParallaxHero>
      </section>

      <FloatingSectionNav
        visible={navVisible}
        items={labeledNavItems}
        ariaLabel={t('tour.journey.nav.aria', 'Section navigation')}
        onNavigate={scrollToSectionAnchor}
        navClassName="bg-sand-50/82"
        buttonsRowClassName="max-h-[52vh] px-2 md:gap-1.5"
        buttonClassName="sm:text-[10px] md:px-3"
      />

      <section className="mx-auto max-w-6xl scroll-mt-36 px-4 pt-14 md:px-10 md:pt-16">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <JourneyShareSave
            tourId={tour._id}
            title={name}
            initialIsFavorited={tour.isFavorited}
          />
        </Reveal>
        <Reveal delay={0.05} className="mt-8">
          <JourneyMetaStrip
            tour={tour}
            regionLabel={regionLabel}
            durationLine={durationVm.line}
            days={durationVm.days}
            nights={durationVm.nights}
            moodLabel=""
          />
        </Reveal>
      </section>

      {showStory ? (
        <section
          id="story"
          className="mx-auto max-w-6xl scroll-mt-36 px-4 pt-20 md:px-10 md:pt-28"
        >
          <div
            className={
              storyVm.paragraphs.length > 0 && secondaryImg
                ? 'grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start'
                : 'grid gap-14'
            }
          >
            <MagazineSectionHeading
              className="space-y-8"
              kicker={t('tour.journey.story.kicker', 'Editorial')}
              title={t('tour.journey.story.title', 'Why this route breathes')}
              titleClassName="md:text-[2.85rem]"
            >
              {storyVm.paragraphs.map((para) => (
                <p
                  key={para.slice(0, 48)}
                  className="text-lg leading-relaxed text-mist md:text-xl"
                >
                  {para}
                </p>
              ))}
            </MagazineSectionHeading>
            {secondaryImg ? (
              <Reveal>
                <div className="relative overflow-hidden rounded-[2rem] border border-charcoal/10 shadow-[var(--shadow-soft)]">
                  <img
                    src={secondaryImg}
                    alt=""
                    className="max-h-[640px] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/35 via-transparent to-transparent" />
                </div>
              </Reveal>
            ) : null}
          </div>
        </section>
      ) : null}

      {showEssentials ? (
        <section
          id="essentials"
          className="scroll-mt-36 border-y border-charcoal/10 bg-sand-100 py-20 md:py-28"
        >
          <div className="mx-auto max-w-6xl px-4 md:px-10">
            <MagazineSectionHeading
              className="mb-14 space-y-3"
              kicker={t(
                'tour.journey.essentials.kicker',
                'What travels with you',
              )}
              title={t(
                'tour.journey.essentials.section_title',
                'Essentials & honest boundaries',
              )}
            />
            <JourneyEssentials
              included={essentials.included}
              excluded={essentials.excluded}
            />
          </div>
        </section>
      ) : null}

      {showRhythm ? (
        <section
          id="rhythm"
          className="mx-auto max-w-6xl scroll-mt-36 px-4 py-20 md:px-10 md:py-28"
        >
          <MagazineSectionHeading
            className="mb-14 space-y-3"
            kicker={t('tour.journey.rhythm.kicker', 'Departure cadence')}
            title={t(
              'tour.journey.rhythm.section_title',
              'When the route finds its pulse',
            )}
          />
          <JourneyRhythm
            departureRhythm={rhythm.departureRhythm}
            nextWindows={rhythm.nextWindows}
          />
        </section>
      ) : null}

      {showItinerary ? (
        <section
          id="itinerary"
          className="scroll-mt-36 border-y border-charcoal/10 bg-sand-100 py-20 md:py-28"
        >
          <div className="mx-auto max-w-6xl px-4 md:px-10">
            <Reveal className="mb-14 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
                {t('tour.journey.itinerary.kicker', 'Itinerary')}
              </p>
              <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
                {t(
                  'tour.journey.itinerary.section_title',
                  'A measured arc, not a spreadsheet',
                )}
              </h2>
            </Reveal>
            <JourneyItineraryTimeline stops={itineraryStops} />
          </div>
        </section>
      ) : null}

      {showGallery ? (
        <section
          id="gallery"
          className="mx-auto max-w-6xl scroll-mt-36 px-4 py-20 md:px-10 md:py-28"
        >
          <MagazineSectionHeading
            className="mb-12 space-y-3"
            titleSize="flat"
            kicker={t('tour.journey.gallery.kicker', 'Gallery')}
            title={t(
              'tour.journey.gallery.section_title',
              'Still frames from the same air',
            )}
          />
          <JourneyGalleryGrid items={galleryItems} />
        </section>
      ) : null}

      {showContext ? (
        <section
          id="context"
          className={`scroll-mt-36 mx-auto max-w-6xl px-4 py-20 md:px-10 md:py-28 ${showGallery ? '' : 'border-t border-charcoal/10 bg-sand-50'}`}
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
            <MagazineSectionHeading
              titleSize="flat"
              className="space-y-3"
              kicker={t('tour.journey.context.kicker', 'Place & culture')}
              title={t(
                'tour.journey.context.section_title',
                'Context without encyclopedia voice',
              )}
            />
            <Stagger className="space-y-6">
              {contextCards.map((c) => (
                <RevealItem key={`${c.index}-${c.body.slice(0, 24)}`}>
                  <div className="rounded-2xl border border-charcoal/10 bg-sand-100 px-6 py-5 shadow-[var(--shadow-soft)] md:px-8 md:py-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-forest/70">
                      {t('tour.journey.context.point_label', {
                        num: c.index,
                      })}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-mist md:text-base">
                      {c.body}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      <section
        id="map"
        className="scroll-mt-36 border-y border-charcoal/10 bg-sand-100 py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 md:px-10">
          <MagazineSectionHeading
            className="mb-10 space-y-3"
            kicker={t('tour.journey.map.kicker', 'Route')}
            title={t('tour.detail.map_title', 'Journey route')}
          />
          <TourMap embedded omitHeading />
        </div>
      </section>

      <section
        id="faq"
        className="mx-auto max-w-6xl scroll-mt-36 px-4 py-20 md:px-10 md:py-28"
      >
        <Reveal className="mb-10 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('tour.journey.faq.kicker', 'Clarity')}
          </p>
          <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
            {t('tour.detail.faq_title', 'Common questions')}
          </h2>
        </Reveal>
        <TourFAQ embedded omitHeading />
      </section>

      <section
        id="plan"
        className="mx-auto max-w-6xl scroll-mt-36 px-4 pb-12 md:px-10 md:pb-16"
      >
        <MagazineSectionHeading
          className="mb-10 space-y-3"
          kicker={t('tour.journey.plan.kicker_section', 'Invest in the arc')}
          title={t('tour.journey.plan.section_title', 'Plan with us, slowly')}
        />
        <JourneyPlanBand
          tour={tour}
          planCopy={planCopy}
          onOpenBooking={() => setBookingOpen(true)}
        />
      </section>

      <section
        id="reviews"
        className="scroll-mt-36 border-y border-charcoal/10 bg-sand-100 py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 md:px-10">
          <MagazineSectionHeading
            className="mb-10 space-y-3"
            kicker={t('tour.journey.reviews.kicker', 'Honest signals')}
            title={t('tour.detail.reviews_block_title', 'Traveler reviews')}
          />
          <TourReviews tour={tour} embedded />
        </div>
      </section>

      <section
        id="more"
        className="scroll-mt-36 mx-auto max-w-6xl px-4 pb-16 md:px-10"
      >
        <MagazineSectionHeading
          className="mb-8 space-y-3"
          titleSize="flat"
          kicker={t('tour.journey.more.kicker', 'Suggested next')}
          title={t(
            'tour.journey.more.section_title',
            'Stay in the same posture',
          )}
        />
        <TourRelated tour={tour} embedded omitHeading />
        <Reveal className="mt-14 flex flex-wrap gap-4">
          <Link
            to={ROUTES.TOUR.INDEX}
            className="rounded-full border border-charcoal/15 px-6 py-3 text-sm font-semibold text-charcoal transition hover:border-forest/40"
          >
            {t('tour.journey.more.back_tours', 'Back to all journeys')}
          </Link>
          <Link
            to={ROUTES.DESTINATION.SEARCH}
            className="rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-sand-50 shadow-[var(--shadow-soft)] transition hover:bg-charcoal/90"
          >
            {t('tour.journey.more.browse_destinations', 'Browse destinations')}
          </Link>
        </Reveal>
      </section>

      <JourneyMobileInquiryBar
        tour={tour}
        onOpenBooking={() => setBookingOpen(true)}
      />

      <JourneyBookingShell
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        tour={tour}
      />
    </article>
  );
};

const TourDetailSkeleton = () => (
  <div className="w-full animate-pulse bg-sand-50">
    <div className="min-h-[70svh] bg-sand-200/80" />
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-10">
      <div className="mb-8 h-10 max-w-xs rounded-full bg-sand-200" />
      <div className="h-40 rounded-[1.5rem] bg-sand-200" />
    </div>
  </div>
);

type TourDetailErrorProps = {
  title: string;
  description: string;
};

const TourDetailError = ({ title, description }: TourDetailErrorProps) => (
  <div className="bg-sand-50 px-4 py-24 text-center">
    <h2 className="font-display text-2xl font-semibold text-charcoal">
      {title}
    </h2>
    <p className="mt-2 text-sm text-mist">{description}</p>
  </div>
);

export default TourDetailPage;

