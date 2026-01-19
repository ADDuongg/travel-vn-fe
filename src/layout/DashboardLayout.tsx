import { MainLayout } from '@/layout';
import { ResponsiveH1 } from '@components/ui/typography';
import { Outlet } from 'react-router-dom';
import SidebarDashboard from './SidebarDashboard';
import { Separator } from '@components/ui/separator';
import DashboardBreadcrumbs from './DashboardBreadcrumbs';

const DashboardLayout = () => {
  return (
    <MainLayout>
      <div className="bg-background_paleGray p-8 md:p-16 text-center space-y-3">
        <ResponsiveH1 className="font-dm-serif-display">Dashboard</ResponsiveH1>
      </div>
      <div className="lg:flex hidden min-h-[60vh] ">
        {/* Sidebar */}
        <aside className=" w-[260px] shrink-0 px-6 py-8">
          <SidebarDashboard />
        </aside>

        <Separator orientation="vertical" className=" w-px" />

        <main className="flex-1 px-4 md:px-8 lg:px-12 py-6 lg:py-8 ">
          <div className="flex-1 space-y-6">
            <DashboardBreadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile: sidebar nằm trên, nội dung dưới */}
      <div className="lg:hidden px-4 md:px-8 py-6 space-y-6">
        <SidebarDashboard />
        <Separator />
        <Outlet />
      </div>
    </MainLayout>
  );
};

export default DashboardLayout;
