'use client';

import getParameterColumns from '@/app/dashboard/(roles)/department-coordinator/evaluations/[id]/ParameterColumns';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import TablePagination from '@/components/ui/TablePagination';
import TableSearch from '@/components/ui/TableSearch';
import {
  useDeleteParameter,
  useUpdateParameter,
} from '@/services/mutations/parameters';
import { useParametersForEvaluation } from '@/services/queries';
import Parameter from '@/types/parameters';
import {
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

const ParametersTable = ({ evalId }: { evalId: string }) => {
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: parameters, isLoading } = useParametersForEvaluation(evalId);

  const { deleteParameter } = useDeleteParameter(evalId);
  const { updateParameter } = useUpdateParameter(evalId);

  const parameterColumns = useMemo(
    () =>
      getParameterColumns({
        onDelete: deleteParameter,
        onUpdate: updateParameter,
      }),
    [deleteParameter, updateParameter]
  );

  const tableData = useMemo(
    () => (isLoading ? Array(10).fill({}) : parameters),
    [isLoading, parameters]
  );

  const tableColumns = useMemo(
    () =>
      isLoading
        ? parameterColumns.map((column, index) => ({
            ...column,
            cell: () => (
              <Skeleton key={`loading-cell-${index}`} className="h-8 rounded" />
            ),
          }))
        : parameterColumns,
    [isLoading, parameterColumns]
  );

  const table = useReactTable({
    data: tableData as Parameter[],
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  if (!mounted) {
    return (
      <div className="h-80 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <Card className="p-5">
      {isLoading ? (
        <Skeleton className="h-10 max-w-xs rounded-md" />
      ) : (
        mounted && (
          <TableSearch table={table} placeholder="Search Text" column="text" />
        )
      )}
      {mounted && (
        <TableContent<Parameter>
          table={table}
          isLoading={isLoading}
          mounted={mounted}
          tableData={parameters}
          tableColumns={tableColumns}
        />
      )}
      {parameters && <TablePagination table={table} />}
    </Card>
  );
};

export default ParametersTable;
