// TourBookingPage.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import type {
  ColumnDef,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, DollarSign, Trash2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DataTable from '../../../shared/table/DataTable';
import api from '@/lib/axios'; // axios client của bạn
import { useBookingsQuery } from '@/features/tours/hooks';
import type { SortParam } from '@interface/api';
type BookingStatus =
  | 'all'
  | 'pending'
  | 'approved'
  | 'receipt_submitted'
  | 'online_paid'
  | 'deposit_paid'
  | 'departed'
  | 'rejected'
  | 'wait_for_approval';
type PaymentStatus = 'pending' | 'paid' | 'refunded';

type BookingRow = {
  id: string;
  tourName: string;
  tourUrl?: string;
  travelDate: string;
  total: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
};

type ApiListResponse<T> = {
  data: T[];
  meta: {
    pageIndex: number;
    pageSize: number;
    total: number;
    pageCount: number;
  };
};

const STATUS_ITEMS: { key: BookingStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'receipt_submitted', label: 'Receipt Submitted' },
  { key: 'online_paid', label: 'Online Paid' },
  { key: 'deposit_paid', label: 'Deposit Paid' },
  { key: 'departed', label: 'Departed' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'wait_for_approval', label: 'Wait For Approval' },
];

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso));

const PaymentBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  switch (status) {
    case 'paid':
      return (
        <Badge className="bg-emerald-500 hover:bg-emerald-600">Paid</Badge>
      );
    case 'pending':
      return (
        <Badge
          variant="outline"
          className="text-emerald-600 border-emerald-200"
        >
          Pending
        </Badge>
      );
    case 'refunded':
      return <Badge className="bg-gray-500 hover:bg-gray-600">Refunded</Badge>;
  }
};

const ActionsCell: React.FC<{
  row: BookingRow;
  onPay: (row: BookingRow) => void;
  onDelete: (row: BookingRow) => void;
}> = ({ row, onPay, onDelete }) => (
  <div className="flex items-center gap-2">
    <Button
      variant="secondary"
      size="icon"
      className="h-8 w-8"
      onClick={() => onPay(row)}
      title="Pay now"
    >
      <DollarSign className="h-4 w-4" />
    </Button>
    <Button
      variant="secondary"
      size="icon"
      className="h-8 w-8"
      onClick={() => onDelete(row)}
      title="Delete booking"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

/* columns giữ nguyên ý tưởng hiện tại :contentReference[oaicite:2]{index=2} */
const useColumns = (
  onPay: (r: BookingRow) => void,
  onDelete: (r: BookingRow) => void,
): ColumnDef<BookingRow>[] =>
  useMemo<ColumnDef<BookingRow>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                ? 'indeterminate'
                : false
            }
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 32,
      },
      {
        accessorKey: 'tourName',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              // column.toggleSorting(column.getIsSorted() === 'asc', true)
              column.toggleSorting(column.getIsSorted() === 'asc')
            }
          >
            Tour Name
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          const v = row.original;
          return v.tourUrl ? (
            <Link to={v.tourUrl} className="text-primary hover:underline">
              {v.tourName}
            </Link>
          ) : (
            <span className="text-primary">{v.tourName}</span>
          );
        },
      },
      {
        accessorKey: 'travelDate',
        header: () => <div>Travel Date</div>,
        cell: ({ getValue }) => <span>{fmtDate(getValue<string>())}</span>,
      },
      {
        accessorKey: 'total',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              // column.toggleSorting(column.getIsSorted() === 'asc', true)
              column.toggleSorting(column.getIsSorted() === 'asc')
            }
          >
            Total
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ getValue }) => (
          <span>{currency.format(getValue<number>())}</span>
        ),
      },
      {
        accessorKey: 'paymentStatus',
        header: () => <div>Payment Status</div>,
        cell: ({ getValue }) => (
          <PaymentBadge status={getValue<PaymentStatus>()} />
        ),
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <ActionsCell row={row.original} onPay={onPay} onDelete={onDelete} />
        ),
        size: 80,
      },
    ],
    [onPay, onDelete],
  );

const StatusFilterBar: React.FC<{
  active: BookingStatus;
  onChange: (s: BookingStatus) => void;
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

const TourBookingPage: React.FC = () => {
  const [status, setStatus] = useState<BookingStatus>('all');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const sortParams: SortParam[] = sorting.map((s) => ({
    by: s.id,
    dir: s.desc ? 'desc' : 'asc',
  }));
  const { data, isFetching } = useBookingsQuery({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    q: globalFilter || undefined,
    status: status !== 'all' ? status : undefined,
    sort: sortParams,
  });

  const onPay = (row: BookingRow) => console.log('Pay for booking:', row.id);
  const onDelete = (row: BookingRow) => console.log('Delete booking:', row.id);

  const columns = useColumns(onPay, onDelete);

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
        data={
          data ?? {
            data: [],
            meta: {
              pageIndex: 0,
              pageSize: pagination.pageSize,
              total: 0,
              pageCount: 0,
            },
          }
        }
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
