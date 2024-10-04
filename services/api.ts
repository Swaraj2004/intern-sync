import { supabaseClient } from '@/utils/supabase/client';

const supabase = supabaseClient();

export async function checkHolidayForStudent(
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

export async function getTotalWorkingDays(
  startDate: string,
  endDate: string,
  internshipId: string,
  studentRegion: string
) {
  const { data, error } = await supabase.rpc('get_total_working_days', {
    start_date: startDate,
    end_date: endDate,
    internship_id: internshipId,
    region: studentRegion,
  });

  if (error) {
    console.error('Error fetching total working days:', error);
    return null;
  }

  return data;
}

export async function getTotalPresentDays(
  studentId: string,
  internshipId: string
) {
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
