import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROUTES } from '@/constants/router';
import { FavoriteEntityType } from '@/features/favorites/types';
import {
  useMyFavoritesListQuery,
  useToggleFavoriteMutation,
} from '@/features/favorites/hooks';
import { getSyncDetailPath } from '@/features/review/sync-entity-path';
import { useMyReviewsListQuery } from '@/features/review/hooks';
import type { MyReviewTableRow } from '@/features/review/types';
import { ReviewEntityType, ReviewStatus } from '@/features/review/types';
import * as I from '@/types/api';
import DataTable from '@/shared/table/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AlertCircle,
  Loader2,
  MessageSquareText,
  Star,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useSearchParams } from 'react-router-dom';
import type { RowSelectionState, SortingState } from '@tanstack/react-table';
import type {
  FavoriteRecord,
  FavoriteEntitySummary,
} from '@/features/favorites/types';

const REVIEW_ENTITY_TYPES = Object.values(ReviewEntityType).filter(
  (v): v is ReviewEntityType => typeof v === 'string',
);

const DEFAULT_PAGE_SIZE = 20;

type EntityFilter = 'all' | ReviewEntityType;

/** Matches GET /reviews/me/list `?status=` CSV */
type StatusFilter =
  | 'all'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'HIDDEN'
  | 'PENDING,APPROVED';

function reviewStatusBadgeClass(status: ReviewStatus | string) {
  switch (status) {
    case ReviewStatus.APPROVED:
      return 'border-emerald-200 bg-emerald-50 text-emerald-900';
    case ReviewStatus.PENDING:
      return 'border-amber-200 bg-amber-50 text-amber-900';
    case ReviewStatus.REJECTED:
      return 'border-rose-200 bg-rose-50 text-rose-900';
    case ReviewStatus.HIDDEN:
      return 'border-border bg-slate-100 text-slate-800';
    default:
      return 'border-border bg-slate-50 text-slate-800';
  }
}

function formatDate(value: string | undefined, locale: string) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function RatingStars({ value }: { value?: number }) {
  const n = value != null ? Math.round(value) : 0;
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${n} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-4 shrink-0 ${
            i < n ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
          }`}
          aria-hidden
        />
      ))}
    </div>
  );
}

const MyReviewsPanel: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language?.split('-')[0] || 'vi';

  const [entityFilter, setEntityFilter] = useState<EntityFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [pagination, setPagination] = useState<I.Paginate>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [entityFilter, statusFilter]);

  const listParams = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      lang,
      ...(entityFilter === 'all' ? {} : { entityType: entityFilter }),
      ...(statusFilter === 'all' ? {} : { status: statusFilter }),
    }),
    [
      pagination.pageIndex,
      pagination.pageSize,
      lang,
      entityFilter,
      statusFilter,
    ],
  );

  const { data, isFetching, isError, error, refetch } =
    useMyReviewsListQuery(listParams);

  const handleView = useCallback(
    async (row: MyReviewTableRow) => {
      const sync = getSyncDetailPath(row.entityType, row.entityId);
      if (sync) {
        navigate(sync);
        return;
      }
      if (row.entityType === ReviewEntityType.BLOG && row.entitySummary?.slug) {
        navigate(generatePath(ROUTES.BLOG.DETAIL, { slug: row.entitySummary.slug }));
        return;
      }
      if (row.entityType === ReviewEntityType.TOUR) {
        navigate(generatePath(ROUTES.TOUR.DETAIL, { id: row.entityId }));
      }
    },
    [navigate],
  );

  const columns = useMemo<ColumnDef<MyReviewTableRow>[]>(
    () => [
      {
        id: 'entity',
        header: t('savedReviews.col_entity'),
        cell: ({ row }) => {
          const r = row.original;
          const name = r.entitySummary?.name?.trim() || '—';
          const thumb = r.entitySummary?.thumbnailUrl;
          return (
            <div className="flex max-w-[min(100vw-8rem,22rem)] items-start gap-3">
              <div className="size-12 shrink-0 overflow-hidden rounded-xl border border-border bg-vn-cream/50">
                {thumb ? (
                  <img src={thumb} alt="" className="size-full object-cover" />
                ) : (
                  <div
                    className="flex size-full items-center justify-center text-[10px] font-medium text-slate-400"
                    aria-hidden
                  >
                    —
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-snug text-primary line-clamp-2">
                  {name}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        id: 'type',
        header: t('savedReviews.col_type'),
        cell: ({ row }) => (
          <Badge
            variant="secondary"
            className="whitespace-nowrap font-normal text-foreground"
          >
            {t(`savedReviews.entity.${row.original.entityType}`)}
          </Badge>
        ),
      },
      {
        id: 'rating',
        header: t('savedReviews.col_rating'),
        cell: ({ row }) => <RatingStars value={row.original.rating} />,
      },
      {
        id: 'comment',
        header: t('savedReviews.col_comment'),
        cell: ({ row }) => (
          <p className="line-clamp-2 text-muted-foreground">
            {row.original.comment?.trim() || '—'}
          </p>
        ),
      },
      {
        id: 'status',
        header: t('savedReviews.col_status'),
        cell: ({ row }) => {
          const s = row.original.status;
          const label = t(`savedReviews.status.${s}`, {
            defaultValue: String(s),
          });
          return (
            <Badge
              variant="outline"
              className={`whitespace-nowrap font-normal ${reviewStatusBadgeClass(s)}`}
            >
              {label}
            </Badge>
          );
        },
      },
      {
        id: 'updated',
        header: t('savedReviews.col_updated'),
        cell: ({ row }) =>
          formatDate(row.original.updatedAt, i18n.language || 'vi'),
      },
      {
        id: 'date',
        header: t('savedReviews.col_date'),
        cell: ({ row }) =>
          formatDate(row.original.createdAt, i18n.language || 'vi'),
      },
      {
        id: 'actions',
        header: () => (
          <span className="sr-only">{t('savedReviews.col_actions')}</span>
        ),
        cell: ({ row }) => {
          const r = row.original;
          const canSync = getSyncDetailPath(r.entityType, r.entityId) != null;
          const canTour = r.entityType === ReviewEntityType.TOUR;
          const canBlog = r.entityType === ReviewEntityType.BLOG && !!r.entitySummary?.slug;
          const unsupported = !canSync && !canTour && !canBlog;

          return (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={unsupported}
              className="cursor-pointer border-primary/30 text-primary hover:bg-vn-red-soft/50"
              title={
                unsupported
                  ? t('savedReviews.view_unsupported')
                  : t('savedReviews.view')
              }
              onClick={() => handleView(r)}
            >
              {t('savedReviews.view')}
            </Button>
          );
        },
      },
    ],
    [t, i18n.language, handleView],
  );

  const tableData: I.ApiListResponse<MyReviewTableRow> =
    data ??
    ({
      data: [],
      meta: {
        pageIndex: 0,
        pageSize: pagination.pageSize,
        total: 0,
        pageCount: 1,
      },
    } as I.ApiListResponse<MyReviewTableRow>);

  return (
    <div className="space-y-4">
      {isError && (
        <Alert variant="destructive" className="rounded-xl border-rose-200">
          <AlertCircle className="size-4" aria-hidden />
          <AlertTitle>{t('savedReviews.error_title')}</AlertTitle>
          <AlertDescription className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {(error as Error)?.message ?? t('savedReviews.error_body')}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit cursor-pointer"
              onClick={() => refetch()}
            >
              {t('savedReviews.retry')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t('savedReviews.filter_type')}
          </p>
          <Select
            value={entityFilter}
            onValueChange={(v) => setEntityFilter(v as EntityFilter)}
          >
            <SelectTrigger className="h-10 w-full min-w-[200px] max-w-sm cursor-pointer border-border bg-white text-primary sm:w-[240px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t('savedReviews.filter_all')}
              </SelectItem>
              {REVIEW_ENTITY_TYPES.map((et) => (
                <SelectItem key={et} value={et}>
                  {t(`savedReviews.entity.${et}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t('savedReviews.filter_status')}
          </p>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger className="h-10 w-full min-w-[200px] max-w-sm cursor-pointer border-border bg-white text-primary sm:w-[260px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t('savedReviews.filter_status_all')}
              </SelectItem>
              <SelectItem value="PENDING">
                {t('savedReviews.status.PENDING')}
              </SelectItem>
              <SelectItem value="APPROVED">
                {t('savedReviews.status.APPROVED')}
              </SelectItem>
              <SelectItem value="REJECTED">
                {t('savedReviews.status.REJECTED')}
              </SelectItem>
              <SelectItem value="HIDDEN">
                {t('savedReviews.status.HIDDEN')}
              </SelectItem>
              <SelectItem value="PENDING,APPROVED">
                {t('savedReviews.filter_status_pending_approved')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        hideSearch
        emptyMessage={t('savedReviews.table_empty')}
        tableState={{
          pagination,
          setPagination,
          sorting,
          setSorting,
          globalFilter,
          setGlobalFilter,
          rowSelection,
          setRowSelection,
          isFetching,
        }}
      />
    </div>
  );
};

const FAVORITE_ENTITY_TYPES = Object.values(FavoriteEntityType).filter(
  (v): v is FavoriteEntityType => typeof v === 'string',
);

type FavoriteEntityFilter = 'all' | FavoriteEntityType;

function getFavoriteDetailPath(
  entityType: FavoriteEntityType,
  entityId: string,
  summary?: FavoriteEntitySummary,
) {
  void summary;
  switch (entityType) {
    case FavoriteEntityType.TOUR: {
      return generatePath(ROUTES.TOUR.DETAIL, { id: entityId });
    }
    case FavoriteEntityType.ROOM:
      return generatePath(ROUTES.ROOM.DETAIL, { id: entityId });
    case FavoriteEntityType.HOTEL:
      return generatePath(ROUTES.HOTEL.DETAIL, { id: entityId });
    case FavoriteEntityType.GUIDE:
      return generatePath(ROUTES.TOUR_GUIDE.DETAIL, { id: entityId });
    default:
      return null;
  }
}

const MyFavoritesPanel: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language?.split('-')[0] || 'vi';

  const [entityFilter, setEntityFilter] = useState<FavoriteEntityFilter>('all');
  const [pagination, setPagination] = useState<I.Paginate>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [entityFilter]);

  const listParams = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      lang,
      ...(entityFilter === 'all' ? {} : { entityType: entityFilter }),
    }),
    [pagination.pageIndex, pagination.pageSize, lang, entityFilter],
  );

  const { data, isFetching, isError, error, refetch } =
    useMyFavoritesListQuery(listParams);

  const toggleMutation = useToggleFavoriteMutation();

  const handleView = useCallback(
    async (row: FavoriteRecord) => {
      setActionError(null);
      const path = getFavoriteDetailPath(
        row.entityType,
        row.entityId,
        row.entitySummary,
      );
      if (path) {
        navigate(path);
        return;
      }

      if (row.entityType === FavoriteEntityType.TOUR) {
        navigate(generatePath(ROUTES.TOUR.DETAIL, { id: row.entityId }));
      }
    },
    [navigate, t],
  );

  const handleRemove = useCallback(
    async (row: FavoriteRecord) => {
      setActionError(null);
      setLoadingRowId(row._id);
      try {
        await toggleMutation.mutateAsync({
          entityType: row.entityType,
          entityId: row.entityId,
        });
      } catch (e: unknown) {
        setActionError(
          (e as { message?: string })?.message ??
            t('savedFavorites.error_body'),
        );
      } finally {
        setLoadingRowId(null);
      }
    },
    [toggleMutation, t],
  );

  const columns = useMemo<ColumnDef<FavoriteRecord>[]>(
    () => [
      {
        id: 'entity',
        header: t('savedFavorites.col_entity'),
        cell: ({ row }) => {
          const r = row.original;
          const name = r.entitySummary?.name?.trim() || '—';
          const thumb = r.entitySummary?.thumbnailUrl;
          const rating = r.entitySummary?.ratingSummary?.average;
          const total = r.entitySummary?.ratingSummary?.total;
          return (
            <div className="flex max-w-[min(100vw-8rem,22rem)] items-start gap-3">
              <div className="size-12 shrink-0 overflow-hidden rounded-xl border border-border bg-vn-cream/50">
                {thumb ? (
                  <img src={thumb} alt="" className="size-full object-cover" />
                ) : (
                  <div
                    className="flex size-full items-center justify-center text-[10px] font-medium text-slate-400"
                    aria-hidden
                  >
                    —
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-snug text-primary line-clamp-2">
                  {name}
                </p>
                {rating != null && total != null && total > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t('savedFavorites.rating_line', {
                      average: rating.toFixed(1),
                      total,
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: 'type',
        header: t('savedFavorites.col_type'),
        cell: ({ row }) => (
          <Badge
            variant="secondary"
            className="whitespace-nowrap font-normal text-foreground"
          >
            {t(`savedFavorites.entity.${row.original.entityType}`)}
          </Badge>
        ),
      },
      {
        id: 'created',
        header: t('savedFavorites.col_created'),
        cell: ({ row }) =>
          formatDate(row.original.createdAt, i18n.language || 'vi'),
      },
      {
        id: 'actions',
        header: () => (
          <span className="sr-only">{t('savedFavorites.col_actions')}</span>
        ),
        cell: ({ row }) => {
          const r = row.original;
          const path = getFavoriteDetailPath(
            r.entityType,
            r.entityId,
            r.entitySummary,
          );
          const unsupported = path == null;
          const loading = loadingRowId === r._id;

          return (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={
                  unsupported && r.entityType !== FavoriteEntityType.TOUR
                }
                className="cursor-pointer border-primary/30 text-primary hover:bg-vn-red-soft/50"
                title={
                  unsupported && r.entityType !== FavoriteEntityType.TOUR
                    ? t('savedFavorites.view_unsupported')
                    : t('savedFavorites.view')
                }
                onClick={() => void handleView(r)}
              >
                {loading ? (
                  <Loader2 className="mr-1 size-4 animate-spin" aria-hidden />
                ) : (
                  <ArrowRight className="mr-1 size-4" aria-hidden />
                )}
                {t('savedFavorites.view')}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={loading}
                className="cursor-pointer border-rose-200 text-rose-700 hover:bg-rose-50"
                onClick={() => void handleRemove(r)}
              >
                {loading ? (
                  <Loader2 className="mr-1 size-4 animate-spin" aria-hidden />
                ) : (
                  <Trash2 className="mr-1 size-4" aria-hidden />
                )}
                {t('savedFavorites.remove')}
              </Button>
            </div>
          );
        },
      },
    ],
    [t, i18n.language, loadingRowId, handleView, handleRemove],
  );

  const tableData: I.ApiListResponse<FavoriteRecord> =
    data ??
    ({
      data: [],
      meta: {
        pageIndex: 0,
        pageSize: pagination.pageSize,
        total: 0,
        pageCount: 1,
      },
    } as I.ApiListResponse<FavoriteRecord>);

  return (
    <div className="space-y-4">
      {actionError && (
        <Alert variant="destructive" className="rounded-xl border-rose-200">
          <AlertCircle className="size-4" aria-hidden />
          <AlertTitle>{t('savedFavorites.error_title')}</AlertTitle>
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}
      {isError && (
        <Alert variant="destructive" className="rounded-xl border-rose-200">
          <AlertCircle className="size-4" aria-hidden />
          <AlertTitle>{t('savedFavorites.error_title')}</AlertTitle>
          <AlertDescription className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {(error as Error)?.message ?? t('savedFavorites.error_body')}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit cursor-pointer"
              onClick={() => refetch()}
            >
              {t('savedFavorites.retry')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t('savedFavorites.filter_type')}
          </p>
          <Select
            value={entityFilter}
            onValueChange={(v) => setEntityFilter(v as FavoriteEntityFilter)}
          >
            <SelectTrigger className="h-10 w-full min-w-[200px] max-w-sm cursor-pointer border-border bg-white text-primary sm:w-[240px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t('savedFavorites.filter_all')}
              </SelectItem>
              {FAVORITE_ENTITY_TYPES.map((et) => (
                <SelectItem key={et} value={et}>
                  {t(`savedFavorites.entity.${et}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {isFetching && (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              <span>{t('savedFavorites.loading')}</span>
            </>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        hideSearch
        emptyMessage={t('savedFavorites.table_empty')}
        tableState={{
          pagination,
          setPagination,
          sorting,
          setSorting,
          globalFilter,
          setGlobalFilter,
          rowSelection,
          setRowSelection,
          isFetching,
        }}
      />
    </div>
  );
};

const DashboardSavedPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab = tabParam === 'wishlist' ? 'wishlist' : 'reviews';

  const setTab = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'reviews') {
      next.delete('tab');
    } else {
      next.set('tab', value);
    }
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="flex-1 space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-primary sm:text-2xl">
          {t('savedReviews.page_title')}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          {t('savedReviews.page_subtitle')}
        </p>
      </div>

      <Card className="overflow-hidden rounded-2xl border-border/90 bg-white shadow-sm">
        <CardHeader className="border-b border-border bg-vn-cream/50/80 px-4 py-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
            <MessageSquareText className="size-5 text-primary" aria-hidden />
            {t('savedReviews.card_title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Tabs value={activeTab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-6 h-auto w-full justify-start gap-6 border-b border-border bg-transparent p-0">
              <TabsTrigger
                value="reviews"
                className="cursor-pointer rounded-none border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-muted-foreground shadow-none transition-colors data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                {t('savedReviews.tab_reviews')}
              </TabsTrigger>
              <TabsTrigger
                value="wishlist"
                className="cursor-pointer rounded-none border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-muted-foreground shadow-none transition-colors data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                {t('savedReviews.tab_wishlist')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="reviews" className="mt-0 outline-none">
              <MyReviewsPanel />
            </TabsContent>
            <TabsContent value="wishlist" className="mt-0 outline-none">
              <MyFavoritesPanel />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSavedPage;
