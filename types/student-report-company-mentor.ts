type StudentReportForCompanyMentor = {
  student_uid: string;
  user_name: string;
  company_mentor_uid: string | null;
  company_mentor_name: string | null;
  current_internship_id: string | null;
  internship_start_date: string | null;
  internship_end_date: string | null;
  attendance_id: string | null;
  attendance_status: string | null;
  attendance_date: string | null;
  in_time: string | null;
  out_time: string | null;
  work_from_home: boolean | null;
  report_division: string | null;
  report_details: string | null;
  report_main_points: string | null;
  report_feedback: string | null;
  report_status: string | null;
  is_holiday: boolean;
};

export default StudentReportForCompanyMentor;
