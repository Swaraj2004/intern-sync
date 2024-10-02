'use client';

import getInternshipColumns from '@/components/internships/internshipColumns';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import TablePagination from '@/components/ui/TablePagination';
import TableSearch from '@/components/ui/TableSearch';
import { useUser } from '@/context/UserContext';
import { useAcceptOrRejectInternship } from '@/services/mutations/internships';
import { useInternships } from '@/services/queries';
import Internship from '@/types/internships';
import {
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

const InternshipsTable = () => {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const instituteId: number = user?.user_metadata.institute_id;
  const userId: string = user?.user_metadata.uid;

  const { data: internships, isLoading } = useInternships({
    collegeMentorId: userId,
  });

  const { acceptOrRejectInternship } = useAcceptOrRejectInternship({
    collegeMentorId: userId,
  });

  const internshipColumns = useMemo(
    () =>
      getInternshipColumns({
        onApproveInternship: acceptOrRejectInternship,
      }),
    [acceptOrRejectInternship]
  );

  const tableData = useMemo(
    () => (isLoading ? Array(10).fill({}) : internships),
    [isLoading, internships]
  );

  const tableColumns = useMemo(
    () =>
      isLoading
        ? internshipColumns.map((column, index) => ({
            ...column,
            cell: () => (
              <Skeleton key={`loading-cell-${index}`} className="h-8 rounded" />
            ),
          }))
        : internshipColumns,
    [isLoading, internshipColumns]
  );

  const table = useReactTable({
    data: tableData as Internship[],
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
            placeholder="Search Student"
            column="users.name"
          />
        )
      )}
      {mounted && (
        <TableContent<Internship>
          table={table}
          isLoading={isLoading}
          mounted={mounted}
          tableData={internships}
          tableColumns={tableColumns}
        />
      )}
      {internships && <TablePagination table={table} />}
    </div>
  );
};

export default InternshipsTable;
