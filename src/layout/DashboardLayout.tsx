import { MainLayout } from '@/layout';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import DashboardBreadcrumbs from './DashboardBreadcrumbs';
import SidebarDashboard from './SidebarDashboard';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <MainLayout>
      <div className="font-dashboard-sans bg-[#F8FAFC] min-h-[calc(100vh-4rem)] motion-reduce:transition-none">
        {/* Header — UI UX Pro Max kit: navy primary, airy layout */}
        <header className="border-b border-slate-200/90 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-8">
            <div className="text-left">
              <h1 className="text-2xl font-semibold tracking-tight text-[#1E3A8A] sm:text-3xl">
                Dashboard
              </h1>
              <p className="mt-1 max-w-xl text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">
                Quản lý hồ sơ, đặt tour, phòng và danh sách yêu thích ở một nơi.
              </p>
            </div>

            <div className="shrink-0 lg:hidden">
              <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <DrawerTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full cursor-pointer border-[#1E3A8A]/25 bg-white text-[#1E3A8A] shadow-sm transition-colors duration-200 hover:bg-[#1E3A8A]/5 sm:w-auto sm:min-w-[140px]"
                  >
                    <Menu className="mr-2 size-4 shrink-0" aria-hidden />
                    Menu tài khoản
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[88vh] font-dashboard-sans">
                  <DrawerHeader className="border-b border-slate-100 text-left">
                    <DrawerTitle className="text-[#1E3A8A]">
                      Điều hướng
                    </DrawerTitle>
                  </DrawerHeader>
                  <div
                    className="overflow-y-auto overscroll-contain px-4 pb-8 pt-2"
                    data-vaul-no-drag
                  >
                    <SidebarDashboard
                      onNavigate={() => setMobileMenuOpen(false)}
                      layout="mobile"
                    />
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            <aside className="hidden lg:block lg:w-72 lg:max-w-[18rem] lg:shrink-0">
              <div className="sticky top-24 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <SidebarDashboard layout="desktop" />
              </div>
            </aside>

            <main className="min-w-0 flex-1">
              <div className="mb-4">
                <DashboardBreadcrumbs />
              </div>
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardLayout;
