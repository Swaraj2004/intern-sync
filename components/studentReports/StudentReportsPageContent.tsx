'use client';

import StudentReportsTable from '@/components/studentReports/StudentReportsTable';
import { Button } from '@/components/ui/button';
import { CalendarDatePicker } from '@/components/ui/calendar-date-picker';
import { Card } from '@/components/ui/card';
import { useReportsDateRange } from '@/context/ReportsDateRangeContext';
import useMediaQuery from '@/hooks/useMediaQuery';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ReportsPageContent = () => {
  const router = useRouter();
  const { reportsDateRange, setReportsDateRange } = useReportsDateRange();
  const isMobileScreen = useMediaQuery('(max-width: 500px)');

  return (
    <>
      <div className="flex justify-between items-center max-[500px]:flex-col max-[500px]:items-start gap-4 pb-5">
        <h1 className="font-semibold text-2xl">Student Reports</h1>
        <span className="flex items-center gap-4">
          <CalendarDatePicker
            date={reportsDateRange}
            onDateSelect={setReportsDateRange}
            variant="outline"
            align={isMobileScreen ? 'start' : 'end'}
          />
          <Button size="icon-sm" onClick={() => router.back()}>
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </span>
      </div>
      <Card className="p-5">
        <StudentReportsTable />
      </Card>
    </>
  );
};

export default ReportsPageContent;
