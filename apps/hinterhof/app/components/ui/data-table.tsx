import {
  type ColumnDef,
  type OnChangeFn,
  type RowSelectionState,
  type TableOptions,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from './data-table-pagination';
import { Input } from './input';
import { Label } from './label';

namespace DataTable {
  export interface Props<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    withPagination?: boolean;
    withFilter?: boolean;
    withMultipleSelection?: boolean;
    getRowId?: TableOptions<TData>['getRowId'];
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  withPagination,
  withFilter,
  withMultipleSelection = false,
  rowSelection,
  onRowSelectionChange,
  getRowId,
}: DataTable.Props<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    enableMultiRowSelection: withMultipleSelection,
    getRowId,
    onRowSelectionChange,
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: withPagination ? getPaginationRowModel() : undefined,
    getFilteredRowModel: withFilter ? getFilteredRowModel() : undefined,
    globalFilterFn: 'includesString',
  });

  return (
    <div className="flex flex-col gap-y-4">
      {withFilter && (
        <div className="flex items-center gap-x-2 p-2">
          <Label className="text-muted-foreground">Filter: </Label>
          <Input
            placeholder="Suche nach..."
            onChange={(event) => table.setGlobalFilter(event.target.value)}
          />
        </div>
      )}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {withPagination && <DataTablePagination table={table} />}
    </div>
  );
}
