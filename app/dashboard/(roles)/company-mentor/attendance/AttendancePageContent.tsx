'use client';

import AttendanceTable from '@/app/dashboard/(roles)/company-mentor/attendance/AttendanceTable';
import DatePicker from '@/components/ui/DatePicker';
import { useAttendanceDate } from '@/context/AttendanceDateContext';

const AttendancePageContent = () => {
  const { attendanceDate, setAttendanceDate } = useAttendanceDate();

  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-4 pb-5">
        <h1 className="font-semibold text-2xl">Daily Attendance</h1>
        <span>
          <DatePicker date={attendanceDate} setDate={setAttendanceDate} />
        </span>
      </div>
      <AttendanceTable />
    </>
  );
};

export default AttendancePageContent;
