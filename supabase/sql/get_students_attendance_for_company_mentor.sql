CREATE OR REPLACE FUNCTION get_students_attendance_for_company_mentor(
    company_mentor_id UUID,
    attendance_date DATE
  ) RETURNS TABLE (
    student_uid UUID,
    user_name TEXT,
    company_mentor_uid UUID,
    company_mentor_name TEXT,
    department_uid UUID,
    department_name TEXT,
    current_internship_id UUID,
    internship_start_date DATE,
    internship_end_date DATE,
    attendance_id UUID,
    attendance_status TEXT,
    in_time TIME,
    out_time TIME,
    work_from_home BOOLEAN,
    is_holiday BOOLEAN
  ) LANGUAGE plpgsql AS $$ BEGIN RETURN QUERY
SELECT s.uid AS student_uid,
  u.name AS user_name,
  cm.uid AS company_mentor_uid,
  cmu.name AS company_mentor_name,
  d.uid AS department_uid,
  d.name AS department_name,
  i.id AS current_internship_id,
  i.start_date AS internship_start_date,
  i.end_date AS internship_end_date,
  a.id AS attendance_id,
  a.status AS attendance_status,
  a.in_time,
  a.out_time,
  a.work_from_home,
  check_holiday_for_student(s.uid, i.id, attendance_date) AS is_holiday
FROM students s
  LEFT JOIN users u ON s.uid = u.id
  LEFT JOIN departments d ON d.uid = s.department_id
  LEFT JOIN internships i ON i.student_id = s.uid
  AND attendance_date BETWEEN i.start_date AND i.end_date
  LEFT JOIN company_mentors cm ON cm.uid = i.company_mentor_id
  LEFT JOIN users cmu ON cmu.id = cm.uid
  LEFT JOIN attendance a ON a.student_id = s.uid
  AND a.date = attendance_date
WHERE cm.uid = get_students_attendance_for_company_mentor.company_mentor_id;
END;
$$;