export type ApiPage<T> = {
  data: T[];
  meta: {
    pageIndex: number;
    pageSize: number;
    total: number;
    pageCount: number;
  };
};

export type Paginate = {
  pageIndex: number;
  pageSize: number;
};

export type SortParam = { by: string; dir: 'asc' | 'desc' };
