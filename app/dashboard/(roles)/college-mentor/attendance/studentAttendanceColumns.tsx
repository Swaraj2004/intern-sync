import StudentAttendanceActions from '@/components/attendance/StudentAttendanceActions';
import StudentAttendanceApprovalActions from '@/components/attendance/StudentAttendanceApprovalActions';
import AttendanceStatus from '@/components/ui/AttendanceStatus';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StudentAttendance from '@/types/students-attendance';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDownIcon } from 'lucide-react';

type ColumnProps = {
  onUpsert: (
    actionType: 'insert' | 'update',
    studentId: string,
    status: string,
    attendanceId?: string
  ) => void;
  collegeMentorId: string;
};

const getStudentAttendanceColumns = ({
  onUpsert,
  collegeMentorId,
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
    id: 'approval',
    header: 'Approval',
    cell: ({ row }) => {
      const attendance = row.original.attendance[0];
      return attendance && attendance.status === 'pending' ? (
        <StudentAttendanceApprovalActions
          onApprove={async () => {
            onUpsert(
              'update',
              row.original.uid,
              'present',
              row.original.attendance[0].id
            );
          }}
          onReject={async () => {
            onUpsert(
              'update',
              row.original.uid,
              'absent',
              row.original.attendance[0].id
            );
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
  {
    id: 'actions',
    cell: ({ row }) => {
      const attendanceStatus = row.original.attendance[0]?.status || '';
      const attendanceId = row.original.attendance[0]?.id || undefined;
      const studentId = row.original.uid;

      return (
        <StudentAttendanceActions
          studentId={studentId}
          attendanceStatus={attendanceStatus}
          attendanceId={attendanceId}
          collegeMentorId={collegeMentorId}
        />
      );
    },
  },
];

export default getStudentAttendanceColumns;
