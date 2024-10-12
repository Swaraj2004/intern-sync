'use client';

import getStudentReportsColumns from '@/app/dashboard/(roles)/student/reports/studentReportsColumns';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import TablePagination from '@/components/ui/TablePagination';
import { useReportsDateRange } from '@/context/ReportsDateRangeContext';
import { useUser } from '@/context/UserContext';
import { formatDateForInput } from '@/lib/utils';
import { useUpdateStudentReport } from '@/services/mutations/reports';
import { useStudentReports } from '@/services/queries';
import StudentReport from '@/types/student-report';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

const ReportsTable = () => {
  const { user } = useUser();
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
    studentId: user?.uid!,
    fromDate: fromDateString,
    toDate: toDateString,
  });

  const { updateReport } = useUpdateStudentReport({
    studentId: user?.uid!,
    fromDate: fromDateString,
    toDate: toDateString,
  });

  const studentReportsColumns = useMemo(
    () =>
      getStudentReportsColumns({
        updateReport: updateReport,
      }),
    [updateReport]
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
    <Card className="p-5">
      {mounted && (
        <TableContent<StudentReport>
          table={table}
          isLoading={isLoading}
          mounted={mounted}
          tableData={studentReports}
          tableColumns={tableColumns}
          className="mt-0"
        />
      )}
      {studentReports && <TablePagination table={table} />}
    </Card>
  );
};

export default ReportsTable;
