import StudentAttendanceActions from '@/components/attendance/StudentAttendanceActions';
import StudentAttendanceApprovalActions from '@/components/attendance/StudentAttendanceApprovalActions';
import AttendanceStatus from '@/components/ui/AttendanceStatus';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { convertUTCToISTWithAMPM } from '@/lib/utils';
import StudentAttendance from '@/types/students-attendance';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDownIcon } from 'lucide-react';

type ColumnProps = {
  onUpsert: (
    actionType: 'insert' | 'update',
    studentId: string,
    internshipId: string,
    status: string,
    attendanceId?: string
  ) => void;
  collegeMentorId: string;
  attendanceDate: Date;
};

const getStudentAttendanceColumns = ({
  onUpsert,
  collegeMentorId,
  attendanceDate,
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
    id: 'attendance.in_time',
    header: 'In Time',
    cell: ({ row }) => (
      <div>
        {row.original.attendance[0]?.in_time
          ? convertUTCToISTWithAMPM(row.original.attendance[0]?.in_time)
          : '-'}
      </div>
    ),
  },
  {
    id: 'attendance.out_time',
    header: 'Out Time',
    cell: ({ row }) => (
      <div>
        {row.original.attendance[0]?.out_time
          ? convertUTCToISTWithAMPM(row.original.attendance[0]?.out_time)
          : '-'}
      </div>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const currentInternship = row.original.internships?.find(
        (internship) =>
          new Date(internship.start_date) <= new Date(attendanceDate) &&
          new Date(internship.end_date) >= new Date(attendanceDate)
      );

      return (
        <AttendanceStatus
          status={
            row.original.attendance[0]
              ? row.original.attendance[0].status
              : null
          }
          attendanceDate={attendanceDate}
          noInternship={currentInternship === undefined}
        />
      );
    },
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
      const currentInternship = row.original.internships?.find(
        (internship) =>
          new Date(internship.start_date) <= new Date(attendanceDate) &&
          new Date(internship.end_date) >= new Date(attendanceDate)
      );
      const attendanceId = row.original.attendance[0]?.id || undefined;
      const studentId = row.original.uid;

      if (!currentInternship) {
        return null;
      }

      return (
        <StudentAttendanceActions
          studentId={studentId}
          attendanceStatus={attendanceStatus}
          internshipId={currentInternship?.id || ''}
          attendanceId={attendanceId}
          collegeMentorId={collegeMentorId}
        />
      );
    },
  },
];

export default getStudentAttendanceColumns;
