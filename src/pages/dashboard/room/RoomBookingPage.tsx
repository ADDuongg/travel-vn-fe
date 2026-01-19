import { Separator } from '@/components/ui/separator';
import { useMyBookings } from '@/features/booking/hooks';
import type { Booking } from '@/features/shared/types';
import DataTable from '@/shared/table/DataTable';
import type { Paginate, SortParam } from '@interface/api';
import type { RowSelectionState, SortingState } from '@tanstack/react-table';
import React, { useState } from 'react';
import { useColumns } from './table/room-booking-columns';
import { useNavigate } from 'react-router';

type BookingStatusFilter =
  | 'all'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED';

const STATUS_ITEMS: { key: BookingStatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'REJECTED', label: 'Rejected' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

const StatusFilterBar: React.FC<{
  active: BookingStatusFilter;
  onChange: (s: BookingStatusFilter) => void;
}> = ({ active, onChange }) => (
  <div className="text-sm">
    {STATUS_ITEMS.map((s, i) => (
      <React.Fragment key={s.key}>
        <button
          type="button"
          onClick={() => onChange(s.key)}
          className={
            active === s.key
              ? 'text-primary underline underline-offset-4'
              : 'text-muted-foreground hover:text-foreground'
          }
        >
          {s.label}
        </button>
        {i < STATUS_ITEMS.length - 1 && (
          <span className="mx-2 text-muted-foreground">|</span>
        )}
      </React.Fragment>
    ))}
  </div>
);

const RoomBookingPage: React.FC = () => {
  const [status, setStatus] = useState<BookingStatusFilter>('all');
  const [pagination, setPagination] = useState<Paginate>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const sortParams: SortParam[] = sorting.map((s) => ({
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

  const navigate = useNavigate();

  const onPay = (row: Booking) => {
    navigate(`/dashboard/room-bookings/${row._id}`);
  };
  const onDelete = (row: Booking) =>
    console.log('Delete room booking:', row._id);

  const columns = useColumns(onPay, onDelete);
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
      <StatusFilterBar
        active={status}
        onChange={(s) => {
          setStatus(s);
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        }}
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
