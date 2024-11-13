CREATE OR REPLACE FUNCTION get_students_reports(
    institute_id UUID,
    report_date DATE,
    department_id UUID DEFAULT NULL,
    college_mentor_id UUID DEFAULT NULL
  ) RETURNS TABLE (
    student_uid UUID,
    user_name TEXT,
    college_mentor_uid UUID,
    college_mentor_name TEXT,
    current_internship_id UUID,
    internship_start_date DATE,
    internship_end_date DATE,
    attendance_id UUID,
    attendance_status TEXT,
    attendance_date DATE,
    in_time TIME,
    out_time TIME,
    work_from_home BOOLEAN,
    report_division TEXT,
    report_details TEXT,
    report_main_points TEXT,
    report_feedback TEXT,
    report_status TEXT,
    is_holiday BOOLEAN
  ) LANGUAGE plpgsql AS $$ BEGIN RETURN QUERY
SELECT s.uid AS student_uid,
  u.name AS user_name,
  cm.uid AS college_mentor_uid,
  cmu.name AS college_mentor_name,
  i.id AS current_internship_id,
  i.start_date AS internship_start_date,
  i.end_date AS internship_end_date,
  a.id AS attendance_id,
  a.status AS attendance_status,
  a.date AS attendance_date,
  a.in_time,
  a.out_time,
  a.work_from_home,
  ir.division AS report_division,
  ir.details AS report_details,
  ir.main_points AS report_main_points,
  ir.feedback AS report_feedback,
  ir.status AS report_status,
  check_holiday_for_student(s.uid, i.id, report_date) AS is_holiday
FROM students s
  LEFT JOIN users u ON s.uid = u.id
  LEFT JOIN college_mentors cm ON cm.uid = s.college_mentor_id
  LEFT JOIN users cmu ON cmu.id = cm.uid
  LEFT JOIN internships i ON i.student_id = s.uid
  AND report_date BETWEEN i.start_date AND i.end_date
  LEFT JOIN attendance a ON a.student_id = s.uid
  AND a.date = report_date
  LEFT JOIN internship_reports ir ON ir.id = a.id
WHERE s.institute_id = get_students_reports.institute_id
  AND (
    get_students_reports.department_id IS NULL
    OR s.department_id = get_students_reports.department_id
  )
  AND (
    get_students_reports.college_mentor_id IS NULL
    OR s.college_mentor_id = get_students_reports.college_mentor_id
  );
END;
$$;