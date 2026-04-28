import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import { PageHero } from '@/components/PageHero';
import DisplayContainer from '@/components/DisplayContainer';
import ServerPagination from '@/shared/pagination/ServerPagination';
import { EnumDisplayItem } from '@/constants/commons';
import { useBlogCategoriesQuery, useBlogPostsQuery, useBlogTagsQuery, useFeaturedBlogPostsQuery } from '@/features/blog/hooks';
import type { BlogListParams } from '@/features/blog/types';
import {
  BlogCard,
  BlogCardSkeleton,
  BlogFeaturedGrid,
  BlogFilter,
  BlogHeroSearch,
  defaultBlogListQuery,
  type BlogListQuery,
} from '@/sections/blog';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&auto=format&fit=crop&q=80';
const PAGE_SIZE = 9;

function getQueryFromSearchParams(searchParams: URLSearchParams): BlogListQuery {
  const sort = searchParams.get('sort');
  const parsedSort = sort === 'latest' || sort === 'popular' || sort === 'oldest' ? sort : 'latest';

  return {
    search: searchParams.get('search') ?? '',
    category: searchParams.get('category') ?? '',
    tag: searchParams.get('tag') ?? '',
    sort: parsedSort,
  };
}

function getSearchParamsFromQuery(query: BlogListQuery, page: number) {
  const next = new URLSearchParams();
  next.set('page', String(page));
  if (query.search.trim()) next.set('search', query.search.trim());
  if (query.category) next.set('category', query.category);
  if (query.tag) next.set('tag', query.tag);
  if (query.sort !== 'latest') next.set('sort', query.sort);
  return next;
}

export default function BlogListPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<BlogListQuery>(() => getQueryFromSearchParams(searchParams));
  const [currentPage, setCurrentPage] = useState(() => Number(searchParams.get('page')) || 1);

  useEffect(() => {
    const nextQuery = getQueryFromSearchParams(searchParams);
    const nextPage = Number(searchParams.get('page')) || 1;
    setQuery(nextQuery);
    setCurrentPage(nextPage);
  }, [searchParams]);

  useEffect(() => {
    const next = getSearchParamsFromQuery(query, currentPage);
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [currentPage, query, searchParams, setSearchParams]);

  const params: BlogListParams = useMemo(() => {
    const next: BlogListParams = {
      page: currentPage,
      limit: PAGE_SIZE,
      sort: query.sort,
    };
    if (query.search.trim()) next.search = query.search.trim();
    if (query.category) next.category = query.category;
    if (query.tag) next.tag = query.tag;
    return next;
  }, [currentPage, query]);

  const { data, isLoading, error } = useBlogPostsQuery(params);
  const { data: categoriesData } = useBlogCategoriesQuery({ limit: 100 });
  const { data: tagsData } = useBlogTagsQuery({ limit: 100 });
  const { data: featuredPosts = [] } = useFeaturedBlogPostsQuery(3);

  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const totalPages = Math.max(1, data?.totalPages ?? 1);
  const showingFrom = total ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const showingTo = Math.min(currentPage * PAGE_SIZE, total);
  const isFilterApplied = !!(query.search || query.category || query.tag || query.sort !== 'latest');

  return (
    <MainLayout>
      <PageHero
        backgroundImage={HERO_IMAGE}
        title={t('blog.hero_title')}
        subtitle={t('blog.hero_subtitle')}
        badge={t('blog.hero_badge')}
        contentClassName="min-h-[320px] justify-center pb-16 pt-24 md:min-h-[400px] md:pt-32"
      >
        <BlogHeroSearch
          initialSearch={query.search}
          onApply={({ search }) => {
            setCurrentPage(1);
            setQuery((prev) => ({ ...prev, search }));
          }}
        />
      </PageHero>

      <div className="bg-[#F8F8F6] pb-16 pt-8">
        <Container className="space-y-6">
          {!isFilterApplied && featuredPosts.length > 0 && <BlogFeaturedGrid items={featuredPosts} />}

          <BlogFilter
            value={query}
            categories={categoriesData?.items ?? []}
            tags={tagsData?.items ?? []}
            onChange={(next) => {
              setCurrentPage(1);
              setQuery(next);
            }}
            onReset={() => {
              setCurrentPage(1);
              setQuery(defaultBlogListQuery);
            }}
          />

          <div>
            <p className="text-sm text-[rgba(28,26,20,0.6)]">
              {isLoading
                ? t('common.loading')
                : t('blog.list.showing', { from: showingFrom, to: showingTo, total })}
            </p>
            <h2
              className="mt-1 text-3xl font-bold text-[#1c1a14]"
              style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
            >
              {t('blog.list.heading')}
            </h2>
          </div>

          {isLoading ? (
            <DisplayContainer
              gridClassName="grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              displayType={EnumDisplayItem.GRID}
            >
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))}
            </DisplayContainer>
          ) : error ? (
            <div className="rounded-2xl border border-dashed border-[rgba(200,16,46,0.3)] bg-[#fff7f7] px-6 py-16 text-center">
              <h3 className="text-xl font-semibold text-[#1c1a14]">{t('blog.error_title')}</h3>
              <p className="mt-2 text-sm text-[rgba(28,26,20,0.6)]">{t('blog.error_desc')}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[rgba(28,26,20,0.2)] bg-[#faf7f2] px-6 py-16 text-center">
              <h3 className="text-xl font-semibold text-[#1c1a14]">{t('blog.no_results')}</h3>
              <p className="mt-2 text-sm text-[rgba(28,26,20,0.6)]">{t('blog.empty_hint')}</p>
            </div>
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
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
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
