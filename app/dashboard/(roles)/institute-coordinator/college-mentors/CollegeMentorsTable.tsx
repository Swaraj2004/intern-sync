'use client';

import getCollegeMentorColumns from '@/app/dashboard/(roles)/institute-coordinator/college-mentors/collegeMentorColumns';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import TablePagination from '@/components/ui/TablePagination';
import TableSearch from '@/components/ui/TableSearch';
import { useRoles } from '@/context/RolesContext';
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
  const { user } = useUser();
  const { roles } = useRoles();
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const instituteId: number = user?.user_metadata.institute_id;
  const userId: string = user?.user_metadata.uid;
  const roleId = roles?.['institute-coordinator'] || '';

  const { data: collegeMentors, isLoading } = useCollegeMentors({
    instituteId,
  });
  const { deleteCollegeMentor } = useDeleteCollegeMentor({
    instituteId,
    requestingUserId: userId,
  });
  const { sendInvite } = useSendCollegeMentorInvite({ instituteId });

  const collegeMentorColumns = useMemo(
    () =>
      getCollegeMentorColumns({
        onDelete: deleteCollegeMentor,
        onSendInvite: sendInvite,
        roleId,
        instituteId,
      }),
    [deleteCollegeMentor, sendInvite, roleId, instituteId]
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
    <div className="p-4 bg-card rounded-lg">
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
    </div>
  );
};

export default CollegeMentorsTable;
