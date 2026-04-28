import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import DisplayContainer from '@/components/DisplayContainer';
import { EnumDisplayItem } from '@/constants/commons';
import ServerPagination from '@/shared/pagination/ServerPagination';
import { useBlogPostsQuery } from '@/features/blog/hooks';
import { BlogCard } from '@/sections/blog';

const PAGE_SIZE = 9;

export default function BlogTagPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useBlogPostsQuery({
    page,
    limit: PAGE_SIZE,
    tag: slug,
    sort: 'latest',
  });

  const items = data?.items ?? [];
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  return (
    <MainLayout>
      <div className="bg-[#F8F8F6] pb-16 pt-10">
        <Container className="space-y-6">
          <h1
            className="text-3xl font-bold text-[#1c1a14]"
            style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
          >
            {t('blog.tag_page_title', { name: slug })}
          </h1>
          {isLoading ? (
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
