import {
  type ColumnDef,
  type Row,
  type RowData,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { twMerge } from 'tailwind-merge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    cellClasses?: string;
    thClasses?: string;
    tdClasses?: string;
  }
  interface TableMeta<TData extends RowData> {
    getRowClasses?: (row: Row<TData>) => string;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowClasses?: (row: Row<TData>) => string;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  getRowClasses,
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      getRowClasses,
    },
  });

  return (
    <div className={className}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={twMerge(
                      header.column.columnDef.meta?.cellClasses,
                      header.column.columnDef.meta?.thClasses,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="before:-indent-[9999px] before:block before:leading-[2px] before:content-['@']">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={table.options.meta?.getRowClasses?.(row)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={twMerge(
                      cell.column.columnDef.meta?.cellClasses,
                      cell.column.columnDef.meta?.tdClasses,
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Keine Daten.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
