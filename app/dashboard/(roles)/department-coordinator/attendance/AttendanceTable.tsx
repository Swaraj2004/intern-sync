'use client';

import getStudentAttendanceColumns from '@/app/dashboard/(roles)/department-coordinator/attendance/studentAttendanceColumns';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import TablePagination from '@/components/ui/TablePagination';
import TableSearch from '@/components/ui/TableSearch';
import { useUser } from '@/context/UserContext';
import { formatDateForInput } from '@/lib/utils';
import { useUpdateAttendance } from '@/services/mutations/attendance';
import { useAttendanceWithStudents } from '@/services/queries';
import StudentAttendance from '@/types/students-attendance';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

const AttendanceTable = ({ date }: { date: Date }) => {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const instituteId: number = user?.user_metadata.institute_id;
  const userId: string = user?.user_metadata.uid;

  const dateString: string = formatDateForInput(date);

  const { data: studentsAttendance, isLoading } = useAttendanceWithStudents({
    instituteId,
    departmentId: userId,
    attendanceDate: dateString,
  });

  const { updateAttendance } = useUpdateAttendance({
    instituteId,
    departmentId: userId,
    attendanceDate: dateString,
  });

  const studentAttendanceColumns = useMemo(
    () =>
      getStudentAttendanceColumns({
        onUpdate: updateAttendance,
      }),
    [updateAttendance]
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
    data: tableData as StudentAttendance[],
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
    <>
      {isLoading ? (
        <Skeleton className="h-10 max-w-xs rounded-md" />
      ) : (
        mounted && (
          <TableSearch
            table={table}
            placeholder="Search Student"
            column="users.name"
          />
        )
      )}
      {mounted && (
        <TableContent<StudentAttendance>
          table={table}
          isLoading={isLoading}
          mounted={mounted}
          tableData={studentsAttendance}
          tableColumns={tableColumns}
        />
      )}
      {studentsAttendance && <TablePagination table={table} />}
    </>
  );
};

export default AttendanceTable;
