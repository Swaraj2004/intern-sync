import StudentAttendanceActions from '@/components/attendance/StudentAttendanceActions';
import StudentAttendanceApprovalActions from '@/components/attendance/StudentAttendanceApprovalActions';
import StudentReportApprovalActions from '@/components/reports/StudentReportApprovalActions';
import { AttendanceStatusCell } from '@/components/ui/AttendanceStatusCell';
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
  reportDate: Date;
};

const getStudentAttendanceColumns = ({
  approveReport,
  reportDate,
}: ColumnProps): ColumnDef<StudentReport>[] => [
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
    header: () => <span className="text-nowrap">In Time</span>,
    cell: ({ row }) => (
      <div className="text-nowrap">
        {row.original.attendance[0]?.in_time
          ? convertUTCToISTWithAMPM(row.original.attendance[0]?.in_time)
          : '-'}
      </div>
    ),
  },
  {
    id: 'attendance.out_time',
    header: () => <span className="text-nowrap">Out Time</span>,
    cell: ({ row }) => (
      <div className="text-nowrap">
        {row.original.attendance[0]?.out_time
          ? convertUTCToISTWithAMPM(row.original.attendance[0]?.out_time)
          : '-'}
      </div>
    ),
  },
  {
    id: 'attendance.status',
    header: () => <span className="text-nowrap">Attendance Status</span>,
    cell: ({ row }) => (
      <AttendanceStatusCell row={row} attendanceDate={reportDate} />
    ),
  },
  {
    id: 'status',
    header: () => <span className="text-nowrap">Report Status</span>,
    cell: ({ row }) => {
      const attendance = row.original.attendance[0];
      return attendance && attendance.internship_reports?.status ? (
        <>
          {attendance.internship_reports?.status === 'approved' && (
            <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-300 dark:hover:bg-green-400">
              Approved
            </Badge>
          )}
          {attendance.internship_reports?.status === 'revision' && (
            <Badge className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-300 dark:hover:bg-orange-400">
              Revision
            </Badge>
          )}
          {attendance.internship_reports?.status === 'pending' && (
            <Badge className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-300 dark:hover:bg-yellow-400 text-nowrap">
              Pending Approval
            </Badge>
          )}
        </>
      ) : (
        <Badge className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-300 dark:hover:bg-gray-400 text-nowrap">
          Not Submitted
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const attendance = row.original.attendance[0];
      const attendanceId = attendance?.id;
      const studentId = row.original.uid;
      return (
        attendance && (
          <StudentReportApprovalActions
            approveReport={approveReport}
            internshipReport={attendance.internship_reports}
            studentId={studentId}
            attendanceId={attendanceId}
          />
        )
      );
    },
  },
];

export default getStudentAttendanceColumns;
