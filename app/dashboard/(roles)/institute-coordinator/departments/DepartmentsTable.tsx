'use client';

import getDepartmentColumns from '@/app/dashboard/(roles)/institute-coordinator/departments/departmentColumns';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import TablePagination from '@/components/ui/TablePagination';
import TableSearch from '@/components/ui/TableSearch';
import { useUser } from '@/context/UserContext';
import {
  useDeleteDepartment,
  useSendDepartmentInvite,
} from '@/services/mutations/departments';
import { useDepartments } from '@/services/queries';
import Departments from '@/types/departments';
import {
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

const DepartmentsTable = () => {
  const { user, instituteId } = useUser();
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: departments, isLoading } = useDepartments({ instituteId });
  const { deleteDepartment } = useDeleteDepartment({
    instituteId: instituteId!,
    requestingUserId: user?.uid!,
  });
  const { sendInvite } = useSendDepartmentInvite({ instituteId: instituteId! });

  const departmentColumns = useMemo(
    () =>
      getDepartmentColumns({
        onDelete: deleteDepartment,
        onSendInvite: sendInvite,
      }),
    [deleteDepartment, sendInvite]
  );

  const tableData = useMemo(
    () => (isLoading ? Array(10).fill({}) : departments),
    [isLoading, departments]
  );

  const tableColumns = useMemo(
    () =>
      isLoading
        ? departmentColumns.map((column, index) => ({
            ...column,
            cell: () => (
              <Skeleton key={`loading-cell-${index}`} className="h-8 rounded" />
            ),
          }))
        : departmentColumns,
    [isLoading, departmentColumns]
  );

  const table = useReactTable({
    data: tableData as Departments[],
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
            placeholder="Search Department"
            column="name"
          />
        )
      )}
      {mounted && (
        <TableContent<Departments>
          table={table}
          isLoading={isLoading}
          mounted={mounted}
          tableData={departments}
          tableColumns={tableColumns}
        />
      )}
      {departments && <TablePagination table={table} />}
    </Card>
  );
};

export default DepartmentsTable;
