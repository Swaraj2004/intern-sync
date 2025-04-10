'use client';

import getEvaluationStudentsColumns from '@/app/dashboard/(roles)/college-mentor/evaluations/[id]/EvaluationStudentsColumns';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import TablePagination from '@/components/ui/TablePagination';
import TableSearch from '@/components/ui/TableSearch';
import { useUser } from '@/context/UserContext';
import {
  useStudentsForEvaluator,
  useStudentsForMentorEvaluation,
} from '@/services/queries';
import MentorEvaluationStudent from '@/types/mentor-evaluation-students';
import {
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

const EvaluationStudentsTable = ({
  mentorEvalId,
  asEvaluator,
}: {
  mentorEvalId: string;
  asEvaluator: boolean;
}) => {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: students, isLoading: isLoadingStudents } =
    useStudentsForMentorEvaluation({
      mentorEvaluationId: mentorEvalId,
    });
  const { data: evaluatorStudents, isLoading: isLoadingEvaluatorStudents } =
    useStudentsForEvaluator({
      evaluatorId: user?.uid!,
    });

  const parameterColumns = useMemo(
    () =>
      getEvaluationStudentsColumns({
        asEvaluator: asEvaluator,
      }),
    [asEvaluator]
  );

  const tableData = useMemo(
    () =>
      isLoadingStudents && isLoadingEvaluatorStudents
        ? Array(10).fill({})
        : asEvaluator
        ? evaluatorStudents
        : students,
    [
      isLoadingStudents,
      isLoadingEvaluatorStudents,
      students,
      evaluatorStudents,
      asEvaluator,
    ]
  );

  const tableColumns = useMemo(
    () =>
      isLoadingStudents && isLoadingEvaluatorStudents
        ? parameterColumns.map((column, index) => ({
            ...column,
            cell: () => (
              <Skeleton key={`loading-cell-${index}`} className="h-8 rounded" />
            ),
          }))
        : parameterColumns,
    [isLoadingStudents, isLoadingEvaluatorStudents, parameterColumns]
  );

  const table = useReactTable({
    data: tableData as MentorEvaluationStudent[],
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
      {isLoadingStudents && isLoadingEvaluatorStudents ? (
        <Skeleton className="h-10 max-w-xs rounded-md" />
      ) : (
        mounted && (
          <TableSearch table={table} placeholder="Search Name" column="name" />
        )
      )}
      {mounted && (
        <TableContent<MentorEvaluationStudent>
          table={table}
          isLoading={isLoadingStudents && isLoadingEvaluatorStudents}
          mounted={mounted}
          tableData={asEvaluator ? evaluatorStudents : students}
          tableColumns={tableColumns}
        />
      )}
      {(asEvaluator ? evaluatorStudents : students) && (
        <TablePagination table={table} />
      )}
    </Card>
  );
};

export default EvaluationStudentsTable;
