import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import { useTourGuideQuery } from '@/features/tour-guide/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import { AnimatedTabs } from '@/components/AnimatedTabs';
import {
  GuideReviews,
  TourGuideFloatingContactBar,
  TourGuideHeader,
  TourGuideOverview,
  TourGuideSidebar,
  getBio,
  getProvinceName,
  getShortBio,
  getSpecialties,
  getSpecialtyItems,
} from '@/sections/tour-guide';

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200';

const TourGuideDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: guide, isLoading, isError } = useTourGuideQuery(id);
  const tabs = [
    { id: 'overview', label: t('tour.detail.tab_overview', 'Overview') },
    { id: 'specialties', label: t('tour_guide.specialties', 'Specialties') },
    { id: 'reviews', label: t('tour.detail.tab_reviews', 'Reviews') },
    { id: 'contact', label: t('tour_guide.contact_info', 'Contact') },
  ];

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
  const avatar =
    guide.user?.avatar?.url ??
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400';
  const coverImage = avatar ?? DEFAULT_COVER;
  const shortBio = getShortBio(guide, language);
  const bio = getBio(guide, language);
  const specialties = getSpecialties(guide, language);
  const specialtyItems = getSpecialtyItems(guide, language);
  const rating = guide.ratingSummary?.average ?? 0;
  const reviewCount = guide.ratingSummary?.total ?? 0;
  const provinceNames = (guide.specializedProvinces ?? []).flatMap((p) => {
    const name = getProvinceName(p, language);
    return name ? [name] : [];
  });

  return (
    <MainLayout>
      <div className="sticky top-[136px] z-20 border-b border-[rgba(28,26,20,0.1)] bg-[#faf7f2]/95 backdrop-blur-md">
        <Container className="max-w-7xl px-4 sm:px-6">
          <AnimatedTabs
            variant="travel"
            tabs={tabs}
            scrollOffset={200}
            omitContainer
          />
        </Container>
      </div>

      <TourGuideHeader
        guide={guide}
        name={name}
        avatar={avatar}
        coverImage={coverImage}
        shortBio={shortBio}
        rating={rating}
        reviewCount={reviewCount}
      />

      <div className="bg-[#F8F8F6] pb-24 lg:pb-10">
        <Container>
          <div className="grid grid-cols-1 gap-8 pb-10 pt-6 lg:grid-cols-12 lg:gap-10">
            <div className="min-w-0 space-y-10 lg:col-span-8">
              <TourGuideOverview
                guide={guide}
                bio={bio}
                specialties={specialties}
                specialtyItems={specialtyItems}
                provinceNames={provinceNames}
              />

              <section id="reviews" className="scroll-mt-44">
                <GuideReviews guide={guide} />
              </section>
            </div>
            <aside className="hidden min-w-0 lg:col-span-4 lg:block">
              <TourGuideSidebar guide={guide} />
            </aside>
          </div>
        </Container>
      </div>
      <TourGuideFloatingContactBar guide={guide} />
    </MainLayout>
  );
};

const TourGuideDetailSkeleton = () => (
  <div className="w-full">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="pt-2">
        <div className="mb-8 grid min-h-[220px] animate-pulse grid-cols-12 gap-3 md:min-h-[400px] md:gap-4">
          <div className="col-span-12 rounded-2xl bg-[#e5ded0] md:col-span-8" />
          <div className="col-span-12 grid min-h-[180px] grid-cols-2 grid-rows-2 gap-3 md:col-span-4 md:min-h-0 md:gap-4">
            <div className="rounded-xl bg-[#e5ded0]" />
            <div className="rounded-xl bg-[#e5ded0]" />
            <div className="rounded-xl bg-[#e5ded0]" />
            <div className="rounded-xl bg-[#e5ded0]" />
          </div>
        </div>
        <div className="h-8 max-w-md animate-pulse rounded bg-[#e5ded0]" />
      </div>
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
  <div className="px-4 py-24 text-center">
    <h2
      className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1c1a14]"
      style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
    >
      {title}
    </h2>
    <p className="mt-2 text-sm text-[rgba(28,26,20,0.6)]">{description}</p>
  </div>
);

export default TourGuideDetail;
