import StudentReportsPageContent from '@/components/studentReports/StudentReportsPageContent';
import { ReportsDateRangeProvider } from '@/context/ReportsDateRangeContext';

const StudentReportsPage = () => {
  return (
    <ReportsDateRangeProvider>
      <StudentReportsPageContent />
    </ReportsDateRangeProvider>
  );
};

export default StudentReportsPage;
