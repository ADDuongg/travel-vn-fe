import { Separator } from '@/components/ui/separator';
import { useMyBookings } from '@/features/booking/hooks';
import type { Booking } from '@/features/shared/types';
import DataTable from '@/shared/table/DataTable';
import * as I from '@/interface/api';
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
  <div className="text-sm">
    {STATUS_KEYS.map((s, i) => (
      <React.Fragment key={s}>
        <button
          type="button"
          onClick={() => onChange(s)}
          className={
            active === s
              ? 'text-primary underline underline-offset-4'
              : 'text-muted-foreground hover:text-foreground'
          }
        >
          {labels[s]}
        </button>
        {i < STATUS_KEYS.length - 1 && (
          <span className="mx-2 text-muted-foreground">|</span>
        )}
      </React.Fragment>
    ))}
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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t('bookings.my_room_bookings')}</h2>
      <StatusFilterBar
        active={status}
        onChange={(s) => {
          setStatus(s);
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        }}
        labels={statusLabels}
      />
      <Separator />

      <DataTable
        columns={columns}
        data={data ?? emptyData}
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

export default RoomBookingPage;
