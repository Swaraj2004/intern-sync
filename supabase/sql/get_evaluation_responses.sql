CREATE OR REPLACE FUNCTION get_evaluation_responses(
    mentor_eval_id UUID,
    student_id UUID,
    role_filter TEXT DEFAULT NULL
  ) RETURNS TABLE (
    response_id UUID,
    value TEXT,
    parameter_id UUID,
    parameter_text TEXT,
    role TEXT
  ) LANGUAGE plpgsql AS $$
DECLARE evaluation_id UUID;
BEGIN
SELECT eval_id INTO evaluation_id
FROM mentor_evaluations
WHERE id = get_evaluation_responses.mentor_eval_id;
RETURN QUERY
SELECT er.id AS response_id,
  er.value,
  p.id AS parameter_id,
  p.text AS parameter_text,
  p.role
FROM parameters p
  LEFT JOIN evaluation_responses er ON p.id = er.parameter_id
  AND er.mentor_eval_id = get_evaluation_responses.mentor_eval_id
  AND er.student_id = get_evaluation_responses.student_id
WHERE p.eval_id = evaluation_id
  AND (
    role_filter IS NULL
    OR p.role = get_evaluation_responses.role_filter
  );
END;
$$;