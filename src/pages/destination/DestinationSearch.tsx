import { MainLayout } from '@/layout';
import Container from '@components/Container';
import CardSearching from '@components/CardSearching';
import { ResponsiveH1 } from '@components/ui/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FilterComponent from '../../components/FilterComponent';
import { ToursItem } from '../../mock';

const DestinationSearchPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      {}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary/90 to-slate-800 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920')" }}
        />
        <Container className="relative py-20 md:py-28 text-center">
          <ResponsiveH1 className="font-dm-serif-display mb-4 text-white drop-shadow-sm">
            {t('destination_page.title')}
          </ResponsiveH1>
          <p className="mx-auto max-w-2xl text-base text-white/90 sm:text-lg">
            {t('destination_page.subtitle')}
          </p>
        </Container>
      </section>

      {}
      <Container>
        <div className="flex flex-col gap-8 py-10 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-80">
            <div className="sticky top-36 rounded-2xl border bg-card p-6 shadow-lg">
              <FilterComponent />
            </div>
          </aside>
          <main className="min-w-0 flex-1">
            <div className="grid grid-cols-1 justify-items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {ToursItem.map((item) => (
                <CardSearching key={item.id} item={item} />
              ))}
            </div>
          </main>
        </div>
      </Container>
    </MainLayout>
  );
};

export default DestinationSearchPage;

