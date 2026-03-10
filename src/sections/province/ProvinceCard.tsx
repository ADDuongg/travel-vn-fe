import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ProvinceListItem } from '@/features/provinces/types';
import { useLanguage } from '@/hooks/useLanguage';
import { langKey } from '@/utils/addressOptions';
import { ROUTES } from '@/constants/router';
import { cn } from '@/lib/utils';

interface ProvinceCardProps {
  item: ProvinceListItem;
  variant?: 'default' | 'compact';
  className?: string;
}

function getName(item: ProvinceListItem, lang: 'vi' | 'en') {
  return item.name?.[lang] ?? item.name?.vi ?? item.name?.en ?? item.code ?? '';
}

function getShortDesc(item: ProvinceListItem, lang: 'vi' | 'en') {
  const t = item.translations?.[lang];
  return t?.shortDescription ?? '';
}

export function ProvinceCard({ item, variant = 'default', className }: ProvinceCardProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = langKey(language);
  const name = getName(item, lang);
  const shortDesc = getShortDesc(item, lang);
  const regionLabel =
    item.region === 'NORTH'
      ? 'NORTH VIETNAM'
      : item.region === 'CENTRAL'
        ? 'CENTRAL VIETNAM'
        : item.region === 'SOUTH'
          ? 'SOUTH VIETNAM'
          : null;

  const imageUrl = item.thumbnail?.url ?? 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80';

  if (variant === 'compact') {
    return (
      <Link
        to={ROUTES.PROVINCE.DETAIL.replace(':slug', item.slug)}
        className={cn(
          'group flex flex-col rounded-xl overflow-hidden border border-[#dbe6df] dark:border-[#1e3a29]',
          'bg-white dark:bg-[#162d1d] shadow-sm hover:shadow-md transition-shadow',
          className
        )}
      >
        <div className="aspect-[4/3] bg-cover bg-center relative" style={{ backgroundImage: `url(${imageUrl})` }}>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
          {item.isPopular && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              {t('province.popular_badge', 'Nổi bật')}
            </span>
          )}
          {regionLabel && (
            <span className="absolute top-3 left-3 bg-primary/90 text-[#111813] text-xs font-bold px-3 py-1 rounded-full">
              {regionLabel}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-[#111813] dark:text-white group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>
          {shortDesc && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{shortDesc}</p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={ROUTES.PROVINCE.DETAIL.replace(':slug', item.slug)}
      className={cn(
        'group flex flex-col rounded-xl overflow-hidden border border-[#dbe6df] dark:border-[#1e3a29]',
        'bg-white dark:bg-[#162d1d] shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="aspect-[4/3] rounded-xl bg-cover bg-center relative" style={{ backgroundImage: `url(${imageUrl})` }}>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
          {item.isPopular && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              {t('province.popular_badge', 'Nổi bật')}
            </span>
          )}
          {regionLabel && (
            <span className="absolute top-3 left-3 bg-primary/90 text-[#111813] text-xs font-bold px-3 py-1 rounded-full">
              {regionLabel}
            </span>
          )}
        </div>
        <div className="px-1 pb-1">
          <h4 className="font-bold text-base text-[#111813] dark:text-white">{name}</h4>
          {shortDesc && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">{shortDesc}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
