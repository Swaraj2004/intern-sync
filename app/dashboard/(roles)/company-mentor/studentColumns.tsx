import { Button } from '@/components/ui/button';
import CompanyMentorStudent from '@/types/company-mentor-student';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDownIcon } from 'lucide-react';

const getStudentColumns = (): ColumnDef<CompanyMentorStudent>[] => [
  {
    id: 'students.users.name',
    accessorFn: (row) => row.students?.users?.name,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 hover:bg-transparent"
      >
        Name
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.students?.users?.name || '-'}</div>,
  },
  {
    id: 'students.users.contact',
    header: () => <span className="text-nowrap">Contact</span>,
    cell: ({ row }) => (
      <div>{row.original.students?.users?.contact || '-'}</div>
    ),
  },
  {
    id: 'students.users.email',
    header: () => <span className="text-nowrap">Email</span>,
    cell: ({ row }) => <div>{row.original.students?.users?.email || '-'}</div>,
  },
  {
    id: 'students.college_mentors.users.name',
    header: () => {
      return <span className="text-nowrap">College Mentor</span>;
    },
    cell: ({ row }) => (
      <div>{row.original.students?.college_mentors?.users?.name || '-'}</div>
    ),
  },
  {
    id: 'students.departments.name',
    header: () => {
      return <span className="text-nowrap">Department</span>;
    },
    cell: ({ row }) => (
      <div>{row.original.students?.departments?.name || '-'}</div>
    ),
  },
  {
    id: 'students.institutes.name',
    header: () => {
      return <span className="text-nowrap">Institute</span>;
    },
    cell: ({ row }) => (
      <div>{row.original.students?.institutes?.name || '-'}</div>
    ),
  },
];

export default getStudentColumns;
