import { StudentAttendanceActions } from '@/components/attendance/StudentAttendanceActions';
import AttendanceStatus from '@/components/ui/AttendanceStatus';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StudentAttendance from '@/types/students-attendance';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDownIcon } from 'lucide-react';

type ColumnProps = {
  onUpdate: (attendanceId: string, studentId: string, status: string) => void;
};

const getStudentAttendanceColumns = ({
  onUpdate,
}: ColumnProps): ColumnDef<StudentAttendance>[] => [
  {
    id: 'users.name',
    accessorFn: (row) => row.users?.name,
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
    cell: ({ row }) => <div>{row.original.users?.name || '-'}</div>,
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <AttendanceStatus
        status={
          row.original.attendance[0] ? row.original.attendance[0].status : null
        }
      />
    ),
  },
  {
    id: 'actions',
    header: 'Approval',
    cell: ({ row }) => {
      const attendance = row.original.attendance[0];
      return attendance && attendance.status === 'pending' ? (
        <StudentAttendanceActions
          onApprove={async () => {
            onUpdate(
              row.original.attendance[0].id,
              row.original.uid,
              'present'
            );
          }}
          onReject={async () => {
            onUpdate(row.original.attendance[0].id, row.original.uid, 'absent');
          }}
        />
      ) : !attendance ? (
        <Badge className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-300 dark:hover:bg-gray-400 text-nowrap">
          Not applicable
        </Badge>
      ) : (
        <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-300 dark:hover:bg-green-400">
          Approved
        </Badge>
      );
    },
  },
];

export default getStudentAttendanceColumns;
