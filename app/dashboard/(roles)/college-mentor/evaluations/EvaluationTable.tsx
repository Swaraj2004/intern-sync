'use client';

import getMentorEvaluationColumns from '@/app/dashboard/(roles)/college-mentor/evaluations/mentorEvaluationColumns';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import TablePagination from '@/components/ui/TablePagination';
import TableSearch from '@/components/ui/TableSearch';
import { useUser } from '@/context/UserContext';
import { useUpdateMentorEvaluation } from '@/services/mutations/evaluations';
import { useMentorEvaluations } from '@/services/queries';
import MentorEvaluation from '@/types/mentor-evaluations';
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
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: mentorEvaluations, isLoading } = useMentorEvaluations({
    mentorId: user?.uid!,
  });

  const { updateMentorEvaluation } = useUpdateMentorEvaluation({
    mentorId: user?.uid!,
  });

  const evaluationColumns = useMemo(
    () =>
      getMentorEvaluationColumns({
        onUpdate: updateMentorEvaluation,
        dashboardRole: 'college-mentor',
      }),
    [updateMentorEvaluation]
  );

  const tableData = useMemo(
    () => (isLoading ? Array(10).fill({}) : mentorEvaluations),
    [isLoading, mentorEvaluations]
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
    data: tableData as MentorEvaluation[],
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
          <TableSearch
            table={table}
            placeholder="Search Name"
            column="evaluation_name"
          />
        )
      )}
      {mounted && (
        <TableContent<MentorEvaluation>
          table={table}
          isLoading={isLoading}
          mounted={mounted}
          tableData={mentorEvaluations}
          tableColumns={tableColumns}
        />
      )}
      {mentorEvaluations && <TablePagination table={table} />}
    </Card>
  );
};

export default EvaluationsTable;
