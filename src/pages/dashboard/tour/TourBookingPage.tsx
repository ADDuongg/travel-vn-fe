/**
 * Đơn tour của tôi (dashboard) – GET /api/v1/tour-bookings/my-bookings
 * docs/FE-API-TOUR-PHASE2.md
 */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DataTable from '@/shared/table/DataTable';
import { useMyTourBookingsQuery } from '@/features/tours/booking-hooks';
import type { TourBookingListItem, TourBookingTourRef } from '@/features/tours/booking-types';
import type { RowSelectionState, SortingState } from '@tanstack/react-table';
import type { Paginate } from '@interface/api';
import { ROUTES } from '@/constants/router';
import { fmtMoney, fmtDate } from '@/utils';

function getTourName(tourId: TourBookingListItem['tourId']): string {
  if (!tourId) return '—';
  if (typeof tourId === 'string') return '—';
  const tr = (tourId as TourBookingTourRef).translations;
  if (tr?.vi?.name) return tr.vi.name;
  if (tr?.en?.name) return tr.en.name;
  return (tourId as TourBookingTourRef).code ?? '—';
}

function getTourSlug(tourId: TourBookingListItem['tourId']): string | null {
  if (!tourId || typeof tourId === 'string') return null;
  return (tourId as TourBookingTourRef).slug ?? null;
}

const TOUR_STATUS_KEYS: Record<string, string> = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

const StatusBadge: React.FC<{ status: string; label: string }> = ({ status, label }) => (
  <Badge
    variant="outline"
    className={
      status === 'CANCELLED'
        ? 'border-rose-300 text-rose-700'
        : status === 'PAID' || status === 'COMPLETED'
          ? 'border-emerald-300 text-emerald-700'
          : 'border-amber-300 text-amber-700'
    }
  >
    {label}
  </Badge>
);

const useColumns = (): ColumnDef<TourBookingListItem>[] => {
  const { t } = useTranslation();
  const statusLabels = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(TOUR_STATUS_KEYS).map(([k, v]) => [
          k,
          t(`bookings.status_${v}`),
        ]),
      ) as Record<string, string>,
    [t],
  );

  return useMemo(
    () => [
      {
        accessorKey: 'bookingCode',
        header: () => t('bookings.table_booking_code'),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <Link
              to={ROUTES.DASHBOARD.TOUR_BOOKINGS_DETAIL.replace(':code', item.bookingCode)}
              className="font-mono font-medium text-primary hover:underline"
            >
              {item.bookingCode}
            </Link>
          );
        },
      },
      {
        id: 'tourName',
        header: () => t('bookings.table_tour'),
        cell: ({ row }) => {
          const item = row.original;
          const name = getTourName(item.tourId);
          const slug = getTourSlug(item.tourId);
          if (slug) {
            return (
              <Link
                to={ROUTES.TOUR.DETAIL.replace(':slug', slug)}
                className="text-primary hover:underline"
              >
                {name}
              </Link>
            );
          }
          return <span>{name}</span>;
        },
      },
      {
        accessorKey: 'departureDate',
        header: () => t('bookings.table_departure_date'),
        cell: ({ getValue }) => (
          <span>{fmtDate(getValue<string>())}</span>
        ),
      },
      {
        accessorKey: 'totalAmount',
        header: () => t('bookings.table_total'),
        cell: ({ row }) => (
          <span>{fmtMoney(row.original.totalAmount, 'VND')}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: () => t('bookings.table_status'),
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <StatusBadge
              status={status}
              label={statusLabels[status] ?? status}
            />
          );
        },
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">{t('bookings.table_actions')}</span>,
        cell: ({ row }) => (
          <Button variant="ghost" size="sm" asChild>
            <Link
              to={ROUTES.DASHBOARD.TOUR_BOOKINGS_DETAIL.replace(':code', row.original.bookingCode)}
            >
              {t('bookings.table_detail')}
            </Link>
          </Button>
        ),
        size: 80,
      },
    ],
    [t, statusLabels],
  );
};

const TourBookingPage: React.FC = () => {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<Paginate>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const { data: apiData, isFetching } = useMyTourBookingsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const tableData = useMemo(() => {
    if (!apiData) {
      return {
        data: [] as TourBookingListItem[],
        meta: {
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          total: 0,
          pageCount: 0,
        },
      };
    }
    return {
      data: apiData.items,
      meta: {
        pageIndex: apiData.pagination.page - 1,
        pageSize: apiData.pagination.limit,
        total: apiData.pagination.total,
        pageCount: apiData.pagination.totalPages,
      },
    };
  }, [apiData, pagination.pageIndex, pagination.pageSize]);

  const columns = useColumns();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t('bookings.my_tour_bookings')}</h2>
      <Separator />

      <DataTable
        columns={columns}
        data={tableData}
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

export default TourBookingPage;
