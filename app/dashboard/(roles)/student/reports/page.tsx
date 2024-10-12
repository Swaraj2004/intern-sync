import StudentReportsPageContent from '@/app/dashboard/(roles)/student/reports/StudentReportsPageContent';
import { ReportsDateRangeProvider } from '@/context/ReportsDateRangeContext';

const StudentReportsPage = () => {
  return (
    <ReportsDateRangeProvider>
      <StudentReportsPageContent />
    </ReportsDateRangeProvider>
  );
};

export default StudentReportsPage;
