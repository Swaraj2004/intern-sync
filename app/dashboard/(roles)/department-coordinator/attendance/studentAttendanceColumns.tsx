import { StatusCell } from '@/components/attendance/StatusCell';
import StudentAttendanceActions from '@/components/attendance/StudentAttendanceActions';
import StudentAttendanceApprovalActions from '@/components/attendance/StudentAttendanceApprovalActions';
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
  departmentId: string;
  attendanceDate: Date;
};

const getStudentAttendanceColumns = ({
  onUpsert,
  departmentId,
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
    cell: ({ row }) => <StatusCell row={row} attendanceDate={attendanceDate} />,
  },
  {
    id: 'approval',
    header: 'Approval',
    cell: ({ row }) => {
      const attendance = row.original.attendance[0];
      const currentInternship = row.original.internships?.find(
        (internship) =>
          new Date(internship.start_date) <= new Date(attendanceDate) &&
          new Date(internship.end_date) >= new Date(attendanceDate)
      );

      return attendance && attendance.status === 'pending' ? (
        <StudentAttendanceApprovalActions
          onApprove={async () => {
            onUpsert(
              'update',
              row.original.uid,
              currentInternship?.id || '',
              'present',
              row.original.attendance[0].id
            );
          }}
          onReject={async () => {
            onUpsert(
              'update',
              row.original.uid,
              currentInternship?.id || '',
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
          departmentId={departmentId}
        />
      );
    },
  },
];

export default getStudentAttendanceColumns;
