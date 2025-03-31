'use client';

import getStudentColumns from '@/app/dashboard/(roles)/department-coordinator/students/studentColumns';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import TablePagination from '@/components/ui/TablePagination';
import TableSearch from '@/components/ui/TableSearch';
import { useUser } from '@/context/UserContext';
import {
  useChangeCollegeMentor,
  useDeleteStudent,
  useSendStudentInvite,
} from '@/services/mutations/students';
import { useStudents } from '@/services/queries';
import Student from '@/types/students';
import {
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

const StudentsTable = () => {
  const { user, instituteId } = useUser();
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: students, isLoading } = useStudents({
    instituteId,
    departmentId: user?.uid,
  });

  const { deleteStudent } = useDeleteStudent({
    instituteId: instituteId!,
    departmentId: user?.uid,
    requestingUserId: user?.uid!,
  });
  const { sendInvite } = useSendStudentInvite({
    instituteId: instituteId!,
    departmentId: user?.uid,
  });
  const { changeCollegeMentor } = useChangeCollegeMentor({
    instituteId: instituteId!,
    departmentId: user?.uid,
  });

  const studentColumns = useMemo(
    () =>
      getStudentColumns({
        onDelete: deleteStudent,
        onSendInvite: sendInvite,
        onChangeCollegeMentor: changeCollegeMentor,
        dashboardRole: 'department-coordinator',
      }),
    [deleteStudent, sendInvite, changeCollegeMentor]
  );

  const tableData = useMemo(
    () => (isLoading ? Array(10).fill({}) : students),
    [isLoading, students]
  );

  const tableColumns = useMemo(
    () =>
      isLoading
        ? studentColumns.map((column, index) => ({
            ...column,
            cell: () => (
              <Skeleton key={`loading-cell-${index}`} className="h-8 rounded" />
            ),
          }))
        : studentColumns,
    [isLoading, studentColumns]
  );

  const table = useReactTable({
    data: tableData as Student[],
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
            column="users.name"
          />
        )
      )}
      {mounted && (
        <TableContent<Student>
          table={table}
          isLoading={isLoading}
          mounted={mounted}
          tableData={students}
          tableColumns={tableColumns}
        />
      )}
      {students && <TablePagination table={table} />}
    </Card>
  );
};

export default StudentsTable;
