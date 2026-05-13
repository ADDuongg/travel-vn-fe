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
      <div className="min-h-[calc(100vh-4rem)] bg-sand-50/50 font-dashboard-sans motion-reduce:transition-none">
        <header className="border-b border-charcoal/10 bg-card/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 pb-6 pt-24 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:pb-8 lg:pt-32">
            <div className="text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal/45">
                Đất Việt · Không gian của bạn
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-charcoal sm:text-[2rem]">
                Dashboard
              </h1>
              <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-charcoal/60 sm:text-base">
                Quản lý hồ sơ, đặt tour, phòng và danh sách yêu thích ở một nơi.
              </p>
            </div>

            <div className="shrink-0 lg:hidden">
              <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <DrawerTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full cursor-pointer border-charcoal/15 bg-sand-50/80 text-charcoal shadow-soft transition-colors duration-200 hover:bg-charcoal/4 sm:w-auto sm:min-w-[140px]"
                  >
                    <Menu className="mr-2 size-4 shrink-0" aria-hidden />
                    Menu tài khoản
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[88vh] font-dashboard-sans">
                  <DrawerHeader className="border-b border-charcoal/10 text-left">
                    <DrawerTitle className="font-display text-lg text-charcoal">
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
              <div className="sticky top-24 rounded-2xl border border-charcoal/10 bg-card p-4 shadow-soft transition-shadow duration-200 hover:shadow-[var(--shadow-soft)]">
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
