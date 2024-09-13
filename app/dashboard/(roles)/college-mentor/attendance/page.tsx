'use client';

import AttendanceTable from '@/app/dashboard/(roles)/college-mentor/attendance/AttendanceTable';
import { Card } from '@/components/ui/card';
import DatePicker from '@/components/ui/DatePicker';
import DatePickerCard from '@/components/ui/DatePickerCard';
import { useState } from 'react';

const AttendancePage = () => {
  const [date, setDate] = useState(new Date());

  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-4 pb-5">
        <h1 className="font-semibold text-2xl">Daily Attendance</h1>
        <span className="min-[1360px]:hidden">
          <DatePicker date={date} setDate={setDate} />
        </span>
      </div>
      <div className="min-[1360px]:flex gap-5">
        <Card className="p-4 bg-card rounded-lg w-full h-fit">
          <AttendanceTable date={date} />
        </Card>
        <div className="hidden min-[1360px]:block">
          <DatePickerCard date={date} setDate={setDate} />
        </div>
      </div>
    </>
  );
};

export default AttendancePage;
