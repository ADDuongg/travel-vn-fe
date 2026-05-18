import { MainLayout } from '@/layout';
import { ResponsiveH1 } from '@components/ui/typography';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ListLayout = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920')] bg-cover bg-center opacity-30" />
        <div className="relative px-6 py-20 md:py-28 text-center">
          <ResponsiveH1 className="font-dm-serif-display text-white mb-4">
            {t('list_page.title', 'Discover')}
          </ResponsiveH1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {t(
              'list_page.subtitle',
              'Explore tours, rooms and hotels across Vietnam',
            )}
          </p>
        </div>
      </div>
      <Outlet />
    </MainLayout>
  );
};

export default ListLayout;

