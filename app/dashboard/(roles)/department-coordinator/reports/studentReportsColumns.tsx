import StudentReportApprovalActions from '@/components/reports/StudentReportApprovalActions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { convertUTCToISTWithAMPM } from '@/lib/utils';
import StudentReport from '@/types/student-report';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDownIcon } from 'lucide-react';

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
}: ColumnProps): ColumnDef<StudentReport>[] => [
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
    id: 'status',
    header: () => <span className="text-nowrap">Report Status</span>,
    cell: ({ row }) => {
      const report_status = row.original.report_status;
      const noInternship = row.original.current_internship_id === null;
      const isHolidayForStudent = row.original.is_holiday;
      return (
        <>
          {noInternship && (
            <Badge className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-300 dark:hover:bg-gray-400 text-nowrap [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
              No Internship
            </Badge>
          )}
          {report_status === 'approved' && (
            <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-300 dark:hover:bg-green-400 [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
              Approved
            </Badge>
          )}
          {report_status === 'revision' && (
            <Badge className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-300 dark:hover:bg-orange-400 [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
              Revision
            </Badge>
          )}
          {report_status === 'pending' && (
            <Badge className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-200 dark:hover:bg-yellow-300 text-nowrap [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
              Pending Approval
            </Badge>
          )}
          {!report_status && !noInternship && isHolidayForStudent && (
            <Badge className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-300 dark:hover:bg-orange-400 [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
              Holiday
            </Badge>
          )}
          {!report_status && !noInternship && !isHolidayForStudent && (
            <Badge className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-200 dark:hover:bg-yellow-300 text-nowrap [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
              Not Submitted
            </Badge>
          )}
        </>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const attendanceId = row.original.attendance_id;
      const studentId = row.original.student_uid;
      return (
        attendanceId && (
          <StudentReportApprovalActions
            approveReport={approveReport}
            studentReportData={row.original}
            studentId={studentId}
            attendanceId={attendanceId}
          />
        )
      );
    },
  },
];

export default getStudentAttendanceColumns;
