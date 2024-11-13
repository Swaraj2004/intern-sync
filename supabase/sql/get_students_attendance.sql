CREATE OR REPLACE FUNCTION get_students_attendance(
    institute_id uuid,
    attendance_date date,
    department_id uuid DEFAULT NULL,
    college_mentor_id uuid DEFAULT NULL
  ) RETURNS TABLE(
    student_uid uuid,
    user_name text,
    college_mentor_uid uuid,
    college_mentor_name text,
    department_uid uuid,
    department_name text,
    current_internship_id uuid,
    internship_start_date date,
    internship_end_date date,
    attendance_id uuid,
    attendance_status text,
    in_time time,
    out_time time,
    work_from_home boolean,
    is_holiday boolean
  ) LANGUAGE plpgsql AS $$ BEGIN RETURN QUERY
SELECT s.uid AS student_uid,
  u.name AS user_name,
  cm.uid AS college_mentor_uid,
  cmu.name AS college_mentor_name,
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
  LEFT JOIN college_mentors cm ON cm.uid = s.college_mentor_id
  LEFT JOIN users cmu ON cmu.id = cm.uid
  LEFT JOIN departments d ON d.uid = s.department_id
  LEFT JOIN internships i ON i.student_id = s.uid
  AND attendance_date BETWEEN i.start_date AND i.end_date
  LEFT JOIN attendance a ON a.student_id = s.uid
  AND a.date = attendance_date
WHERE s.institute_id = get_students_attendance.institute_id
  AND(
    get_students_attendance.department_id IS NULL
    OR s.department_id = get_students_attendance.department_id
  )
  AND(
    get_students_attendance.college_mentor_id IS NULL
    OR s.college_mentor_id = get_students_attendance.college_mentor_id
  );
END;
$$;