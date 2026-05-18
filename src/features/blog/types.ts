import type { DynamicLocalized, ImageItem } from '@/features/provinces/types';
import type { RatingSummary } from '@/components/EntityReviewSection/ReviewSection';

export type EditorJsBlockType =
  | 'paragraph'
  | 'header'
  | 'image'
  | 'list'
  | 'quote'
  | 'code'
  | 'delimiter'
  | 'table'
  | 'embed'
  | 'warning';

export interface EditorJsBlock {
  id: string;
  type: EditorJsBlockType | string;
  data: Record<string, unknown>;
  tunes?: Record<string, unknown>;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface BlogSeo {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface BlogPostTranslation {
  title?: string;
  excerpt?: string;
  content?: EditorJsBlock[];
  tableOfContents?: TocItem[];
  readingTime?: number;
  seo?: BlogSeo;
}

export interface BlogCategory {
  _id: string;
  name: DynamicLocalized;
  slug: string;
  description?: DynamicLocalized;
  thumbnail?: ImageItem;
  order?: number;
  isActive?: boolean;
  postCount?: number;
}

export interface BlogTag {
  _id: string;
  name: DynamicLocalized;
  slug: string;
  isActive?: boolean;
  postCount?: number;
}

export interface BlogAuthor {
  _id: string;
  fullName?: string;
  name?: string;
  avatar?: string;
}

export interface BlogPostListItem {
  _id: string;
  slug: string;
  status?: 'draft' | 'published';
  isFeatured?: boolean;
  author?: BlogAuthor;
  category?: BlogCategory | null;
  tags?: BlogTag[];
  relatedProvinces?: Array<{ _id: string; slug?: string; name?: DynamicLocalized }>;
  thumbnail?: ImageItem;
  gallery?: ImageItem[];
  translations?: Record<string, BlogPostTranslation>;
  viewCount?: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  ratingSummary?: RatingSummary | null;
}

export interface BlogPostDetail extends BlogPostListItem {
  translations: Record<string, BlogPostTranslation>;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedList<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type BlogListResponse = PaginatedList<BlogPostListItem>;

export type BlogCategoryListResponse = PaginatedList<BlogCategory>;

export type BlogTagListResponse = PaginatedList<BlogTag>;

export interface BlogListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  province?: string;
  sort?: 'latest' | 'popular' | 'oldest';
  lang?: string;
}

export interface BlogSimpleListParams {
  page?: number;
  limit?: number;
  search?: string;
}

