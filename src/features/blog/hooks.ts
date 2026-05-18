import { useQuery } from '@tanstack/react-query';
import {
  getBlogCategories,
  getBlogCategoryBySlug,
  getBlogPostBySlug,
  getBlogPosts,
  getBlogTags,
  getFeaturedBlogPosts,
  getRelatedBlogPosts,
} from './api';
import type {
  BlogCategory,
  BlogListParams,
  BlogPostDetail,
  BlogPostListItem,
  BlogSimpleListParams,
} from './types';

export const blogKeys = {
  all: ['blog'] as const,
  categories: (params?: BlogSimpleListParams) => [...blogKeys.all, 'categories', params] as const,
  categoryDetail: (slug: string) => [...blogKeys.all, 'category', slug] as const,
  tags: (params?: BlogSimpleListParams) => [...blogKeys.all, 'tags', params] as const,
  posts: (params?: BlogListParams) => [...blogKeys.all, 'posts', params] as const,
  featured: (limit: number) => [...blogKeys.all, 'featured', limit] as const,
  postDetail: (slug: string) => [...blogKeys.all, 'post', slug] as const,
  related: (slug: string) => [...blogKeys.all, 'related', slug] as const,
};

export function useBlogCategoriesQuery(params?: BlogSimpleListParams) {
  return useQuery({
    queryKey: blogKeys.categories(params),
    queryFn: () => getBlogCategories(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlogCategoryBySlugQuery(slug: string) {
  return useQuery<BlogCategory>({
    queryKey: blogKeys.categoryDetail(slug),
    queryFn: () => getBlogCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlogTagsQuery(params?: BlogSimpleListParams) {
  return useQuery({
    queryKey: blogKeys.tags(params),
    queryFn: () => getBlogTags(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function useBlogPostsQuery(params?: BlogListParams) {
  return useQuery({
    queryKey: blogKeys.posts(params),
    queryFn: () => getBlogPosts(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useFeaturedBlogPostsQuery(limit = 6) {
  return useQuery<BlogPostListItem[]>({
    queryKey: blogKeys.featured(limit),
    queryFn: () => getFeaturedBlogPosts(limit),
    staleTime: 2 * 60 * 1000,
  });
}

export function useBlogPostDetailQuery(slug: string) {
  return useQuery<BlogPostDetail>({
    queryKey: blogKeys.postDetail(slug),
    queryFn: () => getBlogPostBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRelatedBlogPostsQuery(slug: string) {
  return useQuery<BlogPostListItem[]>({
    queryKey: blogKeys.related(slug),
    queryFn: () => getRelatedBlogPosts(slug),
    enabled: !!slug,
    staleTime: 2 * 60 * 1000,
  });
}

