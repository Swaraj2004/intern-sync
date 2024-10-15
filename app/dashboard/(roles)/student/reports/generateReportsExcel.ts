import { convertUTCToISTWithAMPM } from '@/lib/utils';
import StudentReport from '@/types/student-report';
import xlsx from 'json-as-xlsx';
import { toast } from 'sonner';

const generateReportsExcel = (studentReports: StudentReport[]) => {
  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const data = [
    {
      sheet: 'Student Reports',
      columns: [
        {
          label: 'Day',
          value: (row: any) => getDayOfWeek(row.report_date),
        },
        { label: 'Date', value: 'report_date' },
        {
          label: 'In time',
          value: (row: any) =>
            row.is_holiday
              ? 'Holiday'
              : row.attendance_status === 'absent' || !row.attendance_status
              ? 'Absent'
              : row.attendance_status === 'pending'
              ? 'Unapproved'
              : row.in_time
              ? convertUTCToISTWithAMPM(row.in_time)
              : '-',
        },
        {
          label: 'Out time',
          value: (row: any) =>
            row.is_holiday
              ? 'Holiday'
              : row.attendance_status === 'absent' || !row.attendance_status
              ? 'Absent'
              : row.attendance_status === 'pending'
              ? 'Unapproved'
              : row.out_time
              ? convertUTCToISTWithAMPM(row.out_time)
              : '-',
        },
        {
          label: 'Dept / Division',
          value: (row: any) =>
            row.report_status === 'pending' || row.report_status === 'revision'
              ? 'Unapproved'
              : row.report_division || '-',
        },
        {
          label: 'Details of work assigned',
          value: (row: any) =>
            row.report_status === 'pending' || row.report_status === 'revision'
              ? 'Unapproved'
              : row.report_details || '-',
        },
        {
          label: 'Main points of the day',
          value: (row: any) =>
            row.report_status === 'pending' || row.report_status === 'revision'
              ? 'Unapproved'
              : row.report_main_points || '-',
        },
      ],
      content: studentReports.map((report) => ({
        report_date: report.report_date,
        attendance_status: report.attendance_status,
        report_status: report.report_status,
        in_time: report.in_time,
        out_time: report.out_time,
        is_holiday: report.is_holiday,
        report_division: report.report_division,
        report_details: report.report_details,
        report_main_points: report.report_main_points,
      })),
    },
  ];

  const settings = {
    fileName: 'student_report',
    extraLength: 3,
    writeMode: 'writeFile',
  };

  const showToast = () => {
    toast.success('Excel file downloaded successfully.');
  };

  xlsx(data, settings, showToast);
};

export default generateReportsExcel;
