CREATE OR REPLACE FUNCTION get_mentor_evaluations(mentor_id UUID) RETURNS TABLE (
    evaluation_id UUID,
    evaluation_name TEXT,
    evaluation_date DATE,
    mentor_evaluation_id UUID,
    eval_toggle BOOLEAN,
    evaluator_id UUID,
    evaluator_name TEXT
  ) AS $$ BEGIN RETURN QUERY
SELECT e.id AS evaluation_id,
  e.name AS evaluation_name,
  e.date AS evaluation_date,
  me.id AS mentor_evaluation_id,
  me.eval_toggle AS eval_toggle,
  me.evaluator_id AS evaluator_id,
  u.name AS evaluator_name
FROM Evaluations e
  LEFT JOIN Mentor_evaluations me ON e.id = me.eval_id
  AND me.college_mentor_id = mentor_id
  LEFT JOIN users u ON me.evaluator_id = u.id
  LEFT JOIN Departments d ON e.department_id = d.uid
WHERE d.uid = (
    SELECT department_id
    FROM college_mentors
    WHERE uid = mentor_id
  );
END;
$$ LANGUAGE plpgsql;