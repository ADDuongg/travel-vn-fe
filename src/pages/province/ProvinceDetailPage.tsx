import { MainLayout } from '@/layout';
import { ProvinceHeader } from '@/sections/province/ProvinceHeader';
import { ProvinceOverview } from '@/sections/province/ProvinceOverview';
import { ProvinceGallery } from '@/sections/province/ProvinceGallery';
import { ProvinceWards } from '@/sections/province/ProvinceWards';
import { AnimatedTabs } from '@/components/AnimatedTabs';
import { FaCompass } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';

const PROVINCE_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'wards', label: 'Districts' },
];

export default function ProvinceDetailPage() {
  return (
    <MainLayout>
      {/* Top bar – Province Discovery style */}
      <header className="flex items-center justify-between border-b border-[#dbe6df] dark:border-[#1e3a29] px-6 lg:px-16 py-3 bg-white dark:bg-[#102216]">
        <div className="flex items-center gap-4 text-[#111813] dark:text-white">
          <Link
            to={ROUTES.PROVINCE.INDEX}
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <FaCompass className="text-2xl text-primary" />
            <span className="text-lg font-bold">Province Discovery</span>
          </Link>
        </div>
      </header>

      {/* Sticky sub-nav – AnimatedTabs style (đồng bộ với Tour/Room detail) */}
      <div className="sticky top-[136px] z-40 border-b border-[#dbe6df] dark:border-[#1e3a29] bg-white dark:bg-[#102216]">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <AnimatedTabs
            tabs={PROVINCE_TABS}
            defaultActiveId="overview"
            omitContainer
            scrollOffset={120}
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#f6f8f6] dark:bg-[#102216] min-h-screen">
        <main className="max-w-[1200px] mx-auto pb-20">
          <ProvinceHeader />
          <ProvinceOverview />
          <ProvinceGallery />
          <ProvinceWards />
        </main>
      </div>
    </MainLayout>
  );
}
