'use client';

import getStudentReportsColumns from '@/components/studentReports/studentReportsColumns';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import TablePagination from '@/components/ui/TablePagination';
import { useReportsDateRange } from '@/context/ReportsDateRangeContext';
import { formatDateForInput } from '@/lib/utils';
import { useApproveStudentReport } from '@/services/mutations/reports';
import { useStudentReports } from '@/services/queries';
import StudentReport from '@/types/student-report';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const ReportsTable = () => {
  const params = useParams<{ uid: string }>();
  const { reportsDateRange } = useReportsDateRange();
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const fromDateString: string = formatDateForInput(reportsDateRange.from);
  const toDateString: string = formatDateForInput(reportsDateRange.to);

  const { data: studentReports, isLoading } = useStudentReports({
    studentId: params.uid,
    fromDate: fromDateString,
    toDate: toDateString,
  });

  const { approveReport } = useApproveStudentReport({
    studentId: params.uid,
    fromDate: fromDateString,
    toDate: toDateString,
  });

  const studentReportsColumns = useMemo(
    () =>
      getStudentReportsColumns({
        approveReport: approveReport,
      }),
    [approveReport]
  );

  const tableData = useMemo(
    () => (isLoading ? Array(10).fill({}) : studentReports),
    [isLoading, studentReports]
  );

  const tableColumns = useMemo(
    () =>
      isLoading
        ? studentReportsColumns.map((column, index) => ({
            ...column,
            cell: () => (
              <Skeleton key={`loading-cell-${index}`} className="h-8 rounded" />
            ),
          }))
        : studentReportsColumns,
    [isLoading, studentReportsColumns]
  );

  const table = useReactTable({
    data: tableData as StudentReport[],
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
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
    <>
      {!studentReports ? (
        <Skeleton className="h-10 max-w-xs rounded-md" />
      ) : (
        mounted && (
          <div className="font-medium text-xl">
            {studentReports[0].user_name}
          </div>
        )
      )}
      {mounted && (
        <TableContent<StudentReport>
          table={table}
          isLoading={isLoading}
          mounted={mounted}
          tableData={studentReports}
          tableColumns={tableColumns}
        />
      )}
      {studentReports && <TablePagination table={table} />}
    </>
  );
};

export default ReportsTable;
