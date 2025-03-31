import { StudentActions } from '@/components/students/StudentActions';
import { Button } from '@/components/ui/button';
import UserStatus from '@/components/ui/UserStatus';
import Student from '@/types/students';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDownIcon } from 'lucide-react';

type ColumnProps = {
  onDelete: (uid: string, authId: string) => void;
  onSendInvite: (email: string, userId: string, name: string) => void;
  onChangeCollegeMentor: (
    studentId: string,
    mentorId: string,
    mentorName: string
  ) => void;
  dashboardRole: string;
};

const getStudentColumns = ({
  onDelete,
  onSendInvite,
  onChangeCollegeMentor,
  dashboardRole,
}: ColumnProps): ColumnDef<Student>[] => [
  {
    id: 'users.name',
    accessorFn: (row) => row.users?.name,
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
    cell: ({ row }) => <div>{row.original.users?.name || '-'}</div>,
  },
  {
    id: 'departments.name',
    accessorFn: (row) => row.departments?.name,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 hover:bg-transparent"
      >
        Department
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.departments?.name || '-'}</div>,
  },
  {
    id: 'users.email',
    accessorFn: (row) => row.users?.email,
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
      <div className="lowercase">{row.original.users?.email || '-'}</div>
    ),
  },
  {
    id: 'college_mentors.users.name',
    accessorFn: (row) => row.college_mentors?.users?.name,
    header: () => {
      return <span className="text-nowrap">College Mentor</span>;
    },
    cell: ({ row }) => (
      <div>{row.original.college_mentors?.users?.name || '-'}</div>
    ),
  },
  {
    id: 'internships[0].company_mentors.users.name',
    accessorFn: (row) => row.internships?.[0]?.company_mentors?.users?.name,
    header: () => {
      return <span className="text-nowrap">Company Mentor</span>;
    },
    cell: ({ row }) => (
      <div>
        {row.original.internships?.[0]?.company_mentors?.users?.name || '-'}
      </div>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <UserStatus
        isRegistered={row.original.users?.is_registered || false}
        isVerified={row.original.users?.is_verified || false}
      />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const studentId = row.original.uid;
      const currentMentorId = row.original.college_mentors?.users?.id;
      const studentDepartmentId = row.original.departments?.uid;

      return (
        <StudentActions
          deleteStudent={async () =>
            onDelete(row.original.uid, row.original.users?.auth_id || '')
          }
          sendInvite={async () =>
            onSendInvite(
              row.original.users?.email || '',
              row.original.uid,
              row.original.users?.name || ''
            )
          }
          changeCollegeMentor={onChangeCollegeMentor}
          studentId={studentId}
          studentDepartmentId={studentDepartmentId}
          currentMentorId={currentMentorId}
          isVerified={row.original.users?.is_verified || false}
          dashboardRole={dashboardRole}
        />
      );
    },
  },
];

export default getStudentColumns;
