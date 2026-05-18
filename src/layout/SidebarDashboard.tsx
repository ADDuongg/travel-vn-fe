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
  'border-charcoal/12 border-l-forest bg-sand-50/95 text-charcoal shadow-soft ring-1 ring-charcoal/8';

const dashIdle =
  'border-l-transparent text-charcoal/75 hover:bg-charcoal/4 hover:text-charcoal active:bg-charcoal/6';

const linkBase =
  'flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent border-l-2 px-3 py-2.5 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

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
  <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/45">
    {children}
  </p>
);

export type SidebarDashboardProps = {

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
              className="size-4 shrink-0 text-charcoal/60"
              aria-hidden
            />
            Tổng quan
          </NavItem>
          <NavItem to={ROUTES.DASHBOARD.PROFILE} onNavigate={onNavigate}>
            <UserPen className="size-4 shrink-0 text-charcoal/60" aria-hidden />
            Chỉnh sửa hồ sơ
          </NavItem>
          <NavItem
            to={ROUTES.DASHBOARD.TOUR_GUIDE_REGISTER}
            onNavigate={onNavigate}
          >
            <UserRound className="size-4 shrink-0 text-charcoal/60" aria-hidden />
            Hồ sơ hướng dẫn viên
          </NavItem>
          <NavItem
            to={ROUTES.DASHBOARD.CHANGE_PASSWORD}
            onNavigate={onNavigate}
          >
            <KeyRound className="size-4 shrink-0 text-charcoal/60" aria-hidden />
            Đổi mật khẩu
          </NavItem>
        </div>
      </div>

      <div>
        <SectionLabel>Đặt tour</SectionLabel>
        <div className="space-y-1">
          <NavItem to={ROUTES.DASHBOARD.TOUR_BOOKINGS} onNavigate={onNavigate}>
            <BookOpen className="size-4 shrink-0 text-charcoal/60" aria-hidden />
            Đơn tour của tôi
          </NavItem>
          <NavItem to={ROUTES.DASHBOARD.INVOICES} onNavigate={onNavigate}>
            <FileText className="size-4 shrink-0 text-charcoal/60" aria-hidden />
            Hóa đơn tour
          </NavItem>
        </div>
      </div>

      <div>
        <SectionLabel>Đặt phòng</SectionLabel>
        <div className="space-y-1">
          <NavItem to={ROUTES.DASHBOARD.ROOM_BOOKINGS} onNavigate={onNavigate}>
            <BookOpen className="size-4 shrink-0 text-charcoal/60" aria-hidden />
            Đơn phòng của tôi
          </NavItem>
          <NavItem to={ROUTES.DASHBOARD.ROOM_INVOICES} onNavigate={onNavigate}>
            <FileText className="size-4 shrink-0 text-charcoal/60" aria-hidden />
            Hóa đơn phòng
          </NavItem>
        </div>
      </div>

      <div>
        <SectionLabel>Đã lưu</SectionLabel>
        <div className="space-y-1">
          <NavItem to={ROUTES.DASHBOARD.SAVED} onNavigate={onNavigate}>
            <MessageSquareText
              className="size-4 shrink-0 text-charcoal/60"
              aria-hidden
            />
            Đánh giá & Yêu thích
          </NavItem>
        </div>
      </div>

      <Separator className="bg-charcoal/10" />

      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => {
          logout();
          onNavigate?.();
        }}
        className={cn(
          'flex h-auto w-full cursor-pointer items-center justify-start gap-3 rounded-xl border border-charcoal/15 bg-transparent px-3 py-2.5 text-sm font-medium text-charcoal/85 transition-colors duration-200 hover:border-red-200/80 hover:bg-red-50/90 hover:text-red-800 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30 focus-visible:ring-offset-2',
        )}
      >
        <LogOut className="size-4 shrink-0" aria-hidden />
        {isPending ? 'Đang đăng xuất…' : 'Đăng xuất'}
      </Button>

      <div className="rounded-2xl border border-charcoal/10 bg-sand-50/90 p-4 shadow-soft">
        <p className="font-display text-base font-semibold tracking-tight text-charcoal">
          Cần hỗ trợ?
        </p>
        <p className="mt-1.5 text-sm tabular-nums text-charcoal/65">
          1.828.456.345
        </p>
        <a
          href="mailto:help@traveltourwp.com"
          className="mt-1.5 inline-flex text-sm font-medium text-forest underline-offset-4 transition-colors hover:text-forest/85 hover:underline"
        >
          help@traveltourwp.com
        </a>
      </div>
    </nav>
  );
};

export default SidebarDashboard;

