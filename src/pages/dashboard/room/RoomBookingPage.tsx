import { cn } from '@/lib/utils';
import { useMyBookings } from '@/features/booking/hooks';
import type { Booking } from '@/features/shared/types';
import DataTable from '@/shared/table/DataTable';
import * as I from '@/types/api';
import type { RowSelectionState, SortingState } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useColumns } from './table/room-booking-columns';

type BookingStatusFilter =
  | 'all'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED';

const STATUS_KEYS: BookingStatusFilter[] = [
  'all',
  'PENDING',
  'APPROVED',
  'COMPLETED',
  'REJECTED',
  'CANCELLED',
];

const StatusFilterBar: React.FC<{
  active: BookingStatusFilter;
  onChange: (s: BookingStatusFilter) => void;
  labels: Record<BookingStatusFilter, string>;
}> = ({ active, onChange, labels }) => (
  <div
    className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden"
    role="tablist"
    aria-label="Booking status"
  >
    {STATUS_KEYS.map((s) => {
      const isActive = active === s;
      return (
        <button
          key={s}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(s)}
          className={cn(
            'shrink-0 snap-start rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none',
            'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/35 focus-visible:ring-offset-2',
            isActive
              ? 'border-forest bg-forest text-sand-50 shadow-soft'
              : 'border-charcoal/15 bg-card text-charcoal/75 hover:border-forest/25 hover:bg-charcoal/4',
          )}
        >
          {labels[s]}
        </button>
      );
    })}
  </div>
);

const RoomBookingPage: React.FC = () => {
  const { t } = useTranslation();
  const statusLabels = useMemo(
    (): Record<BookingStatusFilter, string> => ({
      all: t('bookings.status_all'),
      PENDING: t('bookings.status_pending'),
      APPROVED: t('bookings.status_approved'),
      REJECTED: t('bookings.status_rejected'),
      CANCELLED: t('bookings.status_cancelled'),
      COMPLETED: t('bookings.status_completed'),
    }),
    [t],
  );

  const [status, setStatus] = useState<BookingStatusFilter>('all');
  const [pagination, setPagination] = useState<I.Paginate>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const sortParams: I.SortParam[] = sorting.map((s) => ({
    by: s.id,
    dir: s.desc ? 'desc' : 'asc',
  }));

  const { data, isFetching } = useMyBookings({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    q: globalFilter || undefined,
    status: status !== 'all' ? status : undefined,
    sort: sortParams,
  });

  const columns = useColumns();
  const emptyData = {
    data: [] as Booking[],
    meta: {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      total: 0,
      pageCount: 0,
    },
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-charcoal/10 bg-gradient-to-br from-sand-100/90 via-sand-50 to-sand-100/85 p-5 shadow-soft sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/45">
          {t('bookings.dashboard_room_eyebrow')}
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-charcoal sm:text-[1.65rem]">
          {t('bookings.my_room_bookings')}
        </h2>
        <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-charcoal/60 sm:text-base">
          {t('bookings.table_section_room_sub')}
        </p>
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-card p-4 shadow-soft sm:p-6">
        <div className="mt-0">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/45">
            {t('bookings.table_filter_status')}
          </p>
          <StatusFilterBar
            active={status}
            onChange={(s) => {
              setStatus(s);
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
            labels={statusLabels}
          />
        </div>

        <div className="mt-6">
          <DataTable
            columns={columns}
            data={data ?? emptyData}
            searchPlaceholder={t('bookings.table_search_room')}
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

export default RoomBookingPage;
