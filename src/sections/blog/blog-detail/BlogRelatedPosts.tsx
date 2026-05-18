import { useTranslation } from 'react-i18next';
import type { BlogPostListItem } from '@/features/blog/types';
import { BlogCard } from '../components/BlogCard';

interface BlogRelatedPostsProps {
  items: BlogPostListItem[];
}

export function BlogRelatedPosts({ items }: BlogRelatedPostsProps) {
  const { t } = useTranslation();
  if (!items.length) return null;

  return (
    <section id="related" className="scroll-mt-40 pt-2">
      <h2
        className="mb-4 text-2xl font-bold text-[#1c1a14]"
        style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
      >
        {t('blog.related_title')}
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <BlogCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}

