export type ApiListResponse<T> = {
  data: T[];
  meta: PageMeta;
};

export type ApiResponse<T> = {
  data: T;
};

export type Paginate = {
  pageIndex: number;
  pageSize: number;
};

export type PageMeta = Paginate & {
  total: number;
  pageCount: number;
};

export type SortParam = { by: string; dir: 'asc' | 'desc' };
