import React, { useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHeroScrollNavReveal } from '@/components/home-editorial/useHeroScrollNavReveal';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import { useTourGuideQuery } from '@/features/tour-guide/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import {
  GuideReviews,
  TourGuideDetailFloatingNav,
  TourGuideFloatingContactBar,
  TourGuideGalleryCollage,
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
  const heroRef = useRef<HTMLElement | null>(null);
  const navVisible = useHeroScrollNavReveal(heroRef);
  const { data: guide, isLoading, isError } = useTourGuideQuery(id);

  const navItems = useMemo(() => {
    if (!guide) return [];
    const specItems = getSpecialtyItems(guide, language);
    const specText = getSpecialties(guide, language);
    const hasSpecialties =
      specItems.length > 0 ||
      !!specText ||
      (guide.certifications?.length ?? 0) > 0;
    const items: { id: string; label: string }[] = [
      { id: 'overview', label: t('tour.detail.tab_overview', 'Overview') },
    ];
    if (hasSpecialties) {
      items.push({
        id: 'specialties',
        label: t('tour_guide.specialties', 'Specialties'),
      });
    }
    const gallery = guide.gallery ?? [];
    const collageStart = guide.gallery?.[0]?.url ? 1 : 0;
    if (gallery.slice(collageStart).length > 0) {
      items.push({ id: 'gallery', label: t('tour_guide.gallery', 'Gallery') });
    }
    items.push(
      { id: 'reviews', label: t('tour.detail.tab_reviews', 'Reviews') },
      { id: 'contact', label: t('tour_guide.contact_info', 'Contact') },
    );
    return items;
  }, [guide, language, t]);

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
  const environmentalCover = guide.gallery?.[0]?.url;
  const coverImage = environmentalCover ?? avatar ?? DEFAULT_COVER;
  const galleryCollageStartIndex = environmentalCover ? 1 : 0;
  const shortBio = getShortBio(guide, language);
  const bio = getBio(guide, language);
  const specialties = getSpecialties(guide, language);
  const specialtyItems = getSpecialtyItems(guide, language);
  const rating = guide.ratingSummary?.average ?? 0;
  const reviewCount = guide.ratingSummary?.total ?? 0;
  const provinceNames = (guide.specializedProvinces ?? []).flatMap((p) => {
    const provinceName = getProvinceName(p, language);
    return provinceName ? [provinceName] : [];
  });

  return (
    <MainLayout>
      <article className="bg-sand-50 pb-24">
        <TourGuideHeader
          ref={heroRef}
          guide={guide}
          name={name}
          avatar={avatar}
          coverImage={coverImage}
          shortBio={shortBio}
          rating={rating}
          reviewCount={reviewCount}
        />

        <TourGuideDetailFloatingNav visible={navVisible} items={navItems} />

        <div className="pb-24 lg:pb-10">
          <Container>
            <div className="grid grid-cols-1 gap-12 pb-10 pt-10 lg:grid-cols-12 lg:gap-14 lg:pt-14">
              <div className="min-w-0 space-y-16 md:space-y-20 lg:col-span-7 xl:col-span-8">
                <TourGuideOverview
                  guide={guide}
                  bio={bio}
                  specialties={specialties}
                  specialtyItems={specialtyItems}
                  provinceNames={provinceNames}
                />

                <TourGuideGalleryCollage
                  guide={guide}
                  startIndex={galleryCollageStartIndex}
                />

                <section id="reviews" className="scroll-mt-44">
                  <GuideReviews guide={guide} />
                </section>
              </div>

              <aside className="hidden min-w-0 lg:col-span-5 xl:col-span-4 lg:block">
                <TourGuideSidebar guide={guide} />
              </aside>
            </div>
          </Container>
        </div>
        <TourGuideFloatingContactBar guide={guide} />
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
