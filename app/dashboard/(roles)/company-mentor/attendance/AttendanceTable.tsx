'use client';

import getStudentAttendanceColumns from '@/app/dashboard/(roles)/company-mentor/attendance/studentAttendanceColumns';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import TablePagination from '@/components/ui/TablePagination';
import TableSearch from '@/components/ui/TableSearch';
import { useAttendanceDate } from '@/context/AttendanceDateContext';
import { useUser } from '@/context/UserContext';
import { formatDateForInput } from '@/lib/utils';
import { useApproveAttendance } from '@/services/mutations/attendance';
import { useAttendanceWithStudentsForCompanyMentor } from '@/services/queries';
import StudentAttendanceForCompanyMentor from '@/types/student-attendance-company-mentor';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

const AttendanceTable = () => {
  const { user } = useUser();
  const { attendanceDate } = useAttendanceDate();
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const dateString: string = formatDateForInput(attendanceDate);

  const { data: studentsAttendance, isLoading } =
    useAttendanceWithStudentsForCompanyMentor({
      companyMentorId: user?.uid!,
      attendanceDate: dateString,
    });

  const { approveAttendance } = useApproveAttendance({
    companyMentorId: user?.uid!,
    attendanceDate: dateString,
  });

  const studentAttendanceColumns = useMemo(
    () =>
      getStudentAttendanceColumns({
        onApprove: approveAttendance,
      }),
    [approveAttendance]
  );

  const tableData = useMemo(
    () => (isLoading ? Array(10).fill({}) : studentsAttendance),
    [isLoading, studentsAttendance]
  );

  const tableColumns = useMemo(
    () =>
      isLoading
        ? studentAttendanceColumns.map((column, index) => ({
            ...column,
            cell: () => (
              <Skeleton key={`loading-cell-${index}`} className="h-8 rounded" />
            ),
          }))
        : studentAttendanceColumns,
    [isLoading, studentAttendanceColumns]
  );

  const table = useReactTable({
    data: tableData as StudentAttendanceForCompanyMentor[],
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
        <TableContent<StudentAttendanceForCompanyMentor>
          table={table}
          isLoading={isLoading}
          mounted={mounted}
          tableData={studentsAttendance}
          tableColumns={tableColumns}
        />
      )}
      {studentsAttendance && <TablePagination table={table} />}
    </Card>
  );
};

export default AttendanceTable;
