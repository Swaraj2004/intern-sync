import StudentReportApprovalAction from '@/components/reports/StudentReportApprovalAction';
import AttendanceStatus from '@/components/ui/AttendanceStatus';
import ReportStatus from '@/components/ui/ReportStatus';
import { convertUTCToISTWithAMPM } from '@/lib/utils';
import StudentReport from '@/types/student-report';
import { ColumnDef } from '@tanstack/react-table';

type ColumnProps = {
  approveReport: (
    actionType: 'approved' | 'revision',
    attendanceId: string,
    feedback: string
  ) => void;
};

const getStudentAttendanceColumns = ({
  approveReport,
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
      const noInternship = row.original.has_internship === false;
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
      const attendanceId = row.original.attendance_id;
      return (
        <div className="flex gap-3 justify-end">
          {attendanceId && (
            <StudentReportApprovalAction
              approveStudentReport={approveReport}
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
