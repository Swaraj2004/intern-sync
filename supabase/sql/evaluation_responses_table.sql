CREATE TABLE evaluation_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value TEXT NOT NULL,
    parameter_id UUID REFERENCES parameters(id) ON DELETE CASCADE,
    eval_id UUID REFERENCES evaluations(id) ON DELETE CASCADE,
    mentor_eval_id UUID REFERENCES mentor_evaluations(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE
);