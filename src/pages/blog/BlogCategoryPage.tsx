import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import { PageHero } from '@/components/PageHero';
import ServerPagination from '@/shared/pagination/ServerPagination';
import { EnumDisplayItem } from '@/constants/commons';
import DisplayContainer from '@/components/DisplayContainer';
import { useBlogCategoryBySlugQuery, useBlogPostsQuery } from '@/features/blog/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import { pickLocale } from '@/features/provinces/locale';
import { BlogCard } from '@/sections/blog';

const PAGE_SIZE = 9;

export default function BlogCategoryPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const { data: category, isLoading: categoryLoading } = useBlogCategoryBySlugQuery(slug ?? '');
  const { data, isLoading, error } = useBlogPostsQuery({
    page,
    limit: PAGE_SIZE,
    category: slug,
    sort: 'latest',
  });

  const items = data?.items ?? [];
  const totalPages = Math.max(1, data?.totalPages ?? 1);
  const categoryTitle = pickLocale(category?.name, language) ?? slug ?? '';
  const categoryDesc = pickLocale(category?.description, language);

  return (
    <MainLayout>
      <PageHero
        backgroundImage={category?.thumbnail?.url || '/images/bgDestination.png'}
        title={t('blog.category_page_title', { name: categoryTitle })}
        subtitle={categoryDesc || t('blog.hero_subtitle')}
        badge={t('blog.hero_badge')}
      />
      <div className="bg-[#F8F8F6] pb-16 pt-8">
        <Container>
          {categoryLoading || isLoading ? (
            <p>{t('common.loading')}</p>
          ) : error ? (
            <p>{t('blog.error_desc')}</p>
          ) : (
            <>
              <DisplayContainer
                displayType={EnumDisplayItem.GRID}
                gridClassName="grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {items.map((item) => (
                  <BlogCard key={item._id} item={item} />
                ))}
              </DisplayContainer>
              {totalPages > 1 && (
                <ServerPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  className="mt-10"
                />
              )}
            </>
          )}
        </Container>
      </div>
    </MainLayout>
  );
}

