'use client';

import getEvaluationColumns from '@/app/dashboard/(roles)/department-coordinator/evaluations/evaluationColumns';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import TablePagination from '@/components/ui/TablePagination';
import TableSearch from '@/components/ui/TableSearch';
import { useUser } from '@/context/UserContext';
import {
  useUpdateEvaluation,
  useDeleteEvaluation,
} from '@/services/mutations/evaluations';
import { useEvaluations } from '@/services/queries';
import Evaluations from '@/types/evaluations';
import {
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

const EvaluationsTable = () => {
  const { user, instituteId } = useUser();
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: evaluations, isLoading } = useEvaluations({
    instituteId,
    departmentId: user?.uid,
  });

  const { deleteEvaluation } = useDeleteEvaluation({
    instituteId: instituteId!,
    departmentId: user?.uid,
  });
  const { updateEvaluation } = useUpdateEvaluation({
    instituteId: instituteId!,
    departmentId: user?.uid,
  });

  const evaluationColumns = useMemo(
    () =>
      getEvaluationColumns({
        onDelete: deleteEvaluation,
        onUpdate: updateEvaluation,
        dashboardRole: 'department-coordinator',
      }),
    [deleteEvaluation, updateEvaluation]
  );

  const tableData = useMemo(
    () => (isLoading ? Array(10).fill({}) : evaluations),
    [isLoading, evaluations]
  );

  const tableColumns = useMemo(
    () =>
      isLoading
        ? evaluationColumns.map((column, index) => ({
            ...column,
            cell: () => (
              <Skeleton key={`loading-cell-${index}`} className="h-8 rounded" />
            ),
          }))
        : evaluationColumns,
    [isLoading, evaluationColumns]
  );

  const table = useReactTable({
    data: tableData as Evaluations[],
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
          <TableSearch table={table} placeholder="Search Name" column="name" />
        )
      )}
      {mounted && (
        <TableContent<Evaluations>
          table={table}
          isLoading={isLoading}
          mounted={mounted}
          tableData={evaluations}
          tableColumns={tableColumns}
        />
      )}
      {evaluations && <TablePagination table={table} />}
    </Card>
  );
};

export default EvaluationsTable;
