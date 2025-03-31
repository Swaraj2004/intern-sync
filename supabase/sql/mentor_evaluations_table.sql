CREATE TABLE mentor_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eval_toggle BOOLEAN NOT NULL,
    college_mentor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    evaluator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    eval_id UUID REFERENCES evaluations(id) ON DELETE CASCADE
);