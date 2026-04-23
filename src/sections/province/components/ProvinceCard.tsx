import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';
import { ROUTES } from '@/constants/router';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { langKey } from '@/utils/addressOptions';
import type { ProvinceListItem } from '@/features/provinces/types';

interface ProvinceCardProps {
  item: ProvinceListItem;
  className?: string;
}

function getRegionLabel(region?: ProvinceListItem['region']) {
  if (region === 'NORTH') return 'North Vietnam';
  if (region === 'CENTRAL') return 'Central Vietnam';
  if (region === 'SOUTH') return 'South Vietnam';
  return '';
}

function getProvinceName(item: ProvinceListItem, lang: 'vi' | 'en') {
  return item.name?.[lang] ?? item.name?.vi ?? item.name?.en ?? item.slug;
}

function getShortDescription(item: ProvinceListItem, lang: 'vi' | 'en') {
  return (
    item.translations?.[lang]?.shortDescription ??
    item.translations?.vi?.shortDescription ??
    item.translations?.en?.shortDescription ??
    ''
  );
}

export function ProvinceCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-2xl border-0 shadow-[var(--shadow-card)]">
      <Skeleton className="relative aspect-[4/3] w-full min-h-[12rem] rounded-none sm:min-h-[14rem]" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-6 w-full max-w-[90%] rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="mt-auto h-4 w-28 pt-2" />
      </div>
    </Card>
  );
}

export function ProvinceCard({ item, className }: ProvinceCardProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = langKey(language);
  const name = getProvinceName(item, lang);
  const shortDescription = getShortDescription(item, lang);
  const regionLabel = getRegionLabel(item.region);
  const thumbnail =
    item.thumbnail?.url ??
    item.gallery?.[0]?.url ??
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80';

  return (
    <Link to={ROUTES.PROVINCE.DETAIL.replace(':slug', item.slug)} className="block h-full">
      <Card
        className={cn(
          'group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.08)] bg-white shadow-[var(--shadow-card)] transition-all duration-300',
          'hover:shadow-[var(--shadow-elevated)]',
          className,
        )}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={thumbnail}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.04]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#1c1a14]/70 via-[#1c1a14]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
          <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
            {!!regionLabel && (
              <span className="inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#1e4d38] shadow-sm ring-1 ring-[rgba(45,106,79,0.25)]">
                {regionLabel}
              </span>
            )}
            {item.isPopular && (
              <span className="inline-flex items-center rounded-full bg-[#f5e9d0] px-2.5 py-1 text-xs font-bold text-[#9a6b1a] ring-1 ring-[rgba(201,146,42,0.35)]">
                {t('province.popular_badge', 'Popular')}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3
            className="line-clamp-2 text-lg font-bold tracking-tight text-[#1c1a14] transition-colors duration-200 group-hover:text-[#c8102e]"
            style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
          >
            {name}
          </h3>
          {shortDescription ? (
            <p className="mb-3 mt-2 line-clamp-2 text-sm text-[rgba(28,26,20,0.6)]">
              {shortDescription}
            </p>
          ) : (
            <div className="mb-3 mt-2 flex items-center gap-1.5 text-sm text-[rgba(28,26,20,0.6)]">
              <MapPin className="size-4 shrink-0 text-[#2d6a4f]" strokeWidth={2.25} />
              <span>{item.fullName?.[lang] ?? item.name?.[lang]}</span>
            </div>
          )}
          <span className="mt-auto flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#c8102e] transition-all duration-200 group-hover:gap-3">
            {t('province.explore', 'Explore')}
            <span aria-hidden>→</span>
          </span>
        </div>
      </Card>
    </Link>
  );
}
