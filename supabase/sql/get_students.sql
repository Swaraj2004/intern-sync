CREATE OR REPLACE FUNCTION get_students(
    institute_id uuid,
    department_id uuid DEFAULT NULL,
    college_mentor_id uuid DEFAULT NULL
  ) RETURNS TABLE (
    uid uuid,
    name text,
    email text,
    auth_id uuid,
    is_registered boolean,
    is_verified boolean,
    college_mentor_uid uuid,
    college_mentor_name text,
    company_mentor_uid uuid,
    company_mentor_name text,
    department_uid uuid,
    department_name text
  ) LANGUAGE plpgsql SECURITY INVOKER AS $$ BEGIN RETURN QUERY
SELECT s.uid,
  u2.name,
  u2.email,
  u2.auth_id,
  u2.is_registered,
  u2.is_verified,
  cm.uid AS college_mentor_uid,
  u1.name AS college_mentor_name,
  i.company_mentor_id AS company_mentor_uid,
  u3.name AS company_mentor_name,
  d.uid AS department_uid,
  d.name AS department_name
FROM students s
  LEFT JOIN college_mentors cm ON s.college_mentor_id = cm.uid
  LEFT JOIN users u1 ON cm.uid = u1.id
  LEFT JOIN users u2 ON s.uid = u2.id
  LEFT JOIN LATERAL (
    SELECT *
    FROM internships i2
    WHERE i2.student_id = s.uid
    ORDER BY i2.start_date DESC
    LIMIT 1
  ) i ON true
  LEFT JOIN company_mentors cm2 ON i.company_mentor_id = cm2.uid
  LEFT JOIN users u3 ON cm2.uid = u3.id
  LEFT JOIN departments d ON s.department_id = d.uid
WHERE s.institute_id = get_students.institute_id
  AND (
    s.department_id = get_students.department_id
    OR get_students.department_id IS NULL
  )
  AND (
    s.college_mentor_id = get_students.college_mentor_id
    OR get_students.college_mentor_id IS NULL
  )
ORDER BY s.created_at DESC;
END;
$$;