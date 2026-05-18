import { useTranslation } from 'react-i18next';
import { Eye, Star } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { langKey } from '@/utils/addressOptions';
import type { BlogPostDetail } from '@/features/blog/types';
import { pickBlogTranslation, pickCategoryName, pickTagName } from '@/features/blog/locale';
import { formatPublishDate } from '@/features/blog/utils';
import { BlogCategoryPill } from '../components/BlogCategoryPill';
import { BlogTagPill } from '../components/BlogTagPill';

interface BlogPostHeaderProps {
  post: BlogPostDetail;
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = langKey(language);
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';
  const { title, excerpt, readingTime } = pickBlogTranslation(post, lang, language);
  const cover = post.thumbnail?.url ?? post.gallery?.[0]?.url ?? '/images/bgDestination.png';
  const publishedAt = formatPublishDate(post.publishedAt ?? post.createdAt, locale);
  const authorName = post.author?.fullName ?? post.author?.name ?? 'Admin';
  const ratingValue = post.ratingSummary?.average;
  const ratingCount = post.ratingSummary?.total ?? 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.12)] bg-white shadow-[var(--shadow-card)]">
      <img src={cover} alt={title || post.slug} className="h-[300px] w-full object-cover sm:h-[420px]" />
      <div className="p-6 sm:p-8">
        {post.category?.slug && (
          <div className="mb-3">
            <BlogCategoryPill slug={post.category.slug} label={pickCategoryName(post.category, language)} />
          </div>
        )}
        <h1
          className="text-3xl font-bold text-[#1c1a14] sm:text-4xl"
          style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
        >
          {title || post.slug}
        </h1>
        {!!excerpt && <p className="mt-3 text-base text-[rgba(28,26,20,0.72)] sm:text-lg">{excerpt}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[rgba(28,26,20,0.65)]">
          <span>{t('blog.by_author', { name: authorName })}</span>
          {!!publishedAt && <span>{t('blog.published_on', { date: publishedAt })}</span>}
          {!!readingTime && <span>{t('blog.read_time', { count: readingTime })}</span>}
          <span className="inline-flex items-center gap-1">
            <Eye className="size-4" />
            {t('blog.view_count', { count: post.viewCount ?? 0 })}
          </span>
          {ratingCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f5e9d0] px-2 py-0.5 text-xs text-[#9a6b1a]">
              <Star className="size-3.5 fill-current" />
              {t('blog.rating_summary', { avg: Number(ratingValue ?? 0).toFixed(1), count: ratingCount })}
            </span>
          )}
        </div>
        {!!post.tags?.length && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) =>
              tag.slug ? (
                <BlogTagPill key={tag._id} slug={tag.slug} label={pickTagName(tag, language)} />
              ) : null,
            )}
          </div>
        )}
      </div>
    </section>
  );
}

