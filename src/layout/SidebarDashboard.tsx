import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ROUTES } from '@/constants/router';
import { useLogout } from '@/features/auth/hooks';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  FileText,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  UserPen,
  UserRound,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

const dashActive =
  'bg-[#1E3A8A] text-white shadow-md shadow-[#1E3A8A]/15 ring-1 ring-[#1E3A8A]/20';
const dashIdle =
  'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-100/90';

const linkBase =
  'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none';

const NavItem = ({
  to,
  end,
  children,
  onNavigate,
}: {
  to: string;
  end?: boolean;
  children: ReactNode;
  onNavigate?: () => void;
}) => (
  <NavLink
    to={to}
    end={end}
    onClick={() => onNavigate?.()}
    className={({ isActive }) => cn(linkBase, isActive ? dashActive : dashIdle)}
  >
    {children}
  </NavLink>
);

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
    {children}
  </p>
);

export type SidebarDashboardProps = {
  /** Close mobile drawer after navigation */
  onNavigate?: () => void;
  layout?: 'desktop' | 'mobile';
};

const SidebarDashboard = ({
  onNavigate,
  layout = 'desktop',
}: SidebarDashboardProps) => {
  const { logout, isPending } = useLogout();

  return (
    <nav
      className={cn('text-sm', layout === 'mobile' ? 'space-y-5' : 'space-y-6')}
      aria-label="Dashboard navigation"
    >
      <div>
        <SectionLabel>Tài khoản</SectionLabel>
        <div className="space-y-1">
          <NavItem to={ROUTES.DASHBOARD.INDEX} end onNavigate={onNavigate}>
            <LayoutDashboard
              className="size-4 shrink-0 opacity-90"
              aria-hidden
            />
            Tổng quan
          </NavItem>
          <NavItem to={ROUTES.DASHBOARD.PROFILE} onNavigate={onNavigate}>
            <UserPen className="size-4 shrink-0 opacity-90" aria-hidden />
            Chỉnh sửa hồ sơ
          </NavItem>
          <NavItem
            to={ROUTES.DASHBOARD.TOUR_GUIDE_REGISTER}
            onNavigate={onNavigate}
          >
            <UserRound className="size-4 shrink-0 opacity-90" aria-hidden />
            Hồ sơ hướng dẫn viên
          </NavItem>
          <NavItem
            to={ROUTES.DASHBOARD.CHANGE_PASSWORD}
            onNavigate={onNavigate}
          >
            <KeyRound className="size-4 shrink-0 opacity-90" aria-hidden />
            Đổi mật khẩu
          </NavItem>
        </div>
      </div>

      <div>
        <SectionLabel>Đặt tour</SectionLabel>
        <div className="space-y-1">
          <NavItem to={ROUTES.DASHBOARD.TOUR_BOOKINGS} onNavigate={onNavigate}>
            <BookOpen className="size-4 shrink-0 opacity-90" aria-hidden />
            Đơn tour của tôi
          </NavItem>
          <NavItem to={ROUTES.DASHBOARD.INVOICES} onNavigate={onNavigate}>
            <FileText className="size-4 shrink-0 opacity-90" aria-hidden />
            Hóa đơn tour
          </NavItem>
        </div>
      </div>

      <div>
        <SectionLabel>Đặt phòng</SectionLabel>
        <div className="space-y-1">
          <NavItem to={ROUTES.DASHBOARD.ROOM_BOOKINGS} onNavigate={onNavigate}>
            <BookOpen className="size-4 shrink-0 opacity-90" aria-hidden />
            Đơn phòng của tôi
          </NavItem>
          <NavItem to={ROUTES.DASHBOARD.ROOM_INVOICES} onNavigate={onNavigate}>
            <FileText className="size-4 shrink-0 opacity-90" aria-hidden />
            Hóa đơn phòng
          </NavItem>
        </div>
      </div>

      <div>
        <SectionLabel>Đã lưu</SectionLabel>
        <div className="space-y-1">
          <NavItem to={ROUTES.DASHBOARD.SAVED} onNavigate={onNavigate}>
            <MessageSquareText
              className="size-4 shrink-0 opacity-90"
              aria-hidden
            />
            Đánh giá & Yêu thích
          </NavItem>
        </div>
      </div>

      <Separator className="bg-slate-200" />

      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => {
          logout();
          onNavigate?.();
        }}
        className={cn(
          linkBase,
          'h-auto justify-start border-slate-200 font-medium text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200',
        )}
      >
        <LogOut className="size-4 shrink-0" aria-hidden />
        {isPending ? 'Đang đăng xuất…' : 'Đăng xuất'}
      </Button>

      <div className="rounded-xl border border-slate-200/90 bg-[#F8FAFC] p-4">
        <p className="font-semibold text-[#1E3A8A]">Cần hỗ trợ?</p>
        <p className="mt-1 text-slate-600">1.828.456.345</p>
        <a
          href="mailto:help@traveltourwp.com"
          className="mt-1 inline-flex text-sm font-medium text-[#2563EB] underline-offset-4 transition-colors hover:text-[#1D4ED8] hover:underline"
        >
          help@traveltourwp.com
        </a>
      </div>
    </nav>
  );
};

export default SidebarDashboard;
