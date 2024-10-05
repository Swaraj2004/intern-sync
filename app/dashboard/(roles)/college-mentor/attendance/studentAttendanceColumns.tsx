import StudentAttendanceActions from '@/components/attendance/StudentAttendanceActions';
import StudentAttendanceApprovalActions from '@/components/attendance/StudentAttendanceApprovalActions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { convertUTCToISTWithAMPM } from '@/lib/utils';
import StudentAttendance from '@/types/student-attendance';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDownIcon } from 'lucide-react';

type ColumnProps = {
  onUpsert: (
    actionType: 'insert' | 'update',
    studentId: string,
    internshipId: string,
    status: string,
    attendanceId: string | null
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
    accessorKey: 'user_name',
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
    cell: ({ row }) => <div>{row.original.user_name || '-'}</div>,
  },
  {
    id: 'in_time',
    header: () => <span className="text-nowrap">In Time</span>,
    cell: ({ row }) => (
      <div className="text-nowrap">
        {row.original.in_time
          ? convertUTCToISTWithAMPM(row.original.in_time)
          : '-'}
      </div>
    ),
  },
  {
    id: 'out_time',
    header: () => <span className="text-nowrap">Out Time</span>,
    cell: ({ row }) => (
      <div className="text-nowrap">
        {row.original.out_time
          ? convertUTCToISTWithAMPM(row.original.out_time)
          : '-'}
      </div>
    ),
  },
  {
    id: 'attendance_status',
    header: () => <span className="text-nowrap">Attendance Status</span>,
    cell: ({ row }) => {
      const status = row.original.attendance_status;
      const noInternship = row.original.current_internship_id === null;
      const isHolidayForStudent = row.original.is_holiday;
      return (
        <>
          {noInternship && (
            <Badge className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-300 dark:hover:bg-gray-400 text-nowrap [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
              No Internship
            </Badge>
          )}
          {status === 'present' && (
            <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-300 dark:hover:bg-green-400 [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
              Present
            </Badge>
          )}
          {status === 'pending' && (
            <Badge className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-200 dark:hover:bg-yellow-300 text-nowrap [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
              Pending Approval
            </Badge>
          )}
          {status === 'absent' && (
            <Badge className="bg-red-500 hover:bg-red-600 dark:bg-red-300 dark:hover:bg-red-400 [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
              Absent
            </Badge>
          )}
          {status === 'holiday' && (
            <Badge className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-300 dark:hover:bg-orange-400 [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
              Holiday
            </Badge>
          )}
          {!status && !noInternship && isHolidayForStudent && (
            <Badge className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-300 dark:hover:bg-orange-400 [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
              Holiday
            </Badge>
          )}
          {!status && !noInternship && !isHolidayForStudent && (
            <Badge className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-200 dark:hover:bg-yellow-300 text-nowrap [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
              Not Submitted
            </Badge>
          )}
        </>
      );
    },
  },
  {
    id: 'approval',
    header: 'Approval',
    cell: ({ row }) => {
      const attendanceId = row.original.attendance_id;
      const attendanceStatus = row.original.attendance_status;
      const currentInternshipId = row.original.current_internship_id;
      const studentId = row.original.student_uid;

      return attendanceId && attendanceStatus === 'pending' ? (
        <StudentAttendanceApprovalActions
          onApprove={async () => {
            onUpsert(
              'update',
              studentId,
              currentInternshipId || '',
              'present',
              attendanceId
            );
          }}
          onReject={async () => {
            onUpsert(
              'update',
              studentId,
              currentInternshipId || '',
              'absent',
              attendanceId
            );
          }}
        />
      ) : !attendanceId ? (
        <Badge className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-300 dark:hover:bg-gray-400 text-nowrap">
          Not Applicable
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
      const attendanceStatus = row.original.attendance_status;
      const currentInternshipId = row.original.current_internship_id;
      const attendanceId = row.original.attendance_id;
      const studentId = row.original.student_uid;

      if (!currentInternshipId) {
        return null;
      }

      return (
        <StudentAttendanceActions
          studentId={studentId}
          internshipId={currentInternshipId}
          attendanceId={attendanceId}
          attendanceStatus={attendanceStatus}
          collegeMentorId={collegeMentorId}
        />
      );
    },
  },
];

export default getStudentAttendanceColumns;
