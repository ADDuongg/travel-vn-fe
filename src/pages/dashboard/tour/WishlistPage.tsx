import { Separator } from '@components/ui/separator';
import React, { useMemo, useState } from 'react';
import type {
  ColumnDef,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { Checkbox } from '@components/ui/checkbox';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Button } from '@components/ui/button';
import { useBookingsQuery } from '@/features/tours/hooks';
import * as I from '@/interface/api';
import type { BookingStatus } from '@/features/shared/types';
import DataTable from '@/shared/table/DataTable';
type WishRow = {
  id: string; // bắt buộc để getRowId/selection
  tourName: string; // chỉ cần trường này để hiển thị
  tourUrl?: string; // nếu có link
};

const WishListPage: React.FC = () => {
  const [status, setStatus] = useState<BookingStatus>('all');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const sortParams: I.SortParam[] = sorting.map((s) => ({
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
  const ActionsCell: React.FC<{
    row: any;
    onDelete: (row: any) => void;
  }> = ({ row, onDelete }) => (
    <div className="flex items-center justify-center gap-2">
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
  const onDelete = (row: WishRow) => {
    console.log('Delete booking:', row.id);
  };
  const useColumns = (): ColumnDef<WishRow>[] =>
    useMemo<ColumnDef<WishRow>[]>(
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
          id: 'actions',
          header: () => <span className="sr-only">Actions</span>,
          cell: ({ row }) => (
            <ActionsCell row={row.original} onDelete={onDelete} />
          ),
          size: 80,
        },
      ],
      [onDelete],
    );
  const columns = useColumns();

  return (
    <div className="space-y-4">
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
          // rowSelection,
          // setRowSelection,
          isFetching,
        }}
      />
    </div>
  );
};

export default WishListPage;
