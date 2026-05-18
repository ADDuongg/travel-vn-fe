import api from '@/lib/axios';
import type {
  BlogCategory,
  BlogCategoryListResponse,
  BlogListParams,
  BlogListResponse,
  BlogPostDetail,
  BlogPostListItem,
  BlogSimpleListParams,
  BlogTag,
  BlogTagListResponse,
  PaginationInfo,
} from './types';

const CATEGORY_BASE = '/api/v1/public/blog-categories';
const TAG_BASE = '/api/v1/public/blog-tags';
const POST_BASE = '/api/v1/public/blogs';

type RawPaginatedBody<T> = {
  items?: T[];

  docs?: T[];
  pagination?: PaginationInfo;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  totalDocs?: number;
};

function normalizePaginatedList<T>(raw: RawPaginatedBody<T>): {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
} {
  const items = raw.items ?? raw.docs ?? [];
  if (raw.pagination) {
    const p = raw.pagination;
    return {
      items,
      page: p.page,
      limit: p.limit,
      total: p.total,
      totalPages: p.totalPages,
    };
  }
  const total = raw.total ?? raw.totalDocs ?? items.length;
  const page = raw.page ?? 1;
  const limit = raw.limit ?? 20;
  const totalPages =
    raw.totalPages ?? Math.max(1, Math.ceil(total / Math.max(limit, 1)));

  return { items, page, limit, total, totalPages };
}

export async function getBlogCategories(
  params?: BlogSimpleListParams,
): Promise<BlogCategoryListResponse> {
  const raw = await api.get<RawPaginatedBody<BlogCategory>>(CATEGORY_BASE, {
    params,
  });
  return normalizePaginatedList(raw);
}

export function getBlogCategoryBySlug(slug: string) {
  return api.get<BlogCategory>(`${CATEGORY_BASE}/${slug}`);
}

export async function getBlogTags(
  params?: BlogSimpleListParams,
): Promise<BlogTagListResponse> {
  const raw = await api.get<RawPaginatedBody<BlogTag>>(TAG_BASE, {
    params,
  });
  return normalizePaginatedList(raw);
}

export async function getBlogPosts(
  params?: BlogListParams,
): Promise<BlogListResponse> {
  const raw = await api.get<RawPaginatedBody<BlogPostListItem>>(POST_BASE, {
    params,
  });
  return normalizePaginatedList(raw);
}

export function getFeaturedBlogPosts(limit = 6) {
  return api.get<BlogPostListItem[]>(`${POST_BASE}/featured`, {
    params: { limit },
  });
}

export function getBlogPostBySlug(slug: string) {
  return api.get<BlogPostDetail>(`${POST_BASE}/${slug}`);
}

export function getRelatedBlogPosts(slug: string) {
  return api.get<BlogPostListItem[]>(`${POST_BASE}/${slug}/related`);
}

