import { MainLayout } from '@/layout';
import { ResponsiveH1 } from '@components/ui/typography';
import { Outlet } from 'react-router-dom';
import SidebarDashboard from './SidebarDashboard';
import { Separator } from '@components/ui/separator';

const DashboardLayout = () => {
  return (
    <MainLayout>
      <div className="bg-background_paleGray p-8 md:p-16 text-center space-y-3">
        <ResponsiveH1 className="font-dm-serif-display">Dashboard</ResponsiveH1>
      </div>

      <div className="flex flex-col lg:flex-row h-full">
        <div className="w-full lg:w-1/5 px-4 md:px-8 lg:px-12 py-6 lg:py-8">
          <SidebarDashboard />
        </div>

        <Separator
          orientation="vertical"
          className="hidden lg:block mx-6 w-[1px] self-stretch"
        />

        <div className="flex-1 px-4 md:px-8 lg:px-12 py-6 lg:py-8">
          <Outlet />
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardLayout;
