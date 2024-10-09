import StudentAttendanceApprovalActions from '@/components/attendance/StudentAttendanceApprovalActions';
import InternshipLetterCell from '@/components/internships/InternshipLetterCell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Internship from '@/types/internships';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDownIcon, ListIcon } from 'lucide-react';
import Link from 'next/link';

type ColumnProps = {
  onApproveInternship: (internshipId: string, approved: boolean) => void;
  dashboardRole: string;
};

const getInternshipColumns = ({
  onApproveInternship,
  dashboardRole,
}: ColumnProps): ColumnDef<Internship>[] => [
  {
    id: 'users.name',
    accessorFn: (row) => row.students?.users?.name,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 hover:bg-transparent"
      >
        Student Name
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.students?.users?.name || '-'}</div>,
  },
  {
    id: 'role',
    header: 'Role',
    cell: ({ row }) => <div>{row.original.role || '-'}</div>,
  },
  {
    id: 'mode',
    header: 'Mode',
    cell: ({ row }) => {
      const mode = row.original.mode;
      return mode === 'hybrid' ? 'Hybrid' : 'Offline';
    },
  },
  {
    id: 'start_date',
    header: 'Start Date',
    cell: ({ row }) => <div>{row.original.start_date || '-'}</div>,
  },
  {
    id: 'end_date',
    header: 'End Date',
    cell: ({ row }) => <div>{row.original.end_date || '-'}</div>,
  },
  {
    id: 'company_name',
    header: 'Company Name',
    cell: ({ row }) => <div>{row.original.company_name || '-'}</div>,
  },
  {
    id: 'internship_letter_url',
    header: 'Internship Letter',
    cell: ({ row }) => (
      <InternshipLetterCell
        internshipLetterUrl={row.original.internship_letter_url}
      />
    ),
  },
  {
    id: 'approval',
    header: 'Approval',
    cell: ({ row }) => {
      return row.original.approved === false ? (
        <StudentAttendanceApprovalActions
          onApprove={async () => {
            onApproveInternship(row.original.id, true);
          }}
          onReject={async () => {
            onApproveInternship(row.original.id, false);
          }}
        />
      ) : (
        <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-300 dark:hover:bg-green-400">
          Approved
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <Button size="icon-sm" asChild>
          <Link
            href={`/dashboard/${dashboardRole}/internships/${row.original.id}`}
          >
            <ListIcon className="h-5 w-5" />
          </Link>
        </Button>
      );
    },
  },
];

export default getInternshipColumns;
