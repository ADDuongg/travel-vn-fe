import { useTranslation } from 'react-i18next';
import EntityReviewSection from '@/components/EntityReviewSection/EntityReviewSection';
import { ReviewEntityType } from '@/features/review/types';
import type { BlogPostDetail } from '@/features/blog/types';

interface BlogReviewsProps {
  post: BlogPostDetail;
}

export function BlogReviews({ post }: BlogReviewsProps) {
  const { t } = useTranslation();

  return (
    <section id="reviews" className="scroll-mt-40">
      <h2
        className="mb-4 text-2xl font-bold text-[#1c1a14] sm:text-3xl"
        style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
      >
        {t('blog.reviews_title')}
      </h2>
      <div className="rounded-2xl border border-[rgba(28,26,20,0.1)] bg-white p-4 shadow-[var(--shadow-card)] sm:p-6">
        <EntityReviewSection
          entityType={ReviewEntityType.BLOG}
          entityId={post._id}
          ratingSummary={post.ratingSummary ?? undefined}
        />
      </div>
    </section>
  );
}
