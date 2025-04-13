CREATE OR REPLACE FUNCTION insert_evaluation_responses(
    mentor_eval_id UUID,
    student_id UUID,
    response_data JSONB
  ) RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE evaluation_id UUID;
param_id UUID;
param_value TEXT;
BEGIN
SELECT eval_id INTO evaluation_id
FROM mentor_evaluations
WHERE id = insert_evaluation_responses.mentor_eval_id;
-- Loop through the response_data JSONB
FOR param_id,
param_value IN
SELECT key::UUID,
  value::TEXT
FROM jsonb_each_text(insert_evaluation_responses.response_data) LOOP
INSERT INTO evaluation_responses (
    value,
    parameter_id,
    eval_id,
    mentor_eval_id,
    student_id
  )
VALUES (
    param_value,
    param_id,
    evaluation_id,
    insert_evaluation_responses.mentor_eval_id,
    insert_evaluation_responses.student_id
  );
END LOOP;
RETURN 'Responses submitted successfully.';
END;
$$;