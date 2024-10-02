'use client';

import AttendanceTable from '@/app/dashboard/(roles)/department-coordinator/attendance/AttendanceTable';
import { Card } from '@/components/ui/card';
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
      <Card className="p-4 bg-card rounded-lg w-full h-fit">
        <AttendanceTable date={attendanceDate} />
      </Card>
    </>
  );
};

export default AttendancePageContent;
