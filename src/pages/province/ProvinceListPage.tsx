import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import { ProvinceCard } from '@/sections/province/ProvinceCard';
import { ProvinceFilter } from '@/sections/province/ProvinceFilter';
import { useProvincesListQuery } from '@/features/provinces/hooks';
import { FaCompass } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

export default function ProvinceListPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const params = useMemo(() => {
    const p: Record<string, string | number | boolean | undefined> = {
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 34,
      sort: (searchParams.get('sort') as 'name' | 'displayOrder' | 'newest') || 'name',
    };
    const region = searchParams.get('region');
    if (region && ['NORTH', 'CENTRAL', 'SOUTH'].includes(region)) {
      p.region = region;
    }
    const isPopular = searchParams.get('isPopular');
    if (isPopular === 'true') p.isPopular = true;
    if (isPopular === 'false') p.isPopular = false;
    const search = searchParams.get('search');
    if (search?.trim()) p.search = search.trim();
    return p;
  }, [searchParams]);

  const { data, isLoading, error } = useProvincesListQuery(params);
  const items = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <MainLayout>
      {/* Header – Province Discovery style */}
      <header className="flex items-center justify-between border-b border-[#dbe6df] dark:border-[#1e3a29] px-6 lg:px-16 py-3 bg-white dark:bg-[#102216]">
        <div className="flex items-center gap-4 text-[#111813] dark:text-white">
          <div className="size-6 text-primary flex items-center justify-center">
            <FaCompass className="text-2xl" />
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
            {t('province.title', 'Province Discovery')}
          </h2>
        </div>
      </header>

      {/* Content – bg Province Discovery */}
      <div className="bg-[#f6f8f6] dark:bg-[#102216] min-h-screen">
        <Container className="py-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar filter – sticky */}
            <aside className="w-full shrink-0 lg:w-80">
              <div className="sticky top-24 rounded-xl border border-[#dbe6df] dark:border-[#1e3a29] bg-white dark:bg-[#162d1d] p-6 shadow-sm">
                <ProvinceFilter />
              </div>
            </aside>

            {/* Main grid */}
            <main className="min-w-0 flex-1">
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-64 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"
                    />
                  ))}
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-destructive">
                  {String(error)}
                </div>
              )}

              {!isLoading && !error && items.length === 0 && (
                <div className="rounded-xl border border-[#dbe6df] dark:border-[#1e3a29] bg-white dark:bg-[#162d1d] p-12 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('province.no_results', 'No provinces found.')}
                  </p>
                </div>
              )}

              {!isLoading && !error && items.length > 0 && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-[#61896f] dark:text-gray-400">
                      {t('province.showing_count', {
                        count: items.length,
                        total: pagination?.total ?? items.length,
                        defaultValue: `Showing {{count}} of {{total}} provinces`,
                      })}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <ProvinceCard key={item._id} item={item} variant="compact" />
                    ))}
                  </div>
                </>
              )}
            </main>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
