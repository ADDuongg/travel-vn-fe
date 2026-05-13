/** Shape of API error envelope (axios interceptor forwards these on rejected errors). */
export type ApiErrorEnvelope = {
  message: string;
  messageKey?: string;
  errorCode?: string;
  requestId?: string;
};

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

/** Hướng sắp xếp */
export const SortDir = { Asc: 'asc', Desc: 'desc' } as const;
export type SortDir = (typeof SortDir)[keyof typeof SortDir];

export type SortParam = { by: string; dir: SortDir };
