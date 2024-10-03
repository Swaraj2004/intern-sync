import AttendanceStatus from '@/components/ui/AttendanceStatus';
import { formatDateForInput } from '@/lib/utils';
import { checkHolidayForStudent } from '@/services/api';
import StudentInternship from '@/types/student-internship';
import { useEffect, useState } from 'react';

export const StatusCell = ({
  row,
  attendanceDate,
}: {
  row: any;
  attendanceDate: Date;
}) => {
  const [isHoliday, setIsHoliday] = useState<boolean>(false);
  const [hasNoInternship, setHasNoInternship] = useState<boolean>(false);

  useEffect(() => {
    async function fetchHolidayStatus() {
      const currentInternship = row.original.internships?.find(
        (internship: StudentInternship) =>
          new Date(internship.start_date) <= new Date(attendanceDate) &&
          new Date(internship.end_date) >= new Date(attendanceDate)
      );

      if (!currentInternship) {
        setHasNoInternship(true);
        return;
      }

      const dateString: string = formatDateForInput(attendanceDate);

      if (currentInternship) {
        setHasNoInternship(false);
        const holidayStatus = await checkHolidayForStudent(
          row.original.uid,
          currentInternship.id,
          dateString
        );
        setIsHoliday(holidayStatus || false);
      }
    }

    fetchHolidayStatus();
  }, [row, attendanceDate]);

  return (
    <AttendanceStatus
      status={row.original.attendance[0]?.status || null}
      noInternship={hasNoInternship}
      isHolidayForStudent={isHoliday}
    />
  );
};
