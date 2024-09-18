import AttendancePageContent from '@/app/dashboard/(roles)/department-coordinator/attendance/AttendancePageContent';
import { AttendanceDateProvider } from '@/context/AttendanceDateContext';

const AttendancePage = () => (
  <AttendanceDateProvider>
    <AttendancePageContent />
  </AttendanceDateProvider>
);

export default AttendancePage;
