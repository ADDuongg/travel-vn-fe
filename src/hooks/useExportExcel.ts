import { useState } from 'react';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';

type ColumnMeta = {
  key?: string;
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
  header: string;
};
const mockColumns = [
  { header: 'ID', key: 'id' },
  {
    header: 'Thông tin cá nhân',
    children: [
      { header: 'Họ tên', key: 'name' },
      { header: 'Trạng thái', key: 'status' },
      {
        header: 'Liên hệ',
        children: [
          { header: 'Email', key: 'email' },
          { header: 'SĐT', key: 'phone' },
        ],
      },
    ],
  },
];

const mockData = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'a@example.com',
    phone: '0123456789',
    address: 'Hà Nội',
    status: 'single',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'b@example.com',
    phone: '0987654321',
    address: 'Hồ Chí Minh',
    status: 'married',
  },
];

/* hàm này dùng để tự động lấy các giá trị A,B,C,D,1,2,3,4 trong excel */
const columnLetter = (colIndex: number): string => {
  let letter = '';
  let num = colIndex;
  while (num > 0) {
    const mod = (num - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    num = Math.floor((num - mod) / 26);
  }
  return letter;
};

/* hàm này dùng để tìm đến cấp độ của các giá trị trong excel thông qua children của columns */
const getMaxDepth = (cols: any[], depth = 1): number =>
  Math.max(
    ...cols.map((col) =>
      col.children ? getMaxDepth(col.children, depth + 1) : depth,
    ),
  );

/* hàm này dùng để tìm đến các giá trị trong excel */
const parseHeaders = (
  cols: any[],
  depth: number,
  colStart = 1,
  row = 1,
  metas: ColumnMeta[] = [],
): { nextCol: number; metas: ColumnMeta[] } => {
  let col = colStart;
  for (const colItem of cols) {
    const isParent = !!colItem.children;
    const rowStart = row;
    const colStartHere = col;

    if (isParent) {
      const { nextCol } = parseHeaders(
        colItem.children,
        depth,
        col,
        row + 1,
        metas,
      );
      metas.push({
        header: colItem.header,
        colStart: col,
        colEnd: nextCol - 1,
        rowStart,
        rowEnd: row,
      });
      col = nextCol;
    } else {
      metas.push({
        header: colItem.header,
        key: colItem.key,
        colStart: col,
        colEnd: col,
        rowStart,
        rowEnd: depth,
      });
      col++;
    }
  }
  return { nextCol: col, metas };
};

export const useExportExcel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportExcel = async (
    data: any[] = mockData,
    columns: any[] = mockColumns,
    format: Record<string, (value: any) => any> = {},
    fileName = 'export.xlsx',
  ) => {
    setLoading(true);
    setError(null);

    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Sheet 1');

      const maxDepth = getMaxDepth(columns);
      const { metas } = parseHeaders(columns, maxDepth);

      // Headers
      metas.forEach(({ header, colStart, colEnd, rowStart, rowEnd }) => {
        const from = columnLetter(colStart);
        const to = columnLetter(colEnd);
        const cell = sheet.getCell(`${from}${rowStart}`);
        cell.value = header;
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        if (from !== to || rowStart !== rowEnd) {
          sheet.mergeCells(`${from}${rowStart}:${to}${rowEnd}`);
        }
      });

      const leafKeys = metas.filter((m) => m.key).map((m) => m.key!);
      const formatters: Record<string, (value: any) => any> = {
        // status: (v) => (v === 'single' ? 'Độc thân' : v === 'married' ? 'Đã kết hôn' : 'Khác'),
        ...format,
      };

      data.forEach((row, rowIndex) => {
        leafKeys.forEach((key, colIndex) => {
          const rawValue = row[key];
          const formatter = formatters[key];
          const cellValue = formatter ? formatter(rawValue) : rawValue;
          sheet.getCell(rowIndex + maxDepth + 1, colIndex + 1).value =
            cellValue;
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), fileName);
    } catch (err: any) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    exportExcel,
    loading,
    error,
  };
};
