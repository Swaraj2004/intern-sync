CREATE TABLE parameters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL,
    role TEXT NOT NULL,
    score INTEGER NOT NULL,
    eval_id UUID REFERENCES evaluations(id) ON DELETE CASCADE
);