'use client';

import { getDepartmentColumns } from '@/app/dashboard/(roles)/institute-coordinator/departments/departmentColumns';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import TablePagination from '@/components/ui/TablePagination';
import TableSearch from '@/components/ui/TableSearch';
import { useRoles } from '@/context/RolesContext';
import { useUser } from '@/context/UserContext';
import { useDeleteDepartment, useSendInvite } from '@/services/mutations';
import { useDepartments } from '@/services/queries';
import {
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import Departments from '@/types/departments';
import { Loader } from '@/components/ui/Loader';

const DepartmentsTable = () => {
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
  const roleId = roles?.['department-coordinator'] || '';

  const { data: departments, isLoading } = useDepartments({ instituteId });
  const { deleteDepartment } = useDeleteDepartment({
    instituteId,
    requestingUserId: userId,
  });
  const { sendInvite } = useSendInvite({ instituteId });

  const departmentColumns = useMemo(
    () =>
      getDepartmentColumns({
        onDelete: deleteDepartment,
        onSendInvite: sendInvite,
        roleId,
        instituteId,
      }),
    [deleteDepartment, sendInvite, roleId, instituteId]
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
    <div className="p-4 bg-card rounded-lg">
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
    </div>
  );
};

export default DepartmentsTable;
