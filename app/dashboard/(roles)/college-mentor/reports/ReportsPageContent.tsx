'use client';

import ReportsTable from '@/app/dashboard/(roles)/college-mentor/reports/ReportsTable';
import DatePicker from '@/components/ui/DatePicker';
import { useReportsDate } from '@/context/ReportsDateContext';

const ReportsPageContent = () => {
  const { reportsDate, setReportsDate } = useReportsDate();

  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-4 pb-5">
        <h1 className="font-semibold text-2xl">Daily Reports</h1>
        <span>
          <DatePicker date={reportsDate} setDate={setReportsDate} />
        </span>
      </div>
      <ReportsTable />
    </>
  );
};

export default ReportsPageContent;
