import api from '@/lib/axios';
import type {
  BlogCategory,
  BlogCategoryListResponse,
  BlogListParams,
  BlogListResponse,
  BlogPostDetail,
  BlogPostListItem,
  BlogSimpleListParams,
  BlogTagListResponse,
} from './types';

const CATEGORY_BASE = '/api/v1/blog-categories';
const TAG_BASE = '/api/v1/blog-tags';
const POST_BASE = '/api/v1/blog-posts';

export function getBlogCategories(params?: BlogSimpleListParams) {
  return api.get<BlogCategoryListResponse>(CATEGORY_BASE, { params });
}

export function getBlogCategoryBySlug(slug: string) {
  return api.get<BlogCategory>(`${CATEGORY_BASE}/${slug}`);
}

export function getBlogTags(params?: BlogSimpleListParams) {
  return api.get<BlogTagListResponse>(TAG_BASE, { params });
}

export function getBlogPosts(params?: BlogListParams) {
  return api.get<BlogListResponse>(POST_BASE, { params });
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
