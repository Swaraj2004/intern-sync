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
    id: 'name',
    accessorFn: (row) => row.name,
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
    cell: ({ row }) => <div>{row.original.name || '-'}</div>,
  },
  {
    id: 'email',
    accessorFn: (row) => row.email,
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
      <div className="lowercase">{row.original.email || '-'}</div>
    ),
  },
  {
    id: 'college_mentor_name',
    accessorFn: (row) => row.college_mentor_name,
    header: () => {
      return <span className="text-nowrap">College Mentor</span>;
    },
    cell: ({ row }) => <div>{row.original.college_mentor_name || '-'}</div>,
  },
  {
    id: 'company_mentor_name',
    accessorFn: (row) => row.company_mentor_name,
    header: () => {
      return <span className="text-nowrap">Company Mentor</span>;
    },
    cell: ({ row }) => <div>{row.original.company_mentor_name || '-'}</div>,
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <UserStatus
        isRegistered={row.original.is_registered || false}
        isVerified={row.original.is_verified || false}
      />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const studentId = row.original.uid;
      const currentMentorId = row.original.college_mentor_uid;
      const studentDepartmentId = row.original.department_uid;

      return (
        <StudentActions
          deleteStudent={async () =>
            onDelete(row.original.uid, row.original.auth_id || '')
          }
          sendInvite={async () =>
            onSendInvite(
              row.original.email || '',
              row.original.uid,
              row.original.name || ''
            )
          }
          changeCollegeMentor={onChangeCollegeMentor}
          studentId={studentId}
          studentDepartmentId={studentDepartmentId}
          currentMentorId={currentMentorId}
          isVerified={row.original.is_verified || false}
          dashboardRole={dashboardRole}
        />
      );
    },
  },
];

export default getStudentColumns;
