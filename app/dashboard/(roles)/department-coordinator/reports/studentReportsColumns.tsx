import StudentReportApprovalAction from '@/components/reports/StudentReportApprovalAction';
import AttendanceStatus from '@/components/ui/AttendanceStatus';
import { Button } from '@/components/ui/button';
import ReportStatus from '@/components/ui/ReportStatus';
import { convertUTCToISTWithAMPM } from '@/lib/utils';
import StudentsReport from '@/types/students-report';
import { ColumnDef } from '@tanstack/react-table';
import { CalendarRangeIcon, ChevronsUpDownIcon } from 'lucide-react';
import Link from 'next/link';

type ColumnProps = {
  approveReport: (
    actionType: 'approved' | 'revision',
    attendanceId: string,
    studentId: string,
    status: string
  ) => void;
};

const getStudentAttendanceColumns = ({
  approveReport,
}: ColumnProps): ColumnDef<StudentsReport>[] => [
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
    id: 'status',
    header: () => <span className="text-nowrap">Report Status</span>,
    cell: ({ row }) => {
      const status = row.original.report_status;
      const noInternship = row.original.current_internship_id === null;
      const isHolidayForStudent = row.original.is_holiday;
      return (
        <ReportStatus
          status={status}
          noInternship={noInternship}
          isHolidayForStudent={isHolidayForStudent}
        />
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const noInternship = row.original.current_internship_id === null;
      const attendanceId = row.original.attendance_id;
      const studentId = row.original.student_uid;

      return (
        <div className="flex gap-3 justify-end">
          {attendanceId && (
            <StudentReportApprovalAction
              approveDailyReport={approveReport}
              studentReportData={row.original}
              studentId={studentId}
              attendanceId={attendanceId}
            />
          )}
          {!noInternship && (
            <Button size="icon-sm">
              <Link
                href={`/dashboard/department-coordinator/reports/${studentId}`}
              >
                <CalendarRangeIcon className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      );
    },
  },
];

export default getStudentAttendanceColumns;
