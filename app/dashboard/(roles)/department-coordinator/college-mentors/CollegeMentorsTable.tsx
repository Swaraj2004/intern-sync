'use client';

import getCollegeMentorColumns from '@/app/dashboard/(roles)/department-coordinator/college-mentors/collegeMentorColumns';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import TablePagination from '@/components/ui/TablePagination';
import TableSearch from '@/components/ui/TableSearch';
import { useUser } from '@/context/UserContext';
import {
  useDeleteCollegeMentor,
  useSendCollegeMentorInvite,
} from '@/services/mutations/college-mentors';
import { useCollegeMentors } from '@/services/queries';
import CollegeMentors from '@/types/college-mentors';
import {
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

const CollegeMentorsTable = () => {
  const { user, instituteId } = useUser();
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: collegeMentors, isLoading } = useCollegeMentors({
    instituteId,
    departmentId: user?.uid,
  });
  const { deleteCollegeMentor } = useDeleteCollegeMentor({
    instituteId: instituteId!,
    requestingUserId: user?.uid!,
    departmentId: user?.uid,
  });
  const { sendInvite } = useSendCollegeMentorInvite({
    instituteId: instituteId!,
    departmentId: user?.uid,
  });

  const collegeMentorColumns = useMemo(
    () =>
      getCollegeMentorColumns({
        onDelete: deleteCollegeMentor,
        onSendInvite: sendInvite,
      }),
    [deleteCollegeMentor, sendInvite]
  );

  const tableData = useMemo(
    () => (isLoading ? Array(10).fill({}) : collegeMentors),
    [isLoading, collegeMentors]
  );

  const tableColumns = useMemo(
    () =>
      isLoading
        ? collegeMentorColumns.map((column, index) => ({
            ...column,
            cell: () => (
              <Skeleton key={`loading-cell-${index}`} className="h-8 rounded" />
            ),
          }))
        : collegeMentorColumns,
    [isLoading, collegeMentorColumns]
  );

  const table = useReactTable({
    data: tableData as CollegeMentors[],
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
            placeholder="Search College Mentor"
            column="users.name"
          />
        )
      )}
      {mounted && (
        <TableContent<CollegeMentors>
          table={table}
          isLoading={isLoading}
          mounted={mounted}
          tableData={collegeMentors}
          tableColumns={tableColumns}
        />
      )}
      {collegeMentors && <TablePagination table={table} />}
    </Card>
  );
};

export default CollegeMentorsTable;
