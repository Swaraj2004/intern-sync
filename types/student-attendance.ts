type StudentAttendance = {
  student_uid: string;
  user_name: string;
  college_mentor_uid: string | null;
  college_mentor_name: string | null;
  department_uid: string | null;
  department_name: string | null;
  current_internship_id: string | null;
  internship_start_date: string | null;
  internship_end_date: string | null;
  attendance_id: string | null;
  attendance_status: string | null;
  in_time: string | null;
  out_time: string | null;
  work_from_home: boolean | null;
  is_holiday: boolean;
};

export default StudentAttendance;
