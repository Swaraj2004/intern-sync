import { CollegeMentorActions } from '@/app/dashboard/(roles)/institute-coordinator/college-mentors/CollegeMentorActions';
import { Button } from '@/components/ui/button';
import UserStatus from '@/components/ui/UserStatus';
import CollegeMentors from '@/types/college-mentors';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDownIcon } from 'lucide-react';

type ColumnProps = {
  onDelete: (roleId: string, uid: string, authId: string) => void;
  onSendInvite: (
    email: string,
    userId: string,
    name: string,
    roleId: string
  ) => void;
  roleId: string;
  instituteId: number;
};

const getCollegeMentorColumns = ({
  onDelete,
  onSendInvite,
  roleId,
}: ColumnProps): ColumnDef<CollegeMentors>[] => [
  {
    id: 'users.name',
    accessorFn: (row) => row.users?.name,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 hover:bg-transparent"
      >
        Mentor Name
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.users?.name || '-'}</div>,
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
    cell: ({ row }) => (
      <CollegeMentorActions
        onDelete={async () =>
          onDelete(roleId, row.original.uid, row.original.users?.auth_id || '')
        }
        onSendInvite={async () =>
          onSendInvite(
            row.original.users?.email || '',
            row.original.uid,
            row.original.users?.name || '',
            roleId
          )
        }
        isVerified={row.original.users?.is_verified || false}
      />
    ),
  },
];

export default getCollegeMentorColumns;
