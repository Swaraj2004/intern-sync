'use client';

import AddInternshipCard from '@/app/dashboard/(roles)/student/AddInternshipCard';
import CompleteProfileCard from '@/app/dashboard/(roles)/student/CompleteProfileCard';
import MarkAttendanceCard from '@/app/dashboard/(roles)/student/MarkAttendanceCard';
import SubmitReportCard from '@/app/dashboard/(roles)/student/SubmitReportCard';
import UpcomingInternshipCard from '@/app/dashboard/(roles)/student/UpcomingInternshipCard';
import CurrentAttendanceChart from '@/components/ui/CurrentAttendanceChart';
import { Loader } from '@/components/ui/Loader';
import { useUser } from '@/context/UserContext';
import { convertUTCtoIST } from '@/lib/utils';
import {
  useMarkCheckInAndModeAttendance,
  useMarkCheckOutAttendance,
} from '@/services/mutations/attendance';
import { useAddDailyReport } from '@/services/mutations/reports';
import {
  useDailyReport,
  useInternshipAttendance,
  useStudentInternships,
  useStudentProfile,
} from '@/services/queries';
import { supabaseClient } from '@/utils/supabase/client';
import { useEffect, useMemo, useState } from 'react';

const supabase = supabaseClient();

async function getTotalWorkingDays(
  startDate: string,
  endDate: string,
  studentRegion: string
) {
  const { data, error } = await supabase.rpc('get_working_days', {
    start_date: startDate,
    end_date: endDate,
    region: studentRegion,
  });

  if (error) {
    console.error('Error fetching total working days:', error);
    return null;
  }

  return data;
}

async function getTotalPresentDays(studentId: string, internshipId: string) {
  const { data, error } = await supabase.rpc('get_total_present_days', {
    student_id: studentId,
    internship_id: internshipId,
  });

  if (error) {
    console.error('Error fetching total present days:', error);
    return null;
  }

  return data;
}

async function checkHolidayForStudent(
  studentId: string,
  internshipId: string,
  checkDate: string
) {
  const { data, error } = await supabase.rpc('check_holiday_for_student', {
    student_id: studentId,
    internship_id: internshipId,
    check_date: checkDate,
  });

  if (error) {
    console.error('Error checking holiday for student:', error);
    return null;
  }

  return data;
}

const StudentDashboardPage = () => {
  const { user } = useUser();
  const [totalWorkingDays, setTotalWorkingDays] = useState(0);
  const [totalPresentDays, setTotalPresentDays] = useState(0);
  const [isHoliday, setIsHoliday] = useState(false);

  const currentUTCDate = new Date().toISOString();
  const currentISTDate = useMemo(() => {
    return new Date(convertUTCtoIST(currentUTCDate));
  }, [currentUTCDate]);

  const { data: studentData } = useStudentProfile({
    userId: user?.user_metadata.uid,
  });

  const { data: studentInternships } = useStudentInternships({
    studentId: user?.user_metadata.uid,
  });

  const currentInternship = studentInternships?.find(
    (internship) =>
      new Date(internship.start_date) <= new Date() &&
      new Date(internship.end_date) >= new Date()
  );

  const { data: attendanceData } = useInternshipAttendance({
    internshipId: currentInternship?.id,
    attendanceDate: new Date().toISOString().split('T')[0],
  });

  const { data: reportData } = useDailyReport({
    attendanceId: attendanceData?.id,
    reportDate: new Date().toISOString().split('T')[0],
  });

  const { addDailyReport } = useAddDailyReport({
    attendanceId: attendanceData?.id || '',
    studentId: user?.user_metadata.uid || '',
    internshipId: currentInternship?.id || '',
  });

  const { markCheckInAndModeAttendance } = useMarkCheckInAndModeAttendance({
    attendanceId: attendanceData?.id || '',
    studentId: user?.user_metadata.uid || '',
    internshipId: currentInternship?.id || '',
    attendanceDate: new Date().toISOString().split('T')[0],
  });

  const { markCheckOutAttendance } = useMarkCheckOutAttendance({
    attendanceId: attendanceData?.id || '',
    studentId: user?.user_metadata.uid || '',
    internshipId: currentInternship?.id || '',
    attendanceDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (currentInternship && studentData) {
      const fetchAttendanceData = async () => {
        const internshipEndDate = new Date(currentInternship.end_date);

        const effectiveEndDate =
          currentISTDate < internshipEndDate
            ? currentISTDate
            : internshipEndDate;

        const workingDays = await getTotalWorkingDays(
          currentInternship.start_date,
          effectiveEndDate.toISOString().split('T')[0],
          currentInternship.region
        );
        const presentDays = await getTotalPresentDays(
          user?.user_metadata?.uid || '',
          currentInternship.id
        );

        setTotalWorkingDays(workingDays || 0);
        setTotalPresentDays(presentDays || 0);

        const isHoliday = await checkHolidayForStudent(
          user?.user_metadata?.uid || '',
          currentInternship.id,
          currentISTDate.toISOString().split('T')[0]
        );

        setIsHoliday(isHoliday || false);
      };

      fetchAttendanceData();
    }
  }, [currentInternship, studentData, user, currentISTDate]);

  const isProfileIncomplete =
    studentData &&
    (!studentData.dob ||
      !studentData.address ||
      !studentData.admission_year ||
      !studentData.division ||
      !studentData.roll_no ||
      !studentData.admission_id);

  const upcomingInternship = studentInternships?.find(
    (internship) => new Date(internship.start_date) > new Date()
  );

  if (!studentData) {
    return (
      <div className="h-60 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="pb-5">
        <h1 className="text-2xl font-semibold">
          Hello, {studentData?.users?.name} 👋
        </h1>
        <p className="text-gray-700 dark:text-gray-300 py-2">
          Welcome to your dashboard. Here you can view your internships, profile
          and more.
        </p>
      </div>
      {isProfileIncomplete && <CompleteProfileCard />}
      {studentInternships && studentInternships.length === 0 && (
        <AddInternshipCard />
      )}
      {upcomingInternship && studentInternships?.length === 1 && (
        <UpcomingInternshipCard internship={upcomingInternship} />
      )}
      {currentInternship && (
        <div className="grid md:grid-cols-[320px_auto] gap-5">
          <div className="flex gap-5 flex-wrap min-[690px]:flex-nowrap md:flex-wrap w-full">
            <MarkAttendanceCard
              attendance={attendanceData}
              internshipMode={currentInternship.mode}
              isHolidayToday={isHoliday}
              onCheckIn={markCheckInAndModeAttendance}
              onCheckOut={markCheckOutAttendance}
            />
            <div className="flex-grow min-[690px]:flex-grow-0 md:flex-grow">
              <CurrentAttendanceChart
                totalWorkingDays={totalWorkingDays}
                totalPresentDays={totalPresentDays}
              />
            </div>
          </div>
          <SubmitReportCard
            report={reportData}
            attendance={attendanceData}
            isHolidayToday={isHoliday}
            onSubmitReport={addDailyReport}
          />
        </div>
      )}
    </div>
  );
};

export default StudentDashboardPage;
