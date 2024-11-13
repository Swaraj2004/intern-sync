CREATE OR REPLACE FUNCTION get_student_reports(
    student_id uuid,
    from_date timestamp without time zone,
    to_date timestamp without time zone
  ) RETURNS TABLE(
    report_date date,
    user_name text,
    college_mentor_uid uuid,
    college_mentor_name text,
    has_internship boolean,
    attendance_id uuid,
    attendance_status text,
    in_time time,
    out_time time,
    work_from_home boolean,
    report_division text,
    report_details text,
    report_main_points text,
    report_feedback text,
    report_status text,
    is_holiday boolean
  ) LANGUAGE plpgsql AS $$ BEGIN RETURN QUERY
SELECT g.report_date::date,
  u.name AS user_name,
  cm.uid AS college_mentor_uid,
  cmu.name AS college_mentor_name,
  (i.id IS NOT NULL) AS has_internship,
  a.id AS attendance_id,
  a.status AS attendance_status,
  a.in_time,
  a.out_time,
  a.work_from_home,
  ir.division AS report_division,
  ir.details AS report_details,
  ir.main_points AS report_main_points,
  ir.feedback AS report_feedback,
  ir.status AS report_status,
  check_holiday_for_student(s.uid, i.id, g.report_date::date) AS is_holiday -- Pass as timestamp without time zone
FROM generate_series(from_date, to_date, '1 day'::interval) AS g(report_date)
  LEFT JOIN students s ON s.uid = student_id
  LEFT JOIN users u ON s.uid = u.id
  LEFT JOIN college_mentors cm ON cm.uid = s.college_mentor_id
  LEFT JOIN users cmu ON cmu.id = cm.uid
  LEFT JOIN internships i ON i.student_id = s.uid
  AND g.report_date BETWEEN i.start_date AND i.end_date
  LEFT JOIN attendance a ON a.student_id = s.uid
  AND a.date = g.report_date
  LEFT JOIN internship_reports ir ON ir.id = a.id;
END;
$$;