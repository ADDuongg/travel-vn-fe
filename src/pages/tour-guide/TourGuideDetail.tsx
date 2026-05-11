import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useHeroScrollNavReveal } from '@/components/home-editorial/useHeroScrollNavReveal';
import { Reveal } from '@/components/home-editorial/Reveal';
import { ROUTES } from '@/constants/router';
import { useReviewsQuery } from '@/features/review/hooks';
import { ReviewEntityType } from '@/features/review/types';
import { useTourGuideQuery } from '@/features/tour-guide/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import { MainLayout } from '@/layout';
import {
  GuideReviews,
  TourGuideDetailArchivalStrip,
  TourGuideDetailFloatingNav,
  TourGuideDetailGalleryGrid,
  TourGuideDetailHero,
  TourGuideDetailMobileBar,
  TourGuideDetailPlanBand,
  TourGuideDetailPresenceSection,
  TourGuideDetailRhythmSection,
  TourGuideDetailShareRow,
  TourGuideDetailStorySection,
  TourGuideDetailVoiceSection,
  TourGuideDetailWindowsSection,
  getBio,
  getProvinceName,
  getShortBio,
  getSpecialties,
  getSpecialtyItems,
  pickFeaturedGuideReview,
  splitBioToParagraphs,
} from '@/sections/tour-guide';

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200';
const TourGuideDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const heroRef = useRef<HTMLElement | null>(null);
  const navVisible = useHeroScrollNavReveal(heroRef, 0.88);
  const { data: guide, isLoading, isError } = useTourGuideQuery(id);
  const { data: reviews = [] } = useReviewsQuery(
    {
      entityType: ReviewEntityType.GUIDE,
      entityId: guide?._id ?? '',
    },
    { enabled: !!guide?._id },
  );

  const featuredReview = useMemo(
    () => pickFeaturedGuideReview(reviews),
    [reviews],
  );

  const navItems = useMemo(() => {
    if (!guide) return [];
    const bioText = getBio(guide, language);
    const shortBio = getShortBio(guide, language);
    const paras = splitBioToParagraphs(bioText);
    const storyQuoteCandidate =
      shortBio?.trim() &&
      (paras.length === 0 || paras[0].trim() !== shortBio.trim())
        ? shortBio.trim()
        : undefined;
    const hasStory =
      paras.length > 0 ||
      !!storyQuoteCandidate ||
      (!!shortBio?.trim() && paras.length === 0);

    const specItems = getSpecialtyItems(guide, language);
    const specText = getSpecialties(guide, language);
    const hasSpecialties =
      specItems.length > 0 ||
      !!specText ||
      (guide.certifications?.length ?? 0) > 0;

    const hasRhythm =
      (guide.contactMethods?.length ?? 0) > 0 ||
      (guide.responseRate ?? 0) > 0;

    const hasGallery = (guide.gallery?.length ?? 0) > 0;

    const items: { id: string; label: string }[] = [];
    if (hasStory) {
      items.push({
        id: 'story',
        label: t('tour_guide.detail.nav_story'),
      });
    }
    if (hasSpecialties) {
      items.push({
        id: 'presence',
        label: t('tour_guide.detail.nav_presence'),
      });
    }
    if (hasRhythm) {
      items.push({
        id: 'rhythm',
        label: t('tour_guide.detail.nav_rhythm'),
      });
    }
    items.push({
      id: 'windows',
      label: t('tour_guide.detail.nav_windows'),
    });
    if (hasGallery) {
      items.push({
        id: 'gallery',
        label: t('tour_guide.detail.nav_gallery'),
      });
    }
    if (featuredReview) {
      items.push({
        id: 'voice',
        label: t('tour_guide.detail.nav_voice'),
      });
    }
    items.push(
      { id: 'reviews', label: t('tour_guide.detail.nav_reviews') },
      { id: 'plan', label: t('tour_guide.detail.nav_plan') },
    );
    return items;
  }, [guide, language, t, featuredReview]);

  if (isLoading) {
    return (
      <MainLayout>
        <TourGuideDetailSkeleton />
      </MainLayout>
    );
  }

  if (isError || !guide) {
    return (
      <MainLayout>
        <TourGuideDetailError
          title={t('tour_guide.not_found', 'Guide not found')}
          description={t(
            'tour_guide.not_found_desc',
            'This guide may have been removed or the link is incorrect.',
          )}
        />
      </MainLayout>
    );
  }

  const name = guide.user?.fullName ?? t('tour_guide.defaultName');
  const firstName = name.split(/\s+/)[0] ?? name;
  const heroImage =
    guide.user?.avatar?.url ?? guide.gallery?.[0]?.url ?? DEFAULT_COVER;

  const bioText = getBio(guide, language);
  const shortBio = getShortBio(guide, language);
  const storyParas = splitBioToParagraphs(bioText);
  const storyQuote =
    shortBio?.trim() &&
    (storyParas.length === 0 || storyParas[0].trim() !== shortBio.trim())
      ? shortBio.trim()
      : undefined;
  const storyParagraphsOnly =
    storyParas.length > 0
      ? storyParas
      : !storyQuote && shortBio?.trim()
        ? [shortBio.trim()]
        : [];

  const storyLead = shortBio ?? storyParagraphsOnly[0];
  const specialties = getSpecialties(guide, language);
  const rating = guide.ratingSummary?.average ?? 0;
  const reviewCount = guide.ratingSummary?.total ?? 0;
  const provinceNames = (guide.specializedProvinces ?? []).flatMap((p) => {
    const provinceName = getProvinceName(p, language);
    return provinceName ? [provinceName] : [];
  });
  const provinceLine = provinceNames.join(' · ');

  const specItems = getSpecialtyItems(guide, language);
  const specText = getSpecialties(guide, language);
  const hasSpecialties =
    specItems.length > 0 ||
    !!specText ||
    (guide.certifications?.length ?? 0) > 0;

  const specialtyLines =
    specItems.length > 0
      ? specItems
      : specText
        ? specText.split(/[.;\n]+/).map((s) => s.trim()).filter(Boolean)
        : [];

  const galleryImages = (guide.gallery ?? []).filter((g) => g.url);

  const voiceAttribution = featuredReview
    ? featuredReview.isAnonymous
      ? t('tour_guide.detail.voice_anonymous')
      : featuredReview.user?.name ?? t('tour_guide.detail.voice_traveler')
    : '';

  const showStoryBlock =
    storyParagraphsOnly.length > 0 ||
    !!storyQuote ||
    (!!shortBio?.trim() && storyParagraphsOnly.length === 0);

  return (
    <MainLayout>
      <article className="relative bg-sand-50 pb-28 lg:pb-16">
        <TourGuideDetailHero
          ref={heroRef}
          guide={guide}
          name={name}
          heroImage={heroImage}
          storyLead={storyLead}
          rating={rating}
          reviewCount={reviewCount}
        />

        <TourGuideDetailFloatingNav visible={navVisible} items={navItems} />

        <section className="mx-auto max-w-6xl scroll-mt-28 px-4 pt-14 md:px-10 md:pt-16">
          <TourGuideDetailShareRow guideId={guide._id} guideName={name} />
          <TourGuideDetailArchivalStrip
            guide={guide}
            provinceLine={provinceLine}
            rating={rating}
            reviewCount={reviewCount}
          />
        </section>

        {showStoryBlock ? (
          <TourGuideDetailStorySection
            bio={
              storyParagraphsOnly.length > 0
                ? storyParagraphsOnly.join('\n\n')
                : undefined
            }
            quote={storyQuote}
          />
        ) : null}

        <TourGuideDetailPresenceSection
          show={hasSpecialties}
          guide={guide}
          specialtyLines={specialtyLines}
          specialtiesText={specialties}
        />

        <TourGuideDetailRhythmSection guide={guide} />

        <TourGuideDetailWindowsSection />

        <TourGuideDetailGalleryGrid guide={guide} images={galleryImages} />

        {featuredReview ? (
          <TourGuideDetailVoiceSection
            featured={featuredReview}
            attribution={voiceAttribution}
          />
        ) : null}

        <section
          id="reviews"
          className="mx-auto max-w-6xl scroll-mt-28 px-4 py-20 md:px-10 md:py-28"
        >
          <Reveal className="mb-14 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('tour_guide.detail.reviews_kicker')}
            </p>
            <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
              {t('tour_guide.detail.reviews_title')}
            </h2>
            <p className="max-w-2xl text-mist">
              {t('tour_guide.detail.reviews_lead')}
            </p>
          </Reveal>
          <GuideReviews guide={guide} embedded />
        </section>

        <TourGuideDetailPlanBand guide={guide} firstName={firstName} />

        <section className="mx-auto max-w-6xl px-4 pb-28 md:px-10 md:pb-36">
          <Reveal className="flex flex-wrap gap-4">
            <Link
              to={ROUTES.TOUR_GUIDE.INDEX}
              className="rounded-full border border-charcoal/15 px-6 py-3 text-sm font-semibold text-charcoal transition hover:border-forest/40"
            >
              {t('tour_guide.detail.footer_back_guides')}
            </Link>
            <Link
              to={ROUTES.TOUR.INDEX}
              className="rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-sand-50 shadow-[var(--shadow-soft)] transition hover:bg-charcoal/90"
            >
              {t('tour_guide.detail.footer_browse_tours')}
            </Link>
          </Reveal>
        </section>

        <TourGuideDetailMobileBar guide={guide} />
      </article>
    </MainLayout>
  );
};

const TourGuideDetailSkeleton = () => (
  <div className="w-full bg-sand-50">
    <div className="min-h-[100svh] animate-pulse bg-sand-200" />
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 md:px-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-3 w-24 animate-pulse rounded bg-sand-200" />
          <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-sand-200" />
          <div className="h-24 animate-pulse rounded-lg bg-sand-200" />
        </div>
        <div className="aspect-[4/5] animate-pulse rounded-[2rem] bg-sand-200 md:min-h-[280px]" />
      </div>
      <div className="h-48 animate-pulse rounded-[2rem] bg-sand-200" />
    </div>
  </div>
);

type TourGuideDetailErrorProps = {
  title: string;
  description: string;
};

const TourGuideDetailError = ({
  title,
  description,
}: TourGuideDetailErrorProps) => (
  <div className="bg-sand-50 px-4 py-24 text-center">
    <h2 className="font-display text-2xl font-bold text-charcoal">{title}</h2>
    <p className="mt-2 text-sm text-mist">{description}</p>
  </div>
);

export default TourGuideDetail;
