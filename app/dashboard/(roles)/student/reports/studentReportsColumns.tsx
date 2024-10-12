import StudentReportUpdateAction from '@/app/dashboard/(roles)/student/reports/StudentReportUpdateAction';
import { Badge } from '@/components/ui/badge';
import { convertUTCToISTWithAMPM } from '@/lib/utils';
import StudentReport from '@/types/student-report';
import { ColumnDef } from '@tanstack/react-table';

type ColumnProps = {
  updateReport: (
    attendanceId: string,
    division: string,
    details: string,
    main_points: string
  ) => void;
};

const getStudentAttendanceColumns = ({
  updateReport,
}: ColumnProps): ColumnDef<StudentReport>[] => [
  {
    accessorKey: 'report_date',
    header: () => <span className="text-nowrap">Report Date</span>,
    cell: ({ row }) => (
      <div>
        {Intl.DateTimeFormat('en-IN').format(
          new Date(row.original.report_date) || '-'
        )}
      </div>
    ),
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
      const noInternship = row.original.has_internship === false;
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
      const noInternship = row.original.has_internship === false;
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
      return (
        <div className="flex gap-3 justify-end">
          {attendanceId && (
            <StudentReportUpdateAction
              updateReport={updateReport}
              studentReportData={row.original}
              attendanceId={attendanceId}
            />
          )}
        </div>
      );
    },
  },
];

export default getStudentAttendanceColumns;
