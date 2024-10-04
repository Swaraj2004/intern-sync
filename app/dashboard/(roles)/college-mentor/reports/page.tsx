import ReportsPageContent from '@/app/dashboard/(roles)/college-mentor/reports/ReportsPageContent';
import { ReportsDateProvider } from '@/context/ReportsDateContext';

const ReportsPage = () => (
  <ReportsDateProvider>
    <ReportsPageContent />
  </ReportsDateProvider>
);

export default ReportsPage;
