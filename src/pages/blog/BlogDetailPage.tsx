import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import { AnimatedTabs } from '@/components/AnimatedTabs';
import { useBlogPostDetailQuery, useRelatedBlogPostsQuery } from '@/features/blog/hooks';
import { langKey } from '@/utils/addressOptions';
import { useLanguage } from '@/hooks/useLanguage';
import { pickBlogTranslation } from '@/features/blog/locale';
import {
  BlogContentRenderer,
  BlogPostHeader,
  BlogRelatedPosts,
  BlogReviews,
  BlogSidebar,
} from '@/sections/blog';

export default function BlogDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const lang = langKey(language);
  const { data: post, isLoading, isError } = useBlogPostDetailQuery(slug ?? '');
  const { data: relatedPosts = [] } = useRelatedBlogPostsQuery(slug ?? '');

  const translation = post ? pickBlogTranslation(post, lang, language) : null;
  const tabs = useMemo(
    () => [
      { id: 'content', label: t('province.overview', 'Content') },
      { id: 'reviews', label: t('blog.reviews_tab') },
      { id: 'related', label: t('blog.related_title') },
    ],
    [t],
  );

  if (!slug || isError || (!isLoading && !post)) {
    return (
      <MainLayout>
        <div className="px-4 py-24 text-center">
          <h2
            className="text-3xl font-bold text-[#1c1a14]"
            style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
          >
            {t('blog.not_found')}
          </h2>
          <p className="mt-2 text-sm text-[rgba(28,26,20,0.6)]">{t('blog.not_found_desc')}</p>
        </div>
      </MainLayout>
    );
  }

  if (isLoading || !post) {
    return (
      <MainLayout>
        <Container className="py-12">
          <div className="h-80 animate-pulse rounded-2xl bg-[#e5ded0]" />
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="sticky top-[136px] z-20 border-b border-[rgba(28,26,20,0.1)] bg-[#faf7f2]/95 backdrop-blur-md">
        <Container className="max-w-7xl px-4 sm:px-6">
          <AnimatedTabs variant="travel" tabs={tabs} scrollOffset={200} omitContainer />
        </Container>
      </div>

      <div className="bg-[#F8F8F6] pb-20 pt-6">
        <Container className="space-y-8">
          <BlogPostHeader post={post} />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-8">
              <section id="content" className="scroll-mt-40">
                <BlogContentRenderer blocks={translation?.content ?? []} />
              </section>
              <BlogReviews post={post} />
              <BlogRelatedPosts items={relatedPosts} />
            </div>
            <aside className="lg:col-span-4">
              <BlogSidebar slug={post.slug} toc={translation?.tableOfContents ?? []} author={post.author} />
            </aside>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}

