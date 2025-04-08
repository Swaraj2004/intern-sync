CREATE OR REPLACE FUNCTION get_students_for_mentor_evaluation(mentor_eval_id UUID) RETURNS TABLE (
    uid UUID,
    name TEXT,
    email TEXT,
    roll_no TEXT
  ) AS $$ BEGIN RETURN QUERY
SELECT s.uid AS uid,
  u.name AS name,
  u.email AS email,
  s.roll_no AS roll_no
FROM students s
  JOIN users u ON u.id = s.uid
  JOIN mentor_evaluations me ON me.college_mentor_id = s.college_mentor_id
WHERE me.id = mentor_eval_id;
END;
$$ LANGUAGE plpgsql;