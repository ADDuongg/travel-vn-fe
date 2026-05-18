export type BlogSort = 'latest' | 'popular' | 'oldest';

export interface BlogListQuery {
  search: string;
  category: string;
  tag: string;
  sort: BlogSort;
}

export const defaultBlogListQuery: BlogListQuery = {
  search: '',
  category: '',
  tag: '',
  sort: 'latest',
};

