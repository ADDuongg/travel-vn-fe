import { useMemo, useRef } from 'react';
import { useHeroScrollNavReveal } from '@/components/home-editorial/useHeroScrollNavReveal';
import { MainLayout } from '@/layout';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProvinceDetailQuery } from '@/features/provinces/hooks';
import {
  getMergedProvinceImages,
  ProvinceAtmosphereSection,
  ProvinceDetailFloatingNav,
  type ProvinceDetailNavItem,
  ProvinceDetailHero,
  ProvinceGallery,
  ProvinceHighlights,
  ProvinceInsightsSection,
  ProvinceIntroSection,
  ProvinceJourneysSection,
  ProvinceStorySection,
  ProvinceTimingSection,
  ProvinceWards,
} from '@/sections/province';

export default function ProvinceDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const {
    data: province,
    isLoading,
    isError,
  } = useProvinceDetailQuery(slug ?? '');
  const heroRef = useRef<HTMLElement | null>(null);
  const navVisible = useHeroScrollNavReveal(heroRef);

  const images = useMemo(
    () => (province ? getMergedProvinceImages(province) : []),
    [province],
  );

  const navItems = useMemo((): ProvinceDetailNavItem[] => {
    if (!province) return [];
    return [
      { id: 'intro', label: t('province.detail.nav_intro') },
      { id: 'story', label: t('province.detail.nav_story') },
      { id: 'highlights', label: t('province.detail.nav_highlights') },
      { id: 'gallery', label: t('province.detail.nav_gallery') },
      { id: 'atmosphere', label: t('province.detail.nav_atmosphere') },
      { id: 'wards', label: t('province.detail.nav_wards') },
      { id: 'insights', label: t('province.detail.nav_insights') },
      { id: 'timing', label: t('province.detail.nav_timing') },
      { id: 'journeys', label: t('province.detail.nav_journeys') },
    ];
  }, [province, t]);

  if (!slug) {
    return (
      <MainLayout>
        <ProvinceDetailError
          title={t('province.not_found', 'Province not found')}
          description={t(
            'province.not_found_desc',
            'This province may have been removed or the link is incorrect.',
          )}
        />
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <ProvinceDetailSkeleton />
      </MainLayout>
    );
  }

  if (isError || !province) {
    return (
      <MainLayout>
        <ProvinceDetailError
          title={t('province.not_found', 'Province not found')}
          description={t(
            'province.not_found_desc',
            'This province may have been removed or the link is incorrect.',
          )}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <article className="bg-sand-50 pb-24">
        <ProvinceDetailHero province={province} heroRef={heroRef} />
        <ProvinceDetailFloatingNav visible={navVisible} items={navItems} />
        <ProvinceIntroSection province={province} images={images} />
        <ProvinceStorySection province={province} />
        <ProvinceHighlights province={province} />
        <ProvinceGallery province={province} />
        <ProvinceAtmosphereSection province={province} images={images} />
        <ProvinceWards province={province} />
        <ProvinceInsightsSection province={province} />
        <ProvinceTimingSection province={province} />
        <ProvinceJourneysSection province={province} />
      </article>
    </MainLayout>
  );
}

const ProvinceDetailSkeleton = () => (
  <div className="w-full bg-sand-50">
    <div className="min-h-[100svh] animate-pulse bg-sand-200" />
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 md:px-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-3 w-24 animate-pulse rounded bg-sand-200" />
          <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-sand-200" />
          <div className="h-24 animate-pulse rounded-lg bg-sand-200" />
        </div>
        <div className="aspect-[4/5] animate-pulse rounded-[2rem] bg-sand-200 md:min-h-[320px]" />
      </div>
      <div className="h-48 animate-pulse rounded-[2rem] bg-sand-200" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-72 animate-pulse rounded-[1.75rem] bg-sand-200" />
        <div className="h-72 animate-pulse rounded-[1.75rem] bg-sand-200" />
        <div className="h-72 animate-pulse rounded-[1.75rem] bg-sand-200" />
      </div>
    </div>
  </div>
);

type ProvinceDetailErrorProps = {
  title: string;
  description: string;
};

const ProvinceDetailError = ({
  title,
  description,
}: ProvinceDetailErrorProps) => (
  <div className="px-4 py-24 text-center">
    <h2 className="font-display text-2xl font-bold text-charcoal">{title}</h2>
    <p className="mt-2 text-sm text-mist">{description}</p>
  </div>
);

