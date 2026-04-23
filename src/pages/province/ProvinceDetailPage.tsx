import { useMemo } from 'react';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import { AnimatedTabs } from '@/components/AnimatedTabs';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProvinceDetailQuery } from '@/features/provinces/hooks';
import {
  ProvinceGallery,
  ProvinceHeader,
  ProvinceHighlights,
  ProvinceOverview,
  ProvinceSidebar,
  ProvinceWards,
} from '@/sections/province';

export default function ProvinceDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { data: province, isLoading, isError } = useProvinceDetailQuery(slug ?? '');
  const tabs = useMemo(
    () => [
      { id: 'overview', label: t('province.overview', 'Overview') },
      ...(province?.highlights?.length
        ? [{ id: 'highlights', label: t('province.highlights', 'Highlights') }]
        : []),
      ...(province?.gallery?.length || province?.thumbnail
        ? [{ id: 'gallery', label: t('province.gallery', 'Gallery') }]
        : []),
      ...(province?.wards?.length
        ? [{ id: 'wards', label: t('province.districts_wards', 'Districts') }]
        : []),
    ],
    [province?.gallery, province?.highlights, province?.thumbnail, province?.wards, t],
  );

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

      <div className="bg-[#F8F8F6] pb-24 lg:pb-10">
        <Container>
          <ProvinceHeader province={province} />
          <div className="grid grid-cols-1 gap-8 pb-10 pt-6 lg:grid-cols-12 lg:gap-10">
            <div className="min-w-0 space-y-8 lg:col-span-8">
              <ProvinceOverview province={province} />
              <ProvinceHighlights province={province} />
              <ProvinceGallery province={province} />
              <ProvinceWards province={province} />
            </div>
            <aside className="hidden min-w-0 lg:col-span-4 lg:block">
              <ProvinceSidebar province={province} />
            </aside>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}

const ProvinceDetailSkeleton = () => (
  <div className="w-full">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="pt-6">
        <div className="mb-8 h-[360px] animate-pulse rounded-2xl bg-[#e5ded0] md:h-[440px]" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="h-40 animate-pulse rounded-2xl bg-[#e5ded0]" />
            <div className="h-64 animate-pulse rounded-2xl bg-[#e5ded0]" />
          </div>
          <div className="h-72 animate-pulse rounded-2xl bg-[#e5ded0] lg:col-span-4" />
        </div>
      </div>
    </div>
  </div>
);

type ProvinceDetailErrorProps = {
  title: string;
  description: string;
};

const ProvinceDetailError = ({ title, description }: ProvinceDetailErrorProps) => (
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
