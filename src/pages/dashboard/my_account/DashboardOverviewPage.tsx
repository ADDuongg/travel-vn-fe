import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMe } from '@/features/auth/hooks';
import { ROUTES } from '@/constants/router';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  BookOpen,
  Heart,
  MapPin,
  Sparkles,
  UserPen,
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString();
};

type QuickLink = {
  to: string;
  title: string;
  description: string;
  icon: React.ElementType;
};

const quickLinks: QuickLink[] = [
  {
    to: ROUTES.DASHBOARD.PROFILE,
    title: 'Hồ sơ',
    description: 'Cập nhật thông tin cá nhân',
    icon: UserPen,
  },
  {
    to: ROUTES.DASHBOARD.TOUR_BOOKINGS,
    title: 'Tour',
    description: 'Xem đơn và lịch trình',
    icon: BookOpen,
  },
  {
    to: ROUTES.DASHBOARD.ROOM_BOOKINGS,
    title: 'Phòng',
    description: 'Theo dõi đặt phòng',
    icon: MapPin,
  },
  {
    to: `${ROUTES.DASHBOARD.SAVED}?tab=wishlist`,
    title: 'Yêu thích',
    description: 'Danh sách đã lưu',
    icon: Heart,
  },
];

const DashboardOverviewPage: React.FC = () => {
  const { data: me, isLoading } = useMe();

  const name = me?.fullName || me?.username || '—';
  const email = me?.email || '—';
  const phone = me?.phone || '—';
  const birthDate = formatDate(me?.dateOfBirth);
  const addressText = (() => {
    const a = me?.address;
    if (!a) return '—';
    const parts = [a.detail, a.wardCode, a.districtCode, a.provinceId].filter(
      Boolean,
    );
    return parts.length ? parts.join(', ') : '—';
  })();
  const gender = me?.gender ?? '—';

  const initial =
    name !== '—'
      ? name
          .split(/\s+/)
          .slice(0, 2)
          .map((p) => p[0])
          .join('')
          .toUpperCase()
      : '?';

  const hasAvatar = Boolean(me?.avatar?.url);

  return (
    <div className="flex-1 space-y-6 sm:space-y-8">
      {/* Welcome strip — kit colors */}
      <div className="relative overflow-hidden rounded-2xl border border-[#1E3A8A]/15 bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] p-6 text-white shadow-lg shadow-[#1E3A8A]/20 sm:p-8 motion-reduce:transition-none">
        <div
          className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
              <Sparkles className="size-6 text-amber-200" aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                Chào mừng trở lại
                {!isLoading && name !== '—' ? `, ${name.split(/\s+/)[0]}` : ''}
              </h2>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-blue-100 sm:text-base">
                Tóm tắt tài khoản và lối tắt tới các mục hay dùng.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="h-11 cursor-pointer border-0 bg-[#CA8A04] text-white shadow-md transition-colors duration-200 hover:bg-[#B45309] focus-visible:ring-2 focus-visible:ring-amber-200"
          >
            <Link to={ROUTES.DASHBOARD.TOUR_BOOKINGS}>
              Xem đơn tour
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick links */}
      <section aria-labelledby="quick-links-heading">
        <h2
          id="quick-links-heading"
          className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500"
        >
          Lối tắt
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map(({ to, title, description, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={cn(
                  'group flex h-full cursor-pointer flex-col rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all duration-200',
                  'hover:border-[#3B82F6]/35 hover:shadow-md motion-reduce:transition-none',
                )}
              >
                <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#1E3A8A] ring-1 ring-slate-200/80 transition-colors group-hover:bg-[#EFF6FF]">
                  <Icon className="size-5" aria-hidden />
                </div>
                <span className="font-semibold text-[#1E40AF]">{title}</span>
                <span className="mt-1 text-sm leading-snug text-slate-600">
                  {description}
                </span>
                <span className="mt-3 inline-flex items-center text-sm font-medium text-[#2563EB]">
                  Mở
                  <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Profile */}
      <Card className="overflow-hidden rounded-2xl border-slate-200/90 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-3 border-b border-slate-100 bg-[#F8FAFC]/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <CardTitle className="text-lg font-semibold text-[#1E3A8A]">
            Hồ sơ của tôi
          </CardTitle>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="cursor-pointer border-[#1E3A8A]/25 text-[#1E3A8A] hover:bg-[#1E3A8A]/5"
          >
            <Link to={ROUTES.DASHBOARD.PROFILE}>Chỉnh sửa</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex shrink-0 justify-center md:justify-start">
              {hasAvatar ? (
                <img
                  src={me?.avatar?.url}
                  alt={name !== '—' ? `Ảnh đại diện ${name}` : 'Ảnh đại diện'}
                  className="size-24 rounded-2xl border border-slate-200 object-cover shadow-sm sm:size-28"
                />
              ) : (
                <div
                  className="flex size-24 items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-[#EEF2FF] to-[#F8FAFC] text-xl font-semibold text-[#1E3A8A] shadow-inner sm:size-28"
                  aria-hidden={false}
                  role="img"
                  aria-label={`Avatar ${name}`}
                >
                  {initial}
                </div>
              )}
            </div>
            <dl className="grid min-w-0 flex-1 grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Họ tên
                </dt>
                <dd className="text-sm font-medium text-[#1E40AF]">
                  {isLoading ? '…' : name}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Email
                </dt>
                <dd className="break-all text-sm font-medium text-[#1E40AF]">
                  {isLoading ? '…' : email}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Điện thoại
                </dt>
                <dd className="text-sm font-medium text-[#1E40AF]">
                  {isLoading ? '…' : phone}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Ngày sinh
                </dt>
                <dd className="text-sm font-medium text-[#1E40AF]">
                  {isLoading ? '…' : birthDate}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Giới tính
                </dt>
                <dd className="text-sm font-medium text-[#1E40AF]">
                  {isLoading ? '…' : gender}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Quốc gia
                </dt>
                <dd className="text-sm font-medium text-[#1E40AF]">—</dd>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Địa chỉ
                </dt>
                <dd className="text-sm leading-relaxed text-[#1E40AF]">
                  {isLoading ? '…' : addressText}
                </dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>

      {/* Reviews — unified */}
      {/* <Card className="rounded-2xl border-slate-200/90 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#1E3A8A]">
            <MessageSquareText className="size-5 text-[#2563EB]" aria-hidden />
            Đánh giá của tôi
          </CardTitle>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="cursor-pointer text-[#2563EB] hover:bg-[#EFF6FF] hover:text-[#1D4ED8]"
          >
            <Link to={`${ROUTES.DASHBOARD.SAVED}?tab=reviews`}>
              Xem tất cả đánh giá
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="px-4 py-8 sm:px-6">
          <p className="mx-auto max-w-md text-center text-sm leading-relaxed text-slate-600">
            Xem và quản lý đánh giá tour, phòng, khách sạn và hướng dẫn viên tại
            một nơi.
          </p>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default DashboardOverviewPage;
