'use client';

import getStudentReportsColumns from '@/app/dashboard/(roles)/company-mentor/reports/studentReportsColumns';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import TablePagination from '@/components/ui/TablePagination';
import TableSearch from '@/components/ui/TableSearch';
import { useReportsDate } from '@/context/ReportsDateContext';
import { useUser } from '@/context/UserContext';
import { formatDateForInput } from '@/lib/utils';
import { useApproveReportByCompanyMentor } from '@/services/mutations/reports';
import { useReportsWithStudentsForCompanyMentor } from '@/services/queries';
import StudentReportForCompanyMentor from '@/types/student-report-company-mentor';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

const ReportsTable = () => {
  const { user } = useUser();
  const { reportsDate } = useReportsDate();
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const dateString: string = formatDateForInput(reportsDate);

  const { data: studentsReports, isLoading } =
    useReportsWithStudentsForCompanyMentor({
      companyMentorId: user?.uid!,
      reportDate: dateString,
    });

  const { approveReport } = useApproveReportByCompanyMentor({
    reportDate: dateString,
    companyMentorId: user?.uid!,
  });

  const studentReportsColumns = useMemo(
    () =>
      getStudentReportsColumns({
        approveReport: approveReport,
      }),
    [approveReport]
  );

  const tableData = useMemo(
    () => (isLoading ? Array(10).fill({}) : studentsReports),
    [isLoading, studentsReports]
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
    data: tableData as StudentReportForCompanyMentor[],
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
            placeholder="Search Student"
            column="user_name"
          />
        )
      )}
      {mounted && (
        <TableContent<StudentReportForCompanyMentor>
          table={table}
          isLoading={isLoading}
          mounted={mounted}
          tableData={studentsReports}
          tableColumns={tableColumns}
        />
      )}
      {studentsReports && <TablePagination table={table} />}
    </Card>
  );
};

export default ReportsTable;
