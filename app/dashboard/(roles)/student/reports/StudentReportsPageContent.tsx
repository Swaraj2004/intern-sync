'use client';

import StudentReportsTable from '@/app/dashboard/(roles)/student/reports/StudentReportsTable';
import { CalendarDatePicker } from '@/components/ui/calendar-date-picker';
import { useReportsDateRange } from '@/context/ReportsDateRangeContext';
import useMediaQuery from '@/hooks/useMediaQuery';

const ReportsPageContent = () => {
  const { reportsDateRange, setReportsDateRange } = useReportsDateRange();
  const isMobileScreen = useMediaQuery('(max-width: 500px)');

  return (
    <>
      <div className="flex justify-between items-center max-[500px]:flex-col max-[500px]:items-start gap-4 pb-5">
        <h1 className="font-semibold text-2xl">Reports</h1>
        <CalendarDatePicker
          date={reportsDateRange}
          onDateSelect={setReportsDateRange}
          variant="outline"
          align={isMobileScreen ? 'start' : 'end'}
        />
      </div>
      <StudentReportsTable />
    </>
  );
};

export default ReportsPageContent;
