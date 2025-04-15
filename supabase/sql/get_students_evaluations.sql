CREATE OR REPLACE FUNCTION get_students_evaluations(mentor_eval_id UUID) RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE mentor_id UUID;
evaluation_id UUID;
BEGIN
SELECT me.college_mentor_id,
  me.eval_id INTO mentor_id,
  evaluation_id
FROM mentor_evaluations me
WHERE me.id = get_students_evaluations.mentor_eval_id;
RETURN (
  SELECT jsonb_agg(
      jsonb_build_object(
        'student_id',
        s.uid,
        'student_name',
        u.name,
        'responses',
        (
          SELECT jsonb_agg(
              jsonb_build_object(
                'parameter_id',
                p.id,
                'parameter_text',
                p.text,
                'value',
                er.value
              )
            )
          FROM parameters p
            LEFT JOIN evaluation_responses er ON er.parameter_id = p.id
            AND er.mentor_eval_id = get_students_evaluations.mentor_eval_id
            AND er.student_id = s.uid
            AND er.eval_id = evaluation_id
          WHERE p.eval_id = evaluation_id
        )
      )
    )
  FROM students s
    INNER JOIN users u ON u.id = s.uid
  WHERE s.college_mentor_id = mentor_id
);
END;
$$;