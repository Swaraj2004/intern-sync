CREATE OR REPLACE FUNCTION get_students_for_evaluator(evaluator_id UUID) RETURNS TABLE (
    uid UUID,
    name TEXT,
    email TEXT,
    roll_no TEXT
  ) AS $$ BEGIN RETURN QUERY
SELECT s.uid AS uid,
  u.name AS name,
  u.email AS email,
  s.roll_no AS roll_no
FROM mentor_evaluations me
  JOIN college_mentors cm ON cm.uid = me.college_mentor_id
  JOIN students s ON s.college_mentor_id = cm.uid
  JOIN users u ON u.id = s.uid
WHERE me.evaluator_id = get_students_for_evaluator.evaluator_id;
END;
$$ LANGUAGE plpgsql;