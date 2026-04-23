/**
 * Đơn tour của tôi (dashboard) – GET /api/v1/tour-bookings/my-bookings
 * docs/FE-API-TOUR-PHASE2.md
 */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DataTable from '@/shared/table/DataTable';
import { useMyTourBookingsQuery } from '@/features/tours/hooks';
import type {
  TourBookingListItem,
  TourBookingTourRef,
} from '@/features/tours/types';
import type { RowSelectionState, SortingState } from '@tanstack/react-table';
import * as I from '@/types/api';
import { ROUTES } from '@/constants/router';
import { fmtMoney, fmtDate, getPaymentExpireAt } from '@/utils';
import { useCountdown } from '@/hooks/useCountdown';

function getTourName(tourId: TourBookingListItem['tourId']): string {
  if (!tourId) return '—';
  if (typeof tourId === 'string') return '—';
  const tr = (tourId as TourBookingTourRef).translations;
  if (tr?.vi?.name) return tr.vi.name;
  if (tr?.en?.name) return tr.en.name;
  return (tourId as TourBookingTourRef).code ?? '—';
}

function getTourId(tourId: TourBookingListItem['tourId']): string | null {
  if (!tourId || typeof tourId === 'string') return null;
  return (tourId as TourBookingTourRef)._id ?? null;
}

const TOUR_STATUS_KEYS: Record<string, string> = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

const StatusBadge: React.FC<{ status: string; label: string }> = ({
  status,
  label,
}) => (
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

/** Nút Detail + Pay online; ẩn Pay online khi đã hết hạn (1h) hoặc paymentStatus EXPIRED */
const TourActionsCell: React.FC<{ item: TourBookingListItem }> = ({ item }) => {
  const { t } = useTranslation();
  const paymentStatus =
    item.paymentStatus ?? (item.status === 'PAID' ? 'PAID' : 'UNPAID');
  const expireAt = getPaymentExpireAt(item.createdAt);
  const remaining = useCountdown(expireAt);
  const isExpired =
    paymentStatus === 'EXPIRED' || (paymentStatus === 'UNPAID' && !remaining);
  const canPay =
    (item.status === 'PENDING' || item.status === 'CONFIRMED') &&
    item._id &&
    !isExpired;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer border-[#1E3A8A]/25 font-medium text-[#1E3A8A] transition-colors hover:bg-[#1E3A8A]/5"
        asChild
      >
        <Link
          to={ROUTES.DASHBOARD.TOUR_BOOKINGS_DETAIL.replace(
            ':code',
            item.bookingCode,
          )}
        >
          {t('bookings.table_detail')}
        </Link>
      </Button>
      {canPay && (
        <Button
          variant="default"
          size="sm"
          className="cursor-pointer bg-[#CA8A04] font-medium text-white shadow-sm transition-colors hover:bg-[#B45309]"
          asChild
        >
          <Link to={ROUTES.TOUR_BOOKING_PAYMENT.replace(':id', item._id)}>
            {t('bookings.pay_online')}
          </Link>
        </Button>
      )}
    </div>
  );
};

/** Giống room: UNPAID thì hoặc "Unpaid + Pay within MM:SS" hoặc chỉ "Expired" (không show cả hai) */
const TourPaymentCell: React.FC<{ item: TourBookingListItem }> = ({ item }) => {
  const { t } = useTranslation();
  const expireAt = getPaymentExpireAt(item.createdAt);
  const remaining = useCountdown(expireAt);

  if (!remaining) {
    return (
      <div>
        <Badge variant="destructive">{t('bookings.payment_expired')}</Badge>
        <div className="text-xs text-muted-foreground mt-1">
          {t('bookings.payment_expired_desc')}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Badge variant="outline" className="border-amber-300 text-amber-700">
        {t('bookings.payment_unpaid')}
      </Badge>
      <div className="text-xs text-muted-foreground mt-1">
        {t('bookings.pay_within')}{' '}
        <span className="font-medium text-amber-600">
          {remaining.minutes}:{remaining.seconds.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

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
              to={ROUTES.DASHBOARD.TOUR_BOOKINGS_DETAIL.replace(
                ':code',
                item.bookingCode,
              )}
              className="cursor-pointer font-mono text-sm font-semibold text-[#2563EB] underline-offset-2 hover:text-[#1D4ED8] hover:underline"
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
          const id = getTourId(item.tourId);
          if (id) {
            return (
              <Link
                to={ROUTES.TOUR.DETAIL.replace(':id', id)}
                className="cursor-pointer font-medium text-[#2563EB] underline-offset-2 hover:text-[#1D4ED8] hover:underline"
              >
                {name}
              </Link>
            );
          }
          return <span className="font-medium text-slate-800">{name}</span>;
        },
      },
      {
        accessorKey: 'departureDate',
        header: () => t('bookings.table_departure_date'),
        cell: ({ getValue }) => (
          <span className="tabular-nums text-slate-800">
            {fmtDate(getValue<string>())}
          </span>
        ),
      },
      {
        accessorKey: 'totalAmount',
        header: () => t('bookings.table_total'),
        cell: ({ row }) => (
          <span className="font-semibold tabular-nums text-[#1E40AF]">
            {fmtMoney(row.original.totalAmount, 'VND')}
          </span>
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
        accessorKey: 'paymentStatus',
        header: () => t('bookings.table_payment'),
        cell: ({ row }) => {
          const item = row.original;
          const status =
            item.paymentStatus ?? (item.status === 'PAID' ? 'PAID' : 'UNPAID');

          if (status === 'PAID') {
            return (
              <Badge
                variant="outline"
                className="border-emerald-300 text-emerald-700"
              >
                {t('bookings.payment_paid')}
              </Badge>
            );
          }

          if (status === 'EXPIRED') {
            return (
              <div>
                <Badge variant="destructive">
                  {t('bookings.payment_expired')}
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">
                  {t('bookings.payment_expired_desc')}
                </div>
              </div>
            );
          }

          if (status === 'UNPAID') {
            return <TourPaymentCell item={item} />;
          }

          return <Badge variant="outline">{status}</Badge>;
        },
      },
      {
        id: 'actions',
        header: () => (
          <span className="sr-only">{t('bookings.table_actions')}</span>
        ),
        cell: ({ row }) => {
          const item = row.original;
          return <TourActionsCell item={item} />;
        },
        size: 140,
      },
    ],
    [t, statusLabels],
  );
};

const TourBookingPage: React.FC = () => {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<I.Paginate>({
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
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[#1E3A8A] sm:text-xl">
            {t('bookings.my_tour_bookings')}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            {t('bookings.table_section_tour_sub')}
          </p>
        </div>

        <div className="mt-6">
          <DataTable
            columns={columns}
            data={tableData}
            searchPlaceholder={t('bookings.table_search_tour')}
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
      </div>
    </div>
  );
};

export default TourBookingPage;
