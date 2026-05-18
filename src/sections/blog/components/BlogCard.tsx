import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/router';
import { Card } from '@/components/ui/card';
import { Eye, Star } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { langKey } from '@/utils/addressOptions';
import { pickCategoryName, pickBlogTranslation } from '@/features/blog/locale';
import type { BlogPostListItem } from '@/features/blog/types';
import { formatPublishDate } from '@/features/blog/utils';
import { BlogCategoryPill } from './BlogCategoryPill';

interface BlogCardProps {
  item: BlogPostListItem;
}

export function BlogCard({ item }: BlogCardProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = langKey(language);
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';
  const { title, excerpt, readingTime } = pickBlogTranslation(
    { translations: item.translations },
    lang,
    language,
  );
  const cover = item.thumbnail?.url ?? item.gallery?.[0]?.url ?? '/images/bgDestination.png';
  const categoryName = pickCategoryName(item.category, language);
  const dateText = formatPublishDate(item.publishedAt ?? item.createdAt, locale);
  const ratingValue = item.ratingSummary?.average;
  const ratingCount = item.ratingSummary?.total ?? 0;

  return (
    <Link to={ROUTES.BLOG.DETAIL.replace(':slug', item.slug)} className="block h-full cursor-pointer">
      <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.08)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-elevated)]">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={cover}
            alt={title || item.slug}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          {item.category?.slug && categoryName && (
            <div className="mb-3">
              <BlogCategoryPill slug={item.category.slug} label={categoryName} />
            </div>
          )}
          <h3
            className="line-clamp-2 text-xl font-bold tracking-tight text-[#1c1a14] transition-colors duration-200 group-hover:text-[#c8102e]"
            style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
          >
            {title || item.slug}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-[rgba(28,26,20,0.65)]">{excerpt}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[rgba(28,26,20,0.6)]">
            {!!readingTime && <span>{t('blog.read_time', { count: readingTime })}</span>}
            {!!dateText && <span>{dateText}</span>}
            <span className="inline-flex items-center gap-1">
              <Eye className="size-3.5" />
              {t('blog.view_count', { count: item.viewCount ?? 0 })}
            </span>
            {ratingCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#f5e9d0] px-2 py-0.5 text-[#9a6b1a]">
                <Star className="size-3.5 fill-current" />
                {Number(ratingValue ?? 0).toFixed(1)} ({ratingCount})
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

