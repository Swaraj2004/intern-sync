'use client';

import AttendanceTable from '@/app/dashboard/(roles)/college-mentor/attendance/AttendanceTable';
import { Card } from '@/components/ui/card';
import DatePicker from '@/components/ui/DatePicker';
import DatePickerCard from '@/components/ui/DatePickerCard';
import { useAttendanceDate } from '@/context/AttendanceDateContext';

const AttendancePageContent = () => {
  const { attendanceDate, setAttendanceDate } = useAttendanceDate();

  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-4 pb-5">
        <h1 className="font-semibold text-2xl">Daily Attendance</h1>
        <span className="min-[1360px]:hidden">
          <DatePicker date={attendanceDate} setDate={setAttendanceDate} />
        </span>
      </div>
      <div className="min-[1360px]:flex gap-5">
        <Card className="p-4 bg-card rounded-lg w-full h-fit">
          <AttendanceTable date={attendanceDate} />
        </Card>
        <div className="hidden min-[1360px]:block">
          <DatePickerCard date={attendanceDate} setDate={setAttendanceDate} />
        </div>
      </div>
    </>
  );
};

export default AttendancePageContent;
