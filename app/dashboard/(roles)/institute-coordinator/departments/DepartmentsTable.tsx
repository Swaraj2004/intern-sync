'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRoles } from '@/context/RolesContext';
import { useUser } from '@/context/UserContext';
import { useDeleteDepartment, useSendInvite } from '@/services/mutations';
import { useDepartments } from '@/services/queries';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  MailPlusIcon,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export type Departments = {
  uid: string;
  name: string;
  users: {
    id: string;
    auth_id: string | null;
    name: string;
    email: string;
    is_registered: boolean;
    is_verified: boolean;
  };
};

const DepartmentsTable = () => {
  const { user } = useUser();
  const { roles } = useRoles();
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const instituteId: number = user?.user_metadata.institute_id;
  const roleId: string = roles?.['department-coordinator'] || '';

  const { data: departments, isLoading } = useDepartments({
    instituteId,
  });
  const { deleteDepartment } = useDeleteDepartment({
    instituteId,
  });
  const { sendInvite } = useSendInvite({
    instituteId,
  });

  const departmentColumns: ColumnDef<Departments>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="px-0 hover:bg-transparent"
            >
              Department Name
              <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
      },
      {
        accessorFn: (row) => row.users?.name,
        accessorKey: 'users.name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="px-0 hover:bg-transparent"
            >
              Department Coordinator
              <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.original.users?.name}</div>,
      },
      {
        accessorFn: (row) => row.users?.email,
        id: 'users.email',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-0 hover:bg-transparent"
          >
            Email
            <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue('users.email') || '-'}</div>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const isRegistered = row.original.users?.is_registered;
          const isVerified = row.original.users?.is_verified;

          return (
            <div className="flex items-center">
              {isRegistered && isVerified && (
                <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-300 dark:hover:bg-green-400">
                  Verified
                </Badge>
              )}
              {isRegistered && !isVerified && (
                <Badge className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-200 dark:hover:bg-yellow-300">
                  Unverified
                </Badge>
              )}
              {!isRegistered && (
                <Badge className="bg-red-500 hover:bg-red-600 dark:bg-red-300 dark:hover:bg-red-400">
                  Unregistered
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const userId = row.original.uid;
          const authId = row.original.users?.auth_id;
          const email = row.original.users?.email;
          const departmentCoordinatorName = row.original.users?.name;

          const handleDelete = async () => {
            await deleteDepartment(roleId, userId, authId);
          };

          const handleSendInvite = async () => {
            await sendInvite(
              email,
              userId,
              departmentCoordinatorName,
              instituteId,
              roleId
            );
          };

          return (
            <div className="flex justify-end gap-3">
              {!row.original.users?.is_verified && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon-sm"
                      className="bg-yellow-500 hover:bg-yellow-600"
                    >
                      <MailPlusIcon className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Send invite email?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will send an invite email to the department
                        coordinator.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSendInvite}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon-sm">
                    <Trash2 className="h-4 w-4 dark:text-black" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this department and delete all users associated with it.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        },
      },
    ],
    [roleId, deleteDepartment, instituteId, sendInvite]
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
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  return (
    <div className="w-full">
      {isLoading ? (
        <Skeleton className="h-10 max-w-xs rounded-md" />
      ) : (
        mounted && (
          <div className="flex sm:items-center sm:justify-between gap-3 flex-col sm:flex-row">
            <Input
              placeholder="Search Department"
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="max-w-xs"
            />
          </div>
        )
      )}
      {mounted && (
        <div className="rounded-md border-2 overflow-auto my-4">
          <Table className="text-sm">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {departments && table.getRowModel().rows?.length
                ? table.getRowModel().rows.map((row) => (
                    <TableRow key={row.original.uid}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : !isLoading &&
                  mounted && (
                    <TableRow>
                      <TableCell
                        colSpan={tableColumns.length}
                        className="h-24 text-center"
                      >
                        Add a new department to get started.
                      </TableCell>
                    </TableRow>
                  )}
              {isLoading &&
                table.getRowModel().rows?.length &&
                table.getRowModel().rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell key={cellIndex} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
      {departments && (
        <div className="flex items-center justify-between space-x-2">
          <div className="text-sm text-muted-foreground pl-1">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center gap-2 pr-4">
              <div className="text-sm text-muted-foreground">Rows per page</div>
              <Select
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
                value={table.getState().pagination.pageSize.toString()}
              >
                <SelectTrigger className="h-8 w-16">
                  <SelectValue placeholder="Rows" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 sm:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 sm:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsTable;
