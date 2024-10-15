import StudentAttendanceActions from '@/components/attendance/StudentAttendanceActions';
import StudentAttendanceApprovalActions from '@/components/attendance/StudentAttendanceApprovalActions';
import AttendanceStatus from '@/components/ui/AttendanceStatus';
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
  departmentId?: string;
};

const getStudentAttendanceColumns = ({
  onUpsert,
  departmentId,
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
    id: 'college_mentor_name',
    accessorFn: (row) => row.college_mentor_name,
    header: () => {
      return <span className="text-nowrap">College Mentor</span>;
    },
    cell: ({ row }) => <div>{row.original.college_mentor_name || '-'}</div>,
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
        <AttendanceStatus
          status={status}
          noInternship={noInternship}
          isHolidayForStudent={isHolidayForStudent}
        />
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
          departmentId={departmentId}
        />
      );
    },
  },
];

export default getStudentAttendanceColumns;
