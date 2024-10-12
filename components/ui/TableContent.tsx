'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  flexRender,
  HeaderGroup,
  Table as ReactTable,
  Row,
} from '@tanstack/react-table';

type TableContentProps<TData> = {
  table: ReactTable<TData>;
  isLoading: boolean;
  mounted: boolean;
  tableData: TData[] | null | undefined;
  tableColumns: any[];
  className?: string;
};

const TableContent = <TData,>({
  table,
  isLoading,
  mounted,
  tableData,
  tableColumns,
  className,
}: TableContentProps<TData>) => {
  return (
    <div className={cn('rounded-md border-2 overflow-auto my-4', className)}>
      <Table className="text-sm">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {tableData && table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: Row<TData>) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="h-14 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : !isLoading && mounted ? (
            <TableRow>
              <TableCell
                colSpan={tableColumns.length}
                className="h-24 text-center"
              >
                No data available.
              </TableCell>
            </TableRow>
          ) : null}
          {isLoading &&
            table.getRowModel().rows?.length &&
            table.getRowModel().rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.getVisibleCells().map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className="py-3">
                    <Skeleton className="h-8 rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableContent;
